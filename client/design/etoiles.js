// Étoiles fixes (design system § 9.5) : états du trio, étoile, trio et rangée de la pastille ; aucune animation dans ce lot.
const NS = 'http://www.w3.org/2000/svg';
const TRACE = 'M12 2.6l2.85 5.8 6.4.95-4.63 4.5 1.1 6.37L12 17.2l-5.72 3.02 1.1-6.37-4.63-4.5 6.4-.95z';
const REFLET = 'M9.2 7.6l1.4-2.8';

export const ORDRE_DE_REMPLISSAGE = Object.freeze(['gauche', 'droite', 'milieu']);

// [gauche, milieu, droite] dans l'ordre de l'écran : gauche = 1re étoile, droite = 2e, milieu = 3e.
export function etatsDuTrio(nombre) {
  const n = Number.isInteger(nombre) ? Math.min(3, Math.max(0, nombre)) : 0;
  return [n >= 1, n >= 3, n >= 2];
}

let compteur = 0;

function noeud(nom, attributs = {}) {
  const e = document.createElementNS(NS, nom);
  for (const [cle, valeur] of Object.entries(attributs)) e.setAttribute(cle, valeur);
  return e;
}

export function creerEtoile({ pleine = false, taille = 24, sombre = false } = {}) {
  const svg = noeud('svg', { viewBox: '0 0 24 24', width: taille, height: taille, 'aria-hidden': 'true', focusable: 'false' });
  svg.classList.add('etoile');
  const trace = noeud('path', { d: TRACE, 'stroke-width': '1.1', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
  if (sombre) {
    trace.style.fill = pleine ? 'var(--etoile)' : 'none';
    trace.style.stroke = pleine ? 'var(--etoile)' : 'var(--etoile-vide-sombre)';
    svg.append(trace);
  } else if (pleine) {
    const id = `etoile-or-${++compteur}`;
    const defs = noeud('defs');
    const degrade = noeud('linearGradient', { id, x1: '0', y1: '0', x2: '0', y2: '1' });
    const arrets = [['0', '--etoile-or-haut'], ['0.55', '--etoile-or-milieu'], ['1', '--etoile-or-bas']];
    for (const [decalage, variable] of arrets) {
      const arret = noeud('stop', { offset: decalage });
      arret.style.stopColor = `var(${variable})`;
      degrade.append(arret);
    }
    defs.append(degrade);
    trace.setAttribute('fill', `url(#${id})`);
    trace.style.stroke = 'var(--etoile-claire)';
    const reflet = noeud('path', { d: REFLET, 'stroke-width': '1.1', 'stroke-linecap': 'round', fill: 'none' });
    reflet.style.stroke = 'var(--etoile-reflet)';
    svg.style.filter = 'var(--etoile-ombre)';
    svg.append(defs, trace, reflet);
  } else {
    trace.style.fill = 'var(--etoile-vide-fond)';
    trace.style.stroke = 'var(--bordure-forte)';
    svg.append(trace);
  }
  return svg;
}

const VARIANTES = {
  fiche: { tailles: [50, 66, 50], relevee: 14 },
  fin: { tailles: [64, 84, 64], relevee: 16 },
};

export function creerTrio({ nombre = 0, pourcentages, variante = 'fiche', libelle } = {}) {
  const { tailles, relevee } = VARIANTES[variante] ?? VARIANTES.fiche;
  const etats = etatsDuTrio(nombre);
  const trio = document.createElement('div');
  trio.className = `trio-etoiles trio-${variante in VARIANTES ? variante : 'fiche'}`;
  trio.setAttribute('role', 'img');
  if (libelle) trio.setAttribute('aria-label', libelle);
  etats.forEach((pleine, i) => {
    const colonne = document.createElement('div');
    colonne.className = 'trio-colonne';
    const etoile = creerEtoile({ pleine, taille: tailles[i] });
    if (i === 1) etoile.style.transform = `translateY(-${relevee}px)`;
    colonne.append(etoile);
    if (variante === 'fiche' && Array.isArray(pourcentages)) {
      const legende = document.createElement('span');
      legende.className = 'trio-pourcentage chiffres';
      legende.textContent = String(pourcentages[i] ?? '');
      if (i === 1) legende.style.transform = `translateY(-${relevee}px)`;
      colonne.append(legende);
    }
    trio.append(colonne);
  });
  return trio;
}

export function creerRangeeDEtoiles({ nombre = 0 } = {}) {
  const rangee = document.createElement('div');
  rangee.className = 'rangee-etoiles';
  for (const pleine of etatsDuTrio(nombre)) rangee.append(creerEtoile({ pleine, taille: 9, sombre: true }));
  return rangee;
}
