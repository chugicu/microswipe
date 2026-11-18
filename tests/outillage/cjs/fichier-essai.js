// Fichier CommonJS d'essai : prouve que Node charge un fichier du serveur comme le fera serveur/package.json.
const TEXTE_ESSAI_SERVEUR = 'fichier-cjs-ok';

function doubler(nombre) {
  return nombre * 2;
}

if (typeof module !== 'undefined') {
  module.exports = { TEXTE_ESSAI_SERVEUR, doubler };
}
