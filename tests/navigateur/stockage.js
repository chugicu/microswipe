// Page de vérification du lot 104 : les quinze scénarios sur la vraie base IndexedDB, dans une base d'essai ; une ligne par scénario, aucune donnée affichée.
import { ouvrirBase } from '../../client/stockage/base-locale.js';
import { attendreCode, MIGRATIONS_D_ESSAI, SCENARIOS } from '../client/stockage/scenarios.js';

const NOM_ESSAI = 'microbio-essai-104'; // jamais « microbio »

function supprimerBaseEssai() {
  return new Promise((resolve, reject) => {
    const requete = indexedDB.deleteDatabase(NOM_ESSAI);
    requete.onsuccess = () => resolve();
    requete.onerror = () => reject(requete.error);
    requete.onblocked = () => reject(new Error('suppression bloquée : une connexion est restée ouverte'));
  });
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Contexte d'un scénario : les ouvertures portent sur la même base d'essai ; tout est fermé puis supprimé à la fin.
function contexteReel() {
  const ouvertes = [];
  return {
    async ouvrir(migrations) {
      const base = await ouvrirBase({ nom: NOM_ESSAI, migrations });
      ouvertes.push(base);
      return base;
    },
    async nettoyer() {
      for (const base of ouvertes) await base.fermer();
      await supprimerBaseEssai();
    },
  };
}

const SCENARIOS_DE_LA_VRAIE_BASE = [
  {
    numero: 14,
    titre: 'attendre une minuterie dans une transaction',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      const erreur = await attendreCode(
        base.transaction(['essai-simple'], 'ecriture', async (t) => {
          await t.ecrire('essai-simple', { id: 'a', valeur: 'Valeur A1' });
          await pause(50);
          await t.ecrire('essai-simple', { id: 'b', valeur: 'Valeur B1' });
        }),
        'transaction_inactive'
      );
      if (erreur.code !== 'transaction_inactive') throw new Error('code inattendu');
      if ((await base.lire('essai-simple', 'a')) === null) throw new Error('l\'écriture faite avant la minuterie doit être gardée');
      if ((await base.lire('essai-simple', 'b')) !== null) throw new Error('l\'écriture après la minuterie ne doit pas exister');
    },
  },
  {
    numero: 15,
    titre: 'migration invalide : refusée avant toute ouverture',
    async executer() {
      const migrations = structuredClone(MIGRATIONS_D_ESSAI);
      migrations[3].etapes.push({ etape: 'creerIndex', magasin: 'essai-file', index: 'compte-numero', cle: 'compte', unique: false });
      let ouvertures = 0;
      const fabrique = {
        open(...arguments_) {
          ouvertures += 1;
          return indexedDB.open(...arguments_);
        },
      };
      await attendreCode(ouvrirBase({ nom: NOM_ESSAI, migrations, fabrique }), 'migration_invalide');
      if (ouvertures !== 0) throw new Error('la base ne doit pas être ouverte');
    },
  },
];

async function laBaseEssaiExiste() {
  if (typeof indexedDB.databases !== 'function') return null; // non vérifiable avec ce navigateur
  const bases = await indexedDB.databases();
  return bases.some((base) => base.name === NOM_ESSAI);
}

function ajouterUneLigne(texte, reussi) {
  const ligne = document.createElement('li');
  ligne.textContent = `${reussi ? 'RÉUSSI' : 'ÉCHEC'} — ${texte}`;
  ligne.dataset.resultat = reussi ? 'reussi' : 'echec';
  document.getElementById('resultats').append(ligne);
}

async function lancer() {
  document.getElementById('lancer').disabled = true;
  document.getElementById('resultats').replaceChildren();
  document.getElementById('resume').textContent = 'En cours…';
  const resultats = [];
  await supprimerBaseEssai();
  for (const scenario of [...SCENARIOS, ...SCENARIOS_DE_LA_VRAIE_BASE]) {
    const contexte = contexteReel();
    let reussi = false;
    let texte = `${scenario.numero}. ${scenario.titre}`;
    try {
      await scenario.executer(contexte);
      reussi = true;
    } catch (erreur) {
      // Le code d'erreur ou le message de l'écart, jamais une donnée.
      texte += ` (${erreur && (erreur.code || erreur.message) || 'erreur'})`;
    }
    try {
      await contexte.nettoyer();
    } catch (erreur) {
      reussi = false;
      texte += ` (nettoyage : ${erreur && erreur.message})`;
    }
    resultats.push({ numero: scenario.numero, reussi });
    ajouterUneLigne(texte, reussi);
  }
  const existe = await laBaseEssaiExiste();
  const absente = existe === false;
  ajouterUneLigne(
    existe === null ? 'la base d\'essai n\'existe plus : non vérifiable avec ce navigateur' : 'la base d\'essai n\'existe plus',
    absente
  );
  const reussis = resultats.filter((r) => r.reussi).length;
  const tout = reussis === resultats.length && absente;
  document.getElementById('resume').textContent = `${reussis} scénarios réussis sur ${resultats.length}${absente ? '' : ' ; base d\'essai non confirmée absente'}`;
  document.body.dataset.termine = tout ? 'reussi' : 'echec';
  window.resultatsStockage = { resultats, baseEssaiAbsente: existe, tout };
  document.getElementById('lancer').disabled = false;
}

document.getElementById('lancer').addEventListener('click', lancer);
