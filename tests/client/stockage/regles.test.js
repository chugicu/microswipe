// Tests 1 à 9 du lot 104 : fonctions pures du stockage (clés, migrations, schéma, requêtes), sur des données fictives.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bornesDuPrefixe,
  comparerCles,
  creerErreurDeStockage,
  estCleValide,
  extraireCle,
  migrationsAAppliquer,
  simulerSchema,
  validerMigrations,
  verifierRequete,
} from '../../../client/stockage/regles.js';
import { MIGRATIONS } from '../../../client/stockage/migrations.js';
import { MIGRATIONS_D_ESSAI } from './scenarios.js';

const lever = (fonction, code) =>
  assert.throws(fonction, (e) => e instanceof Error && e.code === code && e.message === code, `code attendu : ${code}`);

test('creerErreurDeStockage : message et code valent le code', () => {
  const e = creerErreurDeStockage('base_fermee');
  assert.ok(e instanceof Error);
  assert.equal(e.message, 'base_fermee');
  assert.equal(e.code, 'base_fermee');
});

test('1. estCleValide', () => {
  const boucle = ['a'];
  boucle.push(boucle);
  for (const valide of [1, 0, -1.5, Infinity, 'a', '', new Date(0), [], ['a', 1], [['a'], 2]]) {
    assert.equal(estCleValide(valide), true, String(valide));
  }
  for (const invalide of [NaN, true, null, undefined, {}, new Date('pas une date'), ['a', null], boucle]) {
    assert.equal(estCleValide(invalide), false, String(invalide));
  }
});

test('2. comparerCles : ordre du navigateur', () => {
  assert.equal(comparerCles(1, 2), -1);
  assert.equal(comparerCles(2, 1), 1);
  assert.equal(comparerCles(5, new Date(0)), -1);
  assert.equal(comparerCles(new Date(0), 'a'), -1);
  assert.equal(comparerCles('a', ['a']), -1);
  assert.equal(comparerCles(['a'], 5), 1);
  assert.equal(comparerCles('B', 'a'), -1); // unités de code : majuscule avant minuscule
  assert.equal(comparerCles(new Date(1000), new Date(2000)), -1);
  assert.equal(comparerCles(['a', 1], ['a', 2]), -1);
  assert.equal(comparerCles(['a', 2], ['b']), -1);
  assert.equal(comparerCles(['a'], ['a', 0]), -1);
  assert.equal(comparerCles(['a', 0], ['a']), 1);
  assert.equal(comparerCles(['a', 1], ['a', 1]), 0);
  assert.equal(comparerCles(3, 3), 0);
  assert.equal(comparerCles(new Date(7), new Date(7)), 0);
  lever(() => comparerCles(true, 1), 'cle_invalide');
  lever(() => comparerCles(1, null), 'cle_invalide');
});

test('3. extraireCle', () => {
  assert.equal(extraireCle({ id: 'a' }, 'id'), 'a');
  assert.deepEqual(extraireCle({ compte: 'compte-A', niveau: 'NIV-0001' }, ['compte', 'niveau']), ['compte-A', 'NIV-0001']);
  lever(() => extraireCle({ compte: 'compte-A' }, ['compte', 'niveau']), 'cle_invalide');
  lever(() => extraireCle({ id: true }, 'id'), 'cle_invalide');
  lever(() => extraireCle({ compte: 'compte-A', niveau: false }, ['compte', 'niveau']), 'cle_invalide');
  lever(() => extraireCle({}, 'constructor'), 'cle_invalide'); // une propriété héritée n'est pas un champ
  lever(() => extraireCle(null, 'id'), 'cle_invalide');
});

test('4. bornesDuPrefixe', () => {
  const { depuis, jusqua } = bornesDuPrefixe(['compte-A']);
  assert.deepEqual(depuis, ['compte-A']);
  assert.deepEqual(jusqua, ['compte-A', []]);
  const dedans = (cle) => comparerCles(cle, depuis) >= 0 && comparerCles(cle, jusqua) <= 0;
  assert.equal(dedans(['compte-A', 1]), true);
  assert.equal(dedans(['compte-A', 'NIV-0001']), true);
  assert.equal(dedans(['compte-A', new Date(0)]), true);
  assert.equal(dedans(['compte-A']), true);
  assert.equal(dedans(['compte-B', 1]), false);
  assert.equal(dedans(['compte-9', 1]), false);
  const prefixe = ['compte-A'];
  bornesDuPrefixe(prefixe);
  assert.deepEqual(prefixe, ['compte-A'], 'ne modifie pas son argument');
  lever(() => bornesDuPrefixe('compte-A'), 'cle_invalide');
});

// Une copie d'une liste d'essai, modifiable sans toucher l'originale.
const copie = () => structuredClone(MIGRATIONS_D_ESSAI);

test('5. validerMigrations : listes correctes', () => {
  assert.deepEqual(validerMigrations(MIGRATIONS), []);
  assert.deepEqual(validerMigrations(MIGRATIONS_D_ESSAI.slice(0, 3)), []);
  assert.deepEqual(validerMigrations(MIGRATIONS_D_ESSAI), []);
});

test('5. validerMigrations : une règle par liste altérée', () => {
  const defautsDe = (alterer) => {
    const liste = copie();
    alterer(liste);
    return validerMigrations(liste);
  };
  const attendu = (version, regle) => [{ version, regle }];

  assert.deepEqual(defautsDe((l) => { l[1].version = 3; }), attendu(3, 'version'));
  assert.deepEqual(defautsDe((l) => { l[2].version = 2; }), attendu(2, 'version'));
  assert.deepEqual(defautsDe((l) => { l.splice(1, 1); }).map((d) => d.regle), ['version', 'version']);
  assert.deepEqual(validerMigrations([]), attendu(0, 'version'));
  assert.deepEqual(defautsDe((l) => { l[0].lot = ''; }), attendu(1, 'description'));
  assert.deepEqual(defautsDe((l) => { delete l[1].description; }), attendu(2, 'description'));
  assert.deepEqual(defautsDe((l) => { l[0].etapes[0].etape = 'supprimerMagasin'; }), attendu(1, 'etape_inconnue'));
  assert.deepEqual(defautsDe((l) => { delete l[0].etapes[0].cle; }), attendu(1, 'etape_inconnue'));
  assert.deepEqual(defautsDe((l) => { delete l[2].etapes[1].unique; }), attendu(3, 'etape_inconnue'));
  assert.deepEqual(defautsDe((l) => { l[0].etapes[0].magasin = 'Essai'; }), attendu(1, 'nom_invalide'));
  assert.deepEqual(defautsDe((l) => { l[0].etapes[0].magasin = '1essai'; }), attendu(1, 'nom_invalide'));
  assert.deepEqual(defautsDe((l) => { l[2].etapes[1].index = 'compte_numero'; }), attendu(3, 'nom_invalide'));
  assert.deepEqual(defautsDe((l) => { l[0].etapes[0].cle = ''; }), attendu(1, 'cle_invalide'));
  assert.deepEqual(defautsDe((l) => { l[1].etapes[0].cle = ['compte']; }), attendu(2, 'cle_invalide'));
  assert.deepEqual(defautsDe((l) => { l[1].etapes[0].cle = ['compte', 'compte']; }), attendu(2, 'cle_invalide'));
  assert.deepEqual(defautsDe((l) => { l[1].etapes[0].cle = ['compte', '']; }), attendu(2, 'cle_invalide'));
  assert.deepEqual(defautsDe((l) => { l[1].etapes[0].magasin = 'essai-simple'; }), attendu(2, 'magasin_existant'));
  assert.deepEqual(
    defautsDe((l) => { l[0].etapes.push({ etape: 'creerMagasin', magasin: 'essai-simple', cle: 'id' }); }),
    attendu(1, 'magasin_existant')
  );
  assert.deepEqual(defautsDe((l) => { l[2].etapes[1].magasin = 'essai-inconnu'; }), attendu(3, 'magasin_inconnu'));
  assert.deepEqual(
    defautsDe((l) => { l[2].etapes.reverse(); }),
    attendu(3, 'magasin_inconnu'),
    'un index avant son magasin'
  );
  assert.deepEqual(
    defautsDe((l) => { l[3].etapes.push({ etape: 'creerIndex', magasin: 'essai-file', index: 'compte-numero', cle: 'compte', unique: true }); }),
    attendu(4, 'index_existant')
  );
  assert.equal(validerMigrations('pas une liste').length, 1);
});

test('5. validerMigrations : un nom égal à une propriété d\'objet est un nom ordinaire', () => {
  const liste = copie();
  liste[0].etapes.push({ etape: 'creerMagasin', magasin: 'constructor', cle: 'id' });
  assert.deepEqual(validerMigrations(liste), []);
  assert.ok(Object.hasOwn(simulerSchema(liste).magasins, 'constructor'));
  // Index sur un magasin qui n'existe pas : `constructor` ne doit pas passer pour un magasin.
  const autre = copie();
  autre[0].etapes.push({ etape: 'creerIndex', magasin: 'constructor', index: 'par-id', cle: 'id', unique: false });
  assert.deepEqual(validerMigrations(autre), [{ version: 1, regle: 'magasin_inconnu' }]);
});

test('5. validerMigrations ne modifie pas son argument', () => {
  const liste = copie();
  const avant = JSON.stringify(liste);
  validerMigrations(liste);
  simulerSchema(liste);
  migrationsAAppliquer(liste, 1);
  assert.equal(JSON.stringify(liste), avant);
});

test('6. simulerSchema', () => {
  const schema = simulerSchema(MIGRATIONS_D_ESSAI.slice(0, 3));
  assert.deepEqual(schema, {
    version: 3,
    magasins: {
      'essai-simple': { cle: 'id', index: {} },
      'essai-compose': { cle: ['compte', 'niveau'], index: {} },
      'essai-file': {
        cle: 'numero',
        index: { 'compte-numero': { cle: ['compte', 'numero'], unique: false } },
      },
    },
  });
  assert.deepEqual(Object.keys(simulerSchema(MIGRATIONS_D_ESSAI).magasins), [
    'essai-simple',
    'essai-compose',
    'essai-file',
    'essai-meta',
  ]);
  const invalide = copie();
  invalide[1].version = 5;
  lever(() => simulerSchema(invalide), 'migration_invalide');
});

test('7. migrationsAAppliquer : 3, 2 et 0 migrations', () => {
  assert.equal(migrationsAAppliquer(MIGRATIONS_D_ESSAI.slice(0, 3), 0).length, 3);
  assert.equal(migrationsAAppliquer(MIGRATIONS_D_ESSAI.slice(0, 3), 1).length, 2);
  assert.equal(migrationsAAppliquer(MIGRATIONS_D_ESSAI.slice(0, 3), 3).length, 0);
  assert.deepEqual(migrationsAAppliquer(MIGRATIONS_D_ESSAI, 2).map((m) => m.version), [3, 4]);
});

test('8. verifierRequete', () => {
  const schema = simulerSchema(MIGRATIONS_D_ESSAI).magasins['essai-file'];
  const vide = { index: null, depuis: null, jusqua: null, limite: null };
  assert.deepEqual(verifierRequete(undefined, schema), vide);
  assert.deepEqual(verifierRequete(null, schema), vide);
  assert.deepEqual(verifierRequete({}, schema), vide);
  assert.deepEqual(verifierRequete({ index: 'compte-numero' }, schema), { ...vide, index: 'compte-numero' });
  assert.deepEqual(verifierRequete({ cle: 3 }, schema), { ...vide, depuis: 3, jusqua: 3 });
  assert.deepEqual(verifierRequete({ prefixe: ['compte-A'] }, schema), { ...vide, depuis: ['compte-A'], jusqua: ['compte-A', []] });
  assert.deepEqual(verifierRequete({ depuis: 2 }, schema), { ...vide, depuis: 2 });
  assert.deepEqual(verifierRequete({ jusqua: 9 }, schema), { ...vide, jusqua: 9 });
  assert.deepEqual(verifierRequete({ depuis: 2, jusqua: 9 }, schema), { ...vide, depuis: 2, jusqua: 9 });
  assert.deepEqual(verifierRequete({ limite: 5 }, schema), { ...vide, limite: 5 });

  lever(() => verifierRequete({ cle: 1, prefixe: ['compte-A'] }, schema), 'requete_invalide');
  lever(() => verifierRequete({ cle: 1, depuis: 1 }, schema), 'requete_invalide');
  lever(() => verifierRequete({ prefixe: ['compte-A'], jusqua: 1 }, schema), 'requete_invalide');
  for (const limite of [0, 1.5, '2', -1, NaN, null]) {
    lever(() => verifierRequete({ limite }, schema), 'requete_invalide');
  }
  lever(() => verifierRequete({ inconnu: 1 }, schema), 'requete_invalide');
  lever(() => verifierRequete({ cle: true }, schema), 'requete_invalide');
  lever(() => verifierRequete({ prefixe: 'compte-A' }, schema), 'requete_invalide');
  lever(() => verifierRequete({ depuis: 9, jusqua: 2 }, schema), 'requete_invalide');
  lever(() => verifierRequete('texte', schema), 'requete_invalide');
  lever(() => verifierRequete({ index: 'index-inconnu' }, schema), 'magasin_inconnu');
  lever(() => verifierRequete({ index: 'constructor' }, schema), 'magasin_inconnu');
});

test('9. la liste réelle des migrations tient le schéma', () => {
  assert.doesNotThrow(() => simulerSchema(MIGRATIONS));
  assert.equal(simulerSchema(MIGRATIONS).version, MIGRATIONS.length);
});
