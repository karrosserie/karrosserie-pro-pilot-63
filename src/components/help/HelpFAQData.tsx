import React from 'react';
import { Rocket, Users, Car, Wrench, FileText, CreditCard, Truck, ClipboardList, DollarSign, Bot } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
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
      },
      {
        question: "Que faire en cas de problème technique ?",
        answer: "En cas de dysfonctionnement, vérifiez d'abord votre connexion internet et actualisez la page. Si le problème persiste, consultez cette FAQ ou contactez le support technique via le chat en ligne. Décrivez précisément le problème rencontré et les étapes suivies. L'équipe technique vous répondra sous 24h ouvrées. Vous pouvez aussi vérifier la page statut du service pour les maintenances programmées."
      },
      {
        question: "Comment sauvegarder mes données ?",
        answer: "Vos données sont automatiquement sauvegardées en temps réel sur nos serveurs sécurisés avec cryptage. Des sauvegardes complètes sont effectuées quotidiennement et conservées 30 jours. Vous pouvez exporter vos données principales (clients, véhicules, factures) au format Excel depuis chaque module. Pour une sauvegarde complète, contactez le support qui peut générer une archive complète de votre compte."
      },
      {
        question: "Comment paramétrer mes notifications ?",
        answer: "Dans 'Paramètres' > 'Notifications', activez/désactivez les alertes par email ou SMS : nouvelles factures à envoyer, échéances de paiement, maintenances véhicules de courtoisie, cessions en attente. Définissez la fréquence (immédiate, quotidienne, hebdomadaire) et les horaires d'envoi. Vous pouvez personnaliser les messages et ajouter des destinataires supplémentaires pour certaines notifications."
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
      },
      {
        question: "Comment supprimer un client ?",
        answer: "Vous ne pouvez supprimer un client que s'il n'a aucun document ou véhicule associé. Sinon, vous pouvez l'archiver en changeant son statut vers 'Inactif'. Pour supprimer définitivement, allez dans la fiche client et cliquez sur 'Actions' > 'Supprimer'. Une confirmation sera demandée car cette action est irréversible. Les données supprimées ne peuvent être récupérées."
      },
      {
        question: "Comment gérer les clients professionnels ?",
        answer: "Créez un client professionnel en sélectionnant 'Entreprise' dans le type de client. Renseignez la raison sociale, SIRET, numéro TVA intracommunautaire, adresse de facturation. Vous pouvez ajouter plusieurs contacts (gérant, comptable, responsable technique) avec leurs coordonnées. Les tarifs professionnels peuvent être différents des particuliers. Historique des contrats et conventions spéciales. Facturation avec mentions légales adaptées."
      },
      {
        question: "Comment importer une liste de clients ?",
        answer: "Utilisez la fonction d'import Excel/CSV dans 'Clients' > 'Importer'. Téléchargez le modèle de fichier avec les colonnes obligatoires : nom, prénom, email, téléphone. Respectez le format des données (dates, téléphones). L'import vérifie les doublons et les erreurs avant validation. Un rapport détaille les lignes importées avec succès et les erreurs à corriger. Maximum 1000 clients par import."
      },
      {
        question: "Comment gérer les données RGPD ?",
        answer: "L'application respecte le RGPD : consentement client tracé, droit à l'oubli (suppression des données sur demande), portabilité (export des données client), rectification (modification des informations). Les clients peuvent demander l'accès à leurs données via un formulaire dédié. Un registre des traitements est tenu à jour. Les données sont hébergées en France avec cryptage et accès sécurisés."
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
      },
      {
        question: "Comment gérer l'historique d'un véhicule ?",
        answer: "Chaque véhicule dispose d'un historique complet accessible depuis sa fiche : interventions effectuées, réparations, changements de pièces, contrôles techniques, révisions. Vous pouvez ajouter des événements manuellement (accident, vol, vente) avec dates et descriptions. Les factures et devis associés sont automatiquement liés. Cet historique est consultable par le client et peut être imprimé pour la revente."
      },
      {
        question: "Comment gérer les rappels de maintenance ?",
        answer: "Dans la fiche véhicule, programmez les rappels selon les préconisations constructeur : vidange (tous les 15000 km), contrôle technique (tous les 2 ans), révision annuelle. Le système calcule automatiquement les prochaines échéances selon le kilométrage saisi et envoie des alertes. Vous pouvez personnaliser les intervalles et ajouter des rappels spécifiques (pneus, freins, distribution). Notifications par email et SMS au client."
      },
      {
        question: "Comment archiver un véhicule ?",
        answer: "Archivez un véhicule vendu, détruit ou plus entretenu chez vous via 'Actions' > 'Archiver'. Le véhicule disparaît des listes actives mais conserve son historique complet. Indiquez la raison (vente, casse, changement de garage) et la date. Les véhicules archivés restent consultables dans l'onglet 'Archives' et peuvent être réactivés si nécessaire. Statistiques d'archivage disponibles pour analyser les départs clients."
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
      },
      {
        question: "Comment planifier les interventions ?",
        answer: "Utilisez le calendrier intégré pour planifier vos interventions par technicien et par poste de travail. Glissez-déposez les ordres de réparation sur les créneaux disponibles. Le système vérifie les conflits de planning et la disponibilité des pièces. Vous pouvez définir des durées prévisionnelles par type d'intervention, gérer les absences des techniciens et optimiser la charge de travail. Notifications automatiques aux clients pour confirmer les rendez-vous."
      },
      {
        question: "Comment gérer les ordres urgents ?",
        answer: "Marquez un ordre comme 'Urgent' avec une priorité élevée. Il apparaîtra en rouge dans la liste et remontera automatiquement en haut du planning. Vous pouvez définir des niveaux d'urgence (faible, normale, élevée, critique) avec des codes couleur. Les ordres urgents peuvent passer devant d'autres interventions programmées. Notifications automatiques à l'équipe technique et possibilité d'alertes SMS pour les cas critiques."
      },
      {
        question: "Comment suivre la rentabilité par ordre ?",
        answer: "Chaque ordre affiche sa marge brute (prix de vente - coût des pièces) et le temps passé versus le temps prévu. L'onglet 'Analyse' détaille la rentabilité : coût de la main-d'œuvre, marge sur pièces, coût indirect (charges fixes réparties). Comparaison avec les ordres similaires et benchmarking par type d'intervention. Identification des ordres les plus/moins rentables pour optimiser vos tarifs et processus."
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
      },
      {
        question: "Comment personnaliser mes modèles de documents ?",
        answer: "Dans 'Paramètres' > 'Modèles de documents', personnalisez vos devis, factures et ordres : logo, couleurs, polices, mise en page. Modifiez les mentions légales, conditions de vente, coordonnées bancaires. Créez plusieurs modèles selon le type de client (particulier/professionnel) ou de prestation. Prévisualisez avant validation. Les modifications s'appliquent aux nouveaux documents seulement."
      },
      {
        question: "Comment gérer les relances clients ?",
        answer: "Le système génère automatiquement des relances pour les factures impayées : 1ère relance à J+8, 2ème à J+15, mise en demeure à J+30. Personnalisez les délais et messages dans 'Paramètres' > 'Relances'. Envoi automatique par email avec accusé de réception. Vous pouvez également envoyer des relances manuelles avec courrier recommandé. Suivi des actions en cours et des promesses de paiement clients."
      },
      {
        question: "Comment gérer les factures récurrentes ?",
        answer: "Pour les contrats d'entretien ou locations longue durée, créez des factures récurrentes dans 'Documents' > 'Factures récurrentes'. Définissez la périodicité (mensuelle, trimestrielle, annuelle), les dates d'échéance et la durée du contrat. Le système génère automatiquement les factures selon votre planning et peut les envoyer directement aux clients. Gestion des indexations tarifaires et des avenants au contrat."
      },
      {
        question: "Comment exporter mes documents en lot ?",
        answer: "Dans chaque module (devis, factures, ordres), utilisez la sélection multiple pour exporter plusieurs documents simultanément. Choix des formats : PDF individuel, PDF groupé, Excel, CSV. Définissez les critères de sélection (période, client, statut) pour filtrer les documents à exporter. Possibilité de programmer des exports automatiques mensuels envoyés par email à votre comptable ou expert-comptable."
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
      },
      {
        question: "Quels documents sont nécessaires pour une cession ?",
        answer: "Documents obligatoires : lettre de cession signée par le client, devis/facture détaillé, constat d'accident ou déclaration de sinistre, photos des dommages, procès-verbal d'expertise si disponible. Documents complémentaires : permis de conduire du conducteur, attestation d'assurance, carte grise du véhicule. Tous les documents doivent être lisibles et complets pour éviter les rejets de l'assurance."
      },
      {
        question: "Comment optimiser mes taux d'acceptation ?",
        answer: "Conseils pour améliorer l'acceptation : complétez toujours tous les champs obligatoires, fournissez des devis détaillés avec références de pièces, respectez les barèmes constructeur, joignez des photos de qualité, envoyez rapidement après l'expertise. Analysez vos taux de rejet par assurance pour identifier les points d'amélioration. Maintenez une relation privilégiée avec les experts et gestionnaires de votre secteur."
      },
      {
        question: "Comment gérer les litiges avec les assurances ?",
        answer: "En cas de désaccord, documentez précisément les points de contestation avec pièces justificatives. Contactez directement le gestionnaire du dossier pour négocier. Si nécessaire, sollicitez une contre-expertise ou l'intervention d'un expert indépendant. L'application conserve l'historique complet des échanges pour vos démarches. En dernier recours, saisissez le médiateur de l'assurance ou consultez votre avocat spécialisé."
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
      },
      {
        question: "Comment optimiser la rotation de ma flotte ?",
        answer: "Analysez les statistiques d'utilisation : taux d'occupation par véhicule, durée moyenne des prêts, périodes de forte demande. Identifiez les véhicules sous-utilisés et ceux en surouccupation. Adaptez votre flotte selon la demande saisonnière et les préférences clients. Programmez les maintenances pendant les périodes creuses. Proposez des véhicules de catégorie supérieure en cas d'indisponibilité pour fidéliser la clientèle."
      },
      {
        question: "Comment gérer les assurances des véhicules de courtoisie ?",
        answer: "Vérifiez que votre contrat d'assurance flotte couvre tous vos véhicules de prêt avec les bonnes valeurs. Contrôlez systématiquement le permis de conduire des emprunteurs (validité, points restants, restrictions). Informez l'assurance des nouveaux véhicules dans les délais contractuels. En cas de sinistre sur véhicule de courtoisie, déclarez immédiatement et récupérez le constat auprès du client. Tenez un registre des conducteurs autorisés."
      },
      {
        question: "Comment tarifer mes véhicules de courtoisie ?",
        answer: "Définissez vos tarifs selon plusieurs critères : catégorie de véhicule (citadine, berline, utilitaire), durée de prêt (1er jour, jours suivants), type de client (particulier/professionnel), période (haute/basse saison). Vous pouvez appliquer des remises pour les bons clients ou inclure le prêt dans le forfait réparation. Affichez clairement vos conditions : franchise, kilométrage autorisé, état du carburant au retour. Facturation automatique selon vos barèmes."
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
      },
      {
        question: "Comment contester une expertise défavorable ?",
        answer: "Si l'expertise sous-évalue les dommages ou exclut certaines réparations, vous pouvez contester. Demandez d'abord des explications écrites à l'expert. Fournissez des devis de confrères ou des barèmes constructeur pour étayer votre position. Si nécessaire, demandez une contre-expertise par un expert indépendant. Documentez tous vos échanges dans l'application. En cas de blocage persistant, saisissez le service contentieux de la compagnie d'assurance."
      },
      {
        question: "Comment optimiser mes relations avec les experts ?",
        answer: "Maintenez des relations professionnelles avec les experts de votre secteur : accueillez-les correctement, fournissez des devis précis et justifiés, respectez les délais demandés, proposez des créneaux de rendez-vous flexibles. Invitez-les à visiter votre atelier pour qu'ils comprennent vos méthodes de travail. Un bon relationnel facilite les négociations et peut influencer positivement l'évaluation des dossiers complexes."
      },
      {
        question: "Comment gérer les expertises amiables ?",
        answer: "Pour les petits sinistres, proposez une expertise amiable directement avec l'assurance pour accélérer le processus. Présentez un devis détaillé avec photos des dommages. L'assurance peut valider sans expertise physique si les montants restent raisonnables. Cette méthode réduit les délais (5-10 jours au lieu de 3-4 semaines) et améliore la satisfaction client. Suivez les directives spécifiques de chaque compagnie pour les seuils et procédures d'expertise amiable."
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
      },
      {
        question: "Comment gérer ma TVA ?",
        answer: "L'application calcule automatiquement la TVA selon les taux en vigueur : 20% sur les prestations et pièces neuves, 20% sur la main-d'œuvre, taux réduits selon réglementation. Générez vos déclarations TVA (mensuelle/trimestrielle) avec le détail des opérations. Export direct vers les téléprocédures fiscales. Gestion de la TVA déductible sur achats avec rapprochement automatique. Alertes pour les seuils de franchise et changements de régime."
      },
      {
        question: "Comment analyser ma rentabilité ?",
        answer: "Le tableau de bord comptable présente vos indicateurs clés : marge brute par activité (carrosserie, mécanique, peinture), évolution du chiffre d'affaires, analyse des charges par poste, seuil de rentabilité. Comparez vos performances avec les moyennes du secteur. Identifiez vos activités les plus/moins rentables pour optimiser votre stratégie commerciale. Suivi des ratios financiers et alertes sur les déviations budgétaires importantes."
      },
      {
        question: "Comment prévoir ma trésorerie ?",
        answer: "L'outil de prévision analyse vos factures impayées, échéances fournisseurs, charges fixes récurrentes pour projeter votre trésorerie sur 3 mois. Intégrez vos prévisionnels de commandes et planning d'interventions. Identifiez les périodes de tension et anticipez vos besoins de financement. Simulez différents scénarios (retards de paiement, saisonnalité) pour sécuriser votre activité. Alertes automatiques en cas de trésorerie prévisionnelle négative."
      },
      {
        question: "Comment gérer mes immobilisations ?",
        answer: "Enregistrez vos équipements (pont élévateur, cabine de peinture, outillage) avec leurs valeurs d'acquisition, dates de mise en service et durées d'amortissement. Le système calcule automatiquement les dotations aux amortissements selon les durées fiscales ou comptables. Suivi des maintenances préventives et curative, calcul de la rentabilité par équipement. Gestion des cessions et mises au rebut avec impact sur les résultats."
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
      },
      {
        question: "L'IA peut-elle gérer mes relances clients automatiquement ?",
        answer: "Oui, l'assistant IA peut automatiser vos relances de paiement selon des règles personnalisables. Il analyse les habitudes de paiement de chaque client pour adapter le ton et la fréquence des relances. L'IA peut envoyer des rappels par email, SMS ou courrier selon vos préférences. Elle escalade automatiquement vers des actions plus fermes en cas de non-réponse. Vous gardez toujours le contrôle final avant les actions importantes comme la mise en demeure."
      },
      {
        question: "Comment l'IA aide-t-elle à optimiser mon planning ?",
        answer: "L'IA analyse vos historiques pour optimiser automatiquement votre planning : elle estime les durées réelles d'intervention selon le type de réparation et le technicien, propose des créneaux optimaux en fonction des compétences et disponibilités, anticipe les retards potentiels et suggest des réorganisations. Elle peut même proposer des plannings alternatifs pour maximiser votre productivité ou minimiser les temps d'attente clients."
      },
      {
        question: "Mes données sont-elles protégées avec l'IA ?",
        answer: "Absolument. L'IA fonctionne entièrement sur nos serveurs sécurisés en France, vos données ne sont jamais transmises à des tiers. L'apprentissage se fait uniquement sur vos propres données d'activité pour personnaliser les suggestions. Nous respectons strictement le RGPD et vous pouvez désactiver l'IA à tout moment. L'historique des actions proposées par l'IA est traçable et vous gardez toujours le contrôle des décisions importantes."
      }
    ]
  },
  {
    id: "data-security",
    title: "Sécurité et données",
    icon: <Bot className="h-5 w-5" />,
    items: [
      {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Vos données sont hébergées sur des serveurs sécurisés en France avec cryptage SSL/TLS. Sauvegardes automatiques quotidiennes, accès sécurisé par authentification forte, surveillance 24h/24. Conformité RGPD stricte avec possibilité d'export et suppression des données. Nos serveurs respectent les certifications ISO 27001 et HDS (Hébergement de Données de Santé). Aucune donnée n'est partagée avec des tiers sans votre consentement explicite."
      },
      {
        question: "Puis-je récupérer toutes mes données ?",
        answer: "Oui, vous pouvez exporter l'intégralité de vos données à tout moment aux formats Excel/CSV et PDF. L'export inclut : clients, véhicules, factures, devis, ordres de réparation, paiements, documents joints. Les données sont fournies dans des formats standards compatibles avec d'autres logiciels. En cas de résiliation, nous conservons vos données 3 mois pour permettre la récupération avant suppression définitive et irréversible."
      },
      {
        question: "Comment sont gérées les mises à jour ?",
        answer: "Les mises à jour sont déployées automatiquement sans interruption de service. Nous testons toutes les évolutions sur des environnements dédiés avant déploiement. Vous êtes informé par email des nouvelles fonctionnalités importantes. Les mises à jour de sécurité sont appliquées immédiatement. Un système de rollback permet de revenir à la version précédente en cas de problème. Historique complet des versions disponible dans l'aide."
      },
      {
        question: "Que se passe-t-il en cas de panne ?",
        answer: "Notre infrastructure redondante assure une disponibilité maximale (99.9% de SLA). En cas d'incident majeur, nos équipes techniques interviennent 24h/24. Vous êtes informé en temps réel via email et la page de statut du service. Les données sont protégées par des sauvegardes multiples sur plusieurs datacenters. Procédure de plan de reprise d'activité testée régulièrement pour garantir la continuité de service."
      }
    ]
  },
  {
    id: "advanced-features",
    title: "Fonctionnalités avancées",
    icon: <Bot className="h-5 w-5" />,
    items: [
      {
        question: "Comment utiliser les API pour intégrer d'autres logiciels ?",
        answer: "Nos API REST permettent d'intégrer l'application avec vos autres outils : logiciel comptable, ERP, site web, CRM. Documentation technique complète disponible avec exemples de code. Authentification par clés API sécurisées. Webhooks disponibles pour recevoir les notifications en temps réel (nouvelle facture, paiement reçu). Support technique dédié pour accompagner vos développements d'intégration."
      },
      {
        question: "Puis-je personnaliser les champs et formulaires ?",
        answer: "Oui, dans 'Paramètres' > 'Personnalisation', ajoutez des champs personnalisés aux fiches clients, véhicules et interventions. Types de champs disponibles : texte, nombre, date, liste déroulante, case à cocher, fichier. Organisez vos champs par onglets pour une meilleure ergonomie. Les champs personnalisés sont inclus dans les exports et peuvent être utilisés dans les recherches et filtres. Sauvegarde automatique des configurations."
      },
      {
        question: "Comment configurer les utilisateurs et permissions ?",
        answer: "Dans 'Paramètres' > 'Utilisateurs', créez des comptes pour vos employés avec des niveaux d'accès différenciés : administrateur (tous droits), gestionnaire (création/modification), consultation seule, comptable (accès facturation/paiements uniquement). Définissez les modules accessibles par utilisateur. Traçabilité complète des actions utilisateurs. Possibilité de désactiver temporairement un compte sans perdre l'historique des actions."
      },
      {
        question: "Comment automatiser mes workflows ?",
        answer: "Créez des automatisations dans 'Paramètres' > 'Workflows' : envoi automatique de devis après création, relances de paiement programmées, notifications de maintenance véhicules, alertes stock bas pour les pièces détachées. Définissez les conditions de déclenchement et les actions à effectuer. Testez vos workflows avant activation. Logs détaillés pour suivre l'exécution des automatisations. Interface glisser-déposer pour créer facilement vos processus."
      }
    ]
  }
];
