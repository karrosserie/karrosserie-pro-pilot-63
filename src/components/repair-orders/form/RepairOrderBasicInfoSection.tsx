import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { cn } from '@/lib/utils';

// Interface étendue temporaire pour le nouveau champ
interface ExtendedRepairOrder extends RepairOrder {
  order_date: string;
}

interface RepairOrderBasicInfoSectionProps {
  formData: Partial<ExtendedRepairOrder>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  claimNumber?: string;
  onClaimNumberChange?: (value: string) => void;
}

export const RepairOrderBasicInfoSection = ({ 
  formData, 
  errors, 
  onFieldChange,
  claimNumber = '',
  onClaimNumberChange
}: RepairOrderBasicInfoSectionProps) => {
  const statusOptions = [
    { value: 'En cours', label: 'En cours' },
    { value: 'En attente de pièces', label: 'En attente de pièces' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'En attente', label: 'En attente' },
    { value: 'En attente de signature', label: 'En attente de signature' },
    { value: 'Signature annulée', label: 'Signature annulée' },
    { value: 'Signé', label: 'Signé' },
    { value: 'Facturé', label: 'Facturé' },
    { value: 'Annulé', label: 'Annulé' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Numéro, date, statut et informations du sinistre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="reference" required>Numéro</Label>
            <Input
              id="reference"
              value={formData.reference || ''}
              readOnly
              className={cn(
                "bg-gray-50 cursor-not-allowed",
                errors.reference && "border-red-500 focus-visible:ring-red-500"
              )}
              placeholder="Généré automatiquement"
            />
            {errors.reference && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reference}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="order_date" required className={cn(errors.order_date && "text-red-500")}>
              Date
            </Label>
            <Input
              id="order_date"
              type="date"
              value={formData.order_date || ''}
              onChange={(e) => onFieldChange('order_date', e.target.value)}
              className={cn(
                errors.order_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.order_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.order_date}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || 'En cours'}
              onValueChange={(value) => onFieldChange('status', value)}
            >
              <SelectTrigger 
                id="status"
                className={cn(
                  errors.status && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.status}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="report_number" className={cn(errors.report_number && "text-red-500")}>
              Numéro de rapport
            </Label>
            <Input
              id="report_number"
              value={formData.report_number || ''}
              onChange={(e) => onFieldChange('report_number', e.target.value)}
              placeholder="Numéro de rapport"
              className={cn(
                errors.report_number && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.report_number && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.report_number}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="policy_number" className={cn(errors.policy_number && "text-red-500")}>
              Numéro de police
            </Label>
            <Input
              id="policy_number"
              value={formData.policy_number || ''}
              onChange={(e) => onFieldChange('policy_number', e.target.value)}
              placeholder="Numéro de police"
              className={cn(
                errors.policy_number && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.policy_number && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.policy_number}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="report_date" className={cn(errors.report_date && "text-red-500")}>
              Date du rapport
            </Label>
            <Input
              id="report_date"
              type="date"
              value={formData.report_date || ''}
              onChange={(e) => onFieldChange('report_date', e.target.value)}
              className={cn(
                errors.report_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.report_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.report_date}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="expert_name" className={cn(errors.expert_name && "text-red-500")}>
              Nom de l'expert
            </Label>
            <Input
              id="expert_name"
              value={formData.expert_name || ''}
              onChange={(e) => onFieldChange('expert_name', e.target.value)}
              placeholder="Nom de l'expert"
              className={cn(
                errors.expert_name && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.expert_name && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.expert_name}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="claim_number">Numéro de sinistre</Label>
            <Input
              id="claim_number"
              value={claimNumber}
              onChange={(e) => onClaimNumberChange?.(e.target.value)}
              placeholder="Numéro de sinistre"
              className={cn(
                errors.claim_number && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.claim_number && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.claim_number}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="incident_date" className={cn(errors.incident_date && "text-red-500")}>
              Date du sinistre
            </Label>
            <Input
              id="incident_date"
              type="date"
              value={formData.incident_date || ''}
              onChange={(e) => onFieldChange('incident_date', e.target.value)}
              className={cn(
                errors.incident_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.incident_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.incident_date}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="arrival_date">Date d'arrivée</Label>
            <Input
              id="arrival_date"
              type="date"
              value={formData.arrival_date || ''}
              onChange={(e) => onFieldChange('arrival_date', e.target.value)}
              className={cn(
                errors.arrival_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.arrival_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.arrival_date}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="cleanliness_condition">État de propreté</Label>
            <Select
              value={formData.cleanliness_condition || ''}
              onValueChange={(value) => onFieldChange('cleanliness_condition', value)}
            >
              <SelectTrigger
                id="cleanliness_condition"
                className={cn(
                  errors.cleanliness_condition && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionner un état de propreté" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-md z-50">
                <SelectItem value="Immaculé">Immaculé - Véhicule parfaitement propre, comme neuf</SelectItem>
                <SelectItem value="Très propre">Très propre - Légère couche de poussière fine à peine visible</SelectItem>
                <SelectItem value="Propre">Propre - Carrosserie avec légère saleté visible mais conservant son éclat</SelectItem>
                <SelectItem value="Acceptable">Acceptable - Saleté visible sur la carrosserie mais sans accumulation majeure</SelectItem>
                <SelectItem value="Négligé">Négligé - Couche évidente de poussière/saleté sur l'extérieur</SelectItem>
                <SelectItem value="Sale">Sale - Carrosserie recouverte de poussière/boue/sel</SelectItem>
                <SelectItem value="Très sale">Très sale - Boue/saleté épaisse sur l'extérieur</SelectItem>
                <SelectItem value="Extrêmement sale">Extrêmement sale - Véhicule visiblement non nettoyé depuis longtemps</SelectItem>
                <SelectItem value="Insalubre">Insalubre - État de saleté extrême présentant des risques sanitaires</SelectItem>
                <SelectItem value="État d'abandon">État d'abandon - Véhicule non entretenu depuis des mois/années</SelectItem>
              </SelectContent>
            </Select>
            {errors.cleanliness_condition && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.cleanliness_condition}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="start_date">Date de début</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => onFieldChange('start_date', e.target.value)}
              className={cn(
                errors.start_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.start_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.start_date}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="end_date">Date de fin</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => onFieldChange('end_date', e.target.value)}
              className={cn(
                errors.end_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.end_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.end_date}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="general_condition">État général</Label>
            <Select
              value={formData.general_condition || ''}
              onValueChange={(value) => onFieldChange('general_condition', value)}
            >
              <SelectTrigger
                id="general_condition"
                className={cn(
                  errors.general_condition && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionner un état général" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-md z-50">
                <SelectItem value="État neuf">État neuf - Véhicule sans aucun défaut, comme sorti d'usine</SelectItem>
                <SelectItem value="Excellent état">Excellent état - Quasi neuf avec signes d'utilisation minimes</SelectItem>
                <SelectItem value="Très bon état">Très bon état - Légères traces d'utilisation normales</SelectItem>
                <SelectItem value="Bon état">Bon état - Signes d'usure visibles mais bien entretenu</SelectItem>
                <SelectItem value="État correct">État correct - Usure générale visible</SelectItem>
                <SelectItem value="État moyen">État moyen - Défauts esthétiques notables</SelectItem>
                <SelectItem value="État médiocre">État médiocre - Dégradation significative</SelectItem>
                <SelectItem value="Mauvais état">Mauvais état - Détérioration importante</SelectItem>
                <SelectItem value="Très mauvais état">Très mauvais état - Véhicule fortement détérioré</SelectItem>
                <SelectItem value="État d'épave">État d'épave - Véhicule non roulant ou dangereux</SelectItem>
              </SelectContent>
            </Select>
            {errors.general_condition && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.general_condition}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
