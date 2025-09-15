import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ActionModalExtended from './ActionModalExtended';
import { useToast } from '@/hooks/use-toast';
import { X, User, Calendar, Phone, Mail, CreditCard, FileText, AlertTriangle, Package, CheckCircle, Calculator } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  modalData: any;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, actionType, modalData }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Fonctions pour gérer les actions des boutons
  const handleMiseAbri = async () => {
    setIsLoading('mise_abri');
    
    // Simulation d'une action réelle
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Mise à l'abri effectuée",
      description: "Les 4 véhicules ont été transférés vers le hangar couvert. Notifications clients envoyées.",
    });
    
    setIsLoading(null);
    onClose();
  };

  const handleProgrammerDeplacer = () => {
    toast({
      title: "Déplacement programmé", 
      description: "Le déplacement est planifié pour demain 8h. Équipe assignée.",
    });
    onClose();
  };

  const handleProgrammerEtuvage = async () => {
    setIsLoading('etuvage');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Étuvage programmé",
      description: "Étuve n°1 réservée pour 2h d'étuvage accéléré. Livraison demain 10h.",
    });
    
    setIsLoading(null);
    onClose();
  };

  const handleAjusterCreneaux = () => {
    toast({
      title: "Créneaux ajustés",
      description: "Planning optimisé selon vos préférences. 3 créneaux modifiés.",
    });
    onClose();
  };

  const handleContentieux = async () => {
    setIsLoading('contentieux');
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    toast({
      title: "Procédure contentieuse initiée",
      description: "Dossier transmis au service juridique. Première relance LRAR programmée.",
    });
    
    setIsLoading(null);
    onClose();
  };

  const handleNegocierArrangement = () => {
    toast({
      title: "Négociation d'arrangement",
      description: "Proposition d'échelonnement envoyée au client. Suivi programmé dans 48h.",
    });
    onClose();
  };

  const handleProgrammerExpertise = async () => {
    setIsLoading('expertise');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Expertise programmée",
      description: "RDV confirmé demain 14h avec M. BERNARD. Notifications envoyées.",
    });
    
    setIsLoading(null);
    onClose();
  };

  const handlePreparerDossier = () => {
    toast({
      title: "Dossier sinistre préparé",
      description: "Documents compilés et transmis à l'assureur. Suivi automatique activé.",
    });
    onClose();
  };

  const handleCommanderAlternatif = async () => {
    setIsLoading('commande');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Commande alternative validée",
      description: "Pièce compatible commandée chez fournisseur alternatif. Livraison 48h.",
    });
    
    setIsLoading(null);
    onClose();
  };

  const handleChercherOccasion = () => {
    toast({
      title: "Recherche pièce occasion",
      description: "3 pièces d'occasion trouvées. Vérification qualité en cours.",
    });
    onClose();
  };

  const handleInterventionCabine = async () => {
    setIsLoading('intervention');
    
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    toast({
      title: "Intervention programmée",
      description: "Technicien maintenance dépêché. Intervention prévue dans 30min.",
    });
    
    setIsLoading(null);
    onClose();
  };

  const handleReorganiserPlanning = () => {
    toast({
      title: "Planning réorganisé", 
      description: "8 véhicules redistribués sur cabine n°1. Planning optimisé.",
    });
    onClose();
  };

  // Handler générique pour les actions simples
  const handleGenericAction = (title: string, description: string) => {
    toast({ title, description });
    onClose();
  };

  // Handler générique pour les actions avec loading
  const handleGenericAsyncAction = async (loadingKey: string, title: string, description: string, delay = 1500) => {
    setIsLoading(loadingKey);
    await new Promise(resolve => setTimeout(resolve, delay));
    toast({ title, description });
    setIsLoading(null);
    onClose();
  };

  // Handlers spécifiques pour les périodes semaine et mois
  const handleMaintenancePreventive = async () => {
    setIsLoading('maintenance');
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Planning maintenance validé",
      description: "5 équipements programmés. Optimisation trajets : -34km économisés."
    });
    setIsLoading(null);
    onClose();
  };

  const handleRelancerAssureurs = async () => {
    setIsLoading('relances');
    await new Promise(resolve => setTimeout(resolve, 1800));
    toast({
      title: "Relances assureurs envoyées",
      description: "12 dossiers relancés automatiquement. Suivi programmé J+3."
    });
    setIsLoading(null);
    onClose();
  };

  const handleProgrammerLivraisons = async () => {
    setIsLoading('livraisons');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Livraisons programmées",
      description: "8 véhicules planifiés. Clients notifiés. CA à encaisser : 23.5k€."
    });
    setIsLoading(null);
    onClose();
  };

  const handleCommanderStockUrgent = async () => {
    setIsLoading('stock_urgent');
    await new Promise(resolve => setTimeout(resolve, 2200));
    toast({
      title: "Commandes stock urgentes validées",
      description: "15 références commandées. Budget 6.8k€. Livraison sous 48h."
    });
    setIsLoading(null);
    onClose();
  };

  const handleAnalyserRentabilite = async () => {
    setIsLoading('analyse');
    await new Promise(resolve => setTimeout(resolve, 2500));
    toast({
      title: "Analyse rentabilité complétée",
      description: "Rapport généré. Marge brute 37%. Recommandations d'optimisation disponibles."
    });
    setIsLoading(null);
    onClose();
  };

  const handleNegocierContratsAssurance = async () => {
    setIsLoading('negociation');
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast({
      title: "Négociations contractuelles initiées",
      description: "3 assureurs contactés. Dossiers techniques transmis. Suivi J+7."
    });
    setIsLoading(null);
    onClose();
  };

  const handleProgrammerFormationVE = async () => {
    setIsLoading('formation');
    await new Promise(resolve => setTimeout(resolve, 1700));
    toast({
      title: "Formation VE programmée",
      description: "4 carrossiers inscrits. Certification Tesla + BMW i. Début le 15/01."
    });
    setIsLoading(null);
    onClose();
  };

  const handleValiderInvestissement = async () => {
    setIsLoading('investissement');
    await new Promise(resolve => setTimeout(resolve, 2800));
    toast({
      title: "Investissement validé",
      description: "67k€ approuvés. Marbre + système mixage. ROI 24 mois. Financement étalé."
    });
    setIsLoading(null);
    onClose();
  };

  // Handlers supplémentaires pour tous les autres cas
  const handleReplanifierMeteo = async () => {
    setIsLoading('replanification');
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Replanification validée",
      description: "3 chantiers reportés. Équipes réassignées. Gain productivité +15%."
    });
    setIsLoading(null);
    onClose();
  };

  const handleRelancePaiement = async () => {
    setIsLoading('relance_paiement');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Relance envoyée",
      description: "Email + AR envoyé à DUPONT SARL. Appel programmé J+2."
    });
    setIsLoading(null);
    onClose();
  };

  const handleInterventionUrgence = async () => {
    setIsLoading('intervention');
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast({
      title: "Intervention déclenchée",
      description: "Pierre MARTIN en route. ETA 12 minutes. Client informé."
    });
    setIsLoading(null);
    onClose();
  };

  const handleVerifierStock = async () => {
    setIsLoading('stock');
    await new Promise(resolve => setTimeout(resolve, 800));
    toast({
      title: "Stock vérifié",
      description: "Matériel préparé en 8 minutes. Véhicule VU-247 prêt à partir."
    });
    setIsLoading(null);
    onClose();
  };

  const handleNegocierEcheances = async () => {
    setIsLoading('echeances');
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Échéancier proposé",
      description: "Plan de paiement 6 mois envoyé. Première échéance réduite à 800€."
    });
    setIsLoading(null);
    onClose();
  };

  const handleProgrammerReparation = async () => {
    setIsLoading('reparation');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Réparation programmée",
      description: "Intervention planifiée mardi 9h. Pièces commandées. Client informé."
    });
    setIsLoading(null);
    onClose();
  };

  const handleSolutionTemporaire = async () => {
    setIsLoading('temporaire');
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Solution temporaire déployée",
      description: "Générateur de secours installé. Système opérationnel sous 30min."
    });
    setIsLoading(null);
    onClose();
  };

  const handleReviserTarifs = async () => {
    setIsLoading('tarifs');
    await new Promise(resolve => setTimeout(resolve, 2200));
    toast({
      title: "Grille tarifaire révisée",
      description: "Tarifs main d'œuvre +5€/h. Peinture +3€/h. Marge cible 40% atteinte."
    });
    setIsLoading(null);
    onClose();
  };

  const handleEtudierConcurrence = async () => {
    setIsLoading('concurrence');
    await new Promise(resolve => setTimeout(resolve, 1800));
    toast({
      title: "Étude concurrentielle finalisée",
      description: "Positionnement analysé. Avantages compétitifs identifiés. Stratégie définie."
    });
    setIsLoading(null);
    onClose();
  };

  const handleBudgeterEquipements = async () => {
    setIsLoading('budget');
    await new Promise(resolve => setTimeout(resolve, 2500));
    toast({
      title: "Budget équipements VE validé",
      description: "Investissement 45k€ approuvé. Pont électrique + outils spécialisés."
    });
    setIsLoading(null);
    onClose();
  };

  const handleEtudierFinancement = async () => {
    setIsLoading('financement');
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Options de financement étudiées",
      description: "Crédit-bail retenu. Mensualité 1.890€. Première échéance dans 60 jours."
    });
    setIsLoading(null);
    onClose();
  };
  // Vérifier si c'est une modal étendue
  const extendedModalTypes = ['audit_fiscal', 'analyser_ecarts', 'dossier_sinistre', 'commande_express', 'virement_urgence'];
  
  if (extendedModalTypes.includes(actionType)) {
    return (
      <ActionModalExtended
        isOpen={isOpen}
        onClose={onClose}
        actionType={actionType}
        modalData={modalData}
      />
    );
  }
  const renderModalContent = () => {
    switch (actionType) {
      case 'resolve_alert':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Résolution d'alerte de retard
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Vous vous apprêtez à marquer cette alerte comme traitée. Cette action est irréversible.
                </p>
                <p className="font-medium">
                  Employé concerné: {modalData?.employeeName || 'Non spécifié'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10"
                onClick={async () => {
                  setIsLoading('resolve');
                  if (modalData?.resolveAlert && modalData?.alertId) {
                    const success = await modalData.resolveAlert(modalData.alertId);
                    if (success) {
                      toast({
                        title: "Alerte résolue",
                        description: "L'alerte de retard a été marquée comme traitée avec succès.",
                      });
                    } else {
                      toast({
                        title: "Erreur",
                        description: "Impossible de résoudre l'alerte. Veuillez réessayer.",
                        variant: "destructive"
                      });
                    }
                  }
                  setIsLoading(null);
                  onClose();
                }}
                disabled={isLoading === 'resolve'}
              >
                {isLoading === 'resolve' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Résolution...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Marquer comme traité
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                onClick={onClose}
                disabled={isLoading !== null}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Annuler
              </Button>
            </div>
          </div>
        );

      case 'contact_employee':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Contact employé
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Actions rapides pour contacter l'employé concernant son retard.
                </p>
                <p className="font-medium">
                  Employé: {modalData?.employeeName || 'Non spécifié'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline"
                className="text-xs sm:text-sm h-8 sm:h-10"
                onClick={() => {
                  toast({
                    title: "Appel en cours",
                    description: "Numérotation automatique vers l'employé...",
                  });
                  onClose();
                }}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Appeler
              </Button>
              <Button 
                variant="outline"
                className="text-xs sm:text-sm h-8 sm:h-10"
                onClick={() => {
                  toast({
                    title: "SMS envoyé",
                    description: "Message de rappel envoyé à l'employé.",
                  });
                  onClose();
                }}
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Envoyer SMS
              </Button>
            </div>
          </div>
        );

      case 'replanifier_meteo':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Chantiers impactés
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-card rounded border-l-4 border-l-destructive">
                  <span>Rénovation façade - MARTIN SARL</span>
                  <span className="text-muted-foreground">2-3 jours de retard</span>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border-l-4 border-l-destructive">
                  <span>Couverture toiture - DUPOND & CIE</span>
                  <span className="text-muted-foreground">1-2 jours de retard</span>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border-l-4 border-l-destructive">
                  <span>Terrassement - BATIMECA</span>
                  <span className="text-muted-foreground">3 jours de retard</span>
                </div>
              </div>
            </div>
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Proposition de replanification IA</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Optimisation automatique basée sur la météo, disponibilité équipes et priorités client
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nouveau créneau optimal:</span>
                  <span className="font-medium">Vendredi 15h - Lundi 17h</span>
                </div>
                <div className="flex justify-between">
                  <span>Gain de productivité:</span>
                  <span className="text-green-600 font-medium">+15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Équipes disponibles:</span>
                  <span className="font-medium">3/3 équipes</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleReplanifierMeteo}
                disabled={isLoading === 'replanification'}
              >
                {isLoading === 'replanification' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Valider la replanification
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Modification manuelle', 'Interface de planification ouverte. Modifications manuelles activées.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Modifier manuellement
              </Button>
            </div>
          </div>
        );

      case 'relance_paiement':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h4 className="font-medium">DUPONT SARL</h4>
                  <p className="text-sm text-muted-foreground">Facture #INV-2024-0847</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Montant:</span>
                  <p className="font-medium text-lg">4 520€</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Retard:</span>
                  <p className="font-medium text-lg text-destructive">43 jours</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Contact:</span>
                  <p className="font-medium">M. Jean Dupont</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dernière relance:</span>
                  <p className="font-medium">Il y a 12 jours</p>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Séquence de relance recommandée</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Aujourd'hui: Email de relance + AR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>J+2: Appel téléphonique</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>J+7: Mise en demeure LRAR</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>J+15: Saisie contentieux</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleRelancePaiement}
                disabled={isLoading === 'relance_paiement'}
              >
                {isLoading === 'relance_paiement' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Envoyer relance
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Appel programmé', 'Rappel téléphonique planifié demain 14h avec M. Dupont.')}
                disabled={isLoading !== null}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Programmer appel
              </Button>
            </div>
          </div>
        );

      case 'intervention_urgence':
        return (
          <div className="space-y-4">
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Intervention d'urgence</span>
              </div>
              <h4 className="font-medium mb-2">Cabinet médical BERNARD</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Système électrique d'urgence hors service - Activité paralysée
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Délai contractuel:</span>
                  <p className="font-medium text-destructive">2h maximum</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Temps restant:</span>
                  <p className="font-medium text-destructive">1h 23min</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Équipe d'intervention assignée</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Technicien:</span>
                  <span className="font-medium">Pierre MARTIN (Expert électrique)</span>
                </div>
                <div className="flex justify-between">
                  <span>ETA:</span>
                  <span className="font-medium text-green-600">12 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Pièces disponibles:</span>
                  <span className="font-medium text-green-600">✓ En stock</span>
                </div>
                <div className="flex justify-between">
                  <span>Facturation:</span>
                  <span className="font-medium">Majoration urgence +100%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleInterventionUrgence}
                disabled={isLoading === 'intervention'}
              >
                {isLoading === 'intervention' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Déclenchement...</span>
                  </div>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Déclencher intervention
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Client contacté', 'Client informé de la situation. ETA technicien communiqué.')}
                disabled={isLoading !== null}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Contacter le client
              </Button>
            </div>
          </div>
        );

      case 'maintenance_preventive':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3">Planning maintenance optimisé</h4>
              <div className="space-y-3">
                <div className="p-3 bg-card rounded border-l-4 border-l-karrosserie-orange">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">Secteur Nord</span>
                    <span className="text-xs text-muted-foreground">Lundi 14h-18h</span>
                  </div>
                  <p className="text-xs text-muted-foreground">3 équipements - SARL MARTIN, DUPOND & CIE, BATIMECA</p>
                </div>
                <div className="p-3 bg-card rounded border-l-4 border-l-karrosserie-orange">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">Secteur Centre</span>
                    <span className="text-xs text-muted-foreground">Mardi 9h-12h</span>
                  </div>
                  <p className="text-xs text-muted-foreground">2 équipements - CABINET BERNARD, BRASSERIE DU PORT</p>
                </div>
                <div className="p-3 bg-card rounded border-l-4 border-l-karrosserie-orange">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">Secteur Sud</span>
                    <span className="text-xs text-muted-foreground">Mercredi 14h-17h</span>
                  </div>
                  <p className="text-xs text-muted-foreground">3 équipements - FINANCIERE OCCITANE, ASSUR+ CONSEIL</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Optimisation des trajets</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Kilométrage total:</span>
                  <span className="font-medium">127 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Économie vs planning manuel:</span>
                  <span className="text-green-600 font-medium">-34 km (-21%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps total estimé:</span>
                  <span className="font-medium">18h 30min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleMaintenancePreventive}
                disabled={isLoading === 'maintenance'}
              >
                {isLoading === 'maintenance' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Valider le planning
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Créneaux ajustés', 'Planning modifié selon vos préférences. 3 interventions reprogrammées.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Ajuster les créneaux
              </Button>
            </div>
          </div>
        );

      case 'alternatives_meteo':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Solutions alternatives météo
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-card rounded border-l-4 border-l-karrosserie-orange">
                  <div className="text-sm font-medium mb-1">Travaux couverts disponibles</div>
                  <p className="text-xs text-muted-foreground">Finitions intérieures - Électricité - Plomberie</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tâches intérieures MARTIN SARL:</span>
                    <span className="text-green-600 font-medium">2 jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Électricité BATIMECA:</span>
                    <span className="text-green-600 font-medium">1.5 jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Report DUPOND & CIE:</span>
                    <span className="text-karrosserie-orange font-medium">Lundi matin</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Optimisation proposée</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Avancer les travaux intérieurs de 2 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Prévenir les clients des ajustements</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Mise à jour planning automatique</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={() => handleGenericAsyncAction('alternatives', 'Alternatives appliquées', 'Travaux intérieurs avancés de 2 jours. Clients prévenus des ajustements.')}
                disabled={isLoading === 'alternatives'}
              >
                {isLoading === 'alternatives' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Application...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Appliquer les alternatives
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Planning personnalisé', 'Interface de planification ouverte. Ajustements manuels activés.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Personnaliser planning
              </Button>
            </div>
          </div>
        );

      case 'verifier_stock':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Vérification stock d'urgence
              </h4>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">Pièces disponibles en stock</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-green-600">Disjoncteur 32A:</span>
                      <p className="font-medium">3 unités</p>
                    </div>
                    <div>
                      <span className="text-green-600">Câble 4mm²:</span>
                      <p className="font-medium">50m</p>
                    </div>
                    <div>
                      <span className="text-green-600">Boîtier étanche:</span>
                      <p className="font-medium">5 unités</p>
                    </div>
                    <div>
                      <span className="text-green-600">Relais secours:</span>
                      <p className="font-medium">2 unités</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Préparation intervention</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temps préparation:</span>
                  <span className="font-medium text-green-600">8 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Outillage spécialisé:</span>
                  <span className="font-medium text-green-600">Disponible</span>
                </div>
                <div className="flex justify-between">
                  <span>Véhicule équipé:</span>
                  <span className="font-medium text-green-600">VU-247 prêt</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleVerifierStock}
                disabled={isLoading === 'stock'}
              >
                {isLoading === 'stock' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Préparation...</span>
                  </div>
                ) : (
                  <>
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Préparer matériel
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Pièces commandées', 'Commande urgente lancée. Livraison express sous 4h.')}
                disabled={isLoading !== null}
              >
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Commander pièces manquantes
              </Button>
            </div>
          </div>
        );

      case 'negocier_echeances':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Négociation échéances - DUPONT SARL
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-karrosserie-orange">
                  <div className="text-sm font-medium mb-1">Proposition d'échelonnement</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Montant total:</span>
                      <p className="font-medium">4 520€</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Durée proposée:</span>
                      <p className="font-medium">3 mensualités</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-accent rounded">
                    <span>1ère mensualité (immédiat):</span>
                    <span className="font-medium">1 520€</span>
                  </div>
                  <div className="flex justify-between p-2 bg-accent rounded">
                    <span>2ème mensualité (J+30):</span>
                    <span className="font-medium">1 500€</span>
                  </div>
                  <div className="flex justify-between p-2 bg-accent rounded">
                    <span>3ème mensualité (J+60):</span>
                    <span className="font-medium">1 500€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Conditions négociées</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Aucun frais d'échelonnement</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Avenant au contrat automatique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Relances préventives activées</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleNegocierEcheances}
                disabled={isLoading === 'echeances'}
              >
                {isLoading === 'echeances' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Valider échelonnement
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Conditions modifiées', 'Nouvel échelonnement sur 6 mois proposé. Première mensualité réduite.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Modifier conditions
              </Button>
            </div>
          </div>
        );

      case 'programmer_reparation':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Programmation réparation - LA BRASSERIE
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-destructive">
                  <div className="text-sm font-medium text-destructive mb-1">Climatisation défaillante</div>
                  <p className="text-xs text-muted-foreground">Température extérieure prévue: 35°C</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Technicien assigné:</span>
                    <p className="font-medium">Michel BERNARD</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Créneau optimal:</span>
                    <p className="font-medium text-green-600">Aujourd'hui 19h</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durée estimée:</span>
                    <p className="font-medium">2h 30min</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pièce nécessaire:</span>
                    <p className="font-medium">Compresseur (stock OK)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Planning d'intervention</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Arrivée sur site:</span>
                  <span className="font-medium">19h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Diagnostic complet:</span>
                  <span className="font-medium">19h15</span>
                </div>
                <div className="flex justify-between">
                  <span>Remplacement compresseur:</span>
                  <span className="font-medium">20h30</span>
                </div>
                <div className="flex justify-between">
                  <span>Tests et mise en service:</span>
                  <span className="font-medium">21h30</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Confirmer intervention
              </Button>
              <Button variant="outline" className="flex-1">
                Ajuster horaire
              </Button>
            </div>
          </div>
        );

      case 'solution_temporaire':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Solution temporaire d'urgence
              </h4>
              <div className="space-y-3">
                <div className="bg-karrosserie-orange/10 p-3 rounded border border-karrosserie-orange/20">
                  <div className="text-sm font-medium text-karrosserie-orange mb-1">Climatiseur mobile disponible</div>
                  <p className="text-xs text-muted-foreground">Unité 12000 BTU - Installation immédiate</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Puissance:</span>
                    <p className="font-medium">12 000 BTU</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Surface couverte:</span>
                    <p className="font-medium">45m²</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Installation:</span>
                    <p className="font-medium text-green-600">30 minutes</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location/jour:</span>
                    <p className="font-medium">89€ TTC</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Plan d'action immédiat</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Déploiement sous 1h maximum</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Information client en cours</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Bon de commande automatique</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleSolutionTemporaire}
                disabled={isLoading === 'temporaire'}
              >
                {isLoading === 'temporaire' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Déploiement...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Déployer maintenant
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Conditions négociées', 'Tarifs préférentiels obtenus. Contrat d\'urgence signé.')}
                disabled={isLoading !== null}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Négocier conditions
              </Button>
            </div>
          </div>
        );

      case 'mise_abri_vehicules':
        return (
          <div className="space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
                Mise à l'abri urgente - 4 véhicules
              </h4>
              <div className="space-y-2">
                <div className="bg-destructive/10 p-2 rounded border border-destructive/20">
                  <div className="text-xs sm:text-sm font-medium text-destructive mb-1">Peinture fraîche exposée aux intempéries</div>
                  <p className="text-xs text-muted-foreground">Risque de défauts irréversibles si exposition prolongée</p>
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-2 bg-card rounded border-l-2 border-l-karrosserie-orange">
                    <span className="font-medium">Peugeot 308 - Zone B2</span>
                    <span className="text-destructive font-medium text-xs">Peinture 6h de séchage</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-card rounded border-l-2 border-l-karrosserie-orange">
                    <span className="font-medium">Renault Clio - Zone B3</span>
                    <span className="text-destructive font-medium text-xs">Vernis en cours</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-card rounded border-l-2 border-l-karrosserie-orange">
                    <span className="font-medium">BMW X1 - Zone B1</span>
                    <span className="text-destructive font-medium text-xs">Apprêt frais</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Plan d'action immédiat</h4>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Transfert vers hangar couvert sous 15 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Équipe de 3 carrossiers mobilisée</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Notification clients automatique des délais</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleMiseAbri}
                disabled={isLoading === 'mise_abri'}
              >
                {isLoading === 'mise_abri' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>En cours...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Mise à l'abri immédiate
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={handleProgrammerDeplacer}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Programmer déplacement
              </Button>
            </div>
          </div>
        );

      case 'programmer_etuvage':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Programmation étuvage accéléré
              </h4>
              <div className="space-y-3">
                <div className="bg-accent p-3 rounded">
                  <div className="text-sm font-medium mb-1">Étuves disponibles</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-green-600">Étuve n°1:</span>
                      <p className="font-medium">Libre - 60°C prête</p>
                    </div>
                    <div>
                      <span className="text-karrosserie-orange">Étuve n°2:</span>
                      <p className="font-medium">Occupée jusqu'à 16h</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Temps d'étuvage optimisé:</span>
                    <span className="font-medium text-green-600">2h au lieu de 8h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommation énergétique:</span>
                    <span className="font-medium">+35€ par véhicule</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison possible:</span>
                    <span className="font-medium text-green-600">Demain 10h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleProgrammerEtuvage}
                disabled={isLoading === 'etuvage'}
              >
                {isLoading === 'etuvage' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Programmation...</span>
                  </div>
                ) : (
                  <>
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Programmer étuvage
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={handleAjusterCreneaux}
                disabled={isLoading !== null}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Séchage naturel prolongé
              </Button>
            </div>
          </div>
        );

      case 'contentieux_client':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-destructive" />
                Procédure contentieuse - Mme MARTIN
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-destructive">
                  <div className="text-sm font-medium mb-1">Peugeot 308 - Réparation sinistre</div>
                  <p className="text-xs text-muted-foreground">Véhicule livré le 10/10/2024 - Facture impayée</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Montant dû:</span>
                    <p className="font-medium text-destructive">2 847€ TTC</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Retard:</span>
                    <p className="font-medium text-destructive">45 jours</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Relances envoyées:</span>
                    <p className="font-medium">7 courriers + emails</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Statut client:</span>
                    <p className="font-medium text-destructive">Injoignable</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Étapes contentieuses</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Mise en demeure LRAR automatique</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Saisine huissier après 15 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Inscription FICP si nécessaire</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleContentieux}
                disabled={isLoading === 'contentieux'}
              >
                {isLoading === 'contentieux' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Initialisation...</span>
                  </div>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Lancer contentieux
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={handleNegocierArrangement}
                disabled={isLoading !== null}
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Dernière relance amiable
              </Button>
            </div>
          </div>
        );

      case 'programmer_expertise':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Programmation expertise - BMW X3 2019
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-karrosserie-orange">
                  <div className="text-sm font-medium mb-1">Sinistre automobile - Choc frontal</div>
                  <p className="text-xs text-muted-foreground">Assurance MAIF - Contrat n° 12847539</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Expert assigné:</span>
                    <p className="font-medium">M. BERNARD (MAIF)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Disponibilité:</span>
                    <p className="font-medium text-green-600">Demain 14h</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durée prévue:</span>
                    <p className="font-medium">1h 30min</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Photos préparatoires:</span>
                    <p className="font-medium text-green-600">Prises et envoyées</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Préparation expertise</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dossier technique:</span>
                  <span className="text-green-600 font-medium">Complet</span>
                </div>
                <div className="flex justify-between">
                  <span>Devis préliminaire:</span>
                  <span className="text-green-600 font-medium">8 450€ TTC</span>
                </div>
                <div className="flex justify-between">
                  <span>Pièces détachées:</span>
                  <span className="text-green-600 font-medium">Disponibilité vérifiée</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={() => handleGenericAsyncAction('expertise', 'Expertise confirmée', 'RDV confirmé demain 14h avec l\'expert MAIF. Notifications envoyées.')}
                disabled={isLoading === 'expertise'}
              >
                {isLoading === 'expertise' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirmation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Confirmer RDV expertise
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Report programmé', 'Expertise reportée à la semaine prochaine. Client et assureur informés.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Reporter à plus tard
              </Button>
            </div>
          </div>
        );

      case 'commander_alternatif':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Commande alternative - Pare-choc BMW Série 3
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-1">Stock principal épuisé</div>
                  <p className="text-xs text-muted-foreground">Délai fournisseur BMW : 10 jours ouvrés</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">AUTODISTRIB FRANCE</span>
                      <span className="text-green-600 font-medium">Stock: 2 unités</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Livraison: 24h</span>
                      <span>Prix: 385€ HT (+15€)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border border-karrosserie-orange/50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">PIECES AUTO EXPRESS</span>
                      <span className="text-karrosserie-orange font-medium">Livraison: 48h</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Stock: 1 unité</span>
                      <span>Prix: 370€ HT (prix normal)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Impact sur planning</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Véhicules débloqués:</span>
                  <span className="font-medium text-green-600">3 BMW Série 3</span>
                </div>
                <div className="flex justify-between">
                  <span>Économie pénalités:</span>
                  <span className="font-medium text-green-600">4 500€ (10j × 450€)</span>
                </div>
                <div className="flex justify-between">
                  <span>Surcoût fournisseur:</span>
                  <span className="font-medium text-destructive">+45€ (3 × 15€)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Commander AUTODISTRIB
              </Button>
              <Button variant="outline" className="flex-1">
                Comparer d'autres prix
              </Button>
            </div>
          </div>
        );

      case 'intervention_cabine':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Intervention urgente - Cabine de peinture n°2
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-1">Surchauffe système ventilation</div>
                  <p className="text-xs text-muted-foreground">Température actuelle: 42°C (Normal: 22°C)</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Technicien disponible:</span>
                    <p className="font-medium text-green-600">Pierre MAINTENANCE</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pièce suspectée:</span>
                    <p className="font-medium">Ventilateur extracteur</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock pièce:</span>
                    <p className="font-medium text-green-600">1 unité disponible</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durée intervention:</span>
                    <p className="font-medium">2h maximum</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Plan d'intervention</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Arrêt cabine immédiat pour sécurité</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Diagnostic complet système ventilation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Remplacement ventilateur si confirmé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Tests et remise en service</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Intervention immédiate
              </Button>
              <Button variant="outline" className="flex-1">
                Programmer maintenance
              </Button>
            </div>
          </div>
        );

      case 'negocier_arrangement':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Négociation arrangement - Mme MARTIN
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-karrosserie-orange">
                  <div className="text-sm font-medium mb-1">Proposition d'arrangement amiable</div>
                  <p className="text-xs text-muted-foreground">Éviter les frais de procédure - Solution gagnant/gagnant</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-accent rounded">
                    <div className="flex justify-between">
                      <span>Remise commerciale (10%):</span>
                      <span className="font-medium text-green-600">-285€</span>
                    </div>
                  </div>
                  <div className="p-2 bg-accent rounded">
                    <div className="flex justify-between">
                      <span>Montant réduit:</span>
                      <span className="font-medium">2 562€</span>
                    </div>
                  </div>
                  <div className="p-2 bg-accent rounded">
                    <div className="flex justify-between">
                      <span>Paiement échelonné:</span>
                      <span className="font-medium text-green-600">3 × 854€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Avantages arrangement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Évite frais d'huissier (150-300€)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Préserve relation client</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Encaissement rapide garanti</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Proposer arrangement
              </Button>
              <Button variant="outline" className="flex-1">
                Maintenir montant initial
              </Button>
            </div>
          </div>
        );

      case 'preparer_dossier_sinistre':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Préparation dossier sinistre - BMW X3 2019
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-karrosserie-orange">
                  <div className="text-sm font-medium mb-1">Documents requis par l'assureur MAIF</div>
                  <p className="text-xs text-muted-foreground">Dossier complet pour accélération traitement</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
                    <span>✓ Constat amiable</span>
                    <span className="text-green-600 font-medium">Scanné</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
                    <span>✓ Photos dégâts multiples</span>
                    <span className="text-green-600 font-medium">27 photos HD</span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>📋 Devis réparation détaillé</span>
                    <span className="text-primary font-medium">En préparation</span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded">
                    <span>📋 Facture véhicule courtoisie</span>
                    <span className="text-primary font-medium">À générer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Éléments techniques</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temps de main d'œuvre:</span>
                  <span className="font-medium">18h estimées</span>
                </div>
                <div className="flex justify-between">
                  <span>Pièces détachées:</span>
                  <span className="font-medium text-green-600">Liste établie</span>
                </div>
                <div className="flex justify-between">
                  <span>Sous-traitance peinture:</span>
                  <span className="font-medium">4 600€ HT</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Finaliser dossier
              </Button>
              <Button variant="outline" className="flex-1">
                Compléter photos
              </Button>
            </div>
          </div>
        );

      case 'chercher_occasion':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Recherche pièce occasion - Pare-choc BMW Série 3
              </h4>
              <div className="space-y-3">
                <div className="bg-accent p-3 rounded">
                  <div className="text-sm font-medium mb-1">Casses automobiles partenaires</div>
                  <p className="text-xs text-muted-foreground">Réseau de 847 casses référencées</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">AUTO RECYCLAGE 34</span>
                      <span className="text-green-600 font-medium">État: Excellent</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>BMW 320d 2018 - 15 000km</span>
                      <span>Prix: 195€ HT (-50%)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border border-karrosserie-orange/50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">PIECES OCCASION SUD</span>
                      <span className="text-karrosserie-orange font-medium">État: Bon</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>BMW 318i 2019 - 32 000km</span>
                      <span>Prix: 165€ HT (-55%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Avantages pièce occasion</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Économie vs neuf:</span>
                  <span className="font-medium text-green-600">-190€ par pare-choc</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponibilité:</span>
                  <span className="font-medium text-green-600">Immédiate</span>
                </div>
                <div className="flex justify-between">
                  <span>Garantie casse:</span>
                  <span className="font-medium">3 mois retour</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Commander occasion
              </Button>
              <Button variant="outline" className="flex-1">
                Négocier prix
              </Button>
            </div>
          </div>
        );

      case 'reorganiser_planning':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Réorganisation planning peinture
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-1">Cabine n°2 hors service</div>
                  <p className="text-xs text-muted-foreground">Capacité réduite 50% - 8 véhicules en attente</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded border-l-4 border-l-green-500">
                    <div className="flex justify-between">
                      <span>Cabine n°1 - Priorité absolue</span>
                      <span className="text-green-600 font-medium">BMW X3 + Peugeot 208</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border-l-4 border-l-karrosserie-orange">
                    <div className="flex justify-between">
                      <span>Sous-traitance externe</span>
                      <span className="text-karrosserie-orange font-medium">3 véhicules</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border-l-4 border-l-destructive">
                    <div className="flex justify-between">
                      <span>Report nécessaire</span>
                      <span className="text-destructive font-medium">3 véhicules (+2j)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Optimisation proposée</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cabine n°1 - Sessions étendues:</span>
                  <span className="font-medium text-green-600">+4h/jour</span>
                </div>
                <div className="flex justify-between">
                  <span>Sous-traitance CARROSSE PRO:</span>
                  <span className="font-medium text-karrosserie-orange">+85€/véhicule</span>
                </div>
                <div className="flex justify-between">
                  <span>Retard client maximum:</span>
                  <span className="font-medium text-green-600">2 jours</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Valider réorganisation
              </Button>
              <Button variant="outline" className="flex-1">
                Négocier sous-traitance
              </Button>
            </div>
          </div>
        );

      case 'ajuster_creneaux_maintenance':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Ajustement créneaux maintenance
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-karrosserie-orange">
                  <div className="text-sm font-medium mb-1">Planning maintenance optimisé</div>
                  <p className="text-xs text-muted-foreground">Éviter interruptions pendant heures de pointe</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-accent rounded">
                    <div className="flex justify-between">
                      <span>Cabine peinture n°1 - Entretien ventilation:</span>
                      <span className="font-medium text-green-600">Mardi 7h-9h</span>
                    </div>
                  </div>
                  <div className="p-2 bg-accent rounded">
                    <div className="flex justify-between">
                      <span>Marbre redressage - Calibrage:</span>
                      <span className="font-medium text-green-600">Mercredi 18h-20h</span>
                    </div>
                  </div>
                  <div className="p-2 bg-accent rounded">
                    <div className="flex justify-between">
                      <span>Compresseur - Vidange + filtres:</span>
                      <span className="font-medium text-green-600">Vendredi 12h-13h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Valider nouveau planning
              </Button>
              <Button variant="outline" className="flex-1">
                Proposer alternatives
              </Button>
            </div>
          </div>
        );

      case 'relancer_assureurs':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Relances assureurs - Sinistres en cours
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded border-l-4 border-l-destructive">
                    <div className="flex justify-between items-center">
                      <span>MAIF - BMW X3 (Expertise en attente)</span>
                      <span className="text-destructive font-medium">J+8</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border-l-4 border-l-karrosserie-orange">
                    <div className="flex justify-between items-center">
                      <span>AXA - Peugeot 308 (Devis non validé)</span>
                      <span className="text-karrosserie-orange font-medium">J+5</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border-l-4 border-l-green-500">
                    <div className="flex justify-between items-center">
                      <span>GROUPAMA - Renault Clio (Accord obtenu)</span>
                      <span className="text-green-600 font-medium">Validé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Actions de relance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email automatique avec photos complémentaires</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Appel direct gestionnaire sinistre</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Transmission devis détaillé</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleRelancerAssureurs}
                disabled={isLoading === 'relances'}
              >
                {isLoading === 'relances' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Lancer relances
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Rappels programmés', 'Rappels automatiques activés. Suivi personnalisé J+3.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Programmer rappels
              </Button>
            </div>
          </div>
        );

      case 'preparer_expertises':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Préparation expertises - 3 véhicules
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Audi A4 - Expert MAIF</span>
                      <span className="text-green-600 font-medium">Jeudi 14h</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ✓ Photos prises ✓ Devis préparé ⏳ Nettoyage véhicule
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Mercedes Classe C - Expert AXA</span>
                      <span className="text-karrosserie-orange font-medium">Vendredi 10h</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ✓ Photos prises ⏳ Devis en cours ⏳ Démontage pièces
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Volkswagen Golf - Expert GROUPAMA</span>
                      <span className="text-primary font-medium">Vendredi 16h</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ✓ Photos prises ✓ Devis prêt ✓ Véhicule préparé
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Check-list expertise</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Photos détaillées prises:</span>
                  <span className="text-green-600 font-medium">3/3 véhicules</span>
                </div>
                <div className="flex justify-between">
                  <span>Devis détaillés:</span>
                  <span className="text-karrosserie-orange font-medium">2/3 finalisés</span>
                </div>
                <div className="flex justify-between">
                  <span>Véhicules nettoyés:</span>
                  <span className="text-primary font-medium">En cours</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Finaliser préparations
              </Button>
              <Button variant="outline" className="flex-1">
                Vérifier planning
              </Button>
            </div>
          </div>
        );

      case 'programmer_livraisons':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Planning livraisons - 8 véhicules prêts
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex justify-between items-center">
                      <span>Mme MARTIN - Peugeot 308</span>
                      <span className="text-green-600 font-medium">Lundi 9h ✓</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>M. DUPOND - BMW Série 3</span>
                      <span className="text-primary font-medium">Lundi 14h</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>Mme BERNARD - Renault Clio</span>
                      <span className="text-primary font-medium">Mardi 10h</span>
                    </div>
                  </div>
                  <div className="p-2 bg-karrosserie-orange/10 rounded border border-karrosserie-orange/20">
                    <div className="flex justify-between items-center">
                      <span>M. MICHEL - Audi A4 (+ 5 autres)</span>
                      <span className="text-karrosserie-orange font-medium">À programmer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Optimisation livraisons</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Créneaux disponibles:</span>
                  <span className="font-medium text-green-600">12 slots cette semaine</span>
                </div>
                <div className="flex justify-between">
                  <span>Préparation véhicules:</span>
                  <span className="font-medium">2h par véhicule</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux confirmation RDV:</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleProgrammerLivraisons}
                disabled={isLoading === 'livraisons'}
              >
                {isLoading === 'livraisons' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Optimisation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Optimiser planning
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Créneaux proposés', 'Créneaux de livraison envoyés aux 6 clients. 5 confirmations reçues.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Proposer créneaux
              </Button>
            </div>
          </div>
        );

      case 'commander_stock_urgent':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-destructive" />
                Commandes urgentes - 15 références critiques
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-1">Stock critique atteint</div>
                  <p className="text-xs text-muted-foreground">Risque rupture sous 48h - Intervention immédiate</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>Peinture base RAL 9003 (blanc pur)</span>
                      <span className="text-destructive font-medium">Stock: 0.5L</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>Optique avant Peugeot 308</span>
                      <span className="text-destructive font-medium">Stock: 1 unité</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>Pare-choc avant BMW Série 3</span>
                      <span className="text-destructive font-medium">Stock: 0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Commande express</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Montant total commande:</span>
                  <span className="font-medium text-destructive">6 847€ HT</span>
                </div>
                <div className="flex justify-between">
                  <span>Délai livraison express:</span>
                  <span className="font-medium text-green-600">24-48h</span>
                </div>
                <div className="flex justify-between">
                  <span>Véhicules débloqués:</span>
                  <span className="font-medium text-green-600">7 réparations</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleCommanderStockUrgent}
                disabled={isLoading === 'stock_urgent'}
              >
                {isLoading === 'stock_urgent' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Commande...</span>
                  </div>
                ) : (
                  <>
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Commander maintenant
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Délais négociés', 'Fournisseur contacté. Réduction délai obtenue : 10 jours → 5 jours.')}
                disabled={isLoading !== null}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Négocier délais
              </Button>
            </div>
          </div>
        );

      case 'analyser_rentabilite':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Analyse rentabilité mensuelle
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded">
                  <div className="text-sm font-medium mb-2">Répartition CA par type de prestation</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Carrosserie:</span>
                      <p className="font-medium text-green-600">78 450€ (55%)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peinture:</span>
                      <p className="font-medium text-green-600">42 300€ (30%)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mécanique:</span>
                      <p className="font-medium">15 680€ (11%)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expertise:</span>
                      <p className="font-medium">5 570€ (4%)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Marge moyenne carrosserie:</span>
                    <span className="font-medium text-green-600">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marge moyenne peinture:</span>
                    <span className="font-medium text-green-600">38%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coût main d'œuvre/h:</span>
                    <span className="font-medium text-karrosserie-orange">67€ HT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Recommandations IA</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Augmenter tarif peinture de 5€/h (objectif 40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Optimiser approvisionnement pièces (-3%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Former équipe prestations haute valeur</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleAnalyserRentabilite}
                disabled={isLoading === 'analyse'}
              >
                {isLoading === 'analyse' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Application...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Appliquer recommandations
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Rapport détaillé généré', 'Rapport complet avec analyses sectorielles et recommandations personnalisées créé.')}
                disabled={isLoading !== null}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Rapport détaillé
              </Button>
            </div>
          </div>
        );

      case 'negocier_contrats_assurance':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Négociation contrats assureurs
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded">
                  <div className="text-sm font-medium mb-2">Enjeux par assureur (CA annuel)</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-accent rounded">
                      <span>MAIF - 34% du CA total</span>
                      <span className="font-medium text-green-600">48 200€</span>
                    </div>
                    <div className="flex justify-between p-2 bg-accent rounded">
                      <span>AXA - 22% du CA total</span>
                      <span className="font-medium text-green-600">31 100€</span>
                    </div>
                    <div className="flex justify-between p-2 bg-accent rounded">
                      <span>GROUPAMA - 12% du CA total</span>
                      <span className="font-medium">16 950€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Points de négociation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Délais paiement : 30 jours au lieu de 45</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Tarifs préférentiels main d'œuvre (+8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Ligne directe expertise (gain 48h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Formation certifiante véhicules récents</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleNegocierContratsAssurance}
                disabled={isLoading === 'negociation'}
              >
                {isLoading === 'negociation' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Programmation...</span>
                  </div>
                ) : (
                  <>
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Programmer négociations
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Dossier technique préparé', 'Arguments de négociation et métriques de performance compilés.')}
                disabled={isLoading !== null}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Préparer dossier
              </Button>
            </div>
          </div>
        );

      case 'programmer_formation_ve':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Formation véhicules électriques
              </h4>
              <div className="space-y-3">
                <div className="bg-accent p-3 rounded">
                  <div className="text-sm font-medium mb-1">Certifications visées</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-green-600">✓ Tesla Service Center</span>
                      <p className="text-muted-foreground">5 jours - 1 890€/pers</p>
                    </div>
                    <div>
                      <span className="text-green-600">✓ BMW i Certified</span>
                      <p className="text-muted-foreground">3 jours - 1 350€/pers</p>
                    </div>
                    <div>
                      <span className="text-primary">◦ Renault Electric</span>
                      <p className="text-muted-foreground">2 jours - 890€/pers</p>
                    </div>
                    <div>
                      <span className="text-primary">◦ Peugeot e-Service</span>
                      <p className="text-muted-foreground">2 jours - 790€/pers</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Carrossiers sélectionnés:</span>
                    <span className="font-medium">Pierre, Marc, Julie, Thomas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coût total formation:</span>
                    <span className="font-medium text-destructive">12 840€ TTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI estimé:</span>
                    <span className="font-medium text-green-600">14 mois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Planning formation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tesla - Pierre & Marc:</span>
                  <span className="font-medium text-green-600">Janvier 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>BMW i - Julie & Thomas:</span>
                  <span className="font-medium text-green-600">Février 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Impact planning atelier:</span>
                  <span className="font-medium text-karrosserie-orange">-15% pendant formation</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleProgrammerFormationVE}
                disabled={isLoading === 'formation'}
              >
                {isLoading === 'formation' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Valider formations
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Subventions trouvées', 'Aides OPCO et région identifiées. Dossier de financement préparé.')}
                disabled={isLoading !== null}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Rechercher subventions
              </Button>
            </div>
          </div>
        );

      case 'valider_investissement':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Validation investissement équipements
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded">
                  <div className="text-sm font-medium mb-2">Équipements prioritaires</div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-accent rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Marbre redressage CELETTE</span>
                        <span className="text-destructive font-medium">42 000€ HT</span>
                      </div>
                      <div className="text-muted-foreground">Remplacement urgent - Fin de vie atteinte</div>
                    </div>
                    <div className="p-2 bg-accent rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Station mixage peinture SATA</span>
                        <span className="text-destructive font-medium">25 000€ HT</span>
                      </div>
                      <div className="text-muted-foreground">Amélioration précision couleur (+30%)</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Investissement total:</span>
                    <span className="font-medium text-destructive">67 000€ HT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gain productivité estimé:</span>
                    <span className="font-medium text-green-600">+15% (2 340€/mois)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retour sur investissement:</span>
                    <span className="font-medium text-green-600">24 mois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Impact business</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Réduction délais réparation : -20%</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Amélioration qualité finition</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Capacité véhicules haut de gamme</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleValiderInvestissement}
                disabled={isLoading === 'investissement'}
              >
                {isLoading === 'investissement' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Valider investissement
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Paiement étalé', 'Plan de financement sur 36 mois négocié. Première échéance dans 60 jours.')}
                disabled={isLoading !== null}
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Étaler paiement
              </Button>
            </div>
          </div>
        );

      case 'contacter_clients_livraison':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contact clients pour livraisons
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex justify-between items-center">
                      <span>M. DUPOND - BMW Série 3</span>
                      <span className="text-green-600 font-medium">Confirmé lundi 14h</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>Mme BERNARD - Renault Clio</span>
                      <span className="text-primary font-medium">À contacter</span>
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center">
                      <span>M. MICHEL - Audi A4</span>
                      <span className="text-primary font-medium">À contacter</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    + 3 autres clients à contacter
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Message type de contact</h4>
              <div className="p-3 bg-card rounded border text-sm">
                <p className="italic text-muted-foreground">
                  "Bonjour [Client], votre véhicule est prêt ! Nous pouvons organiser la livraison dès [jour]. 
                  Préférez-vous [matin/après-midi] ? Merci de nous confirmer votre disponibilité."
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Envoyer SMS groupés
              </Button>
              <Button variant="outline" className="flex-1">
                Appels individuels
              </Button>
            </div>
          </div>
        );

      case 'negocier_delais_stock':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Négociation délais fournisseurs
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">AUTODIS FRANCE</span>
                      <span className="text-green-600 font-medium">24h confirmé</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Peinture + optiques - Relation privilégiée
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">BMW PARTS CENTER</span>
                      <span className="text-karrosserie-orange font-medium">72h (négociable)</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pièces BMW - Commande groupée possible
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">PEUGEOT PIECES</span>
                      <span className="text-destructive font-medium">5j standard</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Express possible +15% - À négocier
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Leviers de négociation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Volume annuel : 45 000€ HT (argument fidélité)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Paiement comptant (remise 2%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Commandes groupées mensuelles</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Négocier maintenant
              </Button>
              <Button variant="outline" className="flex-1">
                Proposer partenariat
              </Button>
            </div>
          </div>
        );

      case 'reviser_tarifs':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Révision grille tarifaire 2025
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded">
                  <div className="text-sm font-medium mb-2">Comparatif concurrence locale</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Carrosserie MARTIN:</span>
                      <p className="font-medium">72€/h (+7%)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">AUTO PRESTIGE:</span>
                      <p className="font-medium">78€/h (+16%)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nos tarifs actuels:</span>
                      <p className="font-medium text-green-600">67€/h (base)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Marge objective:</span>
                      <p className="font-medium text-karrosserie-orange">40% (vs 37%)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Augmentation recommandée:</span>
                    <span className="font-medium text-green-600">+5€/h (67€ → 72€)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impact CA annuel:</span>
                    <span className="font-medium text-green-600">+12 500€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risque perte clientèle:</span>
                    <span className="font-medium text-green-600">Faible (2-3%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Communication clients</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email d'information 1 mois avant</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Justification : inflation, qualité service</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Tarif préférentiel clients fidèles</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleReviserTarifs}
                disabled={isLoading === 'tarifs'}
              >
                {isLoading === 'tarifs' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Application...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Appliquer nouveaux tarifs
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Test en cours', 'Nouveaux tarifs testés sur 10 clients. Retours positifs à 85%.')}
                disabled={isLoading !== null}
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Tester sur échantillon
              </Button>
            </div>
          </div>
        );

      case 'etudier_concurrence':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Étude concurrentielle locale
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded border-l-4 border-l-green-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">CARROSSERIE MARTIN</span>
                      <span className="text-green-600 font-medium">Concurrent principal</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ✓ Tarifs similaires ✓ Qualité équivalente ⚠️ Délais +30%
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border-l-4 border-l-karrosserie-orange">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">AUTO PRESTIGE</span>
                      <span className="text-karrosserie-orange font-medium">Haut de gamme</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ⚠️ Tarifs +25% ✓ Équipements récents ✓ Clientèle premium
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded border-l-4 border-l-destructive">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">RAPID CARROSS</span>
                      <span className="text-destructive font-medium">Low cost</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ⚠️ Tarifs -20% ⚠️ Qualité variable ✓ Délais courts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Notre positionnement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Avantage concurrentiel:</span>
                  <span className="font-medium text-green-600">Rapport qualité/prix</span>
                </div>
                <div className="flex justify-between">
                  <span>Point faible vs concurrence:</span>
                  <span className="font-medium text-destructive">Communication digitale</span>
                </div>
                <div className="flex justify-between">
                  <span>Opportunité identifiée:</span>
                  <span className="font-medium text-green-600">Marché véhicules électriques</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleEtudierConcurrence}
                disabled={isLoading === 'concurrence'}
              >
                {isLoading === 'concurrence' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </div>
                ) : (
                  <>
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Plan d'action concurrentiel
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Veille programmée', 'Surveillance concurrentielle mensuelle activée. Alertes automatiques.')}
                disabled={isLoading !== null}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Veille mensuelle
              </Button>
            </div>
          </div>
        );

      case 'budgeter_equipements':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Budget équipements véhicules électriques
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Outillage isolation électrique</span>
                      <span className="text-destructive font-medium">8 500€ HT</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Gants, tapis, outils isolés - Sécurité obligatoire
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Station diagnostic VE/Hybride</span>
                      <span className="text-destructive font-medium">15 200€ HT</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Valises multi-marques Tesla, BMW, Audi, Mercedes
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Pont élévateur isolé</span>
                      <span className="text-destructive font-medium">12 800€ HT</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Spécial VE - Isolation batteries hautes tensions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">ROI et financement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Investissement total:</span>
                  <span className="font-medium text-destructive">36 500€ HT</span>
                </div>
                <div className="flex justify-between">
                  <span>CA additionnel VE estimé:</span>
                  <span className="font-medium text-green-600">+28k€/an</span>
                </div>
                <div className="flex justify-between">
                  <span>Retour sur investissement:</span>
                  <span className="font-medium text-green-600">18 mois</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleBudgeterEquipements}
                disabled={isLoading === 'budget'}
              >
                {isLoading === 'budget' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validation...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Valider budget
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Subventions trouvées', 'Aides ADEME et région identifiées. Dossier de demande préparé.')}
                disabled={isLoading !== null}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Rechercher subventions
              </Button>
            </div>
          </div>
        );

      case 'etudier_financement':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Options de financement équipements
              </h4>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-card rounded border border-green-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Crédit-bail professionnel</span>
                      <span className="text-green-600 font-medium">Recommandé</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      48 mois - 1 580€/mois - Option rachat 8% VN
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Prêt équipement BNP</span>
                      <span className="text-primary font-medium">Alternative</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      60 mois - 1 290€/mois - Taux 4.2% - Propriété immédiate
                    </div>
                  </div>
                  <div className="p-2 bg-card rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Autofinancement</span>
                      <span className="text-karrosserie-orange font-medium">Possible</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      67k€ - Trésorerie actuelle : 89k€ - Reste 22k€
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Avantages fiscaux</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Amortissement dégressif possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Crédit d'impôt modernisation (15%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Economies IS : -10 050€ la 1ère année</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={handleEtudierFinancement}
                disabled={isLoading === 'financement'}
              >
                {isLoading === 'financement' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sélection...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Choisir crédit-bail
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={() => handleGenericAction('Offres comparées', 'Analyse comparative des 3 solutions de financement détaillée.')}
                disabled={isLoading !== null}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Comparer offres
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Action mission
              </h4>
              <p className="text-sm text-muted-foreground">
                Action exécutable depuis le tour de contrôle.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105"
                onClick={() => handleGenericAction('Action exécutée', 'Mission accomplie avec succès. Système mis à jour.')}
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Exécuter
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 hover:scale-105 hover:bg-muted"
                onClick={onClose}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Annuler
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2 flex-shrink-0">
          <DialogTitle className="text-base sm:text-lg font-semibold text-card-foreground">
            {modalData?.title || 'Action'}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-1">
          {renderModalContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;