import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Car } from 'lucide-react';
import { isValidFrenchMobilePhone } from '@/utils/phoneValidation';
import { AtelierPhotoCapture } from '../AtelierPhotoCapture';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

interface NewDossierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any, entryPhotos: CapturedPhoto[]) => void;
}

export const NewDossierModal = ({ open, onOpenChange, onSubmit }: NewDossierModalProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    immatriculation: '',
    mobile: '',
    marqueModele: '',
    numeroSinistre: '',
    expertisePrevue: false,
    dateExpertise: '',
    heureExpertise: '',
    notes: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [entryPhotos, setEntryPhotos] = useState<CapturedPhoto[]>([]);

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
    setFormData({
      nom: '',
      prenom: '',
      immatriculation: '',
      mobile: '',
      marqueModele: '',
      numeroSinistre: '',
      expertisePrevue: false,
      dateExpertise: '',
      heureExpertise: '',
      notes: ''
    });
    setPhoneError('');
    setEntryPhotos([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              />
            </div>
            <div>
              <Label>Prénom</Label>
              <Input
                placeholder="Prénom"
                value={formData.prenom}
                onChange={e => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>
            <div>
              <Label>Immatriculation *</Label>
              <Input
                placeholder="AB-123-CD"
                value={formData.immatriculation}
                onChange={e => setFormData({ ...formData, immatriculation: e.target.value.toUpperCase() })}
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
              />
              {phoneError && (
                <p className="text-sm text-destructive mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <Label>Marque/Modèle</Label>
              <Input
                placeholder="Peugeot 308"
                value={formData.marqueModele}
                onChange={e => setFormData({ ...formData, marqueModele: e.target.value })}
              />
            </div>
            <div>
              <Label>N° Sinistre</Label>
              <Input
                placeholder="SIN-2025-00123"
                value={formData.numeroSinistre}
                onChange={e => setFormData({ ...formData, numeroSinistre: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="expertise"
              checked={formData.expertisePrevue}
              onCheckedChange={(checked) => setFormData({ ...formData, expertisePrevue: checked as boolean })}
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
                />
              </div>
              <div>
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={formData.heureExpertise}
                  onChange={e => setFormData({ ...formData, heureExpertise: e.target.value })}
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
            disabled={!formData.nom || !formData.immatriculation || !formData.mobile.trim() || phoneError !== '' || entryPhotos.length < 2}
            className="flex-1 bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            Créer
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
