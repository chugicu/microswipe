# Architecture — Application Microbio (14 novembre 2026, phase 0, lot 2 ; mise à jour le 17 novembre)

Complète le briefing (§ 10 quater) et `docs/schema-de-donnees.md`. Aucun code n'a été généré. Tout ce qui suit a été validé par l'auteur, sauf mention « proposé » ou « à vérifier ».

**Mise à jour du 15 novembre (phase 0, lot 4b)** : deux modules uniques (§ 2) ; journal et création automatique du fichier de l'année (§ 7) ; décisions au § 9.
**Mise à jour du 17 novembre (conversation de remise à jour)** : alignement sur les specs écrites depuis (lot 4b, conversations 2 à 5 ; conversations A, B et C ; cadrage du lot 611). Compte Google dédié et sessions (§ 2, § 3) ; paquets, réglages et source du contenu remplaçable (§ 5.1) ; stockage local (§ 5.2) ; traitements dérivés et ELO (§ 5.3, § 5.4) ; import à trois états (§ 5.5) ; mode test (§ 5.6) ; adresse `/microswipe/`, polices hébergées (§ 2) ; décisions au § 10.

**Version du dépôt** : identique à la version complète du projet claude.ai, renvois écrits en `docs/…`. Ne la corrige pas ici : signale l'écart à l'auteur.

---

## 1. Ce qui a été lu

| Source | Ce qui a été lu | Limite |
|---|---|---|
| Carnet Réa, client | Dépôt public `chugicu/carnet-rea`, version du 29 octobre 2026 | — |
| Carnet Réa, serveur | `Code.gs` version 1.4.0, en entier (relu le 15 novembre pour la spec 302) | `Defaults.gs` non lu : à joindre en phase 3, avec `Code.gs`, pour la modification de l'inscription |
| EchoLearn | Dépôt public `chugicu/echolearn` | — |
| Gram Swipe | Première version du niveau 2, dans la conversation « Jeux » | Versions corrigées non lues |
| Tableur | `Base_reference_infectio_v6.xlsx`, version 6 du 4 novembre 2026 (structure relue le 15 novembre pour la spec 305) | — |
| Maquette | Toile « Carte Boîte de Pétri », lue par son lien au lot 3 (16 novembre) et retravaillée avec l'auteur (17 novembre) | Les écrans de jeu restent à maquetter |

**L'ancien tableur (`Bacteries.csv` et son PDF) et la liste de bactéries écrite dans Gram Swipe sont faux : aucune de leurs données n'est reprise.** Dans le tableur v6, aucune ligne de faits ne cite l'ancien tableur.

---

## 2. Vue d'ensemble

```
Téléphone (PWA « MicroSwipe », GitHub Pages, chugicu.github.io/microswipe/)
  │  connexion, mot de passe oublié, inscription
  ├──────────────► Serveur Carnet Réa (Apps Script existant)
  │                   └─ Sheet Carnet Réa : Utilisateurs, Sessions, Config
  │  contenu, synchronisation, admin, mode test          ▲ lecture seule
  └──────────────► Serveur Microbio (nouvel Apps Script, ┘ (partagée en « Lecteur »)
                    compte Google dédié)
                      ├─ Fichier Contenu (Sheet de production)
                      ├─ Fichier Joueurs
                      ├─ Fichier Journal AAAA (un par année)
                      └─ Dossier Drive : paquets de contenu, sauvegardes,
                         fichiers de l'import et du recalcul de l'ELO
```

- **Client** : JavaScript en modules ES, sans framework ni compilation, service worker, **IndexedDB**. Appli installable (PWA), **portrait seul** ; en paysage, une colonne centrée. Dépôt public `chugicu/microswipe` ; GitHub Pages publie la branche `main`, qui n'avance jusqu'à `dev` qu'avec l'accord de l'auteur (à partir du lot 103).
- **Nom affiché « MicroSwipe »** ; noms internes inchangés : base `microbio`, préfixe de cache `microbio-`.
- **Pourquoi IndexedDB** : les applis du même domaine partagent un stockage local d'environ 5 Mo, et Carnet Réa y range toute sa base. Microbio n'utilise pas ce stockage local.
- **Une seule base IndexedDB, `microbio`** (décidé le 16 novembre, spec 104), ouverte par une seule enveloppe. Chaque lot qui a besoin d'un magasin ajoute une migration, déclarative, à la fin de la liste ; une migration enregistrée n'est jamais modifiée, renumérotée ni retirée. Aucune suppression de magasin ni de données. Dans une transaction, on n'attend que ses propres opérations. Un échec d'ouverture de la base n'arrête pas le jeu : le lot garde ses données en mémoire.
- **Même domaine que Carnet Réa et EchoLearn** (`chugicu.github.io`) : condition du partage de la session et du verrou Face ID.
- Le cache du service worker porte un préfixe propre (`microbio-`), pour ne pas être effacé par celui de Carnet Réa. **Mise à jour silencieuse** : une nouvelle version s'applique à l'ouverture suivante, jamais pendant une partie.
- **Polices hébergées dans le dépôt** (décidé le 16 novembre) : aucun appel à Google Fonts, pour le hors-ligne et pour ne transmettre aucune adresse IP à un tiers.
- **Compte Google dédié** (décidé le 15 novembre) : le serveur Microbio et ses fichiers appartiennent à un compte Google distinct de celui de Carnet Réa, à qui la Sheet de Carnet Réa est partagée en « Lecteur ». La lecture seule est garantie par Google ; `clasp` n'est connecté qu'à ce compte et ne peut pas atteindre Carnet Réa. Deux projets Apps Script, **test** et **production** ; le dépôt ne connaît que l'identifiant du projet de test.
- **Un seul module de stockage côté serveur** (décidé le 15 novembre) : tous les accès à Sheets et à Drive passent par lui, ainsi que les propriétés du script et le cache. Aucun autre fichier du serveur n'appelle `SpreadsheetApp`, `DriveApp`, `PropertiesService` ni `CacheService`. Il refuse en dur toute écriture vers le fichier de Carnet Réa. Le reste du serveur ne connaît que des onglets, des colonnes et des lignes.
- **Un seul module d'appel du serveur côté client** (décidé le 15 novembre) : lui seul connaît l'adresse du serveur Microbio, qui est une valeur de configuration (adresse de test et adresse de production ; la production n'est choisie que si la page est servie depuis l'adresse publique). Il ajoute lui-même la session. Aucun autre fichier du client ne fait d'appel réseau vers le serveur.
- **Fonctions pures** dans `serveur/logique/`, sans service Google ni lecture de l'heure, testables par `node --test` ; aucun code exécuté au chargement d'un fichier. Les noms de fonctions déclarés au niveau d'un fichier du serveur sont uniques dans tout le serveur.
- Ces règles gardent une migration bon marché : changer d'hébergement des données ou de serveur ne touche que les deux modules uniques.
- **Garde-fous du dépôt** (spec 101) : `.gitignore` du contenu local, des tableurs, du code de Carnet Réa et des secrets ; crochet `pre-commit` versionné qui refuse un commit sur `main` et tout fichier interdit ; règles de permission de Claude Code. Le contenu réel de travail reste dans `contenu-local/`, exclu de git.

---

## 3. Comptes et verrou

### Verrou Face ID : repris tel quel

- `unlock.js` est identique dans Carnet Réa et EchoLearn ; il tourne entièrement sur le téléphone, sans appel serveur. Le fichier se copie.
- Seul l'écran de verrou est à redessiner.
- C'est un **verrou d'écran, pas une sécurité** : les droits admin sont vérifiés par le serveur.
- **À vérifier sur iPhone au lot 108** : une appli installée sur l'écran d'accueil a probablement son propre stockage. MicroSwipe installée à part demanderait alors sa propre connexion et sa propre activation de Face ID.

### Table de comptes unique : faisable, avec une ligne à changer dans Carnet Réa

1. **Serveur Microbio séparé**, qui lit les onglets « Utilisateurs » et « Sessions » de Carnet Réa **sans y écrire**, par une liste fermée de lectures (jamais un mot de passe, un e-mail ni un nom ; la liste ne s'élargit qu'avec l'accord de l'auteur). Une mise à jour de Microbio ne peut pas casser Carnet Réa ni EchoLearn. Fichier de comptes illisible : réponse `comptes_indisponibles`, pour ne pas déconnecter les téléphones.
2. **Connexion, changement de mot de passe et mot de passe oublié passent par le serveur de Carnet Réa**, comme pour EchoLearn. Microbio ne voit jamais un mot de passe.
3. **Inscription en autonome** : un compte de rôle « interne » **sans semestre**. C'est la seule modification du serveur de Carnet Réa (lot 304). Le formulaire demande prénom, nom, e-mail, DES d'origine, semestre de DES et mot de passe, sans les KT.
   - Ces comptes restent invisibles dans la promo, les défis et le classement EchoLearn.
   - Fermer les inscriptions de Carnet Réa ferme aussi l'inscription autonome.
   - Ils ne sont **jamais anonymisés automatiquement à 5 ans** : une règle de conservation propre est à définir (avec le DPO).
   - Les e-mails de réinitialisation partent au nom de Carnet Réa.
4. **Ne pas créer de nouveau rôle** : un rôle inconnu ferait planter le client Carnet Réa.
5. **Ne pas ajouter de colonne à « Utilisateurs »** : la prochaine colonne ajoutée par Carnet Réa l'écraserait. Droits admin, pseudo et refus du classement sont dans l'onglet Profils de Microbio.
6. **Suppression d'un compte** : Carnet Réa efface l'identité. Microbio supprime alors la ligne Profils ; le journal reste sous un identifiant devenu anonyme. **Aucun lot ne le fait encore.**

### Sessions et droits (spec 302)

- Le serveur vérifie la session aux règles de Carnet Réa, sans rien y écrire. **Une session vérifiée est gardée 5 minutes** (confirmé le 15 novembre), pour ne pas relire Carnet Réa à chaque appel. Les droits sont relus à chaque action.
- Le routeur vérifie la session avant toute action non publique ; une action réservée aux admins commence par le contrôle du droit, et le refait sous le verrou avant d'écrire.
- **Microbio ne prolonge pas une session** (elle est en lecture seule). Sans appel à Carnet Réa, la session s'éteint au terme fixé par la ligne `securite` de l'onglet Config de Carnet Réa (14 jours par défaut, valeur de `Defaults.gs` non vérifiée). **Proposé, à trancher au lot 303** : le téléphone appelle le serveur de Carnet Réa au plus une fois par jour, et ces appels passent peut-être eux aussi par un module unique à adresse configurable.
- **Session partagée** : Carnet Réa la range dans le stockage local, sous une clé commune aux applis du domaine, que Microbio n'utilise pas par ailleurs. À trancher au lot 303.
- **Fichier de comptes fictif en test** jusqu'au lot 303 : le serveur de test ne lit la vraie Sheet de Carnet Réa qu'à partir de ce lot. Aucun jeton de session dans le dépôt, même fictif.
- Premier admin : une fonction lancée depuis l'éditeur Apps Script, puis l'écran des droits de l'espace Admin (lot 504). Action `profil` pour que l'appli sache si elle propose le mode test.

---

## 4. Ce qui est repris de l'existant

| De | Repris | Non repris |
|---|---|---|
| Carnet Réa | File d'attente hors ligne envoyée par paquets, transport des appels, contrôle de version du serveur (aucun lot ne le fait encore contrôler par le téléphone), service worker, table de réglages avec interrupteurs, verrou d'écriture, sauvegarde dans Drive, tuile EchoLearn comme modèle de C2 | La synchronisation table par table : elle charge chaque table en entier, ce qui ne tient pas pour le journal. Le stockage local (`localStorage`). |
| Gram Swipe | Le geste (axe dominant, seuil, carte qui suit le doigt, indice de direction), le dessin générique | La liste en dur, les règles (30 s, 2 vies, points), la palette (remplacée par celle du design system, § 3.9) |

Gram Swipe est un prototype d'un seul fichier : une référence, pas une base de code.

---

## 5. Flux

### 5.1 Contenu : paquets et chargement

1. Le téléphone se connecte auprès de Carnet Réa et reçoit une session.
2. Il demande le contenu à Microbio (action `contenu`), en nommant le paquet voulu et en donnant sa version locale.
3. Le serveur vérifie la session. Le paquet « admin » n'est servi que sur demande explicite, après contrôle du droit « contenu » ; un admin en jeu normal reçoit le paquet « internes ».
4. Il renvoie le **paquet de contenu**, ou rien s'il est à jour : mondes visibles, niveaux, composition, questions servies, valeurs des faits (seulement les colonnes servies), explications avec source et page, et la section **`reglages`** (tout l'onglet Reglages, clé → valeur).
5. L'état de l'interne (progression officielle, ELO, suivi) vient d'autres actions, aux lots 310 et 402.
6. Le téléphone range le paquet « internes » dans IndexedDB.

- **Préparé à l'avance, reconstruit à la première demande** qui suit un changement de `contenu.version` ; un paquet d'une autre version n'est jamais servi. **Toute écriture de contenu augmente `contenu.version` sous le même verrou** ; sans cela, les paquets ne sont pas reconstruits.
- Deux paquets : « internes » et « admin ». Le paquet « internes » ne contient ni statut, ni nom de validateur, ni commentaire ; un **second contrôle indépendant** le vérifie avant de l'enregistrer. Le paquet « admin » dit pour chaque question si elle est servie aux internes, et pourquoi. **Dans le doute, exclu** : ce que le filtre ne sait pas lire n'est pas servi aux internes.
- **Le serveur refuse de construire les paquets** quand les seuils d'étoiles manquent ou sont illisibles (`reglage_invalide`), quand une clé de Reglages est en double, ou quand le second contrôle échoue. Les téléphones gardent alors le contenu qu'ils ont et continuent de jouer.
- **Tout ce qui est rangé dans Reglages part sur le téléphone de chaque interne** : une valeur qui doit rester sur le serveur va dans les propriétés du script.
- La condition « valeur sans correspondance dans le niveau » s'applique sur le téléphone (moteur de niveaux), pas dans le filtre du serveur.
- Les niveaux de type « test » ne sont dans aucun paquet tant que le lot 313 ne les a pas ouverts. Comment les réponses du pré-test et du post-test restent hors du téléphone alors qu'elles viennent de la base commune : à trancher au lot 313.
- **Phases 1 et 2, sans serveur** (spec 107) : le téléphone lit le contenu par une **source remplaçable** qui répond comme l'action `contenu` ; elle sert un jeu de données fictif (spec 102). Le lot 307 la remplace par l'appel au serveur, sans autre changement. Le téléphone garde le dernier paquet bien formé ; une version plus petite reçue remplace quand même (le serveur est la référence). Le paquet « admin » reste en mémoire jusqu'au lot 307.

### 5.2 Jeu hors ligne

- Tout se joue depuis le téléphone. Chaque réponse s'ajoute à une file locale, avec un identifiant unique créé par le téléphone (identifiant d'installation + numéro d'ordre) et le nombre de réponses proposées par la mécanique.
- Étoiles, déblocages et ELO estimé sont calculés sur place ; le serveur recalcule et **sa version l'emporte**. Sur le téléphone, la progression locale ne stocke qu'une ligne par compte et par niveau ; niveaux ouverts, boss, monde suivant et total d'étoiles sont recalculés.
- La reprise exacte est sauvegardée après chaque carte (jamais en mode test).
- Demandent du réseau : corrections du mode test, pré-test et post-test, duel, classement à jour, écrans de l'espace Admin.
- Rappel : sur iPhone, un site non installé peut perdre ses données locales après 7 jours sans visite ; seules les réponses non synchronisées sont alors perdues. Invitation à installer après la 1re et après la 10e partie terminée.

### 5.3 Synchronisation

- Elle part à chaque fin de partie, au retour du réseau, à l'ouverture, puis régulièrement tant que la file n'est pas vide. Rien ne part quand l'appli est fermée. Paquets de taille fixée dans le client.
- Sous verrou, le serveur :
  1. écarte les réponses déjà reçues (Suivi garde le dernier numéro reçu de chaque installation) ;
  2. refuse les lignes du mode test, et les modes que les lots n'ont pas encore ouverts (pré-test, post-test, duel) ;
  3. contrôle chaque champ (dont le nombre de réponses proposées, entier de 2 à 100) ;
  4. ajoute les réponses au journal de l'année ;
  5. exécute les **traitements dérivés** branchés sur la synchronisation : Suivi (lot 308), progression officielle (lot 310), ELO (lot 402), et plus tard Leitner (lot 406).
- Il répond avec les réponses bien reçues, l'ELO officiel et la version du contenu.
- Le téléphone ne retire de sa file que ce qui est confirmé. Un renvoi après coupure ne compte pas deux fois. Chaque réponse de la file porte son compte et n'est jamais envoyée sous un autre.
- Les signalements d'erreur des internes passent par la même file (lot 311).

### 5.4 ELO côté serveur

- Règles du briefing § 4 ; détail : `docs/specs/lot-401.md` (moteur), `lot-402.md` (ELO officiel), `lot-403.md` (recalcul).
- **Un seul ELO par interne**, que la campagne ne fait pas bouger ; effets de chaque mode dans `EFFETS_ELO_PAR_MODE`. Un mode absent de ce tableau n'a aucun effet.
- **Une seule formule**, dans `serveur/logique/elo.js`, recopiée à l'identique sur le téléphone (`client/elo/moteur.js`) ; un test compare les deux.
- Traitement dérivé `elo` à chaque synchronisation : il écrit les colonnes ELO de `Scores`, `Etalonnage` et la liste des questions vues de `Suivi`, jamais `Étoiles` ni `Records`.
- **Calculé dans l'ordre de réception** : le recalcul complet redonne exactement le même résultat. Contrepartie : une réponse jouée hors ligne compte à son arrivée.
- **Seule la première réponse d'un interne à une question peut étalonner**, et seulement s'il est sorti de sa période provisoire.
- Sept clés dans Reglages ; aucune valeur dans le code. Réglage absent ou illisible : aucun ELO n'est calculé et le serveur note « ELO à recalculer » (empreinte des réglages et note dans les propriétés du script). Limite connue : une exécution tuée entre deux écritures peut compter un paquet deux fois ; seul le recalcul la répare.
- **Recalcul complet** depuis le journal, par un bouton de l'espace Admin (droit « contenu »), avec secours depuis l'éditeur Apps Script : par tranches d'environ 2 minutes (une exécution est limitée à 6 minutes), état gardé dans un fichier privé, reprise après interruption, un seul à la fois, bascule d'un seul coup sous le verrou. Il ne recalcule que l'ELO ; le recalcul de la progression depuis le journal revient au lot 310.
- **Exception à la conservation de l'ELO** (décidée le 17 novembre, lot 611) : quand la liste des lignes posées d'une question « Construis l'antibiogramme » change, la question ne garde pas son ELO (sa longueur change sa difficulté) ; l'ELO des internes n'est pas touché. À préciser dans la spec 611 avec le lot 401 : valeur de reprise, et façon dont le recalcul complet distingue les réponses d'avant et d'après le changement (date lue dans `Historique`, ou version du contenu de chaque ligne du journal).
- Le classement est reconstruit au plus toutes les 5 minutes.

### 5.5 Import annuel

Détail : `docs/specs/lot-505.md` (préparer, comparer) et `lot-506.md` (conflits, appliquer). Écran « Import annuel » de l'espace Admin, en ligne seulement.

1. **Préparer** : le serveur crée une **copie de travail** et une **copie de référence**, jamais touchée. L'état de l'import est dans les propriétés du script ; rien n'est écrit dans le fichier Contenu.
2. L'auteur modifie la copie de travail, avec le compte Google dédié. C'est le seul endroit où l'on saisit à la main. `ID` vide pour une ligne nouvelle ; jamais d'identifiant changé.
3. **Comparer** : rapprochement par identifiant, onglet par onglet, entre **trois états** (référence, production, copie). Le récapitulatif liste les lignes ajoutées, modifiées, retirées et en conflit, ainsi que les colonnes inconnues ou absentes. Rien n'est écrit.
4. L'admin tranche chaque conflit, pour la ligne entière.
5. **Appliquer**, sous verrou : la comparaison est refaite et l'application refusée si elle a changé depuis le récapitulatif ; sauvegarde du fichier Contenu ; plan d'application enregistré avant la première écriture ; écriture ; archivage des lignes retirées ; lignes d'Historique (canal `import`) ; `contenu.version` + 1, puis reconstruction des paquets.

- **Conflit** : une ligne changée des deux côtés (production et copie), différemment. Une ligne changée seulement en production garde sa version de production. Une ligne supprimée de la copie mais modifiée en production est un conflit.
- **Périmètre** : les douze onglets de faits, Notions et Questions. Mondes, Niveaux et Composition ne se modifient que dans l'espace Admin.
- `ID`, `Archivé le`, `Modifié le`, `Modifié par` et, pour Questions, `Origine` ne viennent jamais de la copie. **Le statut de validation, lui, en vient** : l'auteur valide dans la copie avant d'importer.
- Une colonne absente de la copie (supprimée ou renommée) n'est pas comparée : la production garde ses valeurs.
- Une **question à réponse propre** repasse à « À valider » quand la colonne qu'elle teste change, sauf si sa propre ligne est reprise de la copie (tranché le 16 novembre).
- Une question dont l'`Origine` n'est ni `tableur` ni `import …` (créée dans l'espace Admin ou en mode test) n'est jamais retirée. Les questions dont un fait est archivé ne sont pas modifiées : elles cessent d'être servies.
- **Aucune fonction de l'import ne supprime quoi que ce soit.** Les ELO sont conservés par construction : l'import n'a accès ni au fichier Joueurs ni au Journal, et ne change aucun identifiant.
- **Reprise** : l'application est reprenable après interruption ; tant qu'elle n'est pas finie, toute autre écriture de contenu est refusée (`import_en_cours`, contrôle commun appelé par toute écriture) et `contenu.version` ne bouge pas : les internes gardent l'ancien contenu.
- Limites connues : une question ajoutée ne peut pas pointer vers un fait ajouté par le même import ; aucune annulation d'un import appliqué (seule la sauvegarde permet de revenir en arrière, à la main).

### 5.6 Mode test

- **Filtrage côté serveur** : le paquet « admin » (questions non validées, mondes invisibles) n'est construit et servi que si Profils donne le droit « contenu » au compte, sur demande explicite. Le droit est revérifié à chaque action. Le paquet « internes » est construit par un filtre qui ne peut pas laisser passer une ligne non validée, puis vérifié par un second contrôle.
- **Rien ne compte** : un abonné des événements du jeu qui enregistre quoi que ce soit sur l'interne ignore un événement du mode test ; les réponses du mode test n'entrent pas dans la file, et le serveur les refuserait. Le mode test n'existe qu'en mémoire.
- **Phase 2, sans serveur** : le droit et le paquet « admin » viennent de fournisseurs provisoires remplaçables (droit accordé seulement hors de l'adresse publique, paquet « admin » fictif) ; les lots 303 et 307 les remplacent.
- **Corriger une réponse** (lot 316) :
  1. le serveur renvoie les N questions touchées (même fait, même champ), et signale celles à réponse propre ;
  2. l'admin confirme (« Cette correction touche N questions… ») ;
  3. le serveur vérifie que la ligne n'a pas changé entre-temps, contrôle que la valeur est un code du Vocabulaire, écrit, repasse le fait à « À valider », trace dans Historique.
  - Le fait et ses N questions **sortent du jeu des internes jusqu'à validation**.
- **Corriger la rédaction** (lot 315) : la question garde son statut. **Modifier les leurres ou la réponse propre la repasse à « À valider »** (un leurre peut être une bonne réponse).
- **Suggérer** : une ligne dans Signalements ; rien ne change dans le jeu.
- **Valider** : le bouton affiche la source et la page, puis enregistre le nom et la date sur la question, et inscrit dans `Champs validés` **toutes les colonnes que la carte a montrées** (validation par champ, règle stricte).
- **Supprimer** : la question est archivée.
- Une question créée en mode test reçoit `Origine` = `mode test`. Toute écriture met à jour `Modifié le` et `Modifié par`, passe par le contrôle commun et augmente `contenu.version`.
- Ces actions demandent du réseau et s'écrivent sous verrou.

---

## 6. Sécurité et données personnelles

- Le contenu médical n'est jamais sur GitHub Pages ni dans le dépôt (y compris `docs/`, les specs, les tests et les messages de commit) ; il est servi après connexion.
- En jeu normal, les réponses sont sur le téléphone (nécessaire hors ligne). **Pré-test et post-test sont corrigés par le serveur, réseau obligatoire.**
- Les données personnelles sont dans un fichier séparé (Joueurs) ; le journal ne porte que l'identifiant du compte.
- Sauvegardes automatiques dans Drive (fréquence proposée : quotidienne pour Contenu et Joueurs ; l'import fait sa propre sauvegarde avant d'appliquer).
- Aucun jeton, mot de passe ni chemin personnel dans le dépôt.

---

## 7. Incertitudes et points à vérifier

- **Vitesse et quotas d'Apps Script** : ordres de grandeur non mesurés. La limite d'exécutions simultanées (probablement 30 par compte) n'est plus partagée avec Carnet Réa et EchoLearn grâce au compte Google dédié, à vérifier. **Test de charge en phase 3.**
- **iPhone** : stockage séparé d'une appli installée, vibration (lot 108).
- **Taille du journal** : environ 4,8 millions de cellules par an (16 colonnes) sur une hypothèse de 2 000 réponses par interne, non vérifiée ; toujours sous le plafond de 10 millions.
- **Bascule du recalcul de l'ELO** : quelques secondes à quelques dizaines de secondes pendant lesquelles les synchronisations reçoivent `occupe` ; taille de l'état du recalcul. À mesurer au lot 403.
- **Version publiée sur GitHub Pages vue comme « production »** par le choix de l'adresse du serveur et par le droit provisoire du mode test : en phase 3, elle appellerait le serveur de production, dont l'adresse reste vide tant que la mise en production n'est pas décrite. À trancher avant de tester le serveur sur un téléphone.
- **Mise en production du serveur** : aucun lot ne décrit encore la création du projet de production, de ses fichiers (dont le fichier Contenu de production, ses seuils d'étoiles et ses sept clés ELO) et de son adresse.
- **Règle de conservation des comptes autonomes** : à définir avec le DPO.
- ~~**Un ou deux ELO**~~ : **tranché le 16 novembre**, un seul (§ 5.4).
- ~~**Création du fichier Journal de l'année suivante**~~ : **décidé le 15 novembre**, à la première réception de l'année (§ 9).

---

## 8. Décisions du lot 2 (14 novembre)

1. Trois fichiers : Contenu, Joueurs, Journal annuel.
2. Tous les onglets de saisie du tableur sont repris, même non joués. (Précisé le 15 novembre : douze onglets repris, cinq écartés, spec 305.)
3. Onglet Notions pour les faits hors tableaux.
4. ELO courant des questions dans Etalonnage, pas dans Questions.
5. Droits admin et pseudo dans Profils ; pas d'onglet Comptes.
6. Pré-test et post-test : un niveau de type « test », corrigé par le serveur.
7. La réponse est lue dans le fait, sauf réponse propre.
8. Une question peut figurer dans plusieurs niveaux (onglet Composition). La limite à un seul niveau a été **refusée**.
9. Lien par identifiant d'espèce, pas par nom.
10. Archivage dans une colonne séparée du statut.
11. Le journal enregistre le temps et la réponse donnée.
12. Résistances naturelles posées en « oui / non », en vrai / faux ou en « quelles sont les résistances naturelles de… », **jamais en S ou R**. (Précisé le 17 novembre : le refus vise ces questions ; une case de « Construis l'antibiogramme » peut porter sur une molécule de résistance naturelle d'un profil sauvage.)
13. Table de correspondance par niveau ; valeur « r » exclue des questions oui / non.
14. Ligne S7 de Sources non importée.
15. Serveur Microbio séparé ; connexion par Carnet Réa ; inscription autonome sans semestre.
16. Paquet de contenu préparé à l'avance, remplacé en entier.
17. ELO dans l'ordre de réception ; première réponse seule, campagne comprise.
18. Onglet Suivi, une ligne par interne.
19. À l'import, le statut de validation vient de la copie.
20. Validation par champ.
21. Modifier leurres ou réponse propre repasse la question à « À valider ».

---

## 9. Décisions du 15 novembre (phase 0, lot 4b, conversation 1)

Détail dans `docs/specs/lot-308.md`, `docs/specs/lot-309.md` et `docs/schema-de-donnees.md` (§ 4.5, § 5).

1. **Un seul module de stockage côté serveur** et **un seul module d'appel du serveur côté client, à adresse configurable** (§ 2). Écrit dans la spec du lot 301.
2. Le journal a une colonne `Questions de la partie`, qui dit combien de questions comptait la partie, pour que les étoiles se recalculent depuis le journal seul. (16 colonnes depuis le 16 novembre : `Réponses proposées` s'ajoute.)
3. L'identifiant d'une réponse = identifiant d'installation + numéro d'ordre. Suivi garde le dernier numéro reçu de chaque installation ; tout numéro inférieur ou égal est un doublon.
4. Le fichier Journal de l'année est créé automatiquement à la première réception de l'année, à l'heure de la Guadeloupe.
5. Le journal accepte toute réponse dont la question existe dans le fichier Contenu, quel que soit son état. Le serveur reconnaît le mode test à la colonne `Mode`.
6. Synchronisation en deux lots (308 serveur, 309 téléphone). Le § 5.3, point 5, se réalise en plusieurs lots : Suivi au lot 308, Progression au lot 310, Scores et Etalonnage au lot 402.
7. Après un effacement des données locales par Safari : aucun message ; envoi à chaque fin de partie et à chaque ouverture, demande de stockage persistant, ligne « réponses en attente d'envoi » dans Profil.

---

## 10. Décisions reportées le 17 novembre (lot 4b, conversations 2 à 5 ; conversations A, B et C ; lot 611)

Le détail et la date de chaque décision sont dans le plan de développement, § 9, et dans les specs citées.

1. **Compte Google dédié** ; Sheet de Carnet Réa partagée en « Lecteur » ; deux projets Apps Script, test et production (§ 2 ; spec 301).
2. **Sessions** : vérification aux règles de Carnet Réa, mémoire de 5 minutes, droits relus à chaque action, fichier de comptes fictif en test jusqu'au lot 303, Microbio ne prolonge pas une session (§ 3 ; spec 302).
3. **Paquets** : demande d'un paquet nommé, reconstruction à la demande, section `reglages`, refus de construire sans seuils d'étoiles, second contrôle, « dans le doute, exclu » (§ 5.1 ; spec 306).
4. **Rien de confidentiel dans Reglages** : tout y part sur les téléphones (§ 5.1).
5. **Contrôle commun de toute écriture de contenu**, sous le verrou, et onglet Historique (§ 5.5, § 5.6 ; specs 315, 506).
6. **Import à trois états**, reprenable, sans aucune suppression (§ 5.5 ; specs 505, 506).
7. **Un seul ELO**, campagne sans effet sur l'interne, sept clés dans Reglages, recalcul complet par l'espace Admin (§ 5.4 ; specs 401 à 403).
8. **Nombre de réponses proposées** dans chaque réponse et dans le journal (16 colonnes) (§ 5.2, § 5.3 ; specs 201, 308, 309).
9. **Stockage local** : une base `microbio`, migrations jamais modifiées (§ 2 ; spec 104).
10. **Source du contenu remplaçable** en phases 1 et 2 (§ 5.1 ; spec 107).
11. **Nom MicroSwipe, adresse `chugicu.github.io/microswipe/`**, dépôt `chugicu/microswipe` ; mise à jour silencieuse ; portrait seul (§ 2 ; spec 103).
12. **Polices hébergées dans le dépôt** (§ 2 ; design system § 4.1).
13. **Exception à la conservation de l'ELO** pour la liste des lignes posées de « Construis l'antibiogramme » (§ 5.4 ; cadrage du lot 611).
