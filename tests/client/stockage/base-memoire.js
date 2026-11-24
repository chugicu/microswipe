// Base en mémoire de même interface que la vraie base (client/stockage/base-locale.js), pour tester le stockage des lots dans Node ; jamais importée par client/.
import {
  comparerCles,
  creerErreurDeStockage,
  estCleValide,
  extraireCle,
  migrationsAAppliquer,
  simulerSchema,
  validerMigrations,
  verifierRequete,
} from '../../../client/stockage/regles.js';

const erreur = creerErreurDeStockage;

// Texte propre à chaque clé, pour ranger les enregistrements dans une Map.
function cleEnTexte(cle) {
  if (typeof cle === 'number') return `n${cle}`;
  if (cle instanceof Date) return `d${cle.getTime()}`;
  if (typeof cle === 'string') return `s${JSON.stringify(cle)}`;
  return `a[${cle.map(cleEnTexte).join(',')}]`;
}

function aDesDoublons(cles) {
  const tries = [...cles].sort(comparerCles);
  return tries.some((cle, i) => i > 0 && comparerCles(tries[i - 1], cle) === 0);
}

function cleDIndex(enregistrement, definition) {
  try {
    return extraireCle(enregistrement.valeur, definition.cle);
  } catch (ignoree) {
    return null; // comme le navigateur : un enregistrement sans clé d'index valide n'est pas dans l'index
  }
}

// Les enregistrements correspondant à la requête, dans l'ordre de la clé (ou de l'index, puis de la clé).
function selectionner(magasin, definition, requete) {
  const lignes = [];
  for (const enregistrement of magasin.values()) {
    if (requete.index) {
      const ordre = cleDIndex(enregistrement, definition.index[requete.index]);
      if (ordre !== null) lignes.push({ ordre, enregistrement });
    } else {
      lignes.push({ ordre: enregistrement.cle, enregistrement });
    }
  }
  lignes.sort((a, b) => comparerCles(a.ordre, b.ordre) || comparerCles(a.enregistrement.cle, b.enregistrement.cle));
  return lignes
    .filter(({ ordre }) => requete.depuis === null || comparerCles(ordre, requete.depuis) >= 0)
    .filter(({ ordre }) => requete.jusqua === null || comparerCles(ordre, requete.jusqua) <= 0)
    .map(({ enregistrement }) => enregistrement);
}

function donneesDe(etat, nom) {
  if (!etat.magasins.has(nom)) etat.magasins.set(nom, new Map());
  return etat.magasins.get(nom);
}

// Applique les migrations manquantes à l'état partagé, ou rejette comme ouvrirBase.
function mettreAJour(etat, migrations) {
  if (validerMigrations(migrations).length > 0) throw erreur('migration_invalide');
  if (etat.version > migrations.length) throw erreur('version_plus_recente');
  const schema = simulerSchema(migrations);
  const aAppliquer = migrationsAAppliquer(migrations, etat.version);
  // Un index unique sur des données qui ont déjà un doublon fait échouer la mise à niveau, sans rien changer.
  for (const migration of aAppliquer) {
    for (const etape of migration.etapes) {
      if (etape.etape !== 'creerIndex' || !etape.unique) continue;
      const definition = schema.magasins[etape.magasin].index[etape.index];
      const cles = [...donneesDe(etat, etape.magasin).values()]
        .map((enregistrement) => cleDIndex(enregistrement, definition))
        .filter((cle) => cle !== null);
      if (aDesDoublons(cles)) throw erreur('migration_echouee');
    }
  }
  for (const migration of aAppliquer) {
    for (const etape of migration.etapes) {
      if (etape.etape === 'creerMagasin') donneesDe(etat, etape.magasin);
    }
  }
  etat.version = migrations.length;
  return schema;
}

function construireBase(etat, migrations, schema) {
  const evenements = new EventTarget();
  let ferme = false;
  let file = Promise.resolve();

  function transaction(magasins, mode, travail) {
    if (ferme) return Promise.reject(erreur('base_fermee'));
    if (
      !Array.isArray(magasins) ||
      magasins.length === 0 ||
      magasins.some((nom) => typeof nom !== 'string' || !Object.hasOwn(schema.magasins, nom))
    ) {
      return Promise.reject(erreur('magasin_inconnu'));
    }
    if (mode !== 'lecture' && mode !== 'ecriture') return Promise.reject(erreur('transaction_echouee'));
    if (typeof travail !== 'function') return Promise.reject(erreur('requete_invalide'));

    // Les transactions passent l'une après l'autre ; chacune travaille sur une copie de ses magasins.
    const suite = file.then(async () => {
      const copies = new Map(magasins.map((nom) => [nom, new Map(donneesDe(etat, nom))]));
      const tx = { fini: false, imposee: null };
      const annuler = (e) => {
        if (!tx.imposee) tx.imposee = e;
        return e;
      };

      async function operation(nom, ecrit, action) {
        if (tx.fini) throw erreur('transaction_inactive');
        if (!Object.hasOwn(schema.magasins, nom)) throw erreur('magasin_inconnu');
        if (!copies.has(nom)) throw annuler(erreur('magasin_hors_transaction'));
        if (ecrit && mode !== 'ecriture') throw annuler(erreur('transaction_en_lecture'));
        return action(copies.get(nom), schema.magasins[nom]);
      }

      const t = {
        lire: (nom, cle) =>
          operation(nom, false, (magasin) => {
            if (!estCleValide(cle)) throw erreur('cle_invalide');
            const trouve = magasin.get(cleEnTexte(cle));
            return trouve ? structuredClone(trouve.valeur) : null;
          }),
        lireTout: (nom, requete) =>
          operation(nom, false, (magasin, definition) => {
            const normalisee = verifierRequete(requete, definition);
            const lignes = selectionner(magasin, definition, normalisee);
            const gardees = normalisee.limite === null ? lignes : lignes.slice(0, normalisee.limite);
            return gardees.map((enregistrement) => structuredClone(enregistrement.valeur));
          }),
        compter: (nom, requete) =>
          operation(nom, false, (magasin, definition) =>
            selectionner(magasin, definition, verifierRequete(requete, definition)).length
          ),
        ecrire: (nom, valeur) =>
          operation(nom, true, (magasin, definition) => {
            const cle = extraireCle(valeur, definition.cle);
            let copie;
            try {
              copie = structuredClone(valeur);
            } catch (ignoree) {
              throw erreur('valeur_non_clonable');
            }
            const texte = cleEnTexte(cle);
            const nouveau = { cle, valeur: copie };
            for (const [nomIndex, index] of Object.entries(definition.index)) {
              if (!index.unique) continue;
              const cleIndex = cleDIndex(nouveau, index);
              if (cleIndex === null) continue;
              for (const [texteAutre, autre] of magasin) {
                if (texteAutre === texte) continue;
                const cleAutre = cleDIndex(autre, index);
                if (cleAutre !== null && comparerCles(cleAutre, cleIndex) === 0) {
                  throw annuler(erreur('transaction_echouee')); // contrainte d'unicité de l'index nomIndex
                }
              }
            }
            magasin.set(texte, nouveau);
            return cle;
          }),
        supprimer: (nom, cle) =>
          operation(nom, true, (magasin) => {
            if (!estCleValide(cle)) throw erreur('cle_invalide');
            magasin.delete(cleEnTexte(cle));
          }),
        vider: (nom) =>
          operation(nom, true, (magasin) => {
            magasin.clear();
          }),
      };

      let resultat;
      try {
        resultat = await travail(t);
      } catch (e) {
        tx.fini = true;
        throw tx.imposee || e;
      }
      tx.fini = true;
      if (tx.imposee) throw tx.imposee;
      if (mode === 'ecriture') {
        for (const [nom, copie] of copies) etat.magasins.set(nom, copie);
      }
      return resultat;
    });
    file = suite.catch(() => {});
    return suite;
  }

  const unique = (nom, mode, action) => transaction([nom], mode, action);
  const tableau = (valeurs) => {
    if (!Array.isArray(valeurs)) throw erreur('requete_invalide');
    return valeurs;
  };

  const base = {
    version: schema.version,
    schema,
    evenements,
    lire: (nom, cle) => unique(nom, 'lecture', (t) => t.lire(nom, cle)),
    lireTout: (nom, requete) => unique(nom, 'lecture', (t) => t.lireTout(nom, requete)),
    compter: (nom, requete) => unique(nom, 'lecture', (t) => t.compter(nom, requete)),
    ecrire: (nom, valeur) => unique(nom, 'ecriture', (t) => t.ecrire(nom, valeur)),
    ecrirePlusieurs: (nom, valeurs) =>
      unique(nom, 'ecriture', (t) => Promise.all(tableau(valeurs).map((valeur) => t.ecrire(nom, valeur)))),
    supprimer: (nom, cle) => unique(nom, 'ecriture', (t) => t.supprimer(nom, cle)),
    supprimerPlusieurs: (nom, cles) =>
      unique(nom, 'ecriture', async (t) => {
        await Promise.all(tableau(cles).map((cle) => t.supprimer(nom, cle)));
      }),
    vider: (nom) => unique(nom, 'ecriture', (t) => t.vider(nom)),
    transaction,
    fermer() {
      ferme = true;
      return Promise.resolve();
    },
    // Une nouvelle base sur les mêmes données, après les migrations manquantes. Si elle monte la version,
    // l'ancienne se ferme et émet `base-perimee`, comme le fait le navigateur.
    async rouvrir(nouvellesMigrations = migrations) {
      const nouvelle = await ouvrir(etat, nouvellesMigrations);
      if (!ferme && nouvelle.version > base.version) {
        ferme = true;
        evenements.dispatchEvent(new Event('base-perimee'));
      }
      return nouvelle;
    },
  };
  return base;
}

async function ouvrir(etat, migrations) {
  const schema = mettreAJour(etat, migrations);
  return construireBase(etat, migrations, schema);
}

// versionEnregistree : version déjà inscrite dans la base (pour simuler une base plus récente que le code).
export function creerBaseEnMemoire({ migrations, versionEnregistree = 0 } = {}) {
  return ouvrir({ version: versionEnregistree, magasins: new Map() }, migrations);
}
