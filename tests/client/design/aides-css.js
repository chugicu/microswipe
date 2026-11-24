// Aides des tests du lot 105 : lecture des tableaux du § 6.1 de la spec, lecture du CSS, parcours de client/, calcul du contraste WCAG.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RACINE = fileURLToPath(new URL('../../../', import.meta.url));
export const lire = (chemin) => readFileSync(join(RACINE, chemin), 'utf8');

export function fichiersDe(dossier) {
  const resultat = [];
  for (const nom of readdirSync(join(RACINE, dossier))) {
    const chemin = join(RACINE, dossier, nom);
    if (statSync(chemin).isDirectory()) resultat.push(...fichiersDe(join(dossier, nom)));
    else resultat.push(relative(RACINE, chemin).split(sep).join('/'));
  }
  return resultat;
}

export function retirerCommentairesCss(texte) {
  return texte.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Commentaires // et /* */ d'un fichier JavaScript ; les chaînes qui contiennent « // » (adresses) ne sont pas rognées.
export function retirerCommentairesJs(texte) {
  return texte
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((ligne) => ligne.replace(/(^|\s)\/\/.*$/, '$1'))
    .join('\n');
}

// Minuscules, espaces simplifiés, « 0.46 » = « .46 » (§ 6.1).
export function normaliser(valeur) {
  return valeur
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/(^|[^\d])0\.(\d)/g, '$1.$2')
    .replace(/\s*,\s*/g, ', ')
    .trim();
}

// Les tableaux de jetons du § 6.1 de docs/specs/lot-105.md, dans l'ordre : [[nom, valeur], …]. Une ligne « a à b » donne plusieurs valeurs.
export function jetonsDeLaSpec() {
  const spec = lire('docs/specs/lot-105.md');
  const debut = spec.indexOf('### 6.1 Jetons');
  const fin = spec.indexOf('**Règles pour tout le code du client**');
  const jetons = [];
  for (const ligne of spec.slice(debut, fin).split('\n')) {
    if (!ligne.startsWith('| `--')) continue;
    const cellules = ligne.trim().slice(1, -1).split('|').map((c) => c.trim());
    const noms = [...cellules[0].matchAll(/`(--[a-z0-9-]+)`/g)].map((m) => m[1]);
    if (noms.length === 2) {
      // plage « --x-1 à --x-N »
      const [, prefixe, premier] = noms[0].match(/^(.*-)(\d+)$/);
      const dernier = Number(noms[1].match(/(\d+)$/)[1]);
      const valeurs = [...cellules[1].matchAll(/`([^`]*)`/g)].map((m) => m[1]);
      if (valeurs.length !== dernier - Number(premier) + 1) throw new Error(`plage mal lue : ${cellules[0]}`);
      valeurs.forEach((valeur, i) => jetons.push([`${prefixe}${Number(premier) + i}`, valeur]));
    } else {
      jetons.push([noms[0], /`([^`]*)`/.exec(cellules[1])[1]]);
    }
  }
  return jetons;
}

// Le bloc :root de jetons.css, hors commentaires : [[nom, valeur], …] dans l'ordre du fichier.
export function jetonsDuCss() {
  const texte = retirerCommentairesCss(lire('client/design/jetons.css'));
  const correspondance = texte.match(/:root\s*\{([\s\S]*)\}/);
  const variables = [];
  for (const ligne of correspondance[1].split(';')) {
    const m = ligne.match(/^\s*(--[a-z0-9-]+)\s*:\s*([\s\S]+?)\s*$/);
    if (m) variables.push([m[1], m[2]]);
  }
  return variables;
}

// --- Contraste WCAG 2.1 (alpha ignoré) ---

export function rgbDe(valeur) {
  const hex = valeur.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
  const rgba = valeur.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])];
  throw new Error(`couleur illisible : ${valeur}`);
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contraste(a, b) {
  const [l1, l2] = [luminance(rgbDe(a)), luminance(rgbDe(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Teinte en degrés (0 à 360) d'une couleur hexadécimale.
export function teinteDe(valeur) {
  const [r, g, b] = rgbDe(valeur).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let h;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  return (h * 60 + 360) % 360;
}
