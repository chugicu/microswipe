<!-- Application Microbio — CLAUDE.md, écrit en phase 0, lot 4a (15 novembre 2026) ; règle d'architecture 14 ajoutée au lot 4b ; règles relues et complétées avec l'auteur le 17 novembre (conversation de remise à jour). À copier à la racine du dépôt.
Pour qui modifie ce fichier : rester sous 200 lignes ; n'y mettre que des règles valables à chaque session ; ne jamais écrire un chemin précédé d'une arobase, le fichier visé serait chargé à chaque session. -->

# Application Microbio — règles du projet

Ce fichier ne contient que les règles permanentes. Le détail est dans `docs/` : va le lire, ne le recopie pas ici.

## Le projet

- Application d'apprentissage de la microbiologie, puis de l'infectiologie, pour les internes et jeunes médecins (Réanimation Guadeloupe). Difficulté croissante, très gamifiée, formats de jeu variés.
- PWA en JavaScript sans framework, hébergée sur GitHub Pages, jouable hors ligne. Serveur Apps Script, données dans Google Sheets.
- Autonome, et accessible depuis Carnet Réa dont elle lit les comptes sans jamais y écrire.
- L'auteur est médecin, pas développeur. Il valide lui-même tout le contenu médical. Fiabilité attendue : plus de 99 %.
- Le dépôt est public : le code y est, le contenu médical jamais.
- Nom affiché à l'interne : **MicroSwipe** (`chugicu.github.io/microswipe/`) ; noms internes inchangés : base `microbio`, préfixe `microbio-`.

## Où trouver quoi

| Fichier | Contenu | Quand le lire |
|---|---|---|
| `PROGRESS.md` | Ce qui est fait, ce qui reste, les décisions | À chaque session |
| `docs/specs/lot-N.md` | Spécification d'un lot | À chaque session, celle du lot seulement |
| `docs/briefing.md` | Décisions fonctionnelles et pédagogiques | Les sections citées par la spec |
| `docs/architecture.md` | Flux, comptes, synchronisation, sécurité | Les sections citées par la spec |
| `docs/schema-de-donnees.md` | Fichiers, onglets, colonnes, identifiants | Dès qu'une donnée est lue ou écrite |
| `docs/design-system.md` | Couleurs, composants, mouvement | Pour tout écran ou animation |
| `docs/plan-de-developpement.md` | Ordre des phases, modèle par étape | Sur demande seulement |

## Rituel de chaque session

1. Lis `PROGRESS.md`, puis la spec du lot demandé. Dans `docs/`, ne lis que les sections que la spec cite.
2. Ne fais que ce lot. La spec vaut accord de l'auteur ; rien hors spec sans le demander. Une idée d'amélioration se note dans `PROGRESS.md`, elle ne se code pas.
3. Teste : `node --test` en entier, puis le lot dans un navigateur, en largeur de téléphone.
4. Mets à jour `PROGRESS.md` : fait, reste, décisions prises, points à vérifier.
5. Enregistre : commit en français sur la branche `dev`, puis push. Jamais sur `main`.

## Règles pédagogiques (jamais enfreintes)

1. La pédagogie prime sur la gamification : n'ajoute aucun système de progression.
2. Simplifier par omission, jamais par une affirmation fausse.
3. Une version simplifiée l'annonce sans dire ce qui est simplifié (texte type : briefing § 2).
4. Les questions simplifiées n'existent que dans la campagne. Tous les autres modes ne servent que des questions vraies, sans simplification.
5. Dessins de bactéries :
   - question sur le Gram : jamais rose, violet, rouge ni vert ; une couleur unique ou des couleurs aléatoires ;
   - question sur la forme : forme générique, ni ronde ni en bâtonnet allongé ;
   - question sur les deux : les deux règles s'appliquent.
6. Fiches espèces et niveaux « révélation » ne montrent rien d'une notion que l'interne n'a pas encore rencontrée.
7. Contenu médical : n'écris aucun fait de mémoire, ne corrige aucune valeur, ne passe jamais une ligne à « Validé ». Seul l'auteur valide.

## Règles d'architecture (jamais enfreintes)

1. **Tout est donnée.** Aucun monde, niveau, question ni réglage du schéma n'est écrit en dur dans le code. Seule une nouvelle mécanique de jeu demande du code.
2. **Aucun contenu médical dans le dépôt.** Contenu médical = tout fait issu du tableur ou de la Sheet (valeur, réponse, énoncé, explication, règle), y compris dans un test, un exemple, un commentaire, une spec ou un message de commit. Tests et exemples utilisent des données fictives (« Bactérie A », « Antibiotique X »). Le contenu réel de travail reste dans le dossier local exclu par `.gitignore`.
3. **Questions non validées filtrées côté serveur**, jamais seulement dans l'interface. Le paquet « internes » ne peut pas en contenir. Les droits admin sont vérifiés par le serveur à chaque action.
4. **Jamais d'attente serveur pendant le jeu** : le jeu tourne en local, la synchronisation part en arrière-plan. Seules exceptions : celles d'architecture § 5.2.
5. **Le serveur est la référence**, le téléphone une copie. L'ELO officiel est calculé par le serveur, dans l'ordre de réception.
6. **Journal de réponses : ajout seulement.** Aucune ligne modifiée ni supprimée. Progression, Scores, Etalonnage et Suivi doivent pouvoir se recalculer depuis le journal.
7. **Mode test : rien ne s'enregistre.** Ses réponses n'entrent pas dans la file et le serveur les refuse. Tout abonné des événements du jeu qui enregistre quoi que ce soit sur l'interne (progression, reprise, bestiaire, ELO local, badges, cartes) ignore un événement dont `modeTest` vaut `true`.
8. **Identifiants stables** : attribués par le serveur, jamais renommés ni réutilisés, même après archivage.
9. **Supprimer = archiver** (colonne `Archivé le`, séparée du statut de validation). Aucune ligne de contenu n'est effacée.
10. **Une question modifiée garde son ELO**, quel que soit le canal (espace Admin, mode test, import). **Seule exception** : quand la liste des lignes posées d'une question « Construis l'antibiogramme » change, la question ne garde pas son ELO (lot 611).
11. **Sheet de production** : écrite seulement par l'espace Admin, le mode test et l'import, sous verrou, **par le contrôle commun des écritures de contenu** (refus pendant un import), avec une ligne d'`Historique` et `contenu.version` augmentée sous le même verrou. Jamais à la main, jamais par un script de développement.
12. **Carnet Réa en lecture seule** : ni écriture, ni nouveau rôle, ni nouvelle colonne dans ses onglets.
13. **Stockage local dans IndexedDB**, jamais dans `localStorage` (partagé avec Carnet Réa et EchoLearn). Cache du service worker préfixé `microbio-`. **Une seule base, `microbio`** : un magasin s'ajoute par une migration en fin de liste ; une migration enregistrée n'est jamais modifiée, renumérotée ni retirée.
14. **Deux modules uniques**, pour qu'une migration ne touche qu'eux (architecture § 2) :
    - serveur : tous les accès à Sheets et à Drive passent par le seul module de stockage ; aucun autre fichier n'appelle `SpreadsheetApp`, `DriveApp`, `PropertiesService` ni `CacheService` ;
    - client : le serveur Microbio est appelé par un seul module, dont l'adresse est une valeur de configuration ; aucun autre fichier ne fait d'appel réseau vers lui ;
    - une opération qui manque s'ajoute dans le module, jamais à côté.
15. **Rien de confidentiel dans `Reglages`** : tout l'onglet part sur le téléphone de chaque interne. Une valeur qui doit rester sur le serveur va dans les propriétés du script.
16. **ELO : une seule formule, un tableau des modes.** La formule est dans `serveur/logique/elo.js`, recopiée à l'identique sur le téléphone (un test compare les deux) ; toute correction se fait côté serveur, puis se recopie. Tout mode de jeu a sa ligne dans `EFFETS_ELO_PAR_MODE` ; un mode absent n'a aucun effet.

## Conventions de code

- **Client** : JavaScript en modules ES natifs. Ni framework, ni compilation, ni TypeScript, ni bundler, ni bibliothèque chargée par CDN.
- **Serveur** : Apps Script, déployé par `clasp`, vers l'environnement de test seulement. La logique (ELO, filtre, import, synchronisation) est écrite en fonctions pures, séparées des appels Google, pour être testée par Node.
- **Nommage** : termes du domaine en français sans accent, exactement ceux du schéma (`monde`, `niveau`, `question`, `fait`, `palier`, `plancher`) ; ne les traduis pas. Fichiers en `kebab-case`, fonctions et variables en `camelCase`, constantes en `MAJUSCULES_SOULIGNEES`.
- **Onglets et colonnes** : noms copiés tels quels du schéma, accents compris.
- **Langue** : commentaires et messages de commit en français. Textes d'interface en français, en tutoyant l'interne.
- **Commentaires** : une phrase en tête de chaque fichier dit son rôle ; le reste explique le pourquoi, pas le quoi.
- **Interface** : aucune couleur, durée ni espacement hors de `docs/design-system.md` ; une valeur visuelle absente ne s'invente pas : demande.

## Tests obligatoires

- Outil : `node --test`, sans dépendance, sur des données fictives.
- Quatre domaines toujours couverts :
  - moteur ELO ;
  - import (rapprochement par identifiant, conflits, archivage) ;
  - synchronisation (doublons, renvoi après coupure, refus des réponses du mode test) ;
  - filtre des questions non validées (aucune dans le paquet « internes »).
- Un lot qui touche l'un de ces domaines ajoute ou adapte ses tests.
- Tous les tests passent avant d'enregistrer. Ne modifie, ne désactive ni ne supprime jamais un test pour le faire passer.

## Arrête-toi et demande

Pose une question à la fois, avec ta recommandation et sa raison en une ligne, dans ces cas :

- contenu médical incertain, manquant ou contradictoire (ne devine jamais) ;
- toute modification du schéma de données (onglet, colonne, identifiant, format) ;
- toute nouvelle dépendance (bibliothèque, outil, service) ;
- tout ce qui touche à Carnet Réa ou à EchoLearn (code, Sheet, serveur) ;
- contradiction entre la spec, `docs/` et ce fichier : signale-la, ne tranche pas ;
- deux essais ratés sur le même bug : décris ce que tu as essayé et arrête ;
- écriture ou suppression dans les fichiers Google de production, fusion vers `main`, déploiement Apps Script de production ;
- besoin de sortir du lot, spec absente, ou `docs/design-system.md` absent pour un écran ;
- modification de ce fichier.

## Propositions refusées (ne jamais les reproposer)

Boss cumulatif ; questions réservées au pré-test et au post-test ; notification quotidienne ; mode staff ; second tableur ; réexport de l'espace Admin vers la Sheet ; question limitée à un seul niveau ; réponse « S ou R » pour les résistances naturelles dans une question oui / non (une case de « Construis l'antibiogramme » n'est pas visée) ; J3, J12, G5, G6, P9. Détail : briefing § 14.

Avant de proposer une fonctionnalité, vérifie qu'elle n'est pas déjà tranchée dans le briefing.

## Avec l'auteur

Français, tutoiement, droit au but (il surveille son quota). Signale toute incertitude plutôt que de deviner.
