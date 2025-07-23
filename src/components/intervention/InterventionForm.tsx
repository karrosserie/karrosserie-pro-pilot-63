import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash } from 'lucide-react';
import { Client } from '@/services/supabase/clients';
import { useVehicles } from '@/hooks/use-vehicles';

interface InterventionFormProps {
  client?: Client | null;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  existingSheet?: any;
}

interface ReportItem {
  id: string;
  text: string;
}

interface ReportSection {
  carrosserie: ReportItem[];
  mecanique: ReportItem[];
  electrique: ReportItem[];
}

export const InterventionForm: React.FC<InterventionFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isSubmitting,
  existingSheet
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(existingSheet?.vehicle_id || '');
  const [isApproved, setIsApproved] = useState(existingSheet?.is_approved || false);
  const [reports, setReports] = useState<ReportSection>({
    carrosserie: existingSheet?.carrosserie_reports || [],
    mecanique: existingSheet?.mecanique_reports || [],
    electrique: existingSheet?.electrique_reports || []
  });
  
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  
  // Filter vehicles for the selected client
  const clientVehicles = vehicles?.filter(vehicle => vehicle.client_id === client?.id) || [];

  const addReportItem = (section: keyof ReportSection) => {
    const newItem: ReportItem = {
      id: Date.now().toString(),
      text: ''
    };
    
    setReports(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeReportItem = (section: keyof ReportSection, itemId: string) => {
    setReports(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== itemId)
    }));
  };

  const updateReportItem = (section: keyof ReportSection, itemId: string, text: string) => {
    setReports(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === itemId ? { ...item, text } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      client_id: client?.id,
      vehicle_id: selectedVehicleId,
      carrosserie_reports: reports.carrosserie.filter(item => item.text.trim()),
      mecanique_reports: reports.mecanique.filter(item => item.text.trim()),
      electrique_reports: reports.electrique.filter(item => item.text.trim()),
      is_approved: isApproved
    };
    
    await onSubmit(formData);
  };

  const renderReportSection = (title: string, section: keyof ReportSection) => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addReportItem(section)}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports[section].length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun élément ajouté</p>
        ) : (
          reports[section].map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Input
                value={item.text}
                onChange={(e) => updateReportItem(section, item.id, e.target.value)}
                placeholder="Saisissez votre observation..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeReportItem(section, item.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Selection */}
        <div className="space-y-2">
          <Label htmlFor="vehicle">Véhicule *</Label>
          <Select 
            value={selectedVehicleId} 
            onValueChange={setSelectedVehicleId}
            disabled={vehiclesLoading || clientVehicles.length === 0}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  vehiclesLoading 
                    ? "Chargement des véhicules..." 
                    : clientVehicles.length === 0 
                      ? "Aucun véhicule trouvé pour ce client"
                      : "Sélectionnez un véhicule"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {clientVehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.license_plate} - {vehicle.car_brands?.name} {vehicle.car_models?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Report Sections */}
        <div className="space-y-6">
          {renderReportSection("Rapport carrosserie", "carrosserie")}
          {renderReportSection("Rapport mécanique", "mecanique")}
          {renderReportSection("Rapport électrique", "electrique")}
        </div>

        {/* Approval Switch */}
        <div className="flex items-center space-x-3">
          <Switch
            id="approved"
            checked={isApproved}
            onCheckedChange={setIsApproved}
          />
          <Label htmlFor="approved" className="text-sm">
            Est-ce que cette fiche d'intervention est approuvée par le client ?
          </Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
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
            disabled={isSubmitting || (!existingSheet && !selectedVehicleId)}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            {isSubmitting ? (existingSheet ? "Mise à jour..." : "Création...") : (existingSheet ? "Modifier la fiche" : "Créer la fiche")}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};