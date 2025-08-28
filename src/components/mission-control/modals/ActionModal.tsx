import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ActionModalExtended from './ActionModalExtended';
import { X, User, Calendar, Phone, Mail, CreditCard, FileText, AlertTriangle, Package } from 'lucide-react';

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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Appliquer les alternatives
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                <Package className="h-4 w-4 mr-2" />
                Préparer matériel
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Valider échelonnement
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Déployer maintenant
              </Button>
              <Button variant="outline" className="flex-1">
                Négocier conditions
              </Button>
            </div>
          </div>
        );

      case 'mise_abri_vehicules':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Mise à l'abri urgente - 4 véhicules
              </h4>
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-1">Peinture fraîche exposée aux intempéries</div>
                  <p className="text-xs text-muted-foreground">Risque de défauts irréversibles si exposition prolongée</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-card rounded border-l-4 border-l-karrosserie-orange">
                    <span>Peugeot 308 - Zone B2</span>
                    <span className="text-destructive font-medium">Peinture 6h de séchage</span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded border-l-4 border-l-karrosserie-orange">
                    <span>Renault Clio - Zone B3</span>
                    <span className="text-destructive font-medium">Vernis en cours</span>
                  </div>
                  <div className="flex justify-between p-2 bg-card rounded border-l-4 border-l-karrosserie-orange">
                    <span>BMW X1 - Zone B1</span>
                    <span className="text-destructive font-medium">Apprêt frais</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Plan d'action immédiat</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Transfert vers hangar couvert sous 15 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Équipe de 3 carrossiers mobilisée</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Notification clients automatique des délais</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Mise à l'abri immédiate
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Programmer étuvage
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Lancer contentieux
              </Button>
              <Button variant="outline" className="flex-1">
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Confirmer RDV expertise
              </Button>
              <Button variant="outline" className="flex-1">
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