// Tests 1 à 5 du lot 107 : fonctions pures du chargement du contenu et source fictive.
import test from 'node:test';
import assert from 'node:assert/strict';
import { paquetInternesFictif, paquetAdminFictif } from '../../../client/donnees-fictives/paquets-fictifs.js';
import { sourceFictive } from '../../../client/contenu/source-fictive.js';
import {
  creerEnregistrement,
  deciderApresReponse,
  gelerEnProfondeur,
  lireEnregistrement,
} from '../../../client/contenu/regles.js';

const RECU_LE = '2026-11-24T08:00:00.000Z';

test('1. lireEnregistrement : rend l\'enregistrement utilisable, null sinon', () => {
  const paquet = paquetInternesFictif();
  const enregistrement = creerEnregistrement(paquet, RECU_LE);
  assert.equal(lireEnregistrement(enregistrement, 'internes'), enregistrement);
  assert.equal(lireEnregistrement(null, 'internes'), null);
  assert.equal(lireEnregistrement('texte', 'internes'), null);
  assert.equal(lireEnregistrement([], 'internes'), null);
  assert.equal(lireEnregistrement(enregistrement, 'admin'), null);
  assert.equal(lireEnregistrement({ ...enregistrement, type: 'admin' }, 'internes'), null);
  assert.equal(lireEnregistrement({ ...enregistrement, versionContenu: '1' }, 'internes'), null);
  assert.equal(lireEnregistrement({ ...enregistrement, versionContenu: -1 }, 'internes'), null);
  assert.equal(lireEnregistrement({ ...enregistrement, recuLe: 5 }, 'internes'), null);
  assert.equal(lireEnregistrement({ ...enregistrement, paquet: { ...paquet, mondes: 'x' } }, 'internes'), null);
  assert.equal(lireEnregistrement({ ...enregistrement, paquet: { ...paquet, type: 'admin' } }, 'internes'), null);
  assert.equal(
    lireEnregistrement({ ...enregistrement, paquet: { ...paquet, versionContenu: paquet.versionContenu + 1 } }, 'internes'),
    null
  );
});

function reponseAJour(extra = {}) {
  const paquet = paquetInternesFictif();
  return { ok: true, aJour: false, versionContenu: paquet.versionContenu, paquet, ...extra };
}

test('2. deciderApresReponse : chaque ligne du tableau, dans l\'ordre', () => {
  const decider = (r) => deciderApresReponse(r, 'internes');
  const garder = (motif, erreur = null) => ({ action: 'garder', motif, erreur });
  assert.deepEqual(decider(null), garder('reponse_illisible'));
  assert.deepEqual(decider('x'), garder('reponse_illisible'));
  assert.deepEqual(decider({ ok: 'oui' }), garder('reponse_illisible'));
  assert.deepEqual(decider({ ok: false, erreur: 'reglage_invalide' }), garder('refus', 'reglage_invalide'));
  assert.deepEqual(decider({ ok: false, erreur: 5 }), garder('refus', ''));
  assert.deepEqual(decider({ ok: false }), garder('refus', ''));
  assert.deepEqual(decider({ ok: true, aJour: true, versionContenu: 1 }), garder('a_jour'));
  assert.deepEqual(decider({ ok: true, aJour: 'non', paquet: paquetInternesFictif() }), garder('reponse_illisible'));
  assert.deepEqual(decider({ ok: true, aJour: false, versionContenu: 1 }), garder('reponse_illisible'));
  assert.deepEqual(decider(reponseAJour({ paquet: { ...paquetInternesFictif(), mondes: 'x' } })), garder('paquet_mal_forme'));
  assert.deepEqual(decider({ ...reponseAJour(), paquet: paquetAdminFictif() }), garder('type_inattendu'));
  assert.deepEqual(decider(reponseAJour({ versionContenu: 'a' })), garder('version_incoherente'));
  assert.deepEqual(decider(reponseAJour({ versionContenu: 99 })), garder('version_incoherente'));
  assert.deepEqual(decider(reponseAJour()), { action: 'remplacer', motif: 'nouvelle_version', erreur: null });
  // deux défauts : le motif de la première ligne qui s'applique
  assert.equal(decider({ ok: false, aJour: true }).motif, 'refus');
  assert.equal(decider(reponseAJour({ versionContenu: 99, paquet: { ...paquetAdminFictif(), mondes: 'x' } })).motif, 'paquet_mal_forme');
  assert.equal(decider({ ...reponseAJour({ versionContenu: 99 }), paquet: paquetAdminFictif() }).motif, 'type_inattendu');
});

test('3. deciderApresReponse : une version plus petite remplace', () => {
  const paquet = paquetInternesFictif();
  paquet.versionContenu = 1;
  const decision = deciderApresReponse({ ok: true, aJour: false, versionContenu: 1, paquet }, 'internes');
  assert.equal(decision.action, 'remplacer');
  assert.equal(deciderApresReponse.length, 2, 'la fonction ne reçoit pas la version locale');
});

test('4. gelerEnProfondeur : tous les niveaux, même objet', () => {
  const objet = { a: { b: { c: [1, { d: 2 }] } } };
  assert.equal(gelerEnProfondeur(objet), objet);
  assert.ok(Object.isFrozen(objet) && Object.isFrozen(objet.a) && Object.isFrozen(objet.a.b));
  assert.ok(Object.isFrozen(objet.a.b.c) && Object.isFrozen(objet.a.b.c[1]));
});

test('5. sourceFictive', async () => {
  const modele = paquetInternesFictif();
  const premiere = await sourceFictive('internes', null);
  assert.equal(premiere.ok, true);
  assert.equal(premiere.aJour, false);
  assert.deepEqual(premiere.paquet, modele);
  assert.equal(premiere.versionContenu, modele.versionContenu);
  const aJour = await sourceFictive('internes', modele.versionContenu);
  assert.deepEqual(aJour, { ok: true, aJour: true, versionContenu: modele.versionContenu });
  assert.equal('paquet' in aJour, false);
  assert.deepEqual(await sourceFictive('admin', null), { ok: false, erreur: 'paquet_indisponible' });
});
