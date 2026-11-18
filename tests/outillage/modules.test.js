// Vérifie que Node charge un module ES du client et un fichier CommonJS du serveur.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { TEXTE_ESSAI } from './esm/module-essai.js';

const require = createRequire(import.meta.url);

test('1. le module ES d\'essai s\'importe', () => {
  assert.equal(TEXTE_ESSAI, 'module-es-ok');
});

test('2. le fichier CommonJS d\'essai se charge par createRequire', () => {
  const fichier = require('./cjs/fichier-essai.js');
  assert.equal(fichier.TEXTE_ESSAI_SERVEUR, 'fichier-cjs-ok');
  assert.equal(fichier.doubler(21), 42);
});

test('3. chargé par import(), le fichier CommonJS rend son export sous default', async () => {
  const fichier = await import('./cjs/fichier-essai.js');
  assert.equal(fichier.default.TEXTE_ESSAI_SERVEUR, 'fichier-cjs-ok');
});
