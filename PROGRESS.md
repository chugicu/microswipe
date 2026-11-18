# PROGRESS — MicroSwipe

Mémoire du projet d'une session à l'autre : lis ce fichier en premier, mets-le à jour en dernier.

## État

- Dernier lot fait : **101** (dépôt, garde-fous, `node --test`, `PROGRESS.md`, documents dans `docs/`), le 17 novembre 2026.
- Prochain lot : **102** (format du paquet de contenu et jeu de données fictif). Les lots 103, 104 et 301 ne dépendent que du 101.

## Environnement

- Node 26.13.1 (22 ou plus requis), git 2.56.1, Claude Code 2.1.126. `gh` n'est pas installé : le dépôt distant a été créé à la main sur github.com.
- Dépôt : `chugicu/microswipe` (public), adresse prévue `https://chugicu.github.io/microswipe/` (GitHub Pages non activé : lot 103).
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
| `client/` | Code du téléphone, modules ES natifs. | Lots 102 et suivants (le lot 101 n'y met que le logo, dans `client/images/`). |
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

## Décisions

- 17 novembre 2026 : `.claude/settings.local.json` créé avec des refus d'`Edit` sur les dossiers locaux de Carnet Réa et d'EchoLearn trouvés sur l'ordinateur (l'auteur pensait ne rien avoir en local ; des copies existent, il n'a pas désigné lesquelles, la règle large a été prise par prudence).
- 17 novembre 2026 : le crochet est écrit avec une fonction `est_interdit` et non un `case` dans `$(…)`, que le `sh` de macOS ne lit pas.
- 17 novembre 2026 : `documents-depot/` (copie locale de `claude/depot/`, relue et acceptée par l'auteur) est la seule source des documents ; elle est hors du dépôt.

## Points à vérifier

- `docs/specs/cadrage-lot-611.md` n'est **pas** copié : la spec (§ 6.6) ne liste que l'index et les `lot-N.md`. À confirmer par l'auteur si le cadrage doit aussi entrer dans `docs/specs/`.
- Règle de refus `git config *core.hooksPath*` : elle bloque aussi la simple lecture (`git config core.hooksPath`) dans une session Claude Code. Le test 7 la lit par Node, sans passer par cette règle.
- Les règles `git commit -n` ne voient pas un drapeau groupé (`-an`) ; seul le crochet le couvrirait, et il ne voit pas les options.
- Rapport du test 11 : 102 identifiants au format du tableur, tous dans des tableaux de formats ou des exemples des documents copiés (briefing, schéma, specs 101, 305, 505, 506) ; relu par l'auteur avant l'envoi de `dev`.
- Licence du dépôt : non choisie (point signalé de l'index).

## Idées notées

- Aucune.

## Reste

- Lot 102, puis 103 (première publication sur GitHub Pages), 104, 105 et 106 (specs à écrire), 107, 108.
- Activer GitHub Pages et avancer `main` : seulement avec l'accord de l'auteur, à partir du lot 103.
