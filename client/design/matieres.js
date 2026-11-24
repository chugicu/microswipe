// Filtres de bruit des matières (design system § 9.19), posés une fois dans la page et jamais animés.
export const FILTRES_DE_MATIERE = Object.freeze([
  Object.freeze({
    id: 'matiere-marbrure',
    interne: '<feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="3" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 .27  0 0 0 0 .44  0 0 0 0 .62  0 0 0 .16 -.02"/>',
  }),
  Object.freeze({
    id: 'matiere-grain-fin',
    interne: '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .08  0 0 0 0 .12  0 0 0 0 .18  0 0 0 .09 0"/>',
  }),
  Object.freeze({
    id: 'matiere-grain-gelose',
    attributs: ' color-interpolation-filters="sRGB"',
    interne: '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="b"/><feColorMatrix in="b" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.1 0 0 0 -.5" result="clair"/><feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.1 0 0 0 .46" result="fonce"/><feMerge result="grain"><feMergeNode in="clair"/><feMergeNode in="fonce"/></feMerge><feComposite in="grain" in2="SourceGraphic" operator="in"/>',
  }),
]);

export function balisageDesMatieres() {
  const filtres = FILTRES_DE_MATIERE
    .map((f) => `<filter id="${f.id}" x="0" y="0" width="100%" height="100%"${f.attributs ?? ''}>${f.interne}</filter>`)
    .join('');
  return `<svg class="filtres-matieres" width="0" height="0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>${filtres}</defs></svg>`;
}

// Un second appel ne fait rien.
export function installerMatieres() {
  if (document.querySelector('svg.filtres-matieres')) return;
  document.body.insertAdjacentHTML('afterbegin', balisageDesMatieres());
}
