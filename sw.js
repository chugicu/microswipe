// Service worker de MicroSwipe : garde la coquille de l'appli en cache et se met à jour sans rien demander ; seul fichier à appeler l'API de cache et à intercepter les requêtes.

importScripts('client/coquille/sw/regles-sw.js');

// Même valeur que VERSION_CLIENT (client/version.js), sur une seule ligne : un test les compare.
const VERSION_DE_LA_COQUILLE = 4;

const NOM_DU_CACHE = nomDuCache(VERSION_DE_LA_COQUILLE);

function adresseDansLaPortee(chemin) {
  return new URL(chemin, self.registration.scope).href;
}

self.addEventListener('install', (evenement) => {
  // Un seul fichier en échec fait échouer l'installation : l'ancienne version reste en service.
  evenement.waitUntil(
    caches.open(NOM_DU_CACHE).then((cache) =>
      cache.addAll(
        FICHIERS_DE_LA_COQUILLE.map((chemin) => new Request(adresseDansLaPortee(chemin), { cache: 'reload' }))
      )
    )
  );
  // Pas de skipWaiting ici : la nouvelle version attend le message « passer » de la page.
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches
      .keys()
      .then((noms) => Promise.all(cachesASupprimer(noms, VERSION_DE_LA_COQUILLE).map((nom) => caches.delete(nom))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (evenement) => {
  if (evenement.data === 'passer') self.skipWaiting();
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  const strategie = strategiePour(
    { methode: requete.method, url: requete.url, mode: requete.mode },
    self.registration.scope,
    FICHIERS_DE_LA_COQUILLE
  );
  if (strategie === 'ignorer') return; // le navigateur fait la requête lui-même
  if (strategie === 'reseau') {
    evenement.respondWith(fetch(requete));
    return;
  }
  const cle = strategie === 'page' ? adresseDansLaPortee('index.html') : requete;
  evenement.respondWith(
    caches
      .open(NOM_DU_CACHE)
      .then((cache) => cache.match(cle, { ignoreSearch: true }))
      .then((reponse) => reponse || fetch(requete))
  );
});
