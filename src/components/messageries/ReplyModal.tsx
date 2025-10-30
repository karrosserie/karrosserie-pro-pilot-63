import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, Send, MessageCircle } from 'lucide-react';
import { Messagerie } from '@/hooks/use-messageries';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagerie: Messagerie | null;
}

const CHANNELS = [
  { value: 'mail', label: 'Mail', icon: Mail, description: 'Envoi par courrier électronique' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, description: 'Envoi via WhatsApp' },
  { value: 'sms', label: 'SMS', icon: Phone, description: 'Envoi par message texte' },
];

export const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  onClose,
  messagerie
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!selectedChannel || !messagerie) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un canal de communication",
        variant: "destructive",
      });
      return;
    }

    if (!replyText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez écrire un message de réponse",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // Enregistrer la réponse dans messagerie_replies
      const { error: replyError } = await supabase
        .from('messagerie_replies')
        .insert({
          messagerie_id: messagerie.id,
          company_id: messagerie.company_id,
          sender_type: 'carrosserie',
          sender_id: userData.user?.id,
          content: replyText,
          channel: CHANNELS.find(c => c.value === selectedChannel)?.label || selectedChannel,
        });

      if (replyError) throw replyError;

      // Optionnellement marquer comme résolu
      // await supabase
      //   .from('messageries')
      //   .update({ resolved: true })
      //   .eq('id', messagerie.id);

      const channelLabel = CHANNELS.find(c => c.value === selectedChannel)?.label;
      
      toast({
        title: "Réponse envoyée",
        description: `Votre réponse a été envoyée via ${channelLabel}`,
      });
      
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedChannel('');
      setReplyText('');
    }
  };

  if (!messagerie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Répondre au message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message original */}
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="font-medium text-sm">{messagerie.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{messagerie.summary}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Priorité {messagerie.priority}
              </Badge>
            </div>
            <div className="text-sm bg-background p-3 rounded border">
              <p className="font-medium text-xs mb-2 text-muted-foreground">Message reçu :</p>
              <p>{messagerie.message}</p>
            </div>
          </div>

          {/* Canal de communication */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Canal de communication *</Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir le moyen de communication" />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    <div className="flex items-center gap-2">
                      <channel.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{channel.label}</div>
                        <div className="text-xs text-muted-foreground">{channel.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Champ de réponse */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Votre réponse *</Label>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              rows={6}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              {replyText.length} caractères
            </p>
          </div>

          {/* Contact du destinataire */}
          {messagerie.contact && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="text-xs font-medium text-muted-foreground">Contact destinataire</Label>
              <p className="text-sm mt-1">{messagerie.contact}</p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSend}
              disabled={!selectedChannel || !replyText.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la réponse
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};