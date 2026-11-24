// Écran d'accueil au logo : déjà affiché par le HTML, il disparaît quand les règles de regles.js le permettent.
import { DUREE_ACCUEIL_MS, doitMasquerLAccueil } from './regles.js';

const debut = performance.now();
let fournisseur = () => Promise.resolve(true);
let logo = true;
let appliPrete = false;
let toucher = false;
let retenues = 0;
let masque = false;
let numeroDInterrogation = 0;
let minuteur = null;

let resoudreAccueilTermine;
export const accueilTermine = new Promise((resoudre) => {
  resoudreAccueilTermine = resoudre;
});

function element() {
  return document.getElementById('accueil');
}

function evaluer() {
  if (masque || retenues > 0) return;
  const ecouleMs = performance.now() - debut;
  if (doitMasquerLAccueil({ ecouleMs, appliPrete, toucher, logo })) {
    masquer();
    return;
  }
  // La seconde n'est pas écoulée : on revient à l'instant exact, sans interroger en boucle.
  if (appliPrete && logo && !toucher && minuteur === null) {
    minuteur = setTimeout(() => {
      minuteur = null;
      evaluer();
    }, Math.max(0, DUREE_ACCUEIL_MS - ecouleMs));
  }
}

async function masquer() {
  masque = true;
  const accueil = element();
  if (accueil) {
    accueil.classList.add('accueil-masque');
    // Sans animation (téléphone réglé pour les réduire), il n'y a rien à attendre.
    await Promise.allSettled(accueil.getAnimations().map((animation) => animation.finished));
    accueil.remove();
  }
  resoudreAccueilTermine();
}

// Un rejet compte comme « logo actif » ; une réponse périmée est ignorée.
function interroger() {
  const numero = ++numeroDInterrogation;
  Promise.resolve()
    .then(() => fournisseur())
    .then(
      (reponse) => reponse !== false,
      () => true
    )
    .then((actif) => {
      if (numero !== numeroDInterrogation || masque) return;
      logo = actif;
      evaluer();
    });
}

// Le lot 107 remplace le fournisseur par la lecture de accueil.logo dans le paquet « internes » rangé.
export function definirFournisseurDuLogo(fn) {
  fournisseur = fn;
  interroger();
}

export function annoncerAppliPrete() {
  appliPrete = true;
  evaluer();
}

// Retient l'accueil (mise à jour en cours) ; rend la fonction qui le libère, ou null s'il a déjà disparu.
export function retenirAccueil() {
  if (masque) return null;
  retenues += 1;
  let libere = false;
  return () => {
    if (libere) return;
    libere = true;
    retenues -= 1;
    evaluer();
  };
}

const accueil = element();
if (accueil) {
  accueil.addEventListener('pointerdown', () => {
    toucher = true;
    evaluer();
  });
}
interroger();
