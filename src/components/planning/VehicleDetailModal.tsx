import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Settings, 
  Package, 
  History,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId?: string;
}

interface VehicleDetail {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  year: string;
  totalPrice: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  };
  workflowProgress: {
    current: string;
    percentage: number;
    steps: Array<{
      name: string;
      status: 'completed' | 'current' | 'pending';
      percentage: number;
    }>;
  };
  insurance: {
    company: string;
    contractNumber: string;
    franchise: string;
  };
  repairs: Array<{
    id: string;
    name: string;
    price: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  parts: Array<{
    id: string;
    name: string;
    price: string;
    status: 'to_order' | 'ordered' | 'received';
    reference?: string;
  }>;
  history: Array<{
    date: string;
    action: string;
    author: string;
  }>;
}

// Mock data based on the screenshot
const mockVehicleDetail: VehicleDetail = {
  id: '1',
  brand: 'Citroën',
  model: 'C4',
  licensePlate: 'EZ-787-KL',
  year: '2020',
  totalPrice: '800€',
  clientInfo: {
    firstName: 'M.',
    lastName: 'Durand',
    phone: '06 12 34 56 78',
    email: 'durand@example.com',
    address: '123 Rue de la République, 75001 Paris'
  },
  workflowProgress: {
    current: 'Accueil & Préparation',
    percentage: 27,
    steps: [
      { name: 'Accueil & Préparation', status: 'current', percentage: 100 },
      { name: 'Remplacement ou débosselage', status: 'pending', percentage: 0 },
      { name: 'Préparation peinture', status: 'pending', percentage: 0 },
      { name: 'Mise en peinture', status: 'pending', percentage: 0 },
      { name: 'Finitions & remontage', status: 'pending', percentage: 0 },
      { name: 'Clôture & livraison', status: 'pending', percentage: 0 }
    ]
  },
  insurance: {
    company: 'AXA Assurance',
    contractNumber: 'AH 2023-002434',
    franchise: '300€'
  },
  repairs: [
    { id: '1', name: 'Pare-chocs avant', price: '450€', status: 'pending' },
    { id: '2', name: 'Aile avant droite', price: '680€', status: 'in_progress' },
    { id: '3', name: 'Optique avant', price: '270€', status: 'completed' }
  ],
  parts: [
    { id: '1', name: 'Pare-chocs avant', price: '180€', status: 'to_order', reference: 'PC-AV-C4' },
    { id: '2', name: 'Optique avant droite', price: '95€', status: 'received', reference: 'OPT-RAL' },
    { id: '3', name: 'Peinture RAL', price: '45€', status: 'received', reference: 'PEIN-RAL' }
  ],
  history: [
    { date: '15/12/2024 - 14:30', action: 'Réception véhicule', author: 'Sophie Martin' },
    { date: '15/12/2024 - 15:45', action: 'Évaluation dégâts', author: 'Martin Dubois' },
    { date: '16/12/2024 - 09:15', action: 'Devis créé', author: 'Sophie Martin' },
    { date: '16/12/2024 - 11:30', action: 'Commande pièces', author: 'Sophie Martin' },
    { date: '17/12/2024 - 08:00', action: 'Début débosselage', author: 'Martin Dubois' }
  ]
};

export const VehicleDetailModal = ({ isOpen, onOpenChange, vehicleId }: VehicleDetailModalProps) => {
  const vehicle = mockVehicleDetail; // In real app, fetch by vehicleId

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current':
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'in_progress':
      case 'current':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'to_order':
        return <Badge className="bg-red-100 text-red-800">À commander</Badge>;
      case 'ordered':
        return <Badge className="bg-orange-100 text-orange-800">Commandé</Badge>;
      case 'received':
        return <Badge className="bg-green-100 text-green-800">Reçu</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Détail du véhicule - {vehicle.licensePlate}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Vehicle Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4" />
                  Informations véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Modèle:</strong> {vehicle.brand} {vehicle.model}</div>
                <div><strong>Plaque:</strong> {vehicle.licensePlate}</div>
                <div><strong>Depuis le début:</strong> 0.5h</div>
                <div><strong>Taux fini:</strong> {vehicle.workflowProgress.percentage}%</div>
                <div><strong>Prix fini:</strong> {vehicle.totalPrice}</div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Client:</strong> {vehicle.clientInfo.lastName}</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {vehicle.clientInfo.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {vehicle.clientInfo.email}
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span className="text-sm">{vehicle.clientInfo.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Progression des étapes atelier ({vehicle.workflowProgress.percentage}%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicle.workflowProgress.steps.map((step, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        <span className="text-sm">{step.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{step.percentage}%</div>
                    </div>
                    <Progress value={step.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Insurance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Assurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Assureur:</strong> {vehicle.insurance.company}</div>
                <div><strong>N° Sinistre:</strong> {vehicle.insurance.contractNumber}</div>
                <div><strong>Franchise:</strong> {vehicle.insurance.franchise}</div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Repairs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  Réparations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicle.repairs.map((repair) => (
                  <div key={repair.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{repair.name}</div>
                      <div className="text-sm text-muted-foreground">Remplacement à neuf</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{repair.price}</div>
                      {getStatusBadge(repair.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Parts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4" />
                  Pièces
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicle.parts.map((part) => (
                  <div key={part.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{part.name}</div>
                      {part.reference && (
                        <div className="text-sm text-muted-foreground">{part.reference}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{part.price}</div>
                      {getStatusBadge(part.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <History className="w-4 h-4" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                {vehicle.history.map((entry, index) => (
                  <div key={index} className="text-sm border-l-2 border-blue-200 pl-3">
                    <div className="font-medium">{entry.action}</div>
                    <div className="text-muted-foreground">{entry.date} - Par {entry.author}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};