import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Quote } from '@/services/supabase/quotes';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuoteRepairItem, QuotePartItem } from './form/types';
import { calculateGlobalTotals } from './form/utils/calculations';
import { formatQuoteTable } from './utils/formatQuoteTable';

interface ContactExpertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote;
  onRequestSent: () => void;
}

export const ContactExpertDialog = ({
  open,
  onOpenChange,
  quote,
  onRequestSent
}: ContactExpertDialogProps) => {
  const { toast } = useToast();
  const [expertEmail, setExpertEmail] = useState('');
  const [expertPhone, setExpertPhone] = useState('');
  
  // Parser et calculer le tableau du devis
  const quoteDetails = useMemo(() => {
    try {
      const repairs: QuoteRepairItem[] = quote.repairs_data 
        ? JSON.parse(quote.repairs_data) 
        : [];
      const parts: QuotePartItem[] = quote.parts_data 
        ? JSON.parse(quote.parts_data) 
        : [];
      const totals = calculateGlobalTotals(repairs, parts, []);
      const table = formatQuoteTable(repairs, parts, totals);
      
      return { repairs, parts, totals, table };
    } catch (error) {
      console.error('Erreur parsing devis:', error);
      return { repairs: [], parts: [], totals: { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 }, table: '' };
    }
  }, [quote]);
  
  const [message, setMessage] = useState(
    `Bonjour,\n\nSuite à des modifications apportées au devis ${quote.reference}, nous avons besoin d'un rapport modificatif pour le dossier:\n\n` +
    `- Numéro de sinistre: ${quote.claim_number || 'N/A'}\n` +
    `- Numéro de rapport initial: ${quote.report_number || 'N/A'}\n` +
    `- Immatriculation: ${quote.vehicles?.license_plate || 'N/A'}\n` +
    `- Véhicule: ${quote.vehicles?.car_brands?.name || ''} ${quote.vehicles?.car_models?.name || ''}\n\n` +
    `DÉTAIL DU DEVIS MODIFIÉ:\n\n${quoteDetails.table}\n\n` +
    `Merci de nous faire parvenir le rapport modificatif dans les meilleurs délais.\n\n` +
    `Cordialement`
  );

  const handleSendEmail = () => {
    if (!expertEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir l'email de l'expert",
        variant: "destructive"
      });
      return;
    }

    // Ouvrir le client email
    const subject = encodeURIComponent(`Demande de rapport modificatif - ${quote.reference}`);
    const body = encodeURIComponent(message);
    window.open(`mailto:${expertEmail}?subject=${subject}&body=${body}`);
    
    onRequestSent();
    onOpenChange(false);
  };

  const handleSendSMS = () => {
    if (!expertPhone) {
      toast({
        title: "Téléphone requis",
        description: "Veuillez saisir le numéro de l'expert",
        variant: "destructive"
      });
      return;
    }

    // Ouvrir l'application SMS
    const smsMessage = encodeURIComponent(
      `Bonjour, nous avons besoin d'un rapport modificatif pour le dossier ${quote.claim_number || quote.reference}. Merci.`
    );
    window.open(`sms:${expertPhone}?body=${smsMessage}`);
    
    onRequestSent();
    onOpenChange(false);
  };

  const handleCall = () => {
    if (!expertPhone) {
      toast({
        title: "Téléphone requis",
        description: "Veuillez saisir le numéro de l'expert",
        variant: "destructive"
      });
      return;
    }

    window.open(`tel:${expertPhone}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contacter l'expert pour un modificatif</DialogTitle>
          <DialogDescription>
            Contactez l'expert pour demander un rapport modificatif suite aux changements apportés au devis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expert-name">Expert</Label>
            <Input
              id="expert-name"
              value={quote.expert_name || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expert-email">Email</Label>
              <Input
                id="expert-email"
                type="email"
                placeholder="email@expert.fr"
                value={expertEmail}
                onChange={(e) => setExpertEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expert-phone">Téléphone</Label>
              <Input
                id="expert-phone"
                type="tel"
                placeholder="06 12 34 56 78"
                value={expertPhone}
                onChange={(e) => setExpertPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col xs:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCall}
              disabled={!expertPhone}
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            <Button
              variant="outline"
              onClick={handleSendSMS}
              disabled={!expertPhone}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={!expertEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
