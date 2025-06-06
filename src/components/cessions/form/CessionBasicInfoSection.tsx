import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CessionFormData, CessionFormErrors } from './types';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useAccounts } from '@/hooks/use-accounts';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CessionBasicInfoSectionProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  validationErrorMessage?: string | null;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
  onClearValidationError?: () => void;
}

export const CessionBasicInfoSection = ({
  formData,
  errors,
  validationErrorMessage,
  onFieldChange,
  onClearValidationError
}: CessionBasicInfoSectionProps) => {
  const { orders, isLoading: isLoadingOrders } = useRepairOrders();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { insuranceCompanies, isLoading: isLoadingInsurance } = useInsuranceCompanies();

  const formatRepairOrderDisplay = (order: any) => {
    const clientName = order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non assigné';
    const vehicleInfo = order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}` : 'Véhicule non assigné';
    const orderDate = order.created_at ? format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr }) : '';
    
    return `Ordre n°${order.reference} du ${orderDate} - ${clientName} - ${vehicleInfo}`;
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations de base</h3>
        
        {/* Ordre de réparation seul sur sa ligne */}
        <div className="space-y-2">
          <Label htmlFor="repair_order_id">Ordre de réparation *</Label>
          <Select
            value={formData.repair_order_id || ''}
            onValueChange={(value) => onFieldChange('repair_order_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingOrders ? "Chargement..." : "Sélectionner un ordre de réparation"} />
            </SelectTrigger>
            <SelectContent>
              {orders?.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {formatRepairOrderDisplay(order)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.repair_order_id && (
            <div className="text-sm text-red-600">{errors.repair_order_id}</div>
          )}
        </div>

        {/* Numéro de sinistre, Date du sinistre et Numéro de police sur la même ligne */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="incident_number">Numéro de sinistre *</Label>
            <Input
              id="incident_number"
              value={formData.incident_number}
              onChange={(e) => onFieldChange('incident_number', e.target.value)}
              placeholder="Saisir le numéro de sinistre"
            />
            {errors.incident_number && (
              <p className="text-sm text-red-600">{errors.incident_number}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident_date">Date du sinistre *</Label>
            <Input
              id="incident_date"
              type="date"
              value={formData.incident_date}
              onChange={(e) => onFieldChange('incident_date', e.target.value)}
            />
            {errors.incident_date && (
              <p className="text-sm text-red-600">{errors.incident_date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy_number">Numéro de police *</Label>
            <Input
              id="policy_number"
              value={formData.policy_number}
              onChange={(e) => onFieldChange('policy_number', e.target.value)}
              placeholder="Numéro de contrat d'assurance"
            />
            {errors.policy_number && (
              <p className="text-sm text-red-600">{errors.policy_number}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report_number">Numéro de rapport *</Label>
            <Input
              id="report_number"
              value={formData.report_number}
              onChange={(e) => onFieldChange('report_number', e.target.value)}
              placeholder="Saisir le numéro de rapport"
            />
            {errors.report_number && (
              <p className="text-sm text-red-600">{errors.report_number}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expert_name">Nom de l'expert *</Label>
            <Input
              id="expert_name"
              value={formData.expert_name}
              onChange={(e) => onFieldChange('expert_name', e.target.value)}
              placeholder="Nom de l'expert"
            />
            {errors.expert_name && (
              <p className="text-sm text-red-600">{errors.expert_name}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance_company_id">Assurance *</Label>
            <Select
              value={formData.insurance_company_id || ''}
              onValueChange={(value) => onFieldChange('insurance_company_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingInsurance ? "Chargement..." : "Sélectionner une compagnie d'assurance"} />
              </SelectTrigger>
              <SelectContent>
                {insuranceCompanies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.insurance_company_id && (
              <p className="text-sm text-red-600">{errors.insurance_company_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_account_id">Compte bancaire *</Label>
            <Select
              value={formData.bank_account_id || ''}
              onValueChange={(value) => onFieldChange('bank_account_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingAccounts ? "Chargement..." : "Sélectionner un compte bancaire"} />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} - {account.iban}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank_account_id && (
              <p className="text-sm text-red-600">{errors.bank_account_id}</p>
            )}
          </div>
        </div>
      </div>

      {/* AlertDialog pour afficher les erreurs de validation */}
      <AlertDialog open={!!validationErrorMessage} onOpenChange={() => onClearValidationError?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Données incomplètes</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {validationErrorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClearValidationError}>
              Compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
