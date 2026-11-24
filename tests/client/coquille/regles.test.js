// Tests 4 à 7 du lot 103 : règles de l'accueil et de l'invitation à installer.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DUREE_ACCUEIL_MS,
  logoActive,
  doitMasquerLAccueil,
  estInstallee,
  moyenDInstallation,
  doitInviterApresPartie,
  TEXTES_INSTALLATION,
} from '../../../client/coquille/regles.js';

test('4. logoActive : seul « non » exact le coupe', () => {
  assert.equal(logoActive({ 'accueil.logo': 'non' }), false);
  assert.equal(logoActive({ 'accueil.logo': ' non ' }), false);
  for (const valeur of ['oui', 'Non', 'NON', '', ' ']) {
    assert.equal(logoActive({ 'accueil.logo': valeur }), true, `valeur « ${valeur} »`);
  }
  assert.equal(logoActive({}), true);
  assert.equal(logoActive(null), true);
  assert.equal(logoActive(undefined), true);
});

test('5. doitMasquerLAccueil', () => {
  assert.equal(DUREE_ACCUEIL_MS, 1000);
  const cas = (surcharge) => doitMasquerLAccueil({ ecouleMs: 0, appliPrete: true, toucher: false, logo: true, ...surcharge });
  // Appli pas prête : jamais.
  for (const ecouleMs of [0, 999, 1000, 5000]) {
    for (const toucher of [false, true]) {
      for (const logo of [false, true]) {
        assert.equal(cas({ appliPrete: false, ecouleMs, toucher, logo }), false);
      }
    }
  }
  assert.equal(cas({ ecouleMs: 999 }), false);
  assert.equal(cas({ ecouleMs: 1000 }), true);
  assert.equal(cas({ ecouleMs: 200, toucher: true }), true);
  assert.equal(cas({ ecouleMs: 0, logo: false }), true);
});

test('6. estInstallee et moyenDInstallation', () => {
  assert.equal(estInstallee({ affichageAutonome: false, standaloneIos: false }), false);
  assert.equal(estInstallee({ affichageAutonome: true, standaloneIos: false }), true);
  assert.equal(estInstallee({ affichageAutonome: false, standaloneIos: true }), true);
  assert.equal(estInstallee({ affichageAutonome: false, standaloneIos: undefined }), false);

  const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1';
  const mac = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15';
  const android = 'Mozilla/5.0 (Linux; Android 14; Pixel) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36';
  assert.equal(moyenDInstallation({ agentUtilisateur: iphone, pointsDeContact: 5, invitationNative: false }), 'consignes');
  assert.equal(moyenDInstallation({ agentUtilisateur: mac, pointsDeContact: 5, invitationNative: false }), 'consignes');
  assert.equal(moyenDInstallation({ agentUtilisateur: mac, pointsDeContact: 0, invitationNative: false }), 'aucun');
  assert.equal(moyenDInstallation({ agentUtilisateur: android, pointsDeContact: 5, invitationNative: true }), 'bouton');
  assert.equal(moyenDInstallation({ agentUtilisateur: android, pointsDeContact: 5, invitationNative: false }), 'aucun');
});

test('7. doitInviterApresPartie et TEXTES_INSTALLATION', () => {
  for (const n of [0, 2, 9, 11, 20]) assert.equal(doitInviterApresPartie(n, false), false, `${n} parties`);
  for (const n of [1, 10]) {
    assert.equal(doitInviterApresPartie(n, false), true, `${n} parties`);
    assert.equal(doitInviterApresPartie(n, true), false, `${n} parties, installée`);
  }
  assert.deepEqual(TEXTES_INSTALLATION, {
    titre: 'Installe MicroSwipe',
    texte: "Elle s'ouvrira comme une appli, même hors ligne, et gardera mieux tes réponses.",
    consignesIphone: "Touche Partager, puis « Sur l'écran d'accueil ».",
    boutonInstaller: 'Installer',
    boutonPlusTard: 'Plus tard',
    ligneProfil: "Installer l'appli sur l'écran d'accueil",
  });
});
