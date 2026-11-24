// Scénarios 1 à 13 du lot 104, communs à la base en mémoire (Node) et à la vraie base (page de vérification) ; aucune dépendance, données fictives seulement.

// Migrations d'essai : quatre migrations, un magasin chacune.
export const MIGRATIONS_D_ESSAI = [
  {
    version: 1,
    lot: '104',
    description: 'Essai : magasin simple',
    etapes: [{ etape: 'creerMagasin', magasin: 'essai-simple', cle: 'id' }],
  },
  {
    version: 2,
    lot: '104',
    description: 'Essai : magasin à clé composée',
    etapes: [{ etape: 'creerMagasin', magasin: 'essai-compose', cle: ['compte', 'niveau'] }],
  },
  {
    version: 3,
    lot: '104',
    description: 'Essai : file avec index composé',
    etapes: [
      { etape: 'creerMagasin', magasin: 'essai-file', cle: 'numero' },
      { etape: 'creerIndex', magasin: 'essai-file', index: 'compte-numero', cle: ['compte', 'numero'], unique: false },
    ],
  },
  {
    version: 4,
    lot: '104',
    description: 'Essai : paires clé et valeur',
    etapes: [{ etape: 'creerMagasin', magasin: 'essai-meta', cle: 'cle' }],
  },
];

export const MAGASINS_D_ESSAI = ['essai-simple', 'essai-compose', 'essai-file', 'essai-meta'];

function verifier(condition, message) {
  if (!condition) throw new Error(message);
}

function egal(obtenu, attendu, message) {
  const a = JSON.stringify(obtenu);
  const b = JSON.stringify(attendu);
  verifier(a === b, `${message} : attendu ${b}, obtenu ${a}`);
}

// Attend le rejet d'une promesse avec ce code d'erreur ; rend l'erreur.
export async function attendreCode(promesse, code) {
  let rejet;
  try {
    await promesse;
  } catch (e) {
    rejet = e;
  }
  verifier(rejet !== undefined, `rejet ${code} attendu, promesse tenue`);
  verifier(rejet && rejet.code === code && rejet.message === code, `code attendu ${code}, reçu ${rejet && (rejet.code || rejet.name)}`);
  return rejet;
}

const MAGASIN_SIMPLE = 'essai-simple';
const MAGASIN_COMPOSE = 'essai-compose';
const MAGASIN_FILE = 'essai-file';
const MAGASIN_META = 'essai-meta';

// Chaque scénario reçoit un contexte { ouvrir(migrations) → promesse d'une base } : les ouvertures
// d'un même scénario portent sur les mêmes données.
export const SCENARIOS = [
  {
    numero: 1,
    titre: 'base neuve : version et magasins',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      egal(base.version, MIGRATIONS_D_ESSAI.length, 'version');
      egal(Object.keys(base.schema.magasins).sort(), [...MAGASINS_D_ESSAI].sort(), 'magasins du schéma');
      for (const nom of MAGASINS_D_ESSAI) egal(await base.compter(nom), 0, `magasin ${nom} vide`);
      await attendreCode(base.lire('essai-absent', 'a'), 'magasin_inconnu');
      await attendreCode(base.lireTout(MAGASIN_FILE, { index: 'index-absent' }), 'magasin_inconnu');
    },
  },
  {
    numero: 2,
    titre: 'écrire, lire, supprimer, vider',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      egal(await base.lire(MAGASIN_SIMPLE, 'a'), null, 'clé absente');
      egal(await base.ecrire(MAGASIN_SIMPLE, { id: 'a', valeur: 'Valeur A1' }), 'a', 'clé rendue');
      egal(await base.lire(MAGASIN_SIMPLE, 'a'), { id: 'a', valeur: 'Valeur A1' }, 'lecture');
      await base.ecrire(MAGASIN_SIMPLE, { id: 'a', valeur: 'Valeur A2' });
      egal(await base.lire(MAGASIN_SIMPLE, 'a'), { id: 'a', valeur: 'Valeur A2' }, 'remplacement');
      await base.supprimer(MAGASIN_SIMPLE, 'a');
      egal(await base.lire(MAGASIN_SIMPLE, 'a'), null, 'après suppression');
      await base.supprimer(MAGASIN_SIMPLE, 'a'); // sans erreur si la clé n'existe pas
      await base.ecrirePlusieurs(MAGASIN_SIMPLE, [
        { id: 'c', valeur: 'Valeur C1' },
        { id: 'b', valeur: 'Valeur B1' },
        { id: 'd', valeur: 'Valeur D1' },
      ]);
      egal((await base.lireTout(MAGASIN_SIMPLE)).map((x) => x.id), ['b', 'c', 'd'], 'ordre par clé');
      await base.supprimerPlusieurs(MAGASIN_SIMPLE, ['b', 'd', 'absente']);
      egal((await base.lireTout(MAGASIN_SIMPLE)).map((x) => x.id), ['c'], 'après supprimerPlusieurs');
      await base.vider(MAGASIN_SIMPLE);
      egal(await base.compter(MAGASIN_SIMPLE), 0, 'après vider');
    },
  },
  {
    numero: 3,
    titre: 'clé composée et préfixe',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await base.ecrirePlusieurs(MAGASIN_COMPOSE, [
        { compte: 'compte-A', niveau: 'NIV-0003', valeur: 'Valeur A3' },
        { compte: 'compte-B', niveau: 'NIV-0001', valeur: 'Valeur B1' },
        { compte: 'compte-A', niveau: 'NIV-0001', valeur: 'Valeur A1' },
        { compte: 'compte-B', niveau: 'NIV-0002', valeur: 'Valeur B2' },
        { compte: 'compte-A', niveau: 'NIV-0002', valeur: 'Valeur A2' },
      ]);
      egal((await base.lire(MAGASIN_COMPOSE, ['compte-A', 'NIV-0002'])).valeur, 'Valeur A2', 'lecture par clé composée');
      const duCompteA = await base.lireTout(MAGASIN_COMPOSE, { prefixe: ['compte-A'] });
      egal(duCompteA.map((x) => x.niveau), ['NIV-0001', 'NIV-0002', 'NIV-0003'], 'préfixe compte-A');
      egal(duCompteA.every((x) => x.compte === 'compte-A'), true, 'comptes du préfixe');
    },
  },
  {
    numero: 4,
    titre: 'index composé, préfixe et limite',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await base.ecrirePlusieurs(MAGASIN_FILE, [
        { numero: 6, compte: 'compte-B', valeur: 'Valeur B6' },
        { numero: 2, compte: 'compte-A', valeur: 'Valeur A2' },
        { numero: 4, compte: 'compte-B', valeur: 'Valeur B4' },
        { numero: 1, compte: 'compte-A', valeur: 'Valeur A1' },
        { numero: 3, compte: 'compte-B', valeur: 'Valeur B3' },
        { numero: 5, compte: 'compte-A', valeur: 'Valeur A5' },
      ]);
      const deuxPremiers = await base.lireTout(MAGASIN_FILE, { index: 'compte-numero', prefixe: ['compte-B'], limite: 2 });
      egal(deuxPremiers.map((x) => x.numero), [3, 4], 'deux plus petits numéros de compte-B');
      const tousLesA = await base.lireTout(MAGASIN_FILE, { index: 'compte-numero', prefixe: ['compte-A'] });
      egal(tousLesA.map((x) => x.numero), [1, 2, 5], 'tous ceux de compte-A');
    },
  },
  {
    numero: 5,
    titre: 'compter',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await base.ecrirePlusieurs(MAGASIN_COMPOSE, [
        { compte: 'compte-A', niveau: 'NIV-0001' },
        { compte: 'compte-A', niveau: 'NIV-0002' },
        { compte: 'compte-A', niveau: 'NIV-0003' },
        { compte: 'compte-B', niveau: 'NIV-0001' },
        { compte: 'compte-B', niveau: 'NIV-0002' },
      ]);
      egal(await base.compter(MAGASIN_COMPOSE), 5, 'tout le magasin');
      egal(await base.compter(MAGASIN_COMPOSE, { prefixe: ['compte-A'] }), 3, 'préfixe compte-A');
      egal(await base.compter(MAGASIN_COMPOSE, { prefixe: ['compte-B'] }), 2, 'préfixe compte-B');
      egal(await base.compter(MAGASIN_COMPOSE, { cle: ['compte-A', 'NIV-0002'] }), 1, 'clé exacte');
    },
  },
  {
    numero: 6,
    titre: 'transaction sur deux magasins',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await base.ecrire(MAGASIN_META, { cle: 'prochainNumero', valeur: 1 });
      const numero = await base.transaction([MAGASIN_META, MAGASIN_FILE], 'ecriture', async (t) => {
        const compteur = await t.lire(MAGASIN_META, 'prochainNumero');
        await t.ecrire(MAGASIN_META, { cle: 'prochainNumero', valeur: compteur.valeur + 1 });
        await t.ecrire(MAGASIN_FILE, { numero: compteur.valeur, compte: 'compte-A', valeur: 'Valeur A1' });
        return compteur.valeur;
      });
      egal(numero, 1, 'valeur rendue par travail');
      egal((await base.lire(MAGASIN_META, 'prochainNumero')).valeur, 2, 'compteur augmenté');
      egal((await base.lire(MAGASIN_FILE, 1)).valeur, 'Valeur A1', 'enregistrement écrit');
    },
  },
  {
    numero: 7,
    titre: 'tout ou rien',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      const echec = new Error('echec-d-essai');
      let recue;
      try {
        await base.transaction([MAGASIN_SIMPLE, MAGASIN_META], 'ecriture', async (t) => {
          await t.ecrire(MAGASIN_SIMPLE, { id: 'a', valeur: 'Valeur A1' });
          await t.ecrire(MAGASIN_META, { cle: 'm', valeur: 'Valeur M1' });
          throw echec;
        });
      } catch (e) {
        recue = e;
      }
      verifier(recue === echec, 'la promesse doit rejeter avec la même erreur');
      egal(await base.lire(MAGASIN_SIMPLE, 'a'), null, 'première écriture annulée');
      egal(await base.lire(MAGASIN_META, 'm'), null, 'seconde écriture annulée');
      // Même chose pour une liste de valeurs dont une est invalide : rien n'est écrit.
      await attendreCode(
        base.ecrirePlusieurs(MAGASIN_SIMPLE, [{ id: 'b', valeur: 'Valeur B1' }, { valeur: 'Valeur B2' }]),
        'cle_invalide'
      );
      egal(await base.compter(MAGASIN_SIMPLE), 0, 'ecrirePlusieurs tout ou rien');
    },
  },
  {
    numero: 8,
    titre: 'mode lecture et magasin non listé',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await attendreCode(
        base.transaction([MAGASIN_SIMPLE], 'lecture', (t) => t.ecrire(MAGASIN_SIMPLE, { id: 'a' })),
        'transaction_en_lecture'
      );
      await attendreCode(
        base.transaction([MAGASIN_SIMPLE], 'ecriture', async (t) => {
          await t.ecrire(MAGASIN_SIMPLE, { id: 'b' });
          await t.ecrire(MAGASIN_META, { cle: 'm' });
        }),
        'magasin_hors_transaction'
      );
      egal(await base.lire(MAGASIN_SIMPLE, 'b'), null, 'transaction annulée');
      // Même si `travail` attrape l'erreur, la transaction reste annulée.
      await attendreCode(
        base.transaction([MAGASIN_SIMPLE], 'ecriture', async (t) => {
          await t.ecrire(MAGASIN_SIMPLE, { id: 'c' });
          try {
            await t.ecrire(MAGASIN_META, { cle: 'm' });
          } catch (e) {
            // attrapée
          }
        }),
        'magasin_hors_transaction'
      );
      egal(await base.lire(MAGASIN_SIMPLE, 'c'), null, 'annulée aussi quand travail attrape');
    },
  },
  {
    numero: 9,
    titre: 'mise à niveau avec des données',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI.slice(0, 2));
      egal(base.version, 2, 'version avant');
      await base.ecrire(MAGASIN_SIMPLE, { id: 'a', valeur: 'Valeur A1' });
      await base.ecrire(MAGASIN_COMPOSE, { compte: 'compte-A', niveau: 'NIV-0001', valeur: 'Valeur A1' });
      await base.fermer();
      const nouvelle = await ouvrir(MIGRATIONS_D_ESSAI);
      egal(nouvelle.version, 4, 'version après');
      egal((await nouvelle.lire(MAGASIN_SIMPLE, 'a')).valeur, 'Valeur A1', 'donnée du magasin simple');
      egal((await nouvelle.lire(MAGASIN_COMPOSE, ['compte-A', 'NIV-0001'])).valeur, 'Valeur A1', 'donnée composée');
      await nouvelle.ecrire(MAGASIN_FILE, { numero: 1, compte: 'compte-A' });
      await nouvelle.ecrire(MAGASIN_META, { cle: 'm', valeur: 'Valeur M1' });
      egal(await nouvelle.compter(MAGASIN_FILE, { index: 'compte-numero', prefixe: ['compte-A'] }), 1, 'nouveau magasin et son index');
      egal((await nouvelle.lire(MAGASIN_META, 'm')).valeur, 'Valeur M1', 'second nouveau magasin');
    },
  },
  {
    numero: 10,
    titre: 'base plus récente que le code',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await base.ecrire(MAGASIN_SIMPLE, { id: 'a', valeur: 'Valeur A1' });
      await base.fermer();
      await attendreCode(base.lire(MAGASIN_SIMPLE, 'a'), 'base_fermee');
      await attendreCode(ouvrir(MIGRATIONS_D_ESSAI.slice(0, 3)), 'version_plus_recente');
      const intacte = await ouvrir(MIGRATIONS_D_ESSAI);
      egal(intacte.version, 4, 'version inchangée');
      egal((await intacte.lire(MAGASIN_SIMPLE, 'a')).valeur, 'Valeur A1', 'données intactes');
    },
  },
  {
    numero: 11,
    titre: 'clé absente ou de type interdit',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await attendreCode(base.ecrire(MAGASIN_COMPOSE, { compte: 'compte-A', valeur: 'Valeur A1' }), 'cle_invalide');
      egal(await base.compter(MAGASIN_COMPOSE), 0, 'rien d\'écrit');
      await attendreCode(base.ecrire(MAGASIN_SIMPLE, { id: true }), 'cle_invalide');
      await attendreCode(base.ecrire(MAGASIN_SIMPLE, { id: { objet: 1 } }), 'cle_invalide');
      await attendreCode(base.lire(MAGASIN_SIMPLE, true), 'cle_invalide');
      egal(await base.compter(MAGASIN_SIMPLE), 0, 'rien d\'écrit dans le magasin simple');
    },
  },
  {
    numero: 12,
    titre: 'valeur non copiable',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      await attendreCode(base.ecrire(MAGASIN_SIMPLE, { id: 'a', rappel() {} }), 'valeur_non_clonable');
      egal(await base.compter(MAGASIN_SIMPLE), 0, 'rien d\'écrit');
    },
  },
  {
    numero: 13,
    titre: 'copie des valeurs',
    async executer({ ouvrir }) {
      const base = await ouvrir(MIGRATIONS_D_ESSAI);
      const original = { id: 'a', valeur: 'Valeur A1', liste: ['Valeur A2'] };
      await base.ecrire(MAGASIN_SIMPLE, original);
      original.valeur = 'Valeur modifiée après écriture';
      original.liste.push('Valeur ajoutée après écriture');
      const lu = await base.lire(MAGASIN_SIMPLE, 'a');
      egal(lu, { id: 'a', valeur: 'Valeur A1', liste: ['Valeur A2'] }, 'écriture copiée');
      lu.valeur = 'Valeur modifiée après lecture';
      lu.liste.push('Valeur ajoutée après lecture');
      egal(await base.lire(MAGASIN_SIMPLE, 'a'), { id: 'a', valeur: 'Valeur A1', liste: ['Valeur A2'] }, 'lecture copiée');
    },
  },
];
