import React from 'react';
import { Rocket, Users, Car, Wrench, FileText, CreditCard, Truck, ClipboardList, DollarSign, Bot } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
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
        answer: "Utilisez vos identifiants fournis lors de l'inscription. Cliquez sur 'Se connecter' et saisissez votre email et mot de passe. Si vous avez oublié votre mot de passe, utilisez le lien 'Mot de passe oublié' pour le réinitialiser. Vous recevrez un email avec les instructions détaillées pour créer un nouveau mot de passe sécurisé. Assurez-vous que votre navigateur accepte les cookies pour maintenir votre session active. Si vous rencontrez des difficultés persistantes, vérifiez que votre compte n'est pas temporairement bloqué après plusieurs tentatives de connexion infructueuses."
      },
      {
        question: "Comment naviguer dans l'interface ?",
        answer: "L'application est organisée en modules accessibles via le menu latéral : Tableau de bord (vue d'ensemble), Clients (gestion des clients), Véhicules (parc automobile), Documents (devis, factures, ordres), Cessions (créances), Comptabilité (finances). Chaque section a ses propres fonctionnalités et filtres. Sur mobile, utilisez le bouton menu en haut à gauche pour accéder à la navigation."
      },
      {
        question: "Comment personnaliser mon profil ?",
        answer: "Rendez-vous dans 'Paramètres' > 'Profil' pour modifier vos informations personnelles : nom, prénom, email, téléphone. Vous pouvez également changer votre mot de passe, configurer vos préférences d'affichage (thème clair/sombre), et définir vos notifications. N'oubliez pas de sauvegarder vos changements."
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
        answer: "Allez dans 'Clients' puis cliquez sur '+ Nouveau client'. Remplissez les informations obligatoires : nom, prénom, email, téléphone. Vous pouvez ajouter l'adresse complète (rue, ville, code postal), des notes personnalisées et des documents (permis de conduire recto/verso). Une fois toutes les informations saisies, cliquez sur 'Enregistrer'. Le client apparaîtra immédiatement dans votre liste."
      },
      {
        question: "Comment modifier un client existant ?",
        answer: "Dans la liste des clients, cliquez sur l'icône crayon (éditer) à droite de la ligne du client. Modifiez les informations nécessaires dans le formulaire qui s'ouvre. Vous pouvez aussi accéder à la fiche complète en cliquant sur le nom du client pour voir l'historique des interventions, factures et véhicules associés. Pensez à sauvegarder vos modifications."
      },
      {
        question: "Comment rechercher un client ?",
        answer: "Utilisez la barre de recherche en haut de la liste des clients. Vous pouvez rechercher par nom, prénom, email, téléphone ou même par fragments de ces informations. Les filtres avancés permettent de trier par type de client (particulier/professionnel), statut (actif/inactif), ou date de création. La recherche est instantanée et met à jour la liste en temps réel."
      },
      {
        question: "Comment ajouter des documents au dossier client ?",
        answer: "Dans la fiche client, onglet 'Documents', vous pouvez uploader le permis de conduire (recto/verso obligatoire), carte d'identité, justificatif de domicile et d'autres documents utiles. Les formats acceptés sont PDF, JPEG, PNG (max 10Mo par fichier). Chaque document peut être renommé et catégorisé pour un meilleur classement. L'historique des documents est conservé avec dates d'ajout."
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
        answer: "Dans 'Véhicules', cliquez sur '+ Nouveau véhicule'. Associez-le obligatoirement à un client existant via le menu déroulant. Renseignez les informations de base : marque, modèle, année, plaque d'immatriculation. Le numéro VIN (17 caractères) permet un remplissage automatique des informations techniques. Ajoutez des photos du véhicule, l'état du carburant, et les documents (carte grise). Sauvegardez pour finaliser l'ajout."
      },
      {
        question: "Comment fonctionne le décodage VIN automatique ?",
        answer: "Saisissez un numéro VIN de 17 caractères valide dans le champ prévu. L'application vérifie automatiquement le format et décode la marque, le modèle et l'année de fabrication grâce à notre API intégrée qui reconnaît plus de 500 codes constructeurs mondiaux. Si le VIN n'est pas reconnu, vous pouvez saisir manuellement les informations. Le décodage fonctionne pour les véhicules de 1980 à aujourd'hui."
      },
      {
        question: "Quelles informations puis-je enregistrer pour un véhicule ?",
        answer: "Informations techniques : marque, modèle, année, VIN, plaque d'immatriculation, couleur, type de carburant, kilométrage, puissance. Documents : carte grise recto/verso, photos du véhicule (jusqu'à 10 photos), contrat d'achat. Informations d'assurance : compagnie, numéro de police, date d'expiration. Vous pouvez aussi suivre l'historique complet des interventions, réparations et factures associées au véhicule."
      },
      {
        question: "Comment associer un véhicule à un client ?",
        answer: "Lors de la création du véhicule, sélectionnez le client dans la liste déroulante 'Propriétaire'. Si le client n'existe pas encore, créez-le d'abord via le bouton 'Nouveau client'. Un client peut posséder plusieurs véhicules - ils apparaîtront tous dans sa fiche. Vous pouvez modifier l'association à tout moment en éditant la fiche véhicule. L'historique des changements de propriétaire est conservé."
      }
    ]
  },
  {
    id: "repair-orders",
    title: "Ordres de réparation",
    icon: <Wrench className="h-5 w-5" />,
    items: [
      {
        question: "Comment créer un ordre de réparation ?",
        answer: "Dans 'Documents' > 'Ordres de réparation', cliquez sur 'Nouvel ordre'. Sélectionnez le client et le véhicule concerné. Ajoutez les réparations nécessaires avec descriptions détaillées, quantités, prix unitaires et temps de main-d'œuvre. Vous pouvez aussi ajouter des pièces détachées avec références fournisseur. Le système calcule automatiquement les sous-totaux, TVA et total TTC. Définissez les dates prévisionnelles de début et fin d'intervention."
      },
      {
        question: "Comment ajouter des réparations et pièces ?",
        answer: "Dans l'ordre de réparation, utilisez les sections 'Réparations' et 'Pièces détachées'. Pour chaque ligne de réparation, indiquez la description précise, le nombre d'heures, le taux horaire. Pour les pièces, renseignez la référence, la description, la quantité, le prix unitaire HT. Vous pouvez appliquer des remises par ligne ou globales. Les calculs (sous-total, TVA à 20%, total TTC) se font automatiquement. Sauvegardez régulièrement votre travail."
      },
      {
        question: "Comment gérer les statuts des ordres ?",
        answer: "Les statuts disponibles sont : 'En attente' (ordre créé), 'En cours' (travaux commencés), 'Terminé' (travaux finis), 'Facturé' (ordre converti en facture), 'Annulé'. Changez le statut selon l'avancement des travaux via le menu déroulant en haut de l'ordre. Un ordre 'Terminé' peut être converti en facture directement. Les notifications automatiques informent le client des changements de statut."
      },
      {
        question: "Comment convertir un ordre en facture ?",
        answer: "Dans la liste des ordres, cliquez sur l'action 'Convertir en facture' pour un ordre avec le statut 'Terminé'. Toutes les informations (client, véhicule, réparations, pièces, montants) sont reprises automatiquement dans la nouvelle facture. Vous pouvez modifier les éléments si nécessaire avant la génération finale. La facture reçoit automatiquement un numéro séquentiel et la date du jour. L'ordre original reste accessible pour traçabilité."
      }
    ]
  },
  {
    id: "quotes-invoices",
    title: "Devis et factures",
    icon: <FileText className="h-5 w-5" />,
    items: [
      {
        question: "Comment créer un devis ?",
        answer: (
          <div className="space-y-3">
            <p>Pour créer un nouveau devis :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez au menu "Documents" puis "Devis"</li>
              <li>Cliquez sur le bouton "+ Nouveau devis"</li>
              <li>Sélectionnez le client concerné dans la liste déroulante</li>
              <li>Choisissez le véhicule associé au devis</li>
              <li>Ajoutez les prestations : description, quantité, prix unitaire</li>
              <li>Définissez la date de validité (généralement 30 jours)</li>
              <li>Précisez les conditions de paiement</li>
              <li>Sauvegardez votre devis</li>
            </ol>
            <p>Le système calcule automatiquement les totaux HT, TVA et TTC. Le devis reçoit automatiquement un numéro de référence unique.</p>
          </div>
        )
      },
      {
        question: "Comment créer un devis à partir de la fiche d'un client ?",
        answer: (
          <div className="space-y-3">
            <p>Depuis la fiche client, vous pouvez créer directement un devis :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Ouvrez la fiche du client concerné</li>
              <li>Allez dans l'onglet "Devis"</li>
              <li>Cliquez sur "+ Nouveau devis"</li>
              <li>Le client est automatiquement présélectionné</li>
              <li>Sélectionnez le véhicule parmi ceux du client</li>
              <li>Remplissez les prestations et conditions</li>
              <li>Sauvegardez le devis</li>
            </ol>
            <p>Cette méthode est plus rapide car les informations client sont déjà renseignées.</p>
          </div>
        )
      },
      {
        question: "Comment créer une facture à partir de la fiche d'un client ?",
        answer: (
          <div className="space-y-3">
            <p>Créer une facture directement depuis la fiche client :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la fiche du client</li>
              <li>Naviguez vers l'onglet "Factures"</li>
              <li>Cliquez sur "+ Nouvelle facture"</li>
              <li>Le client est automatiquement sélectionné</li>
              <li>Choisissez le véhicule concerné</li>
              <li>Ajoutez les prestations réalisées</li>
              <li>Définissez les conditions de paiement</li>
              <li>Validez et générez la facture</li>
            </ol>
            <p>La facture est immédiatement disponible pour envoi ou impression.</p>
          </div>
        )
      },
      {
        question: "Comment créer un avoir à partir de la fiche d'un client ?",
        answer: (
          <div className="space-y-3">
            <p>Pour créer un avoir depuis la fiche client :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Ouvrez la fiche du client</li>
              <li>Allez dans l'onglet "Factures"</li>
              <li>Localisez la facture concernée</li>
              <li>Cliquez sur le menu d'actions (⋮) de la facture</li>
              <li>Sélectionnez "Ajouter un avoir"</li>
              <li>Précisez le montant et la raison</li>
              <li>Validez la création de l'avoir</li>
            </ol>
            <p>L'avoir est automatiquement lié à la facture originale et impacte la comptabilité.</p>
          </div>
        )
      },
      {
        question: "Comment créer un devis à partir de la fiche d'un véhicule ?",
        answer: (
          <div className="space-y-3">
            <p>Depuis la fiche véhicule :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la fiche du véhicule</li>
              <li>Cliquez sur l'onglet "Documents" ou "Devis"</li>
              <li>Sélectionnez "+ Nouveau devis"</li>
              <li>Le véhicule et son propriétaire sont pré-remplis</li>
              <li>Ajoutez les réparations spécifiques au véhicule</li>
              <li>Renseignez les conditions commerciales</li>
              <li>Enregistrez le devis</li>
            </ol>
            <p>Cette approche est idéale pour les interventions spécifiques à un véhicule donné.</p>
          </div>
        )
      },
      {
        question: "Comment créer une facture à partir de la fiche d'un véhicule ?",
        answer: (
          <div className="space-y-3">
            <p>Création d'une facture depuis la fiche véhicule :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Ouvrez la fiche du véhicule</li>
              <li>Accédez à l'onglet "Factures" ou "Documents"</li>
              <li>Cliquez sur "+ Nouvelle facture"</li>
              <li>Le véhicule et le propriétaire sont automatiquement sélectionnés</li>
              <li>Listez les travaux effectués sur le véhicule</li>
              <li>Ajoutez les pièces utilisées si nécessaire</li>
              <li>Finalisez et sauvegardez la facture</li>
            </ol>
            <p>Particulièrement utile pour facturer les interventions terminées sur un véhicule spécifique.</p>
          </div>
        )
      },
      {
        question: "Comment créer un devis à partir de la fiche d'un rapport d'expertise ?",
        answer: (
          <div className="space-y-3">
            <p>Créer un devis basé sur un rapport d'expertise :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Ouvrez le rapport d'expertise concerné</li>
              <li>Vérifiez les dommages et réparations listés</li>
              <li>Cliquez sur "Créer un devis" depuis le rapport</li>
              <li>Les informations du véhicule et client sont importées</li>
              <li>Les réparations recommandées sont pré-remplies</li>
              <li>Ajustez les prix et quantités si nécessaire</li>
              <li>Validez le devis</li>
            </ol>
            <p>Cette fonctionnalité permet un gain de temps considérable en reprenant automatiquement les éléments de l'expertise.</p>
          </div>
        )
      },
      {
        question: "Comment télécharger un devis ?",
        answer: (
          <div className="space-y-3">
            <p>Pour télécharger un devis au format PDF :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la liste des devis ou à un devis spécifique</li>
              <li>Cliquez sur le menu d'actions (⋮) du devis</li>
              <li>Sélectionnez "Télécharger"</li>
              <li>Le PDF se génère automatiquement</li>
              <li>Le fichier est téléchargé dans votre dossier de téléchargements</li>
            </ol>
            <p>Le PDF contient toutes les informations : logo entreprise, détails client, prestations, totaux et conditions.</p>
          </div>
        )
      },
      {
        question: "Comment imprimer un devis ?",
        answer: (
          <div className="space-y-3">
            <p>Pour imprimer un devis :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Depuis la liste des devis, localisez le devis à imprimer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Imprimer"</li>
              <li>La boîte de dialogue d'impression de votre navigateur s'ouvre</li>
              <li>Configurez vos options d'impression (format, qualité)</li>
              <li>Lancez l'impression</li>
            </ol>
            <p>Vous pouvez également prévisualiser le document avant impression pour vérifier la mise en page.</p>
          </div>
        )
      },
      {
        question: "Comment envoyer un devis par e-mail ?",
        answer: (
          <div className="space-y-3">
            <p>Envoi d'un devis par email :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Dans la liste des devis, sélectionnez le devis à envoyer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Envoyer par e-mail"</li>
              <li>L'adresse email du client est pré-remplie</li>
              <li>Personnalisez l'objet et le message si nécessaire</li>
              <li>Vérifiez le contenu et cliquez sur "Envoyer"</li>
            </ol>
            <p>Le devis est automatiquement généré en PDF et joint à l'email. Un accusé de réception confirme l'envoi.</p>
          </div>
        )
      },
      {
        question: "Comment demander les justificatifs à un client ?",
        answer: (
          <div className="space-y-3">
            <p>Pour demander des justificatifs à un client :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez au devis concerné</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Demander les justificatifs"</li>
              <li>Un email automatique est préparé</li>
              <li>Personnalisez le message selon vos besoins</li>
              <li>Spécifiez les documents requis</li>
              <li>Envoyez la demande au client</li>
            </ol>
            <p>Cette fonction facilite la collecte des documents nécessaires (permis, carte grise, constat, etc.) avant le début des travaux.</p>
          </div>
        )
      },
      {
        question: "Comment convertir un devis en ordre de réparation ?",
        answer: (
          <div className="space-y-3">
            <p>Conversion d'un devis accepté en ordre de réparation :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Ouvrez le devis validé par le client</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Convertir en ordre de réparation"</li>
              <li>Toutes les informations sont automatiquement transférées</li>
              <li>Ajustez les détails techniques si nécessaire</li>
              <li>Définissez les dates prévisionnelles d'intervention</li>
              <li>Sauvegardez l'ordre de réparation</li>
            </ol>
            <p>L'ordre de réparation reprend tous les éléments du devis : client, véhicule, prestations et montants.</p>
          </div>
        )
      },
      {
        question: "Comment télécharger un ordre de réparation ?",
        answer: (
          <div className="space-y-3">
            <p>Téléchargement d'un ordre de réparation :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la liste des ordres de réparation</li>
              <li>Localisez l'ordre souhaité</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Télécharger"</li>
              <li>Le PDF se génère avec tous les détails techniques</li>
              <li>Le fichier est sauvegardé sur votre appareil</li>
            </ol>
            <p>Le document PDF contient les instructions détaillées pour les techniciens et peut être utilisé en atelier.</p>
          </div>
        )
      },
      {
        question: "Comment imprimer un ordre de réparation ?",
        answer: (
          <div className="space-y-3">
            <p>Impression d'un ordre de réparation :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Dans la liste des ordres, sélectionnez l'ordre à imprimer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Imprimer"</li>
              <li>La boîte de dialogue d'impression s'ouvre</li>
              <li>Sélectionnez vos préférences d'impression</li>
              <li>Lancez l'impression</li>
            </ol>
            <p>L'ordre imprimé peut être utilisé directement en atelier par les techniciens pour suivre les interventions.</p>
          </div>
        )
      },
      {
        question: "Comment envoyer un ordre de réparation par e-mail ?",
        answer: (
          <div className="space-y-3">
            <p>Envoi d'un ordre de réparation par email :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Sélectionnez l'ordre de réparation concerné</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Envoyer par e-mail"</li>
              <li>L'adresse du client est automatiquement renseignée</li>
              <li>Adaptez le message selon le contexte</li>
              <li>Envoyez l'ordre avec le PDF joint</li>
            </ol>
            <p>Utile pour tenir le client informé de l'avancement des travaux ou lui transmettre les détails de l'intervention.</p>
          </div>
        )
      },
      {
        question: "Comment convertir un ordre de réparation en facture ?",
        answer: (
          <div className="space-y-3">
            <p>Conversion d'un ordre terminé en facture :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à l'ordre de réparation avec le statut "Terminé"</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Convertir en facture"</li>
              <li>Toutes les prestations réalisées sont reprises</li>
              <li>Vérifiez et ajustez les montants si nécessaire</li>
              <li>Définissez les conditions de paiement</li>
              <li>Générez la facture finale</li>
            </ol>
            <p>La facture reprend automatiquement tous les éléments de l'ordre : travaux, pièces, main-d'œuvre et totaux.</p>
          </div>
        )
      },
      {
        question: "Comment télécharger une facture ?",
        answer: (
          <div className="space-y-3">
            <p>Téléchargement d'une facture au format PDF :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la liste des factures</li>
              <li>Localisez la facture souhaitée</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Télécharger"</li>
              <li>Le PDF est généré avec toutes les mentions légales</li>
              <li>Le fichier est enregistré sur votre appareil</li>
            </ol>
            <p>Le PDF de facture contient toutes les informations légales requises et peut être archivé ou transmis à votre comptable.</p>
          </div>
        )
      },
      {
        question: "Comment imprimer une facture ?",
        answer: (
          <div className="space-y-3">
            <p>Impression d'une facture :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Dans la liste des factures, sélectionnez la facture à imprimer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Imprimer"</li>
              <li>La boîte de dialogue d'impression s'affiche</li>
              <li>Configurez le format et la qualité d'impression</li>
              <li>Procédez à l'impression</li>
            </ol>
            <p>L'impression produit un document conforme aux exigences légales de facturation.</p>
          </div>
        )
      },
      {
        question: "Comment envoyer une facture par e-mail ?",
        answer: (
          <div className="space-y-3">
            <p>Envoi d'une facture par email :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Sélectionnez la facture à envoyer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Envoyer par e-mail"</li>
              <li>L'adresse email du client est pré-remplie</li>
              <li>Personnalisez l'objet et le message</li>
              <li>Vérifiez et envoyez</li>
            </ol>
            <p>La facture PDF est automatiquement jointe à l'email. Un accusé de réception confirme la bonne réception par le client.</p>
          </div>
        )
      },
      {
        question: "Comment ajouter un paiement depuis une facture ?",
        answer: (
          <div className="space-y-3">
            <p>Enregistrement d'un paiement :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Ouvrez la facture concernée</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Ajouter un paiement"</li>
              <li>Choisissez le mode de paiement (espèces, carte, virement, chèque)</li>
              <li>Saisissez le montant encaissé</li>
              <li>Ajoutez une référence (numéro de chèque, transaction)</li>
              <li>Validez l'encaissement</li>
            </ol>
            <p>Le statut de la facture se met automatiquement à jour. Pour les paiements partiels, le solde restant dû est affiché.</p>
          </div>
        )
      },
      {
        question: "Comment ajouter un avoir depuis une facture ?",
        answer: (
          <div className="space-y-3">
            <p>Création d'un avoir depuis une facture :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la facture concernée</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Ajouter un avoir"</li>
              <li>Précisez le montant à créditer</li>
              <li>Indiquez la raison (défaut, annulation, geste commercial)</li>
              <li>Ajoutez des commentaires si nécessaire</li>
              <li>Générez l'avoir</li>
            </ol>
            <p>L'avoir est automatiquement lié à la facture originale et impacte les statistiques comptables.</p>
          </div>
        )
      },
      {
        question: "Comment télécharger un avoir ?",
        answer: (
          <div className="space-y-3">
            <p>Téléchargement d'un avoir :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Accédez à la liste des avoirs</li>
              <li>Localisez l'avoir souhaité</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Sélectionnez "Télécharger"</li>
              <li>Le PDF de l'avoir est généré</li>
              <li>Le fichier est sauvegardé sur votre appareil</li>
            </ol>
            <p>Le document PDF de l'avoir contient toutes les informations légales et peut être transmis au client.</p>
          </div>
        )
      },
      {
        question: "Comment imprimer un avoir ?",
        answer: (
          <div className="space-y-3">
            <p>Impression d'un avoir :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Dans la liste des avoirs, sélectionnez l'avoir à imprimer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Imprimer"</li>
              <li>La boîte de dialogue d'impression s'ouvre</li>
              <li>Configurez vos options d'impression</li>
              <li>Lancez l'impression</li>
            </ol>
            <p>L'avoir imprimé respecte les normes comptables et peut être archivé avec vos documents comptables.</p>
          </div>
        )
      },
      {
        question: "Comment envoyer un avoir par e-mail ?",
        answer: (
          <div className="space-y-3">
            <p>Envoi d'un avoir par email :</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Sélectionnez l'avoir à envoyer</li>
              <li>Cliquez sur le menu d'actions (⋮)</li>
              <li>Choisissez "Envoyer par e-mail"</li>
              <li>L'adresse du client est automatiquement renseignée</li>
              <li>Rédigez un message explicatif</li>
              <li>Envoyez l'avoir avec le PDF joint</li>
            </ol>
            <p>Le client reçoit l'avoir en PDF, lui permettant de justifier le crédit accordé dans sa comptabilité.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "cessions",
    title: "Cessions de créance",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      {
        question: "Qu'est-ce qu'une cession de créance ?",
        answer: "La cession de créance permet à votre client de vous céder ses droits au remboursement d'assurance. Concrètement : au lieu que l'assurance rembourse le client qui vous règle ensuite, l'assurance vous paie directement. Cela améliore votre trésorerie en évitant les délais de paiement clients et réduit les risques d'impayés. C'est un mécanisme légal très utilisé dans l'automobile, encadré par le Code des assurances."
      },
      {
        question: "Comment créer une cession de créance ?",
        answer: "Dans 'Cession de créance', cliquez sur 'Nouvelle cession'. Sélectionnez un ordre de réparation existant (statut 'Terminé' requis), les informations client/véhicule/montant sont automatiquement récupérées. Renseignez les détails de l'assurance : compagnie, numéro de sinistre, expert. Générez les documents légaux nécessaires (lettre de cession, bordereau). Le client doit signer la cession pour qu'elle soit valide juridiquement."
      },
      {
        question: "Quels sont les statuts d'une cession ?",
        answer: "Les statuts suivent le processus complet : 'En attente' (cession créée, signature client en cours), 'Envoyée' (transmise à l'assurance avec tous les documents), 'Acceptée' (validée par l'assurance, paiement programmé), 'Payée' (encaissement effectué), 'Rejetée' (refusée par l'assurance, raison indiquée). Chaque changement de statut est horodaté pour traçabilité complète du dossier."
      },
      {
        question: "Comment suivre l'avancement des cessions ?",
        answer: "Le tableau de bord des cessions affiche toutes vos demandes avec leurs statuts en temps réel. Vous pouvez filtrer par statut, client, assurance ou période pour suivre l'évolution de vos dossiers. Des alertes automatiques vous préviennent des cessions en retard ou nécessitant une action. Un graphique montre l'évolution mensuelle des cessions et les délais moyens de paiement par assurance. Export Excel disponible pour reporting."
      }
    ]
  },
  {
    id: "fleet",
    title: "Véhicules de courtoisie",
    icon: <Truck className="h-5 w-5" />,
    items: [
      {
        question: "Comment gérer ma flotte de véhicules de courtoisie ?",
        answer: "Dans 'Véhicules de courtoisie', ajoutez vos véhicules de prêt avec leurs caractéristiques complètes : marque, modèle, immatriculation, année, kilométrage, état général. Définissez les tarifs de location si applicable, les conditions d'utilisation, les restrictions (âge minimum du conducteur, permis requis). Vous pouvez suivre leur disponibilité en temps réel, planifier leur maintenance et gérer les contrats de prêt avec états des lieux détaillés."
      },
      {
        question: "Comment faire une réservation de véhicule ?",
        answer: "Créez une nouvelle réservation en sélectionnant le client concerné, le véhicule disponible sur la période souhaitée et les dates de prêt (début/fin). Le système vérifie automatiquement les disponibilités et les conflits. Définissez les conditions particulières (franchise, utilisation autorisée). Le contrat de prêt se génère automatiquement avec état des lieux d'entrée à compléter lors de la remise des clés. Signature électronique possible."
      },
      {
        question: "Comment gérer les retours de véhicules ?",
        answer: "Lors du retour, accédez à la réservation active et complétez l'état des lieux de sortie : kilométrage final, niveau de carburant, dommages éventuels avec photos. Comparez avec l'état d'entrée pour identifier les différences. Notez les éventuels dommages avec estimation des coûts de remise en état. Une fois validé, le véhicule redevient automatiquement disponible pour de nouvelles réservations. Facturation automatique des frais supplémentaires si nécessaire."
      }
    ]
  },
  {
    id: "expertise",
    title: "Rapports d'expertise",
    icon: <ClipboardList className="h-5 w-5" />,
    items: [
      {
        question: "Comment importer un rapport d'expertise ?",
        answer: "Dans 'Documents' > 'Rapports d'expertise', utilisez l'outil d'import pour télécharger les rapports PDF envoyés par les experts. L'application utilise la reconnaissance optique (OCR) pour extraire automatiquement les informations principales : numéro de sinistre, montant des dommages, détail des réparations, expert signataire. Les données extraites sont associées automatiquement aux véhicules et clients concernés si ils existent dans votre base."
      },
      {
        question: "Comment traiter un rapport d'expertise ?",
        answer: "Une fois importé, vérifiez les informations extraites automatiquement dans l'onglet 'Détails'. Corrigez si nécessaire les montants, descriptions de dommages, références des pièces. Associez manuellement le rapport au bon client et véhicule si l'association automatique a échoué. Renseignez les données complémentaires : expert, compagnie d'assurance, date de sinistre, statut du dossier. Ajoutez vos commentaires et observations personnelles."
      },
      {
        question: "Comment suivre le statut des expertises ?",
        answer: "Les statuts disponibles sont : 'Importé' (rapport reçu), 'En cours d'analyse' (étude en cours), 'En attente' (informations manquantes), 'Validé' (expertise acceptée, travaux autorisés), 'Rejeté' (expertise refusée, raison indiquée), 'Facturé' (travaux terminés et facturés). Modifiez le statut selon l'avancement du dossier. Des rappels automatiques alertent sur les dossiers en attente. Statistiques des délais de traitement par expert disponibles."
      }
    ]
  },
  {
    id: "payments",
    title: "Paiements et comptabilité",
    icon: <DollarSign className="h-5 w-5" />,
    items: [
      {
        question: "Comment enregistrer un encaissement ?",
        answer: "Dans 'Paiements' > 'Encaissements', créez un nouveau reçu en sélectionnant la facture concernée dans la liste des factures impayées. Choisissez le mode de paiement (espèces, carte bancaire, virement, chèque, prélèvement) et saisissez le montant encaissé. Pour les paiements partiels, le solde restant dû s'affiche automatiquement. Ajoutez une référence (numéro de chèque, transaction CB) et des notes si nécessaire. Le reçu PDF est généré automatiquement."
      },
      {
        question: "Comment gérer les dépenses ?",
        answer: "Dans 'Paiements' > 'Dépenses', enregistrez tous vos achats : pièces détachées, prestations externes (sous-traitance, expertise), frais généraux (électricité, assurance, téléphone). Associez chaque dépense à un fournisseur, une catégorie comptable et un projet/véhicule si applicable. Scannez les factures fournisseurs pour joindre les justificatifs. La TVA déductible est calculée automatiquement selon les taux en vigueur."
      },
      {
        question: "Comment consulter ma comptabilité ?",
        answer: "Le module 'Comptabilité' offre une vue d'ensemble complète : chiffre d'affaires mensuel/annuel, dépenses par catégorie, marges brutes et nettes, évolution de la trésorerie. Tableaux de bord interactifs avec graphiques en temps réel. Utilisez les filtres de période (mois, trimestre, année) pour analyser vos performances. Comparaison avec les périodes précédentes et objectifs. Indicateurs clés : délai moyen de paiement, factures en retard, top clients."
      },
      {
        question: "Comment exporter mes données comptables ?",
        answer: "Dans la section comptabilité, utilisez les boutons d'export pour générer des rapports détaillés aux formats PDF (présentation) ou Excel (données brutes). Exports disponibles : journal des ventes, journal des achats, balance comptable, bilan simplifié. Les fichiers sont compatibles avec la plupart des logiciels comptables (Sage, Ciel, EBP). Possibilité d'automatiser les exports mensuels par email à votre comptable. Historique des exports conservé 12 mois."
      }
    ]
  },
  {
    id: "ai-assistant",
    title: "Assistant IA",
    icon: <Bot className="h-5 w-5" />,
    items: [
      {
        question: "Comment fonctionne l'assistant IA ?",
        answer: "L'assistant IA analyse vos données d'activité pour identifier des patterns et optimisations possibles. Il vous aide à automatiser certaines tâches répétitives, suggère des améliorations de processus et peut répondre à vos questions sur l'utilisation de l'application. L'IA apprend de vos habitudes pour proposer des suggestions de plus en plus personnalisées. Elle respecte strictement la confidentialité de vos données et ne partage aucune information avec l'extérieur."
      },
      {
        question: "Quelles tâches peut automatiser l'IA ?",
        answer: "L'IA peut automatiser : la catégorisation des dépenses selon vos habitudes, la suggestion de réparations types selon les véhicules et pannes récurrentes, l'optimisation de la planification des interventions selon les disponibilités, la génération de rapports personnalisés avec analyses de performance, la détection d'anomalies (factures inhabituelles, retards de paiement), et l'envoi de rappels automatiques aux clients pour les échéances importantes."
      },
      {
        question: "Comment activer les suggestions automatiques ?",
        answer: "Dans les paramètres de l'assistant IA, activez les suggestions pour les modules qui vous intéressent : gestion des stocks, planification, facturation, relances clients. Définissez le niveau de suggestions (faible, moyen, élevé) et les types d'alertes souhaitées. L'IA commence à apprendre après quelques semaines d'utilisation et ses suggestions deviennent progressivement plus pertinentes. Vous pouvez désactiver les suggestions à tout moment ou les modifier selon vos besoins."
      }
    ]
  }
];
