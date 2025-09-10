import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuickPlanningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: PlanningData) => void;
}

interface PlanningData {
  licensePlate: string;
  assignmentTime: string;
  clientFirstName: string;
  clientLastName: string;
  assignedEmployee: string;
}

const mockEmployees = [
  { id: '1', name: 'Sophie Martin', role: 'Technicien Peinture' },
  { id: '2', name: 'Martin Dubois', role: 'Technicien Carrosserie' },
  { id: '3', name: 'Julie Blanc', role: 'Technicien Junior' },
  { id: '4', name: 'Pierre Moreau', role: 'Chef d\'équipe' }
];

export const QuickPlanningModal = ({ isOpen, onOpenChange, onSubmit }: QuickPlanningModalProps) => {
  const [formData, setFormData] = useState<PlanningData>({
    licensePlate: '',
    assignmentTime: '',
    clientFirstName: '',
    clientLastName: '',
    assignedEmployee: ''
  });

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onOpenChange(false);
    // Reset form
    setFormData({
      licensePlate: '',
      assignmentTime: '',
      clientFirstName: '',
      clientLastName: '',
      assignedEmployee: ''
    });
  };

  const handleReset = () => {
    setFormData({
      licensePlate: '',
      assignmentTime: '',
      clientFirstName: '',
      clientLastName: '',
      assignedEmployee: ''
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  const handleAddUrgent = () => {
    // Handle urgent addition logic
    handleSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <DialogTitle>Ajout immédiat au planning - Traitement prioritaire</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            URGENCE - Traitement immédiat
          </Badge>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Plaque d'immatriculation *</Label>
              <Input
                id="licensePlate"
                placeholder="XX-123-XX"
                value={formData.licensePlate}
                onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignmentTime">Heure d'affectation *</Label>
              <Select 
                value={formData.assignmentTime} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignmentTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="08:30">08:30</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="09:30">09:30</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="10:30">10:30</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="11:30">11:30</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="14:30">14:30</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="15:30">15:30</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="16:30">16:30</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientLastName">Nom du client *</Label>
              <Input
                id="clientLastName"
                placeholder="Nom"
                value={formData.clientLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientLastName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientFirstName">Prénom du client *</Label>
              <Input
                id="clientFirstName"
                placeholder="Prénom"
                value={formData.clientFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientFirstName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedEmployee">Employé assigné *</Label>
            <Select 
              value={formData.assignedEmployee} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedEmployee: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button 
            onClick={handleAddUrgent}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Ajouter en urgence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};