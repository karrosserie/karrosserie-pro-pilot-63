
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
import { userActionWebhookService } from '@/services/tracking/UserActionWebhookService';

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
  const [disputeClauseAccepted, setDisputeClauseAccepted] = useState(false);
  const [mandatoryValidation, setMandatoryValidation] = useState(false);
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

    if (!disputeClauseAccepted) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter la clause de règlement des litiges.",
        variant: "destructive"
      });
      return;
    }

    if (!mandatoryValidation) {
      toast({
        title: "Erreur",
        description: "Veuillez cocher la case obligatoire pour valider l'ordre de réparation.",
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

      // Ajouter un message dans la conversation
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase
          .from('messageries')
          .insert({
            company_id: repairOrder.company_id,
            client_id: repairOrder.client_id,
            vehicle_id: repairOrder.vehicle_id,
            priority: 3,
            title: `Signature de l'ordre de réparation`,
            channel: 'En personne',
            message: `L'ordre de réparation ${repairOrder.reference} a été signé en personne par ${clientName}`,
            tags: ['signature', 'ordre_reparation'],
            resolved: false
          } as any);
        console.log('✅ Message de conversation créé pour signature en personne OR:', repairOrder.reference);
      } catch (msgError) {
        console.error('❌ Failed to create conversation message:', msgError);
      }

      toast({
        title: "Signature enregistrée",
        description: `L'ordre de réparation ${repairOrder?.reference} a été signé par le client.`
      });

      // IMPORTANT: Envoyer le webhook ET attendre qu'il se termine avant de fermer le dialogue
      try {
        console.log('📤 Envoi du webhook signature OR...', {
          repair_order_id: repairOrder.id,
          repair_order_reference: repairOrder.reference
        });
        
        await userActionWebhookService.sendUserAction('signature_or', {
          repair_order_id: repairOrder.id,
          repair_order_reference: repairOrder.reference
        });
        
        console.log('✅ Webhook signature OR envoyé avec succès');
      } catch (webhookError) {
        console.error('❌ Erreur lors de l\'envoi du webhook signature OR:', webhookError);
        // On ne bloque pas l'utilisateur même si le webhook échoue
      }

      // Fermer le dialogue seulement APRÈS l'envoi du webhook
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
    setDisputeClauseAccepted(false);
    setMandatoryValidation(false);
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

          {/* Dispute clause checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="disputeClauseAccepted"
              checked={disputeClauseAccepted}
              onCheckedChange={(checked) => setDisputeClauseAccepted(checked === true)}
              className="data-[state=checked]:bg-karrosserie-orange data-[state=checked]:border-karrosserie-orange"
            />
            <Label htmlFor="disputeClauseAccepted" className="text-sm leading-relaxed font-normal">
              <strong>CLAUSE DE RÈGLEMENT DES LITIGES</strong><br/>
              Je soussigné(e) accepte expressément qu'en cas de litige relatif au présent ordre de réparation :
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>La procédure applicable soit exclusivement une procédure écrite sur pièces (art. 753 et suivants du Code de procédure civile)</li>
                <li>Je renonce expressément à toute audience de plaidoirie</li>
                <li>Compétence exclusive : Tribunal Judiciaire de Votre Ville</li>
                <li>Tentative de règlement amiable obligatoire de 30 jours préalablement à toute procédure</li>
              </ul>
              <br/>
              Cette acceptation vaut pour toute réclamation, contestation ou litige découlant de la présente réparation.
            </Label>
          </div>

          {/* Mandatory validation checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="mandatoryValidation"
              checked={mandatoryValidation}
              onCheckedChange={(checked) => setMandatoryValidation(checked === true)}
              className="data-[state=checked]:bg-karrosserie-orange data-[state=checked]:border-karrosserie-orange"
            />
            <Label htmlFor="mandatoryValidation" className="text-sm leading-relaxed font-normal">
              Case obligatoire à cocher pour valider l'ordre de réparation
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
