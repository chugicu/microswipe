// Fiche (design system § 9.8), statique : elle s'affiche et se masque d'un coup ; le mouvement est au lot 106.
import { memoriserLeFocus, pieger } from './piege-focus.js';

let ficheOuverte = null;

export function ouvrirFiche({ libelle, contenu, sombre = false, surFermeture } = {}) {
  if (typeof libelle !== 'string' || libelle.trim() === '') {
    const e = new Error('fiche_mal_formee');
    e.code = 'fiche_mal_formee';
    throw e;
  }
  if (ficheOuverte) ficheOuverte();
  const rendreLeFocus = memoriserLeFocus();

  const voile = document.createElement('div');
  voile.className = 'fiche-voile';
  const element = document.createElement('div');
  element.className = `fiche ${sombre ? 'paillasse-sombre fiche-sombre' : 'paillasse-claire'}`;
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  element.setAttribute('aria-label', libelle);
  element.tabIndex = -1;
  const corps = document.createElement('div');
  corps.className = 'fiche-corps';
  if (contenu) corps.append(contenu);
  element.append(corps);

  let ferme = false;
  function fermer() {
    if (ferme) return;
    ferme = true;
    document.removeEventListener('keydown', surTouche);
    voile.remove();
    element.remove();
    if (ficheOuverte === fermer) ficheOuverte = null;
    rendreLeFocus();
    if (typeof surFermeture === 'function') surFermeture();
  }
  function surTouche(evenement) {
    if (evenement.key === 'Escape') {
      evenement.preventDefault();
      fermer();
    } else {
      pieger(element, evenement);
    }
  }
  document.addEventListener('keydown', surTouche);
  voile.addEventListener('click', fermer);

  document.body.append(voile, element);
  element.focus();
  ficheOuverte = fermer;
  return { element, corps, fermer };
}
