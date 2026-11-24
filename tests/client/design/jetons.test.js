// Tests 1 à 6 du lot 105 : jetons, source unique des couleurs, tailles de texte, animations, contrastes, palette des bactéries.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lire, fichiersDe, normaliser, jetonsDeLaSpec, jetonsDuCss, retirerCommentairesCss, retirerCommentairesJs, contraste, teinteDe,
} from './aides-css.js';

const css = jetonsDuCss();
const valeurDe = (nom) => css.find(([n]) => n === nom)[1];

test('1. jetons.css reprend exactement les tableaux du § 6.1', () => {
  const texte = retirerCommentairesCss(lire('client/design/jetons.css'));
  assert.equal((texte.match(/:root/g) ?? []).length, 1, 'un seul :root');
  assert.equal(texte.replace(/:root\s*\{[\s\S]*\}/, '').trim(), '', 'aucune autre règle que :root');
  const attendu = jetonsDeLaSpec();
  assert.ok(attendu.length > 100);
  assert.deepEqual(css.map(([n]) => n), attendu.map(([n]) => n), 'mêmes variables, même ordre');
  for (const [nom, valeur] of attendu) assert.equal(normaliser(valeurDe(nom)), normaliser(valeur), nom);
});

const CSS = fichiersDe('client').filter((f) => f.endsWith('.css'));
const JS = fichiersDe('client').filter((f) => f.endsWith('.js'));
const COULEUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;

test('2. une seule source de couleurs', () => {
  for (const f of CSS.filter((c) => c !== 'client/design/jetons.css')) {
    for (const ligne of retirerCommentairesCss(lire(f)).replace(/url\([^)]*\)/g, '').split('\n')) {
      // une ligne de sélecteur (#identifiant) n'est pas une valeur : on ne regarde que « propriété : valeur »
      const m = ligne.match(/^\s*[a-z-]+\s*:(.*)$/i);
      if (m) assert.ok(!COULEUR.test(m[1]), `${f} : couleur en dur dans « ${ligne.trim()} »`);
      assert.ok(!/:root/.test(ligne), `${f} : :root hors de jetons.css`);
    }
  }
  for (const f of JS.filter((j) => j !== 'client/design/milieux.js')) {
    const texte = retirerCommentairesJs(lire(f));
    assert.ok(!/['"`]#[0-9a-fA-F]{3,8}['"`]/.test(texte) && !/rgba?\(|hsla?\(/.test(texte), `${f} : couleur en dur`);
  }
});

test('3. aucune taille de texte en px hors de jetons.css', () => {
  for (const f of CSS.filter((c) => c !== 'client/design/jetons.css')) {
    for (const ligne of retirerCommentairesCss(lire(f)).split('\n')) {
      if (/^\s*(font|font-size)\s*:/.test(ligne)) assert.ok(!/\d\s*px/.test(ligne), `${f} : ${ligne.trim()}`);
    }
  }
  for (const f of JS) assert.ok(!/font-?size[^;\n]*\d\s*px/i.test(retirerCommentairesJs(lire(f))), `${f} : font-size en px`);
});

test("4. seules transform et opacity s'animent", () => {
  for (const f of CSS) {
    const texte = retirerCommentairesCss(lire(f));
    for (const m of texte.matchAll(/(?:^|[\s;{])(transition(?:-property)?)\s*:\s*([^;}]*)/g)) {
      assert.ok(!/\ball\b/.test(m[2]), `${f} : transition all`);
      const proprietes = m[2].split(',').map((p) => p.trim().split(/\s+/)[0]);
      for (const p of proprietes) assert.ok(['transform', 'opacity', 'none'].includes(p), `${f} : transition de « ${p} »`);
    }
    for (const m of texte.matchAll(/@keyframes\s+[\w-]+\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g)) {
      for (const d of m[1].matchAll(/\{([^}]*)\}/g)) {
        for (const decl of d[1].split(';').map((x) => x.trim()).filter(Boolean)) {
          const propriete = decl.split(':')[0].trim();
          assert.ok(['transform', 'opacity'].includes(propriete), `${f} : @keyframes anime « ${propriete} »`);
        }
      }
    }
  }
});

const PAIRES_4_5 = [
  ['--texte', '--surface'], ['--texte-2', '--surface'], ['--texte-3', '--surface'], ['--texte', '--fond'], ['--texte-2', '--fond'],
  ['--surface', '--bleu'], ['--bleu-presse', '--bleu-clair'],
  ['--texte-sur-orange', '--orange'], ['--texte-sur-orange', '--orange-boss-haut'], ['--texte-sur-orange', '--orange-boss-bas'],
  ['--orange-texte', '--orange-clair'], ['--orange-texte-fort', '--orange-clair'],
  ['--surface', '--orange-fonce'], ['--surface', '--juste'], ['--surface', '--faux'],
  ['--juste-clair-texte', '--juste-clair'], ['--faux-clair-texte', '--faux-clair'], ['--revision-texte', '--revision'],
  ['--creme', '--encre'], ['--creme', '--encre-haut'],
  ['--gris-sur-encre', '--encre'], ['--orange-sur-encre', '--encre'], ['--etoile', '--encre'], ['--etoile-vide-sombre', '--encre'],
  ['--scotch-texte', '--scotch'], ['--scotch-revision-texte', '--scotch-revision'],
  ['--etat-maitrise-texte', '--etat-maitrise-fond'], ['--texte-2', '--etat-ferme-fond'], ['--texte-lien-action', '--surface'],
];

test('5. contrastes WCAG 2.1', () => {
  for (const [a, b] of PAIRES_4_5) {
    const c = contraste(valeurDe(a), valeurDe(b));
    assert.ok(c >= 4.5, `${a} sur ${b} : ${c.toFixed(2)}:1`);
  }
  for (const a of ['--bordure-forte', '--etoile-claire']) {
    const c = contraste(valeurDe(a), valeurDe('--surface'));
    assert.ok(c >= 3, `${a} sur --surface : ${c.toFixed(2)}:1`);
  }
});

test('6. palette des bactéries : teintes hors des bandes interdites', () => {
  for (let i = 1; i <= 6; i += 1) {
    const h = teinteDe(valeurDe(`--bacterie-${i}`));
    const interdite = h >= 330 || h <= 20 || (h >= 80 && h <= 185) || (h >= 260 && h <= 330);
    assert.ok(!interdite, `--bacterie-${i} : teinte ${h.toFixed(0)}°`);
  }
});
