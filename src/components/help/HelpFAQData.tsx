import React from 'react';
import { Rocket, Users, Car, Wrench, FileText, CreditCard, Truck, ClipboardList, DollarSign, Wallet } from 'lucide-react';

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
        answer: "Dans 'Documents' > 'Avoirs', créez un avoir pour annuler tout ou partie d'une facture. Sélectionnez la facture concernée (seules les factures payées peuvent faire l'objet d'un avoir), indiquez le montant à créditer et la raison du remboursement (défaut, annulation, geste commercial). L'avoir est numéroté automatiquement et vient en déduction du chiffre d'affaires. Il peut être envoyé au client et impacte automatiquement les statistiques comptables."
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
        answer: "Accédez à la section 'Paiements' > 'Gestion des comptes' et cliquez sur 'Nouveau compte'. Remplissez les informations bancaires : nom du compte, banque, IBAN, BIC, type de compte (Courant, Épargne, Professionnel), et solde initial. Toutes ces informations sont nécessaires pour le suivi comptable."
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
  }
];
