# Index des lots de développement — Application Microbio

Écrit en phase 0, lot 4b (15 novembre 2026) ; mis à jour aux conversations 2, 3, 4 et 5 du lot 4b (15 et 16 novembre), à la conversation A (16 novembre, amendement des specs 201, 308 et 309), puis à la conversation B (16 novembre, specs 101, 102, 103, 104, 107 et 108 ; nom MicroSwipe). Le 17 novembre : choix par défaut des specs 101, 102, 104 et 107 confirmés un par un par l'auteur ; règle de copie des specs nouvelles (point 61) et logo (point 73) décidés. Le même jour, **conversation de remise à jour** : specs 102, 103, 208, 213 et 301 amendées ; lot 611 ajouté ; briefing, architecture et schéma alignés (points 25, 39, 42, 54, 68 fermés). Découpe les phases 1 à 7 du plan (`docs/plan-de-developpement.md`, § 5) en lots. Aucun contenu médical dans ce fichier ni dans les specs.

## Règles

- Un lot = une conversation = une spec `docs/specs/lot-N.md`. Chaque lot est testable seul.
- **Numérotation** : la centaine donne la phase (308 = phase 3, huitième lot). Elle est distincte des lots 1 à 5 de la phase 0. Un lot inséré plus tard prend un numéro libre de sa centaine ; aucun lot n'est renuméroté.
- Un lot ne dépend que de lots de numéro inférieur, listés dans « Dépend de ».
- Les lots se font dans l'ordre des numéros, sauf accord de l'auteur.
- **Specs écrites** : 101, 102, 103, 104, 107, 108 (conversation B, 16 novembre), 201 (amendée le 16 novembre : `reponsesProposees`), 208, 213, 301, 302, 305, 306 (amendée le 15 novembre : section `reglages`), 308 et 309 (amendées le 16 novembre : `reponsesProposees`, seizième colonne du journal), 401, 402, 403, 505, 506. **Amendées le 17 novembre** (conversation de remise à jour) : 102 (clés `Milieu`), 103 (logo), 208 (monde maîtrisé, invitation à installer, critère 5.7), 213 et 301 (chemin `/microswipe/`). **Amendées le 23 novembre** : 107 (base périmée et dialogue de rechargement, décision de l'auteur ; point 77) et 104 (renvoi au lot 107). Les autres restent à écrire. Le lot 611 a un cadrage (`cadrage-lot-611.md`), pas encore de spec.
- ~~**Specs à amender**~~ **Aucune** depuis le 17 novembre : 213 et 301 (`/microswipe/`), 208 (invitation à installer, monde maîtrisé), 103 (logo), 102 (clés `Milieu`) ont été amendées dans la conversation de remise à jour ; 201, 308 et 309 le 16 novembre (point signalé 42).
- **Specs à écrire après la conversation C** : 105 et 106 (elles mettent en code le design system).
- **Specs nouvelles** (point 61, confirmé le 17 novembre) : écrites sans contenu médical dès le départ et rangées dans `depot/specs/` du projet claude.ai ; le premier commit du lot qui les utilise les copie telles quelles dans `docs/specs/`, avec l'index s'il a changé.

## Règles valables pour toutes les specs (décidées les 15 et 16 novembre)

Les deux premières gardent une migration bon marché. Les règles 3 à 8 viennent des specs 301, 302 et 306 ; toute spec du serveur les applique. La règle 9 vient de la spec 213 ; toute spec du client l'applique. Les règles 10 et 11 viennent de l'amendement de la spec 306 et de la spec 506. Les règles 12 et 13 viennent des specs 401 et 402. La règle 14 vient de la spec 104 (confirmée par l'auteur le 17 novembre).

1. **Serveur : un seul module de stockage.** Tous les accès à Sheets et à Drive passent par lui, ainsi que les propriétés du script et le cache. Aucun autre fichier du serveur n'appelle `SpreadsheetApp`, `DriveApp`, `PropertiesService` ni `CacheService`. Un lot qui a besoin d'une opération nouvelle l'ajoute dans ce module. Détail : `lot-301.md` § 6.6.
2. **Client : un seul module d'appel du serveur, à adresse configurable.** Lui seul connaît l'adresse du serveur Microbio, lue dans une configuration. Aucun autre fichier du client ne fait d'appel réseau vers le serveur. Détail : `lot-301.md` § 6.12.
3. **Fonctions pures** dans `serveur/logique/`, sans service Google ni lecture de l'heure, terminées par un export réservé à Node ; aucun code exécuté au chargement d'un fichier. Détail : `lot-301.md` § 6.2.
4. **Une action = une ligne de `tableDesActions()`.** Le routeur vérifie la session avant toute action non publique. Tout lot qui modifie le serveur augmente `VERSION_SERVEUR` de 1. Détail : `lot-301.md` § 6.4.
5. **Droits** : une action réservée aux admins commence par `exigerDroit(contexte.idCompte, '<droit>')`, et le rappelle sous le verrou avant d'écrire. Détail : `lot-302.md` § 6.5.
6. **Fichier de comptes de Carnet Réa** : aucune écriture ; lectures limitées à une liste fermée, qui ne s'élargit qu'avec l'accord de l'auteur. Détail : `lot-302.md` § 6.3.
7. **Toute écriture de contenu augmente `contenu.version` sous le même verrou.** Sans cela, les paquets ne sont pas reconstruits. Détail : `lot-306.md` § 6.7.
8. **Aucun jeton de session dans le dépôt**, même fictif et valable seulement sur le serveur de test.
9. **Mode test : rien ne s'enregistre.** Un abonné des événements du jeu qui enregistre quoi que ce soit sur l'interne (progression, reprise, bestiaire, file, ELO local, badges, cartes) ignore tout événement dont `modeTest` vaut `true`. Détail : `lot-213.md` § 6.7.
10. **Tout ce qui est rangé dans `Reglages` part sur le téléphone de chaque interne.** Une valeur qui doit rester sur le serveur va dans les propriétés du script, jamais dans `Reglages`. Détail : `lot-306.md` § 6.5.
11. **Toute écriture de contenu passe par un contrôle commun, sous le verrou**, qui la refuse (`import_en_cours`) pendant l'application d'un import. Les noms de fonctions déclarés au niveau d'un fichier du serveur sont uniques dans tout le serveur : une spec ne réutilise pas un nom d'une autre spec. Détail : `lot-506.md` § 4 ; `lot-305.md` § 6.1.
12. **Tout mode de jeu a sa ligne dans `EFFETS_ELO_PAR_MODE`** (fait bouger l'interne, étalonne la question, marque « déjà vue »). Un mode absent n'a aucun effet sur l'ELO. Détail : `lot-401.md` § 6.3.
13. **Une seule formule d'ELO**, dans `serveur/logique/elo.js`, recopiée à l'identique dans `client/elo/moteur.js`. Toute correction se fait dans le fichier du serveur, puis se recopie ; un test compare les deux. Détail : `lot-402.md` § 6.8.
14. **Stockage local : une seule base, `microbio`, par l'enveloppe du lot 104.** Un lot qui a besoin d'un magasin ajoute une migration à la fin de `MIGRATIONS` ; une migration enregistrée n'est jamais modifiée, renumérotée ni retirée. Dans une transaction, on n'attend que ses propres opérations. Détail : `lot-104.md` § 6.3, § 6.6.

Référence : `docs/architecture.md`, § 2.

## Légende

- Documents : **B** = `docs/briefing.md` (version du dépôt, sans contenu médical : § 11 et exemples médicaux retirés), **A** = `docs/architecture.md`, **S** = `docs/schema-de-donnees.md`, **D** = `docs/design-system.md`, **P** = `docs/plan-de-developpement.md`.
- Tests : domaines obligatoires du `CLAUDE.md` touchés par le lot. **E** = moteur ELO, **I** = import, **Sy** = synchronisation, **F** = filtre des questions non validées. « — » = aucun des quatre (le lot écrit quand même ses propres tests).

## Phase 1 — Fondations

| N° | Titre | Dépend de | Sections à lire | Tests |
|---|---|---|---|---|
| 101 | Dépôt, garde-fous, `node --test`, `PROGRESS.md`, documents copiés dans `docs/` (**spec écrite**) | — | P § 2, § 7, § 9 (lot 4a) | — |
| 102 | Format du paquet de contenu et jeu de données fictif (**spec écrite**, amendée le 17 novembre : clés `Milieu`) | 101 | S § 2, § 3 ; A § 5.1 | — |
| 103 | Coquille PWA : manifeste, service worker `microbio-`, mise à jour, invitation à installer, logo à l'ouverture, publication sur GitHub Pages (**spec écrite**, amendée le 17 novembre : logo) | 101 | A § 2, § 4 ; B § 10 quater (1) ; P § 8 | — |
| 104 | Stockage local IndexedDB (enveloppe, migrations) (**spec écrite**) | 101 | A § 2, § 5.2 | — |
| 105 | Design system 1 : jetons, boutons, fiches (spec après la conversation C) | 103 | D ; B § 6 | — |
| 106 | Design system 2 : mouvement, transitions, navigation du bas, écrans (spec après la conversation C) | 105 | D ; B § 6 | — |
| 107 | Chargement du contenu (paquet fictif vers IndexedDB, version) (**spec écrite**) | 102, 103, 104 | A § 5.1 ; S § 3.13 | — |
| 108 | Vérifications sur iPhone et Android : stockage d'une appli installée, vibration (**spec écrite**) | 103, 104 | A § 3, § 7 ; B § 9 (G14), § 13 | — |

## Phase 2 — Campagne

| N° | Titre | Dépend de | Sections à lire | Tests |
|---|---|---|---|---|
| 201 | Moteur de niveaux, logique pure : partie, table de correspondance, réponse lue dans le fait, score, étoiles | 101, 102 | S § 3.2, § 3.3, § 3.4, § 3.5, § 3.6, § 3.13 ; B § 2, § 4 (score partiel), § 5 | — |
| 202 | Carte en pile de boîtes, états des niveaux | 106, 107 | B § 5, § 6, § 10 bis (monde invisible) ; S § 3.1, § 3.2 ; D | — |
| 203 | Fiche de niveau, transition colonie → fiche | 202 | B § 2 (règle 3), § 6 ; D | — |
| 204 | Écran de jeu et swipe (2 à 5 directions), dessin de bactérie | 106, 201 | B § 2 (règle 6), § 7 (J1, mécaniques génériques) ; A § 4 ; S § 3.2, § 3.3 ; D | — |
| 205 | QCM | 204 | B § 7 ; S § 3.4, § 3.5 ; D | — |
| 206 | Tri par glisser-déposer | 204 | B § 7 (J6) ; S § 3.5 ; D | — |
| 207 | Fin de niveau : résultat, étoiles, explications, re-test immédiat | 204 | B § 5, § 8 (P1, re-test) ; S § 3.4, § 3.7 ; D | — |
| 208 | Progression locale : déblocages, boss (réserve, seuil), monde suivant, monde maîtrisé, demande de l'invitation à installer (**spec écrite**, amendée le 17 novembre) | 103, 104, 201, 202, 207 | B § 5, § 10 bis (monde invisible) ; S § 3.1, § 3.2, § 3.6, § 4.2 ; A § 5.2 | — |
| 209 | Reprise exacte | 104, 204 | B § 8 ; A § 5.2 | — |
| 210 | Bestiaire | 207 | B § 2 (règle 4), § 8 (P4) ; S § 3.7 | — |
| 211 | Niveau révélation | 204, 210 | B § 2 (règle 5), § 5 bis, § 6 ; S § 3.2 | — |
| 212 | Animations de la carte : niveau réussi, strie, changement de monde | 202, 208 | B § 6 ; D | — |
| 213 | Mode test : navigation libre | 106, 201, 202, 203, 204, 207, 208, 209 | B § 3, § 10 quinquies ; A § 5.6 ; D | Sy |
| 214 | Contenu réel des mondes 1 et 2, hors dépôt (outil local) — à confirmer | 107, 201 | P § 9 (lot 4a) ; S § 3 | — |

## Phase 3 — Serveur

| N° | Titre | Dépend de | Sections à lire | Tests |
|---|---|---|---|---|
| 301 | Squelette du serveur : `clasp` vers le test, routeur, verrou, **module de stockage unique**, Reglages, fonctions pures testables ; côté client, **module d'appel unique à adresse configurable** | 101 | A § 2, § 4, § 7 ; S § 1, § 3.13 ; P § 7 | — |
| 302 | Comptes : sessions de Carnet Réa en lecture seule, Profils, droits | 301 | A § 3, § 5.6 ; S § 4.1 | — |
| 303 | Connexion sur le téléphone, verrou Face ID, maintien de session | 106, 302 | A § 3 ; B § 10 (C1) | — |
| 304 | Inscription autonome (modification de Carnet Réa) | 303 | A § 3 ; B § 10 (C1) ; P § 5 bis | — |
| 305 | Conversion du tableur en fichier Contenu | 301, 302 | S § 2, § 3.1, § 3.2, § 3.4, § 3.6, § 3.7, § 3.8, § 3.10, § 3.13 ; A § 8 (2, 9, 14) | I |
| 306 | Paquets de contenu « internes » et « admin » | 302, 305 | A § 5.1, § 5.6 ; S § 3.5, § 3.9, § 3.13 | F |
| 307 | Chargement du contenu depuis le serveur | 107, 303, 306 | A § 5.1 ; S § 3.13 | F |
| 308 | Synchronisation, serveur : réception, doublons, refus, journal annuel sous verrou | 301, 302, 305 | A § 2, § 5.2, § 5.3, § 5.4, § 7 ; S § 1, § 4.3, § 4.5, § 5 | Sy |
| 309 | Synchronisation, téléphone : file IndexedDB, envoi par paquets, renvoi, correction de l'ELO, effacement par Safari | 104, 106, 201, 213, 303, 307, 308 | A § 2, § 5.2, § 5.3 ; B § 10 quater (1, 4, 6) ; S § 5 ; D | Sy |
| 310 | Progression officielle et état de l'interne (Progression, étoiles, restauration) | 308, 309 | A § 5.1, § 5.3 ; S § 4.2, § 4.3, § 5 ; B § 5 | Sy |
| 311 | Signalement d'erreur (par la file) | 309 | B § 8 ; A § 5.3 ; S § 3.11 | Sy |
| 312 | Arrivée d'un interne : notice, consentement, pseudo, classement — hors plan § 5 | 303 | S § 4.1 ; B § 4 (classement), § 10 (cadre réglementaire) | — |
| 313 | Pré-test et post-test corrigés par le serveur | 308, 312 | B § 8 (P7) ; A § 5.2, § 6, § 8 (6) ; S § 3.2, § 4.1, § 5 | Sy |
| 314 | Export des résultats | 313 | B § 10 (C9) ; S § 4, § 5 | — |
| 315 | Mode test : rédaction, suppression, suggestion ; écriture de contenu et Historique | 213, 306 | B § 10 quinquies ; A § 5.6 ; S § 3.4, § 3.11, § 3.12, § 3.13 | F |
| 316 | Mode test : corriger la réponse (« touche N questions »), valider par champ | 315 | B § 10 quinquies ; A § 5.6 ; S § 3.5, § 3.9, § 3.12 | F |
| 317 | Sauvegardes automatiques | 301 | A § 6 ; B § 10 quater (7) | — |
| 318 | Test de charge | 310 | A § 7 ; P § 4 | — |
| 319 | Recette sur iPhone et Android | 318 | P § 4, § 8 | — |

## Phase 4 — ELO et modes

| N° | Titre | Dépend de | Sections à lire | Tests |
|---|---|---|---|---|
| 401 | Moteur ELO, fonctions pures (**spec écrite**) | 102, 301 | B § 4 ; A § 5.4 ; S § 3.4, § 3.13, § 4.3, § 4.4, § 5 | E |
| 402 | ELO officiel à la synchronisation (Scores, Etalonnage, Suivi) et estimation sur le téléphone (**spec écrite**) | 308, 309, 401 | A § 5.3, § 5.4 ; S § 4.3, § 4.4, § 4.5 ; B § 4 | E, Sy |
| 403 | Recalcul complet de l'ELO par tranches, écran Admin (**spec écrite**) | 213, 402 | A § 5.4 ; S § 4.3, § 4.4, § 4.5, § 5 ; D | E |
| 404 | Écran Modes et mode classé | 205, 402 | B § 3, § 4 ; D | — |
| 405 | Entraînement | 404 | B § 3, § 8 (carnet d'erreurs) | — |
| 406 | Leitner, carnet d'erreurs, bactérie du jour | 405 | B § 8 (P2, P8) ; S § 4.5 | — |
| 407 | Sprint | 404 | B § 3 | — |
| 408 | Survie | 407 | B § 3, § 9 (G10) | — |
| 409 | Classement | 402 | B § 4 (classement) ; A § 5.4 ; S § 4.1, § 4.3 | — |
| 410 | Contamination | 212, 310 | B § 5, § 6 ; S § 4.2 | — |

Pour les lots 401 à 403, le tableau des modes du briefing § 3 et le § 4 sont remplacés par `lot-401.md` (point signalé 40).

## Phase 5 — Administration

| N° | Titre | Dépend de | Sections à lire | Tests |
|---|---|---|---|---|
| 501 | Espace Admin : socle et questions | 315 | B § 10 bis ; A § 5.6 ; S § 3.4, § 3.12 | F |
| 502 | Admin : niveaux et composition | 501 | B § 10 bis ; S § 3.2, § 3.3, § 3.6 | — |
| 503 | Admin : validation, signalements et suggestions | 311, 501 | B § 10 bis ; S § 2, § 3.9, § 3.11 | F |
| 504 | Admin : mondes, interrupteurs, droits | 501 | B § 10 bis ; S § 3.1, § 3.13, § 4.1 | F |
| 505 | Import annuel : préparer et comparer | 302, 305, 306, 501 | A § 5.5 ; B § 10 bis ; S § 2, § 3.4, § 3.5, § 3.7 ; D | I |
| 506 | Import annuel : conflits et appliquer | 315, 505 | A § 5.5 ; B § 10 bis ; S § 2, § 3.4, § 3.12, § 3.13 ; D | I, F |
| 507 | Tableau de bord personnel | 403 | B § 10 ter ; S § 4, § 5 | — |
| 508 | Tableaux de bord admin collectifs | 507 | B § 10 ter | — |
| 509 | Tableau de bord admin individuel | 508 | B § 10 bis (rôles), § 10 ter | — |

## Phase 6 — Mécaniques avancées (une par lot)

Sections à lire pour chaque lot : B § 5 bis et le paragraphe de la mécanique au § 7 ; S § 3.2, § 3.5 ; D. Aucun domaine de tests obligatoire.

| N° | Titre | Dépend de |
|---|---|---|
| 601 | Intrus | 205, 207 |
| 602 | Vrai/faux éclair (J16) | 204, 207 |
| 603 | Arbre de classification (J6 étendu) | 206, 207 |
| 604 | Lis l'antibiogramme (J4) | 205, 207 |
| 605 | Relier (J5 ; test et cible) | 206, 207 |
| 606 | Signalement (J10) | 205, 207 |
| 607 | Spectre (J15) | 206, 207 |
| 608 | Désescalade (J8) | 205, 207 |
| 609 | Hémoc positive (J7) | 205, 207 |
| 610 | Étiquettes et réponses multiples à score partiel | 206, 207 |
| 611 | Construis l'antibiogramme (J17 ; nouvelle mécanique, `Mécanique` = `antibiogramme`, nom à confirmer ; **cadrage** : `cadrage-lot-611.md`, ajouté le 17 novembre) | 207, 501, 604, 610 |

Le contenu des mondes 3 à 12 est le chantier de l'auteur, pas un lot de code. Le lot 611 (ajouté le 17 novembre) a un cadrage, pas encore de spec : elle s'écrit quand les specs 204, 205, 207, 501, 604 et 610 existent. « Naturelle ou acquise », « tri par mécanisme » et « tri germes/pathologie » semblent couverts par le swipe (204) et le tri (206) : à vérifier en écrivant leur spec.

## Phase 7 — Social

Sections à lire pour chaque lot : B § 9 ; S § 6 (onglets de la phase 7, à définir dans la spec). Lot 706 : domaine de tests **Sy** (ouverture du mode « duel » dans la synchronisation).

| N° | Titre | Dépend de | Sections en plus |
|---|---|---|---|
| 701 | Badges | 310 | — |
| 702 | Série de connexion (G4) — hors plan § 5 | 310 | — |
| 703 | Cartes à collectionner | 701 | — |
| 704 | Échange de cartes | 703 | — |
| 705 | Équipes Bleus/Oranges | 310 | S § 4.1 |
| 706 | Duel | 308, 309 | B § 3 ; A § 5.2 |
| 707 | Partage du score | 207 | — |
| 708 | Tuile Carnet Réa | 310 | B § 10 (C2) ; A § 3, § 4 |
| 709 | Attestation | 313 | B § 9 (G13) |

## Contrats déjà fixés par les specs écrites

Les specs 101, 102, 103, 104, 107, 108, 201, 208, 213, 301, 302, 305, 306, 308, 309, 401, 402, 403, 505 et 506 ont été écrites avant celles d'autres lots. Les specs de ces lots doivent fournir ce qui suit. Ce que les lots 301 et 302 fournissent aux lots 305, 306, 308 et 309, ce que les lots 201 et 208 fournissent aux lots 208 et 213, ce que les lots 305, 306 et 505 fournissent aux lots 505 et 506, ce que les lots 401 et 402 fournissent aux lots 402 et 403, et ce que les lots 102 et 104 fournissent au lot 107, est dans leurs propres specs.

| Lot | Ce qu'il doit fournir ou respecter | Détail |
|---|---|---|
| 101 | Une arborescence où les tests Node peuvent importer les modules ES du client et charger en CommonJS les fichiers du serveur. Les specs utilisent les préfixes indicatifs `client/`, `serveur/` et `tests/`. **Spec écrite** : racine en modules ES, `createRequire` pour le serveur, `tests/navigateur/` pour les pages de vérification. | `lot-301.md` § 4, § 6.2 ; `lot-101.md` § 6.3 |
| 101 | **Deux fichiers du logo**, copiés tels quels : `client/images/logo-ios.png` et `client/images/logo-android.png` (PNG 1024 × 1024, fond `#FFE9B0`). | `lot-101.md` § 6.7 |
| 102 | **La forme du paquet de contenu est celle de la spec 306** : lignes filtrées, noms de colonnes du schéma, toutes les valeurs en texte, section `reglages`. Le jeu de données fictif a cette forme. **Spec écrite** : `lot-102.md` § 6.1 à § 6.12. | `lot-306.md` § 6.2 |
| 102 | **Une section `reglages` dans le paquet** (clé → valeur, en texte), avec au moins `etoiles.seuil_1`, `etoiles.seuil_2`, `etoiles.seuil_3`. La colonne `Réglages` de chaque niveau au format JSON de la spec 201. La colonne `Mécanique` parmi `swipe`, `qcm`, `tri`. | `lot-201.md` § 4, § 6.3 |
| 102 | **Les sept clés ELO dans `reglages`**, avec des valeurs fictives au format de la spec 401 ; chaque question avec un `Palier` connu de `elo.paliers`, et un `Plancher` vide ou connu de `elo.planchers` (**un nom, jamais un nombre**). | `lot-401.md` § 4, § 6.2 |
| 102 | Au moins deux mondes, chacun avec plusieurs niveaux normaux et un boss dont la réserve dépasse `Questions du boss` ; les trois colonnes du boss remplies par des entiers. | `lot-208.md` § 4 |
| 102 | **Deux paquets fictifs** : « internes », et « admin » avec un monde invisible, des questions non validées et la section `etatDesQuestions`. | `lot-213.md` § 4 |
| 102, 306 | **`COLONNES_RESERVEES` est écrite deux fois** : `client/contenu/forme-du-paquet.js` (contrôle de forme) et le filtre du serveur. Si l'une change, l'autre suit. | `lot-102.md` § 6.1 ; `lot-306.md` § 6.3 |
| 103 | **Spec écrite.** `client/demarrage.js`, où chaque lot branche son démarrage sans l'attendre ; `definirFournisseurDuLogo`, `logoActive` ; `estInstallee`, `moyenDInstallation`, `etatDeLInstallation`, `lancerInstallationNative`, `doitInviterApresPartie`, `TEXTES_INSTALLATION` ; publication sur GitHub Pages par avance rapide de `main`, avec l'accord de l'auteur. | `lot-103.md` § 6.4 à § 6.9 |
| 103 | ~~Spec à amender~~ **Amendée le 17 novembre** (point 73) : icône de l'iPhone et écran d'ouverture tirés de `logo-ios.png`, icônes du manifeste de `logo-android.png` (`purpose` = `any maskable`) ; écran d'ouverture et `background_color` sur le fond crème `#FFE9B0`. | `lot-101.md` § 6.7 ; `lot-103.md` décision 5, § 6.2 |
| 103 et suivants | **Tout lot qui modifie un fichier servi au téléphone augmente `VERSION_CLIENT` et `VERSION_DE_LA_COQUILLE` (`sw.js`) de 1, et ajoute ses fichiers à `FICHIERS_DE_LA_COQUILLE`.** Les tests du lot 103 le vérifient (égalité des versions, liste complète). | `lot-103.md` § 6.3 |
| 104 | Une enveloppe IndexedDB avec migrations : un lot peut ajouter des magasins et des index ; transactions en écriture sur plusieurs magasins ; clés composées. **Spec écrite** : migrations déclaratives, clés en ligne, requêtes par préfixe de clé composée, base en mémoire de même interface pour les tests. | `lot-309.md` § 4 ; `lot-208.md` § 4 ; `lot-104.md` § 6.3 à § 6.8 |
| 104 et suivants | Règle 14 ci-dessus. Les tests d'un lot qui stocke utilisent `creerBaseEnMemoire` (`tests/`), jamais importée par `client/`. Un échec d'ouverture de la base n'arrête pas le jeu : le lot garde ses données en mémoire. | `lot-104.md` § 6.7, § 6.8 |
| 106 | Un écran Profil pouvant recevoir une ligne d'information (deux lignes : réponses en attente, ELO). Une navigation du bas pouvant recevoir une entrée « Admin ». **La ligne `Installer l'appli sur l'écran d'accueil`** tant que l'appli n'est pas installée et qu'un moyen d'installer existe ; un appui ouvre la carte d'invitation. | `lot-309.md` § 4 ; `lot-213.md` § 4 ; `lot-402.md` § 6.10 |
| 107 | Appeler `definirFournisseurDuLogo` avec la clé `accueil.logo` du paquet « internes » rangé (fait dans `lot-107.md` § 6.5). |
| 107 | **Spec écrite.** `contenuDuJeu()` : `lirePaquet(type)` (gelé), `versionContenuLocale(type)` (`null` sans paquet), `charger(type)`, événement `contenu-change`. Seul le paquet « internes » est rangé dans IndexedDB. La source du contenu répond comme l'action `contenu` du serveur. | `lot-107.md` § 6.3, § 6.5 |
| 107 | **Amendée le 23 novembre** (point 77) : le chargeur écoute `base-perimee` (lot 104) et propose de recharger la page par le dialogue de confirmation du design system § 9.11, jamais pendant une partie (`definirGardeDeRechargement`, `propositionDeRechargement()`). | `lot-107.md` choix 7, § 6.6 |
| 201 | Un événement à chaque réponse et un événement de fin de partie, auxquels un autre module peut s'abonner sans que le jeu attende. Identifiant de partie : `p` suivi de 9 caractères `[a-z0-9]`. **Spec écrite : `lot-201.md` § 6.6 à § 6.8.** | `lot-309.md` § 4 |
| 201, 308, 309 | ~~Amendement à faire avant de coder ces lots~~ **Fait le 16 novembre** : champ `reponsesProposees` (entier de 2 à 100, nombre de réponses proposées à l'interne : directions du swipe, choix du QCM, cases du tri) dans l'événement de réponse (12 champs), l'enregistrement de la file, l'élément du message et le journal (**colonne `Réponses proposées`, seizième**, après `Version du contenu`). La mécanique le passe dans la saisie ; le moteur de niveaux le contrôle avant d'émettre (`reponses_proposees_invalides`), le serveur le contrôle comme les autres champs (`champ_invalide`), le téléphone le recopie sans le contrôler. Aucune valeur par défaut nulle part. Points signalés 42 et 55. | `lot-201.md` § 6.6, § 6.7 ; `lot-308.md` § 6.2, § 6.4 ; `lot-309.md` § 6.2 |
| 201 | **La condition 4 du schéma § 3.5** (valeur sans correspondance dans le niveau) s'applique sur le téléphone : le serveur ne la filtre pas. Le paquet donne `compositionPrevue`. **Tranché : `lot-201.md` § 6.4, § 6.5.** | `lot-306.md` § 6.2 |
| 201 | Le test 44 doit trouver **zéro** question écartée dans le paquet « internes » fictif ; le paquet « admin » fictif en donne une (`Q-000017` dans `NIV-0008`, `valeur_sans_correspondance`). | `lot-102.md` § 6.13 |
| 201, 306 | **La règle des seuils d'étoiles est écrite deux fois** : `lireSeuilsEtoiles` sur le téléphone, `verifierSeuilsEtoiles` sur le serveur. Si l'une des deux specs la change, l'autre suit. | `lot-201.md` § 6.3 ; `lot-306.md` § 6.4 |
| 201, 308, 401 | **Les bornes du nombre de réponses proposées sont écrites trois fois** : `REPONSES_PROPOSEES_MIN` et `REPONSES_PROPOSEES_MAX` sur le téléphone (2 et 100), `MIN_REPONSES_PROPOSEES` et `MAX_REPONSES_PROPOSEES` sur le serveur (2 et 100, noms différents à cause de la règle 11), `REPONSES_PROPOSEES_MIN` dans le moteur ELO (2). Si l'une change, les autres suivent. | `lot-201.md` § 6.2 ; `lot-308.md` § 6.6 ; `lot-401.md` § 6.2 |
| 201, 202 | « Une fonction rend l'index du paquet « internes » en cours » : le lot 107 ne construit pas d'index. Le lot qui écrit `indexerPaquet` (201) ou la carte (202) fournit l'index, calculé sur `contenuDuJeu().lirePaquet('internes')` et recalculé à chaque `contenu-change`. | `lot-107.md` § 6.5 |
| 202 | La carte se dessine à partir d'un état qu'une fonction lui donne (forme : `lot-208.md` § 6.4) et se redessine sur un événement. Une fonction rend l'index du paquet « internes » en cours. Les clés `Milieu` du jeu fictif sont celles du design system § 3.8 (`sang`, `bcp`, `chocolat`, `neutre` ; spec 102 amendée le 17 novembre). La carte affiche un monde maîtrisé d'après le champ `maitrise` de l'état (`lot-208.md` § 6.4, règle 8 bis). | `lot-208.md` § 4 ; `lot-213.md` § 4 ; `lot-402.md` § 6.9 ; `lot-102.md` § 6.6 |
| 203 | La fiche annonce « Version simplifiée » d'après le booléen `simplifie` de `preparerNiveau`, sans jamais dire quelles questions le sont. Elle peut recevoir un bloc de texte secondaire. | `lot-201.md` § 6.5 ; `lot-213.md` § 4 |
| 204, 205, 206 | Une partie n'avance que par `appliquerReponse` (et `appliquerReTest`). Chaque mécanique lit ses propres clés dans `Réglages` (directions, chrono, vies) sans toucher à `correspondances`. L'écran lit ses textes dans le paquet, par l'`ID` : la question préparée n'en porte pas. La mécanique passe une **saisie** `{ reponse, temps, reponsesProposees }` à `appliquerReponse(etat, saisie, emetteur)` et `appliquerReTest(etat, idQuestion, saisie, emetteur)`. **Elle y met le nombre de réponses qu'elle a réellement montrées** (entier de 2 à 100) ; le moteur ne le calcule pas. Un test de chaque mécanique vérifie que le nombre passé est le nombre affiché (point signalé 56). | `lot-201.md` § 6.3, § 6.4, § 6.6, § 6.8 ; `lot-401.md` |
| 204, 205, 206 | Chaque mécanique ajoute ses clés de `Réglages` au jeu fictif du lot 102 : **elle ajoute, sans changer le sens ni l'identifiant d'une ligne existante**, et augmente `versionContenu` et `contenu.version` de 1. | `lot-102.md` § 7, choix 7 et 9 |
| 204, 207 | **Garde du dialogue de rechargement** (point 77) : le lot qui crée les parties règle `definirGardeDeRechargement(() => !partieEnCours)` ; le lot 207 appelle `propositionDeRechargement().reprendre()` quand l'interne quitte l'écran de fin de niveau, re-tests compris. Sans cela, le dialogue peut s'afficher en pleine partie. | `lot-107.md` § 6.5, § 6.6 |
| 204, 207 | **Un seul endroit du code crée une partie** (`creerPartie`). Les lots 208 et 213 s'y branchent. | `lot-208.md` § 6.6 ; `lot-213.md` § 6.6 |
| 207 | Une place, sur l'écran de fin de niveau, pour la carte d'invitation à installer (textes de `TEXTES_INSTALLATION` : titre, texte, consignes de l'iPhone ou bouton `Installer`, et `Plus tard`), et **une fonction qui l'affiche**, que le lot 208 appelle (`demanderInvitation`, `lot-208.md` § 6.7). | `lot-103.md` § 6.6 |
| 207 | Le re-test passe par `questionsARetester` et `appliquerReTest` ; il ne change ni le score ni les étoiles. La fin de partie est émise avant les re-tests. Le re-test passe aussi une saisie complète, avec `reponsesProposees`. | `lot-201.md` § 6.6, § 6.7 |
| 207 | `Sources` et `Vocabulaire` n'ont ni `Statut` ni `Champs validés` dans le fichier Contenu, et ne sont dans aucun paquet (point signalé 12, laissé au lot 207 par la spec 102). | `lot-305.md` § 6.3 ; `lot-102.md`, choix 8 |
| 208 | ~~Spec à amender~~ **Amendée le 17 novembre** : après chaque fin de partie enregistrée (hors mode test), si `doitInviterApresPartie(somme des tentatives des lignes du compte, installee)` est vrai et que `moyen` n'est pas `aucun` (`etatDeLInstallation()`), appeler `demanderInvitation()` du lot 207. Rien d'autre n'est stocké. | `lot-103.md` § 6.6, décision 4 ; `lot-208.md` § 6.7 |
| 208 | Critère 5.7 **reformulé le 17 novembre** : pour simuler un monde devenu invisible, retirer sa ligne de `mondes` dans une copie locale du paquet « internes », déjà filtré (point signalé 62). | `lot-102.md` § 9 ; `lot-208.md` § 9 |
| 209 | L'état d'une partie est un objet JSON simple, à sauvegarder tel quel. **Un état dont `modeTest` est vrai n'est jamais sauvegardé.** | `lot-201.md` § 6.6 ; `lot-213.md` § 6.7 |
| 210, 212 | Règle 9 ci-dessus : rien n'est débloqué ni animé après une partie du mode test. | `lot-213.md` § 6.7 |
| 211 | Faire entrer les niveaux de type `révélation` dans le chemin (dans les specs 201 et 208, ils ne sont pas jouables et sont sautés). Règle 9 ci-dessus. | `lot-201.md` § 6.5 ; `lot-208.md` § 6.3 |
| 213 | Le champ `modeTest: true` sur chaque événement de réponse du mode test. Le mode test charge le paquet « admin » par une demande explicite. **Spec écrite : `lot-213.md` § 6.1, § 6.6.** Le chargeur provisoire utilise `paquetAdminFictif()` du lot 102. | `lot-309.md` § 4 ; `lot-306.md` § 6.1 ; `lot-102.md` § 6.12 |
| 213, 301 | ~~Specs à amender~~ **Amendées le 17 novembre** : le chemin public est `/microswipe/` (`CHEMIN_PUBLIC` du lot 213, `CHEMIN_PRODUCTION` du lot 301). L'origine reste `https://chugicu.github.io`. | `lot-103.md` décision 1 |
| 214, 502 | Écrire la colonne `Réglages` des niveaux au format JSON de la spec 201. (Le lot 305 ne crée aucun niveau : ce contrat ne le concerne plus.) | `lot-201.md` § 6.3 |
| 303 | La session courante, le compte courant, l'événement de connexion, le signal de session invalide. | `lot-309.md` § 4 |
| 303 | Appeler `definirFournisseurDeSession` du module d'appel. | `lot-301.md` § 6.12 |
| 303 | Faire passer le serveur de test du fichier de comptes fictif à la vraie Sheet de Carnet Réa, partagée en « Lecteur » avec le compte Google dédié ; supprimer alors les propriétés `JETON_ESSAI_*`. | `lot-302.md` § 2, § 6.7 |
| 303 | Maintenir la session par un appel au serveur de Carnet Réa : Microbio ne la prolonge pas. À décider dans sa spec : ces appels passent-ils aussi par un module unique à adresse configurable. | `lot-302.md` § 6.4 |
| 303 | Appeler `definirFournisseurDeDroits` avec les droits de l'action `profil`, à chaque connexion ; supprimer le fournisseur provisoire. Remplacer `COMPTE_LOCAL` par le compte connecté et décider du sort des lignes de progression `local`. | `lot-213.md` § 6.1, § 6.2 ; `lot-208.md` § 6.2 |
| 305 | **Spec écrite.** Elle fournit, dans l'environnement de test, un fichier Contenu avec les douze onglets de faits, `Mondes`, `Niveaux`, `Composition`, `Questions`, `Notions`, et dans `Reglages` les clés `etoiles.seuil_1` à `etoiles.seuil_3`, **vides tant que l'auteur ne les a pas saisies**. Les sept clés ELO sont créées vides par `installerReglagesElo` (lot 402). | `lot-305.md` § 6.2, § 6.3 ; `lot-306.md` § 4 ; `lot-308.md` § 4 ; `lot-402.md` § 6.7 |
| 305 | **La conversion réelle est lancée par l'auteur**, après le lot 303 et avant le lot 306 : import du tableur dans Google Sheets, `analyserTableur`, complément de `ID espèce` et de `Source`, `convertirTableur`, saisie des seuils d'étoiles. | `lot-305.md` § 6.11 ; `lot-302.md` § 6.7 |
| 306 | Tant que les seuils d'étoiles ne sont pas saisis, l'action `contenu` répond `reglage_invalide` sur le fichier Contenu réel de test. | `lot-306.md` § 6.4 ; `lot-305.md` § 9 |
| 307 | La version du contenu présente sur le téléphone, et une fonction pour demander le rechargement du contenu. **Le lot 107 fournit déjà `versionContenuLocale()` et `charger()`** ; le lot 307 ajoute le choix du moment (jamais pendant une partie). | `lot-309.md` § 4 ; `lot-107.md` § 6.5 |
| 307 | Demander le contenu par l'action `contenu` (`paquet`, `versionLocale`). Un admin garde deux paquets, chacun avec sa version ; le jeu normal n'utilise que le paquet « internes ». **Remplacer `sourceFictive` du lot 107 par l'appel au serveur, qui répond sous la même forme, et supprimer `source-fictive.js`.** Décider du rangement du paquet « admin » (le lot 107 ne range que « internes »). | `lot-306.md` § 6.1 ; `lot-107.md` § 6.4, § 6.5 |
| 307 | **Quand le serveur refuse de construire les paquets** (`reglage_invalide`, `paquet_refuse`, `contenu_incomplet`…), le téléphone garde le contenu qu'il a déjà et continue de jouer. Déjà fait par le lot 107 (`deciderApresReponse`, motif `refus`). | `lot-306.md` § 7, § 9 ; `lot-107.md` § 6.2 |
| 307 | Appeler `definirChargeurDuPaquetAdmin` ; effacer le paquet « admin » du téléphone quand le compte n'a plus le droit « contenu ». | `lot-213.md` § 6.1, § 9 |
| 307 | L'index du paquet « internes » en cours, avec `questionsParId` et `reglages`, lisible par l'estimateur d'ELO à chaque appel. | `lot-402.md` § 4, § 6.9 |
| 309 | Les réponses de re-test sont émises après la fin de partie : elles partent au déclencheur suivant. | `lot-201.md` § 6.7 |
| 309 | `versionContenuLocale()` vaut `null` tant qu'aucun paquet n'est là ; le serveur refuse un élément dont `versionContenu` n'est pas un entier (point signalé 64). | `lot-107.md` § 7 ; `lot-308.md` § 6.2 |
| 310 | Remplacer le contenu du magasin `progression` par les lignes du serveur, sans changer les règles du chemin. Le serveur applique les mêmes règles : seuils de `Reglages` (`verifierSeuilsEtoiles` est réutilisable), pas d'étoiles au boss, boss réussi à `Seuil du boss`. | `lot-208.md` § 6.8 ; `lot-306.md` § 6.4 |
| 310 | **Le recalcul de `Progression` et des étoiles depuis le journal** (règle d'architecture 6) est à sa charge, ou à celle d'un lot qu'il crée : le lot 403 ne recalcule que l'ELO. `lireIntervalle` et `listerNomsDeProprietes` (lot 403) sont réutilisables. Son traitement dérivé n'écrit jamais les colonnes ELO de `Scores`, et le traitement `elo` n'écrit jamais `Étoiles` ni `Records`. | `lot-403.md` décision 1, § 9 |
| 312 | Une ligne `Profils` peut déjà exister pour un compte, créée par l'attribution de droits : la compléter, ne pas la doubler. | `lot-302.md` § 6.8 |
| 313 | Ouvrir les niveaux de type `test` dans les paquets, et trancher le point signalé 8. | `lot-306.md` § 6.3 |
| 313 | **L'action du pré-test exécute les traitements de `listerTraitementsDerives()` après avoir écrit ses lignes au journal**, comme la synchronisation, avec `mode` = `pré-test` ; c'est ce qui fixe l'ELO de départ. Le post-test (`post-test`) ne fait bouger aucun ELO. Les deux modes ont déjà leur ligne dans `EFFETS_ELO_PAR_MODE`. Chaque ligne écrite au journal par le pré-test et le post-test porte `Réponses proposées` (16 colonnes). | `lot-401.md` décision 2, § 6.3 ; `lot-402.md` § 4 ; `lot-308.md` § 6.4 |
| 315 | **L'onglet `Historique`** du fichier Contenu, avec l'en-tête exact du schéma § 3.12, au format texte, et `assurerOngletHistorique(idFichier)` qui le crée s'il manque (le lot 305 ne le crée pas). | `lot-506.md` § 4 |
| 315 | **`construireLigneDHistorique(champs)`** : fonction pure qui rend les neuf cellules d'une ligne, dans l'ordre de l'en-tête, à partir de `{ date, auteur, canal, onglet, ligne, colonne, avant, apres, motif }`. `auteur` est un `ID compte`, `ligne` l'identifiant de la ligne modifiée ; les canaux sont `admin`, `mode test` et `import`. | `lot-506.md` § 4, § 6.3 |
| 315 | **Le contrôle commun `exigerEcritureDeContenuPermise()`** : il lève `import_en_cours` quand la propriété du script `IMPORT_ETAT` vaut `en_application`. Règle 11 ci-dessus. Une façon réutilisable d'augmenter `contenu.version` sous le verrou (`installerReglagesElo` du lot 402 s'en sert). | `lot-506.md` § 4, § 6.5 ; `lot-402.md` § 6.7 |
| 315, 316, 501 à 504 | **Chaque action qui écrit du contenu appelle ce contrôle sous le verrou, avant d'écrire.** | `lot-506.md` § 4 |
| 315, 316, 501 à 506 | Règles 5 et 7 ci-dessus : `exigerDroit` à chaque action, et `contenu.version` augmentée à chaque écriture. | `lot-302.md` § 6.5 ; `lot-306.md` § 9 |
| 315, 316, 501 | Compléter l'écran Admin et la bannière du mode test, sans changer la règle 9. | `lot-213.md` § 6.4 |
| 315, 316, 501 à 504 | Une question **créée** hors de l'import reçoit `Origine` = `admin` ou `mode test` : c'est ce qui la protège d'un retrait par l'import. Une question modifiée garde son `Origine`. Toute écriture met à jour `Modifié le` et `Modifié par`. | `lot-505.md` § 6.4 |
| 316 | **Le bouton « Valider » inscrit dans `Champs validés` toutes les colonnes que la carte a montrées** (libellé, valeur testée, source, page), pas seulement le champ testé : seules ces colonnes partent chez les internes. | `lot-306.md`, décision 1 |
| 317 | L'import fait sa propre sauvegarde du fichier Contenu avant d'appliquer (`copierFichier`). Les fichiers de sauvegarde, de plan et de comparaison de l'import, et le fichier d'état du recalcul de l'ELO, sont dans le dossier des données : les sauvegardes automatiques n'ont pas à les supprimer. | `lot-506.md` § 6.5, § 6.7 ; `lot-403.md` § 6.7 |
| 401, 402, 504 | Règle 10 ci-dessus : aucune valeur qui doit rester sur le serveur dans `Reglages`. Les sept clés ELO y sont, et partent sur les téléphones (l'estimateur s'en sert) ; l'empreinte et la note « ELO à recalculer » sont dans les propriétés du script. | `lot-306.md` § 6.5 ; `lot-402.md` § 6.5 |
| 404 | Réutiliser `texteElo` et `lireElo()` pour afficher l'ELO. Choisir les questions du classé (« viser 70 à 75 % de réussite », briefing § 4), en servant d'abord celles que l'interne n'a jamais vues. Décider si le téléphone reçoit l'ELO courant des questions (aujourd'hui, l'estimation prend l'ELO de départ du palier). | `lot-401.md` § 2 ; `lot-402.md` § 6.9, § 6.10 |
| 404 à 408, 706 | Règle 12 ci-dessus : un mode nouveau, ou un nom de mode écrit autrement, demande sa ligne dans `EFFETS_ELO_PAR_MODE`. Chaque mode passe `reponsesProposees` avec chaque réponse, même s'il n'a aucun effet sur l'ELO : le journal a une seule forme de ligne. | `lot-401.md` § 6.3 ; `lot-308.md` § 6.2 |
| 404 à 408 | Ne jamais servir une question simplifiée hors campagne (`estSimplifiee`). Le lot 404 tranche le point signalé 14 : les tables de correspondance sont rangées par `Onglet:Champ` dans les `Réglages` d'un niveau. | `lot-201.md` § 6.3, § 6.5 |
| 409 | Le classement lit `ELO` et `Provisoire` dans `Scores`. Une ligne dont `ELO` est vide n'a pas d'ELO (compte sans réponse comptée, ou vidé par le recalcul). | `lot-402.md` § 6.1 ; `lot-403.md` § 6.5 |
| 319 | Retirer la page de vérification du lot 108 (`client/verifications/`, ancre `#verifications-108`) avant l'ouverture aux internes. | `lot-108.md` § 6.1 |
| 501 | Un espace Admin qui peut recevoir une entrée et un écran de plus (« Import annuel »), et une façon commune d'afficher une erreur du serveur. | `lot-505.md` § 4, § 6.10 |
| 501 | **Lot 611** (ajouté le 17 novembre) : l'écran d'une question « Construis l'antibiogramme » permet de choisir les lignes d'`Antibiogrammes_types` posées (colonne `Lignes posées` de `Questions`, identifiants `ABL-…` séparés par des points-virgules ; vide = toutes les lignes candidates du profil), par les règles communes d'écriture de contenu ; quand la liste change, il applique l'exception de l'ELO (la question ne garde pas son ELO, détail dans la spec 611). | `cadrage-lot-611.md` § 2 |
| 501 | **Conserver l'entrée « Recalcul de l'ELO »** créée par le lot 403 dans l'écran Admin du lot 213. | `lot-403.md` § 6.9 |
| 502 | L'espace Admin édite `Réglages` en JSON, en conservant les clés qu'il ne connaît pas. | `lot-201.md` § 6.3 |
| 503 | Montrer à l'admin les questions dont un fait est archivé (« orphelines ») : l'import ne les modifie pas, elles cessent seulement d'être servies. | `lot-505.md` § 6.6 ; `lot-506.md` § 2 |
| 504 | L'interrupteur du logo à l'ouverture : clé `accueil.logo` de `Reglages`, `oui` ou `non` (seul `non` exact le coupe), avec la hausse de `contenu.version`. | `lot-103.md` § 6.4 |
| 504 | L'écran de gestion des droits, qui remplace la fonction lancée depuis l'éditeur. | `lot-302.md` § 6.8 |
| 504 | Un écran qui modifie `Reglages` augmente `contenu.version` (sinon les téléphones ne reçoivent pas la nouvelle valeur), contrôle les sept clés ELO par `lireReglagesElo` avant d'écrire, et invite à lancer le recalcul de l'ELO après un changement de l'une d'elles. | `lot-402.md` § 7 ; `lot-403.md` § 1 |
| 506 | `ecrireLignesEntieres` et `grouperEnBlocs` sont déjà dans le module de stockage (lot 402), avec la définition du `lot-506.md` § 6.7 : ne pas les récrire. | `lot-402.md` § 6.6 |
| 601 à 610 | Chaque mécanique ajoute sa ligne à `FORMES_PAR_MECANIQUE`, ou une nouvelle forme de réponse si « unique » et « multiple » ne suffisent pas (intrus). Elle donne aussi son nombre de réponses proposées, dans la saisie passée à `appliquerReponse` et `appliquerReTest`. | `lot-201.md` § 6.2, § 6.8 ; `lot-401.md` |
| 611 | La spec 611 décrit ce qu'elle change dans des lots déjà faits : filtre du serveur (lot 306 : une ligne posée qui n'est plus candidate ou n'appartient pas au profil → question non servie), import (lot 505, même contrôle), ELO (lots 401 et 403 : valeur de reprise, et réponses d'avant et d'après le changement de liste distinguées au recalcul), `FORMES_PAR_MECANIQUE` (forme « multiple », 3 réponses proposées par case), design system (trois couleurs de catégorie, accord de l'auteur). | `cadrage-lot-611.md` § 2 à § 6 |
| 604 | Faire reconnaître par le filtre une question qui pointe vers un profil entier (aujourd'hui exclue du paquet « internes »). L'import, lui, ne revalide une question que si son `Fait` désigne une ligne : à revoir dans ce lot. | `lot-306.md` § 6.4 ; `lot-505.md` § 6.6 |
| Phase 0, lot 5 | Le script de simulation charge `serveur/logique/elo.js` seul, et chiffre les sept clés ELO. L'auteur les saisit dans `Reglages`, puis lance le recalcul. | `lot-401.md` § 6.8 |

Points de branchement laissés par 308 et 309 : traitements dérivés du serveur (lots 310, **402 (fait : traitement `elo`)**, 406), estimateur d'ELO du téléphone (**lot 402, fait**), type d'élément « signalement » (lot 311), modes « pré-test », « post-test » (lot 313) et « duel » (lot 706). Point de branchement laissé par 107 : la source du contenu (lot 307). Points de branchement laissés par 103 : le démarrage de chaque lot (`client/demarrage.js`), le fournisseur du logo (lot 107), l'affichage de l'invitation (lots 106, 207, 208).

## Points signalés, non tranchés

1. **Intrus et J16** : le briefing § 5 bis les utilise dans les mondes 1 et 2, le plan § 5 les range en phase 6. Les mondes 1 et 2 sortiraient de la phase 2 sans eux.
2. **Éléments du briefing absents du plan § 5** : notice et consentement (placés au lot 312), série de connexion G4 (lot 702), XP (G1), indice de certitude (P3), écologie locale (P10), réglages par profil (C6), sons. Les cinq derniers n'ont pas de lot. Conséquence dans la spec 201 : le champ `certitude` des événements est toujours vide, et la colonne `Certitude` de `Niveaux` n'est pas lue.
3. ~~**Synchronisation avant l'ELO**~~ **Tranché** : le lot 308 laisse un point de branchement, le lot 402 y branche l'ELO, le lot 403 rattrape les réponses reçues entre-temps (`lot-402.md`, `lot-403.md`).
4. ~~**Pré-test en phase 3, ELO en phase 4**~~ **Tranché le 16 novembre** : les réponses du pré-test passent par le moteur comme celles du classé ; l'action du pré-test (lot 313) exécute les traitements dérivés (`lot-401.md` décision 2 ; contrat du lot 313 ci-dessus).
5. ~~**Niveau partiellement validé** (schéma § 6) : à trancher dans la spec du lot 201.~~ **Tranché le 15 novembre** : un niveau se joue incomplet, fermé seulement sans aucune question jouable ; le boss est fermé si sa réserve est plus petite que `Questions du boss` (`lot-201.md` § 6.5, `lot-208.md` § 6.3).

Ajoutés à la conversation 2 :

6. **Mise en production du serveur** : aucun lot ne décrit la création du projet Apps Script de production, de ses fichiers et de son adresse. Les specs 301, 302, 305 et 306 ne concernent que l'environnement de test. **Élargi à la conversation 4** : aucun lot ne décrit non plus comment le fichier Contenu de production est créé à partir du fichier de test (la conversion du lot 305 refuse de tourner hors du test), ni qui y saisit les seuils d'étoiles. **Élargi à la conversation 5** : ni qui y crée et y saisit les sept clés ELO (`installerReglagesElo` ne tourne qu'en test).
7. **Version du serveur** : l'action `ping` la rend, mais aucun lot ne la fait contrôler par le téléphone (l'architecture § 4 reprend ce contrôle de Carnet Réa).
8. **Réponses du pré-test et du post-test** : l'architecture § 5.1 dit qu'elles ne sont pas dans le paquet ; or ces tests puisent dans la base commune (plan § 9, 8a), dont les réponses y sont. À trancher dans la spec du lot 313. En attendant, les niveaux de type `test` ne sont dans aucun paquet.
9. **Colonnes de validation** : le schéma § 2 les donne à « chaque ligne de contenu », mais § 3.1, § 3.2 et § 3.6 n'en listent pas pour `Mondes`, `Niveaux` et `Composition`. La spec 306 suit les § 3.x et refuse de construire un paquet si l'un de ces onglets porte une colonne `Statut` ; la spec 305 les crée sans.
10. **Suppression d'un compte** : l'architecture § 3, point 6, prévoit que Microbio supprime la ligne `Profils` d'un compte supprimé dans Carnet Réa. Aucun lot ne le fait.
11. **Session partagée et `localStorage`** : Carnet Réa range la session dans `localStorage`, sous une clé commune aux applis du domaine ; la règle d'architecture 13 interdit `localStorage` à Microbio. À trancher dans la spec du lot 303.
12. **Onglets `Sources` et `Vocabulaire`** : le schéma ne dit pas s'ils portent une validation. Ils ne sont dans aucun paquet ; or les explications affichent la version du référentiel. ~~À trancher dans la spec du lot 102 ou 207.~~ **La spec 102 le laisse au lot 207** (le jeu fictif n'a ni `Sources` ni `Vocabulaire`). La spec 305 les convertit sans colonnes de validation ni `Champs validés`.
13. **« Note du fait »** : le schéma § 3.4 dit qu'une explication vide vient de la note du fait, mais aucune colonne ne porte ce nom et elle diffère d'un onglet à l'autre. À trancher dans la spec du lot 207.
14. **Table de correspondance hors campagne** : elle est rangée dans les réglages d'un niveau ; le schéma ne dit pas laquelle s'applique à une question servie dans un mode sans niveau. À trancher dans la spec du lot 404.
15. **Durée de session par défaut** : si la ligne `securite` manque dans l'onglet Config de Carnet Réa, Microbio prend 14 jours, comme le serveur de Carnet Réa. La valeur de `Defaults.gs`, non lu, n'a pas été vérifiée.

Ajoutés à la conversation 3 :

16. ~~**Spec 306 à amender** : section `reglages` des deux paquets.~~ **Fait le 15 novembre** (`lot-306.md`, décisions 13 et 14). Décidé en plus : le serveur refuse de construire les paquets quand les seuils d'étoiles manquent ou sont illisibles.
17. **Deux sources pour la longueur d'un boss** : la colonne `Questions du boss` de `Mondes` (schéma § 3.1) et « nombre de questions tirées » dans les `Réglages` d'un niveau (schéma § 3.2). La spec 208 ne lit que `Mondes`.
18. **Valeurs de `Mécanique`** : le schéma § 3.2 et § 3.4 ne donne que `swipe` en exemple. La spec 201 utilise `swipe`, `qcm` et `tri` ; les lots de la phase 6 ajouteront les leurs.
19. **`Parcours` et `Ordre` des mondes** : le schéma ne dit pas si `Ordre` est global ou propre à chaque parcours. La spec 208 le prend global et ne lit pas `Parcours`. À revoir à l'arrivée de l'infectiologie.
20. ~~**« Monde maîtrisé »** : aucune définition.~~ **Défini le 16 novembre** (design system, décision 6) et **calculé par la spec 208, amendée le 17 novembre** : boss réussi et 3 étoiles à chaque niveau jouable du monde (`maitrise`, `lot-208.md` § 6.4, règle 8 bis). Le lot 212 l'anime.
21. **Point-virgule dans un leurre ou dans une réponse à plusieurs faits** : `Leurres` et la `Réponse propre` d'une question à plusieurs faits sont des listes séparées par des points-virgules ; un texte qui en contient un ne peut pas s'écrire. La réponse propre d'une question à réponse unique, elle, est prise en entier.
22. **Exemples du schéma § 3.1** : « 30 (provisoire) » et « 20 (à décider) » sont des annotations d'exemple. Dans la Sheet, ces cellules doivent contenir un entier seul ; sinon le boss est fermé (spec 208).
23. **Boss fermé pour une raison de données** (règles illisibles, réserve insuffisante, monde sans boss) : le monde suivant ne s'ouvre pas pour les internes. C'est la conséquence de la décision du 15 novembre ; l'anomalie n'est visible qu'en mode test, et aucun lot ne prévient l'admin autrement avant le lot 502.
24. **Mode test en phase 2** : le droit et le paquet « admin » viennent de fournisseurs provisoires (droit accordé hors de l'adresse publique). Ils disparaissent aux lots 303 et 307. Entre-temps, rien ne doit être publié sur `main` avec du contenu réel dans le paquet fictif.
25. ~~**Documents à aligner sur la conversation 3**~~ **Fait le 17 novembre** (conversation de remise à jour) :
    - schéma § 3.2 et § 3.3 : format JSON de `Réglages`, table par `Onglet:Champ` ; § 3.4 : valeurs de `Mécanique`, format de `Leurres` ; § 3.13 : clés `etoiles.seuil_1` à `etoiles.seuil_3` ; § 6 : niveau partiellement validé tranché ;
    - briefing § 5 : le boss s'ouvre par les étoiles **et** les niveaux réussis, ne donne pas d'étoiles, et est fermé si sa réserve est trop petite ; § 13 : point « niveau dont une partie des questions n'est pas validée » tranché ;
    - architecture § 5.1 : le paquet porte les réglages.

Ajoutés à la conversation 4 :

26. **Version du référentiel sur chaque ligne** : le schéma § 2 attend `Source` et `Page` partout ; dans le tableur v6, `Phenotypes` et `Regles` n'ont que `Pages CASFM`, `Especes` a deux colonnes de sources en texte libre et pas de `Page`, `Posologies_EUCAST` a `Emplacement`. Retenu le 15 novembre : la conversion n'écrit aucune source, signale « source absente », et l'auteur ajoute `Source` à `Phenotypes` et `Regles`. L'écart sur `Page` reste entier ; il retombe sur l'affichage des explications (lot 207).
27. **Pré-remplissage des questions de swipe** (briefing § 10 bis : « pré-remplies automatiquement à partir des faits, puis relues ») : aucun lot ne le porte. Le lot 305 crée `Questions` vide.
28. **Brancher une rubrique nouvelle demande du code** : le briefing § 10 bis dit qu'une rubrique inconnue est ignorée « jusqu'à ce qu'on la branche ». Brancher une colonne ou un onglet de faits, c'est modifier `PLAN_DE_CONVERSION` (lot 305) et le périmètre de l'import (lot 505) : aucun lot ne le prévoit, et aucun écran de l'espace Admin ne le permet. La règle d'architecture 1 ne promet que les mondes, niveaux, questions et réglages.
29. **Colonne renommée** : l'import la cite deux fois (absente de la copie, inconnue) et ne la compare pas ; rien ne renomme une colonne du fichier Contenu. Cas certain : `EUCAST v16.1 : libellé`, dont le nom porte un numéro de version.
30. **`copie.creee_le`** (schéma § 3.13) n'est pas écrite : l'état de l'import est dans les propriétés du script, pour que le lot 505 n'écrive rien dans le fichier Contenu et à cause de la règle 10.
31. **Deux règles de l'architecture § 5.5 se contredisaient** (« le statut vient de la copie » et « une question à réponse propre dont le fait change repasse à \"À valider\" »). **Tranché le 16 novembre** : la question repasse à « À valider » sauf si sa propre ligne est reprise de la copie (`lot-505.md` § 6.6, `lot-506.md` § 6.3).
32. **Limite de l'import** : une question ajoutée dans la copie ne peut pas pointer vers un fait ajouté par le même import, qui n'a pas encore d'identifiant. Rien ne le détecte ; la question ne serait simplement pas servie.
33. **Questions orphelines** : quand l'import archive un fait, les questions qui pointent vers lui ne sont pas modifiées ; elles cessent d'être servies. Aucun lot ne les montre à l'admin avant le lot 503.
34. **Annulation d'un import appliqué** : aucun lot. Une sauvegarde du fichier Contenu est faite avant l'application ; la restaurer serait une opération manuelle, hors des règles d'écriture de la production.
35. **Partage de la copie de travail** : elle appartient au compte Google dédié et n'est partagée avec personne ; l'auteur doit l'ouvrir avec ce compte.
36. **Année de `import AAAA`** : prise dans l'heure UTC du serveur, pas à l'heure de la Guadeloupe (écart possible la nuit du 31 décembre).
37. **Textes d'écran proposés, à confirmer un par un** : écran « Import annuel » (`lot-505.md` § 6.10, `lot-506.md` § 6.9).
38. **Dépendances corrigées dans ce fichier à la conversation 4** : 305 dépend aussi de 302 ; 505 dépend de 302, 305, 306 et 501 (et plus de 315) ; 506 dépend de 315 et 505.
39. ~~**Documents à aligner sur la conversation 4**~~ **Fait le 17 novembre** :
    - schéma § 2 : formats `VOC-01` et `ESP-001`, identifiants des lignes ajoutées par l'import ; § 3.7 : colonne `ID` de `Vocabulaire`, colonne `Source` de `Phenotypes` et `Regles`, colonnes des quatre onglets « repris mais non servis », troisième colonne calculée écartée (`Écart CASFM / EUCAST (formule)`), `Sources` et `Vocabulaire` sans `Champs validés` ; § 3.8 : `ID espèce` remplie par libellé exact, séparateur point-virgule ; § 3.10 : `Champs validés` de `Notions` ; § 3.13 : `copie.creee_le` retirée, seuils d'étoiles saisis par l'auteur ;
    - architecture § 5.5 : copie de référence et comparaison à trois états, périmètre de l'import, conflit de retrait, questions protégées par leur `Origine`, règle de la réponse propre, plan d'application et reprise ; § 5.1 : refus de construire les paquets sans seuils d'étoiles ;
    - briefing § 10 bis : mêmes points, et « nouvelles rubriques » (point 28).

Ajoutés à la conversation 5 :

40. **Un seul ELO, que la campagne ne fait pas bouger** (décidé le 16 novembre). Le briefing § 3 (« campagne : ELO caché, mis à jour »), § 4 (« ELO caché de la campagne », « un ou deux ELO ») et § 13, l'architecture § 7 et le schéma § 6 sont à aligner. Côté interne, seuls le classé et le pré-test comptent ; côté question, campagne, classé et entraînement étalonnent, **mais seulement par un interne sorti de sa période provisoire** (le briefing ne le disait que pour l'entraînement).
41. **Colonne `Plancher` d'une question** : elle contient un nom (valeur dans `elo.planchers`), plus un nombre. Le schéma § 3.4 est à aligner (« `Plancher` (ELO, vide = aucun) »).
42. **Nombre de réponses proposées** (décidé le 16 novembre : c = 1 / ce nombre). ~~Les specs 201, 308 et 309 sont à amender.~~ **Specs amendées le 16 novembre (conversation A)** : `lot-201.md` décision 7, `lot-308.md` décision 6, `lot-309.md` décision 6. ~~Reste : le schéma § 5~~ **Schéma § 5 aligné le 17 novembre** (16 colonnes, environ 4,8 millions de cellules par an, toujours sous le plafond), à aligner au lot 101 avec le point 54. Une ligne du journal sans cette valeur est sans effet sur l'ELO ; depuis l'amendement, le serveur n'en écrit plus aucune.
43. **Pré-test plus court que la période provisoire** : l'interne reste provisoire après le pré-test et n'étalonne rien en campagne tant qu'il n'a pas assez joué en classé. À regarder au lot 5 (durée de la période provisoire) et au lot 313 (longueur du pré-test).
44. **Aucun ELO avant le lot 5** : les sept clés restent vides tant que la simulation ne les a pas chiffrées ; le serveur ne calcule rien et note « ELO à recalculer ». Une fois les valeurs saisies, l'auteur lance le recalcul (lot 403).
45. **Limite connue du calcul au fil de l'eau** : une exécution tuée entre l'écriture d'`Etalonnage` et celle de `Suivi` fait compter deux fois un paquet. Rien ne le détecte ; seul le recalcul complet le répare (`lot-402.md` § 7).
46. **Estimation approchée sur le téléphone** : il prend pour chaque question l'ELO de départ de son palier, faute de connaître son ELO courant. La valeur officielle la remplace à chaque synchronisation. À revoir au lot 404.
47. **`Reglages` modifié à la main** : le serveur lit la nouvelle valeur tout de suite, les téléphones seulement après une hausse de `contenu.version`. Entre-temps l'estimation peut s'écarter. Le lot 504 doit augmenter la version.
48. **Recalcul de `Progression` depuis le journal** : aucun lot ne le décrit encore (le lot 403 ne fait que l'ELO). À la charge de la spec 310 (contrat ci-dessus).
49. **Bascule du recalcul sous le verrou** : pendant quelques secondes à quelques dizaines de secondes, les synchronisations reçoivent `occupe` et le téléphone les renvoie. Durée à mesurer au lot 403.
50. **Taille de l'état du recalcul** : la liste des questions vues de chaque interne est gardée dans un fichier texte entre deux tranches (estimation non vérifiée : quelques mégaoctets pour 150 internes et 2 000 questions). À mesurer au lot 403.
51. **Textes d'écran** : ceux de la ligne ELO de Profil et de l'écran « Recalcul de l'ELO » sont confirmés ; les messages d'erreur de cet écran (`lot-403.md` § 6.9, second tableau) restent à confirmer.
52. **Valeurs de `Mode` du journal** : `classé`, `entraînement`, `pré-test`, `post-test` portent un accent ou un tiret ; le moteur ELO les compare exactement. Toute autre graphie dans un lot futur n'aurait aucun effet sur l'ELO (règle 12).
53. **Dépendances corrigées à la conversation 5** : 401 dépend aussi de 301 (convention des fonctions pures) ; 403 dépend de 213 et 402, plus du lot 310.
54. ~~**Documents à aligner sur la conversation 5**~~ **Fait le 17 novembre** :
    - briefing § 3 (tableau des modes), § 4 (un ELO, campagne, pré-test, période provisoire, étalonnage, c, plancher), § 13 (« un ou deux ELO », articulation pré-test et ELO de départ : tranchés) ;
    - architecture § 5.3 et § 5.4 (traitement `elo`, recalcul par l'écran Admin), § 7 (« un ou deux ELO » : tranché) ;
    - schéma § 3.4 (`Plancher`), § 3.13 (sept clés ELO), § 4.3 et § 4.4 (lignes vidées par le recalcul), § 4.5 (clé `vues`), § 5 (`Réponses proposées`, seizième colonne, nombre de 2 à 100, après `Version du contenu`), § 6 (« un ou deux ELO » : tranché).

Ajoutés à la conversation A (16 novembre) :

55. ~~**Bornes de `reponsesProposees`, à confirmer**~~ **Confirmé par l'auteur le 16 novembre** : entier de 2 à 100. Le minimum vient de la formule (c ne peut pas dépasser 1/2) ; le maximum est une garde contre une valeur aberrante. Les bornes sont écrites trois fois (contrat « 201, 308, 401 » ci-dessus) : si l'une change, les autres suivent.
56. **Valeur donnée par la mécanique, sans recoupement** (constat accepté par l'auteur le 16 novembre) : ni le moteur de niveaux, ni le serveur, ni le moteur ELO ne comparent `reponsesProposees` aux leurres, aux directions ou aux cases réellement montrées. Une mécanique qui se trompe fausse c sans que rien le détecte. Chaque lot de mécanique (204 à 206, 404 à 408, 601 à 610) doit donc tester que le nombre passé est celui affiché. **Reste à trancher dans la spec 204** : un swipe dont la question n'est jouable que sur deux des directions affichées.
57. ~~**Signature du moteur de niveaux, à confirmer**~~ **Tranché par l'auteur le 16 novembre : objet de saisie.** La mécanique passe `{ reponse, temps, reponsesProposees }` : `repondre(etat, saisie)`, `repondreReTest(etat, idQuestion, saisie)`, `appliquerReponse(etat, saisie, emetteur)`, `appliquerReTest(etat, idQuestion, saisie, emetteur)`. Une saisie qui n'est pas un objet lève `saisie_mal_formee` ; un champ en trop est ignoré. La forme de l'événement de réponse ne change pas (`lot-201.md` décision 8, § 6.6).

Ajoutés à la conversation B (16 novembre) :

58. **Documents du dépôt préparés à l'avance** (choix 1 de la spec 101, **confirmé par l'auteur le 17 novembre**) : la conversation Opus de remise à jour (plan § 3, point 4) range dans le projet claude.ai, sous `depot/` du projet claude.ai, les versions sans contenu médical de `CLAUDE.md`, du briefing, de l'architecture, du schéma, du plan, du design system, de l'index et de chaque spec, renvois déjà écrits en `docs/…`. Le lot 101 les copie sans rien changer. Sans ce dossier, le lot 101 ne peut pas commencer.
59. **Licence du dépôt public** : aucune n'est prévue ; sans licence, le code reste « tous droits réservés ». À décider par l'auteur, sans urgence.
60. ~~**GitHub Pages** : aucun lot ne l'active.~~ **Tranché par l'auteur le 16 novembre** : activé au lot 103, sur `main`, par avance rapide depuis `dev` avec son accord ; données fictives seulement. Il publie aussi `docs/` et `tests/` (déjà publics dans le dépôt).
61. ~~**Specs écrites après le lot 101**, règle de copie à confirmer.~~ **Confirmé par l'auteur le 17 novembre** : une spec nouvelle est écrite sans contenu médical dès le départ et rangée dans `depot/specs/` du projet claude.ai ; le premier commit du lot qui l'utilise la copie telle quelle dans `docs/specs/`, avec l'index s'il a changé. Aucune spec n'est prise ailleurs que dans `depot/` du projet claude.ai. Règle notée dans `PROGRESS.md` (`lot-101.md` § 6.5).
62. **Critère 5.7 du lot 208** (« passer un monde intermédiaire à `Visible` = `non` ») : sans effet sur un paquet « internes » déjà filtré. Le lot 208 retire plutôt la ligne du monde dans une copie locale du paquet (`lot-102.md` § 9). **Reformulé le 17 novembre** (spec 208 amendée).
63. ~~**Clés `Milieu` fictives**~~ **Réglé le 17 novembre** : le jeu fictif prend les clés du design system § 3.8 (`sang`, `bcp`, `chocolat`, `neutre` ; spec 102 amendée).
64. **`versionContenuLocale()` vaut `null` sans paquet** : le serveur refuse un élément de synchronisation dont `versionContenu` n'est pas un entier (`lot-308.md` § 6.2). Aucune partie ne doit pouvoir se jouer sans contenu ; à vérifier au lot 309.
65. **Dépendance corrigée à la conversation B** : 107 dépend aussi de 103 (démarrage de l'appli).
66. **Le paquet n'a pas de numéro de format** (`lot-306.md` § 6.2) : un paquet rangé d'une forme ancienne est ignoré par `lireEnregistrement` (lot 107) et remplacé au chargement suivant. Si la spec 306 change la forme, `controlerFormeDuPaquet` (lot 102) suit.
67. ~~**Choix par défaut des specs 101, 102, 104 et 107**, listés en tête de chaque spec, à confirmer par l'auteur.~~ **Confirmés par l'auteur le 17 novembre**, un par un (27 choix), sans changement. (Les décisions des specs 103 et 108 avaient, elles, toutes fait l'objet d'une question.)
68. ~~**Nom MicroSwipe et adresse `/microswipe/`**~~ **Reporté le 17 novembre** dans le briefing, l'architecture, le plan et les specs 213 et 301. Rappel (décidé le 16 novembre) : à reporter dans le briefing (§ 1, identité), l'architecture (§ 2, schéma : `chugicu.github.io/microbio/`) et le plan, à la conversation de remise à jour ; specs 213 et 301 à amender (contrat ci-dessus). Les noms internes restent : base `microbio`, préfixe `microbio-`, « Application Microbio ».
69. **Mise à jour d'une appli jamais fermée** : elle n'est appliquée qu'à l'ouverture suivante (décision du 16 novembre) ; une appli installée que l'interne ne ferme jamais la reçoit quand le téléphone la ferme lui-même. À regarder à la recette (lot 319).
70. **La version publiée sur GitHub Pages est vue comme « production »** par `choisirEnvironnement` (lot 301) et par le droit provisoire du mode test (lot 213) : en phases 1 et 2, le mode test n'y est pas proposé, et en phase 3 elle appellerait le serveur de production (adresse vide tant que le point 6 n'est pas réglé). À trancher avant de tester le serveur sur un téléphone.
71. **G14 (vibration) n'a pas de lot.** Règle décidée le 16 novembre : réglage masqué là où la vibration ne marche pas (`lot-108.md` décision 3). À placer, par exemple avec l'écran de jeu (204) ou la fin de niveau (207).
72. **Logo coupé par l'interrupteur** : il peut apparaître une fraction de seconde le temps de lire le réglage, et ne suit que le paquet déjà rangé (effet à l'ouverture d'après). Accepté dans `lot-103.md` § 6.4.

Ajoutés le 17 novembre :

73. **Logo fourni par l'auteur** (décisions du 17 novembre ; **reporté le même jour** dans la spec 103, le design system § 9.14 et le briefing § 1, § 12 ; la pastille noire de la barre du haut est retirée, sur décision de l'auteur) : deux fichiers PNG de 1024 × 1024 px, fond crème `#FFE9B0`, cartes bleu nuit et orange.
    - **Deux versions copiées** au lot 101 : `client/images/logo-ios.png` (dessin grand) et `client/images/logo-android.png` (dessin réduit, avec une marge, car Android rogne les icônes en rond ou en carré arrondi).
    - **Écran d'ouverture sur le fond crème `#FFE9B0`** du logo, au lieu du noir prévu : le logo se fond dans l'écran.
    - **Images hors du projet claude.ai**, qui ne garde que du texte : l'auteur les dépose dans un dossier de son ordinateur, hors du dépôt, au moment du lot 101.
    - **À reporter** : spec 103 (icône de l'iPhone tirée de `logo-ios.png`, icônes du manifeste tirées de `logo-android.png` ; fond de l'écran d'ouverture et `background_color` ; la règle « centré sur un fond noir s'il n'est pas carré » devient sans objet, les deux fichiers sont carrés) ; design system § 9.14 (écran d'ouverture en `#FFE9B0` au lieu de `#000000`). **Reste ouvert** : la pastille noire du logo dans la barre du haut (design system § 9.14), et le briefing § 1, qui décrit un logo sur fond noir.


Ajoutés à la conversation de remise à jour (17 novembre) :

74. **Versions du dépôt tirées des versions complètes par des marqueurs.** Dans les documents complets du projet claude.ai, ce qui ne va pas dans le dépôt est entouré de `<!-- depot:retirer -->` et `<!-- /depot:retirer -->`, et le texte propre au dépôt est écrit dans une ligne `<!-- depot:ajouter … -->`. Un script de la conversation de remise à jour retire ces blocs, écrit les renvois en `docs/…` et refuse un renvoi restant vers le projet. Toute modification d'un document complet se reporte donc, en relançant le script, dans sa version du dépôt.
75. **Icônes Android en `purpose` = `any maskable`** (proposé le 17 novembre, spec 103) : c'est la raison d'être de la marge de `logo-android.png`. À vérifier sur un téléphone Android au lot 103.
76. **Lot 611 ajouté** (cadrage du 17 novembre) : nouvelle colonne `Questions` → `Lignes posées` (nom confirmé le 17 novembre), exception à la conservation de l'ELO, trois couleurs de catégorie. Points restant à trancher dans la spec : `cadrage-lot-611.md` § 6.

Ajoutés le 23 novembre :

77. **Base périmée** : la spec 104 confiait au lot 103 la proposition de recharger la page quand un autre onglet met la base à niveau ; la spec 103 n'en prévoyait rien. **Décidé par l'auteur le 23 novembre** : lot 107, avec une exception à son « aucun écran » (le dialogue de rechargement) et la garde « jamais pendant une partie » (spec 107 amendée, choix 7 et § 6.6 ; spec 104 corrigée). La garde et la reprise reviennent aux lots 204 et 207 (contrat ci-dessus). Limite acceptée : après « Plus tard », rien ne s'enregistre jusqu'à la fermeture de l'appli.
