// Tests 12 à 15 du lot 104 (hors liste de la spec) : ouverture sans navigateur et critères 2 à 4, vérifiés dans les fichiers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ouvrirBase, ouvrirBaseDuJeu } from '../../../client/stockage/base-locale.js';
import { MIGRATIONS } from '../../../client/stockage/migrations.js';
import { attendreCode, MIGRATIONS_D_ESSAI } from './scenarios.js';

const RACINE = fileURLToPath(new URL('../../../', import.meta.url));

function fichiersDe(dossier) {
  const resultat = [];
  for (const nom of readdirSync(join(RACINE, dossier))) {
    const chemin = join(RACINE, dossier, nom);
    if (statSync(chemin).isDirectory()) resultat.push(...fichiersDe(join(dossier, nom)));
    else resultat.push(relative(RACINE, chemin).split(sep).join('/'));
  }
  return resultat;
}

test('12. ouvrirBase : migrations invalides → migration_invalide, sans rien ouvrir', async () => {
  let ouvertures = 0;
  const fabrique = {
    open() {
      ouvertures += 1;
      throw new Error('ne doit pas être appelée');
    },
  };
  const invalides = structuredClone(MIGRATIONS_D_ESSAI);
  invalides[3].etapes.push({ etape: 'creerIndex', magasin: 'essai-file', index: 'compte-numero', cle: 'compte', unique: false });
  await attendreCode(ouvrirBase({ nom: 'base-d-essai', migrations: invalides, fabrique }), 'migration_invalide');
  await attendreCode(ouvrirBase({ nom: 'base-d-essai', migrations: [], fabrique }), 'migration_invalide');
  assert.equal(ouvertures, 0);
});

test('12. ouvrirBase : pas d\'IndexedDB, ou ouverture refusée → stockage_indisponible', async () => {
  await attendreCode(ouvrirBase({ nom: 'base-d-essai', migrations: MIGRATIONS }), 'stockage_indisponible');
  const refusee = { open() { throw new Error('refusée'); } };
  await attendreCode(ouvrirBase({ nom: 'base-d-essai', migrations: MIGRATIONS, fabrique: refusee }), 'stockage_indisponible');
});

test('13. ouvrirBaseDuJeu : sans IndexedDB, rejette à chaque appel (l\'appel suivant réessaie)', async () => {
  await attendreCode(ouvrirBaseDuJeu(), 'stockage_indisponible');
  await attendreCode(ouvrirBaseDuJeu(), 'stockage_indisponible');
});

test('14. critère 2 : indexedDB seulement dans base-locale.js ; la suppression d\'une base seulement dans tests/navigateur/', () => {
  const clients = fichiersDe('client').filter((f) => /\.(js|html|css|webmanifest)$/.test(f));
  for (const fichier of [...clients, 'index.html', 'sw.js']) {
    const texte = readFileSync(join(RACINE, fichier), 'utf8');
    if (fichier !== 'client/stockage/base-locale.js') assert.ok(!texte.includes('indexedDB'), `${fichier} contient indexedDB`);
    assert.ok(!texte.includes('deleteDatabase'), `${fichier} contient deleteDatabase`);
  }
  const base = readFileSync(join(RACINE, 'client/stockage/base-locale.js'), 'utf8');
  assert.ok(base.includes('indexedDB'));
  for (const fichier of fichiersDe('tests').filter((f) => /\.(js|html)$/.test(f))) {
    const texte = readFileSync(join(RACINE, fichier), 'utf8');
    if (fichier.startsWith('tests/navigateur/')) continue;
    if (fichier === 'tests/client/stockage/base-locale.test.js') continue; // ce test nomme les mots qu'il cherche
    assert.ok(!texte.includes('deleteDatabase'), `${fichier} contient deleteDatabase`);
  }
});

test('15. critères 3 et 4 : aucun stockage de page ; regles.js est pur', () => {
  for (const fichier of [...fichiersDe('client/stockage'), ...fichiersDe('tests/client/stockage'), ...fichiersDe('tests/navigateur')]) {
    if (fichier === 'tests/client/stockage/base-locale.test.js') continue;
    const texte = readFileSync(join(RACINE, fichier), 'utf8');
    assert.ok(!texte.includes('localStorage'), `${fichier} contient localStorage`);
    assert.ok(!texte.includes('sessionStorage'), `${fichier} contient sessionStorage`);
  }
  const regles = readFileSync(join(RACINE, 'client/stockage/regles.js'), 'utf8');
  for (const interdit of ['indexedDB', 'window', 'document', 'localStorage', 'Date.now', 'Math.random']) {
    assert.ok(!regles.includes(interdit), `regles.js contient ${interdit}`);
  }
  assert.ok(!/^\s*import\s.*from\s+'(?!\.)/m.test(regles), 'regles.js n\'importe que des modules du dépôt');
});
