// Démarrage de l'appli : branche l'installation, la mise à jour et les démarrages des lots suivants, puis affiche la coquille vide.
import { demarrerInstallation } from './coquille/installation.js';
import { demarrerMiseAJour } from './coquille/mise-a-jour.js';
import { annoncerAppliPrete } from './coquille/accueil.js';

// Chaque lot suivant ajoute ici son propre démarrage (lot 107 : demarrerContenu), sans l'attendre.
const DEMARRAGES_BRANCHES = [];

// Une erreur d'un démarrage est écrite et n'empêche ni les autres ni l'affichage.
function lancer(demarrage) {
  try {
    const suite = demarrage();
    if (suite && typeof suite.catch === 'function') suite.catch((erreur) => console.error(erreur));
  } catch (erreur) {
    console.error(erreur);
  }
}

function afficherLaCoquilleVide() {
  const conteneur = document.getElementById('appli');
  if (!conteneur) return;
  const logo = document.createElement('img');
  logo.className = 'logo-discret';
  logo.src = new URL('./images/logo-ios.png', import.meta.url).href;
  logo.alt = 'MicroSwipe';
  conteneur.append(logo);
}

// Safari sur iPhone ignore user-scalable=no : on coupe le pincement à la main.
document.addEventListener('gesturestart', (evenement) => evenement.preventDefault());

lancer(demarrerInstallation);
lancer(() => demarrerMiseAJour({ pendantLAccueil: true }));
DEMARRAGES_BRANCHES.forEach(lancer);
lancer(afficherLaCoquilleVide);
annoncerAppliPrete();
