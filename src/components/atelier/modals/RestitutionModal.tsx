import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { Dossier } from '@/types/atelier';
import { AtelierPhotoCapture } from '../AtelierPhotoCapture';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

interface RestitutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossier: Dossier | null;
  onSubmit: (dossier: Dossier, dateRestitution: string, heureRestitution: string, restitutionPhotos: CapturedPhoto[]) => void;
}

export const RestitutionModal = ({ open, onOpenChange, dossier, onSubmit }: RestitutionModalProps) => {
  const [form, setForm] = useState({ dateRestitution: '', heureRestitution: '' });
  const [restitutionPhotos, setRestitutionPhotos] = useState<CapturedPhoto[]>([]);

  const handleSubmit = () => {
    if (!dossier || !form.dateRestitution || !form.heureRestitution || restitutionPhotos.length < 2) return;
    onSubmit(dossier, form.dateRestitution, form.heureRestitution, restitutionPhotos);
    setForm({ dateRestitution: '', heureRestitution: '' });
    setRestitutionPhotos([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Planifier RDV restitution
          </DialogTitle>
        </DialogHeader>

        {dossier && (
          <p className="text-muted-foreground">
            {dossier.immatriculation} - {dossier.prenom} {dossier.nom}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={form.dateRestitution}
              onChange={e => setForm({ ...form, dateRestitution: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label>Heure</Label>
            <Input
              type="time"
              value={form.heureRestitution}
              onChange={e => setForm({ ...form, heureRestitution: e.target.value })}
            />
          </div>
        </div>

        {/* Photos de restitution */}
        <AtelierPhotoCapture
          photos={restitutionPhotos}
          onPhotosChange={setRestitutionPhotos}
          minPhotos={2}
          title="Photos du véhicule à la restitution"
        />

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!form.dateRestitution || !form.heureRestitution || restitutionPhotos.length < 2}
            className="flex-1 bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            Confirmer
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
