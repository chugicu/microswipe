// Page de vérification du lot 107 : scénarios 20, 21, 22 et 25 sur la vraie base IndexedDB, dans une base d'essai ; une ligne par scénario, aucune donnée affichée.
import { creerChargeurDeContenu } from '../../client/contenu/chargeur.js';
import { sourceFictive } from '../../client/contenu/source-fictive.js';
import { ouvrirBase } from '../../client/stockage/base-locale.js';
import { MIGRATIONS } from '../../client/stockage/migrations.js';

const NOM_ESSAI = 'microbio-essai-107'; // jamais « microbio »

function supprimerBaseEssai() {
  return new Promise((resolve, reject) => {
    const requete = indexedDB.deleteDatabase(NOM_ESSAI);
    requete.onsuccess = () => resolve();
    requete.onerror = () => reject(requete.error);
    requete.onblocked = () => reject(new Error('suppression bloquée : une connexion est restée ouverte'));
  });
}

const maintenant = () => new Date().toISOString();

function verifier(condition, message) {
  if (!condition) throw new Error(message);
}

const SCENARIOS = [
  {
    numero: 20,
    titre: 'première ouverture : paquet rangé',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS);
      const chargeur = creerChargeurDeContenu({ obtenirBase: async () => base, source: sourceFictive, maintenant });
      const resultat = await chargeur.charger('internes');
      verifier(resultat.resultat === 'remplace', 'le paquet doit être remplacé');
      const enregistrement = await base.lire('contenu', 'internes');
      verifier(enregistrement && enregistrement.versionContenu === chargeur.versionContenuLocale(), 'enregistrement absent');
      verifier(chargeur.etat().range === true, 'le paquet doit être rangé');
    },
  },
  {
    numero: 21,
    titre: 'second chargeur : paquet relu avant tout appel à la source',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS);
      await creerChargeurDeContenu({ obtenirBase: async () => base, source: sourceFictive, maintenant }).charger('internes');
      let appels = 0;
      const source = (...args) => {
        appels += 1;
        return sourceFictive(...args);
      };
      const chargeur = creerChargeurDeContenu({ obtenirBase: async () => base, source, maintenant });
      await chargeur.pret;
      verifier(chargeur.lirePaquet('internes') !== null, 'paquet non relu');
      verifier(appels === 0, 'la source a été appelée avant la relecture');
      const resultat = await chargeur.charger('internes');
      verifier(resultat.resultat === 'a_jour', 'le paquet doit être à jour');
    },
  },
  {
    numero: 22,
    titre: 'source qui rejette : paquet gardé',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS);
      await creerChargeurDeContenu({ obtenirBase: async () => base, source: sourceFictive, maintenant }).charger('internes');
      const source = () => Promise.reject(new Error('essai'));
      const chargeur = creerChargeurDeContenu({ obtenirBase: async () => base, source, maintenant });
      const resultat = await chargeur.charger('internes');
      verifier(resultat.resultat === 'garde' && resultat.motif === 'source_indisponible', 'résultat inattendu');
      verifier(chargeur.lirePaquet('internes') !== null, 'le paquet doit rester');
    },
  },
  {
    numero: 25,
    titre: 'seconde ouverture avec une migration de plus : base-perimee',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS);
      const chargeur = creerChargeurDeContenu({ obtenirBase: async () => base, source: sourceFictive, maintenant });
      await chargeur.charger('internes');
      let signalements = 0;
      chargeur.evenements.addEventListener('base-perimee', () => {
        signalements += 1;
      });
      const migrations = [
        ...MIGRATIONS,
        { version: MIGRATIONS.length + 1, lot: '107', description: 'Essai', etapes: [{ etape: 'creerMagasin', magasin: 'essai-107', cle: 'id' }] },
      ];
      await ouvrir(migrations);
      verifier(signalements === 1, 'base-perimee doit être émis une fois');
      verifier(chargeur.basePerimee() === true, 'basePerimee() doit être vrai');
      verifier(chargeur.lirePaquet('internes') !== null, 'le paquet doit rester lisible');
    },
  },
];

async function lancerUn(scenario) {
  const ouvertes = [];
  const contexte = {
    async ouvrir(migrations) {
      const base = await ouvrirBase({ nom: NOM_ESSAI, migrations });
      ouvertes.push(base);
      return base;
    },
  };
  await supprimerBaseEssai();
  try {
    await scenario.executer(contexte);
  } finally {
    for (const base of ouvertes) await base.fermer().catch(() => {});
    await supprimerBaseEssai();
  }
}

async function lancer() {
  const liste = document.getElementById('resultats');
  liste.textContent = '';
  let reussis = 0;
  for (const scenario of SCENARIOS) {
    const ligne = document.createElement('li');
    try {
      await lancerUn(scenario);
      ligne.textContent = `${scenario.numero}. ${scenario.titre} : réussi`;
      reussis += 1;
    } catch (erreur) {
      ligne.textContent = `${scenario.numero}. ${scenario.titre} : ÉCHEC (${erreur && erreur.message ? erreur.message : 'erreur'})`;
    }
    liste.append(ligne);
  }
  document.getElementById('resume').textContent = `${reussis} scénarios réussis sur ${SCENARIOS.length}`;
}

document.getElementById('lancer').addEventListener('click', lancer);
