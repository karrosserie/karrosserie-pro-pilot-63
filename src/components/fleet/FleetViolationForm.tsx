import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useFleetViolations } from '@/hooks/use-fleet-violations';
import { useCompanyId } from '@/hooks/use-company-id';
import { useToast } from '@/hooks/use-toast';
import { FleetViolation } from '@/services/supabase/fleet-violations';
import { ViolationDocumentUpload } from './ViolationDocumentUpload';

interface FleetViolationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violation?: FleetViolation | null;
  preselectedVehicleId?: string;
}

const violationTypes = [
  'Excès de vitesse',
  'Stationnement interdit',
  'Feu rouge grillé',
  'Téléphone au volant',
  'Dépassement interdit',
  'Sens interdit',
  'Zone piétonne',
  'Autre'
];

const paymentStatuses = [
  'En attente',
  'Payée',
  'Contestée',
  'Annulée'
];

export const FleetViolationForm: React.FC<FleetViolationFormProps> = ({ 
  open, 
  onOpenChange, 
  violation,
  preselectedVehicleId 
}) => {
  const { vehicles } = useFleetVehicles();
  const { createViolation, updateViolation } = useFleetViolations();
  const companyId = useCompanyId();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fleet_vehicle_id: preselectedVehicleId || violation?.fleet_vehicle_id || '',
    license_plate: violation?.license_plate || '',
    violation_date: violation?.violation_date || '',
    violation_time: violation?.violation_time || '',
    location: violation?.location || '',
    violation_type: violation?.violation_type || '',
    fine_amount: violation?.fine_amount || 0,
    payment_status: violation?.payment_status || 'En attente',
    reference_number: violation?.reference_number || '',
    due_date: violation?.due_date || '',
    notes: violation?.notes || '',
    document_url: violation?.document_url || '',
    borrower_name: violation?.borrower_name || '',
    borrower_phone: violation?.borrower_phone || '',
    borrower_email: violation?.borrower_email || ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const selectedVehicle = vehicles?.find(v => v.id === vehicleId);
    setFormData(prev => ({ 
      ...prev, 
      fleet_vehicle_id: vehicleId,
      license_plate: selectedVehicle?.license_plate || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyId?.companyId) {
      console.error('Company ID is required');
      return;
    }

    try {
      const violationData = {
        ...formData,
        company_id: companyId.companyId,
        fine_amount: Number(formData.fine_amount),
        due_date: formData.due_date || null
      };

      if (violation) {
        await updateViolation.mutateAsync({ 
          id: violation.id, 
          data: violationData 
        });
      } else {
        await createViolation.mutateAsync(violationData);
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting violation:', error);
    }
  };

  const handleDocumentAnalyzed = (analyzedData: any) => {
    console.log('FleetViolationForm: handleDocumentAnalyzed called with:', analyzedData);
    
    // Extract data from the output structure
    const data = analyzedData.output || analyzedData;
    
    // Update form data with analyzed information
    const updates: any = {};
    
    if (data.numero || data.numero_avis || data.reference_number) {
      updates.reference_number = data.numero || data.numero_avis || data.reference_number;
    }
    if (data['infraction-date'] || data.date_infraction || data.violation_date) {
      const dateStr = data['infraction-date'] || data.date_infraction || data.violation_date;
      // Convert DD/MM/YYYY to YYYY-MM-DD
      if (dateStr && dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        updates.violation_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else {
        updates.violation_date = dateStr;
      }
    }
    if (data['infraction-heure'] || data.heure_infraction || data.violation_time) {
      const timeStr = data['infraction-heure'] || data.heure_infraction || data.violation_time;
      // Convert 17h32 format to 17:32
      if (timeStr && timeStr.includes('h')) {
        const [hours, minutes] = timeStr.replace('h', ':').split(':');
        updates.violation_time = `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}`;
      } else {
        updates.violation_time = timeStr;
      }
    }
    if (data.immatriculation || data.license_plate) {
      const plate = data.immatriculation || data.license_plate;
      updates.license_plate = plate;
      
      // Try to find matching vehicle by license plate
      const matchingVehicle = vehicles?.find(v => 
        v.license_plate && plate && 
        v.license_plate.replace(/[^A-Z0-9]/g, '') === plate.replace(/[^A-Z0-9]/g, '')
      );
      if (matchingVehicle) {
        updates.fleet_vehicle_id = matchingVehicle.id;
      }
    }
    if (data.montant || data.montant_amende || data.fine_amount) {
      const amountStr = data.montant || data.montant_amende || data.fine_amount;
      // Remove € symbol and convert to number
      const amount = typeof amountStr === 'string' 
        ? parseFloat(amountStr.replace('€', '').trim()) 
        : parseFloat(amountStr);
      updates.fine_amount = amount || 0;
    }
    if (analyzedData.lieu || analyzedData.location) {
      updates.location = analyzedData.lieu || analyzedData.location;
    }
    if (analyzedData.type_infraction || analyzedData.violation_type) {
      const detectedType = analyzedData.type_infraction || analyzedData.violation_type;
      // Map detected type to available violation types
      const matchingType = violationTypes.find(type => 
        type.toLowerCase().includes(detectedType.toLowerCase()) ||
        detectedType.toLowerCase().includes(type.toLowerCase())
      );
      if (matchingType) {
        updates.violation_type = matchingType;
      }
    }
    if (analyzedData.date_limite || analyzedData.due_date) {
      updates.due_date = analyzedData.date_limite || analyzedData.due_date;
    }
    
    console.log('FleetViolationForm: Applying updates:', updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log('FleetViolationForm: New form data:', newData);
      return newData;
    });
    
    // Show success message
    toast({
      title: "Données extraites",
      description: `${Object.keys(updates).length} champs ont été remplis automatiquement.`,
    });
  };

  const resetForm = () => {
    setFormData({
      fleet_vehicle_id: preselectedVehicleId || '',
      license_plate: '',
      violation_date: '',
      violation_time: '',
      location: '',
      violation_type: '',
      fine_amount: 0,
      payment_status: 'En attente',
      reference_number: '',
      due_date: '',
      notes: '',
      document_url: '',
      borrower_name: '',
      borrower_phone: '',
      borrower_email: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {violation ? 'Modifier la contravention' : 'Ajouter une contravention'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document upload - Section prioritaire */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium mb-3">Document de contravention</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Uploadez le document de contravention pour remplir automatiquement les champs ci-dessous
            </p>
            <ViolationDocumentUpload
              documentUrl={formData.document_url}
              onDocumentChange={(url) => handleInputChange('document_url', url)}
              onDocumentRemove={() => handleInputChange('document_url', '')}
              onDocumentAnalyzed={handleDocumentAnalyzed}
              violationId={violation?.id}
              companyId={companyId?.companyId}
            />
          </div>

          {/* Véhicule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select value={formData.fleet_vehicle_id} onValueChange={handleVehicleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles?.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.license_plate} - {vehicle.car_brands?.name} {vehicle.car_models?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="license_plate">Plaque d'immatriculation</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => handleInputChange('license_plate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="violation_date">Date de l'infraction</Label>
              <Input
                id="violation_date"
                type="date"
                value={formData.violation_date}
                onChange={(e) => handleInputChange('violation_date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="violation_time">Heure</Label>
              <Input
                id="violation_time"
                type="time"
                value={formData.violation_time}
                onChange={(e) => handleInputChange('violation_time', e.target.value)}
              />
            </div>
          </div>

          {/* Type et lieu */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="violation_type">Type d'infraction</Label>
              <Select value={formData.violation_type} onValueChange={(value) => handleInputChange('violation_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {violationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Lieu de l'infraction"
              />
            </div>
          </div>

          {/* Montant et statut */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fine_amount">Montant de l'amende (€)</Label>
              <Input
                id="fine_amount"
                type="number"
                step="0.01"
                value={formData.fine_amount}
                onChange={(e) => handleInputChange('fine_amount', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="payment_status">Statut de paiement</Label>
              <Select value={formData.payment_status} onValueChange={(value) => handleInputChange('payment_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="due_date">Date limite de paiement</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>
          </div>

          {/* Numéro de référence */}
          <div>
            <Label htmlFor="reference_number">Numéro de référence</Label>
            <Input
              id="reference_number"
              value={formData.reference_number}
              onChange={(e) => handleInputChange('reference_number', e.target.value)}
              placeholder="Numéro de l'avis de contravention"
            />
          </div>

          {/* Informations emprunteur */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Informations de l'emprunteur</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="borrower_name">Nom complet</Label>
                <Input
                  id="borrower_name"
                  value={formData.borrower_name}
                  onChange={(e) => handleInputChange('borrower_name', e.target.value)}
                  placeholder="Nom de l'emprunteur"
                />
              </div>
              
              <div>
                <Label htmlFor="borrower_phone">Téléphone</Label>
                <Input
                  id="borrower_phone"
                  value={formData.borrower_phone}
                  onChange={(e) => handleInputChange('borrower_phone', e.target.value)}
                  placeholder="Téléphone"
                />
              </div>
              
              <div>
                <Label htmlFor="borrower_email">Email</Label>
                <Input
                  id="borrower_email"
                  type="email"
                  value={formData.borrower_email}
                  onChange={(e) => handleInputChange('borrower_email', e.target.value)}
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes supplémentaires..."
              rows={3}
            />
          </div>


          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={createViolation.isPending || updateViolation.isPending}
            >
              {violation ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};