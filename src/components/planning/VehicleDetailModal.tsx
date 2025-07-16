import React, { useState } from 'react';
import { Car, User, Clock, MapPin, FileText, Phone, Mail, Calendar, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlanning } from '@/contexts/PlanningContext';

const VehicleDetailModal: React.FC = () => {
  const { state, actions } = usePlanning();
  const { isVehicleDetailModalOpen, selectedVehicleDetail } = state;
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const vehicle = selectedVehicleDetail;

  const handleClose = () => {
    actions.closeVehicleDetailModal();
    setNotes('');
    setNewStatus('');
  };

  const handleUpdateStatus = () => {
    if (vehicle && newStatus) {
      actions.updateVehicleStatus(vehicle.id, newStatus);
      actions.closeVehicleDetailModal();
    }
  };

  const handleSchedule = () => {
    if (vehicle) {
      actions.openScheduleModal(vehicle);
      handleClose();
    }
  };

  if (!vehicle) return null;

  // Mock additional vehicle data
  const vehicleDetails = {
    vin: 'WBA3A5G50DNP26082',
    year: '2020',
    color: 'Bleu métallisé',
    mileage: '45 230 km',
    arrivalDate: '2024-01-15',
    estimatedCompletion: '2024-01-22',
    insuranceCompany: 'AXA Assurances',
    claimNumber: 'AXA2024-001234',
    expertName: 'M. Philippe Durand',
    clientPhone: '06 12 34 56 78',
    clientEmail: 'm.durand@email.com',
    damageDescription: 'Impact frontal avec dégâts sur pare-chocs et aile avant droite',
    estimatedCost: vehicle.price,
    workItems: [
      { item: 'Dépose pare-chocs avant', duration: '0.5h', cost: '50€' },
      { item: 'Remplacement pare-chocs', duration: '1h', cost: '350€' },
      { item: 'Peinture aile avant', duration: '2h', cost: '300€' },
      { item: 'Remontage et finitions', duration: '0.5h', cost: '100€' }
    ]
  };

  const statusOptions = [
    'En attente de pièces',
    'Prêt à débuter',
    'En cours de préparation',
    'En cours de peinture',
    'En cours de finition',
    'Contrôle qualité',
    'Prêt à livrer',
    'Terminé'
  ];

  return (
    <Dialog open={isVehicleDetailModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            {vehicle.brand} {vehicle.model} - {vehicle.plate}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="work">Travaux</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Vehicle Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Informations véhicule</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">VIN:</span>
                    <p className="font-medium">{vehicleDetails.vin}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Année:</span>
                    <p className="font-medium">{vehicleDetails.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Couleur:</span>
                    <p className="font-medium">{vehicleDetails.color}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kilométrage:</span>
                    <p className="font-medium">{vehicleDetails.mileage}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Planning</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Date d'arrivée:</span>
                    <p className="font-medium">{vehicleDetails.arrivalDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Livraison prévue:</span>
                    <p className="font-medium">{vehicleDetails.estimatedCompletion}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Technicien:</span>
                    <p className="font-medium">{vehicle.technician || 'Non assigné'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Durée estimée:</span>
                    <p className="font-medium">{vehicle.duration}h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Statut actuel</h3>
              <div className="flex items-center gap-4">
                <Badge variant={vehicle.inProgress ? "default" : "secondary"} className="mb-2">
                  {vehicle.inProgress ? "En cours" : "En attente"}
                </Badge>
                <span className="text-sm text-gray-600">{vehicle.status}</span>
              </div>
              
              <div className="flex items-center gap-3 mt-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Changer le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleUpdateStatus}
                  disabled={!newStatus}
                  size="sm"
                >
                  Mettre à jour
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Détails des travaux</h3>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{vehicleDetails.estimatedCost}€</div>
                  <div className="text-sm text-gray-500">Total estimé</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Description des dommages</h4>
                <p className="text-sm text-gray-700">{vehicleDetails.damageDescription}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Éléments de travail</h4>
                {vehicleDetails.workItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium">{item.item}</span>
                      <div className="text-sm text-gray-500">{item.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="client" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Informations client</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{vehicle.client}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{vehicleDetails.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{vehicleDetails.clientEmail}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Assurance</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Compagnie:</span>
                    <p className="font-medium">{vehicleDetails.insuranceCompany}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Numéro de sinistre:</span>
                    <p className="font-medium">{vehicleDetails.claimNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Expert:</span>
                    <p className="font-medium">{vehicleDetails.expertName}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Historique des actions</h3>
              <div className="space-y-3">
                {[
                  { date: '15/01/2024 14:30', action: 'Véhicule pris en charge', user: 'Martin Dubois' },
                  { date: '15/01/2024 15:45', action: 'Expertise réalisée', user: 'Expert Philippe Durand' },
                  { date: '16/01/2024 09:00', action: 'Devis validé par le client', user: 'Système' },
                  { date: '16/01/2024 10:30', action: 'Commande de pièces', user: 'Sophie Martin' },
                  { date: '18/01/2024 08:00', action: 'Début des travaux', user: 'Sophie Martin' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">{entry.action}</div>
                      <div className="text-sm text-gray-500">{entry.date} - {entry.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleSchedule}>
              <Calendar className="w-4 h-4 mr-2" />
              Planifier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;