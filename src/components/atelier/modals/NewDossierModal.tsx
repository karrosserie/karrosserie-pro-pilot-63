import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Loader2 } from 'lucide-react';
import { isValidFrenchMobilePhone } from '@/utils/phoneValidation';
import { AtelierPhotoCapture } from '../AtelierPhotoCapture';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

export interface NewDossierFormData {
  nom: string;
  prenom: string;
  immatriculation: string;
  mobile: string;
  brand_id: string;
  model_id: string;
  vin: string;
  numeroSinistre: string;
  expertisePrevue: boolean;
  dateExpertise: string;
  heureExpertise: string;
  notes: string;
}

interface NewDossierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewDossierFormData, entryPhotos: CapturedPhoto[]) => void;
  isSubmitting?: boolean;
}

export const NewDossierModal = ({ open, onOpenChange, onSubmit, isSubmitting = false }: NewDossierModalProps) => {
  const [formData, setFormData] = useState<NewDossierFormData>({
    nom: '',
    prenom: '',
    immatriculation: '',
    mobile: '',
    brand_id: '',
    model_id: '',
    vin: '',
    numeroSinistre: '',
    expertisePrevue: false,
    dateExpertise: '',
    heureExpertise: '',
    notes: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [entryPhotos, setEntryPhotos] = useState<CapturedPhoto[]>([]);

  const { carBrands, isLoading: brandsLoading } = useCarBrands();
  const { carModels, isLoading: modelsLoading } = useCarModels(formData.brand_id);

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      setPhoneError('Le numéro de téléphone est obligatoire');
      return false;
    }
    if (!isValidFrenchMobilePhone(phone)) {
      setPhoneError('Seuls les numéros mobiles (06 ou 07) sont acceptés');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.immatriculation) return;
    if (!validatePhone(formData.mobile)) return;
    if (entryPhotos.length < 2) return;
    onSubmit(formData, entryPhotos);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      immatriculation: '',
      mobile: '',
      brand_id: '',
      model_id: '',
      vin: '',
      numeroSinistre: '',
      expertisePrevue: false,
      dateExpertise: '',
      heureExpertise: '',
      notes: ''
    });
    setPhoneError('');
    setEntryPhotos([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleBrandChange = (brandId: string) => {
    setFormData({ ...formData, brand_id: brandId, model_id: '' });
  };

  const isFormValid = formData.nom && 
    formData.immatriculation && 
    formData.mobile.trim() && 
    phoneError === '' && 
    entryPhotos.length >= 2;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Nouveau dossier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nom *</Label>
              <Input
                placeholder="Nom"
                value={formData.nom}
                onChange={e => setFormData({ ...formData, nom: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Prénom</Label>
              <Input
                placeholder="Prénom"
                value={formData.prenom}
                onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Immatriculation *</Label>
              <Input
                placeholder="AB-123-CD"
                value={formData.immatriculation}
                onChange={e => setFormData({ ...formData, immatriculation: e.target.value.toUpperCase() })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Mobile *</Label>
              <Input
                placeholder="06 12 34 56 78"
                value={formData.mobile}
                onChange={e => {
                  setFormData({ ...formData, mobile: e.target.value });
                  if (phoneError) validatePhone(e.target.value);
                }}
                onBlur={() => validatePhone(formData.mobile)}
                className={phoneError ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {phoneError && (
                <p className="text-sm text-destructive mt-1">{phoneError}</p>
              )}
            </div>
            
            {/* Marque */}
            <div>
              <Label>Marque</Label>
              <Select
                value={formData.brand_id}
                onValueChange={handleBrandChange}
                disabled={isSubmitting || brandsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={brandsLoading ? "Chargement..." : "Sélectionner"} />
                </SelectTrigger>
                <SelectContent>
                  {carBrands?.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modèle */}
            <div>
              <Label>Modèle</Label>
              <Select
                value={formData.model_id}
                onValueChange={value => setFormData({ ...formData, model_id: value })}
                disabled={isSubmitting || !formData.brand_id || modelsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={modelsLoading ? "Chargement..." : "Sélectionner"} />
                </SelectTrigger>
                <SelectContent>
                  {carModels?.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>VIN (optionnel)</Label>
              <Input
                placeholder="VF1AB123456789012"
                value={formData.vin}
                onChange={e => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>N° Sinistre</Label>
              <Input
                placeholder="SIN-2025-00123"
                value={formData.numeroSinistre}
                onChange={e => setFormData({ ...formData, numeroSinistre: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="expertise"
              checked={formData.expertisePrevue}
              onCheckedChange={(checked) => setFormData({ ...formData, expertisePrevue: checked as boolean })}
              disabled={isSubmitting}
            />
            <Label htmlFor="expertise">Expertise prévue</Label>
          </div>

          {formData.expertisePrevue && (
            <div className="grid grid-cols-2 gap-3 ml-6">
              <div>
                <Label>Date expertise</Label>
                <Input
                  type="date"
                  value={formData.dateExpertise}
                  onChange={e => setFormData({ ...formData, dateExpertise: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={formData.heureExpertise}
                  onChange={e => setFormData({ ...formData, heureExpertise: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          {/* Photos d'entrée */}
          <AtelierPhotoCapture
            photos={entryPhotos}
            onPhotosChange={setEntryPhotos}
            minPhotos={2}
            title="Photos du véhicule à l'entrée"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              'Créer'
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
