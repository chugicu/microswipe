// Vérifie les garde-fous du dépôt : .gitignore, crochet pre-commit, configuration git, package.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, accessSync, constants } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('../../', import.meta.url));

const MOTIFS_GITIGNORE = [
  'contenu-local/',
  '*.xlsx', '*.xlsm', '*.xls', '*.ods', '*.csv', '*.tsv',
  'Code.gs', 'Defaults.gs',
  '.clasprc.json', '.env', '.env.*', '*.pem',
  '.claude/settings.local.json',
  'node_modules/', '.DS_Store', 'Thumbs.db',
];
const EXTENSIONS_TABLEUR = ['.xlsx', '.xlsm', '.xls', '.ods', '.csv', '.tsv'];
const NOMS_INTERDITS = ['Code.gs', 'Defaults.gs', '.clasprc.json', '.env'];

function gitDisponible() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function parcourir(dossier, resultat = []) {
  for (const nom of readdirSync(dossier)) {
    if (['.git', 'node_modules', 'contenu-local'].includes(nom)) continue;
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) parcourir(chemin, resultat);
    else resultat.push(chemin);
  }
  return resultat;
}

test('4. .gitignore contient chaque motif sur sa propre ligne', () => {
  const lignes = readFileSync(join(RACINE, '.gitignore'), 'utf8').split('\n').map((l) => l.trim());
  for (const motif of MOTIFS_GITIGNORE) {
    assert.ok(lignes.includes(motif), `motif absent : ${motif}`);
  }
});

test('5. aucun tableur ni fichier interdit dans l\'arbre de travail', () => {
  const trouves = parcourir(RACINE).filter((chemin) => {
    const nom = basename(chemin);
    return EXTENSIONS_TABLEUR.includes(extname(nom).toLowerCase())
      || NOMS_INTERDITS.includes(nom)
      || nom.startsWith('.env.');
  });
  assert.deepEqual(trouves, []);
});

test('6. .githooks/pre-commit existe et est exécutable', { skip: process.platform === 'win32' }, () => {
  const crochet = join(RACINE, '.githooks', 'pre-commit');
  assert.ok(existsSync(crochet));
  accessSync(crochet, constants.X_OK);
});

test('7. core.hooksPath vaut .githooks', { skip: !gitDisponible() }, () => {
  const valeur = execFileSync('git', ['config', 'core.hooksPath'], { cwd: RACINE, encoding: 'utf8' }).trim();
  assert.equal(valeur, '.githooks');
});

test('8. package.json : modules ES, aucune dépendance, aucun package-lock.json', () => {
  const paquet = JSON.parse(readFileSync(join(RACINE, 'package.json'), 'utf8'));
  assert.equal(paquet.type, 'module');
  for (const champ of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    assert.equal(champ in paquet, false, `champ présent : ${champ}`);
  }
  assert.equal(existsSync(join(RACINE, 'package-lock.json')), false);
});
