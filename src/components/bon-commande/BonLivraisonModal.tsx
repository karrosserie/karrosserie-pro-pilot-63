import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/use-company-id';
import { FileUpload } from '@/components/ui/file-upload';

interface BonLivraisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bonCommandeId: string;
  clientId: string;
  fileName: string;
}

const BonLivraisonModal = ({ 
  open, 
  onOpenChange, 
  bonCommandeId, 
  clientId, 
  fileName 
}: BonLivraisonModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { companyId } = useCompanyId();
  const [formData, setFormData] = useState({
    transporteur: '',
    date_livraison_prevue: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
  };

  const uploadFileToStorage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `bon-livraison/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return { publicUrl, fileName: file.name, fileType: file.type };
  };

  const handleCreate = async () => {
    if (!companyId) {
      toast({
        title: "Erreur",
        description: "ID de l'entreprise manquant.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      let fileData = null;
      
      // Upload du fichier si présent
      if (selectedFile) {
        fileData = await uploadFileToStorage(selectedFile);
      }

      const { data, error } = await supabase
        .from('bon_livraison')
        .insert({
          company_id: companyId,
          bon_commande_id: bonCommandeId,
          client_id: clientId,
          transporteur: formData.transporteur || null,
          date_livraison_prevue: formData.date_livraison_prevue || null,
          notes: formData.notes || null,
          statut: 'Livré',
          file_url: fileData?.publicUrl || null,
          file_name: fileData?.fileName || null,
          file_type: fileData?.fileType || null
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: `Bon de livraison créé pour ${fileName}`
      });

      // Reset et fermer la modal
      setFormData({
        transporteur: '',
        date_livraison_prevue: '',
        notes: ''
      });
      setSelectedFile(null);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le bon de livraison.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      transporteur: '',
      date_livraison_prevue: '',
      notes: ''
    });
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un bon de livraison</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Créer un bon de livraison pour: <strong>{fileName}</strong>
          </p>

          <div className="space-y-2">
            <Label>Document de livraison (optionnel)</Label>
            <FileUpload
              onUpload={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transporteur">Transporteur (optionnel)</Label>
            <Input
              id="transporteur"
              value={formData.transporteur}
              onChange={(e) => handleInputChange('transporteur', e.target.value)}
              placeholder="Nom du transporteur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_prevue">Date de livraison prévue</Label>
            <Input
              id="date_prevue"
              type="date"
              value={formData.date_livraison_prevue}
              onChange={(e) => handleInputChange('date_livraison_prevue', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes sur la livraison..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isCreating}
            >
              <X className="w-4 h-4 mr-1" />
              Annuler
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Créer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BonLivraisonModal;