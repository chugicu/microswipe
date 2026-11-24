// Tests 7 à 20 du lot 102 : les deux paquets fictifs, leurs listes, leurs colonnes et leur cohérence interne.

import test from 'node:test';
import assert from 'node:assert/strict';
import { COLONNES_RESERVEES } from '../../../client/contenu/forme-du-paquet.js';
import {
  ATTENDU_FICTIF,
  paquetAdminFictif,
  paquetInternesFictif,
} from '../../../client/donnees-fictives/paquets-fictifs.js';

// Les en-têtes du § 6.3 de la spec, écrits ici à part pour que le test ne dépende pas du fichier de données.
const EN_TETES = {
  mondes: ['ID', 'Parcours', 'Ordre', 'Nom', 'Visible', 'Milieu', 'Étoiles pour le boss', 'Seuil du boss', 'Questions du boss', 'Archivé le', 'Modifié le', 'Modifié par'],
  niveaux: ['ID', 'Monde', 'Ordre', 'Type', 'Mécanique', 'Titre', 'Consigne', 'Simplifié', 'Certitude', 'Réglages', 'Archivé le', 'Modifié le', 'Modifié par'],
  composition: ['ID', 'Niveau', 'Question', 'Ordre', 'Archivé le', 'Modifié le', 'Modifié par'],
  questions: ['ID', 'Monde', 'Mécanique', 'Énoncé', 'Fait', 'Champ', 'Réponse propre', 'Leurres', 'Explication', 'Simplifiée', 'Palier', 'Plancher', 'Origine', 'Statut', 'Validé par', 'Date de validation', 'Commentaire du validateur', 'Archivé le', 'Modifié le', 'Modifié par'],
  Faits_fictifs: ['ID', 'Libellé', 'Colonne A', 'Colonne B', 'Source', 'Page', 'Statut', 'Validé par', 'Date de validation', 'Commentaire du validateur', 'Champs validés', 'Archivé le', 'Modifié le', 'Modifié par'],
  Autres_faits_fictifs: ['ID', 'Libellé', 'Colonne C', 'Source', 'Page', 'Statut', 'Validé par', 'Date de validation', 'Commentaire du validateur', 'Champs validés', 'Archivé le', 'Modifié le', 'Modifié par'],
};
const SECTIONS = ['mondes', 'niveaux', 'composition', 'questions'];
const sansReservees = (colonnes) => colonnes.filter((colonne) => !COLONNES_RESERVEES.includes(colonne));
const ids = (lignes) => lignes.map((ligne) => ligne.ID);
const parId = (lignes) => new Map(lignes.map((ligne) => [ligne.ID, ligne]));
const lister = (texte) => texte.split(';').map((partie) => partie.trim()).filter((partie) => partie !== '');

const internes = paquetInternesFictif();
const admin = paquetAdminFictif();
const LES_DEUX = [['internes', internes], ['admin', admin]];

test('7. les identifiants de chaque section sont ceux du § 6.11, dans l\'ordre', () => {
  for (const [type, paquet] of LES_DEUX) {
    for (const section of SECTIONS) {
      assert.deepEqual(ids(paquet[section]), ATTENDU_FICTIF[type][section], `${type}/${section}`);
    }
    assert.deepEqual(Object.keys(paquet.faits), Object.keys(ATTENDU_FICTIF[type].faits), `${type}/faits (onglets)`);
    for (const onglet of Object.keys(paquet.faits)) {
      assert.deepEqual(ids(paquet.faits[onglet]), Object.keys(ATTENDU_FICTIF[type].faits[onglet]), `${type}/faits/${onglet}`);
    }
    assert.deepEqual(paquet.compositionPrevue, ATTENDU_FICTIF[type].compositionPrevue, `${type}/compositionPrevue`);
  }
  // Les effectifs écrits dans la spec.
  assert.equal(internes.questions.length, 16);
  assert.equal(internes.composition.length, 30);
  assert.equal(admin.questions.length, 19);
  assert.equal(admin.composition.length, 36);
});

test('8. « internes » : aucune colonne réservée, colonnes exactes de chaque ligne', () => {
  for (const section of SECTIONS) {
    for (const ligne of internes[section]) {
      assert.deepEqual(Object.keys(ligne), sansReservees(EN_TETES[section]), `${section}/${ligne.ID}`);
    }
  }
  for (const onglet of Object.keys(internes.faits)) {
    for (const ligne of internes.faits[onglet]) {
      for (const colonne of COLONNES_RESERVEES) {
        assert.ok(!(colonne in ligne), `${onglet}/${ligne.ID} porte ${colonne}`);
      }
    }
  }
  const faitsFictifs = parId(internes.faits.Faits_fictifs);
  assert.deepEqual(Object.keys(faitsFictifs.get('FF-07')), ['ID', 'Libellé', 'Colonne A']);
  for (const identifiant of ['FF-01', 'FF-02', 'FF-03', 'FF-04', 'FF-05', 'FF-06']) {
    assert.deepEqual(Object.keys(faitsFictifs.get(identifiant)), ['ID', 'Libellé', 'Colonne A', 'Colonne B', 'Source', 'Page']);
  }
  for (const ligne of internes.faits.Autres_faits_fictifs) {
    assert.deepEqual(Object.keys(ligne), ['ID', 'Libellé', 'Colonne C', 'Source', 'Page']);
  }
});

test('9. « internes » ne contient rien de ce qui n\'est pas servi', () => {
  const texte = JSON.stringify(internes);
  for (const interdit of ['Valeur B7', 'Bactérie H', 'Valeur A9', 'Monde fictif 3', 'validateur-fictif', 'auteur-fictif', 'À valider', 'À corriger']) {
    assert.ok(!texte.includes(interdit), `« ${interdit} » ne doit pas figurer dans le paquet « internes »`);
  }
});

test('10. « admin » : chaque ligne a exactement les colonnes du § 6.3', () => {
  for (const section of SECTIONS) {
    for (const ligne of admin[section]) {
      assert.deepEqual(Object.keys(ligne), EN_TETES[section], `${section}/${ligne.ID}`);
    }
  }
  for (const onglet of ['Faits_fictifs', 'Autres_faits_fictifs']) {
    for (const ligne of admin.faits[onglet]) {
      assert.deepEqual(Object.keys(ligne), EN_TETES[onglet], `${onglet}/${ligne.ID}`);
    }
  }
});

test('11. etatDesQuestions est celui du § 6.11', () => {
  const attendu = {};
  for (let numero = 1; numero <= 19; numero += 1) {
    attendu[`Q-${String(numero).padStart(6, '0')}`] = { servie: true, motifs: [] };
  }
  attendu['Q-000007'] = { servie: false, motifs: ['question_non_validee', 'fait_non_valide'] };
  attendu['Q-000016'] = { servie: false, motifs: ['monde_invisible'] };
  attendu['Q-000017'] = { servie: false, motifs: ['question_non_validee', 'monde_invisible'] };
  assert.deepEqual(admin.etatDesQuestions, attendu);
  assert.equal(Object.values(admin.etatDesQuestions).filter((entree) => entree.servie).length, 16);
  assert.ok(!('etatDesQuestions' in internes));
});

test('12. compositionPrevue égale le nombre de lignes de composition du niveau dans « admin »', () => {
  for (const [type, paquet] of LES_DEUX) {
    assert.deepEqual(Object.keys(paquet.compositionPrevue), ids(paquet.niveaux), `${type} : un nombre par niveau du paquet`);
    for (const niveau of paquet.niveaux) {
      const lignes = admin.composition.filter((ligne) => ligne.Niveau === niveau.ID).length;
      assert.equal(paquet.compositionPrevue[niveau.ID], lignes, `${type}/${niveau.ID}`);
    }
  }
});

// Référence `Onglet:Identifiant` → { onglet, identifiant } ; le champ d'une question à plusieurs faits est répété ou donné fait par fait.
function couplesDeLaQuestion(question) {
  const references = lister(question.Fait).map((partie) => {
    const [onglet, identifiant] = partie.split(':');
    return { onglet, identifiant };
  });
  const champs = lister(question.Champ);
  return references.map((reference, position) => ({ ...reference, champ: champs.length === 1 ? champs[0] : champs[position] }));
}

test('13. cohérence de « internes » : mondes, niveaux, composition, faits', () => {
  const mondes = parId(internes.mondes);
  const niveaux = parId(internes.niveaux);
  const questions = parId(internes.questions);
  for (const niveau of internes.niveaux) assert.ok(mondes.has(niveau.Monde), `monde de ${niveau.ID}`);
  for (const ligne of internes.composition) {
    assert.ok(niveaux.has(ligne.Niveau), `niveau de ${ligne.ID}`);
    assert.ok(questions.has(ligne.Question), `question de ${ligne.ID}`);
  }
  for (const question of internes.questions) {
    assert.ok(mondes.has(question.Monde), `monde de ${question.ID}`);
    for (const { onglet, identifiant, champ } of couplesDeLaQuestion(question)) {
      const ligne = (internes.faits[onglet] ?? []).find((candidate) => candidate.ID === identifiant);
      assert.ok(ligne, `${question.ID} : fait ${onglet}:${identifiant}`);
      assert.ok(champ in ligne, `${question.ID} : colonne ${champ} de ${identifiant}`);
    }
  }
});

// Second contrôle, écrit sans ATTENDU_FICTIF ni l'assemblage : conditions 1 à 3 du schéma § 3.5 appliquées au paquet « admin ».
function evaluerQuestion(question, paquet) {
  const motifs = [];
  if (question.Statut !== 'Validé') motifs.push('question_non_validee');
  const monde = paquet.mondes.find((candidat) => candidat.ID === question.Monde);
  if (!monde) motifs.push('monde_introuvable');
  else if (monde['Archivé le'] !== '') motifs.push('monde_archive');
  else if (monde.Visible !== 'oui') motifs.push('monde_invisible');
  for (const { onglet, identifiant, champ } of couplesDeLaQuestion(question)) {
    const lignes = (paquet.faits[onglet] ?? []).filter((candidate) => candidate.ID === identifiant);
    if (lignes.length === 0) { motifs.push('fait_introuvable'); continue; }
    if (lignes.length > 1) { motifs.push('fait_en_double'); continue; }
    const [fait] = lignes;
    if (fait['Archivé le'] !== '') { motifs.push('fait_archive'); continue; }
    if (!(champ in fait) || COLONNES_RESERVEES.includes(champ)) { motifs.push('champ_introuvable'); continue; }
    if (fait.Statut !== 'Validé' && !lister(fait['Champs validés']).includes(champ)) motifs.push('fait_non_valide');
  }
  const ordre = ['question_non_validee', 'monde_introuvable', 'monde_archive', 'monde_invisible', 'champ_illisible', 'fait_introuvable', 'fait_en_double', 'fait_archive', 'champ_introuvable', 'fait_non_valide'];
  return [...new Set(motifs)].sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b));
}

test('14. second contrôle : les questions servies sont celles de « internes », les motifs ceux de etatDesQuestions', () => {
  const servies = [];
  for (const question of admin.questions) {
    const motifs = evaluerQuestion(question, admin);
    assert.deepEqual(admin.etatDesQuestions[question.ID], { servie: motifs.length === 0, motifs }, question.ID);
    if (motifs.length === 0) servies.push(question.ID);
  }
  assert.deepEqual(servies, ids(internes.questions));
  // Les mêmes conditions donnent les mondes, niveaux et lignes de composition de « internes ».
  const mondesVisibles = admin.mondes.filter((monde) => monde.Visible === 'oui').map((monde) => monde.ID);
  assert.deepEqual(ids(internes.mondes), mondesVisibles);
  const niveauxRetenus = admin.niveaux.filter((niveau) => mondesVisibles.includes(niveau.Monde)).map((niveau) => niveau.ID);
  assert.deepEqual(ids(internes.niveaux), niveauxRetenus);
  const compositionRetenue = admin.composition
    .filter((ligne) => niveauxRetenus.includes(ligne.Niveau) && servies.includes(ligne.Question))
    .map((ligne) => ligne.ID);
  assert.deepEqual(ids(internes.composition), compositionRetenue);
  // Les faits de « internes » sont ceux que citent les questions servies.
  const cites = new Set(internes.questions.flatMap((question) => couplesDeLaQuestion(question).map((c) => `${c.onglet}:${c.identifiant}`)));
  const presents = Object.entries(internes.faits).flatMap(([onglet, lignes]) => lignes.map((ligne) => `${onglet}:${ligne.ID}`));
  assert.deepEqual([...presents].sort(), [...cites].sort());
});

// Formats de lot-401.md § 6.2, écrits ici.
const NOMBRE = /^[0-9]+(\.[0-9]+)?$/;
const ENTIER = /^[0-9]+$/;

function tranchesValides(texte) {
  const parties = lister(texte);
  if (parties.length === 0) return false;
  let dernierN = -1;
  let dernierK = Infinity;
  for (const [index, partie] of parties.entries()) {
    const morceaux = partie.split(':');
    if (morceaux.length !== 2) return false;
    const [n, k] = morceaux.map((morceau) => morceau.trim());
    if (!ENTIER.test(n) || !NOMBRE.test(k)) return false;
    if (index === 0 && Number(n) !== 0) return false;
    if (Number(n) <= dernierN || Number(k) > dernierK) return false;
    dernierN = Number(n);
    dernierK = Number(k);
  }
  return true;
}

function listeNommeeValide(texte, auMoinsUne) {
  const parties = lister(texte);
  if (auMoinsUne && parties.length === 0) return false;
  const noms = new Set();
  for (const partie of parties) {
    const morceaux = partie.split(':');
    if (morceaux.length !== 2) return false;
    const [nom, valeur] = morceaux.map((morceau) => morceau.trim());
    if (nom === '' || !NOMBRE.test(valeur) || noms.has(nom)) return false;
    noms.add(nom);
  }
  return true;
}

const CLES_REGLAGES = [
  'contenu.version', 'etoiles.seuil_1', 'etoiles.seuil_2', 'etoiles.seuil_3',
  'elo.interne.depart', 'elo.interne.k', 'elo.interne.provisoire', 'elo.question.k',
  'elo.question.poids_entrainement', 'elo.paliers', 'elo.planchers', 'accueil.logo',
];

test('15. réglages : identiques, douze clés dans l\'ordre, formats lisibles', () => {
  assert.deepEqual(internes.reglages, admin.reglages);
  assert.deepEqual(Object.keys(admin.reglages), CLES_REGLAGES);
  const r = admin.reglages;
  const seuils = ['etoiles.seuil_1', 'etoiles.seuil_2', 'etoiles.seuil_3'].map((cle) => {
    assert.match(r[cle], ENTIER, cle);
    return Number(r[cle]);
  });
  assert.ok(seuils.every((seuil) => seuil >= 1 && seuil <= 100));
  assert.ok(seuils[0] <= seuils[1] && seuils[1] <= seuils[2]);
  assert.match(r['contenu.version'], ENTIER);
  assert.match(r['elo.interne.depart'], NOMBRE);
  assert.ok(tranchesValides(r['elo.interne.k']));
  assert.match(r['elo.interne.provisoire'], ENTIER);
  assert.ok(tranchesValides(r['elo.question.k']));
  assert.match(r['elo.question.poids_entrainement'], NOMBRE);
  assert.ok(Number(r['elo.question.poids_entrainement']) <= 1);
  assert.ok(listeNommeeValide(r['elo.paliers'], true));
  assert.ok(listeNommeeValide(r['elo.planchers'], false));
  // Les vérificateurs ne sont pas laxistes : quelques valeurs fausses.
  for (const faux of ['1:8', '0:8;0:4', '0:8;5:4;3:2', '0:8;3:9', '0:8;3', '0:8:1', 'a:8', '']) {
    assert.ok(!tranchesValides(faux), `tranches « ${faux} » devraient être refusées`);
  }
  assert.ok(tranchesValides('0:8; ;3:8;'));
  assert.ok(!listeNommeeValide('a:1;a:2', true) && !listeNommeeValide('a', true) && !listeNommeeValide('', true));
});

test('16. paliers et planchers : des noms connus, jamais un nombre', () => {
  for (const [type, paquet] of LES_DEUX) {
    const paliers = lister(paquet.reglages['elo.paliers']).map((partie) => partie.split(':')[0].trim());
    const planchers = lister(paquet.reglages['elo.planchers']).map((partie) => partie.split(':')[0].trim());
    for (const question of paquet.questions) {
      assert.ok(paliers.includes(question.Palier), `${type}/${question.ID} : palier « ${question.Palier} »`);
      if (question.Plancher !== '') {
        assert.ok(planchers.includes(question.Plancher), `${type}/${question.ID} : plancher « ${question.Plancher} »`);
        assert.doesNotMatch(question.Plancher, /^[0-9]+$/);
      }
    }
  }
});

// Lecteur de la colonne `Réglages` d'un niveau, d'après lot-201.md § 6.3.
function lireReglagesDuNiveau(texte) {
  const illisible = { lisible: false, correspondances: {} };
  if (texte.trim() === '') return { lisible: true, correspondances: {} };
  let objet;
  try { objet = JSON.parse(texte); } catch { return illisible; }
  if (objet === null || typeof objet !== 'object' || Array.isArray(objet) || objet.v !== 1) return illisible;
  if (!('correspondances' in objet)) return { lisible: true, correspondances: {} };
  const tables = objet.correspondances;
  if (tables === null || typeof tables !== 'object' || Array.isArray(tables)) return illisible;
  const correspondances = {};
  for (const [cle, table] of Object.entries(tables)) {
    if (table === null || typeof table !== 'object' || Array.isArray(table)) return illisible;
    const lue = {};
    for (const [valeur, reponse] of Object.entries(table)) {
      if (typeof reponse !== 'string' || reponse.trim() === '') return illisible;
      lue[valeur.trim()] = reponse.trim();
    }
    const [onglet, champ] = cle.split(':');
    correspondances[`${onglet.trim()}:${champ.trim()}`] = lue;
  }
  return { lisible: true, correspondances };
}

test('17. Réglages des niveaux et valeurs fermées', () => {
  for (const [type, paquet] of LES_DEUX) {
    for (const niveau of paquet.niveaux) {
      const lu = lireReglagesDuNiveau(niveau.Réglages);
      assert.ok(lu.lisible, `${type}/${niveau.ID} : Réglages illisible`);
      assert.ok(['normal', 'boss'].includes(niveau.Type), `${niveau.ID} : Type`);
      assert.ok(['oui', 'non'].includes(niveau.Simplifié), `${niveau.ID} : Simplifié`);
    }
    for (const question of paquet.questions) {
      assert.ok(['swipe', 'qcm', 'tri'].includes(question.Mécanique), `${question.ID} : Mécanique`);
      assert.ok(['oui', 'non'].includes(question.Simplifiée), `${question.ID} : Simplifiée`);
    }
    for (const monde of paquet.mondes) {
      assert.ok(['oui', 'non'].includes(monde.Visible), `${monde.ID} : Visible`);
    }
  }
  assert.deepEqual(admin.mondes.map((monde) => monde.Milieu), ['sang', 'bcp', 'chocolat', 'neutre']);
  assert.ok(admin.niveaux.some((niveau) => niveau.Réglages === ''), 'au moins un niveau sans table');
});

// Réponses attendues du § 6.13, par niveau normal.
const REPONSES_PAR_NIVEAU = {
  'NIV-0001': { 'Q-000001': ['Réponse 1'], 'Q-000002': ['Réponse 1'], 'Q-000003': ['Réponse 2'] },
  'NIV-0002': { 'Q-000004': ['non'], 'Q-000005': ['oui'], 'Q-000006': ['Réponse 1'], 'Q-000007': ['Réponse 1'] },
  'NIV-0003': { 'Q-000008': ['Réponse propre A'], 'Q-000009': ['Réponse propre B'], 'Q-000010': ['Réponse propre C'] },
  'NIV-0005': { 'Q-000011': ['Réponse 1', 'Réponse 1', 'Réponse 2'], 'Q-000012': ['non', 'oui'] },
  'NIV-0006': { 'Q-000013': ['Réponse 3'], 'Q-000014': ['Réponse 4'], 'Q-000015': ['Réponse 3'] },
  'NIV-0008': { 'Q-000016': ['Réponse 2'], 'Q-000017': null },
  'NIV-0010': { 'Q-000018': ['Réponse propre D'], 'Q-000019': ['Réponse propre E'] },
};

// Réponse attendue d'une question dans un niveau, d'après lot-201.md § 6.4 ; `null` si la question est écartée.
function reponseAttendue(question, niveau, paquet) {
  const { correspondances } = lireReglagesDuNiveau(niveau.Réglages);
  const couples = couplesDeLaQuestion(question);
  const multiple = question.Mécanique === 'tri';
  const propres = lister(question['Réponse propre']);
  if (!multiple && question['Réponse propre'].trim() !== '') return [question['Réponse propre'].trim()];
  if (multiple && propres.length === couples.length && propres.length > 0) return propres;
  if (!multiple && couples.length > 1) return null;
  const reponses = [];
  for (const { onglet, identifiant, champ } of couples) {
    const fait = (paquet.faits[onglet] ?? []).find((ligne) => ligne.ID === identifiant);
    const table = correspondances[`${onglet}:${champ}`];
    const valeur = fait ? fait[champ] : '';
    if (!table || !valeur || !Object.prototype.hasOwnProperty.call(table, valeur)) return null;
    reponses.push(table[valeur]);
  }
  return reponses;
}

test('18. réponses attendues, niveau par niveau et dans les boss', () => {
  // Dans un boss, la réponse d'une question est celle qu'elle a dans son niveau normal.
  const reponseDeQuestion = {};
  for (const reponses of Object.values(REPONSES_PAR_NIVEAU)) Object.assign(reponseDeQuestion, reponses);
  for (const [type, paquet] of LES_DEUX) {
    const niveaux = parId(paquet.niveaux);
    const questions = parId(paquet.questions);
    const ecartees = [];
    for (const ligne of paquet.composition) {
      const niveau = niveaux.get(ligne.Niveau);
      const question = questions.get(ligne.Question);
      const calculee = reponseAttendue(question, niveau, paquet);
      const attendue = niveau.Type === 'boss' ? reponseDeQuestion[question.ID] : REPONSES_PAR_NIVEAU[niveau.ID][question.ID];
      assert.deepEqual(calculee, attendue, `${type}/${niveau.ID}/${question.ID}`);
      if (calculee === null) ecartees.push(`${niveau.ID}/${question.ID}`);
    }
    assert.deepEqual(ecartees, type === 'admin' ? ['NIV-0008/Q-000017'] : [], type);
  }
});

test('19. boss : un par monde, trois colonnes entières, réserve plus grande que « Questions du boss »', () => {
  for (const [type, paquet] of LES_DEUX) {
    for (const monde of paquet.mondes) {
      const boss = paquet.niveaux.filter((niveau) => niveau.Monde === monde.ID && niveau.Type === 'boss');
      assert.equal(boss.length, 1, `${type}/${monde.ID} : un seul boss`);
      for (const colonne of ['Étoiles pour le boss', 'Seuil du boss', 'Questions du boss']) {
        assert.match(monde[colonne], ENTIER, `${type}/${monde.ID}/${colonne}`);
      }
      const reserve = paquet.composition.filter((ligne) => ligne.Niveau === boss[0].ID).length;
      assert.ok(reserve > Number(monde['Questions du boss']), `${type}/${boss[0].ID} : ${reserve} lignes pour ${monde['Questions du boss']} questions`);
    }
  }
});

test('20. copies indépendantes, et versionContenu égale contenu.version', () => {
  for (const fonction of [paquetInternesFictif, paquetAdminFictif]) {
    const premier = fonction();
    const second = fonction();
    assert.notEqual(premier, second);
    assert.deepEqual(premier, second);
    premier.questions[0].Énoncé = 'modifié';
    premier.reglages['accueil.logo'] = 'non';
    premier.faits.Faits_fictifs[0].Libellé = 'modifié';
    premier.compositionPrevue['NIV-0001'] = 99;
    premier.mondes.pop();
    if (premier.etatDesQuestions) premier.etatDesQuestions['Q-000001'].servie = false;
    const troisieme = fonction();
    assert.deepEqual(troisieme, second, 'modifier un résultat ne change pas le suivant');
    assert.notEqual(second.questions[0], troisieme.questions[0]);
    assert.notEqual(second.faits.Faits_fictifs[0], troisieme.faits.Faits_fictifs[0]);
  }
  for (const [type, paquet] of LES_DEUX) {
    assert.equal(paquet.versionContenu, Number(paquet.reglages['contenu.version']), type);
    assert.ok(Number.isInteger(paquet.versionContenu));
  }
});
