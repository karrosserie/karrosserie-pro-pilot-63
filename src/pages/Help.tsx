import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Car, 
  FileText, 
  CreditCard, 
  Clock, 
  DollarSign, 
  Receipt, 
  Bot,
  Settings,
  Search,
  Phone,
  Mail
} from 'lucide-react';

const Help = () => {
  const faqSections = [
    {
      id: "getting-started",
      title: "🚀 Prise en main",
      icon: <Settings className="h-5 w-5" />,
      items: [
        {
          question: "Comment me connecter à l'application ?",
          answer: "Utilisez vos identifiants fournis lors de l'inscription. Cliquez sur 'Se connecter' et saisissez votre email et mot de passe. Si vous avez oublié votre mot de passe, utilisez le lien 'Mot de passe oublié'."
        },
        {
          question: "Comment naviguer dans l'interface ?",
          answer: "L'application est organisée en modules accessibles via le menu latéral : Tableau de bord, Clients, Véhicules, Documents, Cessions, etc. Chaque section a ses propres fonctionnalités. Sur mobile, utilisez le bouton menu en haut à gauche."
        },
        {
          question: "Comment personnaliser mon profil ?",
          answer: "Rendez-vous dans 'Paramètres' > 'Profil' pour modifier vos informations personnelles, changer votre mot de passe et configurer vos préférences d'affichage."
        }
      ]
    },
    {
      id: "clients",
      title: "👥 Gestion des clients",
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          question: "Comment créer un nouveau client ?",
          answer: "Allez dans 'Clients' puis cliquez sur '+ Nouveau client'. Remplissez les informations obligatoires : nom, prénom, email, téléphone. Vous pouvez ajouter l'adresse et des documents (permis de conduire). Cliquez sur 'Enregistrer'."
        },
        {
          question: "Comment modifier un client existant ?",
          answer: "Dans la liste des clients, cliquez sur l'icône crayon à droite de la ligne du client. Modifiez les informations nécessaires et sauvegardez. Vous pouvez aussi accéder à la fiche complète en cliquant sur le nom du client."
        },
        {
          question: "Comment rechercher un client ?",
          answer: "Utilisez la barre de recherche en haut de la liste des clients. Vous pouvez rechercher par nom, prénom, email ou téléphone. Les filtres avancés permettent de trier par type de client ou statut."
        },
        {
          question: "Comment ajouter des documents au dossier client ?",
          answer: "Dans la fiche client, onglet 'Documents', vous pouvez uploader le permis de conduire (recto/verso) et d'autres documents utiles. Les formats acceptés sont PDF, JPEG, PNG."
        }
      ]
    },
    {
      id: "vehicles",
      title: "🚗 Gestion des véhicules",
      icon: <Car className="h-5 w-5" />,
      items: [
        {
          question: "Comment ajouter un véhicule ?",
          answer: "Dans 'Véhicules', cliquez sur '+ Nouveau véhicule'. Associez-le à un client, renseignez la marque, modèle, année, plaque d'immatriculation. Le numéro VIN permet un remplissage automatique des informations techniques."
        },
        {
          question: "Comment fonctionne le décodage VIN automatique ?",
          answer: "Saisissez un numéro VIN de 17 caractères valide. L'application décode automatiquement la marque, le modèle et l'année de fabrication grâce à notre API intégrée qui reconnaît plus de 500 codes constructeurs."
        },
        {
          question: "Quelles informations puis-je enregistrer pour un véhicule ?",
          answer: "Informations techniques : marque, modèle, année, VIN, plaque, couleur, carburant, kilométrage. Documents : carte grise recto/verso, photos du véhicule. Vous pouvez aussi suivre l'historique des interventions."
        },
        {
          question: "Comment associer un véhicule à un client ?",
          answer: "Lors de la création du véhicule, sélectionnez le client dans la liste déroulante. Si le client n'existe pas encore, créez-le d'abord. Un client peut avoir plusieurs véhicules."
        }
      ]
    },
    {
      id: "repair-orders",
      title: "🔧 Ordres de réparation",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          question: "Comment créer un ordre de réparation ?",
          answer: "Dans 'Documents' > 'Ordres de réparation', cliquez sur 'Nouvel ordre'. Sélectionnez le client et le véhicule, ajoutez les réparations nécessaires avec descriptions, quantités et prix. Le système calcule automatiquement les totaux."
        },
        {
          question: "Comment ajouter des réparations et pièces ?",
          answer: "Dans l'ordre de réparation, utilisez les sections 'Réparations' et 'Pièces détachées'. Pour chaque ligne, indiquez la description, quantité, prix unitaire. Les calculs (sous-total, TVA, total) se font automatiquement."
        },
        {
          question: "Comment gérer les statuts des ordres ?",
          answer: "Les statuts disponibles sont : 'En cours', 'Terminé', 'Facturé'. Changez le statut selon l'avancement des travaux. Un ordre 'Terminé' peut être converti en facture directement."
        },
        {
          question: "Comment convertir un ordre en facture ?",
          answer: "Dans la liste des ordres, cliquez sur l'action 'Convertir en facture' pour un ordre avec le statut 'Terminé'. Toutes les informations sont reprises automatiquement dans la nouvelle facture."
        }
      ]
    },
    {
      id: "quotes-invoices",
      title: "📄 Devis et factures",
      icon: <Receipt className="h-5 w-5" />,
      items: [
        {
          question: "Comment créer un devis ?",
          answer: "Dans 'Documents' > 'Devis', créez un nouveau devis en sélectionnant client et véhicule. Ajoutez les prestations avec descriptions et prix. Le devis peut être converti en ordre de réparation une fois accepté par le client."
        },
        {
          question: "Comment envoyer un devis par email ?",
          answer: "Dans la fiche devis, cliquez sur 'Envoyer par email'. Rédigez votre message, l'application génère automatiquement le PDF du devis en pièce jointe et l'envoie au client."
        },
        {
          question: "Comment créer une facture ?",
          answer: "Deux possibilités : créer une facture manuellement dans 'Documents' > 'Factures', ou convertir automatiquement un ordre de réparation terminé. La facture reprend toutes les informations avec numérotation automatique."
        },
        {
          question: "Comment gérer les avoirs ?",
          answer: "Dans 'Documents' > 'Avoirs', créez un avoir pour annuler tout ou partie d'une facture. Sélectionnez la facture concernée, indiquez le montant et la raison du remboursement."
        }
      ]
    },
    {
      id: "cessions",
      title: "💳 Cessions de créance",
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        {
          question: "Qu'est-ce qu'une cession de créance ?",
          answer: "La cession de créance permet à votre client de vous céder ses droits au remboursement d'assurance. Résultat : l'assurance vous paie directement au lieu de rembourser le client, ce qui améliore votre trésorerie."
        },
        {
          question: "Comment créer une cession de créance ?",
          answer: "Dans 'Cession de créance', cliquez sur 'Nouvelle cession'. Sélectionnez un ordre de réparation existant, les informations client/véhicule/montant sont automatiquement récupérées. Générez les documents légaux nécessaires."
        },
        {
          question: "Quels sont les statuts d'une cession ?",
          answer: "Les statuts suivent le processus : 'En attente' (création), 'Envoyée' (transmise à l'assurance), 'Acceptée' (validée par l'assurance), 'Payée' (encaissement effectué)."
        },
        {
          question: "Comment suivre l'avancement des cessions ?",
          answer: "Le tableau de bord des cessions affiche toutes vos demandes avec leurs statuts. Vous pouvez filtrer par statut, client ou assurance pour suivre l'évolution de vos dossiers en cours."
        }
      ]
    },
    {
      id: "fleet",
      title: "🚙 Véhicules de courtoisie",
      icon: <Clock className="h-5 w-5" />,
      items: [
        {
          question: "Comment gérer ma flotte de véhicules de courtoisie ?",
          answer: "Dans 'Véhicules de courtoisie', ajoutez vos véhicules de prêt avec leurs caractéristiques. Vous pouvez suivre leur disponibilité, les réserver pour vos clients et gérer les contrats de prêt."
        },
        {
          question: "Comment faire une réservation de véhicule ?",
          answer: "Créez une nouvelle réservation en sélectionnant le client, le véhicule disponible et les dates de prêt. Le système génère automatiquement le contrat de prêt avec état des lieux."
        },
        {
          question: "Comment gérer les retours de véhicules ?",
          answer: "Lors du retour, complétez l'état des lieux de sortie, notez les éventuels dommages et validez le retour. Le véhicule redevient automatiquement disponible pour de nouvelles réservations."
        }
      ]
    },
    {
      id: "expertise",
      title: "📋 Rapports d'expertise",
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          question: "Comment importer un rapport d'expertise ?",
          answer: "Dans 'Documents' > 'Rapports d'expertise', utilisez l'outil d'import pour télécharger les rapports PDF. L'application extrait automatiquement les informations principales et les associe aux véhicules et clients concernés."
        },
        {
          question: "Comment traiter un rapport d'expertise ?",
          answer: "Une fois importé, vérifiez les informations extraites, associez le rapport au bon client et véhicule si nécessaire, et renseignez les données complémentaires (expert, montants, statut)."
        },
        {
          question: "Comment suivre le statut des expertises ?",
          answer: "Les statuts disponibles sont : 'Importé', 'En cours d'analyse', 'En attente', 'Validé', 'Rejeté'. Modifiez le statut selon l'avancement du dossier d'expertise."
        }
      ]
    },
    {
      id: "payments",
      title: "💰 Paiements et comptabilité",
      icon: <DollarSign className="h-5 w-5" />,
      items: [
        {
          question: "Comment enregistrer un encaissement ?",
          answer: "Dans 'Paiements' > 'Encaissements', créez un nouveau reçu en sélectionnant la facture concernée. Choisissez le mode de paiement (espèces, carte, virement, chèque) et le montant encaissé."
        },
        {
          question: "Comment gérer les dépenses ?",
          answer: "Dans 'Paiements' > 'Dépenses', enregistrez vos achats de pièces, prestations externes, frais généraux. Associez chaque dépense à un fournisseur et une catégorie pour un suivi précis."
        },
        {
          question: "Comment consulter ma comptabilité ?",
          answer: "Le module 'Comptabilité' offre une vue d'ensemble de votre activité : chiffre d'affaires, dépenses, marges, évolution mensuelle. Utilisez les filtres de période pour analyser vos performances."
        },
        {
          question: "Comment exporter mes données comptables ?",
          answer: "Dans la section comptabilité, utilisez les boutons d'export pour générer des rapports PDF ou Excel. Ces exports sont compatibles avec la plupart des logiciels comptables."
        }
      ]
    },
    {
      id: "ai-assistant",
      title: "🤖 Assistant IA",
      icon: <Bot className="h-5 w-5" />,
      items: [
        {
          question: "Comment fonctionne l'assistant IA ?",
          answer: "L'assistant IA vous aide à automatiser certaines tâches répétitives, suggère des optimisations de processus et peut répondre à vos questions sur l'utilisation de l'application."
        },
        {
          question: "Quelles tâches peut automatiser l'IA ?",
          answer: "L'IA peut aider à : catégoriser automatiquement les dépenses, suggérer des réparations selon les véhicules, optimiser la planification des interventions, et générer des rapports personnalisés."
        },
        {
          question: "Comment activer les suggestions automatiques ?",
          answer: "Dans les paramètres de l'assistant IA, activez les suggestions pour les modules qui vous intéressent. L'IA apprend de vos habitudes pour proposer des améliorations pertinentes."
        }
      ]
    }
  ];

  const supportInfo = {
    email: "support@karrosseriepro.fr",
    phone: "01 23 45 67 89",
    hours: "Lundi au vendredi, 9h-18h"
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Centre d'aide Karrosserie Pro
        </h1>
        <p className="text-lg text-gray-600">
          Trouvez rapidement les réponses à vos questions sur l'utilisation de votre application.
        </p>
      </div>

      {/* Search functionality could be added here */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher dans la FAQ..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6 mb-12">
        {faqSections.map((section) => (
          <Card key={section.id} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                {section.icon}
                {section.title}
                <Badge variant="secondary" className="ml-auto">
                  {section.items.length} questions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, index) => (
                  <AccordionItem key={index} value={`${section.id}-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Contact */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">
            Besoin d'aide supplémentaire ?
          </CardTitle>
          <CardDescription className="text-blue-700">
            Notre équipe support est là pour vous aider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Email</p>
                <p className="text-blue-700">{supportInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Téléphone</p>
                <p className="text-blue-700">{supportInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Horaires</p>
                <p className="text-blue-700">{supportInfo.hours}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;