import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Loader2, FileText } from 'lucide-react';
import { DossierWithDetails, DossierOverallStatus, DOSSIER_STATUS_CONFIG } from '@/types/dossier';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';

export interface EditDossierFormData {
  claim_number?: string;
  policy_number?: string;
  notes?: string;
  overall_status?: DossierOverallStatus;
  insurance_company_id?: string | null;
}

interface EditDossierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossier: DossierWithDetails;
  onSubmit: (data: EditDossierFormData) => void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS: DossierOverallStatus[] = [
  'ouvert', 'en_cours', 'expertise', 'devis', 'reparation', 'facturation', 'cloture'
];

export const EditDossierModal = ({ 
  open, 
  onOpenChange, 
  dossier, 
  onSubmit, 
  isSubmitting = false 
}: EditDossierModalProps) => {
  const { insuranceCompanies } = useInsuranceCompanies();
  
  const [formData, setFormData] = useState<EditDossierFormData>({
    claim_number: '',
    policy_number: '',
    notes: '',
    overall_status: 'ouvert',
    insurance_company_id: null,
  });

  useEffect(() => {
    if (dossier && open) {
      setFormData({
        claim_number: dossier.claim_number || '',
        policy_number: dossier.policy_number || '',
        notes: dossier.notes || '',
        overall_status: (dossier.overall_status as DossierOverallStatus) || 'ouvert',
        insurance_company_id: dossier.insurance_company_id || null,
      });
    }
  }, [dossier, open]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const insuranceOptions = insuranceCompanies.map(company => ({
    value: company.id,
    label: company.name
  }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modifier le dossier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Statut</Label>
            <Select 
              value={formData.overall_status} 
              onValueChange={(value) => setFormData({ ...formData, overall_status: value as DossierOverallStatus })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {DOSSIER_STATUS_CONFIG[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assurance</Label>
            <SearchableSelect
              options={insuranceOptions}
              value={formData.insurance_company_id || ''}
              onValueChange={(value) => setFormData({ ...formData, insurance_company_id: value || null })}
              placeholder="Sélectionner une assurance"
              searchPlaceholder="Rechercher une assurance..."
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>N° Sinistre</Label>
            <Input
              placeholder="SIN-2025-00123"
              value={formData.claim_number}
              onChange={e => setFormData({ ...formData, claim_number: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>N° Police</Label>
            <Input
              placeholder="POL-12345"
              value={formData.policy_number}
              onChange={e => setFormData({ ...formData, policy_number: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes sur le dossier..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};