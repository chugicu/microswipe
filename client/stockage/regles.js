// Fonctions pures du stockage local : erreurs, clés, migrations, schéma, requêtes ; aucun accès au navigateur, à l'heure ni au hasard.

export const CODES_D_ERREUR = [
  'stockage_indisponible',
  'migration_invalide',
  'migration_echouee',
  'version_plus_recente',
  'base_bloquee',
  'base_fermee',
  'magasin_inconnu',
  'magasin_hors_transaction',
  'transaction_en_lecture',
  'cle_invalide',
  'requete_invalide',
  'valeur_non_clonable',
  'quota_depasse',
  'transaction_inactive',
  'transaction_echouee',
];

// Une erreur prévue : `message` et `code` valent le code, pour que les lots suivants testent l'un ou l'autre.
export function creerErreurDeStockage(code) {
  const erreur = new Error(code);
  erreur.code = code;
  return erreur;
}

// Une propriété héritée (`constructor`…) n'est jamais un nom de champ, de magasin ni d'index.
function possede(objet, nom) {
  return Object.hasOwn(objet, nom);
}

function estCleValideDans(cle, pile) {
  if (typeof cle === 'number') return !Number.isNaN(cle);
  if (typeof cle === 'string') return true;
  if (cle instanceof Date) return !Number.isNaN(cle.getTime());
  if (Array.isArray(cle)) {
    if (pile.includes(cle)) return false;
    pile.push(cle);
    const valide = cle.every((element) => estCleValideDans(element, pile));
    pile.pop();
    return valide;
  }
  return false;
}

export function estCleValide(cle) {
  return estCleValideDans(cle, []);
}

// Ordre des types des clés : nombre, date, texte, tableau.
function rang(cle) {
  if (typeof cle === 'number') return 0;
  if (cle instanceof Date) return 1;
  if (typeof cle === 'string') return 2;
  return 3;
}

export function comparerCles(a, b) {
  if (!estCleValide(a) || !estCleValide(b)) throw creerErreurDeStockage('cle_invalide');
  return comparerValides(a, b);
}

function comparerValides(a, b) {
  const rangA = rang(a);
  const rangB = rang(b);
  if (rangA !== rangB) return rangA < rangB ? -1 : 1;
  if (rangA === 3) {
    const commun = Math.min(a.length, b.length);
    for (let i = 0; i < commun; i += 1) {
      const resultat = comparerValides(a[i], b[i]);
      if (resultat !== 0) return resultat;
    }
    if (a.length === b.length) return 0;
    return a.length < b.length ? -1 : 1;
  }
  // Nombres par valeur, dates par heure, textes par unités de code : l'opérateur < fait les trois.
  const x = rangA === 1 ? a.getTime() : a;
  const y = rangA === 1 ? b.getTime() : b;
  if (x === y) return 0;
  return x < y ? -1 : 1;
}

function extraireChamp(valeur, champ) {
  if (valeur === null || typeof valeur !== 'object' || !possede(valeur, champ)) {
    throw creerErreurDeStockage('cle_invalide');
  }
  return valeur[champ];
}

// cheminDeCle : un nom de champ, ou un tableau de noms (clé composée).
export function extraireCle(valeur, cheminDeCle) {
  const cle = Array.isArray(cheminDeCle)
    ? cheminDeCle.map((champ) => extraireChamp(valeur, champ))
    : extraireChamp(valeur, cheminDeCle);
  if (!estCleValide(cle)) throw creerErreurDeStockage('cle_invalide');
  return cle;
}

// Un tableau vide se classe après tout nombre, date ou texte : il borne par le haut toutes les clés qui commencent par le préfixe.
export function bornesDuPrefixe(prefixe) {
  if (!Array.isArray(prefixe) || !estCleValide(prefixe)) throw creerErreurDeStockage('cle_invalide');
  return { depuis: [...prefixe], jusqua: [...prefixe, []] };
}

const NOM_VALIDE = /^[a-z][a-z0-9-]*$/;

const estTexteNonVide = (x) => typeof x === 'string' && x.length > 0;
const estNomValide = (x) => typeof x === 'string' && NOM_VALIDE.test(x);

function estCleDeMigrationValide(cle) {
  if (estTexteNonVide(cle)) return true;
  return Array.isArray(cle) && cle.length >= 2 && cle.every(estTexteNonVide) && new Set(cle).size === cle.length;
}

// Rend les défauts { version, regle } ; vide si la liste tient les règles de migrations.js.
// Une liste vide est refusée (règle `version`) : la base ne s'ouvre pas à la version 0.
export function validerMigrations(migrations) {
  const defauts = [];
  if (!Array.isArray(migrations) || migrations.length === 0) return [{ version: 0, regle: 'version' }];

  const magasins = new Map(); // nom du magasin → noms de ses index
  migrations.forEach((migration, position) => {
    if (migration === null || typeof migration !== 'object') {
      defauts.push({ version: undefined, regle: 'version' });
      return;
    }
    const signaler = (regle) => defauts.push({ version: migration.version, regle });

    if (migration.version !== position + 1) signaler('version');
    if (!estTexteNonVide(migration.lot) || !estTexteNonVide(migration.description)) signaler('description');
    if (!Array.isArray(migration.etapes)) {
      signaler('etape_inconnue');
      return;
    }

    for (const etape of migration.etapes) {
      if (etape === null || typeof etape !== 'object') {
        signaler('etape_inconnue');
        continue;
      }
      if (etape.etape === 'creerMagasin') {
        if (etape.magasin === undefined || etape.cle === undefined) {
          signaler('etape_inconnue');
          continue;
        }
        let bonne = true;
        if (!estNomValide(etape.magasin)) {
          signaler('nom_invalide');
          bonne = false;
        }
        if (!estCleDeMigrationValide(etape.cle)) {
          signaler('cle_invalide');
          bonne = false;
        }
        if (!bonne) continue;
        if (magasins.has(etape.magasin)) signaler('magasin_existant');
        else magasins.set(etape.magasin, new Set());
      } else if (etape.etape === 'creerIndex') {
        if (
          etape.magasin === undefined ||
          etape.index === undefined ||
          etape.cle === undefined ||
          typeof etape.unique !== 'boolean'
        ) {
          signaler('etape_inconnue');
          continue;
        }
        let bonne = true;
        if (!estNomValide(etape.magasin) || !estNomValide(etape.index)) {
          signaler('nom_invalide');
          bonne = false;
        }
        if (!estCleDeMigrationValide(etape.cle)) {
          signaler('cle_invalide');
          bonne = false;
        }
        if (!bonne) continue;
        const index = magasins.get(etape.magasin);
        if (!index) signaler('magasin_inconnu');
        else if (index.has(etape.index)) signaler('index_existant');
        else index.add(etape.index);
      } else {
        signaler('etape_inconnue');
      }
    }
  });
  return defauts;
}

const copierCle = (cle) => (Array.isArray(cle) ? [...cle] : cle);

// Le schéma obtenu en appliquant toutes les migrations : { version, magasins: { <nom>: { cle, index: { <nom>: { cle, unique } } } } }.
export function simulerSchema(migrations) {
  if (validerMigrations(migrations).length > 0) throw creerErreurDeStockage('migration_invalide');
  const magasins = {};
  for (const migration of migrations) {
    for (const etape of migration.etapes) {
      if (etape.etape === 'creerMagasin') {
        magasins[etape.magasin] = { cle: copierCle(etape.cle), index: {} };
      } else {
        magasins[etape.magasin].index[etape.index] = { cle: copierCle(etape.cle), unique: etape.unique };
      }
    }
  }
  return { version: migrations.length, magasins };
}

export function migrationsAAppliquer(migrations, ancienneVersion) {
  return migrations.filter((migration) => migration.version > ancienneVersion);
}

const CHAMPS_DE_REQUETE = ['index', 'cle', 'prefixe', 'depuis', 'jusqua', 'limite'];

// Rend la requête normalisée { index, depuis, jusqua, limite } (null quand absent) : `cle` et `prefixe`
// deviennent des bornes incluses. schemaDuMagasin : { cle, index } tel que rendu par simulerSchema.
export function verifierRequete(requete, schemaDuMagasin) {
  const invalide = () => creerErreurDeStockage('requete_invalide');
  const r = requete === undefined || requete === null ? {} : requete;
  if (typeof r !== 'object' || Array.isArray(r)) throw invalide();
  if (Object.keys(r).some((champ) => !CHAMPS_DE_REQUETE.includes(champ))) throw invalide();
  const present = (champ) => r[champ] !== undefined;

  let index = null;
  if (present('index')) {
    if (typeof r.index !== 'string') throw invalide();
    if (!possede(schemaDuMagasin.index, r.index)) throw creerErreurDeStockage('magasin_inconnu');
    index = r.index;
  }

  const aDesBornes = present('depuis') || present('jusqua');
  if ([present('cle'), present('prefixe'), aDesBornes].filter(Boolean).length > 1) throw invalide();

  let depuis = null;
  let jusqua = null;
  if (present('cle')) {
    if (!estCleValide(r.cle)) throw invalide();
    depuis = copierCle(r.cle);
    jusqua = copierCle(r.cle);
  } else if (present('prefixe')) {
    if (!Array.isArray(r.prefixe) || !estCleValide(r.prefixe)) throw invalide();
    ({ depuis, jusqua } = bornesDuPrefixe(r.prefixe));
  } else if (aDesBornes) {
    if (present('depuis')) {
      if (!estCleValide(r.depuis)) throw invalide();
      depuis = copierCle(r.depuis);
    }
    if (present('jusqua')) {
      if (!estCleValide(r.jusqua)) throw invalide();
      jusqua = copierCle(r.jusqua);
    }
    // Des bornes à l'envers n'ont aucun sens (le navigateur les refuse aussi).
    if (depuis !== null && jusqua !== null && comparerCles(depuis, jusqua) > 0) throw invalide();
  }

  let limite = null;
  if (present('limite')) {
    if (!Number.isInteger(r.limite) || r.limite < 1) throw invalide();
    limite = r.limite;
  }
  return { index, depuis, jusqua, limite };
}
