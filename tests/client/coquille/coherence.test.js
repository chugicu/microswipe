// Tests 8 à 12 du lot 103 : cohérence entre la version, la liste de la coquille, le manifeste, la page d'entrée et les interdits de stockage.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERSION_CLIENT } from '../../../client/version.js';

const require = createRequire(import.meta.url);
const { FICHIERS_DE_LA_COQUILLE, DOSSIERS_HORS_COQUILLE } = require('../../../client/coquille/sw/regles-sw.js');

const RACINE = fileURLToPath(new URL('../../../', import.meta.url));
const lire = (chemin) => readFileSync(join(RACINE, chemin), 'utf8');

function fichiersDe(dossier) {
  const resultat = [];
  for (const nom of readdirSync(join(RACINE, dossier))) {
    const chemin = join(RACINE, dossier, nom);
    if (statSync(chemin).isDirectory()) resultat.push(...fichiersDe(join(dossier, nom)));
    else resultat.push(relative(RACINE, chemin).split(sep).join('/'));
  }
  return resultat;
}

test('8. VERSION_DE_LA_COQUILLE de sw.js égale VERSION_CLIENT', () => {
  const correspondance = lire('sw.js').match(/^const VERSION_DE_LA_COQUILLE = (\d+);$/m);
  assert.ok(correspondance, 'la constante doit tenir sur une seule ligne');
  assert.equal(Number(correspondance[1]), VERSION_CLIENT);
});

test('9. la liste de la coquille est exacte', () => {
  for (const fichier of FICHIERS_DE_LA_COQUILLE) {
    if (fichier === './') continue;
    assert.ok(existsSync(join(RACINE, fichier)), `fichier absent : ${fichier}`);
  }
  const attendus = [
    'index.html',
    'manifest.webmanifest',
    ...fichiersDe('client').filter(
      (f) => !DOSSIERS_HORS_COQUILLE.some((d) => f.startsWith(d)) && f.split('/').pop() !== 'package.json'
    ),
  ];
  for (const fichier of attendus) assert.ok(FICHIERS_DE_LA_COQUILLE.includes(fichier), `absent de la liste : ${fichier}`);
  assert.ok(FICHIERS_DE_LA_COQUILLE.includes('./'));
  for (const fichier of FICHIERS_DE_LA_COQUILLE) {
    assert.ok(!/^(tests|docs|serveur|contenu-local)\//.test(fichier), `ne doit pas figurer : ${fichier}`);
  }
});

test('10. le manifeste est conforme', () => {
  const manifeste = JSON.parse(lire('manifest.webmanifest'));
  assert.equal(manifeste.name, 'MicroSwipe – Réanimation Guadeloupe');
  assert.equal(manifeste.short_name, 'MicroSwipe');
  assert.equal(manifeste.start_url, './');
  assert.equal(manifeste.scope, './');
  assert.equal(manifeste.display, 'standalone');
  assert.equal(manifeste.orientation, 'portrait');
  assert.equal(manifeste.lang, 'fr');
  assert.equal(manifeste.background_color, '#FFE9B0');
  assert.ok(manifeste.icons.length >= 2);
  for (const icone of manifeste.icons) {
    const chemin = join(RACINE, icone.src);
    assert.ok(existsSync(chemin), `icône absente : ${icone.src}`);
    const octets = readFileSync(chemin);
    assert.equal(octets.subarray(1, 4).toString('latin1'), 'PNG');
    const [largeur, hauteur] = [octets.readUInt32BE(16), octets.readUInt32BE(20)];
    assert.equal(`${largeur}x${hauteur}`, icone.sizes, icone.src);
  }
  assert.deepEqual(manifeste.icons.map((i) => i.sizes).sort(), ['192x192', '512x512']);
});

test('11. aucun stockage local interdit, caches seulement dans sw.js, aucun appel réseau dans client/', () => {
  const fichiersDuLot = ['index.html', 'manifest.webmanifest', 'sw.js', ...fichiersDe('client').filter((f) => /\.(js|css|html|webmanifest)$/.test(f))];
  for (const fichier of fichiersDuLot) {
    const texte = lire(fichier);
    assert.ok(!texte.includes('localStorage'), `${fichier} contient localStorage`);
    assert.ok(!texte.includes('sessionStorage'), `${fichier} contient sessionStorage`);
    if (fichier !== 'sw.js') assert.ok(!/\bcaches\s*[.[]/.test(texte), `${fichier} appelle caches`);
    if (fichier.startsWith('client/')) assert.ok(!texte.includes('fetch('), `${fichier} contient fetch(`);
  }
  assert.ok(/\bcaches\s*\./.test(lire('sw.js')));
});

test('12. index.html : titre, manifeste, icône de l\'iPhone, un seul script de démarrage', () => {
  const html = lire('index.html');
  assert.match(html, /<title>MicroSwipe<\/title>/);
  assert.match(html, /<link rel="manifest" href="manifest\.webmanifest">/);
  assert.match(html, /<link rel="apple-touch-icon" href="client\/images\/icone-apple-180\.png">/);
  const scripts = html.match(/<script\b[^>]*>/g) || [];
  assert.deepEqual(scripts, ['<script type="module" src="client/demarrage.js">']);
  assert.match(html, /<html lang="fr">/);
});
