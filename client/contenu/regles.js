// Fonctions pures du chargement du contenu : lecture d'un enregistrement rangé, décision après la réponse de la source, gel du paquet.
import { controlerFormeDuPaquet } from './forme-du-paquet.js';

export const TYPES_RANGES = Object.freeze(['internes']);
export const TYPES_DE_PAQUET_DEMANDABLES = Object.freeze(['internes', 'admin']);
export const MAGASIN_CONTENU = 'contenu';

function estObjetSimple(valeur) {
  if (valeur === null || typeof valeur !== 'object' || Array.isArray(valeur)) return false;
  const prototype = Object.getPrototypeOf(valeur);
  return prototype === Object.prototype || prototype === null;
}

function estEntierPositifOuNul(valeur) {
  return Number.isInteger(valeur) && valeur >= 0;
}

// L'enregistrement s'il est utilisable, sinon null : un enregistrement d'une forme ancienne n'est jamais lu de travers.
export function lireEnregistrement(valeur, type) {
  if (!estObjetSimple(valeur)) return null;
  if (valeur.type !== type) return null;
  if (!estEntierPositifOuNul(valeur.versionContenu)) return null;
  if (typeof valeur.recuLe !== 'string') return null;
  if (controlerFormeDuPaquet(valeur.paquet).length > 0) return null;
  if (valeur.paquet.type !== type) return null;
  if (valeur.paquet.versionContenu !== valeur.versionContenu) return null;
  return valeur;
}

// Ne connaît pas la version locale, exprès : une version reçue plus petite remplace quand même (le serveur est la référence).
export function deciderApresReponse(reponse, type) {
  const garder = (motif, erreur) => ({ action: 'garder', motif, erreur: erreur === undefined ? null : erreur });
  if (!estObjetSimple(reponse) || typeof reponse.ok !== 'boolean') return garder('reponse_illisible');
  if (reponse.ok === false) return garder('refus', typeof reponse.erreur === 'string' ? reponse.erreur : '');
  if (reponse.aJour === true) return garder('a_jour');
  if (reponse.aJour !== false || reponse.paquet === undefined) return garder('reponse_illisible');
  if (controlerFormeDuPaquet(reponse.paquet).length > 0) return garder('paquet_mal_forme');
  if (reponse.paquet.type !== type) return garder('type_inattendu');
  if (!estEntierPositifOuNul(reponse.versionContenu) || reponse.versionContenu !== reponse.paquet.versionContenu) {
    return garder('version_incoherente');
  }
  return { action: 'remplacer', motif: 'nouvelle_version', erreur: null };
}

export function creerEnregistrement(paquet, recuLe) {
  return { type: paquet.type, versionContenu: paquet.versionContenu, recuLe, paquet };
}

// Gèle l'objet et tout ce qu'il contient : aucun module ne peut modifier le paquet en cours.
export function gelerEnProfondeur(objet) {
  if (objet !== null && typeof objet === 'object' && !Object.isFrozen(objet)) {
    Object.freeze(objet);
    for (const valeur of Object.values(objet)) gelerEnProfondeur(valeur);
  }
  return objet;
}
