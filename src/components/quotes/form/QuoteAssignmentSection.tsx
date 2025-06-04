
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { cn } from '@/lib/utils';

interface QuoteAssignmentSectionProps {
  formData: Partial<Quote>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: any[];
  isLoadingClients: boolean;
  errors?: Record<string, string>;
}

export const QuoteAssignmentSection = ({ 
  formData, 
  onFieldChange, 
  clientOptions, 
  isLoadingClients,
  errors = {}
}: QuoteAssignmentSectionProps) => {
  console.log('QuoteAssignmentSection - Errors received:', errors);
  console.log('QuoteAssignmentSection - client_id error:', errors.client_id);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2" />
          Attribution
        </CardTitle>
        <CardDescription>
          Sélectionner le client et le véhicule pour ce devis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id" required className={cn(errors.client_id && "text-red-500")}>
              Client
            </Label>
            <Select
              value={formData.client_id || ''}
              onValueChange={(value) => onFieldChange('client_id', value)}
            >
              <SelectTrigger 
                id="client_id"
                className={cn(
                  errors.client_id && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
                )}
              >
                <SelectValue placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client"} />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.client_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="vehicle_id" className={cn(errors.vehicle_id && "text-red-500")}>
              Véhicule
            </Label>
            <Select
              value={formData.vehicle_id || ''}
              onValueChange={(value) => onFieldChange('vehicle_id', value)}
            >
              <SelectTrigger 
                id="vehicle_id"
                className={cn(
                  errors.vehicle_id && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
                )}
              >
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-vehicle">Aucun véhicule sélectionné</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicle_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.vehicle_id}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
