
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import SignaturePad from '@/components/shared/SignaturePad';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { useToast } from '@/hooks/use-toast';
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
  const [clientName, setClientName] = useState('');
  const [documentAccepted, setDocumentAccepted] = useState(false);
  const [clientSignature, setClientSignature] = useState('');

  React.useEffect(() => {
    if (open && repairOrder?.clients) {
      setClientName(`${repairOrder.clients.first_name} ${repairOrder.clients.last_name}`);
    }
  }, [open, repairOrder]);

  const handleSave = () => {
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

    toast({
      title: "Signature enregistrée",
      description: `L'ordre de réparation ${repairOrder?.reference} a été signé par le client.`
    });

    onOpenChange(false);
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

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Legal notice */}
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                La signature électronique a la même valeur légale qu'une signature manuscrite.
              </p>
              <p>
                Exigence issue du Règlement eIDAS et du Code civil français, art. 1366-1367).
              </p>
              <p>
                Toute modification du présent document nécessitera une nouvelle signature du client
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
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer la signature
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default RepairOrderSignatureDialog;
