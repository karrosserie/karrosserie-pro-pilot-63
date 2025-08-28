import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calculator, Building2, Shield, Truck, Banknote, FileText, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

interface ActionModalExtendedProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  modalData: any;
}

const ActionModalExtended: React.FC<ActionModalExtendedProps> = ({ isOpen, onClose, actionType, modalData }) => {
  const renderModalContent = () => {
    switch (actionType) {
      case 'audit_fiscal':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Client: FINANCIERE OCCITANE
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-karrosserie-orange">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contrôle URSSAF</span>
                    <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">Urgent</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Période: 2022-2024</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Documents requis:</span>
                    <p className="font-medium">847 pièces</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Délai restant:</span>
                    <p className="font-medium text-destructive">37h 24min</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Génération automatique du dossier</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Extraction DSN 2022-2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Bordereaux URSSAF automatiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Pièces justificatives organisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Note de synthèse préparée</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                <FileText className="h-4 w-4 mr-2" />
                Générer le dossier
              </Button>
              <Button variant="outline" className="flex-1">
                Programmer RDV expert
              </Button>
            </div>
          </div>
        );

      case 'analyser_ecarts':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Analyse des écarts comptables
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-1">Écart détecté: 2 847€</div>
                  <p className="text-xs text-muted-foreground">156 écritures en suspens</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-card p-2 rounded text-center">
                    <div className="font-medium">67€</div>
                    <div className="text-muted-foreground">Erreurs saisie</div>
                  </div>
                  <div className="bg-card p-2 rounded text-center">
                    <div className="font-medium">1.2k€</div>
                    <div className="text-muted-foreground">Lettrage manquant</div>
                  </div>
                  <div className="bg-card p-2 rounded text-center">
                    <div className="font-medium">1.6k€</div>
                    <div className="text-muted-foreground">Rapproch. bancaire</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Corrections proposées par l'IA</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Lettrage automatique clients</span>
                  <span className="text-green-600 font-medium">+1 247€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rapprochement OD bancaires</span>
                  <span className="text-green-600 font-medium">+1 580€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Correction erreurs TVA</span>
                  <span className="text-green-600 font-medium">+20€</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-medium">
                  <span>Total corrections</span>
                  <span className="text-green-600">2 847€</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Appliquer corrections
              </Button>
              <Button variant="outline" className="flex-1">
                Révision manuelle
              </Button>
            </div>
          </div>
        );

      case 'dossier_sinistre':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Constitution dossier sinistre
              </h4>
              <div className="space-y-3">
                <div className="bg-card p-3 rounded border-l-4 border-l-destructive">
                  <div className="text-sm font-medium">Dégât des eaux - ASSUR+ CONSEIL</div>
                  <p className="text-xs text-muted-foreground">Sinistre survenu le 23/11/2024 à 14h30</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Perte d'exploitation:</span>
                    <p className="font-medium text-destructive">8 500€/jour</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durée estimée:</span>
                    <p className="font-medium">5-7 jours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Documents à fournir</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Constat de sinistre</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Photos des dégâts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Factures de réparation</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Évaluation perte exploitation</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Constituer dossier
              </Button>
              <Button variant="outline" className="flex-1">
                Contacter assureur
              </Button>
            </div>
          </div>
        );

      case 'commande_express':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Commande express - FOURNI-TECH
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive">Composant critique en rupture</div>
                  <p className="text-xs text-muted-foreground">Arrêt production client depuis 2h</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-card p-2 rounded text-center">
                    <div className="font-medium">24h</div>
                    <div className="text-muted-foreground">Livraison express</div>
                  </div>
                  <div className="bg-card p-2 rounded text-center">
                    <div className="font-medium">12k€</div>
                    <div className="text-muted-foreground">Pénalité/jour</div>
                  </div>
                  <div className="bg-card p-2 rounded text-center">
                    <div className="font-medium">3</div>
                    <div className="text-muted-foreground">Alternatives</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Fournisseurs alternatifs identifiés</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span>TECH COMPONENTS SAS</span>
                  <span className="text-green-600 font-medium">Stock: 15 unités</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span>EURO PIECES EXPRESS</span>
                  <span className="text-green-600 font-medium">Livraison: 8h</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span>RAPID SUPPLY CHAIN</span>
                  <span className="text-karrosserie-orange font-medium">Prix: -15%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Commander maintenant
              </Button>
              <Button variant="outline" className="flex-1">
                Comparer prix
              </Button>
            </div>
          </div>
        );

      case 'virement_urgence':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                Virement d'urgence - CREDIT MUTUEL
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive">Découvert dépassé: 5 847€</div>
                  <p className="text-xs text-muted-foreground">Agios majorés: 89€/jour depuis 3 jours</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Solde actuel:</span>
                    <p className="font-medium text-destructive">-25 847€</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Autorisation:</span>
                    <p className="font-medium">20 000€</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Solutions proposées</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span>Virement compte épargne</span>
                  <span className="text-green-600 font-medium">15 000€ disponible</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span>Virement clients à échoir</span>
                  <span className="text-primary font-medium">8 500€ J+2</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded">
                  <span>Extension découvert temporaire</span>
                  <span className="text-karrosserie-orange font-medium">+10 000€</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Effectuer virement
              </Button>
              <Button variant="outline" className="flex-1">
                Négocier extension
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Contenu détaillé de cette action en cours de développement</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-card-foreground">
              {modalData?.title || 'Action'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1 hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ActionModalExtended;