import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ActionModalExtended from './ActionModalExtended';
import { X, User, Calendar, Phone, Mail, CreditCard, FileText, AlertTriangle } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  modalData: any;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, actionType, modalData }) => {
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Valider la replanification
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer relance
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
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
              <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Déclencher intervention
              </Button>
              <Button variant="outline">
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
              <Button className="bg-primary hover:bg-primary/90">
                Valider le planning
              </Button>
              <Button variant="outline">
                Ajuster les créneaux
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Contenu de la modal à définir</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold text-card-foreground">
            {modalData?.title || 'Action'}
          </DialogTitle>
        </DialogHeader>
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;