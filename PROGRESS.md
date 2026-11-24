# PROGRESS — MicroSwipe

Mémoire du projet d'une session à l'autre : lis ce fichier en premier, mets-le à jour en dernier.

## État

- Dernier lot fait : **105** (design system 1), le 24 novembre 2026 : code, tests Node (148), contrôles 16 à 22 et critères 2 à 6 vérifiés ; **critère 3 validé par l'auteur** (aspect du catalogue à 390 et 800 px, dialogue sur paillasse claire compris). Avant lui : **107** (chargement du contenu), le 24 novembre 2026 : code, tests Node et critère 6 vérifiés ; mouvement réduit soldé au lot 105. Avant lui : **104** (stockage local IndexedDB), le 23 novembre 2026, page de vérification passée dans Chrome et Safari (ordinateur). Avant lui : **103** (coquille PWA), le 23 novembre 2026, **sauf** l'activation de GitHub Pages, la publication et les vérifications sur téléphone (voir « Reste »). Avant lui : **102** (format du paquet de contenu et jeu de données fictif), le 23 novembre 2026. Avant lui : **101** (dépôt, garde-fous, `node --test`, `PROGRESS.md`, documents dans `docs/`), le 17 novembre 2026.
- Prochain lot : 108 (le lot 106 attend sa spec)

## Environnement

- Node 26.13.1 (22 ou plus requis), git 2.56.1, Claude Code 2.1.126. `gh` n'est pas installé : le dépôt distant a été créé à la main sur github.com.
- Dépôt : `chugicu/microswipe` (public), adresse prévue `https://chugicu.github.io/microswipe/` (GitHub Pages non activé : à faire avec l'auteur, lot 103).
- Branche de travail : `dev`. `main` n'a reçu que le premier commit.
- **Après un clone : `git config core.hooksPath .githooks`** (le crochet ne s'active que par cette commande).
- Identité git du dépôt : nom `chugicu`, adresse `noreply` de GitHub.

## Méthode

- Rituel du `CLAUDE.md` : lire `PROGRESS.md` et la spec du lot, ne faire que ce lot, tester (`node --test`), mettre à jour `PROGRESS.md`, enregistrer sur `dev` (commit en français, puis push, jamais `main`).
- Une spec nouvelle est écrite sans contenu médical et rangée dans `claude/depot/specs/` du projet claude.ai ; le premier commit du lot qui l'utilise la copie telle quelle dans `docs/specs/`, avec l'index s'il a changé ; aucune spec n'est prise ailleurs que dans `claude/depot/` (confirmé par l'auteur le 17 novembre 2026).
- Les documents de `docs/` et `CLAUDE.md` sont copiés octet pour octet depuis `claude/depot/` : un défaut s'y signale, il ne s'y corrige pas ici.

## Arborescence

| Dossier | Contenu | Créé par |
|---|---|---|
| `client/` | Code du téléphone, modules ES natifs. | Lots 102 et suivants (le lot 101 n'y met que le logo, dans `client/images/`). Lot 102 : `client/contenu/`, `client/donnees-fictives/`. |
| `serveur/` | Code Apps Script ; chargé en CommonJS par Node grâce à `serveur/package.json`. | Lot 301. |
| `tests/client/`, `tests/serveur/`, `tests/integration/` | Tests Node, rangés comme le code qu'ils testent. | Lots suivants. |
| `tests/navigateur/` | Pages de vérification à ouvrir dans un navigateur ; jamais lancées par `node --test`. | Lots 104 et suivants. |
| `tests/outillage/` | Tests du lot 101 et fichiers d'essai (`esm/`, `cjs/`). | Lot 101. |
| `docs/`, `docs/specs/` | Documents du projet, sans contenu médical. | Lot 101. |
| `contenu-local/` | Contenu réel de travail ; **exclu de git**. | Lot 214, sur l'ordinateur de l'auteur. |
| `.githooks/`, `.claude/` | Garde-fous. | Lot 101. |

Un dossier vide n'est pas créé (git ne le garde pas). La place de la page d'entrée de l'appli et du service worker est décidée par le lot 103.

**Règles de `node --test`**

- Lancé sans argument à la racine, il trouve tout fichier nommé `*.test.js`, dans tous les sous-dossiers.
- Un fichier d'aide des tests (données, doublure, chargeur) ne se termine pas par `.test.js`, ne commence pas par `test-` et ne se trouve pas dans un dossier nommé `test` : sinon Node le lance comme un test.
- Un test importe un module du client par un chemin relatif.
- Un test charge un fichier du serveur par `createRequire(import.meta.url)`, puis `require` ; Node le lit en CommonJS parce que le `package.json` de son dossier le dit (`tests/outillage/cjs/` le prouve).

## Interfaces exposées

### Lot 101

- **Racine** : `package.json` (`type` = `module`, `scripts.test` = `node --test`, aucune dépendance, aucun `package-lock.json`), `README.md`, `CLAUDE.md`, `.gitignore`, `.gitattributes`.
- **Importer un module du client depuis un test** : chemin relatif, par exemple `import { X } from '../../client/…/module.js'` (modèle : `tests/outillage/esm/module-essai.js`, importé par `tests/outillage/modules.test.js`).
- **Charger un fichier du serveur depuis un test** : `const require = createRequire(import.meta.url); const f = require('../../serveur/…/fichier.js');` (modèle : `tests/outillage/cjs/fichier-essai.js`, avec son `package.json` local `{ "type": "commonjs" }`). Le fichier se termine par le bloc `if (typeof module !== 'undefined') { module.exports = { … }; }`.
- **Garde-fous (trois fichiers)** :
  - `.gitignore` : `contenu-local/`, tableurs et exports (`*.xlsx`, `*.xlsm`, `*.xls`, `*.ods`, `*.csv`, `*.tsv`), `Code.gs`, `Defaults.gs`, secrets (`.clasprc.json`, `.env`, `.env.*`, `*.pem`), `.claude/settings.local.json`, outils. `.clasp.json` n'est pas ignoré (lot 301).
  - `.githooks/pre-commit` (shell POSIX, exécutable dans git) : refuse un commit sur `main` et tout commit qui contient un fichier sous `contenu-local/`, un tableur, `Code.gs`, `Defaults.gs`, `.clasprc.json`, `.env` ou `.env.*`. Il ne lance pas les tests.
  - `.claude/settings.json` (versionné) : refus de `git commit` avec `--no-verify` ou `-n`, de `git push` forcé, de `git config` sur `core.hooksPath` ; demande avant `git push` vers `main`, `git merge`, `git checkout` ou `git switch` vers `main`, `git reset --hard`, `git branch -D`. Syntaxe retenue pour Claude Code 2.1.126 : `Bash(commande *joker*)`, le `*` valant n'importe quel texte ; ordre d'évaluation refus, puis demande, puis autorisation. Limite connue : une règle Bash lit le texte de la commande, pas le programme (`git -C . push` passe à côté) ; le crochet reste le verrou principal.
  - `.claude/settings.local.json` (non versionné) : refus d'`Edit` sur les copies locales de Carnet Réa et d'EchoLearn (chemins de l'ordinateur de l'auteur, jamais dans le dépôt). `Write` n'a pas de règle propre : `Edit(...)` couvre les outils d'écriture.
- **`contenu-local/`** : dossier du contenu réel de travail, à la racine, exclu de git, créé par le lot 214 sur l'ordinateur de l'auteur.
- **Logo** (PNG 1024 × 1024, fond crème `#FFE9B0`, copiés octet pour octet ; les icônes de l'appli en sont tirées au lot 103) :
  - `client/images/logo-ios.png` : dessin grand, peu de marge. Usage : icône de l'iPhone, écran d'ouverture, barre du haut.
  - `client/images/logo-android.png` : dessin plus petit, entouré d'une marge (Android rogne les icônes). Usage : icônes du manifeste (Android).
- **Documents copiés** : `CLAUDE.md` ; `docs/briefing.md`, `architecture.md`, `schema-de-donnees.md`, `plan-de-developpement.md`, `design-system.md` ; `docs/specs/index.md` et vingt specs `docs/specs/lot-N.md`. `docs/design-system.md` est présent : les lots 105 et 106 peuvent commencer.
- **Tests** : `tests/outillage/modules.test.js` (1 à 3), `garde-fous.test.js` (4 à 8), `documents.test.js` (9 à 12). Le test 11 est un rapport : il n'échoue jamais et écrit fichier, ligne et identifiant.

### Lot 102

- **`client/contenu/forme-du-paquet.js`** (module pur, lots 107 et 307) :
  - `controlerFormeDuPaquet(paquet)` → tableau de défauts `{ regle, chemin }`, vide si la forme est bonne ; ne modifie pas son argument. Règles : `objet`, `type`, `cle_manquante`, `cle_inattendue`, `version`, `date`, `section`, `id`, `valeur_non_texte`, `colonne_reservee`, `faits`, `composition_prevue`, `reglages`, `etat_des_questions`. Le chemin n'a jamais de valeur du contenu : `questions/Q-000003/Énoncé`, `faits/Faits_fictifs/FF-02`, `reglages/etoiles.seuil_1` ; une ligne sans `ID` lisible est désignée par sa position : `questions/ligne-3/ID`.
  - Constantes exportées : `TYPES_DE_PAQUET`, `SECTIONS_DE_LIGNES`, `CLES_DU_PAQUET`, `CLE_ETAT_DES_QUESTIONS`, `COLONNES_RESERVEES`, `MODELE_DATE_UTC`.
- **`client/donnees-fictives/paquets-fictifs.js`** (lots 107, 201, 208, 213, 401) :
  - `paquetInternesFictif()` et `paquetAdminFictif()` → un **nouvel** objet à chaque appel, de la forme de `lot-306.md` § 6.2 (clés dans l'ordre : `type`, `versionContenu`, `genereLe`, `mondes`, `niveaux`, `composition`, `questions`, `faits`, `compositionPrevue`, `reglages`, puis `etatDesQuestions` pour « admin »).
  - `ATTENDU_FICTIF` = `{ internes, admin }`. Chaque côté : `mondes`, `niveaux`, `questions`, `composition` (listes d'`ID`, dans l'ordre), `faits` (`{ <Onglet>: { <ID>: <colonnes servies> | null } }`, `null` = toutes les colonnes), `compositionPrevue`. En plus : `internes.colonnes` (colonnes servies des quatre sections) et `admin.etatDesQuestions`.
- **`client/donnees-fictives/lignes-fictives.js`** : les lignes complètes (`LIGNES_MONDES`, `LIGNES_NIVEAUX`, `LIGNES_COMPOSITION`, `LIGNES_QUESTIONS`, `LIGNES_FAITS_FICTIFS`, `LIGNES_AUTRES_FAITS_FICTIFS`), `EN_TETES`, `REGLAGES_FICTIFS`, `VERSION_CONTENU` (1) et `GENERE_LE`. Un lot qui ajoute un cas **ajoute des lignes** ici, avec de nouveaux identifiants.
- **À savoir pour les lots suivants**
  - `COLONNES_RESERVEES` est écrite deux fois : client (ce lot) et serveur (lot 306) ; si l'une change, l'autre suit.
  - Le paquet internes fictif ne donne aucune question écartée ; le paquet admin en donne une (`Q-000017` dans `NIV-0008`, motif `valeur_sans_correspondance`) (lots 201, 213).
  - Toute modification du jeu fictif ajoute des lignes plutôt qu'elle n'en change, et augmente `versionContenu` et `contenu.version` : changer `VERSION_CONTENU` dans `lignes-fictives.js` suffit pour les deux (lots 107, 204 à 206).
  - Pour simuler un monde devenu invisible, retire sa ligne de `mondes` dans une copie locale du paquet internes (lot 208, critère 5.7) : le paquet internes est déjà filtré, `Visible` n'y change rien.
  - Clés `Milieu` du jeu : `sang`, `bcp`, `chocolat`, `neutre`, celles du design system § 3.8 (lots 105, 202).
  - Le mot `Statut` n'est lu nulle part dans `client/donnees-fictives/` : l'assemblage n'applique que les listes de `ATTENDU_FICTIF`.
- **Tests** : `tests/client/contenu/forme-du-paquet.test.js` (1 à 6, avec une cinquantaine de sous-cas) et `tests/client/donnees-fictives/paquets-fictifs.test.js` (7 à 20). Le test 14 recalcule les questions servies et leurs motifs à part, sans `ATTENDU_FICTIF`.

### Lot 103

**Règles pour tous les lots suivants**

- **Tout lot qui modifie un fichier servi au téléphone augmente `VERSION_CLIENT` (`client/version.js`) et `VERSION_DE_LA_COQUILLE` (`sw.js`, une seule ligne) de 1, et ajoute ses fichiers à `FICHIERS_DE_LA_COQUILLE`** (`client/coquille/sw/regles-sw.js`). Les tests 8 et 9 échouent sinon. Un fichier de `client/verifications/` (lot 108) est hors coquille.
- **Chaque lot branche son démarrage dans `client/demarrage.js`**, en l'ajoutant à `DEMARRAGES_BRANCHES`, sans l'attendre (lot 107 : `demarrerContenu`). Une erreur est écrite par `console.error` et n'arrête rien.
- **Le lot 107 appelle `definirFournisseurDuLogo`** avec la lecture de `accueil.logo` dans le paquet « internes » rangé.
- Aucun appel à `caches` hors `sw.js` ; aucun `fetch(` dans `client/` (test 11).
- **Limite acceptée** : une appli installée que l'interne ne ferme jamais reçoit la mise à jour quand le téléphone la ferme lui-même.
- **Publication** (§ 6.9) : adresse publique `https://chugicu.github.io/microswipe/` ; à chaque publication, accord de l'auteur, avance rapide de `main` jusqu'à `dev`, jamais de contenu réel. La version publiée est vue comme « production » par `choisirEnvironnement` (lot 301) et par le droit provisoire du mode test (lot 213) : le mode test n'y est pas proposé, c'est voulu.

**Qui affiche quoi** (invitation à installer)

| Lot | Affichage |
|---|---|
| 106 | Ligne de Profil (`TEXTES_INSTALLATION.ligneProfil`) tant que `installee` est faux et que `moyen` n'est pas `aucun` ; un appui ouvre la carte d'invitation. |
| 207 | Place sur l'écran de fin de niveau pour la carte : titre, texte, puis `consignes` (iPhone : `consignesIphone`) ou bouton `Installer` (`bouton`), et `Plus tard`. |
| 208 | Après chaque fin de partie enregistrée (hors mode test) : `doitInviterApresPartie(somme des tentatives des lignes du compte, installee)` vrai et `moyen` ≠ `aucun` → demander la carte. Rien d'autre n'est stocké. « Plus tard » ne laisse aucune trace. |

**Fichiers et signatures**

- `index.html`, `manifest.webmanifest`, `sw.js`, `.nojekyll` (racine). `client/version.js` : `VERSION_CLIENT` (1). Icônes : `client/images/icone-192.png`, `icone-512.png`, `icone-apple-180.png` (faites avec `sips`, outil non versionné). Feuille de style : `client/coquille/coquille.css` (variables du design system § 3.1, § 3.10, § 5.4, § 6).
- `client/coquille/sw/regles-sw.js` (classique, CommonJS pour Node grâce à son `package.json`) : `PREFIXE_DES_CACHES`, `DOSSIERS_HORS_COQUILLE`, `FICHIERS_DE_LA_COQUILLE`, `nomDuCache(version)`, `cachesASupprimer(noms, version)`, `strategiePour({ methode, url, mode }, portee, fichiers)` → `page` | `coquille` | `reseau` | `ignorer`.
- `client/coquille/regles.js` (ES, pur) : `DUREE_ACCUEIL_MS`, `CLE_LOGO_A_L_OUVERTURE`, `logoActive(reglages)`, `doitMasquerLAccueil({ ecouleMs, appliPrete, toucher, logo })`, `PARTIES_D_INVITATION`, `estInstallee({ affichageAutonome, standaloneIos })`, `moyenDInstallation({ agentUtilisateur, pointsDeContact, invitationNative })`, `doitInviterApresPartie(n, installee)`, `TEXTES_INSTALLATION`.
- `client/coquille/accueil.js` : `definirFournisseurDuLogo(fn)` (`fn()` → promesse d'un booléen), `annoncerAppliPrete()`, `accueilTermine` (promesse), et `retenirAccueil()` (ajout, voir Décisions) → fonction qui libère, ou `null` si l'accueil a déjà disparu.
- `client/coquille/mise-a-jour.js` : `demarrerMiseAJour({ pendantLAccueil })` (promesse), `versionEnAttente()`.
- `client/coquille/installation.js` : `demarrerInstallation()`, `etatDeLInstallation()` → `{ installee, moyen }`, `lancerInstallationNative()` → promesse de `acceptee` | `refusee` | `indisponible`, `evenements` (`EventTarget`, événement `installation-changee`).
- `client/demarrage.js` : `DEMARRAGES_BRANCHES` (liste de fonctions), ordre fixé par la spec § 6.7.
- **Tests** : `tests/client/coquille/regles-sw.test.js` (1 à 3), `regles.test.js` (4 à 7), `coherence.test.js` (8 à 12).

### Lot 104

**Règles pour les lots suivants (107, 208, 209, 309…)**

- **Un lot qui a besoin d'un magasin ou d'un index ajoute une migration à la fin de `MIGRATIONS`** (`client/stockage/migrations.js`), avec la version suivante ; **une migration enregistrée n'est jamais modifiée, renumérotée ni retirée**. Aucune migration ne supprime un magasin ni des données (à demander à l'auteur). Un magasin et son index peuvent être dans la même migration. Un lot qui ajoute une migration ajoute aussi sa migration aux tests : le test 9 vérifie que la liste réelle tient les règles.
- **Règle du travail des transactions** : dans `travail`, n'attends que les opérations de `t`. Attendre autre chose (réseau, minuterie, autre base) laisse le navigateur clore la transaction : ce qui a été écrit avant est enregistré, et l'opération suivante rejette `transaction_inactive`. Lis ce qu'il faut avant la transaction, calcule dedans sans rien attendre d'autre (lots 107, 208, 309).
- **`creerBaseEnMemoire` sert aux tests ; elle n'est jamais importée par `client/`** (test 11). Elle ne détecte pas la règle du travail : seule la page de vérification le peut.
- **Un échec d'ouverture n'arrête pas le jeu** : `ouvrirBaseDuJeu()` rejette `stockage_indisponible` (navigation privée, IndexedDB absent…) ; le lot garde alors ses données en mémoire (specs 208 § 6.7 et 309 § 6.5). Les lots n'appellent jamais `ouvrirBase` pour la base de l'appli. Ce lot n'appelle pas `ouvrirBaseDuJeu` au démarrage : le premier lot qui s'en sert est le 107 (qui branche son démarrage dans `DEMARRAGES_BRANCHES`).
- **Événement `base-perimee`** (lot 103, voir « Points à vérifier ») : `base.evenements` (`EventTarget`) l'émet quand un autre onglet a demandé une version plus récente ; la base est alors déjà fermée (toute opération rejette `base_fermee`). Personne ne l'écoute encore.
- Jamais de suppression de la base `microbio` (aucune fonction du client n'en a). Seule la page de vérification supprime sa base d'essai `microbio-essai-104`.

**Fichiers et signatures** (toutes les fonctions de la base rendent une promesse)

- `client/stockage/regles.js` (pur) : `CODES_D_ERREUR` (les quinze codes du § 6.1), `creerErreurDeStockage(code)`, `estCleValide(cle)`, `comparerCles(a, b)`, `extraireCle(valeur, cheminDeCle)`, `bornesDuPrefixe(prefixe)` → `{ depuis, jusqua }`, `validerMigrations(migrations)` → `[{ version, regle }]`, `simulerSchema(migrations)` → `{ version, magasins: { <nom>: { cle, index: { <nom>: { cle, unique } } } } }`, `migrationsAAppliquer(migrations, ancienneVersion)`, `verifierRequete(requete, schemaDuMagasin)` → `{ index, depuis, jusqua, limite }` (`null` quand absent ; `cle` et `prefixe` deviennent des bornes incluses).
- `client/stockage/migrations.js` : `NOM_BASE` (`microbio`), `MIGRATIONS` (la migration 1, sans étape).
- `client/stockage/base-locale.js` : `ATTENTE_BLOCAGE_MS` (5000), `ouvrirBase({ nom, migrations, fabrique })` → base, `ouvrirBaseDuJeu()` → base (gardée ; un rejet est oublié, l'appel suivant réessaie). Seul fichier du client à citer `indexedDB`.
- **La base** (réelle ou en mémoire) : `version`, `schema`, `evenements`, `lire(magasin, cle)` (`null` si absent), `lireTout(magasin, requete)`, `compter(magasin, requete)`, `ecrire(magasin, valeur)` → la clé, `ecrirePlusieurs(magasin, valeurs)` → tableau des clés, `supprimer(magasin, cle)`, `supprimerPlusieurs(magasin, cles)`, `vider(magasin)`, `transaction(magasins, 'lecture' | 'ecriture', travail)`, `fermer()`. Requête : `{ index, cle | prefixe | depuis et/ou jusqua, limite }` (voir spec § 6.5). `t` (dans `travail`) : `lire`, `lireTout`, `compter`, `ecrire`, `supprimer`, `vider`, qui prennent le nom du magasin en premier argument.
- `tests/client/stockage/base-memoire.js` : `creerBaseEnMemoire({ migrations, versionEnregistree })` → promesse d'une base de même interface, avec en plus `rouvrir(nouvellesMigrations)` (même données ; l'ancienne base se ferme et émet `base-perimee` si la version monte).
- `tests/client/stockage/scenarios.js` : `SCENARIOS` (1 à 13), `MIGRATIONS_D_ESSAI`, `attendreCode(promesse, code)`. Un scénario reçoit `{ ouvrir(migrations) }`. Un lot qui teste son dépôt avec `creerBaseEnMemoire` peut réutiliser `MIGRATIONS_D_ESSAI` ou écrire ses propres migrations.
- `tests/navigateur/stockage.html` et `stockage.js` : page de vérification (15 scénarios), à servir par un petit serveur local (par exemple `python3 -m http.server`, depuis la racine du dépôt) et à ouvrir à `/tests/navigateur/stockage.html`, puis « Lancer ».
- **Tests** : `tests/client/stockage/regles.test.js` (1 à 9), `base-memoire.test.js` (10 et 11), `base-locale.test.js` (12 à 15, hors liste de la spec : ouverture sans navigateur, critères 2 à 4 vérifiés dans les fichiers).

### Lot 107

**Ce que les lots suivants reçoivent**

| Lot | Usage |
|---|---|
| 201, 202 | `contenuDuJeu().lirePaquet('internes')` et l'événement `contenu-change` (`detail` = `{ type, versionContenu }`). Le lot qui écrit `indexerPaquet` (201) ou la carte (202) fournit l'index du paquet en cours, recalculé à chaque `contenu-change`. |
| 204, 207 | Le lot qui crée les parties (`creerPartie`, 204) règle `definirGardeDeRechargement(() => !partieEnCours)` ; le lot 207 appelle `propositionDeRechargement().reprendre()` quand l'interne quitte l'écran de fin de niveau, re-tests compris. Sans cela, le dialogue de rechargement peut s'afficher en pleine partie. |
| 213, 307 | Seul le paquet « internes » est rangé ; **le paquet « admin » reste en mémoire jusqu'au lot 307** (213 le charge par son propre chargeur ; `charger('admin')` rejette `type_non_range`). |
| 307 | La source répond comme l'action `contenu` du serveur. Le lot 307 remplace `sourceFictive` par `(type, versionLocale) => appelerServeur('contenu', { paquet: type, versionLocale })` et **supprime `source-fictive.js`** (et son entrée de `FICHIERS_DE_LA_COQUILLE`). Il ajoute les déclencheurs et le choix du moment. |
| 309 | `versionContenuLocale()` et `charger()`. **`versionContenuLocale()` vaut `null` tant qu'aucun paquet n'est là.** |
| 402 | `lirePaquet('internes')`, relu à chaque appel de l'estimateur. |

- **Le paquet rendu est gelé** (`gelerEnProfondeur`) : aucun module ne le modifie ; en mode strict, une modification lève une erreur.
- **Le lot 107 écoute `base-perimee` et propose de recharger** ; le lot qui crée les parties règle `definirGardeDeRechargement` ; le lot 207 appelle `propositionDeRechargement().reprendre()` quand l'interne quitte l'écran de fin de niveau (lots 204, 207).

**Fichiers et signatures**

- `client/contenu/regles.js` (pur) : `TYPES_RANGES` (`internes`), `TYPES_DE_PAQUET_DEMANDABLES` (`internes`, `admin`), `MAGASIN_CONTENU` (`contenu`), `lireEnregistrement(valeur, type)` → enregistrement ou `null`, `deciderApresReponse(reponse, type)` → `{ action, motif, erreur }` (`erreur` = `null` sauf motif `refus`), `creerEnregistrement(paquet, recuLe)`, `gelerEnProfondeur(objet)`.
- `client/contenu/chargeur.js` : `creerChargeurDeContenu({ obtenirBase, source, maintenant })` → `{ pret, lirePaquet(type = 'internes'), versionContenuLocale(type = 'internes'), etat(type = 'internes') → { present, versionContenu, range, dernierResultat }, charger(type = 'internes') → { resultat: 'remplace' | 'a_jour' | 'garde', motif, erreur? }, basePerimee(), evenements }` ; événements `contenu-change` et `base-perimee`.
- `client/contenu/source-fictive.js` : `sourceFictive(type, versionLocale)`. Seul fichier de `client/` à importer `paquetInternesFictif`.
- `client/contenu/demarrage.js` : `demarrerContenu()` → le chargeur (un second appel n'en crée pas d'autre), `contenuDuJeu()` → le chargeur ou `null`. Branché dans `DEMARRAGES_BRANCHES` ; règle le fournisseur du logo ; relie `base-perimee` à `propositionDeRechargement().signaler`.
- `client/contenu/rechargement.js` : `TEXTES_RECHARGEMENT`, `creerPropositionDeRechargement({ afficher, peutInterrompre })` → `{ signaler, reprendre, enAttente, refuser }`, `definirGardeDeRechargement(fn)`, `propositionDeRechargement()`.
- `client/contenu/dialogue-rechargement.js` : `afficherDialogueDeRechargement({ plusTard, recharger? })` (seul fichier du lot qui touche la page). Règles CSS dans `coquille.css` (`.dialogue-voile`, `.dialogue`, `.bouton-principal`, `.bouton-secondaire`).
- Migration 2 (lot 107) : magasin `contenu`, clé `type`. `VERSION_CLIENT` et `VERSION_DE_LA_COQUILLE` passés de 3 à 4.
- **Tests** : `tests/client/contenu/regles.test.js` (1 à 5), `chargeur.test.js` (6 à 19 et 24), `rechargement.test.js` (23). Page de vérification : `tests/navigateur/contenu.html` et `contenu.js` (20 à 22 et 25), à servir comme celle du lot 104 puis « Lancer ».

### Lot 105

**Règles pour tous les lots suivants**

- **Toute valeur visuelle se lit dans `client/design/jetons.css` ; une valeur absente se demande, puis s'ajoute là et dans le tableau du `lot-105.md` § 6.1** (le test 1 compare les deux).
- **Tout dialogue passe par `ouvrirDialogue`.**
- **Un composant commun se range dans `client/design/` et s'ajoute au catalogue `tests/navigateur/design.html`.**
- Aucune couleur en dur hors de `jetons.css` (et `milieux.js` pour le JavaScript) ; aucun `:root` ailleurs ; aucune taille de texte en `px` ; seules `transform` et `opacity` s'animent (tests 2 à 4).
- Un bouton en relief appelle `.bouton-principal`, `.bouton-boss` ou `.bouton-tous-les-mondes` ; son icône est un `<svg>` enfant, dont la taille se règle sur place (20 px dans principal et boss ; fixée au lot 202 pour « tous les mondes »).

**Ce que les lots suivants reçoivent**

| Lot | Usage |
|---|---|
| Tous | Voir les règles ci-dessus. |
| 106 | Montée (`--duree-longue`, `--courbe-sortie`), fermeture et glissement de la fiche, branchés sur `ouvrirFiche` / `fermer` ; ressorts ; changements d'écran ; règle générale du mouvement réduit ; plans `--plan-*`. Le mouvement réduit du dialogue est déjà fait. Retour des boutons plats : le lot 106 peut remplacer la compression par un ressort. |
| 202 | `milieuDe`, `poserMilieu`, `.gelose`, `--paillasse`, `creerScotch`, `creerRangeeDEtoiles`, `ORDRE_DE_REMPLISSAGE`, `.bouton-tous-les-mondes` (et son icône), `--or-1` à `--or-3`, `--contamination-1` et `-2`. Les objets de paillasse et la pastille d'état sont à lui. |
| 203 | `ouvrirFiche`, `.paillasse-claire`, `.paillasse-sombre` (et son grain), `creerTrio` (`fiche`), `creerScotch`, `.bouton-principal`, `.bouton-boss`, `.lien-action`, `.bouton-icone`. Le médaillon et le tampon sont à lui. Focus sur la paillasse sombre : point signalé 79. |
| 207 | `creerTrio` (`fin`), `ORDRE_DE_REMPLISSAGE`, `creerScotch`, `.bouton-principal`, `.bouton-secondaire`. |
| 403, 505, 506, 315 | `ouvrirDialogue` pour leurs confirmations ; `irreversible: true` pour « Archiver » (§ 12.5) et toute action qui ne se défait pas. |

**Fichiers et signatures**

- `client/design/jetons.css` (le seul `:root`), `polices.css`, `composants.css` (boutons, matières, fiche, dialogue, scotch, étoiles, `.chiffres`).
- `client/design/milieux.js` : `MILIEUX` (sang, bcp, chocolat, neutre), `CLE_MILIEU_DE_SECOURS`, `milieuDe(cle)`, `poserMilieu(element, cle)`.
- `client/design/matieres.js` : `FILTRES_DE_MATIERE`, `balisageDesMatieres()`, `installerMatieres()` (en tête de `DEMARRAGES_BRANCHES`).
- `client/design/regles-dialogue.js` : `preparerDialogue(options)` (pure, erreur `dialogue_mal_forme`). `client/design/dialogue.js` : `ouvrirDialogue(options)` → `{ element, fermer() }` (`element` = le voile, `null` tant que le dialogue attend son tour).
- `client/design/fiche.js` : `ouvrirFiche({ libelle, contenu, sombre, surFermeture })` → `{ element, corps, fermer() }` (erreur `fiche_mal_formee` sans `libelle`).
- `client/design/piege-focus.js` (ajout, non listé au § 5) : `memoriserLeFocus()`, `pieger(conteneur, evenement)`, communs au dialogue et à la fiche.
- `client/design/scotch.js` : `ANGLE_DU_SCOTCH_MIN`, `ANGLE_DU_SCOTCH_MAX`, `angleDuScotch(angle)`, `creerScotch({ texte, revision, angle, lu })` → un `<span class="scotch-enveloppe">` qui contient le `<span class="scotch">` (l'ombre est un `drop-shadow` de l'enveloppe).
- `client/design/etoiles.js` : `ORDRE_DE_REMPLISSAGE`, `etatsDuTrio(nombre)`, `creerEtoile({ pleine, taille, sombre })`, `creerTrio({ nombre, pourcentages, variante, libelle })` (`libelle` = `aria-label`), `creerRangeeDEtoiles({ nombre })`.
- **Polices** (`client/polices/`, téléchargées une fois le 24 novembre 2026, avec l'accord de l'auteur, depuis `fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Bricolage+Grotesque:opsz,wght@12..96,600..700&family=Caveat:wght@600..700&display=swap`) : fichiers variables, latin et latin-ext, sur `fonts.gstatic.com` : `inter-latin.woff2` (48 432 o, `/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2`), `inter-latin-ext.woff2` (85 272 o, `…SjIa25L7W0Q5n-wU.woff2`), `bricolage-grotesque-latin.woff2` (76 868 o, `/s/bricolagegrotesque/v9/3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGIInHWVyNJ.woff2`), `bricolage-grotesque-latin-ext.woff2` (30 636 o, `…PpZBMlGGInHWVyNJtvI.woff2`), `caveat-latin.woff2` (74 572 o, `/s/caveat/v23/Wnz6HAc5bAfYB2Q7ZjYYiAzcPA.woff2`), `caveat-latin-ext.woff2` (29 528 o, `…Q7aDYYiAzcPDKo.woff2`). Licences : `OFL-inter.txt` (4 377 o), `OFL-bricolage-grotesque.txt` (4 403 o), `OFL-caveat.txt` (4 385 o), depuis `raw.githubusercontent.com/google/fonts/main/ofl/{inter,bricolagegrotesque,caveat}/OFL.txt`.
- `VERSION_CLIENT` et `VERSION_DE_LA_COQUILLE` passés de 4 à 5 ; les 21 nouveaux fichiers de `client/` sont dans `FICHIERS_DE_LA_COQUILLE`.
- Rebranchement du lot 107 : `client/contenu/dialogue-rechargement.js` appelle `ouvrirDialogue` (signature inchangée) ; `coquille.css` ne garde que la page, la colonne et l'accueil.
- **Tests** : `tests/client/design/jetons.test.js` (1 à 6), `polices.test.js` (7 à 9), `composants.test.js` (10 à 15), aide `aides-css.js`. Catalogue et contrôles 16 à 22 : `tests/navigateur/design.html` (+ `design.js`, `design.css`), à servir comme celui du lot 107, puis « Lancer ».

## Décisions

- 23 novembre 2026 (lot 103, après essai sur téléphone) : la coquille se zoomait et se déplaçait dans tous les sens ; sur le choix de l'auteur, zoom par pincement, déplacement horizontal et rebond de la page sont bloqués (`maximum-scale=1, user-scalable=no`, `touch-action: pan-y`, `overscroll-behavior: none`, `gesturestart` annulé pour l'iPhone). Le défilement vertical reste. Contrepartie : plus d'agrandissement du texte par pincement. `VERSION_CLIENT` et `VERSION_DE_LA_COQUILLE` passent à 2. Publié le 23 novembre ; installé sur le téléphone de l'auteur : icône correcte. Vérifié par l'auteur sur Safari (iPhone) avec la version 2 : ni zoom ni déplacement. Critère 7 : icône et affichage vus ; mode avion, installation sous Android et critères 3 et 4 (navigateur de bureau) restent à vérifier.

- 17 novembre 2026 : `.claude/settings.local.json` créé avec des refus d'`Edit` sur les dossiers locaux de Carnet Réa et d'EchoLearn trouvés sur l'ordinateur (l'auteur pensait ne rien avoir en local ; des copies existent, il n'a pas désigné lesquelles, la règle large a été prise par prudence).
- 17 novembre 2026 : le crochet est écrit avec une fonction `est_interdit` et non un `case` dans `$(…)`, que le `sh` de macOS ne lit pas.
- 17 novembre 2026 : `documents-depot/` (copie locale de `claude/depot/`, relue et acceptée par l'auteur) est la seule source des documents ; elle est hors du dépôt.

- 23 novembre 2026 (lot 102) : la spec ne fixe pas la forme de `ATTENDU_FICTIF` : forme retenue ci-dessus (listes d'`ID`, `faits` en `ID` → colonnes, `null` pour « toutes »). Autres précisions prises, dans l'esprit de la spec : une ligne sans `ID` lisible est désignée par sa position (`ligne-N`) ; une entrée de `etatDesQuestions` doit avoir exactement les deux clés `servie` et `motifs` ; un `ID` absent ou non texte ne donne que le défaut `id` (pas aussi `valeur_non_texte`) ; avec un type inconnu, `etatDesQuestions` n'est ni attendu ni inattendu ; l'ordre des clés de `compositionPrevue` suit l'ordre des niveaux.
- 23 novembre 2026 (lot 102) : le fichier `lignes-fictives.js` contient le mot `Statut` en plus des en-têtes et des lignes : dans la petite fonction qui remplit les colonnes de validation d'une ligne (données, pas assemblage). `paquets-fictifs.js` ne le contient pas.
- 23 novembre 2026 (lot 103) : **`theme_color` = `#EEF2F6` (`--fond`)**, barre d'état de l'iPhone `default` ; le design system n'en fixait aucune, l'auteur a choisi `--fond`. Le même `#EEF2F6` est dans la balise `theme-color` de `index.html`.
- 23 novembre 2026 (lot 103) : mise à jour. Seule une version **déjà en attente à l'ouverture** s'applique (message `passer`, un rechargement, accueil retenu) ; une version trouvée pendant cette ouverture attend la suivante (critère 4 : « à la première ouverture, rien ne change »). Pour retenir l'accueil pendant le rechargement, `accueil.js` expose `retenirAccueil()`, ajout non listé dans le § 6.4 mais nécessaire à « avant que l'accueil disparaisse ». Message `passer` = la chaîne `'passer'`.
- 23 novembre 2026 (lot 103) : `strategiePour` ne rend `page`/`coquille`/`reseau` que pour `GET` ; tout autre méthode → `ignorer`. `sw.js` répond aux requêtes `reseau` par un appel réseau direct, sans rien ranger.
- 23 novembre 2026 (lot 103) : le logo discret de la coquille vide reprend la taille et le rayon de la barre du haut (36 px, rayon 10, design system § 9.14), centré dans la colonne : le design system ne donne pas de taille propre à la coquille vide. L'accueil n'a pas d'indice `z-index` (le design system n'en fixe pas pour lui) : il passe au-dessus du contenu parce qu'il est positionné ; **un lot qui positionne ses éléments avec un `z-index` doit vérifier que l'accueil reste au-dessus.**
- 23 novembre 2026 (lot 103) : la police de l'accueil est celle du système ; `client/polices/` (design system § 4.1) n'existe pas encore : les lots qui l'ajoutent l'inscrivent dans `FICHIERS_DE_LA_COQUILLE`.
- 23 novembre 2026 (lot 103) : sans transition possible (accueil jamais peint avant la disparition, ou animations réduites), il disparaît sans fondu.
- 23 novembre 2026 (lot 104) : précisions prises là où la spec se taisait, dans son esprit. Liste de migrations vide → défaut `version` (la base ne s'ouvre pas à la version 0). Bornes `depuis` > `jusqua` → `requete_invalide` (le navigateur les refuse aussi). `depuis` ou `jusqua` seul est admis. Une requête non objet → `requete_invalide`. `mode` autre que `lecture` / `ecriture` → `transaction_echouee` ; liste de magasins vide ou magasin inconnu → `magasin_inconnu`. `ecrirePlusieurs` rend le tableau des clés. Dans une transaction, seules `magasin_hors_transaction` et `transaction_en_lecture` annulent d'office la transaction, même si `travail` attrape l'erreur ; les autres erreurs d'opération ne l'annulent que si `travail` les laisse remonter (sauf violation d'unicité d'index, que le navigateur annule). Un enregistrement dont la clé d'index est absente ou invalide n'est pas dans l'index (comme le navigateur). `ouvrirBase` : une mise à niveau qui échoue pour une raison inconnue après son début → `migration_echouee` ; si `base_bloquee` a été rendu, une mise à niveau qui démarre ensuite est annulée et la connexion fermée (rien ne change après l'échec annoncé).
- 23 novembre 2026 (lot 104) : trois fichiers de `client/stockage/` ajoutés à `FICHIERS_DE_LA_COQUILLE`, `VERSION_CLIENT` et `VERSION_DE_LA_COQUILLE` passés de 2 à 3 (règle du lot 103). `client/demarrage.js` inchangé.
- 23 novembre 2026 (lot 104) : l'auteur décide que **l'écoute de `base-perimee` et la proposition de recharger la page sont faites par le lot 107** (premier lot qui ouvre la base). **Spec 107 mise à jour le 23 novembre 2026** (choix 7 et § 6.6 : écoute de l'événement, `propositionDeRechargement()`, dialogue § 9.11 du design system, jamais pendant une partie, tests 23 à 25 ; fait dans `docs/specs/lot-107.md` et dans la copie locale `documents-depot/specs/lot-107.md`, identiques). Textes du dialogue validés par l'auteur le 23 novembre 2026. **À reporter dans `claude/depot/specs/lot-107.md` du projet claude.ai**, source des specs. La spec 104 (§ 6, décision 6) dit encore « affaire du lot 103 » : non corrigée ici (les documents se corrigent à la source) ; la spec 107 fait foi sur ce point.
- 24 novembre 2026 (lot 107) : précisions prises là où la spec se taisait, dans son esprit. `deciderApresReponse` rend `erreur: null` hors du motif `refus`. Le résultat de `charger` n'a la clé `erreur` que pour le motif `refus`. Un enregistrement rangé n'est lu que si son `paquet` passe `controlerFormeDuPaquet` (§ 6.2). `afficherDialogueDeRechargement` prend `{ plusTard, recharger? }` ; sans `recharger`, il appelle `location.reload()`. Le dialogue prend le focus lui-même (`tabindex="-1"`, sans anneau) ; pas de fermeture par la touche Échap (non prévue). `rechargement.js` et `dialogue-rechargement.js` s'importent l'un l'autre (cycle sans effet : rien n'est utilisé à l'import). Reflet du bouton principal : `--gris-sur-encre` (le design system ne donne pas la couleur du « reflet clair de 1 px »). Les polices Bricolage et Inter n'existent pas encore (`client/polices/`) : le dialogue utilise la police du système, comme l'accueil.
- 24 novembre 2026 (lot 107) : le dialogue est au plan 60 (design system § 5.4) ; l'accueil n'a pas de `z-index` : un dialogue qui s'afficherait pendant la seconde de l'accueil passerait au-dessus (cas quasi impossible, non traité).
- 24 novembre 2026 (lot 107) : hauteurs des boutons du dialogue, 60 px (principal) et 50 px (secondaire) : conformes au § 9.1 du design system, gardées telles quelles, même côte à côte au-delà de 600 px (constat de l'auteur).

- 24 novembre 2026 (lot 105) : **bouton en relief, ombre fixe** (choix de l'auteur). Avec `transform` et `opacity` seuls, il faut trois calques (face, tranche fixe, ombre qui s'efface) et un `<button>` n'a que deux pseudo-éléments sans balisage de plus. Réalisation : le bouton descend de 4 px ; `::before` = face (dégradé, reflet), `::after` = tranche et ombre, qui restent en place (la tranche remonte de 4 px, il en reste 1 px). **L'ombre ne change pas à l'appui** : `--ombre-relief-appui` et `--ombre-relief-boss-appui` sont dans `jetons.css` (test 1) mais inutilisées. Mesuré : tranche `translateY(5px)` au repos, `1px` à l'appui.
- 24 novembre 2026 (lot 105) : **test 10 du lot 101 modifié, avec l'accord de l'auteur** : `docs/specs/index.md` (copie octet pour octet) cite « claude/depot » (lignes 14, 356, 359) ; il rejoint `lot-101.md` dans les exceptions du test (`tests/outillage/documents.test.js`, une ligne).
- 24 novembre 2026 (lot 105) : précisions prises là où la spec se taisait. Matière claire : lumière et ombre sont des couches de fond de l'élément, donc sous la marbrure et le grain (la spec les met au-dessus) : écart de rendu minime, noté pour le catalogue. `creerScotch` rend l'enveloppe, pas le scotch. `ouvrirDialogue` rend un `element` nul tant que le dialogue attend. Dialogue : Échap et Tab sont pris en phase de capture sur `window` et arrêtés, pour qu'une fiche ouverte dessous ne reprenne pas le focus. Fiche : `libelle` absent → erreur `fiche_mal_formee`. Trio : le pourcentage du milieu est relevé avec son étoile. Rangée sombre : marge 2 px 4 px posée en padding. Les jetons du dialogue passent aux polices du design system (titre en Bricolage) : seul changement visible du dialogue de rechargement avec la police.
- 24 novembre 2026 (lot 105) : **le dialogue prend la matière `.paillasse-claire` et `--reflet-fiche` au lieu de `--surface`**, sur demande de l'auteur (design system, décision 18, qui l'emporte sur le § 9.11 ; écart à signaler à la source). Classe ajoutée dans `dialogue.js`.
- 24 novembre 2026 (lot 105) : le lot 107 a été codé avant ; son `afficherDialogueDeRechargement` rend maintenant le retour d'`ouvrirDialogue` (`{ element, fermer }`) au lieu du voile.

- Rien n'est poussé : le commit du lot 102 est sur `dev`, local ; le push attend l'accord de l'auteur.

## Points à vérifier

- `docs/specs/cadrage-lot-611.md` n'est **pas** copié : la spec (§ 6.6) ne liste que l'index et les `lot-N.md`. À confirmer par l'auteur si le cadrage doit aussi entrer dans `docs/specs/`.
- Règle de refus `git config *core.hooksPath*` : elle bloque aussi la simple lecture (`git config core.hooksPath`) dans une session Claude Code. Le test 7 la lit par Node, sans passer par cette règle.
- Les règles `git commit -n` ne voient pas un drapeau groupé (`-an`) ; seul le crochet le couvrirait, et il ne voit pas les options.
- Rapport du test 11 : 102 identifiants au format du tableur, tous dans des tableaux de formats ou des exemples des documents copiés (briefing, schéma, specs 101, 305, 505, 506) ; relu par l'auteur avant l'envoi de `dev`.
- Lot 103, vérifications faites dans Chrome (Claude in Chrome), en local le 23 novembre : critère 3 (service worker actif, cache `microbio-coquille-v2` de 19 fichiers, page rechargée serveur coupé, aucune erreur console) et critère 4 (versions passées à 3 : à la 1re ouverture, aucun rechargement et la version 3 attend ; à la suivante, un seul rechargement, cache v3 en place, v2 supprimé, cache fictif `carnet-rea-essai` conservé ; versions remises à 2). Observation : dans cet essai, l'application de la version en attente a pris plusieurs secondes (onglet Chrome en arrière-plan, probablement) pendant lesquelles l'accueil est resté affiché : il n'a pas de délai maximal (la spec n'en fixe pas). Si un téléphone montre un accueil qui dure trop, à signaler à l'auteur. Critère 7 confirmé par l'auteur le 23 novembre : installation sur iPhone (icône, plein écran, mode avion) et sous Android. Le navigateur intégré à Claude Code ne gère pas les service workers. Un `404` sur `favicon.ico` est normal (aucun favicon dans le lot).
- **Lot 104 — `base-perimee` (tranché : lot 107, voir Décisions)** : le § 6 (décision 6) de la spec dit que « proposer de recharger la page est l'affaire du lot 103 », or le lot 103 n'a rien prévu pour cet événement (ni `mise-a-jour.js`, ni les specs 103). Rien n'est codé : l'événement existe sur `base.evenements`, personne ne l'écoute. À décider avec l'auteur : quel lot écoute l'événement et affiche la proposition (lot 107, premier utilisateur de la base ? un lot dédié ?).
- **Lot 104, vérifications dans un navigateur** (page `tests/navigateur/stockage.html`, servie en local, le 23 novembre) : **Chrome 156 (macOS), via Claude in Chrome** : les 15 scénarios réussissent, `microbio-essai-104` n'existe plus (`indexedDB.databases()` vide). En plus, sur une base jetable (hors dépôt, console) : `migration_echouee` (index unique sur des doublons : la base reste en version 1, données intactes), `base_bloquee` au bout de 5,0 s (une connexion qui ignore `versionchange` ; la base reste en version 1 après le déblocage), `base-perimee` émis une fois et ancienne base fermée (`base_fermee`). **Safari (ordinateur), passé par l'auteur le 23 novembre** : « 15 scénarios réussis » (version de Safari et dernière ligne sur la base d'essai non précisées ; le scénario 14 réussit donc aussi, pas d'écart avec Chromium). Non testés : iPhone (lot 108), Firefox. Le navigateur intégré à Claude Code n'a pas été utilisé.
- **Lot 107, critère 6, vérifié le 24 novembre 2026** dans le navigateur intégré à Claude Code, en 390 px, appli servie par un petit serveur local sans cache (Python, hors dépôt ; avec `python3 -m http.server`, le navigateur gardait les modules en cache et ne voyait pas la version modifiée). Copies temporaires annulées, `git status` propre.
  - 6.1 à 6.3, 6.5 à 6.7 : **réussis** (enregistrement `internes` rangé ; `recuLe` inchangé au rechargement ; version + 1 rangée au rechargement ; logo affiché à la première ouverture puis absent à la suivante ; page de vérification « 4 scénarios réussis sur 4 », `microbio-essai-107` absente ensuite ; dialogue affiché dans le premier onglet, « Plus tard » le ferme sans retour, le rechargement retrouve la base).
  - 6.4 : **réussi pour le lot 107, avec une réserve** : seules erreurs de la console, l'inscription du service worker, que le navigateur intégré ne gère pas (`sw.js` bien servi ; déjà noté au lot 103). Aucun indicateur de chargement.
  - Mouvement réduit (fin du 6.7) : **vérifié seulement par lecture de la feuille de style chargée** (en mouvement réduit, fondu de 120 ms sans `transform`, plus de transition des boutons) : l'outil ne sait pas émuler le réglage. **À vérifier en vrai au lot 106** (émulation de Chrome, ou téléphone).
  - Captures du dialogue faites à 390 px (boutons empilés) et à 800 px (côte à côte, « Recharger » à droite).
- **Lot 105, vérifications du 24 novembre 2026** (appli servie par un petit serveur Python sans cache, hors dépôt ; navigateur intégré pour le catalogue, **Chrome 158 piloté par CDP dans un profil jetable** pour le reste, le navigateur intégré ne gérant ni service worker ni émulation du mouvement réduit) :
  - critère 2 : contrôles 16 à 22 « 7 contrôles réussis sur 7 » à 390 et à 800 px ; aucune erreur dans la console ; Inter, Bricolage Grotesque et Caveat chargées ; avec le service worker actif et le réseau coupé, les trois polices sont servies par le cache (200) ;
  - critère 4 : cache `microbio-coquille-v5` de 48 fichiers, dont les 9 fichiers de `client/polices/` et 11 de `client/design/` ;
  - critère 5 : seconde connexion à `microbio` en version 99 → le dialogue s'affiche avec les mêmes textes, le focus est dans le dialogue ; Échap le ferme et il ne revient pas ; à l'appui (état forcé), le bouton descend de 4 px et la tranche passe de 5 à 1 px, sans saut d'ombre (ombre fixe). Le bouton « Recharger » n'a pas été cliqué (rechargement de page non exercé) ;
  - **critère 6, soldé** : en émulation `prefers-reduced-motion: reduce`, le dialogue apparaît et disparaît en fondu de 0,12 s (`linear`), sans échelle, retiré 123 ms après la fermeture (contre 0,24 s et 249 ms sans réduction) ; transition des boutons 0 s. **La réserve du lot 107 est donc soldée** (vérifiée dans Chrome, pas sur iPhone).
  - **Critère 3 validé par l'auteur le 24 novembre 2026** : captures du catalogue à 390 et 800 px, puis du dialogue sur paillasse claire. Rendu des filtres de bruit : fluide dans Chrome de l'ordinateur ; coût sur iPhone à mesurer au lot 108.
- Licence du dépôt : non choisie (point signalé de l'index).

## Idées notées

- Aucune.

## Reste

- Lot 103 : terminé et publié (Pages activé, `main` avancée le 23 novembre jusqu'à 57d26d6, critères 1 à 9 vérifiés). Les notes de PROGRESS.md postérieures sont sur `dev`.
- Lot 104 : publication (avance de `main`) seulement avec l'accord de l'auteur.
- Lot 105 : fait et poussé sur `dev` (critère 3 validé). Corriger dans le design system les trois écarts de la décision 10 de la spec (§ 4.2, § 7.1, § 3.4) : à la source.
- Lot 107 : fait ; mouvement réduit du dialogue soldé au lot 105 ; **à reporter dans `claude/depot/specs/lot-107.md`** si la spec y a encore l'ancienne version (voir Décisions du lot 104). Publication (avance de `main`) seulement avec l'accord de l'auteur.
- Lot 106 (spec à écrire), 108.
- `main` n'avance qu'avec l'accord de l'auteur.
