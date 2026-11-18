# Briefing complet — Application Microbio (état au 17 novembre 2026, après la conversation de remise à jour)

Document de reprise pour continuer le projet dans une autre conversation. Toutes les décisions ci-dessous ont été validées explicitement par l'auteur, sauf mention « À définir », « Ouvert » ou « À confirmer ».

**Historique** : phase 0, lot 1 (13 novembre : mondes, boss, architecture, améliorations, circuit de contenu) ; mode test (14 novembre) ; lot 2 (14 novembre : architecture et schéma) ; lot 4a (15 novembre : `CLAUDE.md`, dessins de bactéries).
**Mise à jour du 17 novembre (conversation de remise à jour)** : alignement sur les specs écrites depuis le 15 novembre (lot 4b, conversations 2 à 5 ; conversations A, B et C ; cadrage du lot 611). Principaux changements : nom **MicroSwipe** et logo (§ 1) ; un seul ELO, que la campagne ne fait pas bouger (§ 3, § 4) ; règles du boss et niveau partiellement validé (§ 5) ; § 6 réduit à un résumé, le design system faisant référence ; mécanique « Construis l'antibiogramme » (§ 7, J17) ; G14 (§ 9) ; import à trois états et limites de l'évolutivité (§ 10 bis) ; architecture (§ 10 quater) ; points ouverts refaits (§ 13).

**Version du dépôt, sans contenu médical** (§ 11 et exemples médicaux retirés). Elle est tirée de la version complète, gardée dans le projet claude.ai : ne la corrige pas ici, signale l'écart à l'auteur.


---

## 0. Règles de travail avec Claude

- **Ne rien générer sans accord explicite** (code, maquettes, contenu). L'auteur veut réfléchir avant de produire.
- L'auteur fait attention à son quota d'utilisation : aller droit au but.
- Exigence de fiabilité très élevée (> 99 %) : signaler toute incertitude plutôt que deviner, vérifier le contenu médical contre les sources.
- Tutoiement, en français.
- Les décisions se présentent une par une, avec une recommandation et sa raison en une ligne ; l'auteur valide ou refuse.

---

## 1. Le projet

- **Objectif** : application d'apprentissage de la microbiologie, puis de l'infectiologie, à difficulté croissante, très gamifiée, avec des formats de jeu variés.
- **Public** : tous les internes de médecine et jeunes médecins, avec une **orientation Guadeloupe** : Kp BLSE en microbiologie, dengue et leptospirose en infectiologie.
- **Diffusion** : application **autonome** pour ceux qui ne veulent que celle-ci, **et accessible depuis Carnet Réa** pour ceux qui y sont inscrits.
- **Gram Swipe** (prototype, niveaux 1 et 2) devient **une des mécaniques de jeu** de l'application.
- **Nom affiché : MicroSwipe** (décidé le 16 novembre), partout où l'interne le voit ; nom complet « MicroSwipe – Réanimation Guadeloupe ». Adresse `https://chugicu.github.io/microswipe/`, dépôt `chugicu/microswipe`. Les noms internes ne changent pas : base locale `microbio`, préfixe `microbio-`, « Application Microbio » dans les documents.
- **Identité** (décidé le 17 novembre) : le **logo MicroSwipe** remplace le logo Réanimation Guadeloupe. Deux fichiers PNG de 1024 × 1024 px, fond crème `#FFE9B0`, cartes bleu nuit et orange : une version pour l'iPhone (dessin grand) et une pour Android (dessin réduit, avec une marge). Affiché **en grand environ une seconde à chaque ouverture**, sur le fond crème, passable d'un toucher ; un interrupteur des admins le coupe pour tous (§ 10 bis). Détail : `docs/specs/lot-103.md`, `docs/design-system.md` § 9.14.
- **Évolutivité** (exigence de fond, voir § 10 bis) : l'appli doit pouvoir accueillir de nouveaux mondes, l'infectiologie, les mises à jour annuelles du tableur, de nouvelles rubriques et d'autres tableurs, avec le moins de code possible.

---

## 2. Règles pédagogiques de fond

1. **La pédagogie prime sur la gamification.** Le moins possible de systèmes de progression, pour ne pas embrouiller les internes.
2. **Simplifier par omission, jamais par une affirmation fausse.**
3. Un niveau simplifié **annonce qu'il est simplifié, sans dire ce qui est simplifié** (sinon on aborde la notion qu'on voulait éluder). Texte type : « Version simplifiée — Certaines nuances t'attendent plus loin dans le jeu. » Un niveau est annoncé simplifié si sa colonne `Simplifié` vaut `oui` **ou** si une de ses questions est simplifiée.
4. Les **fiches espèces** suivent la même règle : elles se remplissent au fil des notions rencontrées.
5. Les **niveaux « révélation »** restent muets tant qu'ils n'ont pas été joués.
6. **Dessins de bactéries** (règles cumulées le 15 novembre) :
   - si la question porte sur le Gram, le dessin n'est jamais rose, violet, rouge ni vert ; il est d'une couleur unique ou de couleurs aléatoires ;
   - si la question porte sur la forme (bacille ou cocci), le dessin est de forme générique, ni ronde ni en bâtonnet allongé ;
   - si la question porte sur les deux, les deux règles s'appliquent ;
   - le dessin n'est **jamais teinté par le retour juste / faux** (décidé le 16 novembre). Palette des dessins : `docs/design-system.md` § 3.9.
7. **Questions simplifiées** : elles n'existent que dans la campagne (mode histoire). Les autres modes ne contiennent que des questions vraies sans simplification.

---

## 3. Les modes de jeu

Effets sur l'ELO (décidés le 16 novembre ; tableau de référence : `EFFETS_ELO_PAR_MODE`, `docs/specs/lot-401.md` § 6.3) :

| Mode | Fait bouger l'ELO de l'interne | Étalonne les questions | Marque « déjà vue » | Qui choisit les questions |
|---|---|---|---|---|
| **Histoire / campagne** (les mondes) | **non** | oui, sauf les questions simplifiées | oui | fixé par le niveau, identique pour tous (sauf le boss, tiré dans une réserve) |
| **Classé** (toutes les questions du jeu mélangées) | **oui**, à chaque réponse, question déjà vue ou non | oui | oui | l'appli, autour de l'ELO de l'interne |
| **Entraînement** (sans chrono, avec explications) | non | oui, avec un poids réduit | oui | l'interne, par fourchette d'ELO, avec un filtre possible par thème, par mécanique, ou sur son **carnet d'erreurs** |
| **Sprint** : 1, 3 ou 5 min, 3 erreurs permises | non, records à part | non | oui | l'appli, difficulté croissante |
| **Survie** : sans chrono, 3 vies | non, records à part | non | oui | l'appli, difficulté croissante |
| **Bactérie du jour** (P8) | non | non | oui | répétition espacée (Leitner) |
| **Duel asynchrone** (J13) | non | non | oui | même série de 10 cartes pour les deux internes |
| **Pré-test** (P7) | **oui**, à partir de la valeur de départ | non | non | le serveur |
| **Post-test** (P7) | non | non | non | le serveur |
| **Mode test** (admins seulement, § 10 quinquies) | rien ne compte, rien n'atteint le journal | non | non | l'admin, librement, y compris questions non validées et mondes invisibles |

- Seul un interne **sorti de sa période provisoire** étalonne les questions (§ 4). Le re-test immédiat n'a aucun effet.
- Tous les modes sont **ouverts d'emblée** (sauf le mode test, réservé aux admins). C'est l'ELO qui fait office de filtre : les notions avancées ont un ELO élevé et n'arrivent qu'aux internes qui ont réussi les questions précédentes.
- Pas d'étiquettes en sprint ni en survie (trop lentes). Le swipe et le QCM s'y prêtent bien.
- Les modes hors campagne ne puisent que dans les questions des **mondes visibles** (décidé le 13 novembre, voir § 10 bis). Le monde d'une question est son **monde de rattachement**.
- Tout mode nouveau, ou écrit autrement (`classé`, `entraînement`, `pré-test`, `post-test` portent un accent ou un tiret), demande sa ligne dans `EFFETS_ELO_PAR_MODE` ; sinon il n'a aucun effet sur l'ELO.

---

## 4. Le système ELO

Décidé le 16 novembre (lot 4b, conversation 5) ; détail : `docs/specs/lot-401.md`, `lot-402.md`, `lot-403.md`.

- **Un seul ELO par interne**, global et affiché. Pas d'ELO par thème. **La campagne ne le fait jamais bouger** : elle sert à étalonner les questions. Côté interne, seuls le **classé** et le **pré-test** comptent.
- **Affichage** : une ligne dans Profil, `ELO 1012 · provisoire`, puis `ELO 1012` ; rien tant qu'aucune réponse n'a compté.
- **Départ** : les réponses du pré-test passent par le même calcul que celles du classé, à partir d'une valeur de départ unique (`elo.interne.depart`), et comptent dans la période provisoire. Sans pré-test, l'interne reste à la valeur de départ, en provisoire.
- **Modèle** : l'interne et chaque question ont un ELO. Probabilité de réussite avec correction du hasard :
  P = c + (1 − c) / (1 + 10^((D − E) / 400)), avec E = ELO de l'interne, D = ELO de la question, **c = 1 / nombre de réponses proposées**. Ce nombre (directions du swipe, choix du QCM, cases du tri) est donné par la mécanique, envoyé avec chaque réponse et gardé dans le journal (entier de 2 à 100).
- **Facteur K par tranches** du nombre de réponses, une clé pour l'interne et une pour les questions (format `0:K;N:K`). **Période provisoire** : une clé à part ; l'ELO y bouge vite et est affiché comme provisoire. En mode classé, viser environ 70 à 75 % de réussite.
- **Étiquettes et réponses multiples** : score partiel (7 sur 8 bien placées = 0,875).
- **Indice de certitude** (P3) : il agit sur les étoiles et les points des niveaux où il est activé, **jamais sur l'ELO**.
- **Étalonnage des questions** :
  - à partir de la campagne (questions non simplifiées), du classé et de l'entraînement (poids réduit, `elo.question.poids_entrainement`) ;
  - **seulement par un interne sorti de sa période provisoire**, dans les trois modes ;
  - **seule la première réponse** d'un interne à une question peut étalonner. Une question est « déjà vue » dès la première réponse de l'interne, quel que soit le mode, sauf au pré-test et au post-test, même si cette réponse n'a pas étalonné ; elle n'étalonnera plus jamais pour cet interne ;
  - jamais à partir du sprint, de la survie, de la bactérie du jour, du duel, du pré-test, du post-test, du re-test ni du mode test ;
  - une question simplifiée n'est jamais étalonnée.
- **Garde-fous** :
  - difficulté de départ des questions fixée par l'équipe, par **paliers** (colonne `Palier` ; ELO de départ dans `elo.paliers`). Une question sans palier lisible ne compte pas pour l'ELO ;
  - **les paliers pèsent durablement** : avec 30 à 150 internes, les réponses sont trop peu nombreuses pour étalonner seules ; le K côté questions est faible ;
  - un **plancher** pour les notions avancées : la colonne `Plancher` d'une question contient un **nom**, dont la valeur est dans `elo.planchers` (jamais un nombre saisi question par question). L'interne n'a pas de plancher.
- **Sept clés dans l'onglet Reglages** : `elo.interne.depart`, `elo.interne.k`, `elo.interne.provisoire`, `elo.question.k`, `elo.question.poids_entrainement`, `elo.paliers`, `elo.planchers`. **Aucune valeur dans le code** ; elles sont chiffrées **par simulation** d'internes fictifs (lot 5, après le lot 401), puis saisies par l'auteur. Réglage absent ou illisible : aucun ELO n'est calculé, aucune valeur de secours ; le serveur note « ELO à recalculer ».
- **ELO officiel calculé par le serveur** à la synchronisation, **dans l'ordre de réception** ; le téléphone affiche une estimation, corrigée à la synchronisation. **Recalcul complet** depuis le journal, lancé par un bouton de l'espace Admin (droit « contenu ») : il ne recalcule que l'ELO.
- Une question simplifiée et sa version complète sont **deux questions distinctes**, chacune avec son ELO.
- **Une question modifiée garde son ELO** (y compris lors de la mise à jour annuelle du tableur), grâce à son identifiant stable. **Exception** (décidée le 17 novembre, lot 611) : quand la liste des lignes posées d'une question « Construis l'antibiogramme » change, la question ne garde pas son ELO ; détail à fixer dans la spec 611.
- **Classement** :
  - un seul classement, sur l'ELO ;
  - inscription sous prenom.nom (comme Carnet Réa), avec un **pseudo possible** pour le classement ;
  - chaque interne peut **refuser d'y apparaître**, et dans ce cas il **ne voit pas le classement** ;
  - pas de classement par semaine, par promo ni par semestre, pas de saison, pas de remise à zéro.

---

## 5. Progression dans la campagne

Détail : `docs/specs/lot-201.md`, `lot-208.md`.

- **Étoiles** par niveau : trois seuils dans l'onglet Reglages (`etoiles.seuil_1`, `etoiles.seuil_2`, `etoiles.seuil_3` ; valeurs prévues 60 %, 80 %, 100 %, saisies par l'auteur). **Tant qu'ils manquent ou sont illisibles, le serveur ne sert aucun contenu** ; les téléphones gardent celui qu'ils ont.
- **Score** = somme des résultats / nombre de questions, hors re-test. **Niveau réussi** = une partie terminée avec au moins une étoile ; un niveau réussi ne se referme jamais, même si un niveau est inséré avant lui.
- **Niveau partiellement validé** (décidé le 15 novembre) : il se joue avec les questions servies ; il n'est fermé que s'il n'en reste aucune, et le chemin le saute alors.
- **Passage d'un monde au suivant** :
  - **le boss s'ouvre** quand **tous les niveaux jouables du monde sont réussis et** que les étoiles du monde atteignent `Étoiles pour le boss` (onglet Mondes) ;
  - **réussir le boss** (seuil `Seuil du boss` de Mondes ; au moins 90 % prévu) **ouvre le monde suivant**.
- **Boss** :
  - un nœud boss par monde ; ses questions sont **tirées sans remise dans une réserve à chaque tentative** (pas de série fixe, pour empêcher la mémorisation) ; la réserve est la liste des questions placées dans le niveau boss (onglet Composition) ;
  - nombre de questions : colonne `Questions du boss` de Mondes (recommandation : 20). **Si la réserve servie compte moins de questions, le boss est fermé** et le monde suivant ne s'ouvre pas ; prévoir une réserve plus large que le tirage ;
  - colonnes du boss vides ou illisibles, ou monde sans boss : boss fermé, monde suivant fermé. L'interne voit « Ce boss n'est pas encore prêt. » ; la raison n'apparaît qu'en mode test ;
  - **pas d'étoiles au boss** : il est réussi ou non, on garde son meilleur score (en %) ;
  - **pas de boss cumulatif** : le boss ne porte que sur son monde (refusé le 13 novembre) ;
  - pas de re-test immédiat au boss ;
  - le « super boss BHRe » de fin de parcours (ex-J12) est abandonné.
- **Monde maîtrisé** (décidé le 16 novembre) : boss réussi **et** 3 étoiles à tous les niveaux du monde. Il reste rejouable. Aucune spec ne le calcule encore (§ 13).
- **Monde fermé** : « Réussis le boss du monde N pour l'ouvrir. », sans jauge d'étoiles.
- Les niveaux restent **rejouables** : on garde les meilleures étoiles et le meilleur score.
- **XP** : système prévu mais **désactivé au lancement** (voir § 9, G1). Pas de grades.
- **Contamination (révision)** : un niveau réussi se couvre peu à peu d'un voile gris duveteux, et le rejouer l'efface.
  - **Déclencheurs** : le temps écoulé, avec des intervalles qui s'allongent à chaque réussite (environ 7 jours, puis 3 semaines, puis 2 mois), et le score (un niveau gagné avec une seule étoile se contamine plus vite).
  - **Conséquence** : purement visuelle, sans perte d'étoiles ni d'ELO.
- **Palier de progression** (P5) : Gram → groupes de résistance naturelle → résistances naturelles → phénotypes acquis → thérapeutique. Les 12 mondes du § 5 bis suivent cet ordre.

---

## 5 bis. Les mondes de la microbiologie (décidé le 13 novembre)

**12 mondes, un seul chemin.** Chaque monde porte un champ « parcours » (microbiologie ou infectiologie) pour accueillir l'infectiologie plus tard.

| # | Monde | Contenu | Mécaniques (à préciser dans les specs) | Contenu disponible dans le tableur v6 |
|---|---|---|---|---|
| 1 | Gram et forme | Gram + / −, cocci ou bacille, aérobie ou anaérobie, atypiques | Gram Swipe (J1, niveaux 1 à 3), swipe cocci/bacille (J1 bis, simplifié), intrus, QCM | Oui, sauf atypiques |
| 2 | Entérobactéries | 3 groupes simplifiés, puis leurs résistances naturelles hors bêta-lactamines (colistine, aminosides) | Tri (J6, arbre limité aux entérobactéries), Piège ou pas (J2), intrus, vrai/faux éclair (J16) | Oui (24 taxons) |
| 3 | Autres Gram négatifs | Non fermentants, Haemophilus, Neisseria, Moraxella, Campylobacter, Pasteurella, Aeromonas, Vibrio | J2, J6 (arbre étendu aux BGN), intrus, J16, **révélation des coccobacilles** | Oui (28 taxons) |
| 4 | Gram positifs | Staphylocoques, streptocoques, entérocoques, Listeria, corynébactéries | J2, J6 (arbre + CGP), intrus, J16 | Oui (22 taxons) |
| 5 | Anaérobies | Bacteroides, Clostridium et apparentés, Fusobacterium | J2, J6 (arbre complet, aérobies/anaérobies), intrus, J16 | Oui (23 taxons) |
| 6 | Tests diagnostiques | Antigènes, PCR, FilmArray, NGS (liste non limitative). **On n'y parle pas des gènes de résistance.** | QCM, relier test et cible, vrai/faux, intrus | Non, à créer |
| 7 | Naturelle ou acquise ? | Distinguer résistance naturelle et résistance acquise | Swipe 2 directions, intrus, QCM | Oui |
| 8 | Phénotypes acquis | Pénicillinase, BLSE, case déréprimée, EPC, SARM, ERV, PSDP | **Révélation des 6 groupes** en ouverture, Lis l'antibiogramme (J4), Construis l'antibiogramme (J17), QCM | Oui (34 phénotypes, 18 antibiogrammes types) |
| 9 | Mécanismes de résistance acquise | Inactivation enzymatique (BLSE, case…), modification de la cible, **efflux**, **imperméabilité** (deux catégories distinctes) | **Niveau d'ouverture sur les définitions des modes de résistance**, Relier gènes et mécanismes (J5), tri par mécanisme, swipe ; **niveau « tests des mécanismes de résistance » en fin de monde** | Oui, sauf efflux |
| 10 | BHRe | EPC, ERV, signalement, isolement, dépistage des contacts | Signalement (J10), J4, QCM | Non, à créer |
| 11 | Pathogènes selon la pathologie suspectée | Germes attendus pour chaque tableau clinique, sans traitement | Tri germes/pathologie, QCM, intrus | Non, à créer |
| 12 | Thérapeutique | Spectres, désescalade, C3G et groupe 3 | Spectre (J15), Désescalade (J8), Hémoc positive version microbio (J7) | En partie |

Précisions :

- L'arbre de classification de J6 **grandit d'un monde à l'autre**, du monde 2 au monde 5 (entérobactéries, puis BGN, puis CGP, puis aérobies/anaérobies).
- **Révélation des 6 groupes** (version complète du § 11) : en ouverture du monde 8, car elle parle de mutants et de plasmides. Le point « C3G sur le groupe 3 » va au monde 12.
- **Révélation des coccobacilles** : au monde 3.
- **Niveau « définitions des modes de résistance »** : placé en ouverture du monde 9 par Claude ; l'auteur avait écrit « monde résistances acquises ». À confirmer (monde 8 ou 9).
- **Niveau « tests des mécanismes de résistance »** : placé en fin de monde 9 par Claude, à confirmer.
- **Intrus et J16** sont utilisés dans les mondes 1 et 2, mais leurs lots sont en phase 6 (601 et 602). À trancher : les avancer en phase 2, ou sortir les mondes 1 et 2 sans eux.
- **Probabiliste (J9) et Garde de nuit (J11)** sont réservés à l'infectiologie.
- Incertitudes de contenu : voir § 12 et § 13.

---

## 6. La carte et le design

**La référence visuelle et de mouvement est `docs/design-system.md`** (phase 0, lot 3, conversation C, 16 et 17 novembre) : toute valeur visuelle (couleur, police, durée, taille) y est, et nulle part ailleurs. Ce paragraphe résume les décisions de l'auteur, sans aucune valeur.

- **Thème** : boîte de Pétri sur une **paillasse claire, à matière** (marbrure, grain, lumière ; jamais blanc uni). Pas de mode sombre au lancement.
- **Carte à deux niveaux** : la **pile de boîtes** (vue d'ensemble, un monde par boîte, résumés encadrés) et la **vue zoomée** sur un monde (vue de jeu) ; défilement vertical dans les deux ; changement de monde sans dézoomer. La pile se construit à partir de la liste des mondes visibles : aucun monde codé en dur.
- **Une gélose par monde** (colonne `Milieu` : sang, BCP, chocolat pour les mondes 1 à 3 ; milieux des mondes 4 à 12 à fournir par l'auteur ; clé inconnue → neutre), et **un objet de paillasse par monde**, toujours le même.
- **Couleurs de l'interface** : bleu nuit (encre) et crème pour les boutons et les bandeaux, orange pour le boss ; bouton principal bleu nuit en relief, texte crème. **Scotch écrit à la main** comme motif signature. **Vert et rouge permis pour le retour juste / faux**, toujours avec icône, forme et mouvement ; la règle « ni rose, ni violet, ni rouge, ni vert » ne concerne que les dessins de bactéries (§ 2, règle 6).
- **Bandeaux masqués** (barre du haut, navigation du bas) sur la carte, rappelés d'un toucher sur la paillasse.
- **États d'un niveau** : niveau en cours qui pulse (seule animation en boucle), verrouillé, révélation (loupe), boss (bouclier), monde maîtrisé (colonies dorées), à réviser (voile gris). **L'aspect d'une colonie ne dépend pas de la mécanique** ; le nom de la mécanique est sur la fiche, et sur la carte (vue zoomée) après la première partie.
- **Fiche de paillasse** : elle remonte du bas, née de la colonie touchée ; bandeau à la couleur de la gélose, médaillon, trio d'étoiles, règle du jeu avec le geste mimé, « N questions », tampon « Version simplifiée » si besoin, boutons « Jouer » ou « Rejouer » et « Revoir les fiches espèces » (masqué sans fiche débloquée). **Fiche du boss sombre**, avec la liste de ce qui manque quand il est verrouillé. **Écran de fin de niveau** dessiné.
- **Animations** : niveau réussi, strie qui se dessine, changement de monde, révélation, contamination ; célébrations courtes et passables d'un toucher ; désactivées si le téléphone est réglé pour réduire les animations.
- **Navigation du bas** : Carte, Modes, Collection, Profil, et Admin pour un compte qui a le droit « contenu » (qui donne aussi accès au mode test).
- **Écrans de jeu** (Swipe, QCM, Tri, Intrus, Révélation, explication) : fond neutre, jamais la gélose ; **à maquetter au niveau de la direction avant la spec 204**. Les finitions se font sur l'appli réelle, lot par lot ; la maquette n'est plus retouchée pour des détails.
- **Maquette** (toile « Carte Boîte de Pétri », planches « B + D », E1 à E3) : https://claude.ai/artifact/Fveebyr22jpmKBtPSaK64i. Référence visuelle ; en cas d'écart, le design system l'emporte.

---

## 7. Mécaniques de jeu

Les numéros suivent la liste de travail ; les numéros absents ont été retirés volontairement. La place de chaque mécanique dans les mondes est au § 5 bis. Valeurs de la colonne `Mécanique` déjà fixées : `swipe`, `qcm`, `tri` ; chaque mécanique nouvelle ajoute la sienne. Chaque mécanique donne, avec chaque réponse, le **nombre de réponses qu'elle a réellement montrées** (§ 4).

- **J1, aérobies/anaérobies et Gram Swipe.**
  - Niveaux 1 et 2 faits dans le prototype.
  - Niveau 3 : **5 directions**, CGP, CGN, BGP, BGN et atypique. Les atypiques ne sont pas dans le tableur v6 : l'auteur le complétera.
  - Contraintes de Gram Swipe :
    - dessin selon la règle 6 du § 2 ;
    - boutons sur les bords de l'écran, Anaérobie en diagonale en bas à droite ;
    - boutons masqués sur l'écran de résultats ;
    - nom de la bactérie affiché au-dessus du dessin.
  - **Reprise du prototype** (lu le 14 novembre) : c'est une référence, pas une base de code. On reprend le geste et le dessin générique ; la palette des dessins est celle du design system (§ 3.9). **La liste de bactéries écrite dans le prototype et l'ancien tableur qui l'a nourrie sont faux : ne pas les réutiliser.**
  - Reste à trancher dans la spec 204 : le nombre de réponses proposées d'un swipe dont la question n'est jouable que sur une partie des directions affichées.
- **J1 bis, Swipe cocci ou bacille** (monde 1).
  - Swipe à 2 directions : cocci ou bacille. Dessin de forme générique (règle 6).
  - **Simplification** : des taxons sont classés par leur forme usuelle ; niveau marqué « Version simplifiée ». Révélation ultérieure des **coccobacilles** dans un niveau « révélation » du **monde 3**.
- **J2, Piège ou pas ?** Une carte bactérie + antibiotique. L'interne répond **« résistance naturelle : oui / non »**, jamais S ou R (décidé le 14 novembre) : dans le tableur, « – » signifie « aucune résistance naturelle décrite », pas « sensible ».
  - Trois formats pour les résistances naturelles : oui / non, vrai / faux, et « quelles sont les résistances naturelles de… » (plusieurs faits, score partiel).
  - Les lignes de valeur « r » (résistance de bas niveau) sont **exclues des questions oui / non** et réservées à un niveau avancé à trois réponses.
  - **Catégorie clinique d'une souche sauvage** (décidé le 17 novembre) : des niveaux avancés demandent ce qu'annonce l'antibiogramme d'une souche sauvage (S, SFP ou R). La réponse ne se lit jamais dans la valeur « – » des résistances naturelles : elle vient d'une ligne d'`Antibiogrammes_types` d'un profil sauvage, qui donne la catégorie explicitement. C'est la mécanique J17 ; une question à une seule case reste possible plus tard.
- **J3, Qui suis-je ?** : retiré.
- **J4, Lis l'antibiogramme.** Nommer le phénotype : sauvage, pénicillinase, BLSE, case déréprimée (« case » = céphalosporinase, abréviation usuelle), EPC, SARM, ERV, PSDP. Catégories du **CASFM 2026 : S, SFP, R**.
- **J5, Relier gènes et mécanismes** : relier un phénotype acquis au gène qui le porte.
- **J6, Tri des groupes de résistance naturelle aux bêta-lactamines** : glisser-déposer plusieurs bactéries dans la bonne case.
  - La conséquence « C3G sur le groupe 3 » est réservée à un niveau très avancé (monde 12).
  - Variante : un arbre de classification d'abord tronçonné, puis complet dans les mondes suivants. Ordre : entérobactéries, puis BGN, puis BGN + CGP, etc., puis aérobies/anaérobies. Au niveau des entérobactéries, on peut aussi tomber sur des CGP ou des CGN, ou sur des BGN non fermentants ou fermentants.
- **J7, Hémoc positive.**
  - En microbiologie (monde 12) : flacon positif, examen direct (Gram), identification à J1, antibiogramme à J2. À chaque étape, l'interne trouve les germes compatibles dans une liste.
  - En infectiologie : antibiothérapie probabiliste selon la situation clinique, puis examen direct, identification, antibiogramme.
- **J8, Désescalade** (monde 12) : choisir l'antibiotique efficace au spectre le plus étroit. Les points dépendent de l'étroitesse du spectre.
- **J9, Probabiliste** (infectiologie) : à partir d'une situation clinique (PAVM tardive, péritonite post-opératoire, méningite du sujet âgé, choc septique urinaire), choisir l'antibiothérapie, puis le germe est révélé.
- **J10, Signalement ?** (monde 10) : faut-il signaler, isoler, dépister les contacts ?
- **J11, Garde de nuit** (infectiologie) : un mode histoire avec 3 patients. Le score compte les patients bien traités et les antibiotiques épargnés.
- **J12** : abandonné (super boss BHRe). Les boss de chaque monde restent.
- **J13, Duel asynchrone** : même série de 10 cartes, sans effet sur l'ELO.
- **J15, Spectre** (monde 12) : placer les antibiotiques sur une carte de spectre (Gram+, Gram−, anaérobies, Pseudomonas, SARM).
- **J16, Vrai/faux éclair** sur les notes « PIÈGE » du fichier.
- **J17, Construis l'antibiogramme** (décidé le 17 novembre, lot 611 ; cadrage : `docs/specs/cadrage-lot-611.md`). On montre une bactérie, sauvage ou porteuse d'un mécanisme annoncé ; l'interne remplit une case par antibiotique posé (un appui = S, deux = SFP, trois = R, quatre = vide ; la lettre toujours écrite). Les antibiotiques posés sont **choisis par l'auteur pour chaque question**, parmi les lignes du profil qui ont une catégorie, dans une nouvelle colonne de `Questions`. Un antibiogramme = une question, à score partiel ; S, SFP et R sont proposés dans chaque case (3 réponses proposées). Les résistances naturelles d'un profil sauvage peuvent y être posées comme les autres cases. Trois couleurs propres aux catégories, distinctes de celles du retour juste / faux. Sens inverse de J4.
- **Jeu des intrus** : quatre bactéries, une seule ne partage pas la propriété des trois autres.
- **Mécaniques proposées le 13 novembre pour les nouveaux mondes** (à préciser dans les specs) : swipe « naturelle ou acquise » (monde 7), tri par mécanisme de résistance (monde 9), relier test et cible (monde 6), tri germes/pathologie (monde 11).
- Mécaniques génériques : swipe (2 à 5 directions), QCM, étiquettes à placer, révélation, boss.

---

## 8. Pédagogie

- **P1** : une explication après chaque erreur, tirée de la note clinique du fichier. **L'explication est aussi consultable après une bonne réponse, sur un appui** (pas en sprint). Elle affiche **la version du référentiel et la page** (CASFM 2026, p. N). L'enchaînement après une réponse (délai, explication automatique ou sur appui) est à trancher dans la spec 204.
- **Re-test immédiat** (décidé) : une question ratée revient en fin de niveau, hors score, sans effet sur l'ELO ni les étoiles. Pas au boss.
- **Carnet d'erreurs** (décidé) : un filtre du mode entraînement sur ses propres points faibles, alimenté par Leitner. Ce n'est pas un nouveau mode.
- **Signaler une erreur** (décidé) : un bouton sur chaque question, avec une file de traitement dans l'espace Admin.
- **Reprise exacte** (décidé) : un niveau interrompu reprend à la même carte. Pas en sprint.
- **P2** : répétition espacée de type Leitner, **pour la bactérie du jour et l'entraînement**, pas dans les niveaux de la campagne (qui restent identiques pour tous).
- **P3** : indice de certitude « sûr » ou « hésitant », activé pour certains niveaux de chaque monde. Une erreur commise en étant « sûr » coûte plus cher, mais jamais sur l'ELO. **Aucun lot ne le porte encore** (§ 13).
- **P4** : bestiaire, une fiche par bactérie débloquée à la première rencontre, qui se remplit au fil des notions.
- **P5** : parcours en paliers (voir § 5).
- **P7** : pré-test à l'arrivée et post-test en fin de stage, **obligatoires** (évaluation du stage, publication possible).
  - Le **pré-test fixe l'ELO de départ** de l'interne (§ 4).
  - Les questions des tests sont **puisées dans la base commune** (pas de questions réservées : la base sera assez large pour ne pas devenir un jeu de mémoire).
  - Le **post-test est identique au pré-test**, sans correction affichée au pré-test. À confirmer avec un méthodologiste en vue d'une publication ; l'architecture accepte aussi des questions équivalentes.
  - **Pré-test et post-test sont corrigés par le serveur, réseau obligatoire** (décidé le 14 novembre). Comment leurs réponses restent hors du téléphone alors qu'elles viennent de la base commune : à trancher dans la spec 313.
- **P8** : bactérie du jour, une question de 30 secondes par jour. Pas de notification (refusé le 13 novembre).
- **P9** : remplacé par les modes du § 3.
- **P10** : écologie locale, les cartes reflètent la fréquence des germes et phénotypes du service (BLSE, EPC, rapatriements sanitaires). Aucun lot ne le porte encore.
- **P11** : chaque explication renvoie à la section CASFM indiquée dans le fichier ; d'autres sources pour l'infectiologie.

---

## 9. Gamification

- **G1**, XP : **fonctionnalité prévue mais désactivée par défaut**, activable par un admin (interrupteur global). Pas de grades. Règles d'attribution des XP : à définir. Les XP n'agissent jamais sur l'ELO. Aucun lot ne la porte encore.
- **G2**, badges : par exemple « 10 sans faute ».
- **G3**, cartes à collectionner : la rareté dépend de la fréquence ou du danger (EPC et ERV légendaires). **Échange de cartes** entre internes.
- **G4** : série de connexion visible, **sans badge de continuité**. Seulement un badge « tous les mois faits sur 6 mois », et un endroit où l'interne voit ses jours de connexion.
- **G5** : remplacé par le classement ELO unique du § 4.
- **G6**, saisons : abandonné.
- **G7**, défis d'équipe : deux demi-promos, **Bleus et Oranges**, de même effectif. Score d'équipe = **total des étoiles**.
- **G10**, survie : 3 vies, sans chrono.
- **G13** : badge ou attestation visible dans le profil Carnet Réa en fin de stage.
- **G14** : vibration en cas d'erreur, désactivable dans les réglages. **Safari sur iPhone ne prend pas en charge la vibration web** : le réglage y est masqué, sans contournement (décidé le 16 novembre, lot 108). Aucun lot ne porte encore ce réglage (à placer avec l'écran de jeu ou la fin de niveau).
- **G15** : partage du score en capture (par exemple dans le groupe WhatsApp des internes).
- **Sons** : discrets et coupés par défaut (contexte hospitalier), aucun au lancement. Aucun lot ne les porte encore.

---

## 10. Intégration et technique

- **C1** : même compte prenom.nom et même verrou Face ID que Carnet Réa et EchoLearn. Accessible aussi en autonome. **Une seule table de comptes, celle de Carnet Réa**, où s'inscrivent aussi les internes en autonome. **Faisabilité confirmée le 14 novembre à la lecture du code** (détail dans `docs/architecture.md`, § 3) :
  - le verrou Face ID se reprend tel quel, à condition d'héberger Microbio sur le même domaine que Carnet Réa ;
  - un **serveur Microbio séparé**, sous un **compte Google dédié** (décidé le 15 novembre), lit les comptes et les sessions de Carnet Réa sans y écrire : la Sheet de Carnet Réa lui est partagée en « Lecteur », la lecture seule est donc garantie par Google ;
  - la connexion et le mot de passe oublié passent par Carnet Réa, comme pour EchoLearn ; Microbio ne peut pas prolonger une session (elle s'éteint au terme fixé par Carnet Réa sans appel à celui-ci : maintien à régler au lot 303) ;
  - l'inscription en autonome crée un **compte interne sans semestre** : c'est la seule ligne à changer dans Carnet Réa ;
  - droits admin, pseudo et refus du classement sont dans un onglet Profils de Microbio, pas dans la table de Carnet Réa ;
  - **à vérifier sur iPhone** (lot 108) : une appli installée sur l'écran d'accueil a probablement son propre stockage, donc sa propre connexion et son propre Face ID.
- **C2** : une tuile dans Carnet Réa qui affiche la progression, comme la tuile EchoLearn.
- **C3** : tableaux de bord admin (détail au § 10 ter).
- **C4** : contenu modifiable sans code (détail au § 10 bis) : l'**espace Admin** et le **mode test** écrivent directement dans la **Google Sheet de production**, et la mise à jour annuelle passe par un import. Chaque question a **une colonne `Palier` et une colonne `Plancher`** (un nom, § 4).
- **C6** : réglages par profil (interne, DJ, senior) dans Admin. Aucun lot ne les porte encore.
- **C8** : fonctionnement hors ligne, synchronisé au retour du réseau. L'ELO et le classement se mettent à jour à la reconnexion.
- **C9** : export des résultats pour l'évaluation de stage, pseudonymisé pour une publication.
- **Hébergement** : **GitHub, avec Apps Script et Google Drive**. Le code est dans le **dépôt GitHub public** `chugicu/microswipe` (compte gratuit), publié par GitHub Pages à `https://chugicu.github.io/microswipe/` ; le contenu médical n'y est pas (voir § 10 quater).
- **Cadre réglementaire** (décidé, démarches de l'auteur) : information et consentement des internes, export pseudonymisé, avis du DPO ou du comité d'éthique avant l'ouverture ; contact de la SFM pour les droits sur le contenu du CASFM (§ 12). À ajouter à la demande au DPO : la durée de conservation des comptes autonomes, qui ne sont pas anonymisés automatiquement.

---

## 10 bis. Administration et évolutivité

### Ce que les admins peuvent faire (sans code)

- **Questions** : ajouter, modifier, supprimer (= archiver), dans l'espace Admin ou directement en jouant, dans le **mode test** (§ 10 quinquies).
- **Validation** : passer une ligne à « Validé », avec nom du validateur et date. **Seules les lignes « Validé » sont servies aux internes**, avec la règle stricte de la validation par champ (ci-dessous).
- **Signalements d'erreur et suggestions** : traiter la file unique.
- **Mondes** : ajouter, supprimer, et passer un monde en **visible ou invisible**. **Mondes, niveaux et composition ne se modifient que dans l'espace Admin** (jamais par l'import).
- **Interrupteurs de fonctionnalités** : XP (désactivé au départ), logo à l'ouverture (`accueil.logo`, allumé par défaut) ; extensible à d'autres (indice de certitude par niveau, échange de cartes, etc.).
- **Recalcul de l'ELO** (droit « contenu ») et **import annuel**, chacun par un écran de l'espace Admin.

### Rôles admin (décidé le 13 novembre)

Deux droits distincts dès le départ : **« contenu »** et **« résultats nominatifs »** (les résultats individuels sont des données personnelles). Un même compte peut avoir les deux ; chacun vaut `oui` ou `non`, toute autre valeur signifie aucun droit. Le mode test relève du droit « contenu ».

### Monde invisible (décidé le 13 novembre)

- Ses questions sortent de **tous les modes** (classé, entraînement, sprint, survie), sauf du mode test.
- Les étoiles et les réponses déjà acquises sont **conservées mais masquées**, et reviennent si le monde redevient visible.
- **Le chemin saute le monde invisible** : le boss du monde précédent ouvre le monde visible suivant.
- Les mondes dont le contenu n'est pas encore validé restent invisibles.

### Circuit de modification du contenu (décidé le 13 novembre, remplace le « réexport »)

- La **Google Sheet de production est la base de l'appli**. L'espace Admin et le mode test y écrivent directement : elle est toujours complète, **il n'y a plus de réexport**.
- **Personne ne modifie la Sheet de production à la main** : on passe par l'espace Admin, le mode test ou l'import. Toute écriture est tracée dans un onglet `Historique` et augmente la version du contenu, ce qui fait reconstruire les paquets servis aux téléphones.
- **Au moins une fois par an** : la nouvelle version (CASFM / EUCAST) se prépare dans une **copie**, puis s'importe dans la production.
- **ELO conservé** : une question modifiée, par n'importe quel canal, garde son ELO (exception : § 4, J17).

### Déroulé de l'import annuel (décidé les 13, 14 et 16 novembre ; détail : `docs/specs/lot-505.md`, `lot-506.md`)

- **Trois états** : « Préparer » crée une **copie de travail** et une **copie de référence**, jamais touchée. La comparaison confronte référence, production (« Contenu actuel ») et copie.
- Une ligne changée **seulement en production** garde sa version de production sans rien demander. **Seule une ligne changée des deux côtés, différemment, est un conflit** ; l'admin choisit la version, pour la ligne entière. Une ligne supprimée de la copie mais modifiée en production est un conflit.
- **Périmètre** : les douze onglets de faits, `Notions` et `Questions`. Mondes, Niveaux et Composition n'en font pas partie.
- **Identifiants** : l'auteur laisse `ID` vide sur une ligne nouvelle (le serveur attribue le numéro suivant) et ne change jamais un identifiant ; un identifiant inconnu dans la copie bloque l'application.
- Avant d'appliquer, l'admin voit un **récapitulatif des différences** : lignes ajoutées, modifiées, retirées. L'application refait la comparaison sous verrou et refuse si elle a changé depuis.
- Une question créée hors de l'import (espace Admin, mode test : colonne `Origine`) n'est jamais retirée par l'import.
- Une ligne retirée est **archivée**, pas effacée : **aucune fonction de l'import ne supprime quoi que ce soit**. Les questions dont un fait est archivé ne sont pas modifiées : elles cessent d'être servies, et l'admin décide de leur sort.
- **Le statut de validation vient de la copie** (décidé le 14 novembre) : l'auteur valide dans la copie avant d'importer, donc aucune question ne disparaît du jeu.
- Une **question à réponse propre** repasse à « À valider » quand la colonne qu'elle teste change, sauf si l'auteur a modifié sa propre ligne dans la copie.
- Sauvegarde du fichier Contenu avant la première écriture ; application **reprenable** après interruption ; pendant une application interrompue, toute autre écriture de contenu est refusée et les internes gardent l'ancien contenu.
- L'import ne touche ni aux données des internes ni au journal, et ne change aucun identifiant : l'ELO des questions est conservé par construction.

### Exigences d'évolutivité

- **Nouveaux mondes** et **infectiologie** ajoutables plus tard sans modifier le code : mondes, niveaux, questions et réglages décrits par des données. Limite : une **nouvelle mécanique de jeu** demande toujours du code.
- **Mise à jour annuelle du tableur** : l'appli doit absorber la nouvelle version (voir ci-dessus).
- **Nouvelles rubriques** (colonnes ou onglets) dans le tableur : elles ne cassent pas l'existant ; une rubrique inconnue est ignorée et signalée. **Limite constatée le 16 novembre** : la brancher demande du code (plan de conversion et périmètre de l'import), et aucun lot ne le prévoit encore. Une colonne renommée n'est plus comparée par l'import.
- **Plusieurs tableurs** possibles. Pour l'instant, l'auteur **complète le tableur existant** (nouveaux onglets) plutôt que d'en créer un second.

### Principes techniques (validés le 13 novembre, précisés depuis)

- Chaque question, espèce et monde a un **identifiant stable** qui ne se renomme et ne se réutilise jamais, même pour une ligne supprimée.
- Suppression d'une question ou d'un monde = **archivage** plutôt qu'effacement, dans une colonne séparée du statut de validation.
- Chaque ligne doit porter la **version du référentiel** (ex. CASFM 2026). **Écart constaté** : plusieurs onglets du tableur v6 n'ont pas de colonne `Source` ou `Page` uniformes ; la conversion n'en écrit aucune et signale les lignes sans source ; l'auteur ajoute une colonne `Source` à `Phenotypes` et `Regles`.
- **Un onglet « Questions » distinct des faits** : le tableur contient des faits, pas des questions. Chaque question est une ligne avec son identifiant, son monde de rattachement, sa mécanique, son palier, son plancher et son statut, et **pointe vers le fait qu'elle teste** (onglet, ligne et colonne). Une valeur du CASFM qui change se corrige une seule fois, dans le fait. L'onglet est créé vide à la conversion : **le pré-remplissage automatique des swipes à partir des faits n'a pas encore de lot**.
- **La réponse est lue dans le fait**, sauf « réponse propre » (QCM, questions simplifiées). **Jamais de repli sur la valeur brute** : une question dont la réponse ne se lit pas est écartée, avec un motif.
- **Une question peut figurer dans plusieurs niveaux** (décidé le 14 novembre, utile pour la pédagogie) : un onglet « Composition » relie niveaux et questions.
- **Table de correspondance par niveau** : valeur du fait → réponse du jeu, rangée par couple `Onglet:Champ` dans la colonne `Réglages` du niveau, au format JSON. Une valeur sans correspondance n'est pas servie et remonte à l'admin (en mode test).
- **Validation par champ, règle stricte** (décidé le 15 novembre) : valider une question en jeu valide les colonnes que la carte a montrées, pas toute la ligne ; pour un fait dont la ligne n'est pas « Validé », seules ces colonnes partent chez les internes.
- **Lien par identifiant d'espèce**, pas par le nom du taxon. La conversion ne remplit `ID espèce` que par libellé exact ; l'auteur complète le reste.
- **Trois fichiers** : Contenu (la Sheet de production), Joueurs (données personnelles), Journal (un par année).
- **Tout ce qui est rangé dans l'onglet Reglages part sur le téléphone de chaque interne** : une valeur qui doit rester sur le serveur n'y va jamais.
- Détail complet : `docs/schema-de-donnees.md`.

---

## 10 ter. Tableaux de bord

- **Admin, collectif** : taux de réussite par bactérie, par notion, par monde et par mécanique (pour cibler les staffs), progression de la promo, pré-test vs post-test (P7), répartition des ELO, activité (connexions).
- **Admin, individuel, par utilisateur** (droit « résultats nominatifs ») : ELO et son évolution, étoiles et mondes, taux de réussite par notion, points faibles, activité, pré/post-test.
- **Interne, tableau de bord personnel** (décidé), dans l'onglet Profil : un maximum de statistiques pertinentes, dont ses points faibles et sa progression.
- Contenu exact des indicateurs : à préciser. Non bloquant : tout se recalcule à partir du journal de réponses.

---

## 10 quater. Architecture (validée le 13 novembre, détaillée depuis)

Le détail des flux est dans `docs/architecture.md`.

1. **Client sans framework ni compilation**, en modules JavaScript, hébergé sur GitHub Pages (`chugicu.github.io/microswipe/`), jouable hors ligne (service worker, **IndexedDB**), installable sur l'écran d'accueil (PWA, portrait seul). Le serveur reste la référence, le téléphone n'est qu'une copie.
   - IndexedDB plutôt que le stockage local : celui-ci (environ 5 Mo) est partagé avec Carnet Réa et EchoLearn, sur le même domaine. **Une seule base, `microbio`** ; chaque lot ajoute ses magasins par une migration, jamais modifiée ensuite.
   - Sur iPhone, Safari peut effacer les données locales d'un site non installé après 7 jours sans visite. Conséquence réelle : seules les réponses jouées hors ligne et jamais synchronisées sont perdues ; tout le reste revient du serveur à la reconnexion. L'installation sur l'écran d'accueil est **conseillée, pas obligatoire** : une invitation à installer apparaît après la 1re et après la 10e partie terminée, si l'appli n'est pas installée, et une ligne reste dans Profil.
   - **Mise à jour silencieuse** de l'appli, appliquée à l'ouverture suivante, jamais pendant une partie.
2. **Le contenu médical n'est pas publié sur GitHub Pages** (un site GitHub Pages est lisible par tous, même avec un dépôt privé). Il est **servi par Apps Script après connexion**, dans un paquet préparé à l'avance, avec les réglages (onglet Reglages en entier), et remplacé en entier à chaque nouvelle version, puis gardé sur le téléphone. **Les questions non validées ne sont envoyées qu'aux comptes admin** (mode test), sur demande explicite. En phases 1 et 2, sans serveur, le téléphone lit un **jeu de données fictif**.
3. **Tout est donnée** : mondes, niveaux, questions et réglages viennent de la Google Sheet de production.
4. **Jamais d'attente serveur pendant le jeu** : le jeu tourne en local, la synchronisation part en arrière-plan, par paquets. L'ELO officiel et le classement ont un retard de quelques secondes à quelques minutes. (Exceptions : les corrections du mode test, qui s'écrivent en direct, et le pré-test et le post-test, corrigés par le serveur.)
5. **Journal de réponses** : une ligne par réponse, jamais modifiée (qui, quelle question, quel mode, résultat, réponse donnée, temps, date, nombre de réponses proposées…). ELO, étoiles, tableaux de bord et étalonnage en sont recalculés ; on peut changer les réglages de l'ELO après coup. **Un fichier de journal par année** (plafond de Google Sheets : 10 millions de cellules par fichier ; estimation non vérifiée d'environ 4,8 millions de cellules par an pour 150 internes, avec 16 colonnes). Le mode test n'y écrit rien.
6. **ELO officiel calculé par le serveur**, dans l'ordre de réception ; le téléphone affiche une estimation, corrigée à la synchronisation.
7. **Écritures protégées** (verrou), **classement mis en cache** (rafraîchi toutes les quelques minutes), **sauvegarde automatique** des fichiers dans un dossier Drive.
8. **Compte et verrou Face ID repris de Carnet Réa**, table de comptes unique : **confirmé** à la lecture du code (voir § 10, C1).
9. **Identifiants stables, archivage, version du référentiel** (§ 10 bis).
10. **Onglet « Questions » distinct des faits** (§ 10 bis).
11. **Serveur Microbio séparé** de celui de Carnet Réa, sous un **compte Google dédié** : une mise à jour de Microbio ne peut casser ni Carnet Réa ni EchoLearn.
12. **Deux modules uniques** (décidé le 15 novembre), pour garder une migration bon marché : côté serveur, tous les accès à Sheets et à Drive passent par un seul module de stockage ; côté client, le serveur est appelé par un seul module, à adresse configurable.
13. **Polices hébergées dans le dépôt** (décidé le 16 novembre) : aucun appel à Google Fonts, pour le hors-ligne et pour ne transmettre aucune adresse IP à un tiers.

Choix pris par défaut : champ « parcours » (microbiologie ou infectiologie) sur chaque monde.

---

## 10 quinquies. Mode test réservé aux admins (décidé le 14 novembre)

### Accès et navigation

- Accessible **uniquement aux comptes ayant le droit « contenu »**, depuis l'entrée Admin.
- **Bannière « Mode test » permanente**, en haut, avec « Quitter » ; les outils de correction sont derrière un bouton « Outils » de la bannière. Le mode test n'existe qu'en mémoire : recharger la page en fait sortir.
- **Navigation libre** : tous les mondes, niveaux et boss sont ouverts, **y compris les mondes invisibles**, sans étoiles, sans seuil du boss ni autre restriction ; le boss s'y joue même avec une réserve trop courte.
- Affiche les **questions non validées** en plus des questions validées. Le serveur ne les envoie qu'aux comptes admin : un interne ne peut pas les recevoir, même en inspectant son téléphone. Pendant une question, l'admin voit son identifiant et si elle est servie aux internes, avec les motifs ; sur la fiche d'un niveau, les questions écartées. Jamais un énoncé, une réponse ni une valeur dans ces informations.
- En phase 2, sans serveur, le mode test ne s'ouvre que hors de l'adresse publique et sur des données fictives.

### Rien ne compte

- Pas d'ELO, pas d'étoiles, pas d'écriture dans le journal de réponses, pas d'étalonnage, pas de classement ni de score d'équipe, pas de badges ni de cartes, pas de reprise.
- La vraie progression de l'admin, s'il joue aussi en tant qu'interne, n'est pas touchée.

### Actions sur une question, en jouant

- **Corriger la rédaction** de la question : la question garde son statut de validation. **Modifier les leurres ou la réponse propre la repasse à « À valider »** (un leurre peut être une bonne réponse).
- **Corriger la réponse** : la correction porte sur **le fait** que la question teste, donc sur **toutes les questions qui pointent vers ce fait**. L'appli affiche « Cette correction touche N questions. Elles sortent du jeu des internes jusqu'à validation. » avant d'enregistrer. Le fait corrigé **repasse à « À valider »**.
- **Suggérer une correction de la réponse** (en cas de doute) : la suggestion rejoint **la même file** que les signalements d'erreur des internes.
- **Supprimer** la question : archivage, comme partout ailleurs.
- **Valider** la question et son fait : bouton « Valider · <source>, p. <page> », qui enregistre le nom du validateur et la date. La validation porte sur **les colonnes que la carte a montrées** (§ 10 bis). La validation du tableur peut ainsi se faire en jouant.
- Modifier et suggérer sont ouverts **à tout admin de contenu**, sans droit supplémentaire.
- Ces actions **demandent du réseau** : elles s'écrivent directement dans la Google Sheet de production, sous le verrou d'écriture.
- Écrans dessinés : `docs/design-system.md` § 12.

### Place dans le plan

- **Navigation libre** : dès la **phase 2** (lot 213 ; fonctionne sans serveur, permet de tester chaque mécanique dès qu'elle existe).
- **Corrections, suggestions et validation en jeu** : dès la **phase 3** (lots 315 et 316, avancés depuis la phase 5, car rien n'est jouable avant validation).

---

## 11. Contenu : entérobactéries et bêta-lactamines

Retiré de la version du dépôt : contenu médical. La version complète est dans le projet claude.ai.

---

## 12. Données : le tableur de référence

- **Fichier** : `Base_reference_infectio_v6.xlsx` (version 6 du 4 novembre 2026). **À joindre à chaque conversation qui en a besoin**, il n'est pas stocké dans le projet. **Il ne va jamais dans le dépôt public.** Depuis le 15 novembre, sa conversion en fichier Contenu est une fonction du serveur de test, lancée par l'auteur (`docs/specs/lot-305.md` § 6.11).
- **L'ancien tableur (`Bacteries.csv`, `Bacteries.pdf`), qui a servi à Gram Swipe, est faux : ses données ne doivent pas être utilisées.** Dans le tableur v6, aucune ligne de faits ne le cite ; il n'apparaît que dans Sources (ligne S7, écartée à la conversion), Lisez-moi et Ecarts_ancien_tableur.
- **Sources** : CASFM 2026 et EUCAST v16.1. Les mycobactéries sont exclues.
- **Onglets** : Lisez-moi, Sources, Vocabulaire, Especes (97 taxons), RN_communes (61), RN_specifiques (1068 lignes), RN_matrice, Phenotypes (34), Regles (175), Antibiogrammes_types (252 lignes, 18 antibiogrammes), Antibiogrammes_vue, Concentrations_critiques (529), Molecules_a_tester (336), Posologies_CASFM (116), Posologies_EUCAST (92), Ecarts_ancien_tableur, Controles. **Douze onglets sont repris** dans le fichier Contenu, cinq écartés (détail : schéma § 2).
- **Répartition des 97 taxons** (lue le 13 novembre) : entérobactéries 24, autres Gram négatifs 28 (non fermentants 8, GN 11, autres 9), Gram positifs 22, anaérobies 23.
- **Constats du 14 novembre** (lecture du fichier) :
  - les identifiants existent déjà (ENT-01, RNC-01, RNS-001, PH-01, REG-01, CC-001, AB-01…) et sont gardés ; `Antibiogrammes_types` et `Vocabulaire` en reçoivent à la conversion (`ABL-001`…, `VOC-01`…) ;
  - valeurs des résistances naturelles spécifiques : 742 « – », 315 « R », 11 « r » ;
  - le lien par le nom du taxon est fragile : « Enterococcus faecalis et avium » est absent d'Especes, 11 espèces n'ont aucune ligne de résistance spécifique, et RN_communes vise 7 groupes écrits en toutes lettres ;
  - certaines valeurs ne sont pas des codes : Forme a 10 valeurs, un Gram est noté en texte libre, une espèce a une catégorie « Non attribuée », 5 entérobactéries n'ont pas de groupe.
- **Méthode** : double lecture de chaque valeur (lecture visuelle des pages du PDF, puis texte extrait), contrôles automatiques et audit indépendant ciblé.
- **Limites** :
  - toutes les lignes sont au statut **« À valider »** : 0 validée sur 2 760 ;
  - la taxonomie (dont la colonne « Forme ») vient des connaissances générales ;
  - les lignes déduites sont signalées ;
  - les anaérobies ne sont pas comparés à EUCAST.
- **Validation** (décidé le 13 novembre) : **l'auteur valide lui-même**, monde par monde, en commençant par les mondes 1 et 2, dans le tableur ou **en jouant dans le mode test** (§ 10 quinquies). Rien n'est jouable par les internes avant validation.
- **Ce que le tableur ne contient pas** (vérifié le 13 novembre) : atypiques (Mycoplasma, Chlamydia, Legionella), efflux, tests diagnostiques (antigènes, FilmArray, NGS), BHRe et signalement, pathogènes par pathologie, une liste d'antibiotiques avec identifiants, et l'onglet « Questions » (défini dans `docs/schema-de-donnees.md`). **L'auteur complétera le tableur.**
- **Droits d'auteur** : le CASFM est protégé (© SFM). Les règles sont reformulées, les valeurs reprises avec leur page. Afficher la référence (CASFM 2026, page) ne pose pas de difficulté nouvelle ; la question porte sur les valeurs, les règles et les 18 antibiogrammes types. **Contacter la SFM avant l'ouverture aux internes** (démarche de l'auteur ; Claude n'est pas juriste).
- **Usage** : le tableur est la **première source** du contenu. L'infectiologie s'appuiera sur d'autres sources. Il est converti en Google Sheet (C4).
- **Cycle de vie** : voir § 10 bis.
- **Logo** : deux fichiers fournis par l'auteur le 17 novembre (`microswipe-icon-ios.png`, `microswipe-icon-android.png`), gardés sur son ordinateur et copiés au lot 101 ; le projet claude.ai ne garde que du texte.

---

## 13. Points encore ouverts

Réglages à chiffrer ou à saisir plus tard (par l'auteur, dans le fichier Contenu) :
- Seuils d'étoiles (`etoiles.seuil_1` à `etoiles.seuil_3`) : sans eux, aucun contenu n'est servi.
- Pour chaque monde : étoiles requises pour ouvrir le boss, nombre de questions du boss (recommandation : 20), seuil du boss ; une réserve plus large que le tirage.
- Nombre de niveaux par monde et de questions par niveau.
- Les sept clés ELO, par simulation (lot 5, après le lot 401), puis recalcul de l'ELO ; un palier (et au besoin un plancher) pour chaque question.
- **XP** : règles d'attribution et affichage, le jour où on l'active.
- **Tableaux de bord** : liste précise des indicateurs.

À confirmer par l'auteur :
- Place du niveau « définitions des modes de résistance » (monde 8 ou 9) et du niveau « tests des mécanismes de résistance » (fin du monde 9 ?).
- Post-test identique au pré-test : à confirmer avec un méthodologiste.
- Intrus et J16 dans les mondes 1 et 2 : avancer leurs lots en phase 2, ou sortir ces mondes sans eux.

Sans lot pour l'instant :
- XP (G1), indice de certitude (P3), écologie locale (P10), réglages par profil (C6), sons, réglage de la vibration (G14), pré-remplissage des questions de swipe, branchement d'une rubrique nouvelle du tableur.
- Calcul du « monde maîtrisé » (défini au § 5) : à placer dans la spec 212, ou en amendement de la spec 208.
- Mise en production du serveur et création du fichier Contenu de production (avec ses seuils d'étoiles et ses sept clés ELO).

À vérifier pendant le développement :
- **iPhone** (lot 108) : stockage propre d'une appli installée ; coût des filtres de matière (grain, marbrure) sur iPhone et Android.
- **Apps Script** (phase 3) : vitesse et quotas par un test de charge ; la limite d'exécutions simultanées n'est plus partagée avec Carnet Réa et EchoLearn grâce au compte Google dédié, à vérifier.
- Remplissage de la colonne « ID espèce » à la conversion du tableur, à compléter par l'auteur.

Contenu à créer ou à vérifier :
- Atypiques, efflux, tests diagnostiques, BHRe, pathogènes par pathologie : à ajouter au tableur, avec leurs sources.
- **BHRe** : la définition et la conduite à tenir ne viennent pas du CASFM ; source à choisir (recommandations du HCSP, à vérifier).
- Liste des coccobacilles de la révélation : à valider.
- Milieux de culture (couleurs) des mondes 4 à 12 : à fournir par l'auteur (d'ici là, clé neutre).

À faire plus tard :
- Moment où l'infectiologie arrive après la microbiologie, et ses sources.
- Les maquettes des écrans de jeu (swipe, QCM, tri, intrus, révélation, explication), au niveau de la direction, avant la spec 204. (Les écrans du mode test, du boss verrouillé et de l'espace Admin sont dessinés : design system § 11 à § 13.)
- Démarches de l'auteur : DPO ou comité d'éthique (dont la conservation des comptes autonomes), SFM.
- Licence du dépôt public : aucune n'est prévue (sans licence, le code reste « tous droits réservés »).

Tranchés depuis le 15 novembre (pour mémoire) : niveau partiellement validé (§ 5) ; un seul ELO et articulation entre pré-test et ELO de départ (§ 4) ; définition du monde maîtrisé (§ 5) ; question « S, R ou SFP » sur une souche sauvage (§ 7, J17).

---

## 14. Propositions refusées (ne pas les reproposer)

- **Boss cumulatif** (mélange des notions des mondes précédents).
- **Questions réservées au pré-test et au post-test.**
- **Notification quotidienne** pour la bactérie du jour.
- **Mode staff** (projection d'une série de questions par un senior).
- **Second tableur** pour les contenus hors CASFM : on complète le tableur existant.
- **Réexport** de l'espace Admin vers la Google Sheet : supprimé, l'espace Admin écrit directement dans la Sheet de production.
- **Question limitée à un seul niveau** (refusé le 14 novembre) : une question peut figurer dans plusieurs niveaux.
- **Réponse « S ou R » pour les résistances naturelles** (remplacée le 14 novembre par « oui / non »). Le refus vise la question oui / non de J2 ; une case de J17 peut porter sur une molécule de résistance naturelle d'un profil sauvage (précisé le 17 novembre).
- Rappels : J3, J12, G5, G6, P9 (déjà retirés avant le 13 novembre).
