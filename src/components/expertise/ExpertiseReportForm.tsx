
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, User, Car, FileText, Calculator, AlertCircle } from 'lucide-react';

interface ExpertiseReportFormProps {
  report?: ExpertiseReport | null;
  onSubmit: (formData: Partial<ExpertiseReport>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ExpertiseReportForm = ({
  report,
  onSubmit,
  onCancel,
  isSubmitting
}: ExpertiseReportFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  
  const [formData, setFormData] = useState<Partial<ExpertiseReport>>({
    reference: '',
    report_date: null,
    client_id: null,
    vehicle_id: null,
    expert_name: '',
    amount: null,
    status: 'Importé',
    claim_number: '',
    incident_date: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (report) {
      setFormData({
        reference: report.reference,
        report_date: report.report_date,
        client_id: report.client_id,
        vehicle_id: report.vehicle_id,
        expert_name: report.expert_name || '',
        amount: report.amount,
        status: report.status || 'Importé',
        claim_number: report.claim_number || '',
        incident_date: report.incident_date,
      });
    } else {
      // Générer une référence automatique pour un nouveau rapport
      const currentYear = new Date().getFullYear();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        reference: `RE-${currentYear}-${randomNumber}`
      }));
    }
  }, [report]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.reference?.trim()) {
      newErrors.reference = 'Le numéro de rapport est obligatoire';
    }
    
    if (!formData.expert_name?.trim()) {
      newErrors.expert_name = 'Le nom de l\'expert est recommandé';
    }
    
    if (formData.amount !== null && formData.amount < 0) {
      newErrors.amount = 'Le montant ne peut pas être négatif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${report ? 'mettre à jour' : 'créer'} le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const clientOptions = clients?.filter(client => !!client) || [];
  const vehicleOptions = vehicles?.filter(vehicle => !!vehicle) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Informations de base */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2" />
            Informations de base
          </CardTitle>
          <CardDescription>
            Numéro de rapport, date et statut
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reference">Numéro de rapport *</Label>
            <Input
              id="reference"
              value={formData.reference || ''}
              onChange={(e) => handleChange('reference', e.target.value)}
              className={errors.reference ? 'border-red-500' : ''}
              placeholder="Ex: RE-2024-1234"
            />
            {errors.reference && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reference}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="report_date">Date du rapport</Label>
            <Input
              id="report_date"
              type="date"
              value={formData.report_date || ''}
              onChange={(e) => handleChange('report_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || 'Importé'}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Importé">Importé</SelectItem>
                <SelectItem value="En cours d'analyse">En cours d'analyse</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
                <SelectItem value="Rejeté">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <User className="h-5 w-5 mr-2" />
            Assignation
          </CardTitle>
          <CardDescription>
            Client et véhicule concernés par le rapport
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client">Client</Label>
            <Select
              value={formData.client_id || 'none'}
              onValueChange={(value) => handleChange('client_id', value === 'none' ? null : value)}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun client</SelectItem>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingClients && <p className="text-sm text-gray-500">Chargement des clients...</p>}
          </div>

          <div>
            <Label htmlFor="vehicle">Véhicule</Label>
            <Select
              value={formData.vehicle_id || 'none'}
              onValueChange={(value) => handleChange('vehicle_id', value === 'none' ? null : value)}
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun véhicule</SelectItem>
                {vehicleOptions.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingVehicles && <p className="text-sm text-gray-500">Chargement des véhicules...</p>}
          </div>
        </CardContent>
      </Card>

      {/* Détails de l'expertise */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Calculator className="h-5 w-5 mr-2" />
            Détails de l'expertise
          </CardTitle>
          <CardDescription>
            Expert, montant et informations sur le sinistre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="expert_name">Nom de l'expert</Label>
            <Input
              id="expert_name"
              value={formData.expert_name || ''}
              onChange={(e) => handleChange('expert_name', e.target.value)}
              className={errors.expert_name ? 'border-yellow-500' : ''}
              placeholder="Ex: Jean Dupont"
            />
            {errors.expert_name && (
              <p className="text-sm text-yellow-600 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.expert_name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Montant de l'expertise (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || null)}
              className={errors.amount ? 'border-red-500' : ''}
              placeholder="Ex: 1500.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="claim_number">Numéro de sinistre</Label>
            <Input
              id="claim_number"
              value={formData.claim_number || ''}
              onChange={(e) => handleChange('claim_number', e.target.value)}
              placeholder="Ex: SIN-2024-5678"
            />
          </div>

          <div>
            <Label htmlFor="incident_date">Date du sinistre</Label>
            <Input
              id="incident_date"
              type="date"
              value={formData.incident_date || ''}
              onChange={(e) => handleChange('incident_date', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : report ? 'Mettre à jour' : 'Créer le rapport'}
        </Button>
      </div>
    </form>
  );
};
