// Dialogue de rechargement (design system § 9.11) : seul fichier du lot qui touche la page.
import { TEXTES_RECHARGEMENT } from './rechargement.js';

// actions.plusTard() est appelé à la fermeture ; actions.recharger() remplace le rechargement de la page (essais).
export function afficherDialogueDeRechargement(actions = {}) {
  const voile = document.createElement('div');
  voile.className = 'dialogue-voile';

  const dialogue = document.createElement('div');
  dialogue.className = 'dialogue';
  dialogue.setAttribute('role', 'dialog');
  dialogue.setAttribute('aria-modal', 'true');
  dialogue.setAttribute('aria-labelledby', 'dialogue-rechargement-titre');
  dialogue.tabIndex = -1;

  const titre = document.createElement('h2');
  titre.id = 'dialogue-rechargement-titre';
  titre.className = 'dialogue-titre';
  titre.textContent = TEXTES_RECHARGEMENT.titre;

  const texte = document.createElement('p');
  texte.className = 'dialogue-texte';
  texte.textContent = TEXTES_RECHARGEMENT.texte;

  const boutons = document.createElement('div');
  boutons.className = 'dialogue-boutons';

  const recharger = document.createElement('button');
  recharger.type = 'button';
  recharger.className = 'bouton-principal';
  recharger.textContent = TEXTES_RECHARGEMENT.recharger;
  recharger.addEventListener('click', () => {
    if (typeof actions.recharger === 'function') actions.recharger();
    else globalThis.location.reload();
  });

  const fermer = () => {
    voile.remove();
    if (typeof actions.plusTard === 'function') actions.plusTard();
  };

  const plusTard = document.createElement('button');
  plusTard.type = 'button';
  plusTard.className = 'bouton-secondaire';
  plusTard.textContent = TEXTES_RECHARGEMENT.plusTard;
  plusTard.addEventListener('click', fermer);

  // Un toucher sur le voile ferme aussi : l'action n'est pas irréversible.
  voile.addEventListener('click', (evenement) => {
    if (evenement.target === voile) fermer();
  });

  boutons.append(recharger, plusTard);
  dialogue.append(titre, texte, boutons);
  voile.append(dialogue);
  document.body.append(voile);
  dialogue.focus();
  return voile;
}
