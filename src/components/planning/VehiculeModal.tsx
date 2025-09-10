import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Wrench, Clock, Euro, MapPin, Phone, FileText } from 'lucide-react';

interface VehiculeModalProps {
  vehicule: any;
  isOpen: boolean;
  onClose: () => void;
  onAssignerTache?: (vehicule: any) => void;
  userRole: 'manager' | 'employe';
}

export const VehiculeModal: React.FC<VehiculeModalProps> = ({ 
  vehicule, 
  isOpen, 
  onClose, 
  onAssignerTache,
  userRole 
}) => {
  if (!vehicule) return null;

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'en_cours': return 'default';
      case 'planifie': return 'secondary';
      case 'en_attente': return 'destructive';
      case 'planifier': return 'outline';
      case 'termine': return 'default';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'en_cours': return 'En cours';
      case 'planifie': return 'Planifié';
      case 'en_attente': return 'En attente';
      case 'planifier': return 'À planifier';
      case 'termine': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  // Données simulées complètes du dossier
  const dossierComplet = {
    ...vehicule,
    informationsClient: {
      nom: vehicule.client,
      telephone: '06.12.34.56.78',
      email: 'client@email.com',
      adresse: '123 Rue de la République, 75001 Paris'
    },
    sinistre: {
      dateDeclaration: '2025-01-08',
      numeroSinistre: 'SIN-2025-001234',
      assurance: 'AXA Assurances',
      numeroPolice: 'POL-789456123',
      expert: 'M. Durand - Expert Auto',
      circonstances: 'Collision latérale lors d\'un stationnement'
    },
    reparations: [
      { element: 'Aile avant droite', type: 'Débosselage + peinture', temps: '3h', prix: '450€' },
      { element: 'Pare-chocs avant', type: 'Remplacement', temps: '2h', prix: '320€' },
      { element: 'Optique avant', type: 'Remplacement', temps: '0.5h', prix: '180€' }
    ],
    pieces: [
      { designation: 'Pare-chocs avant', reference: 'PCA-123456', statut: 'En stock', prix: '150€' },
      { designation: 'Optique LED droite', reference: 'OPT-789123', statut: 'Commandé', prix: '120€' }
    ],
    historique: [
      { date: '2025-01-08', action: 'Réception véhicule', utilisateur: 'Martin Dubois' },
      { date: '2025-01-08', action: 'Devis établi', utilisateur: 'Martin Dubois' },
      { date: '2025-01-09', action: 'Validation assurance', utilisateur: 'Sophie Martin' },
      { date: '2025-01-10', action: 'Début réparations', utilisateur: 'Sophie Martin' }
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto mx-4 my-4 w-[calc(100vw-32px)] sm:w-full sm:mx-8">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <span className="text-2xl">🚗</span>
            <span className="break-all">{dossierComplet.modele} - {dossierComplet.plaque}</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Dossier complet de réparation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statut et informations principales */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{dossierComplet.prix}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Montant total</div>
                </div>
                <div className="text-center">
                  <Badge variant={getStatusVariant(dossierComplet.status)} className="text-xs sm:text-sm mb-1">
                    {getStatusLabel(dossierComplet.status)}
                  </Badge>
                  <div className="text-xs sm:text-sm text-muted-foreground">Statut</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg font-semibold">{dossierComplet.temps}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Temps estimé</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg font-semibold break-words">{dossierComplet.etape}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Étape actuelle</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Informations client */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Client
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nom :</span>
                    <span className="font-medium">{dossierComplet.informationsClient.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Téléphone :</span>
                    <span className="font-medium">{dossierComplet.informationsClient.telephone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email :</span>
                    <span className="font-medium">{dossierComplet.informationsClient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adresse :</span>
                    <span className="font-medium text-right max-w-[200px]">
                      {dossierComplet.informationsClient.adresse}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations sinistre */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Sinistre
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">N° Sinistre :</span>
                    <span className="font-medium">{dossierComplet.sinistre.numeroSinistre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assurance :</span>
                    <span className="font-medium">{dossierComplet.sinistre.assurance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expert :</span>
                    <span className="font-medium">{dossierComplet.sinistre.expert}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date :</span>
                    <span className="font-medium">{dossierComplet.sinistre.dateDeclaration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Réparations à effectuer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Réparations à effectuer
              </h3>
              <div className="space-y-3">
                {dossierComplet.reparations.map((reparation, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{reparation.element}</div>
                      <div className="text-sm text-muted-foreground">{reparation.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{reparation.prix}</div>
                      <div className="text-sm text-muted-foreground">{reparation.temps}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pièces */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Pièces nécessaires</h3>
              <div className="space-y-3">
                {dossierComplet.pieces.map((piece, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{piece.designation}</div>
                      <div className="text-sm text-muted-foreground">Réf: {piece.reference}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={piece.statut === 'En stock' ? 'default' : 'secondary'}>
                        {piece.statut}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">{piece.prix}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Historique du dossier
              </h3>
              <div className="space-y-3">
                {dossierComplet.historique.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">{event.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date} - {event.utilisateur}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {userRole === 'manager' && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <Button 
                onClick={() => onAssignerTache?.(vehicule)} 
                className="flex-1"
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Assigner une tâche
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                <Wrench className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};