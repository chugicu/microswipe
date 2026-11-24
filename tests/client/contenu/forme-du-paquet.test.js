// Tests 1 à 6 du lot 102 : le contrôle de forme d'un paquet de contenu, sur des données fictives.

import test from 'node:test';
import assert from 'node:assert/strict';
import { controlerFormeDuPaquet } from '../../../client/contenu/forme-du-paquet.js';
import { paquetAdminFictif, paquetInternesFictif } from '../../../client/donnees-fictives/paquets-fictifs.js';

const reglesDe = (defauts) => [...new Set(defauts.map((defaut) => defaut.regle))].sort();
const contient = (defauts, regle, chemin) => defauts.some((defaut) => defaut.regle === regle && defaut.chemin === chemin);

test('1. les deux paquets fictifs n\'ont aucun défaut', () => {
  assert.deepEqual(controlerFormeDuPaquet(paquetInternesFictif()), []);
  assert.deepEqual(controlerFormeDuPaquet(paquetAdminFictif()), []);
});

// Chaque cas : nom, paquet de départ, altération, règle attendue, chemin attendu.
const CAS = [
  ['type inconnu', 'internes', (p) => { p.type = 'autre'; }, 'type', 'type'],
  ['genereLe retirée', 'internes', (p) => { delete p.genereLe; }, 'cle_manquante', 'genereLe'],
  ['clé en trop', 'internes', (p) => { p.autre = 1; }, 'cle_inattendue', 'autre'],
  ['etatDesQuestions dans « internes »', 'internes', (p) => { p.etatDesQuestions = {}; }, 'cle_inattendue', 'etatDesQuestions'],
  ['etatDesQuestions absent de « admin »', 'admin', (p) => { delete p.etatDesQuestions; }, 'cle_manquante', 'etatDesQuestions'],
  ['versionContenu en texte', 'internes', (p) => { p.versionContenu = '1'; }, 'version', 'versionContenu'],
  ['versionContenu négative', 'internes', (p) => { p.versionContenu = -1; }, 'version', 'versionContenu'],
  ['versionContenu décimale', 'internes', (p) => { p.versionContenu = 1.5; }, 'version', 'versionContenu'],
  ['genereLe sans heure', 'internes', (p) => { p.genereLe = '2027-01-01'; }, 'date', 'genereLe'],
  ['section remplacée par un objet', 'internes', (p) => { p.questions = {}; }, 'section', 'questions'],
  ['ligne remplacée par un texte', 'internes', (p) => { p.questions[2] = 'texte'; }, 'section', 'questions/ligne-3'],
  ['ligne sans ID', 'internes', (p) => { delete p.questions[0].ID; }, 'id', 'questions/ligne-1/ID'],
  ['ID vide après retrait des espaces', 'internes', (p) => { p.niveaux[1].ID = '   '; }, 'id', 'niveaux/ligne-2/ID'],
  ['même ID deux fois', 'internes', (p) => { p.questions[1].ID = p.questions[0].ID; }, 'id', 'questions/Q-000001/ID'],
  ['même ID deux fois dans un onglet de faits', 'internes', (p) => { p.faits.Faits_fictifs[1].ID = p.faits.Faits_fictifs[0].ID; }, 'id', 'faits/Faits_fictifs/FF-01/ID'],
  ['nombre dans une ligne', 'internes', (p) => { p.composition[0].Ordre = 1; }, 'valeur_non_texte', 'composition/CMP-000001/Ordre'],
  ['nombre dans un fait', 'admin', (p) => { p.faits.Autres_faits_fictifs[0].Page = 1; }, 'valeur_non_texte', 'faits/Autres_faits_fictifs/AF-01/Page'],
  ['nombre dans reglages', 'internes', (p) => { p.reglages['etoiles.seuil_1'] = 60; }, 'valeur_non_texte', 'reglages/etoiles.seuil_1'],
  ['colonne réservée dans une ligne « internes »', 'internes', (p) => { p.questions[0].Statut = 'Validé'; }, 'colonne_reservee', 'questions/Q-000001/Statut'],
  ['colonne réservée dans un fait « internes »', 'internes', (p) => { p.faits.Faits_fictifs[0]['Champs validés'] = ''; }, 'colonne_reservee', 'faits/Faits_fictifs/FF-01/Champs validés'],
  ['clés de faits inversées', 'internes', (p) => { p.faits = { Faits_fictifs: p.faits.Faits_fictifs, Autres_faits_fictifs: p.faits.Autres_faits_fictifs }; }, 'faits', 'faits'],
  ['faits en tableau', 'internes', (p) => { p.faits = []; }, 'faits', 'faits'],
  ['onglet de faits qui n\'est pas un tableau', 'internes', (p) => { p.faits.Faits_fictifs = {}; }, 'faits', 'faits/Faits_fictifs'],
  ['ligne de faits qui n\'est pas un objet', 'internes', (p) => { p.faits.Faits_fictifs[0] = 'texte'; }, 'faits', 'faits/Faits_fictifs/ligne-1'],
  ['compositionPrevue négatif', 'internes', (p) => { p.compositionPrevue['NIV-0001'] = -1; }, 'composition_prevue', 'compositionPrevue/NIV-0001'],
  ['compositionPrevue en tableau', 'internes', (p) => { p.compositionPrevue = []; }, 'composition_prevue', 'compositionPrevue'],
  ['reglages en tableau', 'internes', (p) => { p.reglages = []; }, 'reglages', 'reglages'],
  ['entrée de etatDesQuestions sans motifs', 'admin', (p) => { delete p.etatDesQuestions['Q-000007'].motifs; }, 'etat_des_questions', 'etatDesQuestions/Q-000007'],
  ['entrée de etatDesQuestions avec servie en texte', 'admin', (p) => { p.etatDesQuestions['Q-000001'].servie = 'oui'; }, 'etat_des_questions', 'etatDesQuestions/Q-000001'],
  ['etatDesQuestions en tableau', 'admin', (p) => { p.etatDesQuestions = []; }, 'etat_des_questions', 'etatDesQuestions'],
];

for (const [nom, type, alterer, regle, chemin] of CAS) {
  test(`2. ${nom} → ${regle}`, () => {
    const paquet = type === 'admin' ? paquetAdminFictif() : paquetInternesFictif();
    alterer(paquet);
    const defauts = controlerFormeDuPaquet(paquet);
    assert.ok(contient(defauts, regle, chemin), `défaut attendu absent : ${regle} ${chemin} ; rendu : ${JSON.stringify(defauts)}`);
    assert.deepEqual(reglesDe(defauts), [regle], 'une seule règle doit être signalée');
  });
}

test('2. la même colonne réservée dans le paquet « admin » ne donne aucun défaut', () => {
  assert.ok('Statut' in paquetAdminFictif().questions[0]);
  assert.deepEqual(controlerFormeDuPaquet(paquetAdminFictif()), []);
});

test('2. un type inconnu n\'examine pas les règles propres à un type', () => {
  const paquet = paquetInternesFictif();
  paquet.type = 'autre';
  paquet.etatDesQuestions = 'n\'importe quoi';
  paquet.questions[0].Statut = 'Validé';
  assert.deepEqual(controlerFormeDuPaquet(paquet), [{ regle: 'type', chemin: 'type' }]);
});

test('2. une section vide est bien formée', () => {
  const paquet = paquetInternesFictif();
  paquet.questions = [];
  assert.deepEqual(controlerFormeDuPaquet(paquet), []);
});

test('3. plusieurs défauts à la fois : tous sont rendus', () => {
  const paquet = paquetAdminFictif();
  paquet.versionContenu = '1';
  paquet.genereLe = '2027-01-01';
  paquet.autre = true;
  paquet.questions[0].Ordre = 1;
  paquet.questions[1].ID = paquet.questions[0].ID;
  paquet.reglages = [];
  delete paquet.etatDesQuestions['Q-000007'].servie;
  const defauts = controlerFormeDuPaquet(paquet);
  assert.ok(contient(defauts, 'version', 'versionContenu'));
  assert.ok(contient(defauts, 'date', 'genereLe'));
  assert.ok(contient(defauts, 'cle_inattendue', 'autre'));
  assert.ok(contient(defauts, 'valeur_non_texte', 'questions/Q-000001/Ordre'));
  assert.ok(contient(defauts, 'id', 'questions/Q-000001/ID'));
  assert.ok(contient(defauts, 'reglages', 'reglages'));
  assert.ok(contient(defauts, 'etat_des_questions', 'etatDesQuestions/Q-000007'));
  assert.equal(defauts.length, 7);
});

test('4. aucun défaut ne contient une valeur du contenu', () => {
  const repere = 'Valeur repérable 42';
  const nombre = 987654;
  const paquet = paquetInternesFictif();
  paquet.questions[2]['Énoncé'] = repere;
  assert.deepEqual(controlerFormeDuPaquet(paquet), [], 'une cellule en texte est bien formée');

  paquet.questions[2]['Énoncé'] = nombre;
  paquet.faits.Faits_fictifs[1].Libellé = nombre;
  paquet.reglages['accueil.logo'] = nombre;
  const defauts = controlerFormeDuPaquet(paquet);
  assert.equal(defauts.length, 3);
  for (const defaut of defauts) {
    const texte = JSON.stringify(defaut);
    assert.ok(!texte.includes(repere), `le texte repérable apparaît dans ${texte}`);
    assert.ok(!texte.includes(String(nombre)), `le nombre apparaît dans ${texte}`);
  }
  assert.ok(contient(defauts, 'valeur_non_texte', 'questions/Q-000003/Énoncé'));
  assert.ok(contient(defauts, 'valeur_non_texte', 'faits/Faits_fictifs/FF-02/Libellé'));
  assert.ok(contient(defauts, 'valeur_non_texte', 'reglages/accueil.logo'));
});

test('5. null, un tableau et un texte donnent un seul défaut « objet »', () => {
  for (const valeur of [null, [], 'paquet', 42, undefined]) {
    assert.deepEqual(controlerFormeDuPaquet(valeur), [{ regle: 'objet', chemin: 'paquet' }]);
  }
});

test('6. le contrôle ne modifie pas le paquet reçu', () => {
  for (const alterer of [(p) => p, (p) => { p.questions[0].Ordre = 1; p.type = 'autre'; p.faits = []; }]) {
    const paquet = paquetAdminFictif();
    alterer(paquet);
    const avant = structuredClone(paquet);
    controlerFormeDuPaquet(paquet);
    assert.deepEqual(paquet, avant);
  }
});
