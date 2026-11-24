// Enveloppe de la base locale : seul fichier du client à appeler l'API IndexedDB du navigateur ; ouvre la base, applique les migrations et offre lecture, écriture et transactions.
import {
  CODES_D_ERREUR,
  creerErreurDeStockage,
  extraireCle,
  estCleValide,
  migrationsAAppliquer,
  simulerSchema,
  validerMigrations,
  verifierRequete,
} from './regles.js';
import { MIGRATIONS, NOM_BASE } from './migrations.js';

export const ATTENTE_BLOCAGE_MS = 5000;

const erreur = creerErreurDeStockage;

// Une erreur déjà prévue (code connu) passe telle quelle ; une erreur du navigateur est traduite par son nom.
function traduireErreur(brute) {
  if (brute && typeof brute.code === 'string' && brute.message === brute.code && CODES_D_ERREUR.includes(brute.code)) {
    return brute;
  }
  switch (brute && brute.name) {
    case 'QuotaExceededError':
      return erreur('quota_depasse');
    case 'DataCloneError':
      return erreur('valeur_non_clonable');
    case 'TransactionInactiveError':
      return erreur('transaction_inactive');
    case 'NotFoundError':
      return erreur('magasin_inconnu');
    case 'InvalidStateError':
      return erreur('base_fermee');
    case 'DataError':
      return erreur('cle_invalide');
    case 'ReadOnlyError':
      return erreur('transaction_en_lecture');
    default:
      return erreur('transaction_echouee');
  }
}

function attendre(requete) {
  return new Promise((resolve, reject) => {
    requete.onsuccess = () => resolve(requete.result);
    requete.onerror = () => reject(traduireErreur(requete.error));
  });
}

function intervalle(requete) {
  if (requete.depuis !== null && requete.jusqua !== null) return IDBKeyRange.bound(requete.depuis, requete.jusqua);
  if (requete.depuis !== null) return IDBKeyRange.lowerBound(requete.depuis);
  if (requete.jusqua !== null) return IDBKeyRange.upperBound(requete.jusqua);
  return undefined;
}

function verifierCle(cle) {
  if (!estCleValide(cle)) throw erreur('cle_invalide');
}

function construireBase({ db, migrations }) {
  const schema = simulerSchema(migrations);
  const evenements = new EventTarget();
  let ferme = false;

  // Un autre onglet demande une version plus récente : on lâche la base pour ne pas le bloquer.
  db.onversionchange = () => {
    if (ferme) return;
    ferme = true;
    db.close();
    evenements.dispatchEvent(new Event('base-perimee'));
  };
  db.onclose = () => {
    ferme = true;
  };

  // Règle du travail : dans `travail`, n'attends que les opérations de `t`. Attendre autre chose
  // (réseau, minuterie, autre base) laisse le navigateur clore la transaction : ce qui a été écrit avant
  // est enregistré, et l'opération suivante rejette `transaction_inactive`. Lis ce qu'il faut avant la
  // transaction, calcule dedans sans rien attendre d'autre.
  function transaction(magasins, mode, travail) {
    return new Promise((resolve, reject) => {
      if (ferme) return reject(erreur('base_fermee'));
      if (
        !Array.isArray(magasins) ||
        magasins.length === 0 ||
        magasins.some((nom) => typeof nom !== 'string' || !Object.hasOwn(schema.magasins, nom))
      ) {
        return reject(erreur('magasin_inconnu'));
      }
      if (mode !== 'lecture' && mode !== 'ecriture') return reject(erreur('transaction_echouee'));
      if (typeof travail !== 'function') return reject(erreur('requete_invalide'));

      let tx;
      try {
        tx = db.transaction(magasins, mode === 'ecriture' ? 'readwrite' : 'readonly');
      } catch (brute) {
        return reject(traduireErreur(brute));
      }

      const etat = { fini: false, imposee: null };
      let reglee = false;
      let txTerminee = false;
      let travailFini = false;
      let travailEchoue = false;
      let erreurTravail;
      let resultat;
      const regler = (suite, valeur) => {
        if (reglee) return;
        reglee = true;
        suite(valeur);
      };
      const conclure = () => {
        if (!txTerminee || !travailFini) return;
        if (travailEchoue) regler(reject, etat.imposee || erreurTravail);
        else regler(resolve, resultat);
      };
      // Erreur qui annule la transaction, même si `travail` l'attrape.
      const annuler = (e) => {
        if (!etat.imposee) etat.imposee = e;
        try {
          tx.abort();
        } catch (ignoree) {
          // déjà terminée
        }
        return e;
      };

      tx.oncomplete = () => {
        etat.fini = true;
        txTerminee = true;
        conclure();
      };
      tx.onabort = () => {
        etat.fini = true;
        regler(reject, etat.imposee || (travailEchoue ? erreurTravail : traduireErreur(tx.error)));
      };

      async function executer(nomMagasin, ecrit, action) {
        try {
          if (etat.fini) throw erreur('transaction_inactive');
          if (!Object.hasOwn(schema.magasins, nomMagasin)) throw erreur('magasin_inconnu');
          if (!magasins.includes(nomMagasin)) throw annuler(erreur('magasin_hors_transaction'));
          if (ecrit && mode !== 'ecriture') throw annuler(erreur('transaction_en_lecture'));
          return await action(tx.objectStore(nomMagasin), schema.magasins[nomMagasin]);
        } catch (brute) {
          const prevue = traduireErreur(brute);
          // Une erreur du navigateur sur une transaction finie vient de cette fin, pas d'une autre cause.
          if (etat.fini && prevue.code === 'transaction_echouee') throw erreur('transaction_inactive');
          throw prevue;
        }
      }

      const t = {
        lire: (nom, cle) =>
          executer(nom, false, async (magasin) => {
            verifierCle(cle);
            return (await attendre(magasin.get(cle))) ?? null;
          }),
        lireTout: (nom, requete) =>
          executer(nom, false, (magasin, definition) => {
            const normalisee = verifierRequete(requete, definition);
            const source = normalisee.index ? magasin.index(normalisee.index) : magasin;
            return attendre(source.getAll(intervalle(normalisee), normalisee.limite ?? undefined));
          }),
        compter: (nom, requete) =>
          executer(nom, false, (magasin, definition) => {
            const normalisee = verifierRequete(requete, definition);
            const source = normalisee.index ? magasin.index(normalisee.index) : magasin;
            return attendre(source.count(intervalle(normalisee)));
          }),
        ecrire: (nom, valeur) =>
          executer(nom, true, (magasin, definition) => {
            extraireCle(valeur, definition.cle);
            return attendre(magasin.put(valeur));
          }),
        supprimer: (nom, cle) =>
          executer(nom, true, async (magasin) => {
            verifierCle(cle);
            await attendre(magasin.delete(cle));
          }),
        vider: (nom) =>
          executer(nom, true, async (magasin) => {
            await attendre(magasin.clear());
          }),
      };

      new Promise((suite) => suite(travail(t))).then(
        (valeur) => {
          resultat = valeur;
          travailFini = true;
          conclure();
        },
        (e) => {
          travailEchoue = true;
          erreurTravail = e;
          travailFini = true;
          try {
            tx.abort();
          } catch (ignoree) {
            // déjà terminée : ce qui était écrit est gardé
          }
          conclure();
        }
      );
    });
  }

  const uneOperation = (nom, mode, action) => transaction([nom], mode, (t) => action(t));

  function tableau(valeurs) {
    if (!Array.isArray(valeurs)) throw erreur('requete_invalide');
    return valeurs;
  }

  return {
    version: schema.version,
    schema,
    evenements,
    lire: (nom, cle) => uneOperation(nom, 'lecture', (t) => t.lire(nom, cle)),
    lireTout: (nom, requete) => uneOperation(nom, 'lecture', (t) => t.lireTout(nom, requete)),
    compter: (nom, requete) => uneOperation(nom, 'lecture', (t) => t.compter(nom, requete)),
    ecrire: (nom, valeur) => uneOperation(nom, 'ecriture', (t) => t.ecrire(nom, valeur)),
    ecrirePlusieurs: (nom, valeurs) =>
      uneOperation(nom, 'ecriture', (t) => Promise.all(tableau(valeurs).map((valeur) => t.ecrire(nom, valeur)))),
    supprimer: (nom, cle) => uneOperation(nom, 'ecriture', (t) => t.supprimer(nom, cle)),
    supprimerPlusieurs: (nom, cles) =>
      uneOperation(nom, 'ecriture', async (t) => {
        await Promise.all(tableau(cles).map((cle) => t.supprimer(nom, cle)));
      }),
    vider: (nom) => uneOperation(nom, 'ecriture', (t) => t.vider(nom)),
    transaction,
    fermer() {
      ferme = true;
      db.close();
      return Promise.resolve();
    },
  };
}

// fabrique : l'objet IndexedDB ; par défaut celui du navigateur.
export function ouvrirBase({ nom, migrations, fabrique } = {}) {
  return new Promise((resolve, reject) => {
    if (validerMigrations(migrations).length > 0) return reject(erreur('migration_invalide'));
    let usine = fabrique;
    if (usine === undefined) {
      try {
        usine = globalThis.indexedDB;
      } catch (ignoree) {
        usine = undefined;
      }
    }
    if (!usine) return reject(erreur('stockage_indisponible'));
    if (typeof nom !== 'string' || nom === '') return reject(erreur('requete_invalide'));

    let requete;
    try {
      requete = usine.open(nom, migrations.length);
    } catch (brute) {
      return reject(erreur('stockage_indisponible'));
    }

    let reglee = false;
    let abandonnee = false; // `base_bloquee` déjà rendu : la suite ne change plus rien
    let miseANiveauCommencee = false;
    let migrationEchouee = false;
    let minuterie = null;
    const arreterLAttente = () => {
      if (minuterie !== null) clearTimeout(minuterie);
      minuterie = null;
    };

    requete.onblocked = () => {
      if (minuterie !== null || reglee) return;
      minuterie = setTimeout(() => {
        minuterie = null;
        if (reglee) return;
        reglee = true;
        abandonnee = true;
        reject(erreur('base_bloquee'));
      }, ATTENTE_BLOCAGE_MS);
    };

    requete.onupgradeneeded = (evenement) => {
      arreterLAttente();
      const transactionDeMiseANiveau = requete.transaction;
      if (abandonnee) {
        try {
          transactionDeMiseANiveau.abort();
        } catch (ignoree) {
          // rien à annuler
        }
        return;
      }
      miseANiveauCommencee = true;
      const db = requete.result;
      try {
        for (const migration of migrationsAAppliquer(migrations, evenement.oldVersion)) {
          for (const etape of migration.etapes) {
            const cle = Array.isArray(etape.cle) ? [...etape.cle] : etape.cle;
            if (etape.etape === 'creerMagasin') {
              db.createObjectStore(etape.magasin, { keyPath: cle });
            } else {
              transactionDeMiseANiveau.objectStore(etape.magasin).createIndex(etape.index, cle, { unique: etape.unique });
            }
          }
        }
      } catch (brute) {
        migrationEchouee = true;
        try {
          transactionDeMiseANiveau.abort();
        } catch (ignoree) {
          // déjà annulée
        }
      }
    };

    requete.onsuccess = () => {
      arreterLAttente();
      const db = requete.result;
      if (reglee) {
        db.close();
        return;
      }
      reglee = true;
      try {
        resolve(construireBase({ db, migrations }));
      } catch (brute) {
        db.close();
        reject(traduireErreur(brute));
      }
    };

    requete.onerror = (evenement) => {
      arreterLAttente();
      if (evenement && evenement.preventDefault) evenement.preventDefault();
      if (reglee) return;
      reglee = true;
      const brute = requete.error;
      if (migrationEchouee || miseANiveauCommencee) reject(erreur('migration_echouee'));
      else if (brute && brute.name === 'VersionError') reject(erreur('version_plus_recente'));
      else reject(erreur('stockage_indisponible'));
    };
  });
}

let ouvertureDuJeu = null;

// La base de l'appli, ouverte une seule fois. Un échec n'arrête pas le jeu : l'appelant garde ses données en mémoire.
// Si l'ouverture rejette, l'appel suivant réessaie.
export function ouvrirBaseDuJeu() {
  if (ouvertureDuJeu === null) {
    const ouverture = ouvrirBase({ nom: NOM_BASE, migrations: MIGRATIONS });
    ouvertureDuJeu = ouverture;
    ouverture.catch(() => {
      if (ouvertureDuJeu === ouverture) ouvertureDuJeu = null;
    });
  }
  return ouvertureDuJeu;
}
