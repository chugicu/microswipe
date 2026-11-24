// Liste des migrations de la base locale `microbio` : une migration est une donnée, jamais une fonction.
//
// Règles de travail :
// - un lot qui a besoin d'un magasin ou d'un index ajoute une migration à la fin, avec la version suivante ;
// - une migration déjà enregistrée sur `dev` n'est jamais modifiée, renumérotée ni retirée : des navigateurs l'ont peut-être déjà appliquée ;
// - la version de la base est le nombre de migrations ;
// - aucune migration ne supprime un magasin, un index ni des données (à demander à l'auteur le jour où il le faudra).
//
// Étapes admises :
//   { etape: 'creerMagasin', magasin: 'nom', cle: 'champ' | ['champ1', 'champ2'] }
//   { etape: 'creerIndex', magasin: 'nom', index: 'nom', cle: 'champ' | ['champ1', 'champ2'], unique: false }
// Noms : ^[a-z][a-z0-9-]*$. Clés toujours en ligne (un champ de l'enregistrement, ou plusieurs).

export const NOM_BASE = 'microbio';

export const MIGRATIONS = [
  {
    version: 1,
    lot: '104',
    description: 'Création de la base',
    etapes: [],
  },
  {
    version: 2,
    lot: '107',
    description: 'Paquets de contenu',
    etapes: [{ etape: 'creerMagasin', magasin: 'contenu', cle: 'type' }],
  },
];
