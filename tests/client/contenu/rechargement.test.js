// Tests 23 du lot 107 : la proposition de recharger la page s'affiche au plus une fois et jamais pendant une partie.
import test from 'node:test';
import assert from 'node:assert/strict';
import { creerPropositionDeRechargement } from '../../../client/contenu/rechargement.js';

function creer(peut = true) {
  const etat = { appels: 0, peut };
  const proposition = creerPropositionDeRechargement({
    afficher: () => {
      etat.appels += 1;
    },
    peutInterrompre: () => etat.peut,
  });
  return { etat, proposition };
}

test('23. proposition de rechargement', () => {
  {
    const { etat, proposition } = creer();
    proposition.signaler();
    assert.equal(etat.appels, 1);
    proposition.signaler();
    assert.equal(etat.appels, 1);
  }
  {
    const { etat, proposition } = creer(false);
    proposition.signaler();
    assert.equal(etat.appels, 0);
    assert.equal(proposition.enAttente(), true);
    proposition.reprendre();
    assert.equal(etat.appels, 0);
    etat.peut = true;
    proposition.reprendre();
    assert.equal(etat.appels, 1);
    assert.equal(proposition.enAttente(), false);
    proposition.reprendre();
    assert.equal(etat.appels, 1);
  }
  {
    const { etat, proposition } = creer();
    proposition.refuser();
    proposition.signaler();
    proposition.reprendre();
    assert.equal(etat.appels, 0);
  }
  {
    const { etat, proposition } = creer(false);
    proposition.signaler();
    proposition.refuser();
    etat.peut = true;
    proposition.reprendre();
    assert.equal(etat.appels, 0);
    assert.equal(proposition.enAttente(), false);
  }
  {
    const { etat, proposition } = creer();
    proposition.reprendre();
    assert.equal(etat.appels, 0);
  }
});
