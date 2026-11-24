// Tests 10 à 15 du lot 105 : milieux, dialogue (règles), trio d'étoiles, scotch, rebranchement, matières, page d'entrée.
import test from 'node:test';
import assert from 'node:assert/strict';
import { lire, retirerCommentairesJs } from './aides-css.js';
import { MILIEUX, milieuDe, CLE_MILIEU_DE_SECOURS } from '../../../client/design/milieux.js';
import { preparerDialogue } from '../../../client/design/regles-dialogue.js';
import { etatsDuTrio, ORDRE_DE_REMPLISSAGE } from '../../../client/design/etoiles.js';
import { angleDuScotch } from '../../../client/design/scotch.js';
import { balisageDesMatieres, FILTRES_DE_MATIERE } from '../../../client/design/matieres.js';
import { TEXTES_RECHARGEMENT } from '../../../client/contenu/rechargement.js';

test('10. milieuDe', () => {
  assert.deepEqual(Object.keys(MILIEUX), ['sang', 'bcp', 'chocolat', 'neutre']);
  assert.deepEqual(MILIEUX.sang, { centre: '#A83A45', milieu: '#87212D', bord: '#6A1520' });
  assert.deepEqual(MILIEUX.bcp, { centre: '#86AED3', milieu: '#5E8CB9', bord: '#46709E' });
  assert.deepEqual(MILIEUX.chocolat, { centre: '#94694A', milieu: '#74502F', bord: '#5A3B20' });
  assert.deepEqual(MILIEUX.neutre, { centre: '#E3D7B4', milieu: '#CDBE93', bord: '#B8A77A' });
  assert.equal(CLE_MILIEU_DE_SECOURS, 'neutre');
  for (const cle of Object.keys(MILIEUX)) assert.equal(milieuDe(cle), MILIEUX[cle]);
  assert.equal(milieuDe(' sang '), MILIEUX.sang);
  for (const cle of ['', 'Sang', 'inconnu', null, undefined, 42]) assert.equal(milieuDe(cle), MILIEUX.neutre, String(cle));
  assert.ok(Object.isFrozen(milieuDe('sang')) && Object.isFrozen(MILIEUX));
});

test('11. preparerDialogue', () => {
  const surAppui = () => {};
  const complet = { titre: 'Titre d’essai', texte: 'Texte', action: { libelle: 'Jouer', surAppui }, secondaire: { libelle: 'Plus tard', surAppui }, irreversible: false, inconnue: 1 };
  const r = preparerDialogue(complet);
  assert.ok(Object.isFrozen(r));
  assert.deepEqual(r, { titre: 'Titre d’essai', texte: 'Texte', boutons: [{ role: 'action', libelle: 'Jouer' }, { role: 'secondaire', libelle: 'Plus tard' }], fermerSurVoile: true, fermerSurEchap: true });
  const sans = preparerDialogue({ titre: 'T', texte: 'x', action: { libelle: 'Ok', surAppui } });
  assert.equal(sans.boutons[1].libelle, 'Annuler');
  const irr = preparerDialogue({ ...complet, irreversible: true });
  assert.equal(irr.fermerSurVoile, false);
  assert.equal(irr.fermerSurEchap, true);
  const mauvais = [
    { texte: 'x', action: { libelle: 'Ok', surAppui } },
    { titre: '', texte: 'x', action: { libelle: 'Ok', surAppui } },
    { titre: 'T', texte: 'x' },
    { titre: 'T', texte: 'x', action: { libelle: 'Ok', surAppui: 'non' } },
    { titre: 'T', texte: 'x', action: { libelle: 'Ok', surAppui }, secondaire: { libelle: 'A', surAppui: null } },
  ];
  for (const options of mauvais) assert.throws(() => preparerDialogue(options), { code: 'dialogue_mal_forme' });
});

test('12. trio d’étoiles et angle du scotch', () => {
  assert.deepEqual(etatsDuTrio(0), [false, false, false]);
  assert.deepEqual(etatsDuTrio(1), [true, false, false]);
  assert.deepEqual(etatsDuTrio(2), [true, false, true]);
  assert.deepEqual(etatsDuTrio(3), [true, true, true]);
  assert.deepEqual(etatsDuTrio(5), [true, true, true]);
  for (const n of [-1, 1.5, '2', null]) assert.deepEqual(etatsDuTrio(n), [false, false, false], String(n));
  assert.deepEqual(ORDRE_DE_REMPLISSAGE, ['gauche', 'droite', 'milieu']);
  assert.equal(angleDuScotch(-10), -4);
  assert.equal(angleDuScotch(10), 3);
  assert.equal(angleDuScotch(-2), -2);
  assert.equal(angleDuScotch('a'), 0);
  assert.equal(angleDuScotch(NaN), 0);
});

test('13. rebranchement du dialogue de rechargement', () => {
  const source = retirerCommentairesJs(lire('client/contenu/dialogue-rechargement.js'));
  assert.match(source, /import \{ ouvrirDialogue \} from '\.\.\/design\/dialogue\.js'/);
  assert.ok(!source.includes('createElement'));
  const css = lire('client/coquille/coquille.css').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const interdit of ['.dialogue', '.bouton-principal', '.bouton-secondaire', ':root']) assert.ok(!css.includes(interdit), interdit);
  const spec = lire('docs/specs/lot-107.md');
  const ligne = (etiquette) => spec.split('\n').find((l) => l.startsWith(`| ${etiquette} |`)).match(/`([^`]*)`/)[1];
  assert.deepEqual({ ...TEXTES_RECHARGEMENT }, {
    titre: ligne('Titre'),
    texte: ligne('Texte'),
    recharger: ligne('Action (bouton principal)'),
    plusTard: ligne('Bouton secondaire'),
  });
});

test('14. balisageDesMatieres', () => {
  const b = balisageDesMatieres();
  assert.match(b, /aria-hidden="true"/);
  assert.match(b, /width="0" height="0"/);
  assert.deepEqual(FILTRES_DE_MATIERE.map((f) => f.id), ['matiere-marbrure', 'matiere-grain-fin', 'matiere-grain-gelose']);
  for (const id of FILTRES_DE_MATIERE.map((f) => f.id)) assert.ok(b.includes(`id="${id}"`), id);
  for (const v of [
    'baseFrequency=".012 .02" numOctaves="3" seed="11"', '0 0 0 0 .27  0 0 0 0 .44  0 0 0 0 .62  0 0 0 .16 -.02',
    'baseFrequency=".85" numOctaves="2" seed="4"', '0 0 0 0 .08  0 0 0 0 .12  0 0 0 0 .18  0 0 0 .09 0',
    'baseFrequency=".9" numOctaves="2" seed="3" result="b"', '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.1 0 0 0 -.5',
    '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.1 0 0 0 .46', 'color-interpolation-filters="sRGB"', 'operator="in"',
  ]) assert.ok(b.includes(v), v);
  assert.equal((b.match(/<feTurbulence/g) ?? []).length, 3);
  assert.equal((b.match(/<svg/g) ?? []).length, 1);
});

test('15. index.html et démarrage', () => {
  const html = lire('index.html');
  const ordre = ['client/design/polices.css', 'client/design/jetons.css', 'client/design/composants.css', 'client/coquille/coquille.css'].map((c) => html.indexOf(`href="${c}"`));
  assert.ok(ordre.every((p) => p >= 0));
  assert.deepEqual([...ordre].sort((a, b) => a - b), ordre);
  assert.equal((html.match(/<script/g) ?? []).length, 1);
  assert.match(lire('client/demarrage.js'), /const DEMARRAGES_BRANCHES = \[installerMatieres,/);
});
