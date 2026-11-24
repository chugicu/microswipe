// Contrôle de forme d'un paquet de contenu côté téléphone : il dit si l'objet a la forme de lot-306.md § 6.2, sans rien filtrer (le filtre reste au serveur).
//
// Fichier pur : aucun accès au document, à la fenêtre, au réseau ni à l'horloge ; aucune fonction ne modifie ce qu'elle reçoit.
// Un défaut ne cite jamais une valeur du contenu : seulement des noms de section, des identifiants et des noms de colonnes.

export const TYPES_DE_PAQUET = Object.freeze(['internes', 'admin']);

export const SECTIONS_DE_LIGNES = Object.freeze(['mondes', 'niveaux', 'composition', 'questions']);

export const CLES_DU_PAQUET = Object.freeze([
  'type', 'versionContenu', 'genereLe',
  'mondes', 'niveaux', 'composition', 'questions',
  'faits', 'compositionPrevue', 'reglages',
]);

export const CLE_ETAT_DES_QUESTIONS = 'etatDesQuestions';

// Écrite aussi dans le filtre du serveur (lot-306.md § 6.3) : si l'une des deux listes change, l'autre suit.
export const COLONNES_RESERVEES = Object.freeze([
  'Statut',
  'Validé par',
  'Date de validation',
  'Commentaire du validateur',
  'Champs validés',
  'Archivé le',
  'Modifié le',
  'Modifié par',
]);

export const MODELE_DATE_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

const aUnePropriete = (objet, nom) => Object.prototype.hasOwnProperty.call(objet, nom);

function estObjetSimple(valeur) {
  if (valeur === null || typeof valeur !== 'object' || Array.isArray(valeur)) return false;
  const prototype = Object.getPrototypeOf(valeur);
  return prototype === Object.prototype || prototype === null;
}

const estEntierPositifOuNul = (valeur) => Number.isInteger(valeur) && valeur >= 0;

// Contrôle les lignes d'une section ou d'un onglet de faits (les éléments non objets sont déjà signalés par l'appelant).
function controlerLignes(racine, lignes, interdireReservees, ajouter) {
  const dejaVus = new Set();
  lignes.forEach((ligne, position) => {
    if (!estObjetSimple(ligne)) return;
    const identifiantValide = typeof ligne.ID === 'string' && ligne.ID.trim() !== '';
    // Sans identifiant lisible, la ligne est désignée par sa position, jamais par une valeur.
    const nom = identifiantValide ? ligne.ID.trim() : `ligne-${position + 1}`;
    if (!identifiantValide) {
      ajouter('id', `${racine}/${nom}/ID`);
    } else if (dejaVus.has(nom)) {
      ajouter('id', `${racine}/${nom}/ID`);
    } else {
      dejaVus.add(nom);
    }
    for (const colonne of Object.keys(ligne)) {
      if (colonne !== 'ID' && typeof ligne[colonne] !== 'string') {
        ajouter('valeur_non_texte', `${racine}/${nom}/${colonne}`);
      }
      if (interdireReservees && COLONNES_RESERVEES.includes(colonne)) {
        ajouter('colonne_reservee', `${racine}/${nom}/${colonne}`);
      }
    }
  });
}

function controlerSection(nom, valeur, interdireReservees, ajouter) {
  if (!Array.isArray(valeur)) {
    ajouter('section', nom);
    return;
  }
  valeur.forEach((element, position) => {
    if (!estObjetSimple(element)) ajouter('section', `${nom}/ligne-${position + 1}`);
  });
  controlerLignes(nom, valeur, interdireReservees, ajouter);
}

function controlerFaits(faits, interdireReservees, ajouter) {
  if (!estObjetSimple(faits)) {
    ajouter('faits', 'faits');
    return;
  }
  const onglets = Object.keys(faits);
  // Même ordre que Array.prototype.sort sans argument : le serveur écrit les onglets ainsi (lot-306.md § 6.2).
  const triees = [...onglets].sort();
  if (onglets.some((onglet, position) => onglet !== triees[position])) ajouter('faits', 'faits');
  for (const onglet of onglets) {
    const chemin = `faits/${onglet}`;
    const lignes = faits[onglet];
    if (!Array.isArray(lignes)) {
      ajouter('faits', chemin);
      continue;
    }
    lignes.forEach((ligne, position) => {
      if (!estObjetSimple(ligne)) ajouter('faits', `${chemin}/ligne-${position + 1}`);
    });
    controlerLignes(chemin, lignes, interdireReservees, ajouter);
  }
}

function controlerEtatDesQuestions(etat, ajouter) {
  if (!estObjetSimple(etat)) {
    ajouter('etat_des_questions', CLE_ETAT_DES_QUESTIONS);
    return;
  }
  for (const question of Object.keys(etat)) {
    const entree = etat[question];
    const bonneForme = estObjetSimple(entree)
      && Object.keys(entree).length === 2
      && typeof entree.servie === 'boolean'
      && Array.isArray(entree.motifs)
      && entree.motifs.every((motif) => typeof motif === 'string');
    if (!bonneForme) ajouter('etat_des_questions', `${CLE_ETAT_DES_QUESTIONS}/${question}`);
  }
}

// Rend tous les défauts `{ regle, chemin }` du paquet ; un tableau vide veut dire que la forme est bonne.
export function controlerFormeDuPaquet(paquet) {
  const defauts = [];
  const ajouter = (regle, chemin) => defauts.push({ regle, chemin });

  if (!estObjetSimple(paquet)) {
    ajouter('objet', 'paquet');
    return defauts;
  }

  const typeConnu = TYPES_DE_PAQUET.includes(paquet.type);
  if (!typeConnu) ajouter('type', 'type');
  const estInternes = typeConnu && paquet.type === 'internes';
  const estAdmin = typeConnu && paquet.type === 'admin';

  const attendues = estAdmin ? [...CLES_DU_PAQUET, CLE_ETAT_DES_QUESTIONS] : [...CLES_DU_PAQUET];
  for (const cle of attendues) {
    if (!aUnePropriete(paquet, cle)) ajouter('cle_manquante', cle);
  }
  for (const cle of Object.keys(paquet)) {
    if (attendues.includes(cle)) continue;
    // Avec un type inconnu, l'état des questions n'est ni attendu ni inattendu : il n'est pas examiné.
    if (!typeConnu && cle === CLE_ETAT_DES_QUESTIONS) continue;
    ajouter('cle_inattendue', cle);
  }

  if (aUnePropriete(paquet, 'versionContenu') && !estEntierPositifOuNul(paquet.versionContenu)) {
    ajouter('version', 'versionContenu');
  }
  if (aUnePropriete(paquet, 'genereLe')
    && !(typeof paquet.genereLe === 'string' && MODELE_DATE_UTC.test(paquet.genereLe))) {
    ajouter('date', 'genereLe');
  }

  for (const section of SECTIONS_DE_LIGNES) {
    if (aUnePropriete(paquet, section)) controlerSection(section, paquet[section], estInternes, ajouter);
  }
  if (aUnePropriete(paquet, 'faits')) controlerFaits(paquet.faits, estInternes, ajouter);

  if (aUnePropriete(paquet, 'compositionPrevue')) {
    if (!estObjetSimple(paquet.compositionPrevue)) {
      ajouter('composition_prevue', 'compositionPrevue');
    } else {
      for (const niveau of Object.keys(paquet.compositionPrevue)) {
        if (!estEntierPositifOuNul(paquet.compositionPrevue[niveau])) {
          ajouter('composition_prevue', `compositionPrevue/${niveau}`);
        }
      }
    }
  }

  if (aUnePropriete(paquet, 'reglages')) {
    if (!estObjetSimple(paquet.reglages)) {
      ajouter('reglages', 'reglages');
    } else {
      for (const cle of Object.keys(paquet.reglages)) {
        if (typeof paquet.reglages[cle] !== 'string') ajouter('valeur_non_texte', `reglages/${cle}`);
      }
    }
  }

  if (estAdmin && aUnePropriete(paquet, CLE_ETAT_DES_QUESTIONS)) {
    controlerEtatDesQuestions(paquet[CLE_ETAT_DES_QUESTIONS], ajouter);
  }

  return defauts;
}
