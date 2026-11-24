// Données fictives, aucun contenu médical. Phases 1 et 2, en attendant le serveur (lot 307). Toute modification augmente versionContenu et contenu.version.
//
// Les lignes complètes du jeu fictif (lot-102.md § 6.2 à § 6.10), écrites une seule fois comme dans le fichier Contenu.
// Toutes les valeurs sont des textes, nombres compris. Les paquets sont assemblés dans paquets-fictifs.js.

export const VERSION_CONTENU = 1;
export const GENERE_LE = '2027-01-01T00:00:00.000Z';

const MODIFIE_LE = '2027-01-01T00:00:00.000Z';
const MODIFIE_PAR = 'auteur-fictif';

// En-têtes complets de chaque onglet (lot-102.md § 6.3), dans l'ordre du fichier Contenu.
export const EN_TETES = Object.freeze({
  Mondes: ['ID', 'Parcours', 'Ordre', 'Nom', 'Visible', 'Milieu', 'Étoiles pour le boss', 'Seuil du boss', 'Questions du boss', 'Archivé le', 'Modifié le', 'Modifié par'],
  Niveaux: ['ID', 'Monde', 'Ordre', 'Type', 'Mécanique', 'Titre', 'Consigne', 'Simplifié', 'Certitude', 'Réglages', 'Archivé le', 'Modifié le', 'Modifié par'],
  Composition: ['ID', 'Niveau', 'Question', 'Ordre', 'Archivé le', 'Modifié le', 'Modifié par'],
  Questions: ['ID', 'Monde', 'Mécanique', 'Énoncé', 'Fait', 'Champ', 'Réponse propre', 'Leurres', 'Explication', 'Simplifiée', 'Palier', 'Plancher', 'Origine', 'Statut', 'Validé par', 'Date de validation', 'Commentaire du validateur', 'Archivé le', 'Modifié le', 'Modifié par'],
  Faits_fictifs: ['ID', 'Libellé', 'Colonne A', 'Colonne B', 'Source', 'Page', 'Statut', 'Validé par', 'Date de validation', 'Commentaire du validateur', 'Champs validés', 'Archivé le', 'Modifié le', 'Modifié par'],
  Autres_faits_fictifs: ['ID', 'Libellé', 'Colonne C', 'Source', 'Page', 'Statut', 'Validé par', 'Date de validation', 'Commentaire du validateur', 'Champs validés', 'Archivé le', 'Modifié le', 'Modifié par'],
});

// Réglages (lot-102.md § 6.4), identiques dans les deux paquets, dans cet ordre.
export const REGLAGES_FICTIFS = Object.freeze({
  'contenu.version': String(VERSION_CONTENU),
  'etoiles.seuil_1': '60',
  'etoiles.seuil_2': '80',
  'etoiles.seuil_3': '100',
  'elo.interne.depart': '1000',
  'elo.interne.k': '0:40;5:20;10:10',
  'elo.interne.provisoire': '5',
  'elo.question.k': '0:8;3:4',
  'elo.question.poids_entrainement': '0.5',
  'elo.paliers': 'facile:800;moyen:1000;difficile:1200;avancé:1400',
  'elo.planchers': 'difficile:1100;avancé:1300',
  'accueil.logo': 'oui',
});

// Blocs `Réglages` des niveaux (lot-102.md § 6.5) : textes JSON au format de lot-201.md § 6.3.
const TABLE_A = { 'Faits_fictifs:Colonne A': { 'Valeur A1': 'Réponse 1', 'Valeur A2': 'Réponse 1', 'Valeur A3': 'Réponse 2' } };
const TABLE_B = { 'Faits_fictifs:Colonne B': { 'Valeur B1': 'oui', 'Valeur B2': 'non' } };
const TABLE_C = { 'Autres_faits_fictifs:Colonne C': { 'Valeur C1': 'Réponse 3', 'Valeur C2': 'Réponse 4' } };

// `Valeur A9`, `Valeur B7`, `Valeur B8` et `Valeur B9` n'ont volontairement aucune correspondance.
export const REGLAGES_A = JSON.stringify({ v: 1, correspondances: { ...TABLE_A, ...TABLE_B } });
export const REGLAGES_C = JSON.stringify({ v: 1, correspondances: { ...TABLE_C } });
export const REGLAGES_AC = JSON.stringify({ v: 1, correspondances: { ...TABLE_A, ...TABLE_B, ...TABLE_C } });
const REGLAGES_VIDES = '';

// Construit une ligne dont les clés suivent l'en-tête ; une colonne oubliée ou en trop est une erreur d'écriture du jeu.
function construireLigne(enTete, valeurs) {
  const colonnesInconnues = Object.keys(valeurs).filter((colonne) => !enTete.includes(colonne));
  if (colonnesInconnues.length > 0) throw new Error(`Colonne inconnue : ${colonnesInconnues.join(', ')}`);
  const ligne = {};
  for (const colonne of enTete) {
    if (!Object.prototype.hasOwnProperty.call(valeurs, colonne)) throw new Error(`Colonne absente : ${colonne}`);
    ligne[colonne] = valeurs[colonne];
  }
  return ligne;
}

// Le numéro d'un identifiant, sans zéros de tête : `Q-000007` → `7`.
const numeroDe = (identifiant) => String(Number(identifiant.split('-')[1]));

const COMMUNES = { 'Archivé le': '', 'Modifié le': MODIFIE_LE, 'Modifié par': MODIFIE_PAR };

// Colonnes de validation d'une ligne : renseignées seulement si la ligne est validée.
function colonnesDeValidation(etatDeLaLigne) {
  const validee = etatDeLaLigne === 'Validé';
  return {
    Statut: etatDeLaLigne,
    'Validé par': validee ? 'validateur-fictif' : '',
    'Date de validation': validee ? '2027-01-01' : '',
    'Commentaire du validateur': '',
  };
}

// Mondes (§ 6.6).
const MONDES = [
  ['MON-01', '1', 'oui', 'sang', '6', '90', '4'],
  ['MON-02', '2', 'oui', 'bcp', '3', '90', '3'],
  ['MON-03', '3', 'non', 'chocolat', '0', '90', '2'],
  ['MON-04', '4', 'oui', 'neutre', '2', '80', '2'],
];

export const LIGNES_MONDES = MONDES.map(([id, ordre, visible, milieu, etoiles, seuil, questions]) => construireLigne(EN_TETES.Mondes, {
  ID: id,
  Parcours: 'microbiologie',
  Ordre: ordre,
  Nom: `Monde fictif ${numeroDe(id)}`,
  Visible: visible,
  Milieu: milieu,
  'Étoiles pour le boss': etoiles,
  'Seuil du boss': seuil,
  'Questions du boss': questions,
  ...COMMUNES,
}));

// Niveaux (§ 6.7).
const NIVEAUX = [
  ['NIV-0001', 'MON-01', '1', 'normal', 'swipe', REGLAGES_A],
  ['NIV-0002', 'MON-01', '2', 'normal', 'swipe', REGLAGES_A],
  ['NIV-0003', 'MON-01', '3', 'normal', 'qcm', REGLAGES_VIDES],
  ['NIV-0004', 'MON-01', '4', 'boss', 'swipe', REGLAGES_A],
  ['NIV-0005', 'MON-02', '1', 'normal', 'tri', REGLAGES_A],
  ['NIV-0006', 'MON-02', '2', 'normal', 'swipe', REGLAGES_C],
  ['NIV-0007', 'MON-02', '3', 'boss', 'tri', REGLAGES_AC],
  ['NIV-0008', 'MON-03', '1', 'normal', 'swipe', REGLAGES_A],
  ['NIV-0009', 'MON-03', '2', 'boss', 'swipe', REGLAGES_AC],
  ['NIV-0010', 'MON-04', '1', 'normal', 'qcm', REGLAGES_VIDES],
  ['NIV-0011', 'MON-04', '2', 'boss', 'qcm', REGLAGES_C],
];

export const LIGNES_NIVEAUX = NIVEAUX.map(([id, monde, ordre, type, mecanique, reglages]) => construireLigne(EN_TETES.Niveaux, {
  ID: id,
  Monde: monde,
  Ordre: ordre,
  Type: type,
  Mécanique: mecanique,
  Titre: `Niveau fictif ${numeroDe(id)}`,
  Consigne: `Consigne fictive ${numeroDe(id)}`,
  Simplifié: 'non',
  Certitude: 'non',
  Réglages: reglages,
  ...COMMUNES,
}));

// Faits (§ 6.8). `Page` est le numéro de la ligne dans son onglet.
const FAITS_FICTIFS = [
  ['FF-01', 'Bactérie A', 'Valeur A1', 'Valeur B1', 'Validé', ''],
  ['FF-02', 'Bactérie B', 'Valeur A2', 'Valeur B2', 'Validé', ''],
  ['FF-03', 'Bactérie C', 'Valeur A3', 'Valeur B1', 'Validé', ''],
  ['FF-04', 'Bactérie D', 'Valeur A1', 'Valeur B2', 'Validé', ''],
  ['FF-05', 'Bactérie E', 'Valeur A2', 'Valeur B1', 'Validé', ''],
  ['FF-06', 'Bactérie F', 'Valeur A3', 'Valeur B2', 'Validé', ''],
  ['FF-07', 'Bactérie G', 'Valeur A1', 'Valeur B7', 'À valider', 'Libellé;Colonne A'],
  ['FF-08', 'Bactérie H', 'Valeur A2', 'Valeur B8', 'À valider', ''],
  ['FF-09', 'Bactérie I', 'Valeur A9', 'Valeur B9', 'Validé', ''],
];

export const LIGNES_FAITS_FICTIFS = FAITS_FICTIFS.map(([id, libelle, colonneA, colonneB, etat, champsValides], position) => construireLigne(EN_TETES.Faits_fictifs, {
  ID: id,
  Libellé: libelle,
  'Colonne A': colonneA,
  'Colonne B': colonneB,
  Source: 'S1',
  Page: String(position + 1),
  ...colonnesDeValidation(etat),
  'Champs validés': champsValides,
  ...COMMUNES,
}));

const AUTRES_FAITS_FICTIFS = [
  ['AF-01', 'Antibiotique X', 'Valeur C1', 'Validé'],
  ['AF-02', 'Antibiotique Y', 'Valeur C2', 'Validé'],
  ['AF-03', 'Antibiotique Z', 'Valeur C1', 'Validé'],
];

export const LIGNES_AUTRES_FAITS_FICTIFS = AUTRES_FAITS_FICTIFS.map(([id, libelle, colonneC, etat], position) => construireLigne(EN_TETES.Autres_faits_fictifs, {
  ID: id,
  Libellé: libelle,
  'Colonne C': colonneC,
  Source: 'S1',
  Page: String(position + 1),
  ...colonnesDeValidation(etat),
  'Champs validés': '',
  ...COMMUNES,
}));

// Questions (§ 6.9). `FF-<n>` vaut `Faits_fictifs:FF-<n>`, `AF-<n>` vaut `Autres_faits_fictifs:AF-<n>`.
const ONGLET_DU_PREFIXE = { FF: 'Faits_fictifs', AF: 'Autres_faits_fictifs' };
const referenceDeFait = (identifiant) => `${ONGLET_DU_PREFIXE[identifiant.split('-')[0]]}:${identifiant}`;

// [ID, monde, mécanique, faits, champ, réponse propre, leurres, palier, plancher, écarts à la valeur commune]
const QUESTIONS = [
  ['Q-000001', 'MON-01', 'swipe', 'FF-01', 'Colonne A', '', '', 'facile', '', {}],
  ['Q-000002', 'MON-01', 'swipe', 'FF-02', 'Colonne A', '', '', 'facile', '', {}],
  ['Q-000003', 'MON-01', 'swipe', 'FF-03', 'Colonne A', '', '', 'facile', '', {}],
  ['Q-000004', 'MON-01', 'swipe', 'FF-04', 'Colonne B', '', '', 'moyen', '', {}],
  ['Q-000005', 'MON-01', 'swipe', 'FF-05', 'Colonne B', '', '', 'moyen', '', {}],
  ['Q-000006', 'MON-01', 'swipe', 'FF-07', 'Colonne A', '', '', 'moyen', '', {}],
  ['Q-000007', 'MON-01', 'swipe', 'FF-08', 'Colonne A', '', '', 'moyen', '', { etat: 'À valider' }],
  ['Q-000008', 'MON-01', 'qcm', 'FF-01', 'Colonne A', 'Réponse propre A', 'Leurre 1;Leurre 2;Leurre 3', 'moyen', '', {}],
  ['Q-000009', 'MON-01', 'qcm', 'FF-02', 'Colonne A', 'Réponse propre B', 'Leurre 1;Leurre 2;Leurre 4', 'moyen', '', {}],
  ['Q-000010', 'MON-01', 'qcm', 'FF-06', 'Colonne A', 'Réponse propre C', 'Leurre 2;Leurre 3;Leurre 4', 'moyen', '', {}],
  ['Q-000011', 'MON-02', 'tri', 'FF-01;FF-02;FF-03', 'Colonne A', '', '', 'difficile', 'difficile', {}],
  ['Q-000012', 'MON-02', 'tri', 'FF-04;FF-05', 'Colonne B', '', '', 'difficile', 'difficile', {}],
  ['Q-000013', 'MON-02', 'swipe', 'AF-01', 'Colonne C', '', '', 'moyen', '', {}],
  ['Q-000014', 'MON-02', 'swipe', 'AF-02', 'Colonne C', '', '', 'moyen', '', {}],
  ['Q-000015', 'MON-02', 'swipe', 'AF-03', 'Colonne C', '', '', 'moyen', '', { simplifiee: 'oui' }],
  ['Q-000016', 'MON-03', 'swipe', 'FF-06', 'Colonne A', '', '', 'moyen', '', {}],
  ['Q-000017', 'MON-03', 'swipe', 'FF-09', 'Colonne A', '', '', 'moyen', '', { etat: 'À corriger' }],
  ['Q-000018', 'MON-04', 'qcm', 'AF-01', 'Colonne C', 'Réponse propre D', 'Leurre 5;Leurre 6', 'avancé', 'avancé', {}],
  ['Q-000019', 'MON-04', 'qcm', 'AF-02', 'Colonne C', 'Réponse propre E', 'Leurre 5;Leurre 7', 'facile', '', {}],
];

export const LIGNES_QUESTIONS = QUESTIONS.map(([id, monde, mecanique, faits, champ, reponsePropre, leurres, palier, plancher, ecarts]) => construireLigne(EN_TETES.Questions, {
  ID: id,
  Monde: monde,
  Mécanique: mecanique,
  Énoncé: `Énoncé fictif ${numeroDe(id)}`,
  Fait: faits.split(';').map(referenceDeFait).join(';'),
  Champ: champ,
  'Réponse propre': reponsePropre,
  Leurres: leurres,
  Explication: `Explication fictive ${numeroDe(id)}`,
  Simplifiée: ecarts.simplifiee ?? 'non',
  Palier: palier,
  Plancher: plancher,
  Origine: 'admin',
  ...colonnesDeValidation(ecarts.etat ?? 'Validé'),
  ...COMMUNES,
}));

// Composition (§ 6.10), dans l'ordre de l'identifiant ; chaque couple est [niveau, [questions dans l'ordre]].
const COMPOSITION_PAR_NIVEAU = [
  ['NIV-0001', ['Q-000001', 'Q-000002', 'Q-000003']],
  ['NIV-0002', ['Q-000004', 'Q-000005', 'Q-000006', 'Q-000007']],
  ['NIV-0003', ['Q-000008', 'Q-000009', 'Q-000010']],
  ['NIV-0004', ['Q-000001', 'Q-000002', 'Q-000003', 'Q-000004', 'Q-000005', 'Q-000008']],
  ['NIV-0005', ['Q-000011', 'Q-000012']],
  ['NIV-0006', ['Q-000013', 'Q-000014', 'Q-000015']],
  ['NIV-0007', ['Q-000011', 'Q-000012', 'Q-000013', 'Q-000014', 'Q-000006']],
  ['NIV-0008', ['Q-000016', 'Q-000017']],
  ['NIV-0009', ['Q-000016', 'Q-000013', 'Q-000014']],
  ['NIV-0010', ['Q-000018', 'Q-000019']],
  ['NIV-0011', ['Q-000018', 'Q-000019', 'Q-000013']],
];

export const LIGNES_COMPOSITION = COMPOSITION_PAR_NIVEAU
  .flatMap(([niveau, questions]) => questions.map((question, position) => ({ niveau, question, ordre: position + 1 })))
  .map(({ niveau, question, ordre }, rang) => construireLigne(EN_TETES.Composition, {
    ID: `CMP-${String(rang + 1).padStart(6, '0')}`,
    Niveau: niveau,
    Question: question,
    Ordre: String(ordre),
    ...COMMUNES,
  }));
