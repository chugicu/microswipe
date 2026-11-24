// Dialogue commun de l'appli (design system § 9.11, § 7.6) : tout dialogue passe par ouvrirDialogue ; un seul à la fois, les suivants font la queue.
import { preparerDialogue } from './regles-dialogue.js';
import { memoriserLeFocus, pieger } from './piege-focus.js';

let compteur = 0;
let courant = null;
const file = [];

function ouvrirVraiment(entree) {
  courant = entree;
  const { options, prepare } = entree;
  const identifiant = `dialogue-${++compteur}`;
  const rendreLeFocus = memoriserLeFocus();

  const voile = document.createElement('div');
  voile.className = 'dialogue-voile';
  const dialogue = document.createElement('div');
  dialogue.className = 'dialogue paillasse-claire';
  dialogue.setAttribute('role', 'dialog');
  dialogue.setAttribute('aria-modal', 'true');
  dialogue.setAttribute('aria-labelledby', `${identifiant}-titre`);
  dialogue.setAttribute('aria-describedby', `${identifiant}-texte`);
  dialogue.tabIndex = -1;

  const titre = document.createElement('h2');
  titre.id = `${identifiant}-titre`;
  titre.className = 'dialogue-titre';
  titre.textContent = prepare.titre;
  const texte = document.createElement('p');
  texte.id = `${identifiant}-texte`;
  texte.className = 'dialogue-texte';
  texte.textContent = prepare.texte;

  const secondaire = options.secondaire ?? { libelle: prepare.boutons[1].libelle, surAppui: () => {} };
  const boutons = document.createElement('div');
  boutons.className = 'dialogue-boutons';
  const faire = (source) => () => fermer(source.surAppui);
  const action = bouton('bouton-principal', prepare.boutons[0].libelle, faire(options.action));
  const autre = bouton('bouton-secondaire', prepare.boutons[1].libelle, faire(secondaire));
  boutons.append(action, autre);
  dialogue.append(titre, texte, boutons);
  voile.append(dialogue);

  let ferme = false;
  function fermer(rappel) {
    if (ferme) return;
    ferme = true;
    window.removeEventListener('keydown', surTouche, true);
    // Les rappels partent au début de la fermeture : elle ne bloque rien.
    voile.classList.add('se-ferme');
    voile.style.pointerEvents = 'none';
    let fini = false;
    const terminer = () => {
      if (fini) return;
      fini = true;
      voile.remove();
      rendreLeFocus();
      courant = null;
      suivant();
    };
    voile.addEventListener('animationend', terminer, { once: true });
    setTimeout(terminer, 400);
    if (typeof rappel === 'function') rappel();
  }
  entree.fermer = () => fermer();

  function surTouche(evenement) {
    if (evenement.key === 'Escape') {
      evenement.preventDefault();
      evenement.stopImmediatePropagation();
      fermer(secondaire.surAppui);
    } else if (evenement.key === 'Tab') {
      // Une fiche ouverte dessous ne doit pas reprendre le focus.
      evenement.stopImmediatePropagation();
      pieger(dialogue, evenement);
    }
  }
  window.addEventListener('keydown', surTouche, true);

  voile.addEventListener('click', (evenement) => {
    if (evenement.target === voile && prepare.fermerSurVoile) fermer(secondaire.surAppui);
  });

  document.body.append(voile);
  dialogue.focus();
  entree.element = voile;
}

function bouton(classe, libelle, surClic) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = classe;
  b.textContent = libelle;
  b.addEventListener('click', surClic);
  return b;
}

function suivant() {
  if (courant || file.length === 0) return;
  ouvrirVraiment(file.shift());
}

// Rend { element, fermer() } ; l'élément est celui du voile, ou null tant que le dialogue attend son tour.
export function ouvrirDialogue(options) {
  const prepare = preparerDialogue(options);
  const entree = { options, prepare, element: null, fermer: null };
  const retour = {
    get element() { return entree.element; },
    fermer() {
      if (entree.fermer) entree.fermer();
      else {
        const i = file.indexOf(entree);
        if (i >= 0) file.splice(i, 1);
      }
    },
  };
  file.push(entree);
  suivant();
  return retour;
}
