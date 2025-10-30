import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Messagerie } from "@/hooks/use-messageries";

interface AddFollowUpRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagerie: Messagerie | null;
  onSuccess: () => void;
}

const CHANNELS = [
  { value: "Mail", label: "Mail", icon: Mail },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageSquare },
  { value: "SMS", label: "SMS", icon: MessageSquare },
  { value: "Téléphone", label: "Téléphone", icon: Phone },
  { value: "En personne", label: "En personne", icon: MessageSquare },
  { value: "Aucun", label: "Aucun (note interne)", icon: MessageSquare },
];

type ExchangeType = "client_replied" | "we_contacted" | "internal_note";

export function AddFollowUpRecordModal({
  isOpen,
  onClose,
  messagerie,
  onSuccess,
}: AddFollowUpRecordModalProps) {
  const [exchangeType, setExchangeType] = useState<ExchangeType>("client_replied");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [communicationDate, setCommunicationDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const { toast } = useToast();

  const handleSend = async () => {
    if (!replyText.trim()) {
      toast({
        title: "Contenu manquant",
        description: "Veuillez saisir le contenu de l'échange",
        variant: "destructive",
      });
      return;
    }

    if (exchangeType !== "internal_note" && !selectedChannel) {
      toast({
        title: "Canal manquant",
        description: "Veuillez sélectionner un canal de communication",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: userCompany } = await supabase
        .from("user_companies")
        .select("company_id")
        .eq("user_id", user.id)
        .single();

      if (!userCompany?.company_id) throw new Error("Entreprise non trouvée");

      let senderType: 'carrosserie' | 'client' | 'internal';
      let isInbound: boolean;

      switch (exchangeType) {
        case "client_replied":
          senderType = 'client';
          isInbound = true;
          break;
        case "we_contacted":
          senderType = 'carrosserie';
          isInbound = false;
          break;
        case "internal_note":
          senderType = 'internal';
          isInbound = false;
          break;
      }

      const { error } = await supabase
        .from("messagerie_replies")
        .insert({
          messagerie_id: messagerie!.id,
          company_id: userCompany.company_id,
          sender_type: senderType,
          sender_id: user.id,
          content: replyText,
          channel: selectedChannel || 'Aucun',
          actual_communication_date: new Date(communicationDate).toISOString(),
          is_inbound: isInbound,
          sent_at: new Date(communicationDate).toISOString(),
          read_by_client: false,
          read_by_company: true,
        });

      if (error) throw error;

      toast({
        title: "Échange enregistré",
        description: "L'échange a été ajouté à l'historique",
      });

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error saving reply:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer l'échange",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setExchangeType("client_replied");
      setSelectedChannel("");
      setReplyText("");
      setCommunicationDate(new Date().toISOString().slice(0, 16));
      onClose();
    }
  };

  if (!messagerie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un échange au fil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="font-medium">{messagerie.title}</div>
            <div className="text-sm text-muted-foreground">{messagerie.summary}</div>
            {messagerie.client && (
              <div className="text-sm">
                Client: {messagerie.client.first_name} {messagerie.client.last_name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date de cet échange *</Label>
            <Input
              type="datetime-local"
              value={communicationDate}
              onChange={(e) => setCommunicationDate(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type d'échange *</Label>
            <RadioGroup value={exchangeType} onValueChange={(v) => setExchangeType(v as ExchangeType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client_replied" id="client_replied" />
                <Label htmlFor="client_replied" className="font-normal cursor-pointer">
                  Client a répondu
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="we_contacted" id="we_contacted" />
                <Label htmlFor="we_contacted" className="font-normal cursor-pointer">
                  Nous avons recontacté le client
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal_note" id="internal_note" />
                <Label htmlFor="internal_note" className="font-normal cursor-pointer">
                  Note interne (pas d'échange)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {exchangeType !== "internal_note" && (
            <div className="space-y-2">
              <Label>Canal de communication *</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un canal" />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.filter(c => c.value !== "Aucun").map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <SelectItem key={channel.value} value={channel.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {channel.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>
              {exchangeType === "internal_note" ? "Note interne *" : "Contenu de l'échange *"}
            </Label>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={
                exchangeType === "internal_note"
                  ? "Ajouter une note interne..."
                  : "Résumé de l'échange..."
              }
              rows={8}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Ajouter à l'historique"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
