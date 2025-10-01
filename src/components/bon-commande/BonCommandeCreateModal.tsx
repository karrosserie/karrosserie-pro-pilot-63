import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/use-company-id';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface BonCommandeCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BonCommandeCreateModal({ open, onOpenChange }: BonCommandeCreateModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { companyId } = useCompanyId();
  const { toast } = useToast();

  // Récupérer les clients
  const { data: clients = [] } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('company_id', companyId)
        .order('last_name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId && open,
  });

  // Récupérer les devis
  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('quotes')
        .select('id, reference')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId && open,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleValidate = async () => {
    if (!selectedFile || !companyId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload vers Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${companyId}/bon-commande/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Enregistrer dans la table bon_commande
      const { error: insertError } = await supabase
        .from('bon_commande')
        .insert({
          company_id: companyId,
          client_id: selectedClientId || null,
          quote_id: selectedQuoteId || null,
          file_url: publicUrl,
          file_name: selectedFile.name,
          file_type: selectedFile.type
        });

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: "Bon de commande créé avec succès"
      });

      onOpenChange(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedClientId('');
      setSelectedQuoteId('');
    } catch (error: any) {
      console.error('Erreur lors de la création du bon de commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le bon de commande",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedClientId('');
    setSelectedQuoteId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau bon de commande</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client (optionnel)</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun client</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Devis associé (optionnel)</Label>
            <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
              <SelectTrigger id="quote">
                <SelectValue placeholder="Sélectionner un devis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun devis</SelectItem>
                {quotes.map((quote) => (
                  <SelectItem key={quote.id} value={quote.id}>
                    {quote.reference}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedFile ? (
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                className="h-32 border-2 border-dashed hover:border-primary"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8" />
                  <span>Télécharger un fichier</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCameraClick}
                className="h-32 border-2 border-dashed hover:border-primary"
              >
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8" />
                  <span>Prendre une photo</span>
                </div>
              </Button>

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="border rounded-lg p-4">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-contain"
                  />
                )}
                <p className="text-sm text-center mt-2">{selectedFile.name}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={removeFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
              Annuler
            </Button>
            <Button onClick={handleValidate} disabled={!selectedFile || isUploading}>
              {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
