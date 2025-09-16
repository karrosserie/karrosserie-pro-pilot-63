import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, Send, Edit } from 'lucide-react';
import { Messagerie } from '@/hooks/use-messageries';
import { useToast } from '@/hooks/use-toast';

interface SemiAutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagerie: Messagerie | null;
}

const CHANNELS = [
  { value: 'email', label: 'Email', icon: Mail, description: 'Envoi par courrier électronique' },
  { value: 'sms', label: 'SMS', icon: Phone, description: 'Envoi par message texte' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, description: 'Envoi via WhatsApp' },
  { value: 'phone', label: 'Appel téléphonique', icon: Phone, description: 'Passer un appel' },
];

export const SemiAutoModal: React.FC<SemiAutoModalProps> = ({
  isOpen,
  onClose,
  messagerie
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (messagerie?.reponse) {
      setEditedResponse(messagerie.reponse);
    }
  }, [messagerie]);

  const handleSend = async () => {
    if (!selectedChannel || !messagerie) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un canal d'envoi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simuler l'envoi de la réponse
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const channelLabel = CHANNELS.find(c => c.value === selectedChannel)?.label;
      
      toast({
        title: "Réponse envoyée",
        description: `Votre réponse a été envoyée via ${channelLabel}`,
      });
      
      onClose();
      setSelectedChannel('');
      setIsEditing(false);
    } catch (error) {
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
      setIsEditing(false);
      setEditedResponse(messagerie?.reponse || '');
    }
  };

  if (!messagerie) return null;

  const responseText = isEditing ? editedResponse : (messagerie.reponse || 'Aucune réponse automatique générée pour ce message.');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Réponse semi-automatique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du message original */}
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
              <p className="font-medium text-xs mb-2">Message original :</p>
              <p>{messagerie.message}</p>
            </div>
          </div>

          {/* Réponse générée */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Réponse suggérée</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
            </div>
            
            {isEditing ? (
              <Textarea
                value={editedResponse}
                onChange={(e) => setEditedResponse(e.target.value)}
                rows={6}
                placeholder="Modifiez la réponse..."
                className="min-h-[120px]"
              />
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{responseText}</p>
              </div>
            )}
          </div>

          {/* Sélection du canal d'envoi */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Canal d'envoi</Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le moyen d'envoi" />
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
              disabled={!selectedChannel || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                  Envoi...
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