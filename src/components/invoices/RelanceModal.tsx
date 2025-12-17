import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from '@/services/supabase/invoices';
import { Mail, MessageSquare, Phone, FileText } from 'lucide-react';

interface RelanceModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRelance?: (invoice: Invoice, channel: string, relanceNumber: string) => void;
}

const RelanceModal = ({ invoice, open, onOpenChange, onRelance }: RelanceModalProps) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [relanceNumber, setRelanceNumber] = useState<string>('1');

  const channels = [
    { value: 'mail', label: 'Mail', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
    { value: 'courrier_recommande', label: 'Courrier recommandé', icon: FileText },
  ];

  const handleRelance = () => {
    if (invoice && selectedChannel && relanceNumber) {
      onRelance?.(invoice, selectedChannel, relanceNumber);
      // Reset form
      setSelectedChannel('');
      setRelanceNumber('1');
      onOpenChange(false);
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Envoyer une relance</DialogTitle>
          <DialogDescription>
            Facture {invoice.reference} - {invoice.clients && `${invoice.clients.first_name} ${invoice.clients.last_name}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel">Canal de relance</Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un canal" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => {
                  const IconComponent = channel.icon;
                  return (
                    <SelectItem key={channel.value} value={channel.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {channel.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relance-number">Numéro de relance</Label>
            <Input
              id="relance-number"
              type="number"
              min="1"
              value={relanceNumber}
              onChange={(e) => setRelanceNumber(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleRelance}
              disabled={!selectedChannel || !relanceNumber}
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            >
              Relancer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelanceModal;