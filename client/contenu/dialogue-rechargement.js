// Dialogue de rechargement (design system § 9.11) : passe par le dialogue commun de client/design/.
import { ouvrirDialogue } from '../design/dialogue.js';
import { TEXTES_RECHARGEMENT } from './rechargement.js';

// actions.plusTard() est appelé à la fermeture ; actions.recharger() remplace le rechargement de la page (essais).
export function afficherDialogueDeRechargement(actions = {}) {
  return ouvrirDialogue({
    titre: TEXTES_RECHARGEMENT.titre,
    texte: TEXTES_RECHARGEMENT.texte,
    action: {
      libelle: TEXTES_RECHARGEMENT.recharger,
      surAppui() {
        if (typeof actions.recharger === 'function') actions.recharger();
        else globalThis.location.reload();
      },
    },
    secondaire: {
      libelle: TEXTES_RECHARGEMENT.plusTard,
      surAppui() {
        if (typeof actions.plusTard === 'function') actions.plusTard();
      },
    },
  });
}
