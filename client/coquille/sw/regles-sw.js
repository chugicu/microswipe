// Règles pures du service worker (liste de la coquille, noms de caches, stratégie par requête) ; script classique, chargé par sw.js et par Node.

const PREFIXE_DES_CACHES = 'microbio-coquille-v';

// Pages de vérification du lot 108 : servies par le réseau, jamais rangées.
const DOSSIERS_HORS_COQUILLE = ['client/verifications/'];

// Tout fichier ajouté dans client/ s'ajoute ici (un test le vérifie).
const FICHIERS_DE_LA_COQUILLE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'client/version.js',
  'client/demarrage.js',
  'client/coquille/coquille.css',
  'client/coquille/accueil.js',
  'client/coquille/installation.js',
  'client/coquille/mise-a-jour.js',
  'client/coquille/regles.js',
  'client/coquille/sw/regles-sw.js',
  'client/contenu/forme-du-paquet.js',
  'client/donnees-fictives/lignes-fictives.js',
  'client/donnees-fictives/paquets-fictifs.js',
  'client/images/icone-192.png',
  'client/images/icone-512.png',
  'client/images/icone-apple-180.png',
  'client/images/logo-android.png',
  'client/images/logo-ios.png',
];

function nomDuCache(version) {
  return PREFIXE_DES_CACHES + version;
}

// Seuls les noms à préfixe microbio-coquille-v sont rendus : les caches des autres applis du domaine ne se touchent pas.
function cachesASupprimer(noms, version) {
  const courant = nomDuCache(version);
  return noms.filter((nom) => nom.startsWith(PREFIXE_DES_CACHES) && nom !== courant);
}

// requete : { methode, url, mode } ; portee : adresse de la portée du service worker.
// Rend 'page', 'coquille', 'reseau' ou 'ignorer'.
function strategiePour(requete, portee, fichiers) {
  if (requete.methode !== 'GET') return 'ignorer';
  let adresse;
  let racine;
  try {
    adresse = new URL(requete.url);
    racine = new URL(portee);
  } catch (erreur) {
    return 'ignorer';
  }
  if (adresse.origin !== racine.origin || !adresse.pathname.startsWith(racine.pathname)) return 'ignorer';
  if (requete.mode === 'navigate') return 'page';
  // new URL() a déjà retiré ?… et #… du chemin.
  const relatif = adresse.pathname.slice(racine.pathname.length) || './';
  return fichiers.includes(relatif) ? 'coquille' : 'reseau';
}

if (typeof module !== 'undefined') {
  module.exports = {
    PREFIXE_DES_CACHES,
    DOSSIERS_HORS_COQUILLE,
    FICHIERS_DE_LA_COQUILLE,
    nomDuCache,
    cachesASupprimer,
    strategiePour,
  };
}
