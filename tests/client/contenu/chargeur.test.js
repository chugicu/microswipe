// Tests 6 à 19 et 24 du lot 107 : le chargeur de contenu, sur la base en mémoire du lot 104 et une source doublée.
import test from 'node:test';
import assert from 'node:assert/strict';
import { creerChargeurDeContenu } from '../../../client/contenu/chargeur.js';
import { creerEnregistrement } from '../../../client/contenu/regles.js';
import { paquetAdminFictif, paquetInternesFictif } from '../../../client/donnees-fictives/paquets-fictifs.js';
import { MIGRATIONS } from '../../../client/stockage/migrations.js';
import { creerBaseEnMemoire } from '../stockage/base-memoire.js';
import { MIGRATIONS_D_ESSAI } from '../stockage/scenarios.js';

const MAINTENANT = () => '2026-11-24T08:00:00.000Z';

function paquetDeVersion(version) {
  const paquet = paquetInternesFictif();
  paquet.versionContenu = version;
  return paquet;
}

// Source doublée : rend un paquet de la version voulue, ou à jour si la version locale est la même.
function creerSource(versionServeur = 1, surAppel = () => {}) {
  const appels = [];
  const source = async (type, versionLocale) => {
    appels.push({ type, versionLocale });
    surAppel();
    if (versionLocale === versionServeur) return { ok: true, aJour: true, versionContenu: versionServeur };
    return { ok: true, aJour: false, versionContenu: versionServeur, paquet: paquetDeVersion(versionServeur) };
  };
  return { source, appels };
}

function chargeurSur(base, source) {
  return creerChargeurDeContenu({ obtenirBase: async () => base, source, maintenant: MAINTENANT });
}

function compter(chargeur, nom = 'contenu-change') {
  const vus = [];
  chargeur.evenements.addEventListener(nom, (e) => vus.push(e.detail));
  return vus;
}

// Doublure de console.error : rend les messages écrits.
function espionnerConsole(t) {
  const messages = [];
  t.mock.method(console, 'error', (...args) => messages.push(args.join(' ')));
  return messages;
}

test('6. première ouverture', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const { source } = creerSource(1);
  const chargeur = chargeurSur(base, source);
  const changements = compter(chargeur);
  await chargeur.pret;
  assert.equal(chargeur.lirePaquet(), null);
  assert.equal(chargeur.versionContenuLocale(), null);
  const resultat = await chargeur.charger();
  assert.deepEqual(resultat, { resultat: 'remplace', motif: 'nouvelle_version' });
  const enregistrement = await base.lire('contenu', 'internes');
  assert.equal(enregistrement.versionContenu, 1);
  assert.equal(enregistrement.recuLe, MAINTENANT());
  assert.deepEqual(chargeur.lirePaquet(), paquetDeVersion(1));
  assert.deepEqual(changements, [{ type: 'internes', versionContenu: 1 }]);
  assert.deepEqual(chargeur.etat(), { present: true, versionContenu: 1, range: true, dernierResultat: resultat });
});

test('7. ouverture suivante', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  await chargeurSur(base, creerSource(1).source).charger();
  let changementsAvantSource = null;
  let chargeur;
  const { source, appels } = creerSource(1, () => {
    changementsAvantSource = changements.length;
  });
  chargeur = chargeurSur(base, source);
  const changements = compter(chargeur);
  await chargeur.pret;
  assert.deepEqual(chargeur.lirePaquet(), paquetDeVersion(1));
  assert.equal(appels.length, 0);
  assert.equal(changements.length, 1);
  let ecritures = 0;
  const ecrireOrigine = base.ecrire.bind(base);
  base.ecrire = (...args) => {
    ecritures += 1;
    return ecrireOrigine(...args);
  };
  const resultat = await chargeur.charger();
  assert.equal(resultat.resultat, 'a_jour');
  assert.equal(changementsAvantSource, 1, 'contenu-change émis avant tout appel à la source');
  assert.deepEqual(appels, [{ type: 'internes', versionLocale: 1 }]);
  assert.equal(ecritures, 0);
});

test('8. nouvelle version', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  await chargeurSur(base, creerSource(1).source).charger();
  const chargeur = chargeurSur(base, creerSource(2).source);
  await chargeur.pret;
  assert.equal((await chargeur.charger()).resultat, 'remplace');
  assert.equal((await base.lire('contenu', 'internes')).versionContenu, 2);
  assert.equal(chargeur.versionContenuLocale(), 2);
});

test('9. version plus petite', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  await chargeurSur(base, creerSource(2).source).charger();
  const chargeur = chargeurSur(base, creerSource(1).source);
  assert.equal((await chargeur.charger()).resultat, 'remplace');
  assert.equal((await base.lire('contenu', 'internes')).versionContenu, 1);
  assert.equal(chargeur.versionContenuLocale(), 1);
});

async function chargeurAvecPaquet1(source) {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  await chargeurSur(base, creerSource(1).source).charger();
  const chargeur = chargeurSur(base, source);
  await chargeur.pret;
  return { base, chargeur };
}

test('10. source en échec', async () => {
  const { base, chargeur } = await chargeurAvecPaquet1(async () => {
    throw new Error('réseau');
  });
  const changements = compter(chargeur);
  const avant = await base.lire('contenu', 'internes');
  const paquet = chargeur.lirePaquet();
  assert.deepEqual(await chargeur.charger(), { resultat: 'garde', motif: 'source_indisponible' });
  assert.equal(chargeur.lirePaquet(), paquet);
  assert.deepEqual(await base.lire('contenu', 'internes'), avant);
  assert.equal(changements.length, 0, 'aucun contenu-change après la relecture');
});

test('11. refus', async () => {
  const { base, chargeur } = await chargeurAvecPaquet1(async () => ({ ok: false, erreur: 'reglage_invalide' }));
  const avant = await base.lire('contenu', 'internes');
  assert.deepEqual(await chargeur.charger(), { resultat: 'garde', motif: 'refus', erreur: 'reglage_invalide' });
  assert.equal(chargeur.versionContenuLocale(), 1);
  assert.deepEqual(await base.lire('contenu', 'internes'), avant);
});

test('12. paquet mal formé, type inattendu, version incohérente', async () => {
  const cas = [
    ['paquet_mal_forme', () => ({ ok: true, aJour: false, versionContenu: 2, paquet: { ...paquetDeVersion(2), mondes: 'x' } })],
    ['type_inattendu', () => ({ ok: true, aJour: false, versionContenu: 2, paquet: { ...paquetAdminFictif(), versionContenu: 2 } })],
    ['version_incoherente', () => ({ ok: true, aJour: false, versionContenu: 3, paquet: paquetDeVersion(2) })],
  ];
  for (const [motif, fabriquer] of cas) {
    const { base, chargeur } = await chargeurAvecPaquet1(async () => fabriquer());
    const avant = await base.lire('contenu', 'internes');
    const resultat = await chargeur.charger();
    assert.equal(resultat.resultat, 'garde', motif);
    assert.equal(resultat.motif, motif);
    assert.equal(chargeur.versionContenuLocale(), 1);
    assert.deepEqual(await base.lire('contenu', 'internes'), avant);
  }
});

test('13. stockage indisponible', async () => {
  const chargeur = creerChargeurDeContenu({
    obtenirBase: () => Promise.reject(new Error('stockage_indisponible')),
    source: creerSource(1).source,
    maintenant: MAINTENANT,
  });
  await chargeur.pret;
  assert.equal((await chargeur.charger()).resultat, 'remplace');
  assert.equal(chargeur.etat().range, false);
  assert.notEqual(chargeur.lirePaquet(), null);
});

test('14. écriture en échec', async (t) => {
  espionnerConsole(t);
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const ecrireOrigine = base.ecrire.bind(base);
  let echecs = 2;
  base.ecrire = async (...args) => {
    if (echecs > 0) {
      echecs -= 1;
      throw Object.assign(new Error('quota_depasse'), { code: 'quota_depasse' });
    }
    return ecrireOrigine(...args);
  };
  const chargeur = chargeurSur(base, creerSource(1).source);
  const changements = compter(chargeur);
  await chargeur.charger();
  assert.equal(chargeur.etat().range, false);
  assert.notEqual(chargeur.lirePaquet(), null);
  assert.equal(changements.length, 1);
  assert.equal(await base.lire('contenu', 'internes'), null);

  const base2 = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const origine2 = base2.ecrire.bind(base2);
  let echecs2 = 1;
  base2.ecrire = async (...args) => {
    if (echecs2 > 0) {
      echecs2 -= 1;
      throw Object.assign(new Error('quota_depasse'), { code: 'quota_depasse' });
    }
    return origine2(...args);
  };
  const chargeur2 = chargeurSur(base2, creerSource(1).source);
  await chargeur2.charger();
  assert.equal(chargeur2.etat().range, true);
  assert.equal((await base2.lire('contenu', 'internes')).versionContenu, 1);
});

test('15. enregistrement inutilisable', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const mauvais = creerEnregistrement({ ...paquetDeVersion(1), mondes: 'x' }, MAINTENANT());
  await base.ecrire('contenu', mauvais);
  const { source, appels } = creerSource(1);
  const chargeur = chargeurSur(base, source);
  await chargeur.pret;
  assert.equal(chargeur.lirePaquet(), null);
  assert.deepEqual(await base.lire('contenu', 'internes'), mauvais, 'pas supprimé au démarrage');
  await chargeur.charger();
  assert.equal(appels[0].versionLocale, null);
  assert.deepEqual((await base.lire('contenu', 'internes')).paquet, paquetDeVersion(1));
});

test('16. un seul chargement à la fois', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const { source, appels } = creerSource(1);
  const chargeur = chargeurSur(base, source);
  const [a, b] = await Promise.all([chargeur.charger(), chargeur.charger()]);
  assert.equal(appels.length, 1);
  assert.deepEqual(a, b);
});

test('17. charger(admin) rejette type_non_range', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const { source, appels } = creerSource(1);
  const chargeur = chargeurSur(base, source);
  await assert.rejects(chargeur.charger('admin'), (e) => e.code === 'type_non_range');
  assert.equal(appels.length, 0);
});

test('18. paquet gelé', async () => {
  'use strict';
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  const chargeur = chargeurSur(base, creerSource(1).source);
  await chargeur.charger();
  const paquet = chargeur.lirePaquet();
  const copie = structuredClone(paquet);
  assert.throws(() => {
    paquet.questions[0].ID = 'autre';
  }, TypeError);
  assert.throws(() => {
    paquet.mondes.push({});
  }, TypeError);
  assert.deepEqual(paquet, copie);
  assert.equal(chargeur.lirePaquet(), paquet, 'même objet tant qu\'il n\'est pas remplacé');
});

test('19. rien de journalisé qui vienne du contenu', async (t) => {
  const messages = espionnerConsole(t);
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  base.ecrire = async () => {
    throw Object.assign(new Error('Valeur repérable 42'), { code: 'quota_depasse' });
  };
  const source = async () => {
    const paquet = paquetDeVersion(1);
    paquet.questions[0]['Énoncé'] = 'Valeur repérable 42';
    return { ok: true, aJour: false, versionContenu: 1, paquet };
  };
  const chargeur = chargeurSur(base, source);
  await chargeur.charger();
  assert.ok(messages.length > 0, 'l\'échec est bien journalisé');
  for (const message of messages) assert.ok(!message.includes('Valeur repérable 42'), message);
});

test('24. base périmée dans le chargeur', async (t) => {
  const messages = espionnerConsole(t);
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS });
  let version = 1;
  const source = async (type, versionLocale) =>
    versionLocale === version
      ? { ok: true, aJour: true, versionContenu: version }
      : { ok: true, aJour: false, versionContenu: version, paquet: paquetDeVersion(version) };
  const chargeur = chargeurSur(base, source);
  await chargeur.pret;
  await chargeur.charger();
  const paquet = chargeur.lirePaquet();
  let signalements = 0;
  chargeur.evenements.addEventListener('base-perimee', () => {
    signalements += 1;
  });
  const migrations = [...MIGRATIONS, ...MIGRATIONS_D_ESSAI.slice(0, 1).map((m) => ({ ...m, version: MIGRATIONS.length + 1 }))];
  const nouvelle = await base.rouvrir(migrations);
  assert.equal(chargeur.basePerimee(), true);
  assert.equal(signalements, 1);
  assert.equal(chargeur.lirePaquet(), paquet);
  assert.equal(chargeur.etat().range, false);
  version = 2;
  assert.equal((await chargeur.charger()).resultat, 'remplace');
  assert.equal(chargeur.etat().range, false);
  assert.equal(chargeur.versionContenuLocale(), 2);
  assert.equal((await nouvelle.lire('contenu', 'internes')).versionContenu, 1, 'rien n\'a été écrit');
  assert.equal(signalements, 1);
  assert.deepEqual(messages, []);
});
