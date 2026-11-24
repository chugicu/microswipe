// Règle pure du dialogue commun : contrôle des options et décisions de fermeture (spec du lot 105 § 6.7).
function erreur() {
  const e = new Error('dialogue_mal_forme');
  e.code = 'dialogue_mal_forme';
  return e;
}

const texteNonVide = (v) => typeof v === 'string' && v.trim() !== '';

function bouton(b) {
  if (!b || typeof b !== 'object' || !texteNonVide(b.libelle) || typeof b.surAppui !== 'function') throw erreur();
  return b;
}

export function preparerDialogue(options) {
  if (!options || typeof options !== 'object') throw erreur();
  if (!texteNonVide(options.titre) || typeof options.texte !== 'string') throw erreur();
  const action = bouton(options.action);
  const secondaire = options.secondaire === undefined ? { libelle: 'Annuler', surAppui: () => {} } : bouton(options.secondaire);
  if (options.irreversible !== undefined && typeof options.irreversible !== 'boolean') throw erreur();
  const irreversible = options.irreversible === true;
  return Object.freeze({
    titre: options.titre,
    texte: options.texte,
    boutons: Object.freeze([
      Object.freeze({ role: 'action', libelle: action.libelle }),
      Object.freeze({ role: 'secondaire', libelle: secondaire.libelle }),
    ]),
    fermerSurVoile: !irreversible,
    fermerSurEchap: true,
  });
}
