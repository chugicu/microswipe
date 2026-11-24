// Tests 1 à 3 du lot 103 : noms de caches, caches à supprimer et stratégie par requête du service worker.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { nomDuCache, cachesASupprimer, strategiePour, FICHIERS_DE_LA_COQUILLE } = require('../../../client/coquille/sw/regles-sw.js');

const PORTEE = 'https://chugicu.github.io/microswipe/';

test('1. nomDuCache(3) rend microbio-coquille-v3', () => {
  assert.equal(nomDuCache(3), 'microbio-coquille-v3');
});

test('2. cachesASupprimer garde le cache courant et ne touche jamais aux autres applis', () => {
  const noms = ['microbio-coquille-v3', 'microbio-coquille-v2', 'microbio-coquille-v1', 'carnet-rea-v12', 'echolearn-cache', 'microbio-autre', ''];
  assert.deepEqual(cachesASupprimer(noms, 3), ['microbio-coquille-v2', 'microbio-coquille-v1']);
  assert.deepEqual(cachesASupprimer(['carnet-rea-v12', 'echolearn-cache', 'microbio-autre', ''], 3), []);
  assert.deepEqual(cachesASupprimer([], 3), []);
});

test('3. strategiePour', () => {
  const requete = (methode, url, mode = 'cors') => ({ methode, url, mode });
  const strategie = (r) => strategiePour(r, PORTEE, FICHIERS_DE_LA_COQUILLE);

  assert.equal(strategie(requete('GET', PORTEE, 'navigate')), 'page');
  assert.equal(strategie(requete('GET', PORTEE + 'nimporte/quoi', 'navigate')), 'page');
  assert.equal(strategie(requete('GET', PORTEE + 'index.html')), 'coquille');
  assert.equal(strategie(requete('GET', PORTEE + 'client/demarrage.js')), 'coquille');
  assert.equal(strategie(requete('GET', PORTEE + 'client/demarrage.js?v=2')), 'coquille');
  assert.equal(strategie(requete('GET', PORTEE + 'client/demarrage.js?v=2#ancre')), 'coquille');
  assert.equal(strategie(requete('GET', PORTEE + 'tests/client/coquille/regles.test.js')), 'reseau');
  assert.equal(strategie(requete('GET', PORTEE + 'docs/briefing.md')), 'reseau');
  assert.equal(strategie(requete('POST', PORTEE + 'index.html')), 'ignorer');
  assert.equal(strategie(requete('POST', PORTEE, 'navigate')), 'ignorer');
  assert.equal(strategie(requete('GET', 'https://script.google.com/macros/s/FICTIF/exec')), 'ignorer');
  assert.equal(strategie(requete('GET', 'https://chugicu.github.io/carnet-rea/')), 'ignorer');
  assert.equal(strategie(requete('GET', 'https://chugicu.github.io/carnet-rea/', 'navigate')), 'ignorer');
  assert.equal(strategie(requete('GET', 'https://chugicu.github.io/microswipe-autre/index.html')), 'ignorer');
});
