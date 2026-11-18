# Design system et système de mouvement — MicroSwipe

Phase 0, lot 3 (conversation C, 16 et 17 novembre 2026, Opus 5.5). Complète le briefing (§ 6) et le plan de développement (§ 8).

**Mise à jour du 17 novembre, conversation de remise à jour** : logo fourni (§ 9.14 ; décisions 1 et 2) ; spec 102 amendée (§ 3.8) ; monde maîtrisé calculé par la spec 208 (§ 10.4) ; points du § 15 mis à jour.

**Mise à jour du 17 novembre** : la maquette a été retravaillée avec l'auteur (planches « B + D », E1, E2 et E3 de la toile). Les décisions de cette suite sont au § 0 bis ; elles remplacent, là où elles le contredisent, ce qui avait été écrit le 16 novembre. La toile est la **référence visuelle** des lots 202, 203, 212 et suivants ; ce document en est la **règle** : en cas d'écart, ce document l'emporte. Les finitions (alignements, rythmes) se règlent sur l'appli réelle, lot par lot.

**Ce que ce document fixe** : couleurs, typographie, espacements, rayons, ombres, durées et courbes d'animation, composants, et les écrans du mode test, du boss verrouillé et de l'espace Admin. Tout écran de l'appli prend ses valeurs ici. Une valeur visuelle absente de ce document ne s'invente pas dans un lot : Claude s'arrête et demande.

**Pas de code ici.** Les noms de variables (`--bleu`…) sont des noms à reprendre tels quels au lot 105 ; leur écriture en CSS relève de ce lot.

**Aucun contenu médical** : ce document peut être copié tel quel dans `docs/design-system.md`. Les exemples de textes utilisent des nombres et des identifiants fictifs.

---

## 0. Décisions de l'auteur (16 novembre 2026)

Questions posées après l'audit de la maquette ; réponses de l'auteur.

| # | Question | Décision |
|---|---|---|
| 1 | Fond clair ou sombre | **Clair**, celui de la maquette. Pas de mode sombre au lancement. ~~Le logo garde sa pastille noire.~~ Précisée le 17 novembre (décisions 18 et 31) ; logo MicroSwipe sans pastille, sur fond crème (§ 9.14, mis à jour le 17 novembre). |
| 2 | Logo | ~~**Pas encore fourni.**~~ **Fourni le 17 novembre** (logo MicroSwipe, fond crème) : écran d'ouverture sur `#FFE9B0`, logo sans pastille dans la barre du haut (§ 9.14). |
| 3 | Monde fermé | Texte du couvercle : « Réussis le boss du monde précédent pour l'ouvrir. » Aucune jauge d'étoiles sur un monde. |
| 4 | Boss verrouillé | Un toucher ouvre sa fiche, avec la liste de ce qui manque (§ 11). Raison de données : « Ce boss n'est pas encore prêt. » pour l'interne ; le code n'apparaît qu'en mode test. |
| 5 | Niveau verrouillé touché | Bulle « Réussis le niveau précédent ». |
| 6 | Monde maîtrisé | **Boss réussi et 3 étoiles à tous les niveaux du monde.** Colonies dorées. |
| 7 | Après le boss | Bouclier doré et meilleur score en %, **sans étoiles**. Annonce « Boss réussi · le monde N s'ouvre ». |
| 8 | Mécanique affichée | **La mécanique n'apparaît que sur la fiche du niveau** (la puce), jamais dans la boîte de Pétri. L'aspect d'une colonie ne dépend plus de la mécanique (§ 10.3). Libellés : Swipe, QCM, Intrus, Tri, Révélation, Boss, en bleu, orange ou gris, sans violet. **La liste est ouverte** : une mécanique ajoutée plus tard reçoit sa ligne dans la table du § 9.4, et une mécanique inconnue s'affiche sous un libellé générique sans rien casser. **Remplacée le 17 novembre par la décision 26** (§ 0 bis). |
| 9 | Durée sur la fiche | « N questions » seulement, sans durée. |
| 10 | Fiches espèces | Bouton « Revoir les fiches espèces » gardé, masqué tant que le niveau ne mène à aucune fiche débloquée. |
| 11 | Juste / faux | **Le vert et le rouge sont permis pour le retour juste / faux**, toujours avec une icône, une forme et un mouvement (jamais la couleur seule). L'interdit du vert, du rouge, du rose et du violet ne vise que **les dessins de bactéries**. |
| 12 | Fond des écrans de jeu | Neutre, **jamais la gélose du monde**. |
| 13 | Milieux des mondes 4 à 12 | **Fournis par l'auteur.** Ce document fixe les clés des mondes 1 à 3 et une clé de secours (§ 3.8). |
| 14 | Textes du mode test | Ceux de la spec 213, § 6.4, **confirmés**. Bannière orange foncé, en haut. |
| 15 | Outils de correction | Bouton « Outils » dans la bannière, qui ouvre une fiche d'actions. Textes confirmés : « Cette correction touche N questions. Elles sortent du jeu des internes jusqu'à validation. » et « Valider · <source>, p. <page> ». |
| 16 | Import annuel et recalcul | Écrans pensés pour l'**ordinateur**, encore utilisables sur téléphone. |

Les autres choix de ce document (durées, courbes, espacements, polices hébergées, animations en boucle) sont des choix de conception faits par Claude et annoncés à l'auteur.

## 0 bis. Décisions de l'auteur (17 novembre 2026), en retravaillant la maquette

| # | Sujet | Décision |
|---|---|---|
| 17 | Fiche de niveau | Trop proche d'un document : **refaite en « fiche de paillasse »** (§ 10.6). |
| 18 | Fond | **Clair, mais jamais blanc uni** : matière de paillasse (marbrure, grain, lumière) partout où il y a une surface (§ 9.19). La fiche du boss est **sombre** (§ 11). |
| 19 | Bouton principal | **Bleu nuit (encre) en relief, texte crème** (§ 9.1). Le bleu vif n'est plus la couleur des boutons : il reste pour le focus, les liens et les coches. Le boss garde un bouton **orange** en relief. |
| 20 | Étoiles | Ordre de remplissage : **gauche (60 %), puis droite (80 %), puis la grande du haut (100 %)**, avec un rebond, environ 0,35 s entre deux étoiles (§ 7.3). |
| 21 | Rythme | Animations de célébration **ralenties** : 2 à 2,5 s au total, toujours passables d'un toucher (§ 6.1). |
| 22 | Règle du jeu | Un bloc encadré, avec le nom de la mécanique en étiquette à cheval sur son bord, le geste mimé (Swipe : une carte entre « Non » et « Oui ») et la consigne centrée (§ 10.6). Consigne type d'un Swipe : « La bactérie X possède-t-elle une résistance naturelle pour l'antibiotique Y ? » |
| 23 | Tampon « Version simplifiée » | Posé de travers, **sans animation**. |
| 24 | Objets de paillasse | **Un objet par monde**, toujours le même, posé à côté de sa boîte sur la carte, et repris sur la fiche et l'écran de fin de ce monde. La liste s'allonge quand les mondes s'ajoutent (§ 9.18). |
| 25 | Monde fermé | Un **ruban de scotch** scelle le couvercle, avec un scotch écrit à la main : « Réussis le boss du monde N pour l'ouvrir. » (§ 10.2). |
| 26 | Étiquette de la mécanique | **Remplace la décision 8** : l'étiquette (scotch écrit à la main) apparaît **sur la carte, dans la vue zoomée seulement, une fois le niveau joué au moins une fois** ; sur la fiche, le nom de la mécanique est toujours visible. |
| 27 | « À réviser » | Un **scotch gris-bleu**, à la place de l'étiquette de la mécanique (jamais en plus). |
| 28 | Grain des géloses | **Irrégulier** (bruit), jamais une grille de points (§ 9.19). |
| 29 | Carte à deux niveaux | **La pile** (vue d'ensemble) et **le zoom** sur la boîte d'un monde (vue de jeu), avec zoom et dézoom animés (§ 10.1). |
| 30 | Défilement | La pile **et** la vue zoomée défilent verticalement ; dans la vue zoomée, on passe d'un monde à l'autre **sans dézoomer** (§ 10.1). |
| 31 | Bandeaux | Barre du haut et navigation **masquées** : elles apparaissent au toucher de la paillasse. **Bleu nuit uni**, sans texture ; icônes de labo (§ 9.2, § 9.3). |
| 32 | « Tous les mondes » | Un vrai bouton en relief, avec effet d'appui ; jamais un curseur ou une loupe (§ 9.1). |
| 33 | Résumés de la pile | Une petite fiche par monde, avec le scotch « Monde N » à cheval sur son bord, le nom centré (une ligne, ou deux lignes centrées) et une pastille d'état ; les objets sont dans la colonne des résumés, entre eux (§ 10.1). |
| 34 | Monde maîtrisé | **Rejouable**, niveau par niveau, comme tout niveau réussi. |
| 35 | Bandeau de la fiche | Suit la couleur de la gélose du monde (clé `Milieu`). |

---

## 1. Audit de la maquette

**Source** : la toile « Carte Boîte de Pétri » (https://claude.ai/artifact/Fveebyr22jpmKBtPSaK64i), planche « B + D · Carte animée et fiche (jouable) », qui fait référence. Les planches A à D sont les pistes antérieures, tranchées au profit de B + D.

### 1.1 Gardé

- La boîte de Pétri : bord en plastique avec reflets, ménisque, couvercle translucide, condensation, grain, étiquette manuscrite en ruban adhésif, strie d'ensemencement.
- La pile de boîtes, un monde par boîte, reliées par un pointillé.
- Les états des niveaux distingués par **la forme** autant que par la couleur : pointillés, loupe, bouclier, voile, anneau.
- Les points de niveau sont de vrais boutons, avec un libellé pour les lecteurs d'écran (« Niveau 3 : <titre>, réussi »).
- La fiche qui monte du bas, avec ses seuils d'étoiles, ses encadrés « Version simplifiée » et « À réviser », ses deux boutons sous le pouce.
- Les tailles de toucher des boutons (44 à 52 px) et le respect du réglage « réduire les animations ».
- Le bleu `#2B5FD9` pour l'action, l'orange `#F28C28` pour le niveau en cours, les polices Bricolage Grotesque, Inter et Caveat.

### 1.2 Corrigé

| Constat dans la maquette | Correction |
|---|---|
| « swipe S ou R » sur la fiche | Texte de maquette périmé : la consigne vient des données. Les premiers niveaux posent la résistance naturelle en oui / non ; des niveaux avancés demanderont ce qu'annonce l'antibiogramme d'une souche sauvage (S, R ou SFP), décision du 17 novembre. |
| « 30 étoiles pour ouvrir » sur le couvercle du monde 3 | Couvercle d'un monde fermé : « Réussis le boss du monde précédent pour l'ouvrir. » (décision 3). |
| Boss du monde 2 nommé « Lis l'antibiogramme » | Contenu de maquette ; titres et mécaniques viennent des données. |
| Étoiles affichées sur le boss réussi | Bouclier doré et meilleur score en % (décision 7). |
| Seuils 60 / 80 / 100 et total d'étoiles écrits en dur | Lus dans `Reglages` (`etoiles.seuil_1` à `_3`) et calculés par la progression (lot 208). |
| Niveaux verrouillés inactifs : le boss ne peut pas dire pourquoi | Un niveau verrouillé reste touchable (§ 10.5, § 11). |
| Aspect des colonies lié à la mécanique, puce « Étiquettes » | Aspect sans lien avec la mécanique ; puce « Tri » (décision 8). |
| Puce « Intrus » violette | Violet retiré de l'interface (§ 3). |
| « [N] espèces · environ 2 min » | « N questions » (décision 9). |
| Pas d'entrée Admin, ni mode test, ni espace Admin | § 9.3, § 12, § 13. |
| Polices chargées depuis Google Fonts | Hébergées dans le dépôt (§ 4.1) : l'appli marche hors ligne et n'envoie rien à Google. |
| Descente de 1,3 s, couvercle de 1,1 s, changement de monde d'environ 4,5 s | Séquence plafonnée à 1,5 s et passable d'un toucher (§ 7). |
| Cinq animations en boucle (deux ondes, étiquette « Jouer », reflet doré, voile) | Une seule boucle : les ondes du niveau en cours (§ 6.5). |
| Flou, tracé et largeur animés | Seules la position, l'échelle et l'opacité s'animent, sauf le tracé de la strie (§ 6.4). |
| Boutons sans réaction au toucher | Compression dès le contact (§ 7.1). |
| La fiche monte comme un simple panneau | La colonie touchée se transforme en aperçu de la fiche (§ 7.2). |
| Barre du haut de 72 px, aucune marge de sécurité | Barre de 56 px plus la marge de sécurité de l'appareil (§ 5.4). |

---

## 2. Principes

1. **La pédagogie d'abord** : rien ne bouge, ne brille ni ne sonne sans servir la compréhension ou le retour sur l'action.
2. **Jamais d'attente en jeu** : aucune animation ne retarde la question suivante de plus de 240 ms ; aucun indicateur de chargement en jeu. Exceptions limitatives : plan § 8.
3. **Jamais la couleur seule** : toute information portée par une couleur l'est aussi par une icône, une forme, un texte ou un mouvement.
4. **Une main** : actions principales en bas, sous le pouce ; cibles d'au moins 44 × 44 px.
5. **Une seule source de valeurs** : couleurs, tailles et durées viennent des variables de ce document.
6. **Tout est donnée** : aucun monde, niveau, mécanique ni texte de contenu écrit dans un écran. Une valeur de données inconnue (clé de milieu, mécanique) a toujours un affichage de secours.

---

## 3. Couleurs

Contrastes calculés selon WCAG 2.1 ; seuil AA : 4,5:1 pour le texte, 3:1 pour le grand texte (24 px, ou 19 px gras) et pour les éléments graphiques utiles.

### 3.1 Neutres

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--fond` | `#EEF2F6` | Fond général des écrans (hors carte) | — |
| `--paillasse` | dégradé radial `#F4F6F9` → `#E4E9EF` (68 %) → `#D6DDE6` | Fond de la carte seulement | — |
| `--surface` | `#FFFFFF` | Fiches, cartes, barres, dialogues | — |
| `--surface-2` | `#F1F4F8` | Cases inactives, boutons icône, blocs secondaires | — |
| `--bordure` | `#C9D3DF` | Séparateurs, bord des boutons secondaires (décor : jamais seul indicateur) | 1,5:1 |
| `--bordure-forte` | `#7A8799` | Bord des champs, contour des étoiles vides | 3,6:1 sur blanc |
| `--texte` | `#15202E` | Texte principal | 16,4:1 sur blanc ; 14,6:1 sur `--fond` |
| `--texte-2` | `#4A5A70` | Texte secondaire, libellés de navigation | 7,0:1 sur blanc ; 6,3:1 sur `--fond` |
| `--texte-3` | `#5E6B7D` | Mentions discrètes, « (vide) » | 5,4:1 sur blanc |
| `--voile` | `#0A101C` à 46 % | Assombrissement derrière une fiche ou un dialogue | — |

### 3.2 Bleu : action

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--bleu` | `#2B5FD9` | Lien, coche d'une condition remplie, anneau de focus (plus le bouton principal depuis le 17 novembre, § 3.10) | blanc dessus 5,6:1 |
| `--bleu-presse` | `#1F4BA8` | Texte sur `--bleu-clair` | sur `--bleu-clair` 7,0:1 |
| `--bleu-clair` | `#E8F0FE` | Puce, encadré d'information, case « Contenu actuel » de l'Admin | — |

### 3.3 Orange : progression et attention

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--orange` | `#F28C28` | Anneau et étiquette « Jouer » du niveau en cours, jauge | texte `#2A1600` dessus 7,1:1 |
| `--orange-texte` | `#8A4B00` | Texte et icône sur `--orange-clair` | 6,2:1 |
| `--orange-texte-fort` | `#5C3300` | Titre d'encadré, case « Copie » de l'Admin | 10,0:1 sur `--orange-clair` |
| `--orange-clair` | `#FFF4E0` | Encadré « Version simplifiée », pastille du total d'étoiles, case « Copie » | — |
| `--orange-fonce` | `#9A4208` | Bannière du mode test | blanc dessus 6,7:1 |

### 3.4 Étoiles et or

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--etoile` | `#FFD45A` | Étoile pleine sur la pastille sombre de la carte | 11,0:1 sur `--pastille` |
| `--etoile-vide-sombre` | `#8C96A6` | Étoile vide sur la pastille (contour) | 5,2:1 |
| `--pastille` | `#1B2433` à 80 % | Fond de la pastille d'étoiles sur la carte | — |
| `--etoile-claire` | `#B97A0E` | Étoile pleine sur fond clair (fiche, fin de niveau, en-tête) | 3,6:1 sur blanc |
| `--etoile-vide-claire` | contour `--bordure-forte`, intérieur vide | Étoile vide sur fond clair | 3,6:1 |
| `--or-fond` | `#FFF6DC` | Case d'un seuil atteint | — |
| `--or` | dégradé radial `#FFF4C2` → `#F0C44C` → `#B8860B` | Colonies d'un monde maîtrisé, bouclier d'un boss réussi (décor) | — |

Une étoile pleine se distingue d'une vide par **sa forme remplie**, pas seulement par sa couleur.

### 3.5 Retour juste / faux

Permis seulement pour le retour sur une réponse (décision 11), **jamais sur un dessin de bactérie**, jamais sans icône.

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--juste` | `#1E7A4C` | Bandeau et icône « juste » | blanc dessus 5,3:1 |
| `--juste-clair` | `#E4F3EA`, texte `#155C39` | Fond de la ligne juste dans une correction | 7,0:1 |
| `--faux` | `#C0352B` | Bandeau et icône « faux » ; bouton de danger de l'Admin | blanc dessus 5,6:1 |
| `--faux-clair` | `#FBE7E5`, texte `#9A2A22` | Fond de la ligne fausse ; message d'erreur | 6,5:1 |

### 3.6 Révision et Admin

| Variable | Valeur | Usage |
|---|---|---|
| `--revision` | `#E3E7ED`, texte `#2E3A4B` (10,2:1) | Étiquette « à réviser », encadré « À réviser », case « Référence » de l'Admin |
| Voile de contamination | dégradé radial `#ECEEF2` à 94 % → `#D0D5DC` à 80 % → transparent | Sur la colonie à réviser (décor) |

### 3.7 Couleurs retirées de l'interface

Violet et rose : nulle part dans l'interface. Le bleu-vert `#1D9E8F` du prototype Gram Swipe : nulle part.

### 3.8 Milieux des mondes (colonne `Milieu`)

La colonne `Milieu` d'un monde contient une **clé** ; le client y associe trois couleurs (centre, milieu, bord de la gélose, en dégradé radial centré à 38 % / 34 %).

| Clé | Monde | Centre | Milieu (≈ 55 %) | Bord |
|---|---|---|---|---|
| `sang` | 1 | `#A83A45` | `#87212D` | `#6A1520` |
| `bcp` | 2 | `#86AED3` | `#5E8CB9` | `#46709E` |
| `chocolat` | 3 | `#94694A` | `#74502F` | `#5A3B20` |
| `neutre` | secours | `#E3D7B4` | `#CDBE93` | `#B8A77A` |

- **Mondes 4 à 12** : milieux à fournir par l'auteur (décision 13). Chaque nouveau milieu ajoute une ligne à cette table, puis au client. Une même couleur peut servir à plusieurs mondes.
- **Clé vide ou inconnue → `neutre`**, sans erreur ni message : ajouter un monde ne demande donc aucun code ; seule une couleur de milieu nouvelle en demande (une ligne de table).
- Le jeu de données fictif du lot 102 utilise `sang`, `bcp`, `chocolat` et `neutre` (spec 102 amendée le 17 novembre).
- La gélose n'apparaît que sur la carte et dans l'aperçu rond de la fiche, **jamais derrière un écran de jeu** (décision 12).

### 3.9 Dessins de bactéries

Règle de fond (briefing § 2, règle 6), traduite en couleurs :

- Question sur le Gram : **une couleur unique, ou des couleurs tirées au hasard, dans la palette ci-dessous seulement**. Aucune teinte rose, violette, rouge ni verte.
- Question sur la forme : forme générique, **ovale de rapport longueur / largeur 1,3 à 1,5**, bords arrondis, ni ronde ni en bâtonnet allongé.
- Question sur les deux : les deux règles.
- Un dessin n'est **jamais teinté** par le retour juste / faux : le retour s'affiche autour, jamais sur le dessin.

| Variable | Valeur | Teinte |
|---|---|---|
| `--bacterie-1` | `#2B5FD9` | bleu |
| `--bacterie-2` | `#5E8CB9` | bleu gris |
| `--bacterie-3` | `#F28C28` | orange |
| `--bacterie-4` | `#E0A82E` | jaune or |
| `--bacterie-5` | `#8C6A4A` | brun |
| `--bacterie-6` | `#6F7D90` | gris ardoise |

Bandes de teinte (cercle chromatique) **interdites** pour un dessin, à vérifier par un test du lot qui dessine : 330° à 20° (rouge, rose), 80° à 185° (vert, bleu-vert), 260° à 330° (violet). Une couleur ajoutée à cette palette doit tomber hors de ces bandes.

### 3.10 Encre et crème (17 novembre)

La famille qui donne son identité aux boutons, aux bandeaux et à la fiche du boss.

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--encre` | `#1B2433` | Bouton principal (bas du dégradé), bandeaux, fiche du boss, étiquette de règle | crème dessus 13,0:1 |
| `--encre-haut` | `#2A3850` | Haut du dégradé du bouton principal | crème dessus 9,9:1 |
| `--encre-ombre` | `#070B12` | Tranche du bouton en relief (ombre de 5 px dessous) | — |
| `--creme` | `#FFE9B0` | Texte et icônes sur l'encre, onglet actif | — |
| `--gris-sur-encre` | `#AEB8C6` | Texte secondaire sur l'encre, onglets inactifs | 7,8:1 |
| `--orange-sur-encre` | `#F5B25C` | Mot « Boss », seuil du boss | 8,5:1 |
| `--orange-boss` | dégradé `#F7A04A` → `#F28C28`, tranche `#A0520C`, texte `#2A1600` | Bouton « Jouer » du boss | 8,3:1 |

### 3.11 Scotch (17 novembre)

| Variable | Valeur | Usage | Contraste |
|---|---|---|---|
| `--scotch` | `#FAF4DD` à 96 %, texte `#3A2E14` | Étiquette des boîtes, de la mécanique, scotch qui scelle un monde, « Niveau suivant débloqué » | 12,0:1 |
| `--scotch-revision` | `#CED8E4` à 97 %, texte `#2E3A4B` | Étiquette « à réviser » | 8,0:1 |

Bords irréguliers (découpe en polygone), ombre `--ombre-1`, texte en Caveat, posé légèrement de travers (−4° à +3°).

### 3.12 Pastilles d'état de la pile

| État | Fond / texte | Contraste |
|---|---|---|
| Maîtrisé | `#FFF1C7` / `#6E4A00` | 7,1:1 |
| En cours, ouvert | `--encre` / `--creme` | 13,0:1 |
| Fermé | `#E9EDF2` / `--texte-2` | 6,0:1 |

---

## 4. Typographie

### 4.1 Polices

| Rôle | Police | Graisses | Usage |
|---|---|---|---|
| Titres | Bricolage Grotesque | 600, 700 | Titres d'écran et de fiche, score de fin de niveau |
| Texte | Inter | 400, 500, 600, 700 | Tout le reste |
| Manuscrite | Caveat | 600, 700 | **Seulement** le scotch (§ 3.11) : étiquettes des boîtes, des mécaniques, « à réviser », scotch d'un monde fermé, résumés de la pile, « Niveau suivant débloqué » |
| Identifiants | police à chasse fixe du système (aucun téléchargement) | 400 | Identifiants et codes du mode test et de l'Admin |

- **Hébergées dans le dépôt** (`client/polices/`), au format woff2, réduites aux caractères latins et latins étendus, avec leurs licences (SIL Open Font License) ; mises en cache par le service worker. **Aucun appel à Google Fonts** : hors ligne, et aucune adresse IP envoyée à un tiers.
- Police de repli : celle du système (`system-ui`), pour qu'un texte ne disparaisse jamais pendant le chargement.
- Chiffres à chasse fixe (`tabular-nums` d'Inter) pour les scores, compteurs, étoiles et tableaux.

### 4.2 Échelle

Tailles en px pour une taille de texte du téléphone par défaut ; elles s'expriment en rem (1 rem = 16 px) pour suivre le zoom. Le zoom de la page n'est jamais bloqué.

| Variable | Taille / interligne | Graisse | Usage |
|---|---|---|---|
| `--texte-score` | 36 / 1,1 | Bricolage 700 | Score de fin de niveau |
| `--texte-titre-1` | 24 / 1,15 | Bricolage 700 | Titre d'écran, titre de fiche |
| `--texte-titre-2` | 18 / 1,25 | Bricolage 700 | Titre de la barre du haut, titre de section |
| `--texte-question` | 20 / 1,3 | Inter 600 | Énoncé d'une question, nom au-dessus d'un dessin |
| `--texte-bouton` | 17 / 1 | Inter 700 | Bouton principal |
| `--texte-corps` | 15 / 1,45 | Inter 400 | Consigne, explication, texte courant |
| `--texte-bouton-2` | 15 / 1 | Inter 600 | Bouton secondaire, choix de QCM |
| `--texte-petit` | 13 / 1,4 | Inter 400 ou 600 | Encadrés, mentions, sous-titres |
| `--texte-legende` | 12 / 1,2 | Inter 600 ou 700 | Navigation, puces, pastilles. **Taille minimale de l'appli.** |
| `--texte-ruban` | 20 / 1 | Caveat 600 | Étiquette des boîtes |

L'étiquette manuscrite est décorative : son texte est aussi donné aux lecteurs d'écran par le libellé de la boîte.

---

## 5. Espacements, rayons, ombres, mise en page

### 5.1 Espacements (base 4 px)

| Variable | Valeur | Usage type |
|---|---|---|
| `--esp-1` | 4 | Entre une icône et son libellé serré |
| `--esp-2` | 8 | Entre éléments d'un groupe |
| `--esp-3` | 12 | Dans un encadré, entre boutons empilés (10 dans la maquette → 12) |
| `--esp-4` | 16 | Marge latérale des écrans, entre blocs d'une fiche |
| `--esp-5` | 20 | Marge latérale de la fiche |
| `--esp-6` | 24 | Bas de la fiche, entre sections |
| `--esp-7` | 32 | Grands blocs |
| `--esp-8` | 48 | Respiration d'un écran de fin |

### 5.2 Rayons

| Variable | Valeur | Usage |
|---|---|---|
| `--rayon-1` | 8 | Champs, cellules, petites cases |
| `--rayon-2` | 14 | Encadrés, cases de seuils, cartes de contenu |
| `--rayon-3` | 16 | Boutons, carte de question |
| `--rayon-4` | 26 | Haut de la fiche |
| `--rayon-pastille` | 999 | Puces, pastilles, étiquettes, annonce |

### 5.3 Ombres

| Variable | Valeur | Usage |
|---|---|---|
| `--ombre-1` | 0 1px 3px rgba(0,0,0,.22) | Étiquette, puce posée sur la gélose |
| `--ombre-2` | 0 4px 12px rgba(20,30,50,.16) | Carte de question, bouton principal (teinte du bouton à 30 %) |
| `--ombre-3` | 0 -10px 30px rgba(10,20,40,.25) | Fiche qui monte |
| `--ombre-4` | 0 8px 20px rgba(0,0,0,.28) | Annonce, dialogue |

Au toucher, un élément ombré passe à l'ombre du niveau inférieur.

### 5.4 Mise en page

- **Largeur de référence : 390 px**, portrait seul (décision du lot 103). Au-delà de 480 px de large, l'appli reste une colonne de 480 px centrée sur `--fond`, sans message. Exception : l'espace Admin (§ 13.2).
- **Marges de sécurité** de l'appareil (encoche, barre d'accueil de l'iPhone, barre de gestes d'Android) ajoutées en haut de la barre du haut et en bas de la navigation et de la fiche.
- **Barre du haut** : 56 px + marge haute. **Navigation du bas** : 64 px + marge basse.
- **Zone du pouce** : les commandes de jeu et les boutons principaux sont dans le tiers bas de l'écran. Rien d'essentiel dans les 56 px du haut, sauf la sortie du mode test.
- **Cibles** : au moins 44 × 44 px de zone touchable, même si le dessin est plus petit ; au moins 8 px entre deux cibles.
- **Plans** (du dessous au dessus) : contenu 0 ; barres 20 ; annonce 30 ; voile 40 ; fiche 41 ; dialogue 60 ; bannière du mode test 70.

---

## 6. Système de mouvement

### 6.1 Durées

| Variable | Valeur | Usage |
|---|---|---|
| `--duree-contact` | 80 ms | Réaction au contact du doigt |
| `--duree-courte` | 120 ms | Fondus, changement d'onglet, petits éléments |
| `--duree-moyenne` | 240 ms | Fermeture, sortie d'un élément, retour juste / faux, changement d'écran |
| `--duree-longue` | 400 ms | Ouverture de la fiche, croissance d'une colonie, révélation |
| Séquence de célébration | **2 500 ms au plus**, au total (relevé le 17 novembre, décision 21) | Fiche qui s'ouvre, écran de fin, carte après une partie (§ 7.3) |

### 6.2 Courbes

| Variable | Valeur | Usage |
|---|---|---|
| `--courbe-sortie` | cubic-bezier(0.2, 0.9, 0.25, 1) | Un élément qui **arrive** (fiche qui monte, annonce) : vif puis doux |
| `--courbe-entree` | cubic-bezier(0.4, 0, 1, 1) | Un élément qui **part** (fermeture) |
| `--courbe-standard` | cubic-bezier(0.4, 0, 0.2, 1) | Déplacement d'un point à un autre (descente de la carte, strie) |
| `--courbe-rebond` | cubic-bezier(0.2, 0.8, 0.3, 1.25) | Petits éléments seulement : étoiles, coche, colonie qui pousse |

### 6.3 Ressorts (ce qui suit le doigt)

Tout ce qui suit le doigt revient ou part **en ressort**, jamais avec une durée fixe. Paramètres (masse 1) :

| Ressort | Raideur | Amortissement | Usage |
|---|---|---|---|
| Vif | 420 | 32 | Relâchement d'un bouton, carte relâchée qui part |
| Doux | 260 | 24 | Carte de swipe qui revient au centre, fiche relâchée qui revient |

Le ressort démarre à la vitesse du doigt au moment du relâchement. Il s'arrête quand l'écart est inférieur à 0,5 px et la vitesse à 0,01 px/ms.

### 6.4 Règles de performance

- **Seules la position (`translate`), l'échelle, la rotation et l'opacité s'animent.** Jamais une largeur, une hauteur, une marge, une ombre ni un flou.
- Exceptions : le tracé de la strie (une seule ligne SVG courte, § 7.3) ; aucune autre.
- Le grain et la matière (§ 9.19) sont des **filtres fixes** : jamais animés. Leur coût sur iPhone est à mesurer au lot 108.
- Une jauge qui se remplit s'anime par l'échelle horizontale, jamais par sa largeur.
- Le flou derrière la fiche est **fixe** : il est posé sur un calque qui apparaît en opacité.
- Cible : 60 images par seconde sur un téléphone d'entrée de gamme de 2022. Le lot 108 le vérifie sur les deux téléphones.

### 6.5 Boucles

**Une seule animation en boucle dans toute l'appli** : les deux ondes du niveau en cours sur la carte (§ 7.3). Le geste mimé de la règle du jeu (§ 10.6) joue trois fois puis s'arrête : ce n'est pas une boucle. Elle s'arrête quand une fiche est ouverte, quand l'appli passe en arrière-plan et quand le réglage « réduire les animations » est actif. Tout le reste joue une fois.

### 6.6 Réduire les animations

Si le téléphone est réglé pour réduire les animations :

- tout déplacement, zoom ou rebond est remplacé par un fondu de 120 ms ;
- les ondes du niveau en cours sont remplacées par un anneau fixe ;
- la séquence de célébration montre directement son état final, avec l'annonce ;
- le swipe suit toujours le doigt (c'est un geste, pas une animation), **sans rotation** ; la carte part en fondu ;
- la secousse de l'erreur est remplacée par le bandeau seul ; la vibration reste, si elle est activée.

### 6.7 Ce qui se passe d'un toucher

Toute séquence de plus de 400 ms se passe d'un toucher n'importe où : elle saute à son état final (sur l'écran de fin, un toucher hors des boutons). L'appli n'ignore jamais un toucher pendant une animation, sauf pendant les 80 ms d'un appui.

### 6.8 Vibration et sons

- **Vibration** (G14) : 30 ms à une réponse fausse, désactivable dans Profil. Sur iPhone, où le navigateur ne la permet pas, le réglage est masqué (décision du lot 108).
- **Sons** : aucun au lancement (aucun lot ne les porte). S'ils arrivent, ils seront coupés par défaut.

---

## 7. Animations clés

### 7.1 Appui sur un bouton

- **Au contact** : échelle 0,97, ombre du niveau inférieur, fond `--bleu-presse` pour un bouton principal ; `--duree-contact`, `--courbe-standard`.
- **Au relâchement** : retour en ressort vif. L'action part au relâchement, sans attendre la fin du ressort.
- Doigt qui glisse hors du bouton avant de relâcher : retour en ressort, aucune action.
- Bouton désactivé : aucune réaction.

### 7.2 Fiche de niveau (continuité)

- **Ouverture** : la colonie touchée grandit et glisse jusqu'à la place de l'aperçu rond de la fiche, pendant que la fiche monte du bas ; 400 ms, `--courbe-sortie`. Le voile et le flou apparaissent en 240 ms.
- **Fermeture** (bouton, toucher sur le voile, ou glissement vers le bas au-delà de 30 % de la hauteur ou à plus de 0,5 px/ms) : l'inverse en 240 ms, `--courbe-entree`. Un glissement trop court ramène la fiche en ressort doux.
- Fiche du boss ou d'un niveau verrouillé : même animation, depuis le bouclier ou le cercle pointillé.

### 7.3 Sur la carte, après une partie

Enchaînement au retour sur la carte ; total au plus 1,5 s ; passable d'un toucher.

| Étape | Animation | Début | Durée | Courbe |
|---|---|---|---|---|
| Niveau réussi | La colonie pousse (échelle 0,05 → 1,08 → 1) | 0 | 400 ms | rebond |
| Étoiles (pastille de la carte) | Une par une, gauche, droite, puis milieu : échelle 0 → 1,18 → 1 et rotation −35° → 0 | 300 ms, puis toutes les 350 ms | 420 ms chacune | rebond |
| Annonce | « Niveau réussi · 2 étoiles » | 300 ms | 240 ms à l'entrée, 2 s affichée, 240 ms à la sortie | sortie / entrée |
| Niveau suivant | La strie se dessine jusqu'au point suivant | 700 ms | 600 ms | standard |
| Point suivant | Ses ondes commencent | 1 300 ms | — | — |

**Boss réussi, changement de monde** :

| Étape | Animation | Début | Durée | Courbe |
|---|---|---|---|---|
| Bouclier | Le bouclier passe à l'or (fondu) | 0 | 240 ms | standard |
| Annonce | « Boss réussi · le monde 3 s'ouvre » | 0 | comme ci-dessus | — |
| Descente | La carte défile jusqu'à la boîte suivante | 300 ms | 700 ms | standard |
| Couvercle | Il se soulève de 14 px, puis glisse vers le haut à droite en tournant de 16° et s'efface | 1 000 ms | 160 ms + 340 ms | standard, puis entrée |

**Monde maîtrisé** : au moment où le monde le devient, un seul reflet passe sur ses colonies dorées (1 200 ms, une fois), puis elles restent fixes.

**Ondes du niveau en cours** : deux anneaux orange qui grandissent de 1 à 2,1 et s'effacent, 1 800 ms, le second décalé de 900 ms. L'étiquette « Jouer » est fixe.

**Contamination** : le voile apparaît en fondu (400 ms) à l'ouverture de la carte, puis reste fixe. Quand on rejoue le niveau : il se contracte à 0,4 et s'efface (400 ms, entrée), annonce « Colonie assainie ».

**Révélation** : au premier affichage d'un niveau révélation joué, zoom de loupe (échelle 0,5 → 1,18 → 1, flou retiré, 400 ms, rebond).

Aucune de ces animations ne joue après une partie du mode test (spec 213, § 6.7).

### 7.4 Swipe

- La carte suit le doigt **1:1**. Rotation = déplacement horizontal / largeur de l'écran × 12°, au plus 12°.
- **Validation** : déplacement au-delà de 30 % de la largeur (directions gauche et droite) ou de 25 % de la hauteur (haut, bas, diagonales), **ou** vitesse d'au moins 0,6 px/ms dans une direction affichée au relâchement.
- **Direction** : le secteur angulaire le plus proche parmi les directions affichées (2 à 5). Un geste vers une direction non affichée est un geste trop court.
- **Zone cible** : le bouton de la direction s'allume progressivement entre 40 % et 100 % du seuil (opacité 0,6 → 1, échelle 1 → 1,06).
- **Départ** : la carte continue à sa vitesse et sort de l'écran, en 240 ms au plus.
- **Geste trop court** : retour au centre en ressort doux.
- **Boutons aux bords** : chaque direction a un vrai bouton, au bord de l'écran, qui fait partir la carte dans sa direction ; c'est aussi l'accès des lecteurs d'écran et du clavier.
- La carte suivante est déjà en place, sous la première, à l'échelle 0,96 ; elle passe à 1 en 240 ms.

### 7.5 Retour juste / faux

- **Juste** : bandeau `--juste` avec une coche, entrée par le bas en 240 ms ; la coche fait un rebond.
- **Faux** : bandeau `--faux` avec une croix ; la zone de réponse fait une secousse horizontale (trois allers-retours de ±6 px, 240 ms) ; vibration si activée.
- Le bandeau porte toujours un texte (« Juste », « Faux » ou la bonne réponse) : jamais la couleur seule.
- **Enchaînement après la réponse** (combien de temps avant la question suivante, explication automatique ou sur appui) : **non décidé, à trancher dans la spec 204**. Contrainte de ce document : rien ne bloque l'interne plus de 240 ms au-delà de ce que la règle pédagogique impose.

### 7.6 Changements d'écran

- Entre les onglets de la navigation : fondu 120 ms, sans déplacement.
- Vers un écran enfant (fiche espèce, écran de jeu) : l'écran arrive de 16 px plus bas en fondu, 240 ms, `--courbe-sortie` ; retour en sens inverse, 240 ms.
- Ouverture d'un dialogue : voile 240 ms, dialogue de l'échelle 0,96 à 1 en fondu, 240 ms.

### 7.7 Logo à l'ouverture (lot 103)

Fond plein écran, logo centré : apparition en fondu 240 ms, affiché environ 1 s (plus longtemps seulement si le démarrage l'est), disparition en fondu 240 ms. Un toucher le fait passer. Avec l'interrupteur `accueil.logo` éteint, rien ne s'affiche.

---

## 8. Accessibilité

- **Contraste AA** partout (tableaux du § 3). Une couleur ajoutée doit être vérifiée par calcul, pas à l'œil.
- **Jamais la couleur seule** (§ 2) : états des niveaux par forme, étoiles par remplissage, juste / faux par icône et texte, comparaison de l'Admin par libellé écrit.
- **Focus visible** : anneau de 3 px `--bleu`, décalé de 2 px, sur tout élément atteint au clavier.
- **Vrais éléments** : boutons, liens et champs natifs, jamais un bloc rendu cliquable.
- **Libellés** : chaque point de la carte a un libellé complet (« Niveau 4 : <titre>, verrouillé ») ; chaque bouton icône a un libellé ; les dessins décoratifs sont ignorés des lecteurs d'écran.
- **Annonces** (réussite, enregistrement) lues par les lecteurs d'écran sans prendre le focus.
- **Langue** de la page : français.
- **Réduire les animations** : § 6.6.

---

## 9. Composants

Chaque composant a les états : repos, appui (§ 7.1), focus (§ 8), désactivé quand il y a lieu.

### 9.1 Boutons

| Composant | Hauteur | Aspect | Rayon | Texte |
|---|---|---|---|---|
| **Principal** (Jouer, Rejouer, Continuer) | 60 | **En relief** : dégradé `--encre-haut` → `--encre`, tranche de 5 px `--encre-ombre` dessous, reflet clair de 1 px en haut, ombre portée douce ; texte et icône `--creme` | 18 | Inter 800, 19 px |
| **Boss** (Jouer) | 60 | En relief, `--orange-boss` (§ 3.10), icône bouclier | 18 | Inter 800, 19 px |
| **Tous les mondes** | 54 | En relief, comme le principal ; icône de boîtes empilées ; centré en bas, flottant sur la carte | 18 | Inter 800, 15 px |
| Secondaire (Rejouer sur l'écran de fin, Précédent / Suivant de l'Admin) | 50 | Surface claire translucide, bord 1,5 px `#B8C3D1`, texte `--texte` | 16 | Inter 700, 16 px |
| Lien d'action (Revoir les fiches espèces) | 44 | Sans fond, icône + texte `#3A2E14` | — | Inter 600, 15 px |
| Icône | 44 × 44 | Rond, blanc à 88 % sur la gélose, `rgba(255,255,255,.10)` sur l'encre | rond | icône 18 |
| Danger (Admin) | 48 | `--surface`, bord 1,5 px `--faux`, texte `--faux` | 16 | Inter 600, 15 px |

- **Appui d'un bouton en relief** : il descend de 4 px et sa tranche passe de 5 px à 1 px, en 80 ms ; il remonte au relâchement. Un bouton plat se comprime (échelle 0,97).
- **Désactivé** : opacité 0,45, aucune réaction ; si la raison n'est pas évidente, un texte à côté la donne.
- **Enregistrement en cours** (cas permis seulement) : l'indicateur du § 9.10 précède le texte (« Enregistrement… ») ; le bouton est inactif pendant ce temps.
- Jamais de curseur loupe : le curseur d'un élément touchable est la main.

### 9.2 Barre du haut

- **Masquée par défaut** sur la carte (décision 31). Elle apparaît 2,5 s à l'ouverture de l'appli, pour qu'on sache qu'elle existe, puis glisse hors de l'écran (240 ms). Un toucher sur la paillasse, hors d'un niveau ou d'une boîte, la fait revenir ; un second la cache. Un glissement ne la déclenche pas.
- 72 px + marge haute ; fond **`--encre` uni** ; filet `--creme` à 22 % sur le bord bas ; ombre portée.
- De gauche à droite : logo (§ 9.14) ; « CARTE » (12 px, 700, petites capitales espacées, `--gris-sur-encre`) au-dessus du titre (Bricolage 18 px, blanc : « Monde 2 · Entérobactéries » dans la vue zoomée, « Tous les mondes » dans la pile) ; pastille du total d'étoiles (fond `--creme` à 12 %, filet `--creme` à 30 %, étoile `#F7C843`, nombre `--creme` en chiffres à chasse fixe) ; bouton icône.
- Hors de la carte (Modes, Collection, Profil, Admin), la barre reste affichée.

### 9.3 Navigation du bas

- Masquée et rappelée avec la barre du haut, sur la carte seulement.
- 76 px + marge basse ; fond **`--encre` uni** ; filet `--creme` à 22 % sur le bord haut.
- **Carte, Modes, Collection, Profil**, et **Admin** en cinquième entrée pour un compte qui a le droit « contenu ». Icônes de labo, trait 1,8 px :

| Entrée | Icône |
|---|---|
| Carte | Boîte de Pétri vue de dessus, avec sa strie |
| Modes | Portoir à tubes |
| Collection | Lames de microscope empilées |
| Profil | Blouse de labo |
| Admin | À dessiner avec le lot 501 (une clé de labo, par exemple) |

- Entrée active : `--creme`, 800, pastille `--creme` à 14 % derrière l'icône (rayon 12) ; marquée comme page courante. Inactives : `--gris-sur-encre`, 600. Au toucher, l'icône se comprime (0,92).

### 9.4 Nom de la mécanique

- **Sur la fiche** : toujours visible, en étiquette `--encre` / `--creme` (Bricolage 14 px, 700) à cheval sur le bord du bloc de règle du jeu (§ 10.6).
- **Sur la carte** : un scotch écrit à la main au-dessus de la colonie, **dans la vue zoomée seulement**, **une fois le niveau joué au moins une fois** ; jamais sur un boss ni une révélation ; remplacé par « à réviser » quand le niveau l'est (§ 10.4).
- Libellés : le type passe d'abord (« Boss », « Révélation »), puis la mécanique :

| Valeur | Libellé |
|---|---|
| `swipe` | Swipe |
| `qcm` | QCM |
| `tri` | Tri |
| `intrus` | Intrus |
| **toute autre valeur** | Jeu |

Ajouter une mécanique = ajouter une ligne à cette table (et au client) ; « Jeu » couvre une mécanique tant que sa ligne n'existe pas.

### 9.5 Étoiles

- **Forme commune** : étoile à cinq branches arrondies. Pleine : dégradé or (`#FFE9A0` → `#F7C843` → `#E09A1B`), contour `--etoile-claire`, petit reflet blanc, ombre dorée. Vide : **fond plein `#F4F6F9`**, contour `--bordure-forte`, pour rester lisible sur n'importe quel fond.
- **Trio de la fiche et de l'écran de fin** : trois étoiles, **celle du milieu plus grande et plus haute** (fiche : 50 / 66 / 50 px, relevée de 14 px ; fin : 64 / 84 / 64 px, relevée de 16 px).
  - Gauche = 1re étoile (`etoiles.seuil_1`), droite = 2e (`seuil_2`), milieu = 3e (`seuil_3`).
  - Sur la fiche, le pourcentage est écrit sous chaque étoile (12 px, 700, `--texte-2`).
  - Elles se remplissent **dans cet ordre : gauche, droite, milieu** (§ 7.3).
  - Le trio ne chevauche jamais une gélose.
- **Pastille de la carte** : sous la colonie, fond `--pastille`, trois petites étoiles de 9 px (`--etoile` / contour `--etoile-vide-sombre`), dans la vue zoomée seulement.
- **Jamais sur un boss.**

### 9.6 Pastille d'état

Rayon pastille, 11,5 px, 700, sur une ligne, couleurs du § 3.12. Textes : « ★ Maîtrisé », « ★ 7 · en cours », « Ouvert », « Fermé ».

### 9.7 Mentions de la fiche

Les anciens encadrés sont remplacés par **une ligne en italique** sous le titre, centrée, 13 px :

| Mention | Couleur | Texte |
|---|---|---|
| Version simplifiée | `--orange-texte` | « Certaines nuances t'attendent plus loin dans le jeu. » (avec le tampon, § 9.17) |
| À réviser | `--texte-2` | « La colonie se contamine avec le temps. Rejoue le niveau pour l'assainir. » |
| Révélation non jouée | `--texte-2` | « Ce niveau ne se dévoile qu'en le jouant. » |

Restent des encadrés : l'erreur (`--faux-clair`, texte `#9A2A22`, toujours suivi d'une action si possible) et l'information de l'Admin (`--bleu-clair`). L'indice de certitude (P3) est réservé : aucun lot ne le porte.

### 9.8 Fiche (feuille qui monte)

Hauteur 704 px (au plus 88 % de l'écran ; au-delà, le contenu défile) ; rayon 26 en haut ; ombre `--ombre-3` ; voile `--voile` et flou fixe de 5 px derrière. Le contenu est au § 10.6 (niveau) et au § 11 (boss).

### 9.9 Annonce

Pastille `--texte` (fond) et texte blanc 14 600, rayon pastille, `--ombre-4`, centrée en haut de l'écran (sous la marge de sécurité, la barre du haut étant masquée). Une ligne, au plus 32 caractères. Lue par les lecteurs d'écran. Sert aussi de bulle quand on touche un niveau verrouillé : « Réussis le niveau précédent ».

### 9.10 Indicateur de chargement

Anneau de 20 px qui tourne (rotation, 800 ms par tour), `--bleu` sur `--surface-2`, **toujours accompagné d'un texte**. Autorisé **seulement** dans les cas du plan § 8 : premier chargement du contenu après connexion, enregistrement d'une correction du mode test, correction du pré-test et du post-test, écrans de l'espace Admin. **Jamais en jeu.**

### 9.11 Dialogue de confirmation

Centré, largeur 100 % − 32 px (au plus 400 px), `--surface`, rayon 16, padding 24, `--ombre-4`, sur `--voile`. Titre `--texte-titre-2`, texte `--texte-corps`, puis les boutons : sur téléphone, empilés (l'action en principal, « Annuler » en secondaire) ; au-delà de 600 px, côte à côte, l'action à droite. Le dialogue ne se ferme pas d'un toucher sur le voile quand l'action est irréversible.

### 9.12 Champs (Admin, outils du mode test)

Libellé au-dessus (13 600, `--texte`), champ 44 px de haut (plus pour un texte long), bord 1,5 px `--bordure-forte`, rayon 8, focus `--bleu` 2 px. Erreur sous le champ, en `--faux` 13 avec une icône.

### 9.13 Carte d'invitation à installer (lot 103)

Carte claire avec la matière de paillasse (§ 9.19), rayon 16, `--ombre-2`, padding 16 : titre `--texte-titre-2`, texte `--texte-corps`, bouton principal et lien d'action. Textes : ceux de la spec 103.

### 9.14 Logo

**Fourni le 17 novembre** : le logo MicroSwipe, deux fichiers PNG carrés de 1024 × 1024 px, au fond crème `#FFE9B0`, cartes bleu nuit et orange (`client/images/logo-ios.png`, dessin grand ; `client/images/logo-android.png`, dessin réduit avec une marge). Emplacements :

- **Barre du haut** : `logo-ios.png`, 36 × 36 px, rayon 10, **posé tel quel sur le bandeau `--encre`, sans pastille** (décision de l'auteur du 17 novembre : le fond crème du logo se détache du bleu nuit).
- **Écran d'ouverture** (§ 7.7) : `logo-ios.png`, 160 px de large, centré sur un fond plein **`#FFE9B0`**, le fond crème du logo (décision du 17 novembre), qui s'y fond.
- **Icône de l'appli** (lot 103) : `logo-ios.png` pour l'iPhone, `logo-android.png` pour les icônes du manifeste ; `background_color` du manifeste en `#FFE9B0`.

### 9.15 Médaillon

Le rappel du niveau en haut de la fiche : un rond de 116 px qui chevauche le bas du bandeau de gélose. Bord en plastique (dégradé clair), intérieur = gélose du monde avec son grain, et au centre :

| Cas | Contenu |
|---|---|
| Niveau joué | La colonie (54 px), avec son halo ; le voile s'il est à réviser |
| Niveau jamais joué | Un cercle pointillé blanc |
| Révélation non jouée | Une loupe blanche |
| Boss ouvert | Bord doré, intérieur sombre, bouclier doré |
| Boss verrouillé | Bord gris acier, intérieur sombre, cadenas `--gris-sur-encre` |

Il apparaît par une mise à l'échelle 0,3 → 1 (600 ms, rebond, après 200 ms) ; dans l'appli, il naît de la colonie touchée (§ 7.2).

### 9.16 Scotch

Le motif signature de l'appli (§ 3.11). Usages, et seulement ceux-là :

| Usage | Où | Couleur |
|---|---|---|
| Étiquette d'une boîte (« Monde 2 · Entérobactéries ») | Sur la boîte, vue zoomée | `--scotch` |
| Étiquette de la mécanique | Au-dessus de la colonie, vue zoomée, après la 1re partie | `--scotch` |
| « à réviser » | À la place de l'étiquette de la mécanique | `--scotch-revision` |
| Scellé d'un monde fermé | Un long ruban en travers du couvercle, qui déborde de la boîte | `--scotch` |
| Message d'un monde fermé | Un morceau écrit, sur le ruban : « Réussis le boss du monde N pour l'ouvrir. » | `--scotch` |
| Titre de la fiche et de l'écran de fin (« Monde 2 · Niveau 4 ») | Sur le bandeau de gélose, en haut à gauche | `--scotch` |
| Résumé d'un monde dans la pile (« Monde 2 ») | À cheval sur le haut de la petite fiche | `--scotch` |
| « Niveau suivant débloqué », « Monde suivant débloqué » | Écran de fin | `--scotch` |

Quand un monde s'ouvre, son scotch part avec le couvercle.

### 9.17 Tampon « Version simplifiée »

En haut à droite de la fiche, sous le bandeau ; tourné de 8° ; double filet `--orange-texte` ; fond `--orange-clair` ; Inter 800, 10 px, petites capitales espacées, sur deux lignes. **Posé, jamais animé** (décision 23).

### 9.18 Objets de paillasse

- **Un objet par monde**, toujours le même (décision 24). Liste, dans l'ordre des mondes du chemin : tube à essai, anse d'ensemencement, lame de microscope, stylo, puis lunettes de protection, papier griffonné, trace de tasse de café… **La liste s'allonge d'une ligne quand un monde s'ajoute** ; tant qu'elle est plus courte que les mondes, elle reprend au début.
- Dessinés en vectoriel, à plat avec un modelé léger et une ombre douce ; couleurs prises dans la palette de l'interface ; **jamais un contenu lisible** (le papier griffonné porte des traits et au plus « à revoir ! »).
- **Placement** :
  - vue zoomée : à côté de la boîte, à moitié caché par elle et à moitié sorti de l'écran, **du côté opposé aux résumés de la pile** (à gauche) ;
  - pile : dans la colonne des résumés, entre deux résumés, sous celui de son monde (décision 33) ;
  - fiche et écran de fin : l'objet du monde, à moitié sorti du bord, sans toucher un texte.
- Décoratifs : ignorés des lecteurs d'écran, jamais touchables.

### 9.19 Matière (paillasse, gélose)

Aucune surface n'est d'une couleur unie, sauf les bandeaux et les boutons :

- **Paillasse claire** (fiche, écran de fin, invitation) : dégradé `#F3F6FA` → `#E9EFF5` → `#E1E8F0`, une **marbrure** bleutée très légère (bruit basse fréquence, opacité ≈ 16 %), un **grain fin** (bruit haute fréquence, ≈ 9 %), une lumière douce venant du haut à gauche et une ombre bleutée en bas.
- **Paillasse sombre** (fiche du boss) : dégradé `--encre` → `#121A26`, grain fin.
- **Gélose** : le dégradé du milieu (§ 3.8) et un **grain irrégulier** clair et foncé mêlés (bruit), **jamais une grille de points** (décision 28).
- Ces textures sont des filtres de bruit fixes, posés une fois (§ 6.4).

---

## 10. La carte

### 10.1 Deux niveaux : la pile et le zoom

**La vue zoomée** (vue de jeu) :

- une boîte en plein écran (environ 360 px de large), les bords des boîtes voisines visibles en haut et en bas ;
- les étiquettes (scotch de la boîte, mécaniques, « à réviser », « Jouer »), les pastilles d'étoiles et les objets y sont visibles ;
- les niveaux y sont touchables ;
- **l'appli s'ouvre zoomée sur le monde en cours**, pour que le premier niveau se joue tout de suite ;
- **un glissement vertical** fait défiler la paillasse ; au lâcher, la caméra se cale sur le monde le plus proche ; un glissement de plus de 70 px environ passe au monde suivant ou précédent, **sans dézoomer** (décision 30) ; en butée, effet élastique (35 % du dépassement) ;
- sur ordinateur, un cran de molette passe d'un monde à l'autre.

**La pile** (vue d'ensemble) :

- les boîtes réduites (environ 190 px) en colonne à gauche ; à droite, en colonne, un **résumé** par monde, centré sur la hauteur de sa boîte (décision 33) :
  - une petite fiche blanche à 92 %, rayon 14, filet bleuté et ombre douce, contenu centré ;
  - le scotch « Monde N » à cheval sur son bord supérieur ;
  - le nom du monde (Bricolage 15 px, 700), sur une ligne, ou sur deux lignes équilibrées et centrées ;
  - la pastille d'état (§ 9.6) ;
- les objets des mondes dans la colonne des résumés, entre eux (§ 9.18) ;
- **aucune étiquette sur les boîtes** (ni scotch, ni mécanique, ni étoiles, ni « Jouer ») ; seul le scotch qui scelle un monde fermé reste visible ;
- la pile défile verticalement (indispensable à 12 mondes), avec le même effet élastique ; la molette la fait défiler ;
- toucher une boîte ou son résumé zoome sur ce monde.

**Passer de l'une à l'autre** :

- zoom : toucher une boîte ou un résumé, écarter deux doigts, ou pincer sur le pavé tactile ;
- dézoom : le bouton « Tous les mondes » (§ 9.1), rapprocher deux doigts, ou pincer sur le pavé tactile ; la pile s'ouvre centrée sur le monde qu'on quitte ;
- transition : la caméra (position et échelle de toute la carte) glisse en 700 ms, `--courbe-standard` ; les étiquettes apparaissent ou s'effacent en fondu (240 ms) ; pendant un glissement du doigt, la carte suit sans transition ;
- au changement de monde après un boss réussi, la caméra glisse jusqu'à la boîte suivante, toujours zoomée, puis le couvercle s'ouvre (§ 7.3).

**Plein écran** : la carte occupe tout l'écran ; les bandeaux sont masqués (§ 9.2, § 9.3). « Tous les mondes » flotte en bas au centre et remonte au-dessus de la navigation quand celle-ci apparaît.

### 10.2 Boîtes et monde fermé

- Une boîte par monde **visible**, construite depuis la liste des mondes du paquet, dans l'ordre du chemin (aucun monde écrit dans le code) ; le premier monde est en bas, la pile monte ; boîtes reliées par un pointillé vertical.
- Chaque boîte : ombre portée floue, bord en plastique, gélose du milieu (§ 3.8) avec son grain, reflet du couvercle, quelques gouttes de condensation, scotch « Monde N · nom » en haut à gauche (vue zoomée).
- **Monde fermé** : couvercle translucide posé sur la boîte, **scellé par un long ruban de scotch** en travers, qui déborde ; sur le ruban, un morceau de scotch écrit à la main, sur deux lignes : « Réussis le boss du monde précédent pour l'ouvrir. » (avec le numéro : « … du monde 2 … »). Aucune jauge d'étoiles. Quand le monde s'ouvre, le couvercle part avec son scotch.

### 10.3 Les colonies

- Aspect (lisse, muqueuse, rugueuse) selon le **rang du niveau dans son monde**, sans lien avec la mécanique ; boss plus grand.
- Monde maîtrisé : toutes ses colonies en `--or`.
- Points : 48 px de zone touchable (58 px pour le boss), répartis le long d'une seule strie ; le boss est au bout. Le tracé exact pour 1 à 12 niveaux est fixé par la spec 202.

### 10.4 États d'un point (vue zoomée)

| État (lot 208) | Dessin | Au-dessus |
|---|---|---|
| `reussi` | Colonie + pastille d'étoiles | Scotch de la mécanique |
| `reussi`, à réviser | Colonie + voile gris | Scotch « à réviser » (gris-bleu), à la place de celui de la mécanique |
| `ouvert`, niveau courant | Anneau `--orange` 3 px, cœur blanc, deux ondes | Étiquette « Jouer » (`--orange`, texte `#2A1600`) |
| `ouvert`, autre | Anneau `--orange` fixe | — |
| `verrouille` | Cercle pointillé blanc | — |
| `verrouille`, révélation | Loupe dans un cercle pointillé | — |
| Boss `verrouille` | Bouclier dans un cercle pointillé ; pastille « ★ 9 / 12 » dessous si seules les étoiles manquent | — |
| Boss `ouvert` | Bouclier, anneau `--orange` et ondes s'il est le niveau courant | — |
| Boss `reussi` | Colonie de boss en `--or`, bouclier doré, meilleur score en % | — |
| Monde maîtrisé | Colonies en `--or` ; scotch de la boîte « Monde N · maîtrisé » | Scotch de la mécanique |

Libellés pour les lecteurs d'écran : « Niveau 4 : <titre>, réussi, 2 étoiles », « Niveau 5, verrouillé », « Boss : <titre>, réussi, 92 % ».

**Monde maîtrisé** (décision 6) : boss réussi **et** chaque niveau jouable du monde à 3 étoiles. Calculé par le lot 208 (champ `maitrise` de l'état de la carte, spec amendée le 17 novembre), sans rien stocker ; un niveau non jouable ne compte pas. **Il reste rejouable** : ses niveaux s'ouvrent et se rejouent comme tout niveau réussi (décision 34).

### 10.5 Toucher un point

- `reussi` ou `ouvert` : ouvre la fiche (§ 7.2).
- `verrouille`, niveau normal ou révélation : annonce « Réussis le niveau précédent » (§ 9.9).
- Boss `verrouille` : ouvre la fiche du boss verrouillé (§ 11).
- Point d'un monde fermé : non touchable (sous le couvercle).

### 10.6 Fiche de paillasse d'un niveau

Référence visuelle : planche E1 et fiche de la planche « B + D ». De haut en bas :

1. **Bandeau de gélose** (132 px, rayon 26 en haut) : la couleur du milieu du monde (décision 35), son grain, un reflet, la poignée ; le scotch « Monde 2 · Niveau 4 » en haut à gauche, tourné de −4° ; le bouton « Fermer » en haut à droite.
2. **Médaillon** (§ 9.15), centré, à cheval sur le bas du bandeau.
3. **Tampon** « Version simplifiée » (§ 9.17) à droite du médaillon, s'il y a lieu.
4. **Titre** (Bricolage 27 px, 700), centré ; dessous, la mention en italique (§ 9.7) s'il y a lieu.
5. **Trio d'étoiles** (§ 9.5), avec les pourcentages lus dans `Reglages`.
6. **Règle du jeu** : un bloc blanc translucide (rayon 18, filet bleuté, ombre douce), avec :
   - le nom de la mécanique en étiquette `--encre` / `--creme` à cheval sur son bord supérieur (§ 9.4) ;
   - le **geste mimé** de la mécanique : pour le Swipe, une petite carte qui part vers « Oui » puis vers « Non », deux cibles qui s'allument quand elle arrive ; trois fois, puis immobile. Chaque mécanique aura son geste mimé, dessiné avec sa spec ;
   - la **consigne**, lue dans les données, 14 px, centrée, en lignes équilibrées.
7. **Repères** : « 12 questions » et « Meilleur : 2 étoiles » (ou « Pas encore joué »), 13 px, `--texte-2`, centrés.
8. **Bouton principal** « Jouer » ou « Rejouer » (§ 9.1), en bas.
9. **Lien d'action** « Revoir les fiches espèces », seulement si le niveau mène à au moins une fiche débloquée.

Fond : paillasse claire (§ 9.19), avec l'objet du monde (§ 9.18).

---

## 11. Fiche du boss

Raisons du verrouillage calculées par la progression (spec 208, § 6.4, règle 7) ; référence visuelle : planche E2 et fiche du boss de la planche « B + D ».

### 11.1 Ce qui change par rapport à la fiche d'un niveau

- **Paillasse sombre** (§ 9.19), texte blanc, secondaire `--gris-sur-encre`.
- Bandeau : la gélose du monde, assombrie vers le haut, avec une lueur dorée en bas.
- Scotch « Monde 2 · Boss » ; au-dessus du titre, le mot « BOSS » (11 px, 800, petites capitales, `--orange-sur-encre`).
- Médaillon de boss (§ 9.15). Pas de tampon, pas d'étoiles, pas de règle du jeu ni de repères.

### 11.2 Boss ouvert ou réussi

- **L'enjeu en deux grands chiffres**, côte à côte, séparés par un filet : « 20 » (« questions ») et « 90 % » en `--orange-sur-encre` (« pour ouvrir le monde suivant »). Bricolage 40 px ; légendes 13 px `--gris-sur-encre`. Les nombres viennent de `Mondes`.
- S'il a été joué : « Meilleur score » et une barre de 10 px, remplie en or jusqu'au meilleur score, avec un trait blanc au seuil.
- Bouton **Boss** « Jouer » (§ 9.1).

### 11.3 Boss verrouillé

À la place de l'enjeu, une **liste de conditions** : une ligne par condition, dans un cadre `rgba(255,255,255,.06)` (rayon 16), avec une pastille d'état (rond plein `#3A6FE6` et coche blanche si la condition est remplie, cercle `#8C96A6` sinon) et son texte en 15 px :

| Raison (spec 208) | Ligne affichée | Quand |
|---|---|---|
| `niveaux` | « Réussis tous les niveaux du monde (4 / 5) » | toujours affichée, cochée si la raison est absente |
| `etoiles` | « Étoiles : 9 / 12 », avec une rangée de petites étoiles (pleines pour les étoiles gagnées) | affichée si `etoilesRequises` n'est pas nul, cochée si la raison est absente |
| `monde_ferme` | « Ouvre d'abord ce monde » | seulement si la raison est présente |

- Pas de bouton. Si seules les étoiles manquent, une phrase en bas : « Gagne encore 3 étoiles en rejouant des niveaux. » (texte confirmé le 17 novembre).
- **Raison de données** (`regles` ou `reserve`) : la liste est remplacée par « Ce boss n'est pas encore prêt. » ; le code n'apparaît qu'en mode test (§ 12.4).
- Quand toutes les conditions sont remplies, le boss n'est plus verrouillé : la fiche devient celle du boss ouvert.

## 12. Mode test

### 12.1 Bannière (spec 213, § 6.4)

- En haut de **tous** les écrans tant que le mode test est actif, au-dessus de tout (plan 70), sous la marge de sécurité. **Les écrans se décalent vers le bas de la hauteur de la bannière** : elle ne recouvre aucune commande.
- Fond `--orange-fonce`, texte blanc. Hauteur fixe : 44 + 28 px, pour que rien ne saute quand la seconde ligne se remplit.
- **Ligne 1** (44 px) : « Mode test » (15 700) à gauche ; à droite, le bouton « Outils » (phase 3, § 12.5 ; visible pendant une question seulement) puis le bouton « Quitter » (bouton à contour blanc 1,5 px, texte blanc, 44 px de haut).
- **Ligne 2** (28 px) : le texte de l'état de la question (spec 213, § 6.8), en police à chasse fixe 13 px, sur une ligne, coupé par des points de suspension ; un toucher la déplie en entier sur plusieurs lignes, un second la replie. Vide hors d'une question.
- Elle n'affiche **que des identifiants, des nombres et des codes**, jamais un énoncé, une réponse ni une valeur.

### 12.2 Textes (confirmés, décision 14)

| Endroit | Texte |
|---|---|
| Navigation | « Admin » |
| Bouton de l'écran Admin | « Entrer en mode test » |
| Bannière | « Mode test » ; bouton « Quitter » |
| Refus | « Ce compte n'a pas le droit de contenu. » |
| Paquet indisponible ou inattendu | « Mode test indisponible : le contenu admin n'a pas pu être chargé. » |

Les deux messages d'échec s'affichent dans un encadré d'erreur sur l'écran Admin.

### 12.3 Carte du mode test

- Même carte, construite sur le paquet « admin » (spec 213, § 6.5).
- Tous les mondes ouverts : aucun couvercle. Un monde invisible garde sa boîte, son étiquette porte « · invisible » à la fin.
- Points ouverts : anneau `--bleu` fixe, sans ondes ni étiquette « Jouer » (il n'y a pas de niveau courant). Points non jouables : cercle pointillé. Aucune étoile, aucune pastille ; pas de total d'étoiles dans la barre du haut.
- Aucune animation de réussite après une partie de test.

### 12.4 Fiche en mode test

Après les blocs habituels, un **bloc Admin** : fond `--surface-2`, bord pointillé 1,5 px `--orange-fonce`, rayon 14, titre « Admin » (12 700, `--orange-fonce`), puis les lignes de la spec 213 (§ 6.8) en chasse fixe 13 :

- « Internes : 3 questions servies sur 5 prévues » ;
- une ligne par question écartée : « Q-000012 : <motif> » ;
- sur la fiche du boss : une ligne par anomalie (code de la spec 208, § 6.3).

### 12.5 Outils de correction (phase 3, lot 315)

- Le bouton « Outils » de la bannière ouvre une **fiche d'actions** (§ 9.8). Pendant ce temps, la question reste en place et le chronomètre éventuel est arrêté.
- Actions, une ligne de 56 px chacune (icône, libellé 15 600, chevron) : **Corriger la rédaction**, **Corriger la réponse**, **Suggérer une correction**, **Archiver la question**, **Valider**.
- Chaque action ouvre un écran de la même fiche, avec ses champs (§ 9.12) et un bouton principal.
- **Corriger la réponse** : avant d'enregistrer, un dialogue (§ 9.11) : « Cette correction touche N questions. Elles sortent du jeu des internes jusqu'à validation. », boutons « Enregistrer » et « Annuler ».
- **Valider** : bouton principal « Valider · <source>, p. <page> » (par exemple « Valider · Source fictive 2026, p. 12 »), la source et la page venant du fait testé.
- **Archiver** : dialogue de confirmation ; ne se ferme pas d'un toucher sur le voile.
- **Enregistrement** : le bouton passe à « Enregistrement… » avec l'indicateur (§ 9.10) ; réussite → annonce « Enregistré » ; échec → encadré d'erreur dans la fiche, rien n'est perdu de la saisie.
- Les autres textes (libellés des champs, titres des écrans, confirmation d'archivage, suggestion) sont à écrire dans la spec 315 et à faire confirmer.
- **En phase 2** (lot 213), le bouton « Outils » n'existe pas.

---

## 13. Espace Admin

### 13.1 Accès et accueil

- Cinquième entrée « Admin » de la navigation, pour un compte qui a le droit « contenu ».
- **Écran Admin** : une liste d'entrées, une ligne de 56 px chacune (titre 15 600, sous-titre 13 `--texte-2`, chevron) : « Entrer en mode test » (bouton principal, spec 213), « Recalcul de l'ELO » (lot 403), « Import annuel » (lot 505) ; les entrées du lot 501 s'y ajoutent.
- Les écrans Admin autres que l'entrée du mode test demandent du réseau ; le texte affiché hors ligne est à écrire dans la spec 501.

### 13.2 Mise en page (décision 16)

- **Pensés pour l'ordinateur** : au-delà de 1 024 px de large, l'écran Admin s'élargit à 1 200 px au plus, avec la liste des entrées en colonne de gauche (240 px) et l'écran ouvert à droite. La navigation du bas reste affichée.
- **Sur téléphone** : une colonne ; les tableaux défilent horizontalement dans leur cadre ; la comparaison passe en blocs empilés (§ 13.5).
- Indicateurs de chargement permis (§ 9.10).

### 13.3 Tableau

- En-tête collant, fond `--surface-2`, texte 12 700 `--texte-2`.
- Première colonne (identifiant ou onglet) collante à gauche, en chasse fixe.
- Lignes d'au moins 44 px, séparées par 1 px `--bordure` ; une ligne sur deux en `#F7F9FB`.
- Nombres alignés à droite, en chiffres à chasse fixe. Un nombre **touchable** (ouvre un détail) est un lien `--bleu` souligné, avec 44 px de zone de toucher ; un zéro n'est pas touchable et s'affiche en `--texte-3`.
- Sur téléphone, le cadre défile horizontalement, avec une ombre sur le bord qui cache encore des colonnes.

### 13.4 Liste paginée

- 50 éléments par page.
- En bas : bouton secondaire « Précédent », texte « Page 2 sur 7 », bouton secondaire « Suivant » ; boutons désactivés aux extrémités.
- Changement de page : indicateur dans la liste le temps du chargement, puis retour en haut de la liste.

### 13.5 Comparaison de trois valeurs (lots 505 et 506)

Pour chaque colonne changée d'une ligne :

- Nom de la colonne en 13 700.
- **Trois blocs** : « Référence » (`--revision`, texte `#2E3A4B`), « Contenu actuel » (`--bleu-clair`, texte `--bleu-presse`), « Copie » (`--orange-clair`, texte `--orange-texte-fort`). **Le libellé est toujours écrit** au-dessus de chaque valeur : la teinte ne fait que l'accompagner.
- Côte à côte au-delà de 768 px (trois colonnes égales), empilés en dessous, dans cet ordre.
- Une valeur qui diffère de la référence est en gras, précédée d'un point « modifié » (rond plein 6 px de la couleur du texte) et lue « modifiée » par les lecteurs d'écran.
- Valeur vide : « (vide) » en italique `--texte-3`. Texte long : retour à la ligne, jamais tronqué.
- **Conflit** (lot 506) : sous la comparaison, deux boutons de choix côte à côte (empilés sur téléphone), libellés de la spec 506. **Aucun n'est choisi par défaut.** Le choix fait : bord 2 px `--bleu`, coche, fond `--bleu-clair`.
- « Contenu actuel » est le libellé affiché de la **production** des specs 505 et 506.

### 13.6 Avancement (import, recalcul)

- Barre de progression (6 px, rayon pastille, `--bleu` sur `--surface-2`, remplie par l'échelle) quand le total est connu (« étape 3 sur 12 ») ; sinon indicateur du § 9.10. Toujours avec le texte de la spec (« Garde cet écran ouvert. »).
- Pendant l'avancement, tous les autres boutons de l'écran sont désactivés.
- Interruption : encadré d'erreur et bouton « Reprendre ».

### 13.7 Écrans et textes

- **Recalcul de l'ELO** : déroulé et textes de la spec 403, § 6.9. Confirmation par le dialogue du § 9.11 (« Lancer », « Annuler »).
- **Import annuel** : déroulé et textes des specs 505 (§ 6.10) et 506 (§ 6.9). « Abandonner cet import » est un bouton de danger ; « Appliquer l'import » ouvre un dialogue qui rappelle les totaux.
- Les textes de ces specs marqués « à confirmer » le restent : ce document n'en tranche aucun.

---

## 14. Écrans de jeu et écran de fin

### 14.1 Cadre commun des écrans de jeu

Les mécaniques ont leurs specs (204 à 206 et suivantes) ; ce document fixe le cadre. **Leur direction visuelle reste à maquetter** (§ 15), au niveau de la direction seulement.

- **Fond** : paillasse claire (§ 9.19), jamais la gélose du monde (décision 12).
- **En haut** : un bouton icône « Quitter la partie » et la progression de la partie, barre de 6 px et « 3 / 12 » en chiffres à chasse fixe.
- **Au milieu** : la question (`--texte-question`), le dessin ou la carte.
- **En bas, sous le pouce** : les commandes (boutons de direction du swipe aux bords, choix de QCM empilés de 52 px, cibles de tri).
- **Choix de QCM** : après la réponse, le choix juste en `--juste-clair` avec une coche, le choix faux en `--faux-clair` avec une croix.
- **Signaler une erreur** : lien d'action discret, accessible pendant et après la question (lot du signalement).
- Aucun indicateur de chargement, aucune attente serveur.

### 14.2 Écran de fin de niveau

Référence visuelle : planche E3 et écran de fin de la planche « B + D ». Plein écran, paillasse claire avec l'objet du monde.

1. Le scotch « Monde 2 · Niveau 4 », en haut, légèrement de travers.
2. **La boîte** (236 px) avec la gélose du monde et un bout de strie ; **la colonie y pousse** (échelle 0,05 → 1,08 → 1, 700 ms, rebond, après 200 ms). Au boss : un bouclier doré à la place de la colonie.
3. **Le trio d'étoiles**, sous la boîte, sans la chevaucher (§ 9.5), qui se remplit gauche, droite, milieu (§ 14.3). Pas d'étoiles au boss.
4. **Le score** (Bricolage 60 px) et dessous « 10 bonnes réponses sur 12 » (au boss : « Boss réussi » ou « Pas encore »).
5. Ce que la partie débloque, sur un scotch : « Niveau suivant débloqué » ; au boss, « Monde suivant débloqué » (texte confirmé le 17 novembre).
6. En bas : **« Continuer »** (bouton principal, flèche) et **« Rejouer »** (secondaire). « Continuer » ramène à la carte, où jouent les animations du § 7.3.

### 14.3 Rythme de l'écran de fin

| Étape | Début | Durée |
|---|---|---|
| Fondu de l'écran | 0 | 300 ms |
| Colonie qui pousse | 200 ms | 700 ms |
| Étoile de gauche, puis de droite, puis du milieu | 850 ms, 1 200 ms, 1 550 ms | 420 ms chacune |
| Score | 2 000 ms | 400 ms |
| Scotch « … débloqué » | 2 250 ms | 400 ms |

Les boutons sont actifs dès l'ouverture. Un toucher ailleurs saute à l'état final.

---

## 15. Points ouverts et suites

1. ~~**Logo**~~ : fourni le 17 novembre (§ 9.14) ; écran d'ouverture crème, logo sans pastille dans la barre du haut.
2. **Milieux des mondes 4 à 12** : à fournir par l'auteur ; d'ici là, clé `neutre`.
3. ~~**Spec 102 à amender**~~ : amendée le 17 novembre (clés `sang`, `bcp`, `chocolat`, `neutre`).
4. ~~**Monde maîtrisé**~~ : défini (décision 6), rejouable (décision 34), **calculé par la spec 208** (amendée le 17 novembre : boss réussi et 3 étoiles à chaque niveau jouable).
5. ~~**Textes à confirmer**~~ : confirmés le 17 novembre : « Gagne encore N étoiles en rejouant des niveaux. » (boss verrouillé) ; « Monde suivant débloqué » (fin du boss) ; « N bonnes réponses sur M » (fin de niveau) ; « N questions » et « X % pour ouvrir le monde suivant » (fiche du boss). « Tirées au hasard » est retiré, à la demande de l'auteur.
6. **Enchaînement après une réponse** (délai, explication automatique ou sur appui) : à trancher dans la spec 204.
7. **Écrans de jeu** (Swipe, QCM, Tri, Intrus, Révélation, explication, re-test) : direction visuelle à maquetter avant la spec 204, au niveau de la direction seulement. Le geste mimé de chaque mécanique (§ 10.6) se dessine avec elle.
8. **Onglets Modes, Collection, Profil, écran d'ouverture, connexion, espace Admin** : pas encore maquettés.
9. **Textes des outils du mode test** autres que les deux confirmés : spec 315. **Texte hors ligne de l'espace Admin** : spec 501. **Icône de l'entrée Admin** : lot 501.
10. **Filtres de bruit** (grain, marbrure) : rendu et fluidité à vérifier sur iPhone et Android au lot 108 ; si le coût est trop élevé, une image de bruit précalculée, hébergée dans le dépôt, les remplace.
11. **Sons** : sans lot. **Indice de certitude** (P3) : réservé, sans lot.
12. ~~**Briefing § 6 à aligner**~~ **Fait le 17 novembre** (le briefing § 6 résume ces décisions et renvoie ici) : fond clair à matière, encre et crème, scotch, objets de paillasse, carte à deux niveaux (pile et zoom), bandeaux masqués, étiquette de la mécanique sur la carte après la 1re partie, fiche de paillasse, monde maîtrisé défini et rejouable, vert et rouge permis pour le retour juste / faux.
13. **Finitions** (alignements, rythmes, tailles) : sur l'appli réelle, lot par lot, à partir de ce que l'auteur voit sur son téléphone. La toile n'est plus retouchée pour des détails.

### Ce que les lots en tirent

| Lot | Ce qu'il prend ici |
|---|---|
| 103 | Logo à l'ouverture (§ 7.7), carte d'invitation (§ 9.13), polices dans le cache (§ 4.1) |
| 105 | Variables des § 3 à § 6, composants du § 9 (boutons en relief, scotch, étoiles, matière, médaillon, tampon, objets) |
| 106 | Barre du haut et navigation masquables (§ 9.2, § 9.3), changements d'écran (§ 7.6), plans (§ 5.4) |
| 108 | 60 images par seconde (§ 6.4), coût des filtres de bruit (§ 15, point 10), vibration |
| 202, 203 | Carte à deux niveaux et défilement (§ 10), fiche de paillasse (§ 10.6), fiche du boss (§ 11) |
| 204 à 206 | Cadre de jeu (§ 14.1), swipe (§ 7.4), retour (§ 7.5), dessins (§ 3.9), geste mimé de la mécanique (§ 10.6) |
| 207, 208 | Écran de fin (§ 14.2), libellés des raisons du boss (§ 11.3) |
| 211, 212 | Révélation, animations de la carte (§ 7.3), monde maîtrisé (§ 10.4) |
| 213, 315 | Mode test (§ 12) |
| 403, 501, 505, 506 | Espace Admin (§ 13) |
