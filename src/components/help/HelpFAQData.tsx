import React from 'react';
import { Rocket, Users, Car, Wrench, FileText, CreditCard, Truck, ClipboardList, DollarSign, Bot, MoreVertical } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface FAQSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

export const faqSections: FAQSection[] = [
  {
    id: "getting-started",
    title: "Prise en main",
    icon: <Rocket className="h-5 w-5" />,
    items: [
      {
        question: "Comment me connecter à l'application ?",
        answer: (
          <div className="space-y-4">
            <p>Pour vous connecter à l'application :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Accédez à la page de connexion</li>
              <li>Saisissez votre adresse email</li>
              <li>Entrez votre mot de passe</li>
              <li>Cliquez sur "Se connecter"</li>
            </ol>
            <p className="text-sm text-muted-foreground">En cas d'oubli de mot de passe, utilisez le lien "Mot de passe oublié" sur la page de connexion.</p>
          </div>
        )
      },
      {
        question: "Comment naviguer dans l'application ?",
        answer: (
          <div className="space-y-4">
            <p>L'application est organisée avec un menu de navigation sur la gauche contenant :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Tableau de bord</strong> : Vue d'ensemble de votre activité</li>
              <li><strong>Activité</strong> : Historique des actions</li>
              <li><strong>Assistant IA</strong> : Aide intelligente</li>
              <li><strong>Profil</strong> : Gestion de votre compte</li>
              <li><strong>Clients</strong> : Gestion des clients</li>
              <li><strong>Véhicules</strong> : Gestion du parc automobile</li>
              <li><strong>Flotte</strong> : Vue d'ensemble de la flotte</li>
              <li><strong>Documents</strong> : Devis, factures, ordres de réparation</li>
              <li><strong>Paiements</strong> : Encaissements, dépenses, comptes</li>
              <li><strong>Comptabilité</strong> : Suivi financier</li>
              <li><strong>Cessions</strong> : Gestion des ventes de véhicules</li>
              <li><strong>Planning</strong> : Organisation du travail</li>
              <li><strong>Paramètres</strong> : Configuration</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "clients",
    title: "Gestion des clients",
    icon: <Users className="h-5 w-5" />,
    items: [
      {
        question: "Comment créer un nouveau client ?",
        answer: (
          <div className="space-y-4">
            <p>Pour ajouter un nouveau client :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Rendez-vous dans la section <strong>Clients</strong></li>
              <li>Cliquez sur le bouton <strong>"Nouveau client"</strong></li>
              <li>Remplissez les informations obligatoires (nom, prénom, email ou téléphone)</li>
              <li>Ajoutez les informations complémentaires si nécessaire</li>
              <li>Cliquez sur <strong>"Enregistrer"</strong></li>
            </ol>
            <p className="text-sm text-muted-foreground">Vous pouvez modifier ces informations à tout moment en cliquant sur le client dans la liste.</p>
          </div>
        )
      },
      {
        question: "Comment rechercher un client ?",
        answer: (
          <div className="space-y-4">
            <p>Plusieurs options s'offrent à vous :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Utilisez la barre de recherche en haut de la liste des clients</li>
              <li>La recherche fonctionne sur le nom, prénom, email et téléphone</li>
              <li>Utilisez les filtres pour affiner votre recherche</li>
            </ul>
          </div>
        )
      },
      {
        question: "Comment créer un devis pour un client ?",
        answer: (
          <div className="space-y-4">
            <p>Pour créer un devis :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Sélectionnez le client dans la liste</li>
              <li>Cliquez sur le menu actions (trois points) à droite</li>
              <li>Choisissez <strong>"Créer un devis"</strong></li>
              <li>Remplissez les détails du devis</li>
              <li>Ajoutez les réparations et pièces nécessaires</li>
              <li>Enregistrez le devis</li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    id: "vehicles",
    title: "Gestion des véhicules",
    icon: <Car className="h-5 w-5" />,
    items: [
      {
        question: "Comment ajouter un véhicule ?",
        answer: (
          <div className="space-y-4">
            <p>Pour ajouter un nouveau véhicule :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Allez dans la section <strong>Véhicules</strong></li>
              <li>Cliquez sur <strong>"Nouveau véhicule"</strong></li>
              <li>Remplissez les informations de base (marque, modèle, immatriculation)</li>
              <li>Ajoutez les détails techniques (année, couleur, etc.)</li>
              <li>Téléchargez les photos du véhicule</li>
              <li>Ajoutez les documents (carte grise, etc.)</li>
              <li>Enregistrez le véhicule</li>
            </ol>
          </div>
        )
      },
      {
        question: "Comment modifier le statut d'un véhicule ?",
        answer: (
          <div className="space-y-4">
            <p>Pour changer le statut d'un véhicule :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Cliquez sur le véhicule dans la liste</li>
              <li>Sélectionnez <strong>"Modifier"</strong></li>
              <li>Dans l'onglet statut, choisissez le nouveau statut :</li>
            </ol>
            <ul className="list-disc list-inside space-y-1 ml-8">
              <li><strong>En attente</strong> : Véhicule en attente de prise en charge</li>
              <li><strong>En cours</strong> : Véhicule en réparation</li>
              <li><strong>Terminé</strong> : Réparation terminée</li>
              <li><strong>Réservé</strong> : Véhicule réservé</li>
              <li><strong>Annulé</strong> : Intervention annulée</li>
            </ul>
          </div>
        )
      },
      {
        question: "Comment ajouter des photos à un véhicule ?",
        answer: (
          <div className="space-y-4">
            <p>Pour ajouter des photos :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Ouvrez la fiche du véhicule</li>
              <li>Cliquez sur <strong>"Modifier"</strong></li>
              <li>Dans l'onglet "Documents", section "Photos du véhicule"</li>
              <li>Cliquez sur <strong>"Ajouter une photo"</strong></li>
              <li>Sélectionnez l'image depuis votre appareil</li>
              <li>Ajoutez une description si nécessaire</li>
              <li>Enregistrez les modifications</li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    id: "documents",
    title: "Documents",
    icon: <FileText className="h-5 w-5" />,
    items: [
      {
        question: "Quels types de documents puis-je créer ?",
        answer: (
          <div className="space-y-4">
            <p>L'application permet de créer plusieurs types de documents :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Devis</strong> : Estimation des coûts de réparation</li>
              <li><strong>Ordres de réparation</strong> : Instructions de travail</li>
              <li><strong>Factures</strong> : Facturation des prestations</li>
              <li><strong>Avoirs</strong> : Notes de crédit</li>
              <li><strong>Rapports d'expertise</strong> : Documents d'expertise technique</li>
            </ul>
            <p className="text-sm text-muted-foreground">Chaque type de document a ses propres champs et peut être personnalisé selon vos besoins.</p>
          </div>
        )
      },
      {
        question: "Comment importer un rapport d'expertise ?",
        answer: (
          <div className="space-y-4">
            <p>Pour importer un rapport d'expertise :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Allez dans <strong>Documents {'>'} Rapports d'expertise</strong></li>
              <li>Cliquez sur <strong>"Importer un rapport"</strong></li>
              <li>Sélectionnez votre fichier (PDF, JPEG, PNG jusqu'à 10MB) :</li>
              <ul className="list-disc list-inside space-y-1 ml-8">
                <li>Cliquez pour parcourir vos fichiers</li>
                <li>Ou glissez-déposez directement le fichier</li>
              </ul>
              <li>Cliquez sur <strong>"Importer"</strong></li>
              <li>L'IA analysera automatiquement le document</li>
              <li>Le rapport sera traité et ajouté à votre liste</li>
            </ol>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Note :</strong> L'analyse par IA extrait automatiquement les informations importantes du rapport (clients, véhicules, dommages, etc.) pour faciliter la création de devis.</p>
            </div>
          </div>
        )
      },
      {
        question: "Comment créer un devis ?",
        answer: (
          <div className="space-y-4">
            <p>Pour créer un devis :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Allez dans <strong>Documents {'>'} Devis</strong></li>
              <li>Cliquez sur <strong>"Nouveau devis"</strong></li>
              <li>Sélectionnez le client et le véhicule</li>
              <li>Ajoutez les réparations nécessaires avec les prix</li>
              <li>Ajoutez les pièces requises</li>
              <li>Appliquez des remises si nécessaire</li>
              <li>Vérifiez les totaux et enregistrez</li>
            </ol>
            <p className="text-sm text-muted-foreground">Le devis peut ensuite être envoyé par email au client directement depuis l'application.</p>
          </div>
        )
      },
      {
        question: "Comment envoyer un devis par email ?",
        answer: (
          <div className="space-y-4">
            <p>Pour envoyer un devis par email :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Ouvrez le devis dans la liste</li>
              <li>Cliquez sur le bouton <strong>"Envoyer par email"</strong></li>
              <li>Vérifiez l'adresse email du destinataire</li>
              <li>Personnalisez le message si nécessaire</li>
              <li>Cliquez sur <strong>"Envoyer"</strong></li>
            </ol>
            <p className="text-sm text-muted-foreground">Le devis sera automatiquement joint au message en format PDF.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "payments",
    title: "Paiements",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      {
        question: "Comment enregistrer un encaissement ?",
        answer: (
          <div className="space-y-4">
            <p>Pour enregistrer un paiement reçu :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Allez dans <strong>Paiements {'>'} Encaissements</strong></li>
              <li>Cliquez sur <strong>"Nouvel encaissement"</strong></li>
              <li>Sélectionnez le client</li>
              <li>Choisissez le mode de paiement (espèces, chèque, virement, carte)</li>
              <li>Saisissez le montant</li>
              <li>Ajoutez une référence si nécessaire</li>
              <li>Enregistrez l'encaissement</li>
            </ol>
          </div>
        )
      },
      {
        question: "Comment gérer les dépenses ?",
        answer: (
          <div className="space-y-4">
            <p>Pour enregistrer une dépense :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Allez dans <strong>Paiements {'>'} Dépenses</strong></li>
              <li>Cliquez sur <strong>"Nouvelle dépense"</strong></li>
              <li>Sélectionnez la catégorie de dépense</li>
              <li>Saisissez le montant et la description</li>
              <li>Ajoutez la date et le fournisseur</li>
              <li>Téléchargez le justificatif si disponible</li>
              <li>Enregistrez la dépense</li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    id: "planning",
    title: "Planning",
    icon: <ClipboardList className="h-5 w-5" />,
    items: [
      {
        question: "Comment utiliser le planning ?",
        answer: (
          <div className="space-y-4">
            <p>Le planning vous permet d'organiser votre travail :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Visualisez les interventions planifiées</li>
              <li>Organisez les créneaux horaires</li>
              <li>Assignez les véhicules aux équipes</li>
              <li>Suivez l'avancement des travaux</li>
            </ul>
            <p className="text-sm text-muted-foreground">Le planning se synchronise automatiquement avec les ordres de réparation.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "ai-assistant",
    title: "Assistant IA",
    icon: <Bot className="h-5 w-5" />,
    items: [
      {
        question: "Comment utiliser l'assistant IA ?",
        answer: (
          <div className="space-y-4">
            <p>L'assistant IA vous aide dans vos tâches quotidiennes :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Accédez à l'assistant via le menu <strong>"Assistant IA"</strong></li>
              <li>Posez vos questions en langage naturel</li>
              <li>Demandez de l'aide pour la navigation</li>
              <li>Obtenez des suggestions d'optimisation</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "settings",
    title: "Paramètres",
    icon: <Wrench className="h-5 w-5" />,
    items: [
      {
        question: "Comment configurer mon profil ?",
        answer: (
          <div className="space-y-4">
            <p>Pour modifier vos informations personnelles :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Cliquez sur <strong>Profil</strong> dans le menu</li>
              <li>Modifiez vos informations (nom, email, téléphone)</li>
              <li>Changez votre mot de passe si nécessaire</li>
              <li>Enregistrez les modifications</li>
            </ol>
          </div>
        )
      },
      {
        question: "Comment accéder aux paramètres généraux ?",
        answer: (
          <div className="space-y-4">
            <p>Les paramètres généraux sont accessibles via :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Le menu <strong>Paramètres</strong> dans la navigation</li>
              <li>Configuration des préférences d'affichage</li>
              <li>Paramétrage des notifications</li>
              <li>Gestion des utilisateurs (si administrateur)</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "context-menus",
    title: "Menus contextuels et actions",
    icon: <MoreVertical className="h-5 w-5" />,
    items: [
      {
        question: "Comment utiliser les menus d'actions sur les clients ?",
        answer: (
          <div className="space-y-4">
            <p>Sur la page des clients, chaque ligne dispose d'un menu d'actions (trois points) qui permet :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Voir</strong> : Consulter les détails du client (icône œil)</li>
              <li><strong>Modifier</strong> : Éditer les informations du client (icône crayon)</li>
              <li><strong>Supprimer</strong> : Effacer le client (icône poubelle)</li>
              <li><strong>Créer un devis</strong> : Générer un nouveau devis pour ce client</li>
              <li><strong>Créer une facture</strong> : Établir une facture pour ce client</li>
              <li><strong>Créer un avoir</strong> : Émettre un avoir/note de crédit</li>
            </ul>
            <p className="text-sm text-muted-foreground">Cliquez sur les trois points verticaux à droite de chaque ligne pour accéder à ces options.</p>
          </div>
        )
      },
      {
        question: "Comment utiliser les menus d'actions sur les véhicules ?",
        answer: (
          <div className="space-y-4">
            <p>Sur la page des véhicules, chaque carte de véhicule propose :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Voir</strong> : Consulter les détails du véhicule (icône œil)</li>
              <li><strong>Modifier</strong> : Éditer les informations du véhicule (icône crayon)</li>
              <li><strong>Supprimer</strong> : Effacer le véhicule (icône poubelle)</li>
            </ul>
            <p>Dans le menu contextuel (trois points) :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Créer un devis</strong> : Générer un devis pour les réparations</li>
              <li><strong>Créer une facture</strong> : Établir une facture pour ce véhicule</li>
            </ul>
          </div>
        )
      },
      {
        question: "Comment utiliser les menus d'actions sur les documents ?",
        answer: (
          <div className="space-y-4">
            <p>Les documents (devis, factures, avoirs) disposent d'actions spécifiques :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Télécharger</strong> : Sauvegarder le document en PDF</li>
              <li><strong>Imprimer</strong> : Lancer l'impression du document</li>
              <li><strong>Envoyer par email</strong> : Expédier le document au client</li>
              <li><strong>Modifier</strong> : Éditer le contenu du document</li>
              <li><strong>Dupliquer</strong> : Créer une copie du document</li>
              <li><strong>Marquer comme payé</strong> : Pour les factures impayées</li>
              <li><strong>Supprimer</strong> : Effacer définitivement le document</li>
            </ul>
            <p className="text-sm text-muted-foreground">Les actions disponibles varient selon le type de document et son statut.</p>
          </div>
        )
      },
      {
        question: "Comment utiliser les filtres et la recherche ?",
        answer: (
          <div className="space-y-4">
            <p>Chaque page principale dispose d'outils de recherche et de filtrage :</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Barre de recherche :</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Tapez directement dans le champ de recherche</li>
                <li>La recherche s'effectue en temps réel</li>
                <li>Fonctionne sur les champs principaux (nom, email, immatriculation, etc.)</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Filtres avancés :</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Cliquez sur l'icône filtre pour ouvrir les options</li>
                <li>Filtrez par statut, date, type, etc.</li>
                <li>Combinez plusieurs filtres pour affiner les résultats</li>
                <li>Réinitialisez les filtres avec le bouton "Effacer"</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        question: "Comment utiliser les actions en lot ?",
        answer: (
          <div className="space-y-4">
            <p>Certaines pages permettent d'effectuer des actions sur plusieurs éléments :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Cochez les cases à gauche des éléments à sélectionner</li>
              <li>Une barre d'actions apparaît en haut</li>
              <li>Choisissez l'action à effectuer :</li>
            </ol>
            <ul className="list-disc list-inside space-y-1 ml-8">
              <li><strong>Exporter</strong> : Télécharger les données sélectionnées</li>
              <li><strong>Archiver</strong> : Archiver plusieurs éléments</li>
              <li><strong>Supprimer</strong> : Effacer en lot (avec confirmation)</li>
              <li><strong>Changer le statut</strong> : Modifier le statut de plusieurs éléments</li>
            </ul>
            <p className="text-sm text-muted-foreground">Utilisez "Sélectionner tout" pour traiter l'ensemble des résultats visibles.</p>
          </div>
        )
      }
    ]
  }
];