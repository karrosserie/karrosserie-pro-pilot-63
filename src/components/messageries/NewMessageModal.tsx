import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedClientId?: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

const MESSAGE_TYPES = [
  { value: "justificatifs", label: "Demande de justificatifs" },
  { value: "avancement", label: "État d'avancement des travaux" },
  { value: "pret", label: "Véhicule prêt à récupérer" },
  { value: "question", label: "Question/Problème" },
  { value: "autre", label: "Autre" },
];

const CHANNELS = [
  { value: "Mail", label: "Mail" },
  { value: "SMS", label: "SMS" },
  { value: "WhatsApp", label: "WhatsApp" },
];

const PRIORITIES = [
  { value: 1, label: "Urgent", color: "text-red-600" },
  { value: 2, label: "Normal", color: "text-yellow-600" },
  { value: 3, label: "Faible", color: "text-green-600" },
];

export function NewMessageModal({ isOpen, onClose, onSuccess, preselectedClientId }: NewMessageModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId || "");
  const [messageType, setMessageType] = useState("");
  const [channel, setChannel] = useState("Mail");
  const [priority, setPriority] = useState(2);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      if (preselectedClientId) {
        setSelectedClientId(preselectedClientId);
      }
    }
  }, [isOpen, preselectedClientId]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name, email, phone')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedClientId || !messageType || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: companyData } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', userData.user?.id)
        .single();

      if (!companyData) throw new Error('Company not found');

      const selectedClient = clients.find(c => c.id === selectedClientId);
      const typeLabel = MESSAGE_TYPES.find(t => t.value === messageType)?.label || messageType;

      // Créer la messagerie
      const { data: messagerieData, error: messagerieError } = await supabase
        .from('messageries')
        .insert({
          client_id: selectedClientId,
          company_id: companyData.company_id,
          title: typeLabel,
          channel: channel,
          priority: priority,
          message: message,
          summary: message.substring(0, 100),
          eta: '30min',
          time: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          contact: selectedClient?.email || selectedClient?.phone || '',
          resolved: false,
          archived: false,
          tags: [messageType],
        })
        .select()
        .single();

      if (messagerieError) throw messagerieError;

      // Créer la première entrée dans messagerie_replies
      if (messagerieData) {
        const { error: replyError } = await supabase
          .from('messagerie_replies')
          .insert({
            messagerie_id: messagerieData.id,
            company_id: companyData.company_id,
            sender_type: 'carrosserie',
            sender_id: userData.user?.id,
            content: message,
            channel: channel,
          });

        if (replyError) throw replyError;
      }

      toast({
        title: "Succès",
        description: `Communication créée et envoyée via ${channel}`,
      });

      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la communication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedClientId(preselectedClientId || "");
      setMessageType("");
      setChannel("Mail");
      setPriority(2);
      setMessage("");
      setSearchTerm("");
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name} ${client.email || ''} ${client.phone || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Nouvelle communication client
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection du client */}
          <div className="space-y-2">
            <Label>Client *</Label>
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.first_name} {client.last_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {client.email || client.phone || 'Pas de contact'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type de communication */}
          <div className="space-y-2">
            <Label>Type de communication *</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {MESSAGE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Canal et Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Canal *</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((ch) => (
                    <SelectItem key={ch.value} value={ch.value}>
                      {ch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorité *</Label>
              <Select value={priority.toString()} onValueChange={(v) => setPriority(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value.toString()}>
                      <span className={p.color}>{p.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={6}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} caractères
            </p>
          </div>

          {/* Boutons */}
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
              onClick={handleSubmit}
              disabled={!selectedClientId || !messageType || !message.trim() || isLoading}
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
                  Créer et envoyer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
