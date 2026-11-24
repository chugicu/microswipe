// Catalogue et contrôles du lot 105 (16 à 22) : tous les composants communs avec des textes fictifs ; les lots suivants y ajoutent les leurs.
import { installerMatieres } from '../../client/design/matieres.js';
import { MILIEUX, poserMilieu } from '../../client/design/milieux.js';
import { ouvrirDialogue } from '../../client/design/dialogue.js';
import { ouvrirFiche } from '../../client/design/fiche.js';
import { creerScotch } from '../../client/design/scotch.js';
import { creerTrio, creerRangeeDEtoiles } from '../../client/design/etoiles.js';

installerMatieres();

const racine = document.getElementById('catalogue');

function el(nom, classe, texte, parent = racine) {
  const e = document.createElement(nom);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  parent.append(e);
  return e;
}
const rangee = (parent = racine, classe = 'rangee') => el('div', classe, undefined, parent);
const section = (titre) => el('h2', '', titre);
function bouton(classe, texte, parent, extra = {}) {
  const b = el('button', classe, texte, parent);
  b.type = 'button';
  if (extra.desactive) b.disabled = true;
  return b;
}
const icone = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>';
function avecIcone(b) { b.insertAdjacentHTML('afterbegin', icone); return b; }

el('h1', '', 'Catalogue du design system');
el('p', '', 'Textes fictifs. Largeur de référence : 390 px ; au-delà de 480 px, colonne centrée.');

// --- Contrôles ---
const barre = rangee();
const lancer = bouton('bouton-secondaire', 'Lancer', barre);
lancer.id = 'lancer';
const resume = el('p', '', '');
resume.id = 'resume';
const resultats = el('ul', '');
resultats.id = 'resultats';

// --- Jetons ---
section('Jetons de couleur');
const couleurs = rangee();
const jetons = [...document.styleSheets]
  .filter((f) => f.href && f.href.endsWith('jetons.css'))
  .flatMap((f) => [...f.cssRules])
  .flatMap((r) => [...r.style]).filter((n) => n.startsWith('--'));
for (const nom of jetons) {
  const valeur = getComputedStyle(document.documentElement).getPropertyValue(nom).trim();
  if (!/^(#|rgba?\()/.test(valeur)) continue;
  const p = el('div', 'pastille', undefined, couleurs);
  const echantillon = el('i', '', undefined, p);
  echantillon.style.background = `var(${nom})`;
  el('span', '', nom.slice(2), p);
}

section('Échelle typographique');
const echelle = el('div', 'echelle');
for (const [nom, police] of [['texte-score', 'Bricolage Grotesque'], ['texte-titre-1', 'Bricolage Grotesque'], ['texte-titre-2', 'Bricolage Grotesque'], ['texte-question', 'Inter'], ['texte-bouton', 'Inter'], ['texte-corps', 'Inter'], ['texte-petit', 'Inter'], ['texte-legende', 'Inter'], ['texte-ruban', 'Caveat']]) {
  const p = el('p', '', `${nom} · ${police} · Titre d'essai 0123456789`, echelle);
  p.style.font = `var(--${nom})`;
}

// --- Boutons ---
section('Boutons');
const claire = el('div', 'zone paillasse-claire');
for (const [classe, texte] of [['bouton-principal', 'Jouer'], ['bouton-boss', 'Jouer le boss'], ['bouton-tous-les-mondes', 'Tous les mondes'], ['bouton-secondaire', 'Rejouer'], ['lien-action', 'Revoir'], ['bouton-danger', 'Archiver']]) {
  const r = rangee(claire);
  avecIcone(bouton(classe, texte, r));
  avecIcone(bouton(classe, texte, r, { desactive: true }));
}
const sombre = el('div', 'zone paillasse-sombre');
bouton('bouton-boss', 'Jouer le boss', sombre);
const surGelose = el('div', 'zone gelose');
poserMilieu(surGelose, 'sang');
const bg = bouton('bouton-icone sur-gelose', '', surGelose); bg.setAttribute('aria-label', 'Essai'); bg.insertAdjacentHTML('afterbegin', icone);
const surEncre = el('div', 'zone encre');
const be = bouton('bouton-icone sur-encre', '', surEncre); be.setAttribute('aria-label', 'Essai'); be.style.color = 'var(--creme)'; be.insertAdjacentHTML('afterbegin', icone);

// --- Matières ---
section('Matières');
const m1 = el('div', 'matiere paillasse-claire', 'Paillasse claire');
const m2 = el('div', 'matiere paillasse-sombre', 'Paillasse sombre');
const cles = [...Object.keys(MILIEUX), 'cle-inconnue'];
for (const cle of cles) {
  const g = el('div', 'matiere gelose', `Gélose : ${cle}`);
  poserMilieu(g, cle);
}

// --- Scotch ---
section('Scotch');
const scotchs = rangee();
scotchs.append(creerScotch({ texte: 'Monde 1 · −4°', angle: -4 }), creerScotch({ texte: 'à réviser · +3°', angle: 3, revision: true }));

// --- Étoiles ---
section('Étoiles');
for (const variante of ['fiche', 'fin']) {
  el('p', '', `Trio « ${variante} », de 0 à 3 étoiles`);
  const r = rangee();
  for (let n = 0; n <= 3; n += 1) {
    r.append(creerTrio({ nombre: n, variante, pourcentages: ['60 %', '100 %', '80 %'], libelle: `${n} étoiles sur 3` }));
  }
}
el('p', '', 'Rangée sombre, de 0 à 3 étoiles');
const sr = rangee();
for (let n = 0; n <= 3; n += 1) sr.append(creerRangeeDEtoiles({ nombre: n }));

// --- Ouvertures ---
section('Fiches et dialogues');
const ouvertures = rangee();
const contenuFiche = () => { const d = document.createElement('div'); d.append(Object.assign(document.createElement('h2'), { textContent: 'Titre d’essai', className: 'fiche-titre-essai' })); return d; };
bouton('bouton-secondaire', 'Ouvrir une fiche claire', ouvertures).addEventListener('click', () => ouvrirFiche({ libelle: 'Fiche d’essai', contenu: contenuFiche() }));
bouton('bouton-secondaire', 'Ouvrir une fiche sombre', ouvertures).addEventListener('click', () => ouvrirFiche({ libelle: 'Fiche sombre d’essai', sombre: true, contenu: contenuFiche() }));
const essai = (extra = {}) => ouvrirDialogue({ titre: 'Titre d’essai', texte: 'Texte d’essai pour le dialogue.', action: { libelle: 'Confirmer', surAppui() {} }, ...extra });
bouton('bouton-secondaire', 'Ouvrir un dialogue', ouvertures).addEventListener('click', () => essai());
bouton('bouton-secondaire', 'Ouvrir un dialogue irréversible', ouvertures).addEventListener('click', () => essai({ irreversible: true }));
bouton('bouton-secondaire', 'Ouvrir deux dialogues', ouvertures).addEventListener('click', () => { essai({ titre: 'Premier' }); essai({ titre: 'Second' }); });

// --- Contrôles automatiques ---
const attendre = (condition, delai = 1500) => new Promise((resolve, reject) => {
  const debut = performance.now();
  (function boucle() {
    if (condition()) resolve();
    else if (performance.now() - debut > delai) reject(new Error('délai dépassé'));
    else setTimeout(boucle, 20);
  }());
});
const verifier = (c, m) => { if (!c) throw new Error(m); };
const dialogues = () => document.querySelectorAll('.dialogue-voile');
const touche = (cible, key, extra = {}) => cible.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra }));
const fermerTout = async () => { for (const v of [...document.querySelectorAll('.fiche, .fiche-voile')]) v.remove(); };

const CONTROLES = [
  [16, 'dialogue : rôles, libellés et focus', async () => {
    const d = essai();
    const dialogue = d.element.querySelector('.dialogue');
    verifier(dialogue.getAttribute('role') === 'dialog' && dialogue.getAttribute('aria-modal') === 'true', 'role / aria-modal');
    for (const attribut of ['aria-labelledby', 'aria-describedby']) verifier(document.getElementById(dialogue.getAttribute(attribut)), attribut);
    verifier(document.activeElement === dialogue, 'focus dans le dialogue');
    d.fermer();
    await attendre(() => dialogues().length === 0);
  }],
  [17, 'Tab et Maj+Tab restent dans le dialogue', async () => {
    const d = essai();
    const b = [...d.element.querySelectorAll('button')];
    b[b.length - 1].focus();
    touche(document.activeElement, 'Tab');
    verifier(document.activeElement === b[0], 'Tab depuis le dernier');
    touche(document.activeElement, 'Tab', { shiftKey: true });
    verifier(document.activeElement === b[b.length - 1], 'Maj+Tab depuis le premier');
    d.fermer();
    await attendre(() => dialogues().length === 0);
  }],
  [18, 'Échap = secondaire, le focus revient', async () => {
    const ouvreur = bouton('bouton-secondaire', 'ouvreur', document.body);
    ouvreur.focus();
    let appele = 0;
    const d = essai({ secondaire: { libelle: 'Plus tard', surAppui: () => { appele += 1; } } });
    touche(document.activeElement, 'Escape');
    verifier(appele === 1, 'secondaire appelé une fois');
    await attendre(() => dialogues().length === 0);
    verifier(document.activeElement === ouvreur, 'focus rendu');
    ouvreur.remove();
    d.fermer();
  }],
  [19, 'toucher sur le voile', async () => {
    let n = 0;
    const normal = essai({ secondaire: { libelle: 'Non', surAppui: () => { n += 1; } } });
    normal.element.click();
    verifier(n === 1, 'dialogue normal : secondaire appelé');
    await attendre(() => dialogues().length === 0);
    const irreversible = essai({ irreversible: true, secondaire: { libelle: 'Non', surAppui: () => { n += 1; } } });
    irreversible.element.click();
    await new Promise((r) => setTimeout(r, 400));
    verifier(n === 1 && dialogues().length === 1, 'irréversible : rien');
    touche(document.activeElement, 'Escape');
    verifier(n === 2, 'Échap ferme quand même');
    await attendre(() => dialogues().length === 0);
  }],
  [20, 'deux dialogues : un seul à la fois', async () => {
    const a = essai({ titre: 'Premier' });
    const b = essai({ titre: 'Second' });
    verifier(dialogues().length === 1 && document.querySelector('.dialogue-titre').textContent === 'Premier', 'premier seul');
    a.fermer();
    await attendre(() => dialogues().length === 1 && document.querySelector('.dialogue-titre').textContent === 'Second');
    b.fermer();
    await attendre(() => dialogues().length === 0);
  }],
  [21, 'fiche', async () => {
    let fermetures = 0;
    const f = ouvrirFiche({ libelle: 'Fiche d’essai', surFermeture: () => { fermetures += 1; } });
    verifier(f.element.getAttribute('role') === 'dialog' && f.element.getAttribute('aria-label') === 'Fiche d’essai', 'role / aria-label');
    touche(document, 'Escape');
    verifier(fermetures === 1 && !f.element.isConnected, 'Échap ferme');
    const g = ouvrirFiche({ libelle: 'Autre', surFermeture: () => { fermetures += 1; } });
    document.querySelector('.fiche-voile').click();
    verifier(fermetures === 2 && !g.element.isConnected, 'voile ferme');
    let premiere = 0;
    const h = ouvrirFiche({ libelle: 'Première', surFermeture: () => { premiere += 1; } });
    const i = ouvrirFiche({ libelle: 'Seconde' });
    verifier(premiere === 1 && !h.element.isConnected && document.querySelectorAll('.fiche').length === 1, 'une seule fiche');
    const d = essai();
    touche(document.activeElement, 'Escape');
    await attendre(() => dialogues().length === 0);
    verifier(i.element.isConnected, 'Échap ferme le dialogue seul');
    i.fermer();
    d.fermer();
  }],
  [22, 'installerMatieres deux fois : un seul svg', async () => {
    installerMatieres();
    installerMatieres();
    verifier(document.querySelectorAll('svg.filtres-matieres').length === 1, 'un seul svg');
  }],
];

lancer.addEventListener('click', async () => {
  resultats.replaceChildren();
  let reussis = 0;
  for (const [numero, titre, executer] of CONTROLES) {
    const li = el('li', '', '', resultats);
    try {
      await executer();
      li.className = 'ok';
      li.textContent = `${numero}. ${titre} : réussi`;
      reussis += 1;
    } catch (erreur) {
      li.className = 'ko';
      li.textContent = `${numero}. ${titre} : échoué (${erreur.message})`;
    }
    await fermerTout();
  }
  resume.textContent = `${reussis} contrôles réussis sur ${CONTROLES.length}`;
});
