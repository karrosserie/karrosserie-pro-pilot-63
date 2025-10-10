import React from 'react';
import { Rocket, Users, Car, Wrench, FileText, CreditCard, Truck, ClipboardList, DollarSign, Wallet, UserCog, ShoppingCart, Scale } from 'lucide-react';
import { VideoEmbed } from './VideoEmbed';
import { videoMappings } from './videoMappings';

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
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['inscription']} title="Vidéo : Inscription et connexion" />
            <p>Pour vous connecter à l'application :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Cliquez sur le bouton "Se connecter" sur la page d'accueil</li>
              <li>Saisissez votre adresse email et votre mot de passe</li>
              <li>Cliquez sur "Connexion" pour accéder à votre espace</li>
            </ol>
            <div className="mt-4">
              <p className="font-medium">En cas de problème :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Si vous avez oublié votre mot de passe, utilisez le lien "Mot de passe oublié"</li>
                <li>Vous recevrez un email avec un lien pour réinitialiser votre mot de passe</li>
                <li>Assurez-vous que votre navigateur accepte les cookies</li>
                <li>Vérifiez que votre compte n'est pas temporairement bloqué après plusieurs tentatives infructueuses</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        question: "Comment naviguer dans l'interface ?",
        answer: (
          <div className="space-y-3">
            <p>L'application est organisée en modules principaux accessibles via le menu latéral :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Tableau de bord</strong> : Vue d'ensemble avec statistiques et activité récente</li>
              <li><strong>Clients</strong> : Gestion complète de votre clientèle</li>
              <li><strong>Véhicules</strong> : Gestion du parc automobile</li>
              <li><strong>Documents</strong> : Devis, factures, ordres de réparation, avoirs</li>
              <li><strong>Paiements</strong> : Encaissements, dépenses et gestion des comptes</li>
              <li><strong>Comptabilité</strong> : Vue financière et rapports</li>
            </ul>
            <div className="mt-4">
              <p className="font-medium">Navigation mobile :</p>
              <p className="ml-4">Sur mobile, utilisez le bouton menu (☰) en haut à gauche pour accéder à la navigation.</p>
            </div>
          </div>
        )
      },
      {
        question: "Comment personnaliser mon profil ?",
        answer: (
          <div className="space-y-3">
            <p>Pour personnaliser votre profil, accédez à la section "Paramètres" puis "Profil" :</p>
            <div className="ml-4">
              <p className="font-medium mb-2">Informations personnelles :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email (utilisée pour la connexion)</li>
                <li>Numéro de téléphone</li>
                <li>Photo de profil</li>
              </ul>
            </div>
            <div className="ml-4">
              <p className="font-medium mb-2">Sécurité :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Modification du mot de passe</li>
                <li>Configuration de l'authentification à deux facteurs</li>
              </ul>
            </div>
            <div className="ml-4">
              <p className="font-medium mb-2">Préférences :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Thème d'affichage (clair/sombre)</li>
                <li>Paramètres de notifications</li>
                <li>Langue de l'interface</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Important :</strong> N'oubliez pas de cliquer sur "Sauvegarder" pour enregistrer vos modifications.
            </p>
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
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-client']} title="Vidéo : Ajout d'un client" />
            <p>Pour créer un nouveau client dans l'application :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Accédez à la section "Clients" via le menu latéral</li>
              <li>Cliquez sur le bouton "+ Nouveau client" en haut de la liste</li>
              <li>Remplissez le formulaire de création avec les informations requises :</li>
              <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                <li><strong>Informations obligatoires :</strong> Nom (last_name), prénom (first_name)</li>
                <li><strong>Contact :</strong> Adresse email, numéro de téléphone</li>
                <li><strong>Adresse :</strong> Rue, ville, code postal</li>
              </ul>
              <li>Ajoutez les documents optionnels :</li>
              <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                <li>Permis de conduire recto (stockage sécurisé)</li>
                <li>Permis de conduire verso (stockage sécurisé)</li>
                <li>Documents automatiquement liés au dossier client</li>
              </ul>
              <li>Cliquez sur "Enregistrer" pour finaliser la création</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Fonctionnalités automatiques :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-blue-700">
                <li>Attribution automatique d'un ID unique</li>
                <li>Association avec votre compte utilisateur</li>
                <li>Horodatage de création et de modification</li>
                <li>Intégration possible avec systèmes externes (OODrive)</li>
                <li>Tri automatique alphabétique par nom de famille</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-3">Le client apparaîtra immédiatement dans votre liste et pourra être associé à des véhicules et documents.</p>
          </div>
        )
      },
      {
        question: "Comment modifier un client existant ?",
        answer: (
          <div className="space-y-3">
            <p>Pour modifier un client existant :</p>
            <div className="ml-4">
              <p className="font-medium mb-2">Méthode 1 - Via la liste :</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Dans la liste des clients, cliquez sur l&apos;icône crayon (éditer) à droite de la ligne du client</li>
                <li>Modifiez les informations nécessaires dans le formulaire</li>
                <li>Sauvegardez vos modifications</li>
              </ol>
            </div>
            <div className="ml-4">
              <p className="font-medium mb-2">Méthode 2 - Via la fiche complète :</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Cliquez sur le nom du client pour accéder à sa fiche complète</li>
                <li>Visualisez l&apos;historique des interventions, factures et véhicules associés</li>
                <li>Modifiez les informations depuis cette vue détaillée</li>
              </ol>
            </div>
          </div>
        )
      },
      {
        question: "Comment rechercher un client ?",
        answer: (
          <div className="space-y-3">
            <p>Plusieurs options de recherche sont disponibles :</p>
            <div className="ml-4">
              <p className="font-medium mb-2">Recherche simple :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Utilisez la barre de recherche en haut de la liste des clients</li>
                <li>Recherchez par nom, prénom, email, téléphone</li>
                <li>Vous pouvez aussi utiliser des fragments d&apos;informations</li>
              </ul>
            </div>
            <div className="ml-4">
              <p className="font-medium mb-2">Filtres avancés :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Type de client (particulier/professionnel)</li>
                <li>Statut (actif/inactif)</li>
                <li>Date de création</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">La recherche est instantanée et met à jour la liste en temps réel.</p>
          </div>
        )
      },
      {
        question: "Comment ajouter des documents au dossier client ?",
        answer: (
          <div className="space-y-3">
            <p>Pour ajouter des documents au dossier d&apos;un client :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Accédez à la fiche client</li>
              <li>Cliquez sur l&apos;onglet "Documents"</li>
              <li>Téléchargez les documents nécessaires :</li>
              <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                <li>Permis de conduire (recto/verso obligatoire)</li>
                <li>Carte d&apos;identité</li>
                <li>Justificatif de domicile</li>
                <li>Autres documents utiles</li>
              </ul>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Formats acceptés :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-blue-700">
                <li>PDF, JPEG, PNG</li>
                <li>Taille maximum : 10Mo par fichier</li>
                <li>Possibilité de renommer et catégoriser chaque document</li>
                <li>Historique conservé avec dates d&apos;ajout</li>
              </ul>
            </div>
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
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-vehicule']} title="Vidéo : Ajout d'un véhicule" />
            <p>Pour ajouter un nouveau véhicule :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Accédez à la section "Véhicules"</li>
              <li>Cliquez sur "+ Nouveau véhicule"</li>
              <li>Associez obligatoirement le véhicule à un client existant via le menu déroulant</li>
              <li>Renseignez les informations de base :</li>
              <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                <li>Marque et modèle</li>
                <li>Année de fabrication</li>
                <li>Plaque d&apos;immatriculation</li>
                <li>Numéro VIN (17 caractères) pour le remplissage automatique</li>
              </ul>
              <li>Ajoutez les éléments complémentaires :</li>
              <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                <li>Photos du véhicule</li>
                <li>État du carburant</li>
                <li>Documents (carte grise)</li>
              </ul>
              <li>Sauvegardez pour finaliser l&apos;ajout</li>
            </ol>
          </div>
        )
      },
      {
        question: "Comment fonctionne le décodage VIN automatique ?",
        answer: (
          <div className="space-y-3">
            <p>Le décodage VIN automatique fonctionne en plusieurs étapes :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Saisissez un numéro VIN de 17 caractères valide dans le champ prévu</li>
              <li>L&apos;application vérifie automatiquement le format</li>
              <li>Notre API intégrée décode les informations :</li>
              <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                <li>Marque du véhicule</li>
                <li>Modèle</li>
                <li>Année de fabrication</li>
              </ul>
            </ol>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800 mb-2">Caractéristiques du système :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-green-700">
                <li>Reconnaissance de plus de 500 codes constructeurs mondiaux</li>
                <li>Compatible avec les véhicules de 1980 à aujourd&apos;hui</li>
                <li>Possibilité de saisie manuelle si le VIN n&apos;est pas reconnu</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        question: "Quelles informations puis-je enregistrer pour un véhicule ?",
        answer: (
          <div className="space-y-3">
            <p>Vous pouvez enregistrer de nombreuses informations pour chaque véhicule :</p>
            <div className="ml-4">
              <p className="font-medium mb-2">Informations techniques :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Marque, modèle, année</li>
                <li>VIN et plaque d&apos;immatriculation</li>
                <li>Couleur et type de carburant</li>
                <li>Kilométrage et puissance</li>
              </ul>
            </div>
            <div className="ml-4">
              <p className="font-medium mb-2">Documents :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Carte grise recto/verso</li>
                <li>Photos du véhicule (jusqu&apos;à 10 photos)</li>
                <li>Contrat d&apos;achat</li>
              </ul>
            </div>
            <div className="ml-4">
              <p className="font-medium mb-2">Informations d&apos;assurance :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Compagnie d&apos;assurance</li>
                <li>Numéro de police</li>
                <li>Date d&apos;expiration</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Vous pouvez aussi suivre l&apos;historique complet des interventions, réparations et factures associées au véhicule.
            </p>
          </div>
        )
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
        answer: "Dans 'Documents' > 'Devis', créez un nouveau devis en sélectionnant client et véhicule. Ajoutez les prestations avec descriptions détaillées, quantités et prix unitaires. Vous pouvez inclure plusieurs types de travaux : réparations, peinture, carrosserie, mécanique. Définissez une date de validité (généralement 30 jours) et des conditions de paiement. Le devis peut être converti en ordre de réparation une fois accepté par le client."
      },
      {
        question: "Comment envoyer un devis par email ?",
        answer: "Dans la fiche devis, cliquez sur 'Envoyer par email'. Rédigez votre message personnalisé, l'application génère automatiquement le PDF du devis en pièce jointe. Vous pouvez prévisualiser l'email avant envoi. Le client recevra le devis en PDF avec votre logo et informations d'entreprise. Un accusé de réception vous informe de la bonne réception. L'historique des envois est conservé dans la fiche devis."
      },
      {
        question: "Comment créer une facture ?",
        answer: "Deux possibilités : créer une facture manuellement dans 'Documents' > 'Factures' en sélectionnant client/véhicule et en ajoutant les prestations, ou convertir automatiquement un ordre de réparation terminé (plus rapide). La facture reprend toutes les informations avec numérotation automatique chronologique. Définissez la date d'échéance, les conditions de paiement et les pénalités de retard. La facture peut être envoyée par email ou imprimée."
      },
      {
        question: "Comment gérer les avoirs ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['avoir']} title="Vidéo : Gestion des avoirs" />
            <p>Dans 'Documents' &gt; 'Avoirs', créez un avoir pour annuler tout ou partie d'une facture. Sélectionnez la facture concernée (seules les factures payées peuvent faire l'objet d'un avoir), indiquez le montant à créditer et la raison du remboursement (défaut, annulation, geste commercial). L'avoir est numéroté automatiquement et vient en déduction du chiffre d'affaires. Il peut être envoyé au client et impacte automatiquement les statistiques comptables.</p>
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
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['cession-creance']} title="Vidéo : Cession de créance" />
            <p>Dans 'Cession de créance', cliquez sur 'Nouvelle cession'. Sélectionnez un ordre de réparation existant (statut 'Terminé' requis), les informations client/véhicule/montant sont automatiquement récupérées. Renseignez les détails de l'assurance : compagnie, numéro de sinistre, expert. Générez les documents légaux nécessaires (lettre de cession, bordereau). Le client doit signer la cession pour qu'elle soit valide juridiquement.</p>
          </div>
        )
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
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-vehicule-courtoisie']} title="Vidéo : Ajout d'un véhicule de courtoisie" />
            <p>Dans 'Véhicules de courtoisie', ajoutez vos véhicules de prêt avec leurs caractéristiques complètes : marque, modèle, immatriculation, année, kilométrage, état général. Définissez les tarifs de location si applicable, les conditions d'utilisation, les restrictions (âge minimum du conducteur, permis requis). Vous pouvez suivre leur disponibilité en temps réel, planifier leur maintenance et gérer les contrats de prêt avec états des lieux détaillés.</p>
          </div>
        )
      },
      {
        question: "Comment faire une réservation de véhicule ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['pret-vehicule']} title="Vidéo : Prêt de véhicule" />
            <p>Créez une nouvelle réservation en sélectionnant le client concerné, le véhicule disponible sur la période souhaitée et les dates de prêt (début/fin). Le système vérifie automatiquement les disponibilités et les conflits. Définissez les conditions particulières (franchise, utilisation autorisée). Le contrat de prêt se génère automatiquement avec état des lieux d'entrée à compléter lors de la remise des clés. Signature électronique possible.</p>
          </div>
        )
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
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['import-expertise']} title="Vidéo : Import d'un rapport d'expertise" />
            <p>Dans 'Documents' &gt; 'Rapports d'expertise', utilisez l'outil d'import pour télécharger les rapports PDF envoyés par les experts. L'application utilise la reconnaissance optique (OCR) pour extraire automatiquement les informations principales : numéro de sinistre, montant des dommages, détail des réparations, expert signataire. Les données extraites sont associées automatiquement aux véhicules et clients concernés si ils existent dans votre base.</p>
          </div>
        )
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
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-encaissement']} title="Vidéo : Ajout d'un encaissement" />
            <p>Dans 'Paiements' &gt; 'Encaissements', créez un nouveau reçu en sélectionnant la facture concernée dans la liste des factures impayées. Choisissez le mode de paiement (espèces, carte bancaire, virement, chèque, prélèvement) et saisissez le montant encaissé. Pour les paiements partiels, le solde restant dû s'affiche automatiquement. Ajoutez une référence (numéro de chèque, transaction CB) et des notes si nécessaire. Le reçu PDF est généré automatiquement.</p>
          </div>
        )
      },
      {
        question: "Comment gérer les dépenses ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-depense']} title="Vidéo : Ajout d'une dépense" />
            <p>Dans 'Paiements' &gt; 'Dépenses', enregistrez tous vos achats : pièces détachées, prestations externes (sous-traitance, expertise), frais généraux (électricité, assurance, téléphone). Associez chaque dépense à un fournisseur, une catégorie comptable et un projet/véhicule si applicable. Scannez les factures fournisseurs pour joindre les justificatifs. La TVA déductible est calculée automatiquement selon les taux en vigueur.</p>
          </div>
        )
      },
      {
        question: "Comment consulter ma comptabilité ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['comptabilite']} title="Vidéo : Module de comptabilité" />
            <p>Le module 'Comptabilité' offre une vue d'ensemble complète : chiffre d'affaires mensuel/annuel, dépenses par catégorie, marges brutes et nettes, évolution de la trésorerie. Tableaux de bord interactifs avec graphiques en temps réel. Utilisez les filtres de période (mois, trimestre, année) pour analyser vos performances. Comparaison avec les périodes précédentes et objectifs. Indicateurs clés : délai moyen de paiement, factures en retard, top clients.</p>
          </div>
        )
      },
      {
        question: "Comment exporter mes données comptables ?",
        answer: "Dans la section comptabilité, utilisez les boutons d'export pour générer des rapports détaillés aux formats PDF (présentation) ou Excel (données brutes). Exports disponibles : journal des ventes, journal des achats, balance comptable, bilan simplifié. Les fichiers sont compatibles avec la plupart des logiciels comptables (Sage, Ciel, EBP). Possibilité d'automatiser les exports mensuels par email à votre comptable. Historique des exports conservé 12 mois."
      }
    ]
  },
  {
    id: "receipts",
    title: "Encaissements",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      {
        question: "Comment créer un nouvel encaissement ?",
        answer: "Accédez à la section 'Paiements' > 'Encaissements' et cliquez sur 'Nouvel encaissement'. Sélectionnez la facture concernée, indiquez le montant encaissé, choisissez la méthode de paiement (espèces, carte bancaire, virement, chèque) et le compte bancaire. Vous pouvez ajouter des notes et des justificatifs de paiement. L'encaissement est automatiquement lié à la facture sélectionnée."
      },
      {
        question: "Comment modifier un encaissement existant ?",
        answer: "Dans la liste des encaissements, cliquez sur l'icône crayon (modifier) à droite de la ligne de l'encaissement. Vous pouvez modifier tous les détails : montant, méthode de paiement, compte bancaire, notes et justificatifs. Les modifications sont sauvegardées immédiatement et mettent à jour le statut de la facture associée."
      },
      {
        question: "Comment supprimer un encaissement ?",
        answer: "Dans la liste des encaissements, cliquez sur l'icône corbeille (supprimer) à droite de la ligne de l'encaissement. Une confirmation vous sera demandée avant la suppression définitive. La suppression d'un encaissement met automatiquement à jour le statut de la facture associée."
      },
      {
        question: "Comment rechercher un encaissement ?",
        answer: "Utilisez la barre de recherche en haut de la page des encaissements. Vous pouvez rechercher par référence d'encaissement, nom du client, ou montant. La recherche s'effectue en temps réel et filtre automatiquement la liste des encaissements."
      },
      {
        question: "Quelles méthodes de paiement sont disponibles ?",
        answer: "L'application prend en charge plusieurs méthodes de paiement : espèces, carte bancaire, virement bancaire, chèque, et prélèvement. Pour chaque encaissement, vous pouvez sélectionner la méthode appropriée et ajouter des références spécifiques (numéro de chèque, référence de virement, etc.)."
      },
      {
        question: "Comment ajouter des justificatifs de paiement ?",
        answer: "Lors de la création ou modification d'un encaissement, vous pouvez télécharger des justificatifs de paiement (tickets de carte bancaire, bordereaux de remise, etc.) via le champ 'Justificatifs de paiement'. Les fichiers acceptés sont en format PDF, JPEG ou PNG avec une taille maximale de 10Mo par fichier."
      }
    ]
  },
  {
    id: "expenses",
    title: "Dépenses",
    icon: <DollarSign className="h-5 w-5" />,
    items: [
      {
        question: "Comment enregistrer une nouvelle dépense ?",
        answer: "Accédez à la section 'Paiements' > 'Dépenses' et cliquez sur 'Nouvelle dépense'. Remplissez les informations obligatoires : type de dépense, date, fournisseur, catégorie, montant TVA et montant TTC. Vous pouvez associer la dépense à un véhicule spécifique et ajouter des justificatifs (factures fournisseurs)."
      },
      {
        question: "Comment modifier une dépense ?",
        answer: "Dans la liste des dépenses, cliquez sur l'icône crayon (modifier) à droite de la ligne de la dépense. Vous pouvez modifier tous les détails de la dépense : montants, catégorie, fournisseur, statut, et véhicule associé. Les modifications sont sauvegardées immédiatement."
      },
      {
        question: "Comment supprimer une dépense ?",
        answer: "Dans la liste des dépenses, cliquez sur l'icône corbeille (supprimer) à droite de la ligne de la dépense. Une demande de confirmation apparaîtra avant la suppression définitive. Cette action est irréversible, assurez-vous que la suppression est nécessaire."
      },
      {
        question: "Comment associer une dépense à un véhicule ?",
        answer: "Lors de la création ou modification d'une dépense, activez l'option 'Assigner à un véhicule' et sélectionnez le véhicule concerné dans la liste déroulante. Cela permet de suivre les coûts spécifiques à chaque véhicule et d'établir des rapports de rentabilité par véhicule."
      },
      {
        question: "Quels sont les statuts des dépenses ?",
        answer: "Les dépenses peuvent avoir plusieurs statuts : 'En attente' (dépense créée mais non validée), 'Validée' (dépense approuvée), 'Payée' (dépense réglée au fournisseur), ou 'Rejetée' (dépense refusée). Le statut peut être modifié à tout moment selon l'avancement du traitement de la dépense."
      },
      {
        question: "Comment rechercher une dépense ?",
        answer: "Utilisez la barre de recherche en haut de la page des dépenses. Vous pouvez rechercher par type, fournisseur, catégorie, ou montant. La recherche filtre automatiquement la liste et affiche les résultats en temps réel."
      },
      {
        question: "Comment ajouter des justificatifs à une dépense ?",
        answer: "Dans le formulaire de dépense, utilisez le champ 'Justificatif' pour télécharger la facture fournisseur ou tout autre document justificatif. Les formats acceptés sont PDF, JPEG et PNG. Le justificatif est obligatoire pour la validation comptable de la dépense."
      }
    ]
  },
  {
    id: "accounts",
    title: "Gestion des comptes",
    icon: <Wallet className="h-5 w-5" />,
    items: [
      {
        question: "Comment créer un nouveau compte bancaire ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-compte']} title="Vidéo : Ajout d'un compte bancaire" />
            <p>Accédez à la section 'Paiements' &gt; 'Gestion des comptes' et cliquez sur 'Nouveau compte'. Remplissez les informations bancaires : nom du compte, banque, IBAN, BIC, type de compte (Courant, Épargne, Professionnel), et solde initial. Toutes ces informations sont nécessaires pour le suivi comptable.</p>
          </div>
        )
      },
      {
        question: "Comment modifier un compte bancaire ?",
        answer: "Dans la liste des comptes, cliquez sur l'icône crayon (modifier) à droite de la ligne du compte. Vous pouvez modifier le nom, la banque, les coordonnées bancaires, le type de compte et le solde. Les modifications sont sauvegardées immédiatement et impactent les futurs encaissements et dépenses."
      },
      {
        question: "Comment supprimer un compte bancaire ?",
        answer: "Dans la liste des comptes, cliquez sur l'icône corbeille (supprimer) à droite de la ligne du compte. Une confirmation sera demandée car cette action est irréversible. Attention : vous ne pouvez pas supprimer un compte qui a des transactions associées (encaissements ou dépenses)."
      },
      {
        question: "Comment synchroniser le solde d'un compte ?",
        answer: "Dans la liste des comptes, cliquez sur l'icône actualiser (synchroniser) à droite de la ligne du compte. Cette fonction permet de mettre à jour le solde du compte en tenant compte de toutes les transactions récentes. La synchronisation est recommandée régulièrement pour maintenir des données exactes."
      },
      {
        question: "Quels types de comptes puis-je créer ?",
        answer: "L'application prend en charge trois types de comptes : 'Courant' (compte bancaire principal pour les opérations courantes), 'Épargne' (compte d'épargne pour les réserves), et 'Professionnel' (compte dédié à l'activité professionnelle). Chaque type a ses propres caractéristiques pour un meilleur suivi comptable."
      },
      {
        question: "Comment voir les détails d'un compte ?",
        answer: "Dans la liste des comptes, cliquez sur l'icône œil (voir) à droite de la ligne du compte. Cela affiche les détails complets du compte : informations bancaires, historique des transactions, évolution du solde, et dernière synchronisation. Vous pouvez également voir toutes les opérations liées à ce compte."
      },
      {
        question: "Que signifient les statuts des comptes ?",
        answer: "Les comptes peuvent avoir plusieurs statuts : 'Actif' (compte opérationnel et utilisé), 'Inactif' (compte fermé ou non utilisé), et 'Suspendu' (compte temporairement bloqué). Le statut d'un compte détermine s'il peut être sélectionné lors de la création d'encaissements ou de dépenses."
      },
      {
        question: "Comment rechercher un compte ?",
        answer: "Utilisez la barre de recherche en haut de la page de gestion des comptes. Vous pouvez rechercher par nom de compte, banque, IBAN, ou BIC. La recherche filtre automatiquement la liste et affiche les résultats correspondants en temps réel."
      }
    ]
  },
  {
    id: "relances",
    title: "Relances de paiement",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      {
        question: "Comment gérer les relances de paiement ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['relance-paiement']} title="Vidéo : Relances de paiement" />
            <p>Le module de relances vous permet de suivre et automatiser les rappels de paiement pour les factures impayées. Configurez des cycles de relances personnalisés selon vos besoins : rappel amiable, mise en demeure, contentieux. Les relances peuvent être envoyées par email, SMS, WhatsApp ou courrier selon les préférences du client et la gravité du retard.</p>
            <div className="mt-4">
              <p className="font-medium">Fonctionnalités :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Relances automatiques basées sur les délais de paiement</li>
                <li>Personnalisation des messages et de la tonalité</li>
                <li>Suivi des réponses clients</li>
                <li>Historique complet des relances envoyées</li>
                <li>Escalade automatique vers contentieux si nécessaire</li>
              </ul>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: "employees",
    title: "Gestion des employés",
    icon: <UserCog className="h-5 w-5" />,
    items: [
      {
        question: "Comment ajouter un employé ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['ajout-employe']} title="Vidéo : Ajout d'un employé" />
            <p>Pour ajouter un nouvel employé dans l'application :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Accédez à la section "Équipe" ou "Employés"</li>
              <li>Cliquez sur "+ Nouvel employé"</li>
              <li>Remplissez les informations personnelles : nom, prénom, email, téléphone</li>
              <li>Définissez le rôle et les permissions d'accès</li>
              <li>Configurez les informations contractuelles si nécessaire</li>
              <li>Sauvegardez pour finaliser l'ajout</li>
            </ol>
            <p className="text-sm text-gray-600 mt-3">L'employé recevra automatiquement un email d'invitation pour créer son compte et accéder à l'application.</p>
          </div>
        )
      },
      {
        question: "Comment gérer le planning des employés ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['planning-employe']} title="Vidéo : Planning employé" />
            <p>Le planning employés permet de visualiser et organiser les interventions de votre équipe :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Vue calendrier par jour, semaine ou mois</li>
              <li>Affectation des tâches aux employés disponibles</li>
              <li>Gestion des congés et absences</li>
              <li>Suivi du temps passé sur chaque intervention</li>
              <li>Optimisation de la charge de travail</li>
            </ul>
          </div>
        )
      },
      {
        question: "Comment assigner une tâche à un employé ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['tache-employe']} title="Vidéo : Tâche employé" />
            <p>L'assignation de tâches permet de répartir efficacement le travail :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Sélectionnez l'ordre de réparation ou le véhicule concerné</li>
              <li>Choisissez le type de tâche (accueil, préparation, peinture, finition, etc.)</li>
              <li>Assignez à l'employé disponible selon ses compétences</li>
              <li>Définissez les dates et heures prévisionnelles</li>
              <li>L'employé reçoit une notification de la nouvelle tâche</li>
            </ol>
            <p className="text-sm text-gray-600 mt-3">Les employés peuvent mettre à jour le statut de leurs tâches en temps réel depuis leur interface.</p>
          </div>
        )
      }
    ]
  },
  {
    id: "purchases",
    title: "Achats et fournisseurs",
    icon: <ShoppingCart className="h-5 w-5" />,
    items: [
      {
        question: "Comment créer un bon de commande ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['bon-commande']} title="Vidéo : Bon de commande" />
            <p>Le bon de commande vous permet de commander des pièces et fournitures auprès de vos fournisseurs :</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Accédez à la section "Achats" ou "Bons de commande"</li>
              <li>Créez un nouveau bon de commande</li>
              <li>Sélectionnez le fournisseur dans votre liste</li>
              <li>Ajoutez les articles : références, quantités, prix unitaires</li>
              <li>Vérifiez les montants HT, TVA et TTC</li>
              <li>Envoyez le bon de commande par email au fournisseur</li>
            </ol>
            <div className="mt-4">
              <p className="font-medium">Suivi des commandes :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Statut de la commande (en attente, expédiée, reçue)</li>
                <li>Date de livraison prévue et réelle</li>
                <li>Gestion des bons de livraison</li>
                <li>Rapprochement avec les factures fournisseurs</li>
              </ul>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: "litigation",
    title: "Contentieux et litiges",
    icon: <Scale className="h-5 w-5" />,
    items: [
      {
        question: "Comment gérer un contentieux ?",
        answer: (
          <div className="space-y-3">
            <VideoEmbed filePath={videoMappings['contentieux-tribunal']} title="Vidéo : Contentieux et tribunal" />
            <p>Le module contentieux vous aide à gérer les litiges et procédures judiciaires :</p>
            <div className="mt-4">
              <p className="font-medium">Création d'un dossier contentieux :</p>
              <ol className="list-decimal list-inside space-y-2 ml-4 mt-2">
                <li>Sélectionnez la facture ou le dossier en litige</li>
                <li>Rassemblez tous les documents nécessaires (factures, relances, échanges)</li>
                <li>Générez automatiquement le dossier judiciaire avec les pièces justificatives</li>
                <li>Suivez l'avancement de la procédure (mise en demeure, tribunal, jugement)</li>
              </ol>
            </div>
            <div className="mt-4">
              <p className="font-medium">Documents générés automatiquement :</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Lettre de mise en demeure</li>
                <li>Assignation en justice</li>
                <li>Récapitulatif chronologique des événements</li>
                <li>Compilation de toutes les pièces justificatives</li>
              </ul>
            </div>
          </div>
        )
      }
    ]
  }
];
