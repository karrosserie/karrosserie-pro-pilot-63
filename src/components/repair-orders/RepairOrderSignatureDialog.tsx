
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import SignaturePad from '@/components/shared/SignaturePad';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { useToast } from '@/hooks/use-toast';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { Signature } from 'lucide-react';

interface RepairOrderSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repairOrder: RepairOrder | null;
}

const RepairOrderSignatureDialog: React.FC<RepairOrderSignatureDialogProps> = ({
  open,
  onOpenChange,
  repairOrder
}) => {
  const { toast } = useToast();
  const { updateOrder } = useRepairOrders();
  const [clientName, setClientName] = useState('');
  const [documentAccepted, setDocumentAccepted] = useState(false);
  const [clientSignature, setClientSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (open && repairOrder?.clients) {
      setClientName(`${repairOrder.clients.first_name} ${repairOrder.clients.last_name}`);
    }
  }, [open, repairOrder]);

  const handleSave = async () => {
    if (!clientName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom et prénom du client.",
        variant: "destructive"
      });
      return;
    }

    if (!documentAccepted) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter les conditions du document.",
        variant: "destructive"
      });
      return;
    }

    if (!clientSignature) {
      toast({
        title: "Erreur",
        description: "Veuillez apposer votre signature.",
        variant: "destructive"
      });
      return;
    }

    if (!repairOrder?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la signature.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update the repair order status to "Signé"
      await updateOrder.mutateAsync({
        id: repairOrder.id,
        data: {
          status: 'Signé',
          client_signature: clientSignature,
          client_name_signature: clientName,
          signature_date: new Date().toISOString()
        }
      });

      toast({
        title: "Signature enregistrée",
        description: `L'ordre de réparation ${repairOrder?.reference} a été signé par le client.`
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating repair order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la signature. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientName('');
    setDocumentAccepted(false);
    setClientSignature('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Signature className="h-5 w-5" />
            Signature du client - Ordre de réparation
          </DialogTitle>
        </DialogHeader>

        <div className="pt-6 space-y-6">
          {/* Legal notice */}
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              La signature électronique a la même valeur légale qu'une signature manuscrite.<br/>
              Exigence issue du Règlement eIDAS et du Code civil français, art. 1366-1367).<br/>
              Toute modification du présent document nécessitera une nouvelle signature du client.
            </p>
          </div>

          {/* Signature pad */}
          <SignaturePad
            value={clientSignature}
            onSignatureChange={setClientSignature}
          />

          {/* Client name */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium">
              Nom et prénom
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nom et prénom du client"
            />
          </div>

          {/* Acceptance checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="documentAccepted"
              checked={documentAccepted}
              onCheckedChange={(checked) => setDocumentAccepted(checked === true)}
              className="data-[state=checked]:bg-karrosserie-orange data-[state=checked]:border-karrosserie-orange"
            />
            <Label htmlFor="documentAccepted" className="text-sm leading-relaxed font-normal">
              Je certifie avoir pris connaissance de l'intégralité du document présent, 
              et reconnais que ma signature apposée électroniquement sur la présente tablette 
              vaut engagement ferme et personnel. Je confirme que cette signature constitue 
              l'expression de mon consentement libre et éclairé, et engage ma pleine 
              responsabilité juridique.
            </Label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer la signature"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepairOrderSignatureDialog;
