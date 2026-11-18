// Vérifie la présence des documents copiés et du logo, leurs renvois, et rapporte les identifiants du tableur.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('../../', import.meta.url));

const DOCUMENTS = [
  'CLAUDE.md',
  'docs/briefing.md',
  'docs/architecture.md',
  'docs/schema-de-donnees.md',
  'docs/plan-de-developpement.md',
  'docs/specs/index.md',
  'docs/specs/lot-101.md',
];
const LOGOS = ['client/images/logo-ios.png', 'client/images/logo-android.png'];
const RENVOIS_INTERDITS = [
  'claude/specs/', 'claude/briefing', 'claude/architecture', 'claude/schema',
  'claude/plan', 'claude/CLAUDE', 'claude/design-system', 'claude/depot',
];
const PREFIXES_IDENTIFIANTS = ['ENT', 'NF', 'GN', 'AUT', 'CGP', 'BGP', 'ANA', 'RNC', 'RNS', 'PH', 'REG', 'AB', 'CC', 'MT', 'POS', 'PE'];
const MOTIF_IDENTIFIANT = new RegExp(`(?<![A-Za-z0-9_])(?:${PREFIXES_IDENTIFIANTS.join('|')})-\\d+(?![A-Za-z0-9_])`, 'g');

function fichiersMarkdown(dossier, resultat = []) {
  for (const nom of readdirSync(dossier)) {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) fichiersMarkdown(chemin, resultat);
    else if (nom.endsWith('.md')) resultat.push(chemin);
  }
  return resultat;
}

function fichiersADocumenter() {
  const dansDocs = existsSync(join(RACINE, 'docs')) ? fichiersMarkdown(join(RACINE, 'docs')) : [];
  return [join(RACINE, 'CLAUDE.md'), ...dansDocs];
}

function nonVide(chemin) {
  return existsSync(chemin) && statSync(chemin).size > 0;
}

test('9. chaque document copié et chaque fichier du logo existe et n\'est pas vide', (t) => {
  for (const chemin of [...DOCUMENTS, ...LOGOS]) {
    assert.ok(nonVide(join(RACINE, chemin)), `absent ou vide : ${chemin}`);
  }
  if (!nonVide(join(RACINE, 'docs/design-system.md'))) {
    t.todo('docs/design-system.md absent : les lots 105 et 106 ne peuvent pas commencer');
  }
});

test('10. aucun renvoi vers le projet claude.ai dans docs/ ni CLAUDE.md', () => {
  const trouves = [];
  for (const fichier of fichiersADocumenter()) {
    const nom = relative(RACINE, fichier);
    if (nom === 'docs/specs/lot-101.md') continue;
    readFileSync(fichier, 'utf8').split('\n').forEach((ligne, i) => {
      if (RENVOIS_INTERDITS.some((texte) => ligne.includes(texte))) trouves.push(`${nom}:${i + 1}`);
    });
  }
  assert.deepEqual(trouves, []);
});

test('11. rapport : identifiants au format du tableur dans docs/ et CLAUDE.md', (t) => {
  const rapport = [];
  for (const fichier of fichiersADocumenter()) {
    const nom = relative(RACINE, fichier);
    readFileSync(fichier, 'utf8').split('\n').forEach((ligne, i) => {
      for (const identifiant of ligne.match(MOTIF_IDENTIFIANT) ?? []) {
        rapport.push(`${nom}:${i + 1}  ${identifiant}`);
      }
    });
  }
  t.diagnostic(`RAPPORT TEST 11 : ${rapport.length} identifiant(s)\n${rapport.join('\n')}`);
});

test('12. CLAUDE.md compte moins de 200 lignes', () => {
  const lignes = readFileSync(join(RACINE, 'CLAUDE.md'), 'utf8').split('\n').length;
  assert.ok(lignes < 200, `${lignes} lignes`);
});
