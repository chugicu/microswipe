# PROGRESS — MicroSwipe

Mémoire du projet d'une session à l'autre : lis ce fichier en premier, mets-le à jour en dernier.

## État

- Dernier lot fait : **103** (coquille PWA), le 23 novembre 2026, **sauf** l'activation de GitHub Pages, la publication et les vérifications sur téléphone (voir « Reste »). Avant lui : **102** (format du paquet de contenu et jeu de données fictif), le 23 novembre 2026. Avant lui : **101** (dépôt, garde-fous, `node --test`, `PROGRESS.md`, documents dans `docs/`), le 17 novembre 2026.
- Prochain lot : **104** ou **301** (ne dépendent que du 101) ; le lot 107 dépend de 102, 103 et 104.

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

## Décisions

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
- Rien n'est poussé : le commit du lot 102 est sur `dev`, local ; le push attend l'accord de l'auteur.

## Points à vérifier

- `docs/specs/cadrage-lot-611.md` n'est **pas** copié : la spec (§ 6.6) ne liste que l'index et les `lot-N.md`. À confirmer par l'auteur si le cadrage doit aussi entrer dans `docs/specs/`.
- Règle de refus `git config *core.hooksPath*` : elle bloque aussi la simple lecture (`git config core.hooksPath`) dans une session Claude Code. Le test 7 la lit par Node, sans passer par cette règle.
- Les règles `git commit -n` ne voient pas un drapeau groupé (`-an`) ; seul le crochet le couvrirait, et il ne voit pas les options.
- Rapport du test 11 : 102 identifiants au format du tableur, tous dans des tableaux de formats ou des exemples des documents copiés (briefing, schéma, specs 101, 305, 505, 506) ; relu par l'auteur avant l'envoi de `dev`.
- Lot 103, **non vérifié** : (a) le navigateur intégré à Claude Code refuse tout enregistrement de service worker (même un script d'essai trivial) : les critères 3 et 4 du § 9 (service worker actif, cache v1, hors ligne, passage à la version 2) n'ont **pas** été faits dans un navigateur ; `sw.js` a seulement été exécuté dans Node avec de fausses API (installation, activation, nettoyage sans toucher à un cache d'une autre appli, réponses par stratégie, message `passer`) ; (b) critère 7 (Android, iPhone, mode avion) : après publication, avec l'auteur ; (c) un `404` sur `favicon.ico` est normal (aucun favicon dans le lot).
- Licence du dépôt : non choisie (point signalé de l'index).

## Idées notées

- Aucune.

## Reste

- Lot 103, étapes de l'auteur : activer GitHub Pages (source branche `main`, dossier racine), pousser `dev`, accepter l'avance rapide de `main` jusqu'à `dev`, vérifier `https://chugicu.github.io/microswipe/` puis le critère 7 sur téléphone ; critères 3 et 4 à faire dans Chrome.
- Lots 104, 105 et 106 (specs à écrire), 107, 108.
- `main` n'avance qu'avec l'accord de l'auteur.
