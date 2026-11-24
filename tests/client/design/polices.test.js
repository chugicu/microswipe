// Tests 7 à 9 du lot 105 : polices hébergées, @font-face, aucune adresse de Google dans le dépôt servi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE, lire, fichiersDe, retirerCommentairesCss } from './aides-css.js';

const css = retirerCommentairesCss(lire('client/design/polices.css'));
const blocs = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]);
const fichiersPolices = fichiersDe('client/polices');

test('7. fichiers woff2 valides, cités, licences présentes', () => {
  const woff2 = fichiersPolices.filter((f) => f.endsWith('.woff2'));
  assert.equal(woff2.length, 6);
  for (const f of woff2) {
    assert.equal(readFileSync(join(RACINE, f)).subarray(0, 4).toString('latin1'), 'wOF2', f);
    assert.ok(css.includes(`../polices/${f.split('/').pop()}`), `non cité : ${f}`);
  }
  for (const m of css.matchAll(/url\(([^)]*)\)/g)) {
    assert.ok(existsSync(join(RACINE, 'client/design', m[1])), `fichier absent : ${m[1]}`);
  }
  for (const nom of ['OFL-inter.txt', 'OFL-bricolage-grotesque.txt', 'OFL-caveat.txt']) {
    assert.ok(lire(`client/polices/${nom}`).includes('SIL OPEN FONT LICENSE'), nom);
  }
});

test('8. @font-face : swap, unicode-range, familles et graisses', () => {
  const graisses = { Inter: [], 'Bricolage Grotesque': [], Caveat: [] };
  for (const bloc of blocs) {
    assert.match(bloc, /font-display:\s*swap/);
    assert.match(bloc, /unicode-range:/);
    const famille = bloc.match(/font-family:\s*'([^']+)'/)[1];
    assert.ok(famille in graisses, famille);
    const [min, max = min] = bloc.match(/font-weight:\s*([\d ]+);/)[1].trim().split(/\s+/).map(Number);
    graisses[famille].push([min, max]);
  }
  const couvre = (g, a, b) => g.some(([min, max]) => min <= a && max >= b);
  assert.ok(couvre(graisses.Inter, 400, 800));
  assert.ok(couvre(graisses['Bricolage Grotesque'], 600, 700));
  assert.ok(couvre(graisses.Caveat, 600, 700));
});

test('9. aucune adresse de Google dans le dépôt servi', () => {
  const fichiers = ['index.html', 'sw.js', ...fichiersDe('client').filter((f) => !/\.(woff2|png)$/.test(f))];
  for (const f of fichiers) assert.ok(!/googleapis|gstatic/.test(lire(f)), f);
});
