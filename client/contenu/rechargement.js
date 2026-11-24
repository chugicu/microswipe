// Proposition de recharger la page quand la base locale est périmée : logique seulement (quand afficher, une fois par page), le dialogue est dans dialogue-rechargement.js.
import { afficherDialogueDeRechargement } from './dialogue-rechargement.js';

export const TEXTES_RECHARGEMENT = Object.freeze({
  titre: 'Nouvelle version prête',
  texte: "MicroSwipe vient d'être mis à jour dans un autre onglet. Recharge la page pour continuer sans rien perdre.",
  recharger: 'Recharger',
  plusTard: 'Plus tard',
});

// afficher() est appelé au plus une fois par instance ; peutInterrompre() est faux pendant une partie.
export function creerPropositionDeRechargement({ afficher, peutInterrompre }) {
  let affichee = false;
  let refusee = false;
  let enAttente = false;

  function essayer() {
    if (affichee || refusee) return;
    if (!peutInterrompre()) {
      enAttente = true;
      return;
    }
    enAttente = false;
    affichee = true;
    afficher();
  }

  return {
    signaler: essayer,
    reprendre() {
      if (enAttente) essayer();
    },
    enAttente: () => enAttente,
    refuser() {
      refusee = true;
      enAttente = false;
    },
  };
}

let garde = () => true;

// Le lot qui crée les parties règle la garde : () => !partieEnCours.
export function definirGardeDeRechargement(fn) {
  garde = fn;
}

let instance = null;

export function propositionDeRechargement() {
  if (instance === null) {
    instance = creerPropositionDeRechargement({
      afficher: () => afficherDialogueDeRechargement({ plusTard: () => instance.refuser() }),
      peutInterrompre: () => garde(),
    });
  }
  return instance;
}
