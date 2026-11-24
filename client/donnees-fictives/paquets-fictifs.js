// Données fictives, aucun contenu médical. Phases 1 et 2, en attendant le serveur (lot 307). Toute modification augmente versionContenu et contenu.version.
//
// Assemble les deux paquets fictifs « internes » et « admin » à partir des lignes complètes (lot-102.md § 6.11 et § 6.12).
// L'assemblage n'évalue jamais la validation, la visibilité ni les champs validés : il n'applique que les listes de ATTENDU_FICTIF,
// pour ne pas écrire un second filtre (le filtre est celui du serveur, lot 306).

import { COLONNES_RESERVEES } from '../contenu/forme-du-paquet.js';
import {
  EN_TETES,
  GENERE_LE,
  LIGNES_AUTRES_FAITS_FICTIFS,
  LIGNES_COMPOSITION,
  LIGNES_FAITS_FICTIFS,
  LIGNES_MONDES,
  LIGNES_NIVEAUX,
  LIGNES_QUESTIONS,
  REGLAGES_FICTIFS,
  VERSION_CONTENU,
} from './lignes-fictives.js';

const sansReservees = (enTete) => enTete.filter((colonne) => !COLONNES_RESERVEES.includes(colonne));

// `n` identifiants consécutifs à partir de `debut` : ('CMP-', 6, 2, 4) → CMP-000002 à CMP-000004.
function suite(prefixe, largeur, debut, fin) {
  const identifiants = [];
  for (let numero = debut; numero <= fin; numero += 1) {
    identifiants.push(`${prefixe}${String(numero).padStart(largeur, '0')}`);
  }
  return identifiants;
}

const COLONNES_AF_INTERNES = ['ID', 'Libellé', 'Colonne C', 'Source', 'Page'];
const COLONNES_FF_INTERNES = ['ID', 'Libellé', 'Colonne A', 'Colonne B', 'Source', 'Page'];
const COLONNES_FF_07_INTERNES = ['ID', 'Libellé', 'Colonne A'];

const IDENTIFIANTS_QUESTIONS_ADMIN = suite('Q-', 6, 1, 19);

// Niveaux de chaque paquet, avec le nombre de lignes de composition prévues (avant tout filtre de questions).
const PREVU_INTERNES = {
  'NIV-0001': 3, 'NIV-0002': 4, 'NIV-0003': 3, 'NIV-0004': 6, 'NIV-0005': 2,
  'NIV-0006': 3, 'NIV-0007': 5, 'NIV-0010': 2, 'NIV-0011': 3,
};

// Seize questions servies ; les trois autres, avec leurs motifs dans l'ordre de MOTIFS du lot 306.
const ETAT_DES_QUESTIONS_ADMIN = {
  ...Object.fromEntries(IDENTIFIANTS_QUESTIONS_ADMIN.map((identifiant) => [identifiant, { servie: true, motifs: [] }])),
  'Q-000007': { servie: false, motifs: ['question_non_validee', 'fait_non_valide'] },
  'Q-000016': { servie: false, motifs: ['monde_invisible'] },
  'Q-000017': { servie: false, motifs: ['question_non_validee', 'monde_invisible'] },
};

// Pour chaque onglet de faits : identifiant → colonnes servies (`null` = toutes les colonnes de l'onglet).
// Les clés des onglets sont dans l'ordre alphabétique, comme dans le paquet du serveur.
export const ATTENDU_FICTIF = Object.freeze({
  internes: {
    mondes: ['MON-01', 'MON-02', 'MON-04'],
    niveaux: [...suite('NIV-', 4, 1, 7), 'NIV-0010', 'NIV-0011'],
    questions: [...suite('Q-', 6, 1, 6), ...suite('Q-', 6, 8, 15), 'Q-000018', 'Q-000019'],
    composition: [...suite('CMP-', 6, 1, 6), ...suite('CMP-', 6, 8, 26), ...suite('CMP-', 6, 32, 36)],
    faits: {
      Autres_faits_fictifs: { 'AF-01': COLONNES_AF_INTERNES, 'AF-02': COLONNES_AF_INTERNES, 'AF-03': COLONNES_AF_INTERNES },
      Faits_fictifs: {
        'FF-01': COLONNES_FF_INTERNES,
        'FF-02': COLONNES_FF_INTERNES,
        'FF-03': COLONNES_FF_INTERNES,
        'FF-04': COLONNES_FF_INTERNES,
        'FF-05': COLONNES_FF_INTERNES,
        'FF-06': COLONNES_FF_INTERNES,
        'FF-07': COLONNES_FF_07_INTERNES,
      },
    },
    // Colonnes des quatre sections de lignes : celles du § 6.3 moins les colonnes réservées.
    colonnes: {
      mondes: sansReservees(EN_TETES.Mondes),
      niveaux: sansReservees(EN_TETES.Niveaux),
      composition: sansReservees(EN_TETES.Composition),
      questions: sansReservees(EN_TETES.Questions),
    },
    compositionPrevue: PREVU_INTERNES,
  },
  admin: {
    mondes: suite('MON-', 2, 1, 4),
    niveaux: suite('NIV-', 4, 1, 11),
    questions: IDENTIFIANTS_QUESTIONS_ADMIN,
    composition: suite('CMP-', 6, 1, 36),
    faits: {
      Autres_faits_fictifs: { 'AF-01': null, 'AF-02': null, 'AF-03': null },
      Faits_fictifs: Object.fromEntries(suite('FF-', 2, 1, 9).map((identifiant) => [identifiant, null])),
    },
    compositionPrevue: {
      'NIV-0001': 3, 'NIV-0002': 4, 'NIV-0003': 3, 'NIV-0004': 6, 'NIV-0005': 2, 'NIV-0006': 3,
      'NIV-0007': 5, 'NIV-0008': 2, 'NIV-0009': 3, 'NIV-0010': 2, 'NIV-0011': 3,
    },
    // Ce que produirait le filtre du lot 306 sur ces lignes (le test 14 le recalcule à part).
    etatDesQuestions: ETAT_DES_QUESTIONS_ADMIN,
  },
});

// Les lignes dont l'ID est une clé de `colonnesParId`, dans l'ordre du tableau d'origine ; la valeur donne les colonnes
// gardées (`null` ou liste absente = toutes).
function retenir(lignes, colonnesParId) {
  return lignes
    .filter((ligne) => Object.prototype.hasOwnProperty.call(colonnesParId, ligne.ID))
    .map((ligne) => {
      const colonnes = colonnesParId[ligne.ID];
      if (!colonnes) return { ...ligne };
      return Object.fromEntries(colonnes.map((colonne) => [colonne, ligne[colonne]]));
    });
}

// Une section de lignes : les identifiants de la liste, avec les mêmes colonnes pour chacun.
const retenirSection = (lignes, identifiants, colonnes) => retenir(lignes, Object.fromEntries(identifiants.map((identifiant) => [identifiant, colonnes ?? null])));

const LIGNES_DES_FAITS = {
  Autres_faits_fictifs: LIGNES_AUTRES_FAITS_FICTIFS,
  Faits_fictifs: LIGNES_FAITS_FICTIFS,
};

function assembler(type) {
  const attendu = ATTENDU_FICTIF[type];
  const colonnes = attendu.colonnes ?? {};
  const faits = {};
  for (const onglet of Object.keys(attendu.faits)) {
    faits[onglet] = retenir(LIGNES_DES_FAITS[onglet], attendu.faits[onglet]);
  }
  const paquet = {
    type,
    versionContenu: VERSION_CONTENU,
    genereLe: GENERE_LE,
    mondes: retenirSection(LIGNES_MONDES, attendu.mondes, colonnes.mondes),
    niveaux: retenirSection(LIGNES_NIVEAUX, attendu.niveaux, colonnes.niveaux),
    composition: retenirSection(LIGNES_COMPOSITION, attendu.composition, colonnes.composition),
    questions: retenirSection(LIGNES_QUESTIONS, attendu.questions, colonnes.questions),
    faits,
    compositionPrevue: { ...attendu.compositionPrevue },
    reglages: { ...REGLAGES_FICTIFS },
  };
  if (attendu.etatDesQuestions) {
    paquet.etatDesQuestions = structuredClone(attendu.etatDesQuestions);
  }
  return paquet;
}

// Chaque appel rend un nouvel objet : un appelant qui modifie son résultat ne change pas le suivant.
export function paquetInternesFictif() {
  return assembler('internes');
}

export function paquetAdminFictif() {
  return assembler('admin');
}
