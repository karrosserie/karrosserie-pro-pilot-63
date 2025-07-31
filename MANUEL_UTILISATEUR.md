# Manuel d'Utilisation - Karrosserie Pro Pilot

## Table des Matières

1. [Introduction](#introduction)
2. [Premier Démarrage](#premier-démarrage)
3. [Interface Utilisateur](#interface-utilisateur)
4. [Modules Principaux](#modules-principaux)
5. [Workflows Détaillés](#workflows-détaillés)
6. [Fonctionnalités Avancées](#fonctionnalités-avancées)
7. [Configuration](#configuration)
8. [FAQ et Dépannage](#faq-et-dépannage)

---

## Introduction

**Karrosserie Pro Pilot** est une solution complète de gestion pour ateliers de carrosserie et garages automobiles. L'application permet de gérer l'intégralité du processus métier, de l'accueil client à la facturation, en passant par la gestion des véhicules, des documents et de la comptabilité.

### Fonctionnalités principales :
- 🚗 Gestion complète des véhicules et clients
- 📄 Création et suivi des documents (devis, factures, ordres de réparation)
- 💰 Comptabilité et gestion financière
- 🚛 Véhicules de courtoisie
- 📊 Tableaux de bord et statistiques
- 🤖 Assistant IA pour l'automatisation

---

## Premier Démarrage

### 1. Connexion

Au premier lancement, vous arrivez sur l'écran de connexion :

- **Email** : Votre adresse email professionnelle
- **Mot de passe** : Mot de passe sécurisé

> 💡 **Astuce** : Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe oublié ?" pour le réinitialiser.

### 2. Configuration Initiale

Après la première connexion, configurez votre entreprise :

1. Allez dans **Paramètres** → **Entreprise**
2. Renseignez :
   - Nom de l'entreprise
   - SIRET/SIREN
   - Adresse complète
   - Logo (format PNG/JPG recommandé)
   - Informations de contact

---

## Interface Utilisateur

### Navigation Principale

L'interface est organisée autour d'une **barre latérale gauche** avec les modules principaux :

- 🏠 **Accueil** : Tableau de bord et vue d'ensemble
- 👥 **Clients** : Gestion de la clientèle
- 🚗 **Véhicules** : Parc automobile
- 📄 **Documents** : Devis, factures, ordres de réparation
- 💰 **Paiements** : Encaissements, dépenses, comptabilité
- 🏦 **Cessions** : Gestion des créances d'assurance
- 🚛 **Véhicules de courtoisie** : Flotte de prêt
- 🤖 **Assistant IA** : Automatisation et aide
- ⚙️ **Paramètres** : Configuration de l'application

### Barre Supérieure

- **Recherche globale** : Recherche dans tous les modules
- **Notifications** : Alertes et rappels
- **Profil utilisateur** : Paramètres personnels et déconnexion

### Interface Responsive

L'application s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : Interface complète avec sidebar
- **Tablette** : Navigation optimisée
- **Mobile** : Interface simplifiée avec menu hamburger

---

## Modules Principaux

## 🏠 Tableau de Bord

Le **tableau de bord** affiche une vue d'ensemble de votre activité :

### KPIs Principaux
- **Véhicules en réparation** : Nombre actuel avec évolution
- **Clients actifs** : Clients ayant eu une activité récente
- **Devis en attente** : Devis non encore validés
- **Chiffre d'affaires** : CA mensuel avec comparaison N-1
- **Répartition CA** : Carrosserie vs Mécanique

### Vues Récentes
- **Véhicules récents** : Derniers véhicules modifiés
- **Documents récents** : Derniers devis/factures créés

### Actions Rapides
Boutons d'accès direct pour :
- ➕ Nouveau véhicule
- 📄 Nouveau devis  
- 👤 Nouveau client
- 💰 Nouvel encaissement

---

## 👥 Gestion des Clients

### Création d'un Client

1. **Accès** : Clients → **+ Nouveau client**

2. **Informations requises** :
   - **Identité** : Nom, prénom, date de naissance
   - **Contact** : Email, téléphone, adresse
   - **Documents** : Permis de conduire (recto/verso)

3. **Validation** : Vérification automatique du format email et téléphone

### Fiche Client

La fiche client regroupe toutes les informations :

#### Onglets disponibles :
- **📋 Informations** : Données personnelles et contact
- **🚗 Véhicules** : Liste des véhicules du client
- **📄 Devis** : Historique des devis
- **🔧 Ordres de réparation** : Ordres en cours et terminés
- **🧾 Factures** : Factures émises
- **💰 Encaissements** : Historique des paiements
- **📊 Rapports d'expertise** : Documents d'assurance
- **↩️ Avoirs** : Notes de crédit

### Actions Client
- **✏️ Modifier** : Édition des informations
- **📧 Contacter** : Email direct depuis l'application
- **📄 Créer un document** : Devis/facture rapide
- **🗑️ Supprimer** : Suppression avec confirmation

---

## 🚗 Gestion des Véhicules

### Enregistrement d'un Véhicule

1. **Accès** : Véhicules → **+ Nouveau véhicule**

2. **Onglet "Informations de base"** :
   - **Immatriculation** : Format français automatiquement vérifié
   - **Marque/Modèle** : Sélection dans une base de données
   - **Année** : Année de mise en circulation
   - **Client** : Association obligatoire

3. **Onglet "Détails techniques"** :
   - **VIN** : Numéro de châssis (décodage automatique)
   - **Couleur** : Couleur du véhicule
   - **Kilométrage** : Kilométrage à l'arrivée
   - **Niveau de carburant** : Jauge visuelle
   - **Type de carburant** : Essence, Diesel, Électrique, Hybride

4. **Onglet "Documents"** :
   - **Carte grise** : Upload PDF ou photo
   - **Assurance** : Documents d'assurance
   - **Photos du véhicule** : Avant réparation, pendant, après

### Décodage VIN Automatique

Quand vous saisissez un VIN valide :
- **Marque/Modèle** : Pré-remplissage automatique
- **Année** : Détection automatique
- **Motorisation** : Informations techniques

### Statuts des Véhicules

- 🟡 **En attente** : Véhicule déposé, diagnostic en cours
- 🔵 **Réservé** : Créneaux de réparation planifiés
- 🟠 **En cours** : Réparations en cours
- 🟢 **Terminé** : Réparations finalisées, prêt à partir
- ❌ **Annulé** : Intervention annulée

### Suivi des Véhicules

Chaque véhicule dispose d'un historique complet :
- **Timeline** : Chronologie des événements
- **Documents associés** : Devis, ordres, factures
- **Photos d'évolution** : Avant/pendant/après réparation
- **Interventions** : Détail des réparations effectuées

---

## 📄 Gestion Documentaire

## Rapports d'Expertise

### Import d'un Rapport

1. **Accès** : Documents → Rapports d'expertise → **+ Import**

2. **Méthodes d'import** :
   - **Upload PDF** : Analyse automatique par IA
   - **Saisie manuelle** : Formulaire de création

3. **Données extraites automatiquement** :
   - Numéro de rapport et date
   - Expert et compagnie d'assurance
   - Numéro de sinistre et police
   - Liste des réparations et pièces
   - Montants et calculs

### Validation et Modification

- **Statut "Importé"** : Modifiable librement
- **Autres statuts** : Lecture seule pour préserver l'intégrité

## Création de Devis

### Processus de Création

1. **Accès** : Documents → Devis → **+ Nouveau devis**

2. **Étape 1 : Informations de base**
   - **Référence** : Auto-générée (DEV-YYYY-NNNN)
   - **Client/Véhicule** : Sélection obligatoire
   - **Date de validité** : 30 jours par défaut

3. **Étape 2 : Import depuis expertise (optionnel)**
   - Sélection d'un rapport d'expertise
   - Import automatique des données
   - Pré-remplissage des réparations et pièces

4. **Étape 3 : Détails commerciaux**

   **Section Réparations** :
   - **Description** : Libellé de l'intervention
   - **Quantité** : Nombre d'heures ou d'unités
   - **Prix unitaire** : Tarif horaire ou forfait
   - **Remise** : Pourcentage ou montant
   - **TVA** : 20% par défaut, modifiable

   **Section Pièces** :
   - **Référence pièce** : Code fournisseur
   - **Désignation** : Description de la pièce
   - **Quantité** : Nombre de pièces
   - **Prix unitaire** : Prix d'achat ou de revente
   - **Remise** : Négociation client

   **Remises globales** :
   - **Remise commerciale** : Sur le total HT
   - **Conditions particulières** : Remises spéciales

5. **Étape 4 : Calculs automatiques**
   - **Total réparations HT**
   - **Total pièces HT**
   - **Remises appliquées**
   - **Base TVA** et **Montant TVA**
   - **Total TTC**

### Actions sur les Devis

- **👁️ Visualiser** : Aperçu du devis formaté
- **📧 Envoyer par email** : Email au client avec PDF
- **📥 Télécharger PDF** : Sauvegarde locale
- **✏️ Modifier** : Édition (si statut permet)
- **🔧 Convertir en ordre** : Création d'un ordre de réparation
- **🗑️ Supprimer** : Suppression avec confirmation

### Statuts des Devis

- 🟡 **En attente** : Devis créé, en attente de validation client
- 🟢 **Validé** : Client a accepté le devis
- 🔵 **Facturé** : Devis converti en facture
- ❌ **Refusé** : Client a refusé le devis
- 🚫 **Annulé** : Devis annulé par l'atelier

## Ordres de Réparation

### Création d'un Ordre

**Méthodes de création** :
1. **Depuis un devis** : Conversion automatique (recommandé)
2. **Création directe** : Formulaire vierge

### Planification

- **Date de début** : Début des travaux
- **Date de fin prévue** : Estimation de livraison
- **Heures estimées** : Charge de travail
- **Mécanicien assigné** : Responsable des travaux

### Suivi d'Avancement

**Statuts disponibles** :
- 📋 **En attente** : Ordre créé, travaux non commencés
- 🔧 **En cours** : Réparations en cours
- ✅ **Terminé** : Travaux finis, en attente de signature
- ✍️ **Signé** : Client a signé l'ordre

### Signature Électronique

1. **Activation** : Bouton "Demander signature"
2. **Envoi au client** : Email avec lien sécurisé
3. **Signature** : Interface tactile sur tablette/mobile
4. **Validation** : Retour automatique dans l'application

### Photos d'Avancement

- **Avant réparation** : État initial du véhicule
- **Pendant** : Évolution des travaux
- **Après** : Résultat final
- **Géolocalisation** : Lieu et heure de prise de vue

## Facturation

### Création d'une Facture

**Sources possibles** :
1. **Depuis un ordre de réparation** : Conversion automatique
2. **Depuis un devis** : Facturation directe
3. **Création manuelle** : Pour services particuliers

### Finalisation Commerciale

Avant émission, possibilité d'ajuster :
- **Quantités réelles** : Selon les travaux effectués
- **Pièces supplémentaires** : Ajouts découverts
- **Remises client** : Gestes commerciaux
- **Conditions de paiement** : Délais et modalités

### Suivi des Paiements

**Statuts de facturation** :
- 🟡 **En attente de paiement** : Facture émise
- 🟠 **Paiement partiel** : Paiement incomplet
- 🟢 **Payée** : Facture soldée

**Liaison automatique** :
- **Encaissements** : Association automatique
- **Relances** : Génération d'emails de rappel
- **Historique** : Suivi complet des paiements

### Génération PDF

Les factures sont générées automatiquement avec :
- **En-tête** : Logo et informations entreprise
- **Détails client** : Adresse de facturation
- **Détail des prestations** : Réparations et pièces
- **Calculs** : HT, TVA, TTC avec détail
- **Conditions** : Modalités de paiement et garanties
- **Pied de page** : Mentions légales obligatoires

---

## 💰 Gestion Financière

## Encaissements

### Saisie d'un Encaissement

1. **Accès** : Paiements → Encaissements → **+ Nouvel encaissement**

2. **Association à une facture** :
   - Sélection dans la liste des factures impayées
   - Pré-remplissage automatique du montant

3. **Détails du paiement** :
   - **Date d'encaissement** : Date effective
   - **Montant** : Montant encaissé (peut être partiel)
   - **Méthode de paiement** :
     - 💵 Espèces
     - 💳 Carte bancaire
     - 📄 Chèque (avec n°)
     - 🏦 Virement (avec référence)
   - **Référence** : Numéro de transaction ou chèque

4. **Justificatifs** :
   - **Photos** : Tickets de carte, chèques
   - **Documents** : Bordereaux de remise
   - **Notes** : Commentaires particuliers

### Gestion des Paiements Partiels

- **Calcul automatique** du restant dû
- **Historique** des paiements précédents
- **Relances automatiques** pour le solde

## Dépenses

### Catégorisation des Dépenses

**Types de dépenses** :
- 🔧 **Fournisseurs** : Pièces détachées, consommables
- 🏢 **Frais généraux** : Loyer, électricité, assurances
- 🛠️ **Outillage** : Matériel et équipements
- 📞 **Services** : Téléphone, internet, logiciels
- 🚚 **Transport** : Carburant, entretien véhicules

### Affectation par Véhicule

Possibilité d'associer une dépense à un véhicule spécifique :
- **Coût direct** : Pièces pour une réparation
- **Calcul de marge** : Automatique sur la facturation
- **Rentabilité** : Analyse par intervention

### Justificatifs et Preuves

- **Factures fournisseurs** : Upload PDF ou photo
- **Tickets** : Petites dépenses en espèces
- **Bordereaux** : Remises de chèques, virements
- **Classification automatique** : IA pour catégoriser

## Comptes Bancaires

### Configuration Multi-Comptes

- **Compte principal** : Compte courant entreprise
- **Comptes secondaires** : Livrets, comptes spécialisés
- **Devises** : Gestion Euro par défaut

### Synchronisation (Préparation)

Fonctionnalité en développement :
- **Import automatique** : Relevés bancaires
- **Rapprochement** : Association avec encaissements/dépenses
- **Soldes temps réel** : Mise à jour automatique

---

## 🏦 Cessions d'Assurance

Les cessions permettent de céder vos créances clients aux compagnies d'assurance.

### Création d'une Cession

1. **Prérequis** : Ordre de réparation avec :
   - Client complet (nom, adresse, téléphone)
   - Véhicule identifié (VIN, immatriculation)
   - Numéro de sinistre
   - Police d'assurance
   - Expert désigné

2. **Processus** :
   - Sélection de l'ordre de réparation
   - Validation automatique des données requises
   - Génération du document de cession
   - Envoi à la compagnie d'assurance

### Informations de Cession

- **Date d'incident** : Date du sinistre
- **Expert** : Nom et société d'expertise
- **Rapport d'expertise** : Numéro de référence
- **Montant de la cession** : Total HT et TTC
- **Compagnie d'assurance** : Preneur en charge

### Suivi des Cessions

**Statuts** :
- 📋 **En cours** : Cession créée, en attente de traitement
- 🟢 **Payée** : Règlement reçu de l'assurance
- ❌ **Refusée** : Cession rejetée par l'assurance

### Avantages

- **Trésorerie** : Paiement immédiat sans attendre le client
- **Gestion** : Plus de suivi client nécessaire
- **Sécurité** : Risque d'impayé transféré à l'assurance

---

## 🚛 Véhicules de Courtoisie

### Gestion de la Flotte

#### Enregistrement des Véhicules de Prêt

1. **Accès** : Véhicules de courtoisie → **+ Nouveau véhicule**

2. **Informations spécifiques** :
   - **Type** : Citadine, Berline, Utilitaire
   - **Assurance** : Police dédiée aux véhicules de prêt
   - **Contrôle technique** : Validité obligatoire
   - **État général** : Inspection initiale

#### Statuts des Véhicules

- 🟢 **Disponible** : Prêt à être prêté
- 🔵 **Prêté** : En cours d'utilisation
- 🟠 **En maintenance** : Révision, réparation
- ❌ **Hors service** : Indisponible temporairement

### Processus de Prêt

#### 1. Demande de Prêt

- **Sélection du client** : Client ayant un véhicule en réparation
- **Choix du véhicule** : Selon disponibilité et besoins
- **Période** : Dates de début et fin prévues

#### 2. Formulaire de Prêt

**Onglets du formulaire** :

- **👤 Informations client** :
  - Vérification des données personnelles
  - Validité du permis de conduire
  - Téléphone de contact

- **🚗 Détails véhicule** :
  - Véhicule de prêt sélectionné
  - Kilométrage de sortie
  - Niveau de carburant

- **🛡️ Assurance** :
  - Vérification de la couverture
  - Extension de garantie si nécessaire
  - Franchise applicable

- **📋 État des lieux de sortie** :
  - **Photos** : Tour complet du véhicule
  - **Équipements** : Roue de secours, cric, triangle
  - **Dommages existants** : Rayures, impacts
  - **Intérieur** : Propreté, accessoires

#### 3. Génération de l'Attestation

- **Attestation PDF** : Document officiel de prêt
- **Géolocalisation** : Lieu et heure de remise
- **Signatures** : Client et représentant garage
- **Conditions** : Règles d'utilisation et retour

### Processus de Retour

#### État des Lieux de Retour

- **Kilométrage** : Relevé à la restitution
- **Carburant** : Vérification du niveau
- **État général** : Comparaison avec l'état de sortie
- **Nouveaux dommages** : Constatation et évaluation

#### Gestion des Dommages

Si des dommages sont constatés :
- **Photos** : Documentation complète
- **Estimation** : Coût de remise en état
- **Facturation** : Si dommages imputables au client
- **Assurance** : Déclaration si nécessaire

### Réservations et Planning

- **Calendrier** : Vue d'ensemble des disponibilités
- **Réservations anticipées** : Planification des prêts
- **Conflits** : Détection automatique des chevauchements
- **Rappels** : Notifications de retour proche

---

## 🤖 Assistant IA

L'Assistant IA automatise et optimise vos tâches quotidiennes.

### Fonctionnalités Principales

#### Suivi des Impayés

- **Détection automatique** : Factures en retard de paiement
- **Analyse** : Profil de risque client
- **Suggestions** : Actions de recouvrement personnalisées
- **Relances automatiques** : Emails et SMS programmés

#### Communication Multicanale

- **Email** : Templates personnalisables
- **SMS** : Messages courts pour urgences
- **Appels** : Intégration téléphonie (si configurée)
- **Historique** : Traçabilité de toutes les interactions

#### Automatisations

**Workflows prédéfinis** :
- **Rappel de retour** : Véhicules prêts depuis X jours
- **Devis en attente** : Relance après 15 jours
- **Contrôle technique** : Alerte avant expiration
- **Révisions** : Propositions selon kilométrage

#### Analyse Contextuelle

- **Tendances** : Évolution de l'activité
- **Prédictions** : Charge de travail prévisionnelle
- **Optimisations** : Suggestions d'amélioration
- **Alertes** : Situations nécessitant attention

### Utilisation Pratique

#### Interface de l'Assistant

- **Tableau de bord IA** : Vue synthétique des actions suggérées
- **Centre d'actions** : Tâches prioritaires à traiter
- **Automatisations actives** : Workflows en cours
- **Historique** : Actions réalisées par l'IA

#### Configuration

- **Règles métier** : Personnalisation des automatisations
- **Seuils** : Paramètres de déclenchement
- **Modèles** : Templates emails et SMS
- **Intégrations** : Connexions externes (téléphone, etc.)

---

## ⚙️ Configuration

### Paramètres Entreprise

#### Informations Générales

1. **Accès** : Paramètres → **Entreprise**

2. **Données obligatoires** :
   - **Raison sociale** : Nom officiel de l'entreprise
   - **SIRET** : Numéro d'identification
   - **NAF/APE** : Code activité
   - **N° TVA** : Numéro de TVA intracommunautaire

3. **Adresse** :
   - **Siège social** : Adresse officielle
   - **Établissement** : Si différent du siège
   - **Contact** : Téléphone, email, site web

4. **Branding** :
   - **Logo** : Format PNG/JPG, résolution recommandée 300x100px
   - **Couleurs** : Charte graphique personnalisée
   - **Signature** : Signature électronique du dirigeant

#### Templates de Documents

**Personnalisation des PDF** :
- **En-têtes** : Logo, informations entreprise
- **Pieds de page** : Mentions légales, coordonnées
- **Mise en page** : Polices, couleurs, espacement
- **Conditions** : Termes et conditions standard

### Gestion d'Équipe

#### Utilisateurs

- **Ajout d'utilisateurs** : Invitation par email
- **Rôles et permissions** :
  - **Administrateur** : Accès complet
  - **Manager** : Gestion opérationnelle
  - **Employé** : Saisie et consultation
  - **Consultant** : Lecture seule

#### Workflow de Validation

- **Validation à plusieurs niveaux** : Devis > Manager > Client
- **Seuils de validation** : Montants nécessitant validation
- **Historique** : Traçabilité des validations

### Préférences Personnelles

#### Interface Utilisateur

- **Thème** : Clair, sombre, automatique
- **Langue** : Français, anglais (selon disponibilité)
- **Timezone** : Fuseau horaire local
- **Format dates** : DD/MM/YYYY ou MM/DD/YYYY

#### Notifications

- **Email** : Fréquence et types de notifications
- **Push** : Notifications navigateur
- **SMS** : Alertes urgentes (si configuré)
- **Tableau de bord** : Widgets personnalisés

### Intégrations

#### Systèmes Externes

- **Comptabilité** : Export FEC, liaison sage
- **CRM** : Synchronisation contacts
- **Téléphonie** : Numérotation automatique
- **Signatures** : Services tiers (DocuSign, etc.)

#### APIs et Webhooks

- **API REST** : Accès programmation externe
- **Webhooks** : Notifications temps réel
- **Formats d'export** : JSON, XML, CSV
- **Authentification** : Tokens sécurisés

---

## Workflows Détaillés

## Workflow Complet : De l'Accueil à la Facturation

### Étape 1 : Accueil Client (5 min)

**Contexte** : Un client arrive avec son véhicule accidenté

1. **Création du client** (si nouveau) :
   - Accès : Clients → **+ Nouveau client**
   - Saisie des coordonnées complètes
   - Upload du permis de conduire
   - Validation automatique des données

2. **Enregistrement du véhicule** :
   - Accès : Véhicules → **+ Nouveau véhicule**
   - Onglet "Informations" : Immatriculation, marque/modèle
   - Onglet "Détails" : VIN (décodage automatique), kilométrage
   - Onglet "Documents" : Photos de l'état initial
   - **Statut** : "En attente"

### Étape 2 : Diagnostic et Expertise (30 min)

3. **Réception du rapport d'expertise** :
   - Accès : Documents → Rapports d'expertise → **+ Import**
   - Upload du PDF reçu de l'expert
   - Extraction automatique des données par IA
   - Validation des informations extraites

4. **Vérification des données** :
   - Numéro de sinistre, police d'assurance
   - Expert et compagnie d'assurance
   - Liste détaillée des réparations
   - Montants et calculs

### Étape 3 : Établissement du Devis (15 min)

5. **Création du devis** :
   - Accès : Documents → Devis → **+ Nouveau devis**
   - Sélection du client et véhicule
   - Import automatique depuis le rapport d'expertise
   - Pré-remplissage de toutes les données

6. **Ajustements commerciaux** :
   - Révision des prix unitaires
   - Application de remises client
   - Vérification des calculs (HT, TVA, TTC)
   - Ajout de notes particulières

7. **Validation et envoi** :
   - Génération du PDF
   - Envoi par email au client
   - **Statut devis** : "En attente"

### Étape 4 : Validation Client (Variable)

8. **Suivi de la validation** :
   - Notification automatique à J+7, J+15
   - Relance téléphonique si nécessaire
   - Réception de l'accord client

9. **Mise à jour du statut** :
   - **Statut devis** : "Validé"
   - **Statut véhicule** : "Réservé"

### Étape 5 : Planification des Travaux (10 min)

10. **Création de l'ordre de réparation** :
    - Conversion automatique depuis le devis
    - Planification des dates de début/fin
    - Assignation du mécanicien
    - **Statut ordre** : "En attente"

11. **Organisation de l'atelier** :
    - Réservation du poste de travail
    - Commande des pièces nécessaires
    - **Statut véhicule** : "En cours"

### Étape 6 : Exécution des Travaux (Variable)

12. **Démarrage des réparations** :
    - **Statut ordre** : "En cours"
    - Photos d'avancement
    - Mise à jour temps réel

13. **Gestion des imprévus** :
    - Pièces supplémentaires découvertes
    - Modification de l'ordre de réparation
    - Information client si dépassement

14. **Finalisation** :
    - Photos du résultat final
    - Nettoyage du véhicule
    - **Statut ordre** : "Terminé"
    - **Statut véhicule** : "Terminé"

### Étape 7 : Signature et Livraison (10 min)

15. **Signature de l'ordre** :
    - Interface de signature électronique
    - Récupération du véhicule par le client
    - **Statut ordre** : "Signé"

### Étape 8 : Facturation (5 min)

16. **Génération de la facture** :
    - Conversion automatique depuis l'ordre signé
    - Ajustements finaux si nécessaire
    - Génération PDF et envoi client

17. **Enregistrement du paiement** :
    - Saisie de l'encaissement
    - Association automatique à la facture
    - **Statut facture** : "Payée"

### Étape 9 : Gestion Assurance (5 min)

18. **Création de la cession** (si applicable) :
    - Génération automatique du document
    - Envoi à la compagnie d'assurance
    - Suivi du règlement

**Durée totale estimée** : 1h20 de manipulation + temps de réparation

---

## Workflow Véhicule de Courtoisie

### Processus de Mise à Disposition

#### Étape 1 : Demande de Véhicule (5 min)

1. **Identification du besoin** :
   - Client avec véhicule en réparation longue
   - Vérification de l'éligibilité (garantie, assurance)
   - Évaluation de la durée nécessaire

2. **Sélection du véhicule** :
   - Consultation des disponibilités
   - Choix selon le profil client (type de véhicule)
   - Réservation du créneau

#### Étape 2 : Préparation du Véhicule (15 min)

3. **Vérification technique** :
   - Niveau des fluides (huile, liquide de refroidissement)
   - Pression des pneus et état général
   - Contrôle des équipements de sécurité
   - Nettoyage intérieur/extérieur

4. **Documentation** :
   - Vérification assurance à jour
   - Contrôle technique valide
   - Équipements obligatoires présents

#### Étape 3 : Remise au Client (20 min)

5. **État des lieux de sortie** :
   - **Photos complètes** : 8 angles + intérieur
   - **Kilométrage de sortie** : Relevé exact
   - **Niveau carburant** : Jauge photographiée
   - **Équipements** : Inventaire détaillé

6. **Formalités administratives** :
   - Vérification permis de conduire valide
   - Signature de l'attestation de prêt
   - Explication des conditions d'utilisation
   - Remise des clés et documents

#### Étape 4 : Suivi Pendant le Prêt

7. **Monitoring** :
   - Rappels automatiques 2 jours avant retour
   - Contrôle de non-dépassement de durée
   - Disponibilité pour questions client

### Processus de Retour

#### Étape 1 : Réception du Véhicule (15 min)

1. **État des lieux de retour** :
   - **Photos de contrôle** : Comparaison avec sortie
   - **Kilométrage** : Calcul de la distance parcourue
   - **Carburant** : Vérification du niveau
   - **Propreté** : État général du véhicule

2. **Détection des anomalies** :
   - Rayures, impacts nouveaux
   - Dommages intérieur
   - Équipements manquants
   - Contraventions éventuelles

#### Étape 2 : Gestion des Dommages (Variable)

3. **Si dommages constatés** :
   - **Documentation** : Photos détaillées
   - **Estimation** : Coût de remise en état
   - **Négociation** : Discussion avec le client
   - **Facturation** : Si accord ou franchise dépassée

4. **Procédures d'assurance** :
   - Déclaration de sinistre si nécessaire
   - Constitution du dossier
   - Suivi du remboursement

#### Étape 3 : Remise en Service

5. **Préparation pour prochain prêt** :
   - Nettoyage complet
   - Vérifications techniques
   - Réparations mineures si nécessaire
   - **Statut** : "Disponible"

**Temps total de processus** : 40 min + temps de réparation éventuelle

---

## Fonctionnalités Avancées

### Recherche Globale

#### Utilisation de la Recherche

**Accès** : Barre de recherche en haut de l'écran (Ctrl+K)

**Types de recherche** :
- **Clients** : Nom, prénom, email, téléphone
- **Véhicules** : Immatriculation, VIN, marque/modèle
- **Documents** : Numéro de devis/facture, référence
- **Montants** : Recherche par montant exact ou approché

**Résultats intelligents** :
- **Autocomplétion** : Suggestions en temps réel
- **Tri par pertinence** : Résultats les plus probables en premier
- **Filtrage** : Par type, date, statut
- **Accès direct** : Clic pour ouvrir l'élément

#### Recherche Avancée

**Opérateurs supportés** :
- **"Texte exact"** : Recherche exacte entre guillemets
- **Texte*** : Recherche avec wildcards
- **Montant:>500** : Recherche par montant supérieur
- **Date:2024** : Filtrage par année

### Raccourcis Clavier

#### Navigation Générale

- **Ctrl+K** : Ouvrir la recherche globale
- **Ctrl+/** : Afficher l'aide des raccourcis
- **Ctrl+Shift+N** : Nouveau document (contexte dépendant)
- **Échap** : Fermer modal/dialogue ouvert

#### Actions Rapides

- **Ctrl+1** à **Ctrl+9** : Navigation directe vers modules
- **F2** : Éditer l'élément sélectionné
- **Suppr** : Supprimer l'élément sélectionné (avec confirmation)
- **Ctrl+S** : Sauvegarder le formulaire en cours

#### Tableaux et Listes

- **↑/↓** : Navigation dans les listes
- **Entrée** : Ouvrir l'élément sélectionné
- **Ctrl+A** : Sélectionner tout
- **Ctrl+Shift+F** : Filtrer le tableau

### Notifications et Alertes

#### Types de Notifications

**Temps réel** :
- 🔔 **Nouveau document** : Devis/facture reçu
- 💰 **Paiement reçu** : Encaissement enregistré
- ✅ **Tâche terminée** : Fin de réparation
- ⚠️ **Alerte** : Retard, échéance proche

**Notifications programmées** :
- 📅 **Rappels** : Contrôle technique, révision
- 📧 **Relances** : Factures impayées
- 🚗 **Véhicules prêts** : Depuis plus de 7 jours
- 📄 **Devis expirés** : À renouveler

#### Configuration des Notifications

**Canaux** :
- **Interface** : Notifications dans l'application
- **Email** : Résumé quotidien/hebdomadaire
- **SMS** : Alertes urgentes uniquement
- **Push** : Notifications navigateur

**Personnalisation** :
- **Fréquence** : Immédiate, groupée, différée
- **Types** : Sélection des événements à notifier
- **Seuils** : Montants ou délais de déclenchement

### Export et Impression

#### Formats d'Export

**Documents unitaires** :
- **PDF** : Mise en page professionnelle
- **Word** : Édition ultérieure possible
- **Excel** : Données structurées

**Données en masse** :
- **CSV** : Import dans d'autres logiciels
- **JSON** : Intégration API
- **XML** : Échanges EDI

#### Exports Comptables

**Format FEC** : Fichier des Écritures Comptables
- Conformité réglementation française
- Import direct dans logiciels comptables
- Période paramétrable
- Validation des données avant export

**Autres formats** :
- **Balance** : Résumé par compte
- **Grand livre** : Détail des écritures
- **Journal** : Chronologique des opérations

### Sauvegardes et Sécurité

#### Sauvegarde Automatique

- **Temps réel** : Sauvegarde à chaque modification
- **Historique** : Versions précédentes conservées
- **Récupération** : Restauration en cas d'erreur
- **Localisation** : Cloud sécurisé + local

#### Sécurité des Données

**Accès** :
- **Authentification forte** : 2FA recommandé
- **Sessions** : Expiration automatique
- **Permissions** : Contrôle granulaire par utilisateur
- **Audit** : Traçabilité de toutes les actions

**Protection** :
- **Chiffrement** : Données en transit et au repos
- **Conformité RGPD** : Respect de la réglementation
- **Sauvegardes** : Chiffrées et dupliquées
- **Anonymisation** : Suppression sécurisée

---

## FAQ et Dépannage

### Questions Fréquentes

#### Utilisation Générale

**Q : Comment récupérer un document supprimé par erreur ?**
R : Les documents supprimés sont conservés 30 jours dans la corbeille. Contactez l'support pour restauration.

**Q : Puis-je modifier un devis déjà envoyé au client ?**
R : Oui, mais une nouvelle version sera créée. L'historique est conservé pour traçabilité.

**Q : Comment fusionner deux fiches client en doublon ?**
R : Contactez le support technique qui effectuera la fusion en préservant l'historique.

**Q : Le décodage VIN ne fonctionne pas, que faire ?**
R : Vérifiez que le VIN contient exactement 17 caractères. Certains véhicules anciens ou étrangers peuvent ne pas être reconnus.

#### Problèmes Techniques

**Q : L'application est lente, comment l'accélérer ?**
R : 
- Videz le cache navigateur (Ctrl+Shift+Suppr)
- Vérifiez votre connexion internet
- Fermez les autres onglets consommateurs
- Redémarrez le navigateur

**Q : Je n'arrive pas à uploader des photos**
R :
- Vérifiez la taille des fichiers (max 10 Mo par photo)
- Formats supportés : JPG, PNG, PDF uniquement
- Désactivez temporairement les extensions de navigateur

**Q : Mes calculs de TVA semblent incorrects**
R :
- Vérifiez le taux de TVA appliqué (20% par défaut)
- Contrôlez les arrondis sur les lignes de détail
- Vérifiez les paramètres de l'entreprise

#### Fonctionnalités Spécifiques

**Q : Comment configurer les signatures électroniques ?**
R : Accédez à Paramètres → Intégrations → Signatures. La configuration nécessite un abonnement au service.

**Q : Puis-je personnaliser les templates PDF ?**
R : Oui, dans Paramètres → Documents → Templates. Vous pouvez modifier logos, couleurs et mise en page.

**Q : Comment exporter mes données pour mon comptable ?**
R : Utilisez l'export FEC dans Comptabilité → Exports. Sélectionnez la période et téléchargez le fichier.

### Codes d'Erreur Courants

#### Erreurs de Connexion

**ERR_001 : Session expirée**
- Solution : Reconnectez-vous à l'application
- Prévention : Activez "Se souvenir de moi"

**ERR_002 : Connexion internet interrompue**
- Solution : Vérifiez votre connexion réseau
- Les données saisies sont sauvegardées localement

#### Erreurs de Données

**ERR_101 : Format de données invalide**
- Solution : Vérifiez les formats requis (email, téléphone, SIRET)
- Utilisez les validateurs automatiques

**ERR_102 : Données manquantes obligatoires**
- Solution : Remplissez tous les champs marqués d'un astérisque (*)
- Vérifiez les onglets du formulaire

#### Erreurs de Fichiers

**ERR_201 : Fichier trop volumineux**
- Solution : Réduisez la taille du fichier (<10 Mo)
- Utilisez la compression d'images

**ERR_202 : Format de fichier non supporté**
- Solution : Convertissez en JPG, PNG ou PDF
- Évitez les formats exotiques

### Assistance et Support

#### Canaux de Support

**Support en ligne** :
- **Chat** : Bouton en bas à droite (heures ouvrables)
- **Email** : support@karrosserie-pro.com
- **Téléphone** : 01.XX.XX.XX.XX (heures ouvrables)

**Ressources d'Aide** :
- **Centre d'aide** : Documentation complète en ligne
- **Vidéos tutoriels** : Chaîne YouTube dédiée
- **Webinaires** : Sessions de formation mensuelles
- **Forum communautaire** : Échanges entre utilisateurs

#### Horaires de Support

**Support technique** :
- Lundi - Vendredi : 9h00 - 18h00
- Réponse sous 4h ouvrables
- Urgences : 7j/7 pour clients Premium

**Formation et conseils** :
- Sur rendez-vous uniquement
- Sessions personnalisées disponibles
- Formation en ligne 24h/24

#### Niveaux de Support

**Standard** (inclus) :
- Support technique par email
- Documentation en ligne
- Mises à jour automatiques

**Premium** (option) :
- Support téléphonique prioritaire
- Formation personnalisée
- Configuration avancée
- Intégrations spécifiques

---

## Conclusion

**Karrosserie Pro Pilot** est une solution complète qui accompagne votre garage dans sa transformation digitale. Cette application centralise toutes vos opérations dans un environnement intuitif et sécurisé.

### Points Clés à Retenir

- **Simplicité** : Interface conçue pour les professionnels de l'automobile
- **Intégration** : Tous les métiers du garage dans une seule application
- **Automatisation** : Réduction des tâches répétitives grâce à l'IA
- **Sécurité** : Protection des données clients et conformité RGPD
- **Évolutivité** : Solution qui grandit avec votre entreprise

### Prochaines Étapes

1. **Formation** : Planifiez une session avec votre équipe
2. **Paramétrage** : Configurez vos templates et préférences
3. **Import** : Migrez vos données existantes
4. **Test** : Utilisez la solution sur quelques dossiers
5. **Déploiement** : Généralisation à toute l'activité

### Contact et Support

Pour toute question ou accompagnement :
- **Support technique** : support@karrosserie-pro.com
- **Formation** : formation@karrosserie-pro.com
- **Commercial** : commercial@karrosserie-pro.com

---

*Document généré automatiquement - Version 1.0 - Janvier 2025*