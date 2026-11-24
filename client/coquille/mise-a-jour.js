// Enregistrement du service worker et mise à jour silencieuse : appliquée seulement pendant l'accueil de l'ouverture.
import { retenirAccueil } from './accueil.js';

let enregistrement = null;

export function versionEnAttente() {
  return Boolean(enregistrement && enregistrement.waiting);
}

export async function demarrerMiseAJour({ pendantLAccueil } = {}) {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  const adresse = new URL('../../sw.js', import.meta.url).href;
  const portee = new URL('../../', import.meta.url).href;
  enregistrement = await navigator.serviceWorker.register(adresse, { scope: portee });

  // Seule une version déjà en attente à l'ouverture s'applique ; une version trouvée maintenant attendra l'ouverture suivante.
  // Sans contrôleur (première installation), il n'y a rien à remplacer et pas de rechargement.
  const attente = enregistrement.waiting;
  if (pendantLAccueil && attente && navigator.serviceWorker.controller) {
    const liberer = retenirAccueil();
    if (liberer) appliquer(attente, liberer);
  }
  // Hors ligne, la recherche échoue : sans importance.
  enregistrement.update().catch(() => {});
}

function appliquer(attente, liberer) {
  // Un seul rechargement, provoqué par ce message : il ne peut pas boucler.
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
  // Si la version attendue est abandonnée, on ne bloque pas l'accueil.
  attente.addEventListener('statechange', () => {
    if (attente.state === 'redundant') liberer();
  });
  attente.postMessage('passer');
}
