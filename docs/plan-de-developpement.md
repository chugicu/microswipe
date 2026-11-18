# Plan de développement — Application Microbio (17 novembre 2026, v18)

Complète le briefing (`docs/briefing.md`). Aucun code n'a été généré. Les propositions marquées « à valider » ou « proposé » ne sont pas des décisions.

**v3** : la phase 0, lot 1 est faite. Les mondes, l'architecture et les améliorations sont tranchés ; le détail des décisions est dans le briefing (§ 5, § 5 bis, § 8, § 10 bis, § 10 quater, § 14).
**v4** : ajout du **mode test réservé aux admins** (briefing § 10 quinquies), réparti entre les phases 2 et 3.
**v5** : la phase 0, lot 2 est faite. L'architecture détaillée est dans `docs/architecture.md`, le schéma de données dans `docs/schema-de-donnees.md`.
**v6** : la phase 0, lot 4a est faite. Le `CLAUDE.md` est dans `CLAUDE.md` ; ses décisions sont au § 9. Le lot 4b (specs) passe avant les lots 3 et 5, pour placer d'abord sous Fable ce qui structure le reste.
**v7** : lot 4b, conversation 1 sur 5. Les phases 1 à 7 sont découpées en 79 lots numérotés (`docs/specs/index.md`). Les specs de la synchronisation sont écrites (`docs/specs/lot-308.md` et `lot-309.md`). Décisions au § 9, dont la règle des deux modules uniques ; le schéma de données (§ 4.5, § 5) et l'architecture (§ 2, § 7, § 9) ont été mis à jour.
**v8** : lot 4b, conversation 2 sur 5. Les specs du squelette du serveur, des comptes et des paquets de contenu sont écrites (`docs/specs/lot-301.md`, `lot-302.md`, `lot-306.md`), après lecture du serveur de Carnet Réa. Décisions au § 9, dont le compte Google dédié à Microbio. L'index des lots porte les nouveaux contrats et les points signalés. L'architecture et le schéma restent à aligner (§ 10).
**v9** : lot 4b, conversation 3 sur 5. Les specs du moteur de niveaux piloté par les données sont écrites (`docs/specs/lot-201.md`, `lot-208.md`, `lot-213.md`). Décisions au § 9, dont le niveau partiellement validé, les règles du boss et le format de `Réglages`. La spec 306 est à amender (section `reglages` du paquet) ; le briefing, l'architecture et le schéma restent à aligner (§ 10).
**v10** : lot 4b, conversation 4 sur 5. La spec 306 est amendée (section `reglages`). Les specs de la conversion du tableur et de l'import annuel sont écrites (`docs/specs/lot-305.md`, `lot-505.md`, `lot-506.md`), après lecture de la structure du tableur v6. Décisions au § 9, dont la copie de référence de l'import. L'index fixe ce que le lot 315 doit fournir (onglet Historique, contrôle commun des écritures de contenu). Le briefing, l'architecture et le schéma restent à aligner (§ 10).
**v11** : lot 4b, conversation 5. Les specs du moteur ELO sont écrites (`docs/specs/lot-401.md`, `lot-402.md`, `lot-403.md`). Décisions au § 9, dont un seul ELO que la campagne ne fait pas bouger, et le nombre de réponses proposées gardé dans le journal. Les specs 201, 308 et 309 sont à amender avant d'être codées ; le briefing, l'architecture et le schéma restent à aligner (§ 10).
**v12** : fin de la promotion Fable 5.2 (16 novembre). **Nouvelle méthode** : les specs qui restent sont écrites par Opus 5.5 juste avant leur lot, puis le lot est codé par Sonnet 5.5 (§ 3, § 6). Le lot 5 (simulation ELO) passe après le lot 401. La remise à jour du briefing, de l'architecture et du schéma se fait au moment du lot 101. Les décisions de la conversation 5 sont reportées au § 9.
**v13** : conversation A faite (16 novembre, Opus 5.5). Les specs 201, 308 et 309 sont amendées : champ `reponsesProposees` (entier de 2 à 100) dans l'événement de réponse, la file et le message, et seizième colonne du journal, `Réponses proposées`. Décisions au § 9. Les trois points à confirmer ont été tranchés par l'auteur le même jour : bornes de 2 à 100, **objet de saisie** `{ reponse, temps, reponsesProposees }` pour répondre (spec 201 mise à jour), et aucun recoupement du nombre par le moteur. Prochaine étape : conversation B (§ 10).
**v14** : conversation B faite (16 novembre, Opus 5.5). Les specs 101, 102, 104 et 107 sont écrites (`docs/specs/lot-101.md`, `lot-102.md`, `lot-104.md`, `lot-107.md`) ; 103, 105, 106 et 108 restent, à écrire juste avant leur lot. Leurs choix par défaut sont au § 9, **à confirmer par l'auteur** ; le principal : **la conversation Opus de remise à jour des documents prépare aussi leurs versions sans contenu médical dans `depot/` du projet claude.ai**, que le lot 101 copie sans rien changer. L'index porte les nouveaux contrats, la règle 14 (stockage local) et les points signalés 58 à 67. Prochaine étape : § 10.
**v15** : conversation B, suite (16 novembre). Les specs 103 et 108 sont écrites (`docs/specs/lot-103.md`, `lot-108.md`) **après des questions à l'auteur**, décisions au § 9. Principales : l'appli s'appelle **MicroSwipe** pour l'interne (dépôt `chugicu/microswipe`, adresse `chugicu.github.io/microswipe/`) ; logo en grand environ une seconde à chaque ouverture, coupable par un interrupteur admin ; mise à jour silencieuse ; invitation à installer après la 1re et la 10e partie ; GitHub Pages activé au lot 103. Les specs 105 et 106 attendent la conversation C. Les specs 208, 213 et 301 sont à amender (index des lots).
**v16** : conversation C faite (16 novembre, Opus 5.5) : **phase 0, lot 3**. Audit de la maquette, design system et système de mouvement dans `docs/design-system.md`, **après des questions à l'auteur** (décisions au § 9). Principales : **fond clair** ; la mécanique n'apparaît que sur la fiche, plus dans la boîte de Pétri ; **monde maîtrisé** = boss réussi et 3 étoiles à tous les niveaux ; vert et rouge permis pour le retour juste / faux (l'interdit ne vise que les dessins de bactéries) ; écrans du mode test, du boss verrouillé et de l'espace Admin dessinés. Le logo n'est pas encore fourni ; les milieux des mondes 4 à 12 restent à fournir. Les specs 105 et 106 peuvent s'écrire ; la spec 102 est à amender (clés `Milieu`).
**v17** : conversation C, suite (17 novembre). La maquette a été retravaillée avec l'auteur dans la toile « Carte Boîte de Pétri » (planche « B + D » jouable, planches E1 à E3) ; le design system est mis à jour (`docs/design-system.md`, § 0 bis, décisions 17 à 35). Principales : **fiche de paillasse** ; surfaces claires **à matière**, jamais blanches unies ; **bouton principal bleu nuit en relief, texte crème** ; **scotch** comme motif signature ; **un objet de paillasse par monde** ; **carte à deux niveaux** (pile et vue zoomée, défilement vertical, changement de monde sans dézoomer) ; **bandeaux masqués**, rappelés au toucher ; étiquette de la mécanique sur la carte après la 1re partie ; monde maîtrisé rejouable. **Méthode décidée** : la maquette n'est plus retouchée pour des détails ; les finitions se font sur l'appli réelle, lot par lot ; restent à maquetter, au niveau de la direction, les écrans de jeu.
**v18** : **conversation de remise à jour** faite (17 novembre, Opus 5.5), **après des questions à l'auteur** (décisions au § 9). Les choix de la conversation B étaient déjà confirmés (index, point 67). Briefing, architecture et schéma alignés sur les conversations 2 à 5, A, B et C et sur le cadrage du lot 611 ; `CLAUDE.md` complété (règles relues et acceptées par l'auteur) ; design system § 9.14 (logo) ; specs 102, 103, 208, 213 et 301 amendées ; lot 611 ajouté à l'index. **Les versions du dépôt, sans contenu médical, sont dans `depot/` du projet claude.ai**, tirées des versions complètes par des marqueurs et un script (`claude/outils/depot.py`, index, point 74). Prochaine étape : relecture de `depot/` du projet claude.ai par l'auteur, puis lot 101 (§ 10).

## 1. Cadre retenu (réponses de l'auteur)

- Base : HTML/JS simple + Apps Script + Google Sheets (imposé), comme Carnet Réa.
- Format : PWA installable d'abord, stores plus tard.
- Auteur non développeur ; 30 à 150 utilisateurs la première année.
- Cible : tout le briefing.
- Abonnement Pro. Fable 5.2 a été disponible quelques jours (offre promotionnelle, terminée le 16 novembre) ; la suite se fait avec Opus 5.5, Sonnet 5.5 et Haiku 5.5.
- **Pas de délai, pas d'estimation de durée, pas de version pilote** : génération au fil de l'eau, dans l'ordre des phases, prêt quand c'est prêt.

## 2. Méthode : une conversation par lot

Jamais de génération en une fois. Chaque conversation traite un lot, testable seul.

- **Outil** : Claude Code (application desktop), branché sur le dépôt GitHub. Claude écrit, teste dans un navigateur et enregistre lui-même ; rien à copier-coller.
- **La mémoire est dans le dépôt, pas dans la conversation** :
  - `CLAUDE.md` : règles du projet (pédagogie, conventions, interdits), lu automatiquement à chaque session. **Écrit au lot 4a** (`CLAUDE.md`), à copier à la racine du dépôt ;
  - `docs/` : briefing, architecture, schéma de données, design system, spécification de chaque lot ;
  - `PROGRESS.md` : ce qui est fait, ce qui reste, les décisions prises.
- **Tant que le dépôt n'existe pas** (phase 0), la mémoire est dans le projet claude.ai : ce plan, le briefing, `docs/architecture.md`, `docs/schema-de-donnees.md`, `CLAUDE.md`, `docs/design-system.md` et `docs/specs/`. Ces documents seront copiés dans `docs/` à la création du dépôt, **dans une version sans contenu médical** (décidé le 15 novembre, § 9) ; la version complète reste dans le projet claude.ai. Le design system ne contient aucun contenu médical : il se copie tel quel. **Confirmé le 17 novembre** : ces versions sont préparées dans `depot/` du projet claude.ai par la conversation Opus de remise à jour (faite le 17 novembre), et le lot 101 les copie telles quelles.
- **Spec juste avant le lot** (depuis le 16 novembre) : si la spec du lot n'existe pas, une conversation courte avec Opus 5.5 l'écrit d'abord, en lisant `docs/specs/index.md` (contrats et points signalés). Puis une nouvelle conversation code le lot. **Après le lot 101** (confirmé le 17 novembre) : la spec est rangée dans `depot/specs/` du projet claude.ai, et le premier commit du lot la copie dans `docs/specs/`, avec l'index s'il a changé ; la spec est donc écrite sans contenu médical dès le départ.
- **Rituel d'une conversation de code** : « Lis PROGRESS.md et la spec du lot N, fais ce lot, teste, mets à jour PROGRESS.md, enregistre. » Puis nouvelle conversation pour le lot suivant. Une conversation longue coûte de plus en plus cher à chaque message.
- **Filet de sécurité** : tests automatiques sur le moteur ELO, l'import du tableur, la synchronisation et le filtre des questions non validées (`node --test`, sans dépendance, sur des données fictives) ; un environnement de test séparé (copie des fichiers Google) ; travail sur la branche `dev`, `main` et la production seulement sur demande de l'auteur ; une relecture par une conversation neuve avant chaque mise en ligne, et après chaque moteur critique. Le **mode test** de l'appli complète ce filet côté contenu. Depuis la spec 101 : un crochet git et des règles de permission de Claude Code empêchent techniquement d'enregistrer du contenu réel, de commettre sur `main` ou de modifier Carnet Réa.

## 3. Après Fable 5.2 : bilan et nouvel ordre

**Fait sous Fable** : phase 0, lots 1, 2 et 4a ; lot 4b, conversations 1 à 5 (index des 79 lots et 14 specs : 201, 208, 213, 301, 302, 305, 306, 308, 309, 401, 402, 403, 505, 506). Le cadre structurant est donc posé : architecture, schéma, `CLAUDE.md`, contrats entre lots, moteurs critiques spécifiés.

**Ce qui change** : écrire toutes les specs d'avance servait à profiter de Fable. Ce n'est plus utile. Une spec écrite juste avant son lot tient compte de ce qui a réellement été codé, et l'index garde les contrats entre lots.

**Nouvel ordre** :

1. ~~**Conversation A** (Opus 5.5, effort élevé) : amender les specs 201, 308 et 309 (champ `reponsesProposees`, seizième colonne du journal ; point signalé 42). Obligatoire avant de coder le lot 201.~~ **Fait le 16 novembre** (décisions au § 9), points à confirmer tranchés le même jour.
2. ~~**Conversation B** (Opus 5.5, effort élevé) : specs de la phase 1 : 101, 102, 104, 107 d'abord, puis 103, 105, 106, 108 s'il reste de la place. La spec 102 (jeu de données fictif) est la plus attendue.~~ **Faite le 16 novembre pour 101, 102, 103, 104, 107 et 108** (choix par défaut des specs 101, 102, 104 et 107 au § 9, à confirmer ; décisions des specs 103 et 108 tranchées par l'auteur). Les specs 105 et 106 s'écrivent après la conversation C.
3. ~~**Conversation C** (Opus 5.5, effort élevé) : **lot 3** de la phase 0, audit de la maquette, design system et système de mouvement (livrable `docs/design-system.md`). À joindre : le logo et la maquette. Avant les lots 105 et 106.~~ **Faite les 16 et 17 novembre** (`docs/design-system.md`, décisions au § 9). La maquette a été lue par son lien, puis retravaillée avec l'auteur ; le logo n'est pas encore fourni.
4. **Lot 101** : création du dépôt. La remise à jour du briefing, de l'architecture et du schéma (décisions des conversations 2 à 5, A, B et C, points signalés 25, 39, 42, 54 et 58 de l'index) se fait dans la même suite, au moment de les copier dans `docs/` sans contenu médical : une conversation Opus 5.5 pour les documents complets du projet claude.ai **et leurs versions du dépôt dans `depot/` du projet claude.ai** (CLAUDE.md, briefing, architecture, schéma, plan, design system, index, specs ; renvois en `docs/…`), relues par l'auteur, puis le lot 101 avec Sonnet 5.5, qui les copie sans rien changer (`docs/specs/lot-101.md`). **Conversation de remise à jour faite le 17 novembre** (§ 9) ; reste la relecture de `depot/` du projet claude.ai par l'auteur.
5. **Phase 1, puis les phases suivantes, lot par lot** : spec par Opus si elle manque, code par Sonnet, relecture par Opus pour les moteurs critiques (201, 308, 309, 401, 402, 403, 505, 506).
6. **Lot 5** (chiffres ELO par simulation) : **après le lot 401**, puisque le script charge `serveur/logique/elo.js`. Script par Sonnet, lecture des résultats et proposition des sept valeurs par Opus.
7. **Vérification du contenu médical** des mondes 1 et 2 contre CASFM/EUCAST : Opus 5.5, effort élevé, puis validation humaine obligatoire.

Fable 5.2 reste accessible en crédits d'utilisation payants, hors abonnement (source : https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan). Il n'est pas nécessaire pour la suite.

## 4. Architecture (validée le 13 novembre, détaillée le 14 novembre)

Les onze points sont dans le briefing § 10 quater ; les flux sont dans `docs/architecture.md`. En résumé :

- **Client** : JavaScript en modules, sans framework ni étape de compilation, hébergé sur GitHub Pages (dépôt public), **sur le même domaine que Carnet Réa**. Service worker pour le hors-ligne, **IndexedDB** pour les données. Le serveur reste la référence.
- **Le contenu médical n'est pas sur GitHub Pages** : il est servi par Apps Script après connexion, dans un paquet préparé à l'avance et remplacé en entier à chaque nouvelle version. **Les questions non validées ne sont envoyées qu'aux comptes admin.**
- **Tout est donnée** : mondes, niveaux et questions viennent de la Google Sheet de production. Ajouter un monde ne touche pas au code ; une nouvelle mécanique de jeu, si. Les seuils d'étoiles viennent de l'onglet `Reglages`, que le paquet transporte en entier (décidé le 15 novembre) : rien de ce qui doit rester sur le serveur n'y est donc rangé.
- **Trois fichiers Google** : Contenu (la Sheet de production), Joueurs (données personnelles), Journal (un par année).
- **Jamais d'attente serveur pendant le jeu.** Exceptions : les corrections du mode test, et le pré-test et le post-test, corrigés par le serveur. (Liste de référence de ce qui demande du réseau : `docs/architecture.md`, § 5.2.)
- **Journal de réponses** : une ligne par réponse, jamais modifiée. ELO, étoiles, tableaux de bord et étalonnage en sont recalculés. Le mode test n'y écrit rien.
- **ELO officiel calculé côté serveur**, dans l'ordre de réception ; le téléphone affiche une estimation en attendant.
- **Écritures concurrentes** protégées (LockService), classement mis en cache, sauvegarde automatique.
- **Deux modules uniques** (décidé le 15 novembre) : côté serveur, tous les accès à Sheets passent par un seul module de stockage ; côté client, le serveur est appelé par un seul module, à adresse configurable. Une migration ne touche que ces deux modules.
- **Comptes** : table unique de Carnet Réa, **confirmé à la lecture du code**. Serveur Microbio séparé qui lit les comptes et sessions de Carnet Réa sans y écrire ; connexion par Carnet Réa ; verrou Face ID repris tel quel ; inscription autonome par un compte interne sans semestre (une ligne à changer dans Carnet Réa).
- **Compte Google dédié** (décidé le 15 novembre) : le serveur Microbio et ses fichiers appartiennent à un compte Google distinct de celui de Carnet Réa, à qui la Sheet de Carnet Réa est partagée en lecture seule. La lecture seule est alors garantie par Google, et `clasp` ne peut pas atteindre Carnet Réa.
- **Onglet « Questions » distinct des faits** : chaque question pointe vers le fait qu'elle teste (onglet, ligne, colonne) et n'en stocke pas la réponse. Une question peut figurer dans plusieurs niveaux (onglet Composition).
- **Validation par champ** et **table de correspondance par niveau** (schéma de données, § 3). Depuis le 15 novembre, la table est rangée par couple `Onglet:Champ`, dans un bloc `Réglages` au format JSON (`docs/specs/lot-201.md`, § 6.3).
- **Import annuel à trois états** (décidé le 16 novembre) : une copie de travail, une copie de référence jamais touchée, et la production. Seule une ligne changée des deux côtés est un conflit (`docs/specs/lot-505.md`, § 6.4).
- **Stockage local** (proposé le 16 novembre, spec 104) : une seule base IndexedDB, `microbio`, ouverte par une seule enveloppe ; chaque lot ajoute ses magasins par une migration, jamais modifiée ensuite. **Contenu en phases 1 et 2** (spec 107) : une source remplaçable qui répond comme le serveur ; le lot 307 n'aura qu'à la remplacer.
- **Polices hébergées dans le dépôt** (décidé le 16 novembre, design system § 4.1) : aucun appel à Google Fonts, pour le hors-ligne et pour ne transmettre aucune adresse IP à un tiers.

Points de vigilance techniques :
- Safari sur iPhone peut effacer les données locales d'un site non installé après 7 jours sans visite : seules les réponses hors ligne non synchronisées sont alors perdues. Installation conseillée.
- **iPhone, appli installée** : stockage probablement séparé, donc connexion et Face ID propres à Microbio. À vérifier en phase 1.
- Plafond de Google Sheets : 10 millions de cellules par fichier. Estimation non vérifiée du journal : environ 4,8 millions de cellules par an pour 150 internes (16 colonnes depuis le 16 novembre).
- Apps Script répond en 1 à 3 secondes, limite une exécution à 6 minutes et limite les exécutions simultanées (probablement 30 par compte : le compte dédié ne les partagerait alors plus avec Carnet Réa et EchoLearn, à vérifier). **Test de charge en phase 3.**
- La synchronisation de Carnet Réa charge chaque table en entier : ce modèle ne convient pas au journal, qui s'écrit par ajout.
- **Mode test** : le filtrage des questions non validées doit se faire **côté serveur**, jamais seulement dans l'interface. En phase 2, sans serveur, le mode test ne s'ouvre que hors de l'adresse publique et sur des données fictives.
- **Session** : Carnet Réa prolonge une session quand on l'appelle ; Microbio, en lecture seule, ne le peut pas. Sans appel à Carnet Réa, la session s'éteint après 14 jours par défaut (lot 303).
- **Import annuel** : son application peut dépasser la durée d'une exécution Apps Script. Elle est donc reprenable, et bloque les autres écritures de contenu tant qu'elle n'est pas finie (lot 506).

## 5. Phases et lots (ordre de génération, sans calendrier)

Les phases 1 à 7 sont découpées en lots numérotés dans `docs/specs/index.md` : la centaine donne la phase (308 = phase 3, huitième lot), et un lot ne dépend que de lots de numéro inférieur. Cette numérotation est distincte de celle des lots de la phase 0.

| Phase | Lots | Contenu |
|---|---|---|
| **0. Cadrage** (sans code) | 1 à 5 | **Lot 1 (fait)** : mondes, architecture, améliorations, points ouverts bloquants, mode test. **Lot 2 (fait)** : document d'architecture et schéma de données. **Lot 4a (fait)** : `CLAUDE.md`. **Lot 4b (fait sous sa forme prévue, 5 conversations)** : index des lots et specs 201, 208, 213, 301, 302, 305, 306, 308, 309, 401, 402, 403, 505 et 506 ; **l'amendement des specs 201, 308 et 309 est fait** (conversation A, 16 novembre) ; **les specs 101, 102, 104 et 107 sont écrites** (conversation B, 16 novembre) ; les autres specs s'écrivent juste avant leur lot. **Lot 3 (fait, conversation C, 16 novembre)** : audit de la maquette, design system, système de mouvement (`docs/design-system.md`). **Lot 5** : chiffres ELO par simulation, **placé après le lot 401**. |
| **1. Fondations** | 101 à 108 | Dépôt, avec `CLAUDE.md` à la racine et les documents copiés dans `docs/` **sans contenu médical**, depuis `depot/` du projet claude.ai (**lot 101, spec écrite**) ; branche `dev` ; **garde-fous techniques** (`.gitignore` du contenu local, crochet git, règles de permission qui bloquent Carnet Réa) ; mise en place de `node --test` ; **jeu de données fictif**, en deux paquets « internes » et « admin », avec la section `reglages`, les seuils d'étoiles, les sept clés ELO et un palier par question (**lot 102, spec écrite, amendée le 17 novembre : clés `Milieu`**) ; stockage local (IndexedDB, **lot 104, spec écrite**) ; chargement du contenu (**lot 107, spec écrite**) ; coquille PWA, logo à l'ouverture, mise à jour silencieuse, invitation à installer, publication sur GitHub Pages (**lot 103, spec écrite, amendée le 17 novembre : logo**) ; **vérifier sur iPhone et Android** le stockage d'une appli installée et la vibration (**lot 108, spec écrite**) ; composants du design system (boutons, fiches, transitions) et navigation (lots 105 et 106, **specs à écrire, design system prêt**) |
| **2. Campagne** | 201 à 214 | Carte en pile de boîtes + fiche de niveau ; moteur de niveaux, dont la table de correspondance et le contrôle du nombre de réponses proposées (**lot 201, spec écrite, amendée le 16 novembre**) ; swipe (geste repris de Gram Swipe), QCM, tri par glisser-déposer, chacun donnant son nombre de réponses proposées ; étoiles ; progression locale et boss : réserve de questions, étoiles et niveaux réussis pour l'ouvrir, seuil de 90 % pour le monde suivant (**lot 208, spec écrite, amendée le 17 novembre : monde maîtrisé, invitation à installer**) ; explications (P1) ; re-test immédiat ; reprise exacte ; bestiaire (P4) ; révélation ; contenu des mondes 1 et 2 (**tant que le serveur n'existe pas : dans un dossier local exclu de git, jamais dans le dépôt** ; par défaut, à confirmer) ; **mode test : navigation libre** (tous mondes et niveaux ouverts, bannière, rien ne compte ; **lot 213, spec écrite, amendée le 17 novembre : `/microswipe/`**) |
| **3. Serveur** | 301 à 319 | Serveur Microbio séparé, sous un compte Google dédié, avec **son module de stockage unique et le module d'appel unique du client** (**lot 301, spec écrite, amendée le 17 novembre : `/microswipe/`**) ; lecture des comptes et sessions de Carnet Réa, onglet Profils et droits admin (**lot 302, spec écrite**) ; **modification de Carnet Réa pour l'inscription autonome** ; synchronisation hors ligne, journal à 16 colonnes (**lots 308 et 309, specs écrites, amendées le 16 novembre**) ; progression officielle (lot 310) ; conversion du tableur en fichier Contenu : douze onglets repris, identifiants des lignes d'antibiogrammes et du vocabulaire, `ID espèce` par libellé exact, ligne S7 écartée, rapport (**lot 305, spec écrite** ; la conversion réelle est lancée par l'auteur, après le lot 303 et avant le lot 306) ; paquets de contenu, questions non validées réservées aux admins (**lot 306, spec écrite, amendée le 15 novembre : section `reglages`**) ; chargement du contenu depuis le serveur, qui remplace la source fictive du lot 107 (lot 307) ; notice et consentement (lot 312) ; pré-test et post-test corrigés par le serveur (P7) ; export des résultats (C9) ; signalement d'erreur ; **mode test : corrections en jeu** (rédaction, réponse via le fait avec « touche N questions », suggestion dans la file des signalements, suppression = archivage, bouton « Valider » avec source et page, validation par champ), avec l'onglet Historique et le contrôle commun des écritures de contenu (lot 315) ; sauvegardes ; **test de charge** ; recette sur iPhone et Android |
| **4. ELO et modes** | 401 à 410 | Moteur ELO et étalonnage (**lot 401, spec écrite**), suivi du **lot 5 de la phase 0** (simulation) ; ELO branché sur la synchronisation et estimation sur le téléphone (**lot 402, spec écrite**) ; recalcul complet par tranches, lancé depuis l'espace Admin (**lot 403, spec écrite**) ; classé ; entraînement et carnet d'erreurs ; sprint ; survie ; classement ; bactérie du jour et Leitner ; contamination |
| **5. Administration** | 501 à 509 | Espace Admin (questions, composition des niveaux, validation, file des signalements et suggestions, mondes, interrupteurs, deux droits) ; import annuel : préparer deux copies et comparer trois états (**lot 505, spec écrite**), trancher les conflits et appliquer sous verrou, avec reprise après interruption (**lot 506, spec écrite**) ; tableaux de bord admin et tableau de bord personnel |
| **6. Mondes 3 à 12 et mécaniques avancées** | 601 à 611 | Contenu des mondes 3 à 12 au fil de la validation ; J4, J5, J7, J8, J10, J15, J16, intrus, et les mécaniques des nouveaux mondes (naturelle ou acquise, tri par mécanisme, relier test et cible, tri germes/pathologie) : une mécanique par conversation ; **Construis l'antibiogramme** (J17, lot 611, cadrage écrit le 17 novembre, `docs/specs/cadrage-lot-611.md`) |
| **7. Social** | 701 à 709 | Badges, série de connexion, cartes et échange, équipes Bleus/Oranges, duel, partage du score, tuile Carnet Réa, attestation |
| **8. Suite** | — | Infectiologie (dont J9 et J11), stores |

L'échange de cartes et le duel sont les fonctions les plus lourdes pour Apps Script : en dernier.

## 5 bis. Chantiers de l'auteur, en parallèle du développement

- **Valider le tableur**, monde par monde : d'abord l'onglet Especes et les entérobactéries (mondes 1 et 2). Rien n'est jouable avant validation (0 ligne validée sur 2 760). Dès la phase 3, la validation peut se faire **en jouant dans le mode test**.
- **Compléter le tableur** : atypiques, efflux, tests diagnostiques, BHRe, pathogènes par pathologie, avec leurs sources.
- **Convertir le tableur** (après le lot 303, avant le lot 306 ; détail : `docs/specs/lot-305.md`, § 6.11) :
  - importer le tableur dans Google Sheets, sur le Drive du compte Google dédié ;
  - lancer l'analyse et lire le rapport ;
  - compléter la colonne `ID espèce` pour les libellés que le rapprochement exact ne trouve pas (14 libellés au plus, 180 lignes dans le tableur v6), et ajouter une colonne `Source` aux onglets Phenotypes et Regles ;
  - lancer la conversion, une fois ;
  - **saisir les trois seuils d'étoiles** dans l'onglet Reglages : tant qu'ils manquent, le serveur ne sert aucun contenu.
- **Démarches** : DPO ou comité d'éthique (pré-test obligatoire, publication envisagée, **durée de conservation des comptes autonomes**) ; SFM (droits sur le contenu du CASFM) ; méthodologiste (post-test identique ou équivalent).
- **Créer le compte Google dédié à Microbio**, avant le lot 301. Au lot 303, partager avec lui la Sheet de Carnet Réa en « Lecteur ».
- **Fournir** : ~~le logo~~ (**fourni le 17 novembre** : deux PNG, à déposer dans un dossier de l'ordinateur, hors du dépôt, au moment du lot 101) ; **les milieux de culture des mondes 4 à 12** (clés `Milieu`, design system § 3.8 ; d'ici là, clé `neutre`). La maquette a été lue par son lien au lot 3. Le code de Carnet Réa (client et `Code.gs`) et le prototype de Gram Swipe ont été lus au lot 2 ; `Code.gs` a été relu au lot 4b, conversation 2, pour la spec 302. `Defaults.gs` de Carnet Réa n'a pas été lu : à joindre en phase 3, avec `Code.gs`, pour la modification de l'inscription.
- **Au lot 103** : activer GitHub Pages sur `main`, accepter l'avance de `main` jusqu'à `dev`, installer l'appli sur son téléphone. **Au lot 108** : faire les mesures sur l'iPhone et sur le téléphone Android, et coller les comptes rendus.
- **Avant le lot 101** : **relire et accepter les versions du dépôt dans `depot/` du projet claude.ai** (préparées le 17 novembre) ; installer Node 22 ou plus récent ; dire où créer le dépôt, et où sont les copies locales de Carnet Réa et d'EchoLearn s'il y en a (`docs/specs/lot-101.md`, § 4).
- **Chiffrer les valeurs du boss** de chaque monde (étoiles requises, nombre de questions, seuil) et prévoir pour chaque boss une réserve plus large que son tirage : un boss dont la réserve servie est trop petite est fermé (décidé le 15 novembre).
- **Chaque année, l'import** : préparer la copie depuis l'espace Admin, la modifier avec le compte Google dédié (identifiant vide pour une ligne nouvelle, jamais d'identifiant changé), comparer, trancher les conflits, appliquer.
- **Après le lot 5** (simulation, faite après le lot 401) : saisir les sept clés ELO dans l'onglet Reglages, puis lancer le recalcul de l'ELO depuis l'espace Admin. **Donner à chaque question un palier** (et, au besoin, un nom de plancher) : une question sans palier lisible ne compte pas pour l'ELO.

## 6. Modèle et effort par étape (depuis le 16 novembre)

| Étape | Modèle | Effort |
|---|---|---|
| Spécification d'un lot, amendement d'une spec, décisions | Opus 5.5 | élevé |
| Remise à jour du briefing, de l'architecture et du schéma, et leurs versions du dépôt | Opus 5.5 | élevé |
| Design system et système de mouvement (lot 3) | Opus 5.5 | élevé (fait) |
| Fondations et composants du design system | Sonnet 5.5 | moyen |
| Moteurs critiques (201, 308, 309, 401 à 403, 505, 506) | Sonnet 5.5, ou Opus 5.5 si le quota le permet | élevé |
| Animations clés (carte, swipe, changement de monde) | Sonnet 5.5 | élevé |
| Écriture courante (écrans, mécaniques, admin, mode test) | Sonnet 5.5 | moyen |
| Script de simulation ELO (lot 5) | Sonnet 5.5, puis Opus 5.5 pour lire les résultats | moyen, puis élevé |
| Petites corrections, textes, renommages, saisie de contenu | Haiku 5.5 | bas |
| Bug difficile, non résolu en deux essais par Sonnet | Opus 5.5 | élevé |
| Relecture d'un moteur critique, et avant chaque mise en ligne (conversation neuve) | Opus 5.5 | élevé |
| Vérification du contenu médical contre CASFM/EUCAST | Opus 5.5 | élevé, puis validation humaine obligatoire |

Règle de dépense : Opus pour décider et relire, Sonnet pour produire, Haiku pour retoucher. Fable 5.2 n'est plus inclus dans l'abonnement Pro (facturé en crédits d'utilisation) ; il n'est pas prévu dans la suite.

## 7. Connexions

- **GitHub : oui, indispensable.** C'est la mémoire du projet, l'hébergement et l'historique (retour en arrière possible). Dépôt public, compte gratuit (décidé). Le contenu médical n'y est jamais déposé, **y compris dans `docs/`, les specs, les tests et les messages de commit**. Le dépôt doit être publié sur le même domaine que Carnet Réa (`chugicu.github.io`). Le travail se fait sur la branche `dev` ; `main`, que GitHub Pages publie, ne reçoit rien sans demande de l'auteur. **Décidé le 16 novembre** : dépôt `chugicu/microswipe`, adresse `https://chugicu.github.io/microswipe/` ; `main` ne reçoit que le premier commit au lot 101, puis avance jusqu'à `dev` à chaque publication, avec l'accord de l'auteur, à partir du lot 103 (GitHub Pages activé à ce lot).
- **Google Drive : oui, mais seulement pour les conversations de contenu** (conversion du tableur, lecture de la Sheet, import). Le connecteur ne déploie pas Apps Script : le déploiement passe par l'outil `clasp`, que Claude Code lance sur ton ordinateur, à mettre en place en phase 3. Claude ne déploie que vers l'environnement de test. **`clasp` n'est connecté qu'au compte Google dédié à Microbio** (décidé le 15 novembre), et le dépôt ne contient que l'identifiant du projet de test. Depuis le 15 novembre, la conversion du tableur est une fonction du serveur de test, lancée par l'auteur : Claude n'a pas besoin d'ouvrir le tableur réel.
- Joindre le logo au dépôt dès sa création (`client/images/`, spec 101). **Le tableur ne va pas dans le dépôt public** (contenu protégé) : il reste dans Drive. L'ancien tableur et la liste de bactéries du prototype Gram Swipe ne sont pas repris.

## 8. Design et expérience

**Fait au lot 3 (16 novembre)** : l'audit de la maquette, le design system et le système de mouvement sont dans `docs/design-system.md`, qui fait référence pour toute valeur visuelle. Rappel des axes, avec ce qui a été décidé :

- **Design system unique** : couleurs, typographie, espacements, rayons, durées et courbes d'animation définis une fois, utilisés partout (design system § 3 à § 6). **Fond clair à matière** (paillasse : marbrure, grain, lumière ; jamais blanc uni), et non sombre comme proposé ici avant le lot 3 ; **bleu nuit (encre) et crème** pour les boutons et les bandeaux, orange pour le boss ; scotch écrit à la main comme motif signature ; contraste AA vérifié par calcul.
- **Carte à deux niveaux** (17 novembre) : la pile (vue d'ensemble, résumés encadrés) et la vue zoomée sur un monde (vue de jeu) ; défilement vertical dans les deux, changement de monde sans dézoomer ; bandeaux masqués, rappelés au toucher de la paillasse ; un objet de paillasse par monde (design system § 10).
- **Fiche de paillasse** (17 novembre) : bandeau de la gélose du monde, médaillon de la colonie, trio d'étoiles (gauche, droite, puis haut), règle du jeu avec le geste mimé, bouton en relief ; fiche du boss sombre ; écran de fin de niveau (design system § 10.6, § 11, § 14.2).
- **Système de mouvement** : 80, 120, 240 et 400 ms ; séquences de célébration de 2,5 s au plus (relevé le 17 novembre) et passables d'un toucher ; ressorts pour tout ce qui suit le doigt ; seules la position, l'échelle, la rotation et l'opacité s'animent ; une seule animation en boucle (le niveau en cours).
- **Appui sur un bouton** : compression dès le contact (80 ms), relâchement en ressort, action au relâchement.
- **Swipe** : la carte suit le doigt avec une rotation, part selon la vitesse du geste, revient en ressort si le geste est trop court ; la zone cible s'allume à l'approche (seuils chiffrés : design system § 7.4).
- **Continuité** : la colonie touchée se transforme en aperçu de la fiche de niveau (design system § 7.2).
- **Retour juste/faux** jamais par la couleur seule : icône, forme, mouvement, vibration. **Décidé le 16 novembre** : le vert et le rouge sont permis pour ce retour ; l'interdit ne vise que les dessins de bactéries, qui ne sont jamais teintés par le retour.
- **Jamais d'indicateur de chargement en jeu** ; affichage immédiat, synchronisation invisible. Exceptions : le premier chargement du contenu après connexion, l'enregistrement d'une correction en mode test, la correction du pré-test et du post-test, et les écrans de l'espace Admin (dont l'import annuel).
- **Usage à une main** : commandes dans la zone du pouce, cibles d'au moins 44 px, marges de sécurité de l'iPhone.
- **Premier niveau jouable très vite** après l'ouverture, tutoriel par la pratique.
- **Sons** discrets et coupés par défaut (contexte hospitalier) ; aucun au lancement.
- **Inciter à l'installation** sur l'écran d'accueil (voir § 4). **Décidé le 16 novembre** : une carte après la 1re et après la 10e partie terminée, si l'appli n'est pas installée, et une ligne dans Profil (`docs/specs/lot-103.md`, § 6.6).
- **Logo à l'ouverture** (décidé le 16 novembre) : en grand, environ une seconde à chaque ouverture, un toucher le fait passer ; interrupteur général `accueil.logo` pour les admins. Logo MicroSwipe fourni le 17 novembre : écran d'ouverture sur le fond crème `#FFE9B0`, logo posé sans pastille dans la barre du haut (design system § 9.14).
- **Mode test** : bannière orange foncé à deux lignes, outils de correction derrière un bouton « Outils » de la bannière, écran « cette correction touche N questions » et bouton « Valider » avec source et page : **dessinés** (design system § 12), textes confirmés.
- **Boss verrouillé** : sa fiche dit ce qui manque (niveaux, étoiles) ; une raison de données affiche « Ce boss n'est pas encore prêt. » (design system § 11).
- **Espace Admin** : tableau, liste paginée, comparaison de trois valeurs (« Référence », « Contenu actuel », « Copie »), avancement : **dessinés** (design system § 13), pensés pour l'ordinateur.
- **Palette des dessins de bactéries** : fixée (six couleurs, bandes de teinte interdites, design system § 3.9) ; le bleu-vert `#1D9E8F` est retiré.
- **Clés de couleur des mondes** (colonne `Milieu`) : `sang`, `bcp`, `chocolat` pour les mondes 1 à 3, `neutre` en secours (design system § 3.8) ; les mondes 4 à 12 attendent l'auteur.
- **Mécanique** : sur la fiche (puce, toujours), et sur la carte, en vue zoomée, après la 1re partie (décision du 17 novembre, design system décision 26) ; l'aspect des colonies n'en dépend jamais ; liste ouverte, avec une puce générique « Jeu » pour une mécanique inconnue.
- **Point de vigilance** : la vibration web n'est pas prise en charge par Safari sur iPhone. G14 y est masqué (décision du lot 108).

## 9. Décisions

### Améliorations (13 et 14 novembre)

| # | Amélioration | Décision |
|---|---|---|
| 1 | Seules les lignes « Validé » sont servies, avec validateur et date | **Validé.** L'auteur valide lui-même |
| 2 | Bouton « Signaler une erreur » | **Validé** |
| 3 | Version du référentiel affichée dans chaque explication | **Validé** |
| 4 | Re-test immédiat en fin de niveau, hors score | **Validé**, sauf au boss |
| 5 | Boss cumulatif | **Refusé** |
| 6 | Carnet d'erreurs | **Validé**, comme filtre de l'entraînement |
| 7 | Explication consultable après une bonne réponse | **Validé**, sauf en sprint |
| 8a | Questions réservées au pré-test et au post-test | **Refusé** : les tests puisent dans la base commune |
| 8b | Le pré-test fixe l'ELO de départ | **Validé** |
| 8c | Post-test identique au pré-test, sans correction au pré-test | **Validé**, à confirmer avec un méthodologiste |
| 9 | Simuler avant de chiffrer l'ELO | **Validé** |
| 10 | Paliers pesant durablement, K faible côté questions | **Validé** |
| 11 | Consentement, pseudonymisation, DPO ou comité d'éthique | **Validé**, démarche de l'auteur |
| 12 | Tableau de bord personnel de l'interne | **Validé**, avec un maximum de statistiques pertinentes |
| 13 | Notification de la bactérie du jour | **Refusé** |
| 14 | Reprise exacte | **Validé**, sauf en sprint |
| 15 | Mode staff | **Refusé** |
| 16 | Mode test réservé aux admins (14 novembre) | **Validé** : navigation libre, rien ne compte, corrections, suggestions et validation en jeu (briefing § 10 quinquies) |

Autres décisions du lot 1 : 12 mondes (briefing § 5 bis) ; les étoiles ouvrent le boss, au moins 90 % au boss ouvre le monde suivant, boss tiré dans une réserve ; règles du monde invisible ; deux droits admin ; table de comptes unique ; dépôt public.

### Lot 2 (14 novembre)

Les 21 décisions sont listées dans `docs/architecture.md`, § 8. Les principales :

- Trois fichiers : Contenu, Joueurs, Journal annuel.
- La réponse d'une question est lue dans le fait qu'elle teste ; « réponse propre » pour les QCM et les questions simplifiées.
- Une question peut figurer dans plusieurs niveaux. **Refusé** : la limiter à un seul niveau.
- Résistances naturelles posées en « oui / non », jamais en S ou R ; valeur « r » exclue des questions oui / non.
- Seule la première réponse d'un interne à une question étalonne, campagne comprise ; ELO dans l'ordre de réception.
- Pré-test et post-test corrigés par le serveur.
- Validation par champ ; à l'import, le statut de validation vient de la copie.
- Serveur Microbio séparé ; connexion par Carnet Réa ; inscription autonome sans semestre.
- L'ancien tableur et la liste de bactéries du prototype Gram Swipe ne sont pas repris.

### Lot 4a (15 novembre)

Décisions prises en écrivant `CLAUDE.md` :

1. **Dessins de bactéries, règles cumulées.** Question sur le Gram : jamais rose, violet, rouge ni vert ; une couleur unique ou des couleurs aléatoires. Question sur la forme : forme générique, ni ronde ni en bâtonnet allongé. Question sur les deux : les deux règles. Le briefing a été aligné le 15 novembre (§ 2 règle 6, § 6, § 7 J1).
2. **Documents du dépôt sans contenu médical.** Dans `docs/` : le briefing sans son § 11 ni les exemples médicaux du § 7, et le schéma avec des exemples fictifs. L'architecture est copiée en entier. La version complète reste dans le projet claude.ai.
3. **Définition du contenu médical** : tout fait issu du tableur ou de la Sheet (valeur, réponse, énoncé, explication, règle), y compris dans un test, un exemple, un commentaire, une spec ou un message de commit. Les tests utilisent des données fictives.
4. **La spec du lot vaut accord** : en session de développement, Claude fait ce que la spec décrit et rien d'autre.
5. **Mise en ligne** : travail sur la branche `dev` et l'environnement Apps Script de test ; `main` et la production seulement sur demande de l'auteur.
6. **Nommage** : termes du domaine en français sans accent, repris du schéma ; fichiers en `kebab-case`, fonctions en `camelCase` ; commentaires, commits et interface en français, en tutoyant l'interne. La convention de Carnet Réa n'a pas été relue : à signaler si elle diffère.
7. **Tests** : `node --test`, sans dépendance ; logique critique en fonctions pures, séparées des appels Google ; tout passe avant d'enregistrer ; aucun test modifié pour le faire passer.
8. **Cas d'arrêt** de Claude, en plus du contenu médical incertain, du schéma, des dépendances et de Carnet Réa : contradiction entre spec et documents ; deux essais ratés sur un même bug ; écriture dans les fichiers Google de production ; sortie du lot.
9. **Claude n'écrit aucun fait médical de mémoire et ne passe jamais une ligne à « Validé ».**
10. **Propositions refusées** : le `CLAUDE.md` reprend le briefing § 14 en une ligne et demande de vérifier le briefing avant toute proposition.
11. **Garde-fous techniques en phase 1** : `.gitignore` du contenu local et blocage des fichiers de Carnet Réa. Un `CLAUDE.md` est une consigne, pas un verrou.
12. **Ce qui demande du réseau** : la liste de référence est `docs/architecture.md`, § 5.2 ; le `CLAUDE.md` y renvoie sans la recopier.

Pris par défaut, **à confirmer** : pendant les phases 1 et 2, avant que le serveur existe, le dépôt ne contient qu'un jeu de données fictif ; le contenu réel des mondes 1 et 2 reste dans un dossier local exclu de git.

### Lot 4b, conversation 1 (15 novembre)

Décisions prises en écrivant l'index et les specs de la synchronisation :

1. **Numérotation des lots de développement** : la centaine donne la phase ; fichiers `docs/specs/lot-N.md`. 79 lots (`docs/specs/index.md`).
2. **Synchronisation en deux lots** : 308 (serveur) et 309 (téléphone), reliés par le format des messages.
3. **Synchronisation avant l'ELO** : le lot 308 écrit le journal et laisse un point de branchement ; le lot 402 y branche l'ELO ; le recalcul complet (lot 403) rattrape les réponses reçues entre-temps. La progression officielle est le lot 310.
4. **Fin de partie dans le journal** : nouvelle colonne `Questions de la partie` dans `Reponses` (15 colonnes). Une partie est terminée quand le journal contient ce nombre de lignes pour la même `Partie`.
5. **Identifiant d'une réponse** : identifiant d'installation + numéro d'ordre. Suivi garde le dernier numéro reçu de chaque installation ; tout numéro inférieur ou égal est un doublon. Tout calcul ignore une ligne du journal dont l'`ID` a déjà été vu.
6. **Fichier Journal de l'année** : créé automatiquement à la première réception de l'année, à l'heure de la Guadeloupe ; identifiant dans les propriétés du script.
7. **Question retirée entre-temps** : le journal accepte toute réponse dont la question existe dans le fichier Contenu, quel que soit son état. Le serveur reconnaît le mode test à la colonne `Mode` (liste fermée).
8. **Effacement par Safari** : aucun message après coup ; envoi à chaque fin de partie et à chaque ouverture, demande de stockage persistant, ligne « N réponses en attente d'envoi » dans Profil.
9. **Choix techniques acceptés par défaut** : chaque réponse de la file porte son compte et n'est jamais envoyée sous un autre ; les modes « pré-test », « post-test » et « duel » sont refusés par la synchronisation tant que les lots 313 et 706 ne les ont pas ouverts ; rien ne part quand l'appli est fermée ; taille des paquets et délais de renvoi en constantes du client.
10. **Deux modules uniques, pour garder la migration bon marché** : côté serveur, tous les accès à Sheets et à Drive passent par un seul module de stockage ; côté client, le serveur est appelé par un seul module à adresse configurable. Règle écrite dans l'architecture § 2 et dans l'index des lots ; à détailler dans la spec du lot 301. La spec 308 l'applique déjà, la spec 309 passait déjà par `appelerServeur`.

Écrits dans les specs sans avoir été demandés à l'auteur, **à confirmer** : dates du journal en texte ISO 8601 UTC ; en-têtes `État 1`, `État 2`… et format JSON des cellules d'état de Suivi ; texte de Profil quand le stockage du téléphone est indisponible. (L'identifiant de partie créé par le moteur de niveaux, `p` + 9 caractères, a été confirmé à la conversation 3.)

### Lot 4b, conversation 2 (15 novembre)

Décisions prises en écrivant les specs 301, 302 et 306. Trois ont fait l'objet d'une question ; les autres ont été proposées par défaut et acceptées.

**Tranchées par une question**

1. **Compte Google dédié à Microbio.** Le serveur et ses fichiers lui appartiennent ; la Sheet de Carnet Réa lui est partagée en « Lecteur ». La lecture seule est garantie par Google, et `clasp` ne peut pas atteindre Carnet Réa.
2. **Fichier de comptes fictif en test, jusqu'au lot 303.** Le serveur de test ne lit la vraie Sheet de Carnet Réa qu'à partir du lot 303.
3. **Validation par champ, règle stricte.** Pour un fait dont la ligne n'est pas « Validé », seules les colonnes listées dans `Champs validés` partent dans le paquet « internes ». Conséquence pour le lot 316 : le bouton « Valider » inscrit toutes les colonnes que la carte a montrées.

**Squelette du serveur (spec 301)**

4. Deux projets Apps Script, test et production ; le dépôt ne connaît que celui de test. Les fichiers de test sont créés par une fonction d'installation.
5. Le module de stockage porte aussi les propriétés du script et le cache, et refuse en dur toute écriture vers le fichier de Carnet Réa.
6. Fonctions pures dans `serveur/logique/`, terminées par un export réservé à Node ; aucun code exécuté au chargement.
7. Même transport que Carnet Réa ; action `ping` qui rend la version du serveur (un entier, augmenté à chaque lot du serveur) et l'environnement.
8. `appelerServeur` ajoute lui-même la session. La configuration du client contient l'adresse de test et celle de production ; la production n'est choisie que si la page est servie depuis l'adresse publique de production.

**Comptes et droits (spec 302)**

9. Vérification de session aux règles de Carnet Réa, sans rien y écrire ; lectures limitées à une liste fermée (jamais un mot de passe, un e-mail ni un nom).
10. Une session vérifiée est gardée 5 minutes (confirme la proposition de l'architecture § 3). Les droits sont relus à chaque action.
11. Le routeur vérifie la session avant toute action non publique. Fichier de comptes illisible → `comptes_indisponibles`, pour ne pas déconnecter les téléphones.
12. `Droit contenu` et `Droit résultats` valent `oui` ou `non` ; toute autre valeur, ou l'absence de ligne `Profils`, signifie aucun droit.
13. Premier admin : une fonction lancée depuis l'éditeur Apps Script. Action `profil` pour que l'appli sache si elle propose le mode test.
14. Aucun jeton de session dans le dépôt, même fictif.

**Paquets de contenu (spec 306)**

15. La spec 306 fixe la forme du paquet ; le lot 102 s'y conforme.
16. Le filtre du serveur applique la validation, la visibilité et l'archivage. La condition 4 du schéma § 3.5 (valeur sans correspondance) reste au moteur de niveaux (lot 201).
17. Les niveaux de type « test » ne sont dans aucun paquet tant que le lot 313 ne les a pas ouverts.
18. `Mondes`, `Niveaux` et `Composition` sont filtrés sur la visibilité et l'archivage seulement.
19. Formats : `Champs validés` séparé par des points-virgules ; `Champ` contient un nom, ou autant de noms que de faits.
20. Dans le doute, exclu : ce que le filtre ne sait pas lire n'est pas servi aux internes.
21. Le paquet « internes » ne contient ni statut, ni nom de validateur, ni commentaire. Le paquet « admin » dit pour chaque question si elle est servie aux internes, et pourquoi.
22. Un admin en jeu normal reçoit le paquet « internes » ; le paquet « admin » n'est servi que sur demande explicite, après contrôle du droit « contenu ».
23. Reconstruction des paquets à la première demande qui suit un changement de `contenu.version` ; un paquet d'une autre version n'est jamais servi. Toute écriture de contenu augmente donc `contenu.version` sous le même verrou.
24. Second contrôle indépendant du paquet « internes » avant de l'enregistrer.
25. Recette sur un fichier Contenu fictif.

### Lot 4b, conversation 3 (15 novembre)

Décisions prises en écrivant les specs 201, 208 et 213. Sept ont fait l'objet d'une question ; les autres ont été proposées en liste et acceptées.

**Tranchées par une question**

1. **Niveau partiellement validé** : un niveau se joue avec les questions servies ; il n'est fermé que s'il n'en reste aucune. Raison : une correction en mode test ou l'ajout d'une question non validée ne ferme pas le niveau à tous les internes. (Le schéma § 6 proposait d'attendre que tout soit validé.)
2. **Réserve du boss insuffisante** : le boss est fermé si sa réserve servie compte moins de questions que `Questions du boss`. Le monde suivant ne s'ouvre alors pas.
3. **Seuils d'étoiles dans `Reglages`** (clés `etoiles.seuil_1`, `etoiles.seuil_2`, `etoiles.seuil_3`) ; les deux paquets de contenu portent une section `reglages`, tout l'onglet. (La spec 306 a été amendée à la conversation 4.)
4. **Format de `Réglages` d'un niveau** : texte JSON, avec une table de correspondance par couple `Onglet:Champ`. Le moteur ignore les clés qu'il ne connaît pas.
5. **Ouverture du boss** : tous les niveaux jouables du monde réussis **et** étoiles du monde au moins égales à `Étoiles pour le boss`.
6. **Pas d'étoiles au boss** : il est réussi ou non, au seuil de `Mondes` ; on garde son meilleur score.
7. **Mode test en phase 2** : le droit « contenu » et le paquet « admin » arrivent par deux fournisseurs remplaçables. En phase 2, droit accordé seulement hors de l'adresse publique, et paquet « admin » fictif ; les lots 303 et 307 les remplacent.

**Moteur de niveaux (spec 201)**

8. Deux formes de réponse : « unique » (0 ou 1) et « multiple » (bien placés / total). Une table donne la forme de chaque mécanique : `swipe`, `qcm`, `tri`.
9. Réponse attendue : la réponse propre, sinon la valeur du fait passée par la table du niveau. **Jamais de repli sur la valeur brute** : la question est écartée, avec un motif.
10. Ordre des questions : colonne `Ordre` de Composition. Le tirage n'existe que comme option, utilisée pour le boss.
11. Score = somme des résultats / nombre de questions, hors re-test. Seuils illisibles : aucune partie n'est créée, aucune valeur de secours.
12. Événement de réponse : les 11 champs de la spec 309 ; `certitude` toujours vide (P3 n'a pas de lot). `reponseDonnee` d'une réponse multiple : un tableau JSON, coupé à 2 000 caractères. (12 champs depuis la conversation A : `reponsesProposees` s'ajoute.)
13. Fin de partie émise à la dernière réponse comptée, avant les re-tests. Les abonnés ne sont jamais attendus.
14. L'état d'une partie est un objet JSON simple, pour la reprise exacte.
15. Un niveau est annoncé « Version simplifiée » si `Simplifié` vaut `oui` **ou** si une de ses questions est simplifiée. Le moteur ne dit jamais lesquelles.
16. Le moteur joue les types `normal` et `boss` ; `révélation` relève du lot 211. `Leurres` est une liste séparée par des points-virgules.

**Progression locale (spec 208)**

17. Un magasin IndexedDB `progression`, une ligne par compte et par niveau, aux champs de l'onglet Progression. **Rien d'autre n'est stocké** : niveaux ouverts, boss, monde suivant et total d'étoiles sont recalculés. Le lot 310 remplacera les lignes par celles du serveur, sans toucher aux règles.
18. Niveau réussi = une partie terminée avec 1 étoile. Un niveau déjà réussi ne se referme jamais, même si un niveau est inséré avant lui.
19. Chemin : mondes par `Ordre`, niveaux par `Ordre`, boss en dernier. Un monde invisible, absent du paquet « internes », est sauté sans code particulier ; ses lignes restent en base et reviennent avec lui.
20. Un niveau sans aucune question servie est sauté par le chemin.
21. Colonne du boss vide ou illisible : boss fermé. Monde sans boss : le monde suivant reste fermé.
22. Rejouer : étoiles et meilleur score au maximum ; `Tentatives` compte les parties terminées.
23. Boss : tirage sans remise à chaque tentative, sans re-test.
24. Avant le lot 303, le compte des lignes de progression vaut `local`.

**Mode test, navigation libre (spec 213)**

25. Entrée « Admin » dans la navigation, visible avec le droit « contenu » ; elle ne contient que l'entrée dans le mode test.
26. Le mode test n'existe qu'en mémoire : recharger la page en fait sortir.
27. Bannière « Mode test » sur tous les écrans, avec « Quitter ».
28. Carte du mode test construite sur le paquet « admin », tout ouvert, sans étoiles ni progression ; le boss s'y joue même avec une réserve trop courte.
29. Les parties gardent `mode: "campagne"` et portent `modeTest: true`.
30. **Règle pour tous les lots du client** : un abonné des événements du jeu qui enregistre quoi que ce soit sur l'interne ignore un événement dont `modeTest` est vrai (index des lots, règle 9).
31. Affichage réservé à l'admin : pendant une question, son identifiant et si elle est servie aux internes, avec les motifs ; sur la fiche de niveau, les questions écartées par le moteur. Jamais un énoncé, une réponse ni une valeur.

Écrits dans les specs sans avoir été demandés un par un, **à confirmer** : ~~les textes de l'écran Admin et des deux messages d'échec du mode test (`lot-213.md`, § 6.4)~~ (**confirmés le 16 novembre**, conversation C) ; les noms des motifs d'écart et des raisons de verrouillage du boss (les **textes affichés** pour ces raisons sont fixés à la conversation C, design system § 11).

### Lot 4b, conversation 4 (15 et 16 novembre)

Décisions prises en amendant la spec 306 et en écrivant les specs 305, 505 et 506. Dix ont fait l'objet d'une question ; les autres ont été proposées en liste et acceptées.

**Tranchées par une question**

1. **Seuils d'étoiles absents ou illisibles** : le serveur refuse de construire les paquets (`reglage_invalide`) ; les téléphones gardent le contenu qu'ils ont déjà. Raison : une erreur de saisie dans `Reglages` reste sur le serveur au lieu de fermer tous les niveaux chez tous les internes.
2. **`ID espèce`** : la conversion ne la remplit que par libellé exact avec l'onglet Especes ; l'auteur complète le reste dans le tableur. Le code ne déduit aucun lien entre un groupe et ses espèces.
3. **Version du référentiel** : la conversion n'écrit aucune source. Une ligne qui ne cite aucun identifiant de l'onglet Sources est convertie et signalée ; l'auteur ajoute une colonne `Source` à Phenotypes et Regles.
4. **Vocabulaire** reçoit une colonne `ID` (`VOC-01`…), pour que tous les onglets se rapprochent de la même façon à l'import.
5. **Aucune question créée à la conversion** : l'onglet Questions est créé vide. Le pré-remplissage des swipes (briefing § 10 bis) n'a pas de lot.
6. **Seuils d'étoiles à la conversion** : les trois clés sont créées vides ; l'auteur les saisit dans le fichier Contenu de test. Aucune valeur de réglage n'est écrite dans le code.
7. **Import à trois états** : « Préparer » crée une copie de travail et une copie de référence. Une ligne changée seulement en production garde sa version de production sans rien demander ; seule une ligne changée des deux côtés, différemment, est un conflit.
8. **Périmètre de l'import** : les douze onglets de faits, Notions et Questions. Mondes, Niveaux et Composition ne se modifient que dans l'espace Admin.
9. **Identifiants à l'import** : l'auteur laisse `ID` vide sur une ligne nouvelle, le serveur attribue le numéro suivant ; un identifiant inconnu dans la copie bloque l'application. Une espèce nouvelle reçoit le préfixe neutre `ESP-`.
10. **Question à réponse propre** : elle repasse à « À valider » quand la colonne qu'elle teste change, sauf si l'auteur a modifié sa propre ligne dans la copie. (Deux règles de l'architecture § 5.5 se contredisaient sur ce cas.)

**Paquets de contenu (amendement de la spec 306)**

11. La section `reglages` est tout l'onglet, clé → valeur, identique dans les deux paquets. **Tout ce qui est rangé dans `Reglages` part sur le téléphone de chaque interne** : une valeur qui doit rester sur le serveur va dans les propriétés du script (index des lots, règle 10).
12. Clé de `Reglages` en double : aucun paquet n'est construit. Le second contrôle vérifie aussi la section `reglages`.

**Conversion du tableur (spec 305)**

13. L'auteur importe le tableur dans Google Sheets, sur le Drive du compte dédié ; la conversion est une fonction du serveur de test. Aucune dépendance nouvelle.
14. Deux fonctions : l'analyse, qui n'écrit que le rapport et se relance à volonté, et la conversion, qui écrit une seule fois. Tout ou rien sur la structure ; reprise après interruption ; relecture de chaque onglet écrit.
15. Douze onglets repris, cinq écartés. Un onglet ou une colonne inconnus sont ignorés et cités, sans erreur. Aucune colonne calculée n'est reprise, dont `Écart CASFM / EUCAST (formule)`, que le schéma ne citait pas.
16. Tout devient du texte, sans arrondi ; un nombre s'écrit avec un point décimal. Les quatre colonnes de validation sont recopiées telles quelles.
17. Identifiants du tableur gardés ; `ABL-001` à `ABL-252` et `VOC-01` à `VOC-15` attribués dans l'ordre de la feuille. Ligne S7 de Sources écartée.
18. `Mondes`, `Niveaux`, `Composition`, `Questions` et `Notions` créés vides ; `Notions` reçoit `Champs validés`. Sources et Vocabulaire n'ont ni colonnes de validation ni `Champs validés`.
19. Rapport dans un classeur à part ; le journal d'exécution ne contient que des nombres. Développement sur un tableur fictif ; **la conversion réelle est lancée par l'auteur**, après le lot 303 et avant le lot 306.

**Import annuel (specs 505 et 506)**

20. L'état de l'import est dans les propriétés du script ; le lot 505 n'écrit rien dans le fichier Contenu. La clé `copie.creee_le` du schéma § 3.13 n'est pas écrite.
21. Une ligne supprimée de la copie mais modifiée en production est un conflit. Une question dont l'`Origine` n'est ni `tableur` ni `import …` n'est jamais retirée par l'import.
22. `ID`, `Archivé le`, `Modifié le`, `Modifié par` et, pour Questions, `Origine` ne viennent jamais de la copie. Le statut de validation, lui, en vient.
23. Une colonne absente de la copie (supprimée ou renommée) n'est pas comparée : la production garde ses valeurs.
24. Les questions dont un fait est retiré ne sont pas modifiées : elles cessent d'être servies, et l'admin décide de leur sort.
25. Choix d'un conflit pour la ligne entière. L'application refait la comparaison sous verrou et refuse si elle a changé depuis le récapitulatif.
26. Une sauvegarde du fichier Contenu avant la première écriture. Une ligne retirée est archivée ; **aucune fonction de l'import ne supprime quoi que ce soit**.
27. Le plan d'application est enregistré avant la première écriture ; la reprise le poursuit. Pendant une application interrompue, toute autre écriture de contenu est refusée et `contenu.version` ne bouge pas : les internes gardent l'ancien contenu.
28. Historique : une ligne par cellule modifiée, une par ligne ajoutée, une par ligne archivée ; canal `import`, auteur = l'`ID compte`.
29. Fin de l'import : `contenu.version` + 1, puis reconstruction immédiate des paquets. Si elle est refusée, l'import reste appliqué et les internes gardent l'ancien contenu.
30. L'import n'a aucun accès au fichier Joueurs ni au Journal et ne change aucun identifiant : l'ELO des questions est conservé par construction.
31. **Contrat pour le lot 315** : l'onglet Historique, une fonction qui construit une ligne d'historique, et un contrôle commun appelé par toute écriture de contenu (index des lots, règle 11).
32. Écran « Import annuel » dans l'espace Admin, en ligne seulement, rien de stocké sur le téléphone. Les lots 505 et 506 dépendent donc du lot 501.

Écrits dans les specs sans avoir été demandés un par un, **à confirmer** : les textes de l'écran « Import annuel » (`lot-505.md`, § 6.10 ; `lot-506.md`, § 6.9) ; les noms des types de signalement de la conversion, des catégories de ligne et des blocages de l'import.

### Lot 4b, conversation 5 (16 novembre)

Décisions prises en écrivant les specs 401, 402 et 403. Douze ont fait l'objet d'une question ; les autres ont été proposées en liste et acceptées.

**Tranchées par une question**

1. **Un seul ELO par interne.** La campagne ne le fait jamais bouger : elle sert seulement à étalonner les questions. Côté interne, seuls le classé et le pré-test comptent.
2. **Pré-test** : ses réponses passent par le même calcul que celles du classé, à partir d'une valeur de départ unique (`elo.interne.depart`). Elles comptent dans la période provisoire et n'étalonnent pas les questions. Sans pré-test, l'interne reste à la valeur de départ, en provisoire. (Remplace l'« ELO de départ bas » et l'« ELO repris de la campagne » du briefing § 4.)
3. **Seul un interne sorti de sa période provisoire étalonne les questions**, en campagne, en classé et en entraînement.
4. **« Déjà vue »** : une question est vue dès la première réponse de l'interne, quel que soit le mode, sauf en pré-test et en post-test, même si cette réponse n'a pas étalonné. Elle n'étalonnera plus jamais pour cet interne.
5. **En classé, toutes les réponses font bouger l'interne**, question déjà vue ou non.
6. **c = 1 / nombre de réponses proposées**, envoyé par le téléphone avec chaque réponse et gardé dans le journal (colonne `Réponses proposées`, seizième). Les specs 201, 308 et 309 sont à amender. (Fait à la conversation A.)
7. **Colonne `Plancher`** d'une question : un nom, dont la valeur est dans `elo.planchers` ; plus aucun nombre saisi question par question.
8. **K par tranches**, dans une seule clé (`0:K;N:K`), pour l'interne et pour les questions. La période provisoire est une clé à part.
9. **Réglage ELO absent ou illisible** : aucun ELO n'est calculé, aucune valeur de secours ; la synchronisation continue et le serveur note « ELO à recalculer ».
10. **Affichage** : une ligne dans Profil, `ELO 1012 · provisoire` puis `ELO 1012`, rien tant qu'aucune réponse n'a compté.
11. **Le recalcul complet (lot 403) ne recalcule que l'ELO**, et se lance par un bouton de l'espace Admin (entrée « Recalcul de l'ELO » de l'écran Admin), avec secours depuis l'éditeur Apps Script.
12. **Droit « contenu »** pour lancer le recalcul.

**Moteur (spec 401)**

13. Sept clés dans `Reglages`, sans aucune valeur dans le code : `elo.interne.depart`, `elo.interne.k`, `elo.interne.provisoire`, `elo.question.k`, `elo.question.poids_entrainement`, `elo.paliers`, `elo.planchers`. La simulation (lot 5) les chiffrera.
14. Tableau des effets par mode (fait bouger l'interne, étalonne la question, marque « déjà vue »), dont sprint, survie, jour et duel sans effet, et post-test sans aucun effet.
15. Re-test sans effet ; question simplifiée jamais étalonnée ; interne sans plancher ; ELO arrondi au centième et résultat à six décimales, pour un recalcul identique au chiffre près.
16. Réponse inexploitable (palier illisible, nombre de réponses proposées absent…) : sans effet, comptée par motif ; aucune valeur de secours.
17. Un seul fichier de fonctions pures, qui se suffit à lui-même : la simulation le chargera seul dans Node, et le téléphone en a une copie identique, comparée par un test.

**ELO officiel (spec 402)**

18. Traitement dérivé `elo` branché sur la synchronisation ; il écrit les quatre colonnes ELO de `Scores`, `Etalonnage` et la clé `vues` de `Suivi`, jamais `Étoiles` ni `Records`.
19. Empreinte des réglages et note « ELO à recalculer » dans les propriétés du script, pas dans `Reglages`.
20. Limite connue : une exécution tuée entre deux écritures peut compter un paquet deux fois ; seul le recalcul la répare.
21. Les sept clés sont créées vides, en test, par une fonction lancée depuis l'éditeur.
22. Estimation du téléphone : il rejoue les réponses de classé de sa file, en prenant l'ELO de départ du palier pour chaque question.

**Recalcul (spec 403)**

23. Tranches d'environ 2 minutes, état gardé dans un fichier privé, reprise après interruption ; un seul recalcul à la fois.
24. Réglages ou palier d'une question déjà lue modifiés pendant le recalcul : redémarrage automatique.
25. Bascule d'un seul coup sous le verrou ; les lignes plus étalonnées sont vidées, jamais supprimées.
26. Textes de l'écran « Recalcul de l'ELO » confirmés ; ceux de ses messages d'erreur restent à confirmer (`lot-403.md`, § 6.9).

Écrits dans les specs sans avoir été demandés un par un, **à confirmer** : les noms des sept clés et de leurs descriptions, les motifs de réponse sans effet, les raisons de la note « ELO à recalculer », les messages d'erreur de l'écran de recalcul.

### Après Fable (16 novembre)

1. **Specs juste avant leur lot**, écrites par Opus 5.5 ; code par Sonnet 5.5 ; relecture par Opus 5.5 des moteurs critiques (§ 3, § 6).
2. **Lot 5 après le lot 401** : le script de simulation charge `serveur/logique/elo.js`.
3. **Remise à jour du briefing, de l'architecture et du schéma au moment du lot 101**, en même temps que leur copie dans `docs/` sans contenu médical.

### Conversation A (16 novembre)

Décisions prises en amendant les specs 201, 308 et 309 (point signalé 42). Aucune n'a fait l'objet d'une question : elles découlent de la décision 6 de la conversation 5, et les choix nouveaux sont marqués **à confirmer**.

1. **La mécanique donne le nombre**, le moteur de niveaux le contrôle : `reponsesProposees` est passé par l'écran, dans la saisie, à `appliquerReponse` et `appliquerReTest` ; le moteur ne le calcule pas, ne le compare ni aux leurres ni aux directions, et ne le garde pas dans l'état de la partie. Seul l'événement de réponse le porte (12 champs au lieu de 11).
2. **Aucune valeur par défaut, nulle part.** Nombre absent ou hors bornes : le moteur lève `reponses_proposees_invalides` avant toute modification et n'émet rien ; le serveur refuse l'élément (`champ_invalide`, champ `reponsesProposees`) ; le téléphone le recopie dans la file sans contrôle ni conversion.
3. **Obligatoire dans tous les modes**, re-test compris, même quand le mode n'a aucun effet sur l'ELO : le journal n'a qu'une forme de ligne. Un re-test porte le nombre du re-test.
4. **Colonne `Réponses proposées`** en seizième position du journal, après `Version du contenu`, écrite comme un nombre (pas au format texte). Un fichier `Journal AAAA` qui aurait 15 colonnes n'est pas modifié : Claude s'arrête et demande.
5. **Noms des bornes côté serveur** : `MIN_REPONSES_PROPOSEES` et `MAX_REPONSES_PROPOSEES`, différents de `REPONSES_PROPOSEES_MIN` du moteur ELO, à cause de l'unicité des noms dans le serveur (règle 11 de l'index). Les bornes sont écrites trois fois (téléphone, serveur, moteur ELO) : si l'une change, les autres suivent.
6. **Tests ajoutés sans renuméroter** : spec 201, tests 45 et 46 ; spec 308, test 25 ; spec 309, test 32.

**Tranché par l'auteur le même jour** (index des lots, points signalés 55 à 57) :

7. **Bornes : entier de 2 à 100.** Confirmé.
8. **Objet de saisie.** La mécanique passe `{ reponse, temps, reponsesProposees }` : `repondre(etat, saisie)`, `repondreReTest(etat, idQuestion, saisie)`, `appliquerReponse(etat, saisie, emetteur)`, `appliquerReTest(etat, idQuestion, saisie, emetteur)`. Une saisie qui n'est pas un objet lève `saisie_mal_formee` ; un champ en trop est ignoré ; l'événement de réponse garde ses 12 champs. Un champ ajouté plus tard s'ajoute à la saisie sans changer la signature. Spec 201 mise à jour (décision 8, § 6.6, § 6.8, tests 45 et 46).
9. **Aucun recoupement du nombre par le moteur.** Accepté : chaque lot de mécanique teste que le nombre passé est celui affiché. Reste à trancher dans la spec 204 : quel nombre passer pour un swipe dont seules certaines directions affichées sont des réponses possibles.

### Conversation B, suite (16 novembre) — specs 103 et 108

Toutes tranchées par une question à l'auteur.

1. **Nom affiché : MicroSwipe**, partout où l'interne le voit ; nom complet « MicroSwipe – Réanimation Guadeloupe ». **Adresse `chugicu.github.io/microswipe/`**, dépôt `chugicu/microswipe`. Les noms internes ne changent pas (base `microbio`, préfixe `microbio-`, « Application Microbio »).
2. **Logo en grand à chaque ouverture, environ 1 seconde**, plus longtemps seulement si le démarrage l'est ; un toucher le fait passer. **Désactivable par les admins pour tous** : clé `accueil.logo` de `Reglages`, allumée par défaut (écran au lot 504).
3. **Mise à jour silencieuse**, appliquée à l'ouverture suivante, jamais pendant une partie.
4. **Invitation à installer** après la 1re et après la 10e partie terminée de la campagne (niveaux rejoués compris), si l'appli n'est pas installée ; ligne permanente dans Profil. Textes validés (« Installe MicroSwipe »…).
5. **Icône** : le logo tel quel, à revoir à la conversation C. (Non revue : logo pas encore fourni, design system § 9.14.)
6. **Portrait seul** ; en paysage, colonne centrée sans message.
7. **GitHub Pages activé au lot 103**, sur `main`, avec l'accord de l'auteur à chaque publication, données fictives seulement.
8. **Vérifications du lot 108 sur iPhone et Android.**
9. **Vibration absente sur iPhone** : le réglage G14 y sera masqué ; aucun contournement.
10. **Specs 105 et 106 après la conversation C.**

### Conversation B (16 novembre)

Choix faits en écrivant les specs 101, 102, 104 et 107. **Aucun n'a fait l'objet d'une question : tous sont à confirmer par l'auteur** (index des lots, point signalé 67). Ils sont listés en tête de chaque spec.

**Dépôt (spec 101)**

1. **Versions du dépôt préparées à l'avance** dans `depot/` du projet claude.ai par la conversation Opus de remise à jour ; le lot 101 les copie octet pour octet et ne juge jamais lui-même ce qui est du contenu médical. Un test signale (sans les recopier) les identifiants au format du tableur trouvés dans `docs/`, pour que l'auteur juge.
2. Dépôt `chugicu/microbio`, public ; `main` ne reçoit que le premier commit ; GitHub Pages non activé.
3. Racine en modules ES ; fichiers du serveur chargés en CommonJS par `createRequire` ; pages de vérification dans `tests/navigateur/`, jamais lancées par `node --test`.
4. **Trois garde-fous** : `.gitignore` (contenu local, tableurs, code de Carnet Réa, secrets) ; crochet `pre-commit` versionné dans `.githooks/` (refuse un commit sur `main` et tout fichier interdit) ; règles de permission de Claude Code (pas de contournement du crochet, pas d'historique réécrit, confirmation pour tout ce qui touche `main`, aucune écriture dans les copies locales de Carnet Réa et d'EchoLearn, dont les chemins restent dans un fichier non versionné).
5. Dossier du contenu réel de travail : `contenu-local/`. Node 22 ou plus récent, aucune dépendance. Logo dans `client/images/`.
6. Les specs écrites après le lot 101 sont copiées dans `docs/specs/` par le premier commit du lot qui les utilise.

**Jeu de données fictif (spec 102)**

7. Forme du paquet inchangée (spec 306) ; un contrôle de forme côté téléphone, `controlerFormeDuPaquet`, qui ne filtre rien. `COLONNES_RESERVEES` est donc écrite deux fois (contrat de l'index).
8. Paquets fictifs en modules ES (le seul `fetch(` du client reste celui du module d'appel). Lignes écrites une fois ; paquet « internes » tiré par des listes explicites, sans relire `Statut` : aucun second filtre côté client.
9. Quatre mondes (le troisième invisible), onze niveaux dont quatre boss, dix-neuf questions, deux onglets de faits fictifs ; seuils 60 / 80 / 100 et sept clés ELO aux valeurs fictives de la spec 401 ; un palier par question, trois planchers nommés.
10. Le paquet « internes » ne donne aucune question écartée au moteur ; le paquet « admin » en donne une, voulue.
11. Toute modification du jeu ajoute des lignes et augmente la version ; les clés de `Réglages` des mécaniques arrivent avec les lots 204 à 206.

**Stockage local (spec 104)**

12. Une seule base `microbio` ; migrations déclaratives (données, pas fonctions), jamais modifiées une fois enregistrées ; clés en ligne seulement ; aucune suppression de magasin ni de données.
13. Requêtes par clé, bornes ou préfixe de clé composée, avec limite ; transactions sur plusieurs magasins, tout ou rien ; « dans une transaction, n'attends que ses opérations » (index des lots, règle 14).
14. Base en mémoire de même interface dans `tests/`, pour les tests Node des lots suivants ; mêmes scénarios sur la vraie base dans une page de vérification.

**Chargement du contenu (spec 107)**

15. Une source remplaçable qui répond comme l'action `contenu` du serveur ; source fictive en phases 1 et 2, remplacée au lot 307.
16. Seul le paquet « internes » est rangé dans IndexedDB ; le paquet « admin » reste en mémoire jusqu'au lot 307.
17. Le téléphone garde le dernier paquet bien formé ; une version plus petite reçue remplace quand même (le serveur est la référence) ; un paquet reçu remplace l'ancien en mémoire même si son écriture échoue.
18. Le paquet rendu aux autres modules est gelé ; l'index (`indexerPaquet`) est construit par les lots 201 et 202.

### Conversation C (16 novembre) — phase 0, lot 3

Audit de la maquette (toile « Carte Boîte de Pétri », planche « B + D », lue par son lien), design system et système de mouvement : `docs/design-system.md`. Les seize questions ont été posées à l'auteur avec une recommandation ; il a accepté toutes les recommandations, sauf quatre réponses propres (2, 6, 8, 11).

**Tranchées par une question**

1. **Fond clair**, celui de la maquette ; pas de mode sombre au lancement ; logo sur sa pastille noire. (Remplace le « fond sombre » proposé au § 8 avant le lot 3.)
2. **Logo pas encore fourni** : emplacements réservés ; écran d'ouverture et icône à vérifier quand il arrive, au plus tard au lot 101.
3. **Monde fermé** : « Réussis le boss du monde précédent pour l'ouvrir. » sur le couvercle, sans jauge d'étoiles.
4. **Boss verrouillé** : un toucher ouvre sa fiche, avec la liste de ce qui manque (« Réussis tous les niveaux du monde (4 / 5) », « Étoiles : 9 / 12 », « Ouvre d'abord ce monde ») ; raison de données : « Ce boss n'est pas encore prêt. », le code seulement en mode test.
5. **Niveau verrouillé touché** : bulle « Réussis le niveau précédent ».
6. **Monde maîtrisé** (colonies dorées) = **boss réussi et 3 étoiles à tous les niveaux du monde**.
7. **Boss réussi** : bouclier doré et meilleur score en %, sans étoiles ; annonce « Boss réussi · le monde N s'ouvre ».
8. **Mécanique visible seulement sur la fiche** (puce), jamais dans la boîte de Pétri : l'aspect des colonies ne dépend plus de la mécanique. Libellés Swipe, QCM, Intrus, Tri, Révélation, Boss, sans violet ; **liste ouverte** aux mécaniques futures, avec une puce générique « Jeu » pour une mécanique inconnue. (Change le briefing § 6, « colonies d'aspect différent selon la mécanique ».)
9. **« N questions »** sur la fiche, sans durée.
10. **« Revoir les fiches espèces »** gardé, masqué sans fiche débloquée.
11. **Vert et rouge permis pour le retour juste / faux**, toujours avec icône, forme et mouvement ; l'interdit ne vise que les dessins de bactéries, qui ne sont jamais teintés par le retour.
12. **Fond neutre** pour les écrans de jeu, jamais la gélose du monde.
13. **Milieux des mondes 4 à 12 fournis par l'auteur** ; clés des mondes 1 à 3 : `sang`, `bcp`, `chocolat` ; clé vide ou inconnue → `neutre`.
14. **Textes du mode test de la spec 213 confirmés** ; bannière orange foncé, en haut.
15. **Outils de correction** derrière un bouton « Outils » de la bannière ; textes confirmés : « Cette correction touche N questions. Elles sortent du jeu des internes jusqu'à validation. » et « Valider · <source>, p. <page> ».
16. **Import annuel et recalcul de l'ELO** pensés pour l'ordinateur, encore utilisables sur téléphone.

**Choix de conception faits par Claude** (annoncés à l'auteur)

17. Durées 80, 120, 240 et 400 ms ; quatre courbes ; deux ressorts ; séquences de célébration de 1,5 s au plus, passables d'un toucher.
18. Seules la position, l'échelle, la rotation et l'opacité s'animent (exception : le tracé de la strie) ; une seule boucle, les ondes du niveau en cours.
19. Polices Bricolage Grotesque, Inter et Caveat **hébergées dans le dépôt**, sans appel à Google Fonts.
20. Contrastes AA vérifiés par calcul ; étoiles sur fond clair en `#B97A0E` (la valeur de la maquette n'atteignait pas 3:1).
21. Palette des dessins de bactéries : six couleurs et trois bandes de teinte interdites, à vérifier par un test du lot qui dessine.
22. Seuils du swipe : 30 % de la largeur, 25 % de la hauteur, ou 0,6 px/ms ; rotation au plus 12°.
23. Bannière du mode test de hauteur fixe ; les écrans se décalent dessous.
24. Comparaison de l'Admin : libellés « Référence », « Contenu actuel », « Copie » toujours écrits ; « Contenu actuel » est la production des specs 505 et 506.

**Précisé par l'auteur le 17 novembre**

25. **Résistance naturelle et catégorie clinique** : les premiers niveaux posent la résistance naturelle en **oui / non** (inchangé). Des **niveaux avancés** demanderont **ce qu'annonce l'antibiogramme d'une souche sauvage**, avec trois réponses : **S, R, SFP**. **À préciser avant la spec de cette mécanique** : de quel fait vient la réponse. Elle ne peut pas se lire dans la valeur « – » des résistances naturelles, qui veut dire « aucune résistance naturelle décrite », pas « S » (décision du 14 novembre) ; il faut un fait qui donne la catégorie explicitement. À reporter au briefing § 7 (J2) dans la conversation de remise à jour.
26. **Fiche de niveau jugée trop « document »** (rendu générique, peu intégré au jeu) : le § 10.6 du design system est à refaire, comme les autres écrans de jeu (fiche du boss, fin de niveau). Direction proposée à l'auteur le 17 novembre, en attente de sa réponse.

### Conversation C, suite (17 novembre) — maquette retravaillée

Décisions de l'auteur en revoyant la maquette, reportées dans `docs/design-system.md` (§ 0 bis, décisions 17 à 35) :

27. **Fiche de paillasse** à la place de la fiche « document » ; écran de fin de niveau dessiné.
28. **Surfaces claires à matière**, jamais blanches unies ; fiche du boss sombre.
29. **Bouton principal bleu nuit en relief, texte crème** ; bouton du boss orange en relief ; « Tous les mondes » en relief.
30. **Étoiles** : gauche (60 %), droite (80 %), puis la grande du haut (100 %) ; animations ralenties (2,5 s au plus, passables d'un toucher).
31. **Règle du jeu** sur la fiche : nom de la mécanique, geste mimé, consigne centrée ; tampon « Version simplifiée » fixe.
32. **Un objet de paillasse par monde**, toujours le même, liste extensible ; sur la carte, la fiche et l'écran de fin.
33. **Monde fermé** scellé par du scotch, avec « Réussis le boss du monde N pour l'ouvrir. »
34. **Étiquette de la mécanique sur la carte**, vue zoomée, après la 1re partie (remplace la décision 8 de la conversation C) ; « à réviser » en scotch gris-bleu, à sa place.
35. **Grain des géloses irrégulier**, jamais une grille de points.
36. **Carte à deux niveaux** : pile et vue zoomée, zoom et dézoom animés, défilement vertical dans les deux, changement de monde sans dézoomer.
37. **Bandeaux masqués**, rappelés au toucher de la paillasse ; bleu nuit uni ; icônes de labo.
38. **Résumés de la pile** encadrés, texte centré ; objets dans la colonne des résumés.
39. **Monde maîtrisé rejouable**.
40. **Bandeau de la fiche** à la couleur de la gélose du monde.
41. **Méthode** : la maquette n'est plus retouchée pour des détails ; elle sert de référence visuelle, le design system de règle ; les finitions se font sur l'appli réelle ; restent à maquetter, au niveau de la direction, les écrans de jeu (Swipe, QCM, Tri…), avant la spec 204.

Textes nouveaux **confirmés le 17 novembre** : « Gagne encore N étoiles en rejouant des niveaux. », « Monde suivant débloqué », « N bonnes réponses sur M », « N questions » (sans « tirées au hasard », retiré par l'auteur).

Laissés ouverts (design system § 15) : enchaînement après une réponse (spec 204) ; texte de la fiche du boss « N questions · X % pour ouvrir le monde suivant », à confirmer ; autres textes des outils du mode test (spec 315) ; texte hors ligne de l'espace Admin (spec 501) ; textes des encadrés « À réviser » et « Révélation » ; calcul du monde maîtrisé, sans spec.

### Conversation de remise à jour (17 novembre)

Mise à jour du briefing, de l'architecture, du schéma et du `CLAUDE.md`, amendement des specs 102, 103, 208, 213 et 301, lot 611 dans l'index, versions du dépôt. Questions posées à l'auteur avec une recommandation ; il les a toutes acceptées.

**Tranchées par une question**

1. **Choix de la conversation B** : déjà confirmés le 17 novembre (27 choix, index, point 67) ; non repassés. Le plan est corrigé.
2. **Spec 103 amendée aussi** (logo, point 73 de l'index), en plus des specs 102, 208, 213 et 301.
3. **Identité** : le logo MicroSwipe remplace le logo Réanimation Guadeloupe ; le nom complet « MicroSwipe – Réanimation Guadeloupe » garde le lien avec le service (briefing § 1, § 12).
4. **Question « S, R ou SFP » sur une souche sauvage** (conversation C, décision 25) : fermée par le lot 611 ; la catégorie vient d'une ligne d'`Antibiogrammes_types` d'un profil sauvage. Une question à une seule case reste possible plus tard (briefing § 7, J2 et J17).
5. **Briefing du dépôt** : retire le § 11 et tout fait qui associe un germe à une valeur (exemples de J2, liste de J1 bis, paires de J5, badges de G2, constats du § 12, statut d'un germe au § 13) ; garde les thèmes des mondes (§ 5 bis) et les noms de phénotypes.
6. **Briefing § 6** réduit à un résumé des décisions, sans aucune valeur visuelle, avec un renvoi au design system.
7. **Colonne `Lignes posées`** de `Questions` pour le lot 611 (nom confirmé ; schéma § 3.4).
8. **Formats confirmés** (proposés à la conversation 1) : dates du journal en texte ISO 8601 UTC ; cellules `État 1`, `État 2`… de Suivi, qui forment un texte JSON (schéma § 4.5, § 5).
9. **Monde maîtrisé calculé par la spec 208** (champ `maitrise` de l'état de la carte) : boss réussi et 3 étoiles à chaque niveau **jouable** du monde ; un niveau sans question servie ne compte pas.
10. **Barre du haut** : le logo crème est posé tel quel sur le bandeau bleu nuit, sans pastille noire (design system § 9.14).
11. **`CLAUDE.md`** : dix règles relues et acceptées une par une : mode test, rien ne s'enregistre (règle 7) ; exception de l'ELO du lot 611 (règle 10) ; contrôle commun des écritures de contenu (règle 11) ; une seule base locale (règle 13) ; quatre services du module de stockage (règle 14) ; rien de confidentiel dans `Reglages` (règle 15) ; une formule d'ELO et un tableau des modes (règle 16) ; valeur visuelle absente : demander ; refus « S ou R » limité à la question oui / non ; nom MicroSwipe. 116 lignes.

**Choix faits par Claude** (annoncés à l'auteur)

12. Jeu fictif (spec 102) : `MON-01` `sang`, `MON-02` `bcp`, `MON-03` `chocolat`, `MON-04` `neutre`.
13. Icônes Android en `purpose` = `any maskable` (spec 103), raison d'être de la marge de `logo-android.png` ; à vérifier sur un téléphone au lot 103 (index, point 75). `background_color` du manifeste en `#FFE9B0`.
14. Spec 208 : dépend aussi du lot 103 ; l'invitation est demandée par `demanderInvitation()`, une fonction que le lot 207 doit fournir (contrat ajouté à l'index) ; tests 35 à 39 ajoutés sans renuméroter ; critère 5.7 reformulé (point 62).
15. Spec 213 : les textes du § 6.4, confirmés le 16 novembre, ne sont plus « à faire confirmer ».
16. **Versions du dépôt tirées par des marqueurs** : dans les documents complets, `<!-- depot:retirer -->` … `<!-- /depot:retirer -->` entoure ce qui ne va pas dans le dépôt, et `<!-- depot:ajouter … -->` porte le texte propre au dépôt. Le script `claude/outils/depot.py` retire ces blocs, écrit les renvois en `docs/…` et refuse un renvoi restant vers le projet ; `lot-101.md` est copiée telle quelle (elle cite à dessein les chemins du projet). Le cadrage du lot 611 va aussi dans `depot/specs/` du projet claude.ai.
17. Architecture : un § 10 résume les décisions reportées le 17 novembre ; elle va en entier dans le dépôt.

## 10. Prochaine étape

1. ~~**Confirmer les choix de la conversation B**~~ : confirmés le 17 novembre (index, point 67).
2. ~~**Conversation de remise à jour**~~ : **faite le 17 novembre** (§ 9). Briefing, architecture, schéma, `CLAUDE.md` et design system à jour ; specs 102, 103, 208, 213 et 301 amendées ; lot 611 dans l'index ; versions du dépôt dans `depot/` du projet claude.ai.
3. **Relire et accepter `depot/` du projet claude.ai** (auteur) : `CLAUDE.md`, `briefing.md`, `architecture.md`, `schema-de-donnees.md`, `plan-de-developpement.md`, `design-system.md`, et `specs/` (index, cadrage du lot 611, chaque spec écrite). À regarder d'abord : ce que le briefing du dépôt a retiré, et les exemples fictifs du schéma. Une correction se fait dans la version complète, puis la version du dépôt se tire de nouveau par le script (index, point 74) : ne jamais corriger `depot/` du projet claude.ai à la main.
4. ~~**Fournir le logo**~~ : fourni le 17 novembre.
5. **Lot 101** avec Sonnet 5.5 (`docs/specs/lot-101.md`), puis la suite de la phase 1 dans l'ordre : 102, 103 (avec la première publication), 104, 105 et 106 (specs par Opus, à partir de `docs/design-system.md`), 107, 108.

### Fait en phase 0

- ~~Numérotation des lots de développement~~ et ~~découpage~~ : `docs/specs/index.md`.
- ~~Specs de la synchronisation et du journal~~ : `docs/specs/lot-308.md` et `lot-309.md`.
- ~~Specs du squelette du serveur, des comptes et des paquets de contenu~~ : `docs/specs/lot-301.md`, `lot-302.md` et `lot-306.md`.
- ~~Specs du moteur de niveaux, de la progression locale et du mode test~~ : `docs/specs/lot-201.md`, `lot-208.md` et `lot-213.md`.
- ~~Spec 306 amendée~~ : section `reglages` des deux paquets, refus sans seuils d'étoiles.
- ~~Specs de la conversion du tableur et de l'import annuel~~ : `docs/specs/lot-305.md`, `lot-505.md` et `lot-506.md`.
- ~~Specs du moteur ELO, de l'ELO officiel et du recalcul complet~~ : `docs/specs/lot-401.md`, `lot-402.md` et `lot-403.md`.
- ~~Specs 201, 308 et 309 amendées~~ (conversation A) : champ `reponsesProposees`, seizième colonne du journal.
- ~~Specs de la phase 1 : dépôt, jeu de données fictif, coquille PWA, stockage local, chargement du contenu, vérifications sur téléphone~~ (conversation B) : `docs/specs/lot-101.md`, `lot-102.md`, `lot-103.md`, `lot-104.md`, `lot-107.md` et `lot-108.md`.
- ~~Audit de la maquette, design system et système de mouvement~~ (conversation C, lot 3) : `docs/design-system.md`.
- ~~Architecture et schéma alignés~~ sur les décisions de la conversation 1.
- ~~Règle des deux modules uniques dans le `CLAUDE.md`~~ (règle d'architecture 14).
- ~~Niveau partiellement validé~~, ~~articulation entre le pré-test et l'ELO de départ~~, ~~un ou deux ELO~~ : tranchés (§ 9).
- ~~Nouvel ordre après Fable~~ (§ 3, v12).

### Points à régler en chemin

- ~~**Question « S, R ou SFP » sur une souche sauvage**~~ : **fermée le 17 novembre** par le lot 611 (§ 9, conversation de remise à jour, décision 4).
- ~~**Fiche de niveau à refaire**~~ : faite le 17 novembre (fiche de paillasse, design system § 10.6).
- **Écrans de jeu à maquetter** (Swipe, QCM, Tri, Intrus, Révélation, explication) au niveau de la direction, avant la spec 204 (design system § 15, point 7).
- **Filtres de bruit** (grain, marbrure) : coût à mesurer sur iPhone et Android au lot 108.
- **Swipe et nombre de réponses proposées** (point signalé 56) : à trancher dans la spec 204, avec **l'enchaînement après une réponse** (délai, explication automatique ou sur appui ; design system § 7.5).
- ~~**Briefing, architecture et schéma à aligner sur les conversations 2 à 5, A, B et C**~~ : **fait le 17 novembre** (points signalés 25, 39, 42, 54 et 68 fermés).
- ~~**Monde maîtrisé**~~ : **calculé par la spec 208**, amendée le 17 novembre (§ 9, conversation de remise à jour, décision 9).
- **Texte de la fiche du boss** (« N questions · X % pour ouvrir le monde suivant ») : à confirmer dans la spec 203 ou 208.
- ~~**Le `CLAUDE.md`** pourrait recevoir six règles de l'index~~ : **fait le 17 novembre**, règles relues et acceptées par l'auteur (§ 9, conversation de remise à jour, décision 11).
- **Points signalés 6 à 15** de `docs/specs/index.md` : mise en production du serveur **et création du fichier Contenu de production, de ses seuils d'étoiles et de ses sept clés ELO**, contrôle de la version du serveur par le téléphone, réponses du pré-test dans le paquet, colonnes de validation de Mondes, Niveaux et Composition, suppression d'un compte, session partagée et `localStorage`, onglets Sources et Vocabulaire (laissés au lot 207), « note du fait », table de correspondance hors campagne, durée de session par défaut.
- **Points signalés 17 à 24** : deux sources pour la longueur d'un boss, valeurs de `Mécanique`, `Parcours` et `Ordre` des mondes, « monde maîtrisé » (défini à la conversation C, calcul à placer), point-virgule dans un leurre, exemples annotés du schéma § 3.1, boss fermé pour une raison de données (affichage fixé à la conversation C), mode test en phase 2.
- **Points signalés 26 à 38** : version du référentiel sur chaque ligne, pré-remplissage des swipes sans lot, branchement d'une rubrique nouvelle, colonne renommée, limite de l'import (question et fait ajoutés ensemble), questions orphelines, annulation d'un import, partage de la copie de travail, année de `import AAAA`, textes d'écran à confirmer, dépendances corrigées.
- **Points signalés 40 à 53** : un seul ELO, `Plancher` en nom, réponses proposées (specs amendées, schéma à aligner), pré-test plus court que la période provisoire, aucun ELO avant le lot 5, limite connue du fil de l'eau, estimation approchée, `Reglages` modifié à la main, recalcul de `Progression` sans lot, bascule sous verrou, taille de l'état du recalcul, textes d'erreur à confirmer, graphie des modes, dépendances corrigées.
- **Points signalés 58 à 76** (conversation B et 17 novembre ; 58, 61, 62, 63, 67, 68 et 73 réglés) : dossier `depot/` du projet claude.ai, licence du dépôt, activation de GitHub Pages (tranchée), copie des specs écrites après le lot 101, critère 5.7 du lot 208 à reformuler, clés `Milieu` fictives (**vraies clés fixées à la conversation C** ; spec 102 à amender), version du contenu nulle sans paquet, dépendance 107 → 103, paquet sans numéro de format, choix par défaut à confirmer, nom MicroSwipe à reporter, mise à jour d'une appli jamais fermée, version publiée vue comme « production », G14 sans lot, logo coupé visible une fraction de seconde.
- **Specs sans contenu médical** : elles iront dans le dépôt public ; leurs exemples sont fictifs. Les specs 305, 505 et 506 nomment des onglets et des colonnes du tableur, jamais une valeur.
- **Specs écrites avant le design system et les chiffres ELO** : elles renvoient à `docs/design-system.md` et aux clés de l'onglet Reglages, sans fixer de valeur visuelle ni chiffrée. Le design system existe depuis la conversation C ; les valeurs ELO des tests de la spec 401 et du jeu fictif de la spec 102 sont fictives et n'engagent pas le lot 5.
- ~~**Spec de la phase 1** (conversation B) : garde-fous techniques, branche `dev`, `node --test`, copie des documents dans `docs/` sans contenu médical, jeu de données fictif (avec les sept clés ELO et un palier par question).~~ **Écrite** (specs 101, 102, 103, 104, 107, 108). Restent les specs 105 et 106, qui peuvent s'écrire depuis la conversation C.
- **Intrus et J16** : le briefing § 5 bis les utilise dans les mondes 1 et 2, mais ils sont en phase 6 (lots 601 et 602). À trancher : les avancer en phase 2, ou sortir les mondes 1 et 2 sans eux.
- **Éléments du briefing sans lot** : XP (G1), indice de certitude (P3 ; composant réservé dans le design system), écologie locale (P10), réglages par profil (C6), sons, pré-remplissage des questions de swipe. Notice et consentement (lot 312) et série de connexion (lot 702) ont été placés hors du plan d'origine : à confirmer.
- **Points « à confirmer » du § 9**, lot 4b, conversations 1 (formats de date et de Suivi confirmés le 17 novembre), 3, 4 et 5 ; ceux de la conversation B sont confirmés.
- **Lot 611, Construis l'antibiogramme** : spec à écrire quand les specs 204, 205, 207, 501, 604 et 610 existent ; points à trancher : `docs/specs/cadrage-lot-611.md` § 6 (valeur de reprise de l'ELO, recalcul, couleurs des catégories…).
- **Icônes Android `any maskable`** : à vérifier au lot 103 (index, point 75).

Reste en phase 0 : le **lot 5** (après le lot 401 : un script Node qui charge `serveur/logique/elo.js` seul, simule des internes fictifs et propose les valeurs des sept clés ; `docs/specs/lot-401.md`, § 6.8).
