import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, Phone, Mail, MapPin, FileText, AlertTriangle, CheckCircle, Wrench, Camera } from 'lucide-react';
import { getTaskPhotos, TaskPhoto } from '@/utils/taskPhotoService';

interface VehiculeDetailModalProps {
  vehicule: any;
  isOpen: boolean;
  onClose: () => void;
  userRole: 'manager' | 'employe';
  onAssignerTache?: (vehicule: any) => void;
}

export const VehiculeDetailModal: React.FC<VehiculeDetailModalProps> = ({
  vehicule,
  isOpen,
  onClose,
  userRole,
  onAssignerTache
}) => {
  const [taskPhotos, setTaskPhotos] = useState<{ start: TaskPhoto[]; end: TaskPhoto[] }>({
    start: [],
    end: []
  });

  useEffect(() => {
    if (vehicule && vehicule.id) {
      const loadPhotos = async () => {
        try {
          const startPhotos = await getTaskPhotos(vehicule.id, 'start');
          const endPhotos = await getTaskPhotos(vehicule.id, 'end');
          setTaskPhotos({ start: startPhotos, end: endPhotos });
        } catch (error) {
          console.error('Erreur lors du chargement des photos:', error);
        }
      };
      loadPhotos();
    }
  }, [vehicule]);

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

  // Simuler un dossier complet avec toutes les informations
  const dossierComplet = {
    ...vehicule,
    // Informations client
    clientComplet: {
      nom: vehicule.client,
      telephone: '06.12.34.56.78',
      email: 'client@example.com',
      adresse: '123 Rue de la République, 75001 Paris'
    },
    // Informations assurance
    assurance: {
      compagnie: 'AXA Assurance',
      numeroSinistre: 'SIN-2025-001234',
      expert: 'M. Dupont',
      telephoneExpert: '06.98.76.54.32',
      franchiseClient: '300€'
    },
    // Détails des réparations
    reparations: [
      { element: 'Pare-chocs avant', type: 'Remplacement', temps: '2h', prix: '450€', status: 'termine' },
      { element: 'Aile avant droite', type: 'Débosselage + peinture', temps: '4h', prix: '680€', status: 'en_cours' },
      { element: 'Optique avant', type: 'Remplacement', temps: '1h', prix: '220€', status: 'planifier' }
    ],
    // Pièces nécessaires
    pieces: [
      { reference: 'PC-AV-001', designation: 'Pare-chocs avant', prix: '180€', statut: 'disponible' },
      { reference: 'OPT-AV-R', designation: 'Optique avant droite', prix: '95€', statut: 'commande' },
      { reference: 'PEIN-RAL', designation: 'Peinture RAL 9003', prix: '45€', statut: 'disponible' }
    ],
    // Historique des interventions
    historique: [
      { date: '08/01/2025 09:00', action: 'Réception véhicule', technicien: 'Martin Dubois' },
      { date: '08/01/2025 10:30', action: 'Début démontage pare-chocs', technicien: 'Martin Dubois' },
      { date: '08/01/2025 14:00', action: 'Démontage terminé', technicien: 'Martin Dubois' },
      { date: '09/01/2025 08:00', action: 'Début débosselage aile', technicien: 'Sophie Martin' }
    ],
    // Progression étapes atelier
    etapesAtelier: [
      { etape: 'Accueil & Préparation', status: 'termine', progression: 100 },
      { etape: 'Remplacement ou débosselage', status: 'en_cours', progression: 60 },
      { etape: 'Préparation peinture', status: 'planifier', progression: 0 },
      { etape: 'Mise en peinture', status: 'planifier', progression: 0 },
      { etape: 'Finitions & remontage', status: 'planifier', progression: 0 },
      { etape: 'Clôture & livraison', status: 'planifier', progression: 0 }
    ]
  };

  const progressionGlobale = dossierComplet.etapesAtelier.reduce((acc, etape) => acc + etape.progression, 0) / dossierComplet.etapesAtelier.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto mx-4 my-4 w-[calc(100vw-32px)] sm:w-full sm:mx-8">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-lg sm:text-xl">Détail du véhicule - {vehicule.plaque}</span>
            <Badge variant={getStatusVariant(vehicule.status)} className="self-start sm:self-center">
              {getStatusLabel(vehicule.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Informations véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modèle:</span>
                  <span className="font-medium text-right">{vehicule.modele}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plaque:</span>
                  <span className="font-medium text-right">{vehicule.plaque}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Étape actuelle:</span>
                  <span className="font-medium text-right">{vehicule.sousEtape}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temps estimé:</span>
                  <span className="font-medium text-right">{vehicule.temps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix total:</span>
                  <span className="font-medium text-primary text-right">{vehicule.prix}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{dossierComplet.clientComplet.nom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{dossierComplet.clientComplet.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{dossierComplet.clientComplet.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{dossierComplet.clientComplet.adresse}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progression étapes atelier */}
          <Card className="lg:col-span-2">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Progression des étapes atelier ({Math.round(progressionGlobale)}%)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Progress value={progressionGlobale} className="mb-4" />
              <div className="space-y-3 sm:space-y-2">
                {dossierComplet.etapesAtelier.map((etape, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded gap-2">
                    <span className="text-sm font-medium">{etape.etape}</span>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Badge variant={etape.status === 'termine' ? 'default' : etape.status === 'en_cours' ? 'secondary' : 'outline'} className="text-xs">
                        {etape.progression}%
                      </Badge>
                      {etape.status === 'termine' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {etape.status === 'en_cours' && <Clock className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informations assurance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Compagnie:</span>
                <span className="font-medium">{dossierComplet.assurance.compagnie}</span>
                <span className="text-muted-foreground">N° Sinistre:</span>
                <span className="font-medium">{dossierComplet.assurance.numeroSinistre}</span>
                <span className="text-muted-foreground">Expert:</span>
                <span className="font-medium">{dossierComplet.assurance.expert}</span>
                <span className="text-muted-foreground">Franchise:</span>
                <span className="font-medium">{dossierComplet.assurance.franchiseClient}</span>
              </div>
            </CardContent>
          </Card>

          {/* Détails réparations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Réparations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dossierComplet.reparations.map((reparation, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">{reparation.element}</div>
                      <div className="text-xs text-muted-foreground">{reparation.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{reparation.prix}</div>
                      <Badge variant={getStatusVariant(reparation.status)} className="text-xs">
                        {getStatusLabel(reparation.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pièces nécessaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Pièces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dossierComplet.pieces.map((piece, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                    <div>
                      <div className="font-medium">{piece.designation}</div>
                      <div className="text-xs text-muted-foreground">{piece.reference}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{piece.prix}</div>
                      <Badge variant={piece.statut === 'disponible' ? 'default' : 'outline'} className="text-xs">
                        {piece.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos de tâche */}
          {(taskPhotos.start.length > 0 || taskPhotos.end.length > 0) && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photos de la tâche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photos de début */}
                  {taskPhotos.start.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">Photos de démarrage</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {taskPhotos.start.map((photo, index) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.file_url}
                              alt={`Photo de démarrage ${index + 1}`}
                              className="w-full h-24 object-cover rounded border hover:opacity-90 transition-opacity cursor-pointer"
                              onClick={() => window.open(photo.file_url, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded flex items-center justify-center">
                              <Camera className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photos de fin */}
                  {taskPhotos.end.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">Photos de fin</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {taskPhotos.end.map((photo, index) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.file_url}
                              alt={`Photo de fin ${index + 1}`}
                              className="w-full h-24 object-cover rounded border hover:opacity-90 transition-opacity cursor-pointer"
                              onClick={() => window.open(photo.file_url, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded flex items-center justify-center">
                              <Camera className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {taskPhotos.start.length === 0 && taskPhotos.end.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune photo disponible pour cette tâche</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dossierComplet.historique.map((intervention, index) => (
                  <div key={index} className="border-l-2 border-primary pl-3 pb-2">
                    <div className="text-sm font-medium">{intervention.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {intervention.date} - {intervention.technicien}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          {vehicule.technicien && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Technicien: <strong>{vehicule.technicien}</strong></span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {userRole === 'manager' && vehicule.status === 'planifier' && onAssignerTache && (
              <Button 
                onClick={() => onAssignerTache(vehicule)}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                size="sm"
              >
                Assigner automatiquement
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto" size="sm">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};