// Tests 10 et 11 du lot 104 : les scénarios communs sur la base en mémoire, et la règle « jamais importée par client/ ».
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerBaseEnMemoire } from './base-memoire.js';
import { attendreCode, MIGRATIONS_D_ESSAI, SCENARIOS } from './scenarios.js';

// Les ouvertures successives d'un scénario portent sur les mêmes données, comme sur la vraie base.
function contexteEnMemoire() {
  let derniere = null;
  return {
    async ouvrir(migrations) {
      derniere = derniere ? await derniere.rouvrir(migrations) : await creerBaseEnMemoire({ migrations });
      return derniere;
    },
  };
}

for (const scenario of SCENARIOS) {
  test(`10. scénario ${scenario.numero} en mémoire : ${scenario.titre}`, async () => {
    await scenario.executer(contexteEnMemoire());
  });
}

test('10. les treize scénarios sont là, dans l\'ordre', () => {
  assert.deepEqual(SCENARIOS.map((s) => s.numero), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
});

test('10. creerBaseEnMemoire : migrations invalides, base plus récente, rouvrir', async () => {
  const invalides = structuredClone(MIGRATIONS_D_ESSAI);
  invalides[1].version = 7;
  await attendreCode(creerBaseEnMemoire({ migrations: invalides }), 'migration_invalide');
  await attendreCode(creerBaseEnMemoire({ migrations: MIGRATIONS_D_ESSAI.slice(0, 3), versionEnregistree: 4 }), 'version_plus_recente');
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS_D_ESSAI.slice(0, 2) });
  let signalements = 0;
  base.evenements.addEventListener('base-perimee', () => {
    signalements += 1;
  });
  await base.ecrire('essai-simple', { id: 'a', valeur: 'Valeur A1' });
  const plus = await base.rouvrir(MIGRATIONS_D_ESSAI);
  assert.equal(signalements, 1, 'l\'ancienne base émet base-perimee');
  await attendreCode(base.lire('essai-simple', 'a'), 'base_fermee');
  assert.equal((await plus.lire('essai-simple', 'a')).valeur, 'Valeur A1');
});

test('10. une opération sur une transaction finie rejette transaction_inactive', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS_D_ESSAI });
  let tardive;
  await base.transaction(['essai-simple'], 'ecriture', async (t) => {
    tardive = t;
  });
  await attendreCode(tardive.ecrire('essai-simple', { id: 'a' }), 'transaction_inactive');
  assert.equal(await base.compter('essai-simple'), 0);
});

test('10. les transactions passent l\'une après l\'autre', async () => {
  const base = await creerBaseEnMemoire({ migrations: MIGRATIONS_D_ESSAI });
  await base.ecrire('essai-meta', { cle: 'compteur', valeur: 0 });
  const augmenter = () =>
    base.transaction(['essai-meta'], 'ecriture', async (t) => {
      const actuel = await t.lire('essai-meta', 'compteur');
      await t.ecrire('essai-meta', { cle: 'compteur', valeur: actuel.valeur + 1 });
    });
  await Promise.all([augmenter(), augmenter(), augmenter()]);
  assert.equal((await base.lire('essai-meta', 'compteur')).valeur, 3);
});

function fichiersDe(dossier) {
  const resultat = [];
  for (const nom of readdirSync(dossier)) {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) resultat.push(...fichiersDe(chemin));
    else resultat.push(chemin);
  }
  return resultat;
}

test('11. aucun fichier de client/ n\'importe base-memoire.js ni scenarios.js', () => {
  const racine = fileURLToPath(new URL('../../../client/', import.meta.url));
  const fichiers = fichiersDe(racine).filter((f) => /\.(js|html)$/.test(f));
  assert.ok(fichiers.length > 0);
  for (const fichier of fichiers) {
    const texte = readFileSync(fichier, 'utf8');
    assert.ok(!texte.includes('base-memoire'), `${fichier} cite base-memoire`);
    assert.ok(!texte.includes('scenarios'), `${fichier} cite scenarios`);
    assert.ok(!/tests\//.test(texte.replace(/^\/\/.*$/gm, '')), `${fichier} cite tests/`);
  }
});
