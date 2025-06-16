
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

interface Quote {
  id: string;
  reference?: string;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  vehicles?: {
    id: string;
    license_plate?: string;
    car_brands?: {
      id: string;
      name: string;
    };
    car_models?: {
      id: string;
      name: string;
    };
  };
}

interface QuoteEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote | null;
}

const QuoteEmailDialog: React.FC<QuoteEmailDialogProps> = ({
  open,
  onOpenChange,
  quote
}) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (quote && open) {
      console.log('Quote data for email dialog:', quote);
      console.log('Client data:', quote.clients);
      console.log('Client email:', quote.clients?.email);
      
      // Pré-remplir le destinataire avec l'email du client
      const clientEmail = quote.clients?.email || '';
      console.log('Setting recipient email to:', clientEmail);
      setRecipient(clientEmail);
      
      // Pré-remplir le sujet
      const licensePlate = quote.vehicles?.license_plate || 'véhicule';
      setSubject(`Devis pour le véhicule ${licensePlate}`);
      
      // Pré-remplir le message
      const clientName = quote.clients 
        ? `${quote.clients.first_name} ${quote.clients.last_name}`
        : 'client';
      setMessage(
        `Veuillez trouver ci-joint le devis pour le véhicule immatriculé ${licensePlate} appartenant à ${clientName}.`
      );
    }
  }, [quote, open]);

  const handleSend = async () => {
    if (!recipient.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse e-mail destinataire",
        variant: "destructive"
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un sujet",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de l'envoi d'e-mail
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail envoyé",
        description: `Le devis a été envoyé à ${recipient}`
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'e-mail",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      // Reset des champs
      setRecipient('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer le devis par e-mail
          </DialogTitle>
          <DialogDescription>
            {quote && (
              <>Envoi du devis {quote.reference} par e-mail</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Destinataire <span className="text-red-500">*</span>
            </Label>
            <Input
              id="recipient"
              type="email"
              placeholder="email@exemple.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Sujet <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Sujet de l'e-mail"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteEmailDialog;
