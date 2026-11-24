// Démarrage du contenu : crée l'unique chargeur de l'appli, branche le logo et la proposition de rechargement, lance le premier chargement sans l'attendre.
import { definirFournisseurDuLogo } from '../coquille/accueil.js';
import { logoActive } from '../coquille/regles.js';
import { ouvrirBaseDuJeu } from '../stockage/base-locale.js';
import { creerChargeurDeContenu } from './chargeur.js';
import { propositionDeRechargement } from './rechargement.js';
import { sourceFictive } from './source-fictive.js';

let chargeur = null;

export function demarrerContenu() {
  if (chargeur) return chargeur;
  chargeur = creerChargeurDeContenu({
    obtenirBase: ouvrirBaseDuJeu,
    source: sourceFictive,
    maintenant: () => new Date().toISOString(),
  });
  // Le logo suit le paquet rangé, pas celui qui arrive pendant l'ouverture.
  definirFournisseurDuLogo(() =>
    chargeur.pret.then(() => logoActive(chargeur.lirePaquet('internes')?.reglages))
  );
  chargeur.evenements.addEventListener('base-perimee', () => propositionDeRechargement().signaler());
  chargeur.charger('internes').catch((erreur) => console.error(erreur));
  return chargeur;
}

export function contenuDuJeu() {
  return chargeur;
}
