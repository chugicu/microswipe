# Schéma de données — Application Microbio (14 novembre 2026, phase 0, lot 2 ; mise à jour le 17 novembre)

Complète `docs/architecture.md` et le briefing. Aucun code n'a été généré. Tout ce qui suit a été validé par l'auteur, sauf mention « proposé » ou « à préciser ».

**Mise à jour du 15 novembre (phase 0, lot 4b)** : colonne `Questions de la partie` du journal ; format de l'`ID` d'une réponse ; Suivi garde le dernier numéro reçu de chaque installation ; création automatique du fichier Journal de l'année (§ 4.5, § 5).
**Mise à jour du 17 novembre (conversation de remise à jour)** : alignement sur les specs écrites depuis (lot 4b, conversations 2 à 5 ; conversations A, B et C ; cadrage du lot 611). Validation et identifiants (§ 2) ; clés `Milieu` (§ 3.1) ; format JSON de `Réglages` (§ 3.2, § 3.3) ; `Plancher`, `Mécanique`, `Leurres`, colonne `Lignes posées` (§ 3.4) ; formats de `Fait`, `Champ` et règle stricte de la validation par champ (§ 3.5, § 3.9) ; onglets repris (§ 3.7, § 3.8) ; `Notions` (§ 3.10) ; Reglages (§ 3.13) ; droits (§ 4.1) ; lignes vidées par le recalcul (§ 4.3, § 4.4) ; clé `vues` (§ 4.5) ; journal à 16 colonnes (§ 5) ; points tranchés (§ 6). Formats de date et de Suivi confirmés par l'auteur le 17 novembre.

**Version du dépôt** : les exemples sont fictifs (aucun contenu médical) ; renvois écrits en `docs/…`. Elle est tirée de la version complète, gardée dans le projet claude.ai : ne la corrige pas ici, signale l'écart à l'auteur.

---

## 1. Trois fichiers, plus Carnet Réa

| Fichier | Contenu | Qui y écrit |
|---|---|---|
| **Contenu** (la Google Sheet de production) | Structure du jeu, faits, questions, signalements, historique, réglages | Espace Admin, mode test, import annuel (et la conversion du tableur, une fois, en test) |
| **Joueurs** | Données personnelles : profils, progression, scores, étalonnage, suivi | Le serveur, à chaque synchronisation |
| **Journal AAAA** (un fichier par année) | Une ligne par réponse, jamais modifiée | Le serveur, à chaque synchronisation |
| Sheet de **Carnet Réa** | Identité, mot de passe, sessions | Carnet Réa seulement ; Microbio le lit sans y écrire (partagée en « Lecteur » avec le compte Google dédié) |

Raison des trois fichiers : l'import annuel et les admins « contenu » ne touchent jamais aux données personnelles. Les trois fichiers appartiennent au **compte Google dédié à Microbio** ; ils existent en deux exemplaires, test et production.

Il n'y a **pas d'onglet Comptes** dans Microbio.

Dans les paquets de contenu servis aux téléphones, **toutes les valeurs sont du texte** ; un nombre s'écrit avec un point décimal (spec 306).

---

## 2. Règles communes

- **Identifiant** : préfixe + numéro, attribué par le serveur, jamais renommé ni réutilisé, même pour une ligne archivée. Les identifiants du tableur v6 sont gardés tels quels. À l'import, une ligne nouvelle arrive avec `ID` vide et reçoit le numéro suivant de son onglet ; une espèce nouvelle reçoit le préfixe neutre `ESP-` (`ESP-001`).
- **Validation** : chaque ligne de **faits**, de **Notions** et de **Questions** garde les quatre colonnes du tableur : `Statut` (À valider / Validé / À corriger), `Validé par`, `Date de validation`, `Commentaire du validateur`. **`Mondes`, `Niveaux` et `Composition` n'ont pas de colonnes de validation** : ils sont filtrés sur la visibilité et l'archivage seulement, et le serveur refuse de construire un paquet si l'un d'eux porte une colonne `Statut`. **`Sources` et `Vocabulaire`** n'ont ni colonnes de validation ni `Champs validés`.
- **Colonnes ajoutées à chaque ligne de contenu** : `Archivé le`, `Modifié le`, `Modifié par`.
- **Archivage séparé du statut** : une ligne restaurée retrouve son état de validation.
- **En-têtes** : en production, l'en-tête est en ligne 1 (dans le tableur v6, il est en ligne 4).
- **Version du référentiel** : colonne `Source` (S1, S2…) renvoyant à l'onglet Sources, plus `Page`. **Écart constaté** (point signalé 26) : dans le tableur v6, `Phenotypes` et `Regles` n'ont que `Pages CASFM`, `Especes` a deux colonnes de sources en texte libre et pas de `Page`, `Posologies_EUCAST` a `Emplacement`. La conversion n'écrit aucune source et signale « source absente » ; l'auteur ajoute une colonne `Source` à `Phenotypes` et `Regles`. L'écart sur `Page` retombe sur l'affichage des explications (lot 207).
- **Personne ne modifie la production à la main.** Toute écriture passe par l'espace Admin, le mode test ou l'import, sous le verrou, par le contrôle commun des écritures de contenu ; elle met à jour `Modifié le` et `Modifié par`, ajoute des lignes à `Historique` et augmente `contenu.version`. Proposé : protéger les onglets avec un avertissement.
- **Listes dans une cellule** : séparées par des points-virgules (`Fait`, `Champ`, `Leurres`, `Réponse propre` d'une question à plusieurs faits, `Champs validés`, `ID espèce`, `Lignes posées`). Un texte qui contient lui-même un point-virgule ne peut pas s'y écrire (point signalé 21).

### Identifiants existants dans le tableur v6 (lus le 14 novembre)

| Onglet | Format | Étendue |
|---|---|---|
| Especes | ENT-01, NF-01, GN-01, AUT-01, CGP-01, BGP-01, ANA-01 | 97 taxons |
| RN_communes | RNC-01 | 61 |
| RN_specifiques | RNS-001 | 1 068 |
| Phenotypes | PH-01 | 34 |
| Regles | REG-01 | 175 |
| Antibiogrammes_types | AB-01 (profil, 18 profils) | 252 lignes sans identifiant propre |
| Concentrations_critiques | CC-001 | 529 |
| Molecules_a_tester | MT-001 | 336 |
| Posologies_CASFM | POS-001 | 116 |
| Posologies_EUCAST | PE-001 | 92 |
| Sources | S1 à S8 | 8 |

Le préfixe d'une espèce (ENT, CGP…) est un simple reste historique : il ne change pas si le taxon change de catégorie.

### Nouveaux identifiants

| Onglet | Format |
|---|---|
| Mondes | MON-01 |
| Niveaux | NIV-0001 |
| Questions | Q-000001 |
| Composition | CMP-000001 |
| Notions | NOT-0001 |
| Signalements | SIG-0001 |
| Lignes d'Antibiogrammes_types | ABL-001 (attribué à la conversion, dans l'ordre de la feuille) |
| Vocabulaire | VOC-01 (attribué à la conversion, dans l'ordre de la feuille) |
| Espèce ajoutée par l'import | ESP-001 |

Identifiant d'une partie (créé par le moteur de niveaux) : `p` suivi de 9 caractères `[a-z0-9]`.

---

## 3. Fichier Contenu

### 3.1 Mondes

Colonnes : `ID`, `Parcours` (microbiologie / infectiologie), `Ordre`, `Nom`, `Visible` (oui / non), `Milieu` (clé de couleur de la gélose), `Étoiles pour le boss`, `Seuil du boss` (%), `Questions du boss`, `Archivé le`, `Modifié le`, `Modifié par`.

Exemple : `MON-02 | microbiologie | 2 | Entérobactéries | non | bcp | 30 | 90 | 20`

- **`Milieu`** (design system § 3.8) : `sang`, `bcp`, `chocolat` pour les mondes 1 à 3 ; les clés des mondes 4 à 12 seront fixées quand l'auteur aura choisi leurs milieux. Une clé vide ou inconnue vaut `neutre`.
- Les trois colonnes du boss contiennent **un entier seul** ; vide ou illisible, le boss est fermé (spec 208). Les valeurs de l'exemple sont à chiffrer par l'auteur.
- `Ordre` est pris global, tous parcours confondus ; `Parcours` n'est pas lu avant l'arrivée de l'infectiologie (point signalé 19).
- L'identifiant ne porte pas l'ordre : on peut insérer ou réordonner des mondes.
- Un monde invisible est absent du paquet « internes » ; ses lignes de progression restent en base et reviennent avec lui.

### 3.2 Niveaux

Colonnes : `ID`, `Monde`, `Ordre`, `Type` (normal / révélation / boss / test), `Mécanique`, `Titre`, `Consigne`, `Simplifié`, `Certitude`, `Réglages`, `Archivé le`, `Modifié le`, `Modifié par`.

Exemple : `NIV-0012 | MON-01 | 3 | normal | swipe | Gram Swipe 2 | Classe chaque bactérie | non | non | {réglages}`

- **`Réglages`** est un **texte JSON** (décidé le 15 novembre, spec 201 § 6.3), modifiable seulement par l'espace Admin, qui conserve les clés qu'il ne connaît pas. Forme :
  - `v` : le nombre `1` ;
  - `correspondances` : une table par couple `Onglet:Champ` (§ 3.3) ;
  - les autres clés appartiennent chacune à sa mécanique (directions d'un swipe, chrono, vies…) et sont ajoutées par les lots 204 à 206 et suivants. Le moteur de niveaux ignore les clés qu'il ne connaît pas.
  - texte vide = aucune table : seules les questions à réponse propre sont jouables ; texte illisible = aucune table.
- **Longueur d'un boss** : lue dans `Questions du boss` de Mondes (spec 208), pas dans `Réglages` (point signalé 17).
- `Certitude` n'est pas lue tant que P3 n'a pas de lot.
- Le moteur joue les types `normal` et `boss` ; `révélation` arrive avec le lot 211. Le pré-test et le post-test sont **un niveau de type « test »**, sans onglet dédié ; ces niveaux ne sont dans aucun paquet avant le lot 313. Le post-test rejoue le même niveau.

### 3.3 Table de correspondance (dans Réglages)

Le tableur garde ses valeurs exactes ; le jeu ne devine rien. Les tables sont rangées par couple `Onglet:Champ` : une table va de la valeur du fait à la réponse du jeu.

```
{
  "v": 1,
  "correspondances": {
    "Faits_fictifs:Colonne A": { "Valeur A1": "Réponse 1", "Valeur A2": "Réponse 1", "Valeur A3": "Réponse 2" },
    "Faits_fictifs:Colonne B": { "Valeur B1": "oui", "Valeur B2": "non" }
  }
}
```


**Une valeur sans correspondance n'est pas servie** (motif `valeur_sans_correspondance`) et l'admin la voit en mode test. **Jamais de repli sur la valeur brute.** Cette condition s'applique sur le téléphone (moteur de niveaux), pas dans le filtre du serveur.
C'est le cas, par construction, des valeurs que la table d'un niveau omet volontairement (par exemple une valeur de bas niveau dans une question oui / non).

**Hors campagne** (modes sans niveau) : quelle table s'applique reste à trancher dans la spec 404 (point signalé 14).

### 3.4 Questions

Colonnes : `ID`, `Monde`, `Mécanique`, `Énoncé`, `Fait`, `Champ`, `Réponse propre`, `Leurres`, `Explication`, `Simplifiée`, `Palier` (facile / moyen / difficile / avancé), `Plancher` (un nom ; vide = aucun), `Origine` (tableur / admin / mode test / import AAAA), `Lignes posées` (lot 611), colonnes de validation, colonnes communes.

Exemple : `Q-000412 | MON-02 | swipe | (vide) | Faits_fictifs:FF-01 | Colonne A | (vide) | (vide) | (vide) | non | moyen | (vide) | tableur | (vide) | À valider`

- `Monde` est le **monde de rattachement** : il décide si la question est servie hors campagne (mondes visibles seulement).
- `Mécanique` : `swipe`, `qcm`, `tri` (spec 201) ; chaque mécanique nouvelle ajoute sa valeur et sa ligne dans `FORMES_PAR_MECANIQUE`. Une valeur inconnue rend la question injouable (motif `mecanique_inconnue`).
- Une question **n'a pas de colonne Niveau** : elle peut figurer dans plusieurs niveaux (onglet Composition).
- `Leurres` : une liste séparée par des points-virgules ; un leurre égal à la réponse rend la question injouable.
- `Explication` vide = l'explication vient de la note du fait ; quelle colonne joue ce rôle dans chaque onglet est à trancher dans la spec 207 (point signalé 13).
- **`Palier`** : son nom donne l'ELO de départ de la question, par `elo.paliers` (§ 3.13). Une question sans palier lisible ne compte pas pour l'ELO.
- **`Plancher`** (décidé le 16 novembre) : un **nom**, dont la valeur est dans `elo.planchers` ; **jamais un nombre**. Vide = aucun plancher.
- **`Origine`** : une question créée hors de l'import reçoit `admin` ou `mode test`, ce qui la protège d'un retrait par l'import ; une question modifiée garde son `Origine`. L'import ne vient jamais la prendre dans la copie.
- **`Lignes posées`** (décidée le 17 novembre, cadrage du lot 611) : pour la mécanique « Construis l'antibiogramme » seulement, les identifiants `ABL-…` des lignes d'`Antibiogrammes_types` posées, séparés par des points-virgules. **Vide = toutes les lignes candidates du profil** (celles qui ont une catégorie). Les autres mécaniques la laissent vide et ne la lisent pas. Une ligne de la liste qui n'est plus candidate ou n'appartient pas au profil : la question n'est pas servie et l'admin le voit. **Quand la liste change, la question ne garde pas son ELO** (exception à la conservation de l'ELO ; détail à fixer dans la spec 611). Colonne créée par le lot 611 : un fichier Contenu ou un paquet qui ne l'a pas encore la lit comme vide.
- Une question simplifiée et sa version complète sont deux questions distinctes. Une question simplifiée n'est jamais servie hors campagne ni étalonnée.

### 3.5 Comment une question pointe vers le fait qu'elle teste

- `Fait` = `Onglet:Identifiant`, par exemple `Faits_fictifs:FF-01`.
- `Champ` = le nom exact de la colonne testée, par exemple `Valeur`, `Forme`, `Phénotype`.
- **Plusieurs faits** : une question de tri, d'intrus ou d'étiquettes liste plusieurs références dans `Fait`, séparées par des points-virgules. `Champ` contient alors **un nom** (répété pour chaque fait) **ou autant de noms que de faits**, dans l'ordre ; tout autre nombre rend la question injouable (`champ_illisible`).
- **La question ne stocke pas la réponse** : elle est lue dans le fait. Corriger le fait corrige toutes les questions qui pointent vers lui.
- **« Cette correction touche N questions »** = le nombre de questions ayant le même `Fait` et le même `Champ`.
- **Réponse propre** : pour les QCM et les questions simplifiées, dont la réponse n'est pas la valeur brute du fait. Elle repasse à « À valider » quand la colonne qu'elle teste change, sauf si l'auteur a modifié sa propre ligne dans la copie de l'import. Modifier les leurres ou la réponse propre la repasse aussi à « À valider ».
- **Antibiogramme (J4)** : la question pointe vers un profil entier, `Antibiogrammes_types:AB-01`, champ `Phénotype`. Le filtre ne sait pas encore lire cette référence : la question est exclue du paquet « internes » jusqu'au lot 604. **« Construis l'antibiogramme » (J17)** pointe vers les lignes de `Lignes posées` (lot 611, même contrat).
- Une colonne du tableur renommée n'est plus comparée par l'import (point signalé 29).

Une question est **servie aux internes** si, à la fois :
1. son monde de rattachement est visible ;
2. elle est « Validé » et non archivée ;
3. chacun de ses couples (fait, champ) est validé : ligne du fait « Validé », ou champ présent dans `Champs validés` (§ 3.9) ;
4. la valeur du fait a une correspondance dans le niveau (ou la question a une réponse propre).

Les conditions 1 à 3 sont appliquées par le filtre du serveur (spec 306) ; la condition 4 par le moteur de niveaux, sur le téléphone (spec 201). **Dans le doute, exclu** : ce que le filtre ne sait pas lire n'est pas servi aux internes.

### 3.6 Composition

Colonnes : `ID`, `Niveau`, `Question`, `Ordre`, `Archivé le`, `Modifié le`, `Modifié par`.

Exemple : `CMP-000731 | NIV-0031 | Q-000412 | 7`

- Placer une question dans un niveau = une ligne. L'ordre des questions d'un niveau est la colonne `Ordre`.
- **La réserve d'un boss = les lignes de Composition de son niveau** (l'ordre n'y sert pas ; le tirage se fait sans remise à chaque tentative).
- Le paquet donne aussi, pour chaque niveau, le nombre de questions prévues (`compositionPrevue`), pour que le téléphone sache combien de questions le filtre a retirées.

### 3.7 Onglets de faits repris du tableur

**Douze onglets repris** (spec 305, décidé le 15 novembre) : Sources, Vocabulaire, Especes, RN_communes, RN_specifiques, Phenotypes, Regles, Antibiogrammes_types, Concentrations_critiques, Molecules_a_tester, Posologies_CASFM, Posologies_EUCAST. La liste exacte de leurs colonnes, dans l'ordre, est le `PLAN_DE_CONVERSION` de la spec 305 (§ 6.3), qui fait référence.

Colonnes du tableur gardées telles quelles, plus : les quatre colonnes de validation (recopiées telles quelles), `Champs validés`, `Archivé le`, `Modifié le`, `Modifié par`, et `ID espèce` juste après la colonne du taxon là où le taxon n'est écrit qu'en toutes lettres (RN_communes, RN_specifiques, Molecules_a_tester).

| Onglet | Colonnes propres (résumé) |
|---|---|
| **Especes** | ID, Taxon (libellé CASFM), Genre, Famille, Ordre, Gram, Forme, Catégorie Gram Swipe (niveau 2), Aérobiose, Groupe β-lactamines (entérobactéries), Groupe (libellé), Source du groupe, Espèces incluses, Dans un tableau de résistances spécifiques, Remarque, Sources de l'identité |
| **RN_communes** | ID, Taxons concernés, ID espèce, Antibiotique ou classe, Valeur, Remarque, Source, Page, Confiance de l'extraction |
| **RN_specifiques** | ID, Taxon, ID espèce, Antibiotique, Valeur, Note du CASFM, Source, Page, Confiance de l'extraction |
| **Phenotypes** | ID, Phénotype, Mécanisme (résumé), Classe d'Ambler (hors CASFM), Conséquences sur l'antibiogramme (résumé), Détection (résumé), Règles liées, Antibiogrammes types, **Source** (ajoutée par l'auteur), Pages CASFM |
| **Regles** | ID, Catégorie, S'applique à, Molécules concernées, Action, Résumé de la règle, **Source** (ajoutée par l'auteur), Pages CASFM |
| **Antibiogrammes_types** | ID (`ABL-…`, créé), Profil, Phénotype, Mécanisme (titre CASFM), Fréquence, Antibiotique, Résultat brut, CMI (mg/L), Interprétation rendue, Remarque de transcription, Source, Page, Confiance de l'extraction. Clé naturelle : `Profil` × `Antibiotique` |
| **Concentrations_critiques** | ID, Famille, Section, Libellé CASFM, Molécule, Restriction (taxon ou indication), CMI et diamètres CASFM, Renvois de notes, Remarque (résumé), Source, Page, colonnes EUCAST v16.1, Confiance de l'extraction |
| **Molecules_a_tester** | ID, Taxon, ID espèce, Liste, Molécule, Note du CASFM, Remarque de transcription, Source, Page, Confiance de l'extraction |
| **Posologies_CASFM** | ID, Famille, Molécule, Schéma n°, Posologie standard, Forte posologie, Situations particulières (résumé), Source, Page, Confiance de l'extraction |
| **Posologies_EUCAST** | ID, Famille, Molécule (EUCAST), Standard dosage, High dosage, Uncomplicated UTI, Special situations, Source, Emplacement |
| **Sources** | ID, Source, Version, Fichier, Usage dans le tableur. Sans validation. |
| **Vocabulaire** | **ID** (`VOC-…`, créé), Domaine, Code, Signification, Source. Sans validation. |

Repris mais **non servis à l'appli** tant qu'aucun monde ne les utilise : Concentrations_critiques, Molecules_a_tester, Posologies_CASFM, Posologies_EUCAST. L'import annuel compare ainsi le tableur entier. `Sources` et `Vocabulaire` ne sont dans aucun paquet ; l'affichage de la version du référentiel dans les explications est à régler au lot 207.

**Non repris** : Lisez-moi, RN_matrice, Antibiogrammes_vue, Ecarts_ancien_tableur, Controles (vues et documents de construction) ; **toute colonne calculée** (« Clé (formule) », « Écart CASFM / EUCAST (formule) ») ; la **ligne S7 de Sources** (l'ancien tableur Bacteries.csv). Un onglet ou une colonne inconnus sont ignorés et cités dans le rapport de conversion, sans erreur.

**Conversion** : tout devient du texte, sans arrondi ; un nombre s'écrit avec un point décimal.

**Onglets créés vides** à la conversion : `Mondes`, `Niveaux`, `Composition`, `Questions`, `Notions`. L'onglet `Historique` est créé par le lot 315.

### 3.8 Lien par identifiant d'espèce

Le lien par le nom du taxon est fragile (constaté dans le tableur v6) :
- « Enterococcus faecalis et avium » existe dans RN_specifiques mais pas dans Especes ;
- 11 espèces n'ont aucune ligne de résistance spécifique ;
- RN_communes vise 7 groupes écrits en toutes lettres.

La colonne `ID espèce` accepte **plusieurs identifiants**, séparés par des points-virgules. **La conversion ne la remplit que par libellé exact avec l'onglet Especes** (décidé le 15 novembre) ; un libellé porté par deux espèces, ou absent, la laisse vide et est signalé. **L'auteur complète le reste dans le tableur** (14 libellés au plus, 180 lignes dans le tableur v6). Le code ne déduit aucun lien entre un groupe et ses espèces.

### 3.9 Validation par champ

`Champs validés` liste, séparées par des points-virgules, les colonnes d'une ligne de fait validées en jeu. Valider une question sur une colonne ne valide pas une autre colonne de la même ligne. La colonne `Statut` de la ligne reste réservée à la validation de la ligne entière (tableur ou espace Admin).

**Règle stricte** (décidé le 15 novembre) : pour un fait dont la ligne n'est pas « Validé », **seules les colonnes listées dans `Champs validés` partent dans le paquet « internes »**. En conséquence, le bouton « Valider » du mode test (lot 316) inscrit toutes les colonnes que la carte a montrées (libellé, valeur testée, source, page), pas seulement le champ testé.

### 3.10 Notions

Colonnes : `ID`, `Thème`, `Énoncé du fait`, `Source`, `Page`, `Remarque`, colonnes de validation, `Champs validés`, colonnes communes.

Exemple : `NOT-0007 | Thème fictif | Énoncé fictif | S1 | 12`

Sert de fait aux questions hors tableaux (définitions, pièges). Les futurs onglets de l'auteur (tests diagnostiques, BHRe, pathologies) s'ajoutent à côté. `Notions` fait partie du périmètre de l'import.

### 3.11 Signalements

Colonnes : `ID`, `Date`, `Auteur`, `Type` (signalement / suggestion), `Question`, `Fait`, `Champ`, `Message`, `Réponse proposée`, `État` (ouvert / accepté / refusé), `Traité par`, `Traité le`, `Décision`.

File unique : signalements des internes (par la file de synchronisation, lot 311) et suggestions des admins.

### 3.12 Historique

Colonnes : `Date`, `Auteur`, `Canal` (admin / mode test / import), `Onglet`, `Ligne`, `Colonne`, `Avant`, `Après`, `Motif`. Au format texte.

Exemple : `2027-01-12 | compte-fictif | mode test | Faits_fictifs | FF-01 | Colonne A | Valeur A1 | Valeur A2 | SIG-0042`

- `Auteur` est un `ID compte` ; `Ligne` est l'identifiant de la ligne modifiée.
- Une ligne par cellule modifiée, une par ligne ajoutée, une par ligne archivée ; jamais modifiée ensuite.
- Créé par le lot 315 (`assurerOngletHistorique`) ; une ligne se construit par `construireLigneDHistorique` (contrat de l'index des lots).

### 3.13 Reglages

Colonnes : `Clé`, `Valeur`, `Description`, `Modifié le`, `Modifié par`.

**Tout l'onglet part sur le téléphone de chaque interne**, dans la section `reglages` des deux paquets (décidé le 15 novembre). Une valeur qui doit rester sur le serveur (identifiants de fichiers, état de l'import, empreinte des réglages ELO, note « ELO à recalculer ») va dans les **propriétés du script**, jamais ici. Une clé en double : aucun paquet n'est construit.

| Clé | Valeur | Rôle |
|---|---|---|
| `contenu.version` | entier | Augmentée par toute écriture de contenu, sous le même verrou. |
| `etoiles.seuil_1`, `etoiles.seuil_2`, `etoiles.seuil_3` | entier de 1 à 100, croissants | Seuils d'étoiles (60, 80, 100 prévus). **Créés vides à la conversion, saisis par l'auteur** ; absents ou illisibles, le serveur refuse de construire les paquets (`reglage_invalide`). |
| `elo.interne.depart` | nombre | ELO de départ d'un interne. |
| `elo.interne.k`, `elo.question.k` | tranches `0:K;N:K` | K par tranches du nombre de réponses. |
| `elo.interne.provisoire` | entier | Longueur de la période provisoire. |
| `elo.question.poids_entrainement` | nombre | Poids d'une réponse d'entraînement dans l'étalonnage. |
| `elo.paliers` | liste nommée `nom:valeur;…` | ELO de départ d'une question, par palier. |
| `elo.planchers` | liste nommée, peut être vide | Plancher d'une question, par nom. |
| `accueil.logo` | `oui` / `non` | Logo à l'ouverture ; seul `non` exact le coupe (écran au lot 504). |
| `xp.actif` | `oui` / `non` | Interrupteur des XP (quand un lot les portera). |

Les sept clés ELO sont **créées vides** en test par une fonction lancée depuis l'éditeur (lot 402) et chiffrées par la simulation (lot 5) ; aucune valeur n'est écrite dans le code. Formats exacts : spec 401 § 6.2. Un écran qui modifie Reglages augmente `contenu.version` (sinon les téléphones ne reçoivent pas la nouvelle valeur). La clé `copie.creee_le` prévue au lot 2 **n'existe pas** : l'état de l'import est dans les propriétés du script.

---

## 4. Fichier Joueurs

### 4.1 Profils

Colonnes : `ID compte` (identifiant Carnet Réa), `Pseudo`, `Classement` (oui / non), `Droit contenu`, `Droit résultats`, `Équipe` (bleus / oranges), `Origine` (service / autonome), `Consentement le`, `Version de la notice`, `Pré-test le`, `Post-test le`, `Créé le`.

- **Ni nom ni e-mail** : l'identité reste dans Carnet Réa. Les droits admin sont ici, pas dans la table de Carnet Réa.
- **`Droit contenu` et `Droit résultats` valent `oui` ou `non`** ; toute autre valeur, ou l'absence de ligne, signifie aucun droit. Droits relus à chaque action.
- Une ligne peut être créée par l'attribution de droits avant l'arrivée de l'interne (lot 312 : la compléter, ne pas la doubler).

### 4.2 Progression

Colonnes : `ID compte`, `Niveau`, `Étoiles`, `Meilleur score`, `Tentatives`, `Réussites`, `Dernière réussite`.

- Une ligne par interne et par niveau joué. Sert à la carte, à la contamination et à la restauration sur un nouveau téléphone.
- Le téléphone garde les mêmes lignes dans le magasin `progression` (spec 208) ; niveaux ouverts, boss, monde suivant et total d'étoiles sont recalculés, jamais stockés. `Tentatives` compte les parties terminées. Avant le lot 303, le compte vaut `local`.
- Le lot 310 remplace les lignes du téléphone par celles du serveur, et recalcule Progression depuis le journal.

### 4.3 Scores

Colonnes : `ID compte`, `ELO`, `Provisoire`, `Réponses comptées`, `Étoiles`, `Records`, `Calculé le`.

- Une ligne par interne. Sert au classement.
- Les colonnes ELO (`ELO`, `Provisoire`, `Réponses comptées`, `Calculé le`) sont écrites par le traitement `elo` (lot 402) ; `Étoiles` et `Records` par d'autres lots, jamais par lui.
- Une ligne dont `ELO` est vide n'a pas d'ELO (compte sans réponse comptée, ou ligne vidée par le recalcul complet, qui ne supprime jamais une ligne).

### 4.4 Etalonnage

Colonnes : `Question`, `ELO`, `Réponses comptées`, `Taux de réussite`, `Calculé le`.

- L'ELO courant d'une question est ici, **pas dans l'onglet Questions** : une ligne de contenu ne change que par une action humaine.
- Le recalcul complet vide les lignes des questions qui n'étalonnent plus, sans les supprimer.

### 4.5 Suivi

Colonnes : `ID compte`, `Mis à jour le`, puis une ou plusieurs cellules d'état : `État 1`, `État 2`… (**confirmé le 17 novembre**).

**Une ligne par interne** : questions déjà vues, boîte Leitner et date de prochaine révision, et **dernier numéro de réponse reçu pour chaque installation**, qui sert à écarter les doublons. Le serveur lit une ligne par synchronisation au lieu de fouiller le journal. L'état est réparti sur plusieurs cellules (une cellule Google Sheets est limitée à 50 000 caractères).

**Format** (**confirmé le 17 novembre**, détail dans `docs/specs/lot-308.md`, § 6.5) : mises bout à bout, les cellules d'état forment un texte JSON. Chaque lot y range sa partie sous sa propre clé :

| Clé | Lot | Contenu |
|---|---|---|
| `installations` | 308 | Dernier numéro reçu de chaque installation. |
| `vues` | 402 | Questions déjà vues par l'interne (règle « seule la première réponse étalonne »). |
| à venir | 406 | Boîtes Leitner et dates de révision. |

Progression, Scores, Etalonnage et Suivi sont des **copies de travail** : tout se recalcule depuis le journal.

---

## 5. Fichier Journal (un par année)

### Reponses

**16 colonnes**, dans cet ordre : `ID` (créé par le téléphone), `ID compte`, `Question`, `Mode`, `Niveau`, `Partie`, `Questions de la partie`, `Résultat` (0 à 1), `Réponse donnée`, `Temps` (ms), `Certitude`, `Re-test`, `Date du téléphone`, `Reçu le`, `Version du contenu`, `Réponses proposées`.

Exemple : `[ID] | [compte] | Q-000412 | campagne | NIV-0031 | [partie] | 10 | 1 | oui | 2400 | (vide) | non | … | … | 37 | 2`

- `ID` (format décidé le 15 novembre) : identifiant d'installation, tiret, numéro d'ordre de la réponse sur ce téléphone, par exemple `k3f9x2ab7q-000123`. L'identifiant d'installation est tiré au hasard par le téléphone à sa première ouverture, et de nouveau si ses données locales ont été effacées.
- `Mode` : `campagne`, `classé`, `entraînement`, `sprint`, `survie`, `jour`, `duel`, `pré-test`, `post-test`, écrits exactement ainsi (le moteur ELO les compare tels quels). **Jamais « test »** : le mode test n'écrit rien, et le serveur refuse ses lignes. `pré-test`, `post-test` et `duel` sont refusés tant que les lots 313 et 706 ne les ont pas ouverts.
- `Partie` regroupe les réponses d'une même tentative (étoiles d'un niveau, score d'un boss).
- `Questions de la partie` (ajoutée le 15 novembre) : nombre de questions prévues dans la partie, hors re-test ; vide dans les modes sans longueur fixe. **Une partie est terminée quand le journal contient ce nombre de lignes, hors re-test, pour la même `Partie`** : les étoiles se recalculent ainsi depuis le journal seul.
- `Réponse donnée` permet de voir quel leurre trompe les internes ; une réponse multiple s'écrit en tableau JSON, coupé à 2 000 caractères.
- `Certitude` : toujours vide tant que P3 n'a pas de lot.
- `Date du téléphone` et `Reçu le` : **texte ISO 8601 en UTC** (**confirmé le 17 novembre**).
- `Version du contenu` : l'entier de la version du paquet avec lequel la réponse a été jouée ; le serveur refuse un élément dont elle n'est pas un entier.
- **`Réponses proposées`** (ajoutée le 16 novembre, conversation A) : nombre de réponses proposées à l'interne (directions du swipe, choix du QCM, cases du tri), **entier de 2 à 100**, donné par la mécanique et obligatoire dans tous les modes, re-test compris ; sert au calcul de c dans l'ELO (c = 1 / ce nombre). Écrite comme un nombre, pas au format texte. Aucune valeur par défaut : le serveur refuse un élément sans elle (`champ_invalide`). Un fichier `Journal AAAA` qui n'aurait que 15 colonnes n'est pas modifié automatiquement : Claude s'arrête et demande.
- Le fichier de l'année est choisi d'après `Reçu le` (la date du téléphone n'est pas fiable), **à l'heure de la Guadeloupe**.
- **Création du fichier de l'année** (décidé le 15 novembre) : automatique, par le serveur, à la première réception de l'année. Son identifiant est rangé dans les propriétés du script Apps Script, pas dans l'onglet Reglages.
- **Ordre de réception** = ordre des lignes du journal.
- **Doublons** : si une panne survient entre l'écriture du journal et celle de Suivi, un renvoi peut ajouter une ligne de même `ID`. Aucune ligne n'étant jamais supprimée, **tout calcul ignore une ligne dont l'`ID` a déjà été vu**.
- Le journal accepte toute réponse dont la question existe dans le fichier Contenu, quel que soit son état.

**Taille** : 16 colonnes × 150 internes × 2 000 réponses (hypothèse non vérifiée) ≈ 4,8 millions de cellules par an, sous le plafond de 10 millions par fichier.

---

## 6. Points à préciser plus tard

- **Onglets de la phase 7** (badges, cartes, échanges, duels) : à définir à ce moment-là.
- **Onglets que l'auteur ajoutera au tableur** : atypiques, efflux, tests diagnostiques, BHRe, pathogènes par pathologie. Les brancher demande du code (plan de conversion, périmètre de l'import), sans lot pour l'instant (point signalé 28).
- **Liste d'antibiotiques avec identifiants** : absente du tableur ; utile pour le monde 12 (spectres).
- **Clés `Milieu` des mondes 4 à 12** : quand l'auteur aura choisi leurs milieux.
- **Valeur de reprise de l'ELO** d'une question dont `Lignes posées` change, et repérage du changement par le recalcul : spec 611.
- **Note du fait** (§ 3.4) : spec 207. **Table de correspondance hors campagne** (§ 3.3) : spec 404. **Réponses du pré-test et du post-test** hors du téléphone : spec 313.
- ~~**Niveau partiellement validé**~~ : **tranché le 15 novembre** : un niveau se joue avec les questions servies, fermé seulement s'il n'en reste aucune (spec 201).
- ~~**Un ou deux ELO**~~ : **tranché le 16 novembre** : un seul (spec 401).
