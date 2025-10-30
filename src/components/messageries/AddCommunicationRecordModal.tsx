import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, Phone } from "lucide-react";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface AddCommunicationRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedClientId?: string;
}

const MESSAGE_TYPES = [
  { value: "Demande de devis", label: "Demande de devis" },
  { value: "Question technique", label: "Question technique" },
  { value: "Suivi dossier", label: "Suivi dossier" },
  { value: "Réclamation", label: "Réclamation" },
  { value: "Relance", label: "Relance" },
  { value: "Information", label: "Information" },
];

const CHANNELS = [
  { value: "Mail", label: "Mail", icon: Mail },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageSquare },
  { value: "SMS", label: "SMS", icon: MessageSquare },
  { value: "Téléphone", label: "Téléphone", icon: Phone },
  { value: "En personne", label: "En personne", icon: MessageSquare },
];

const PRIORITIES = [
  { value: 1, label: "Urgente", color: "text-red-600" },
  { value: 2, label: "Haute", color: "text-orange-600" },
  { value: 3, label: "Normale", color: "text-blue-600" },
  { value: 4, label: "Basse", color: "text-gray-600" },
];

export function AddCommunicationRecordModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedClientId,
}: AddCommunicationRecordModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [messageType, setMessageType] = useState("");
  const [channel, setChannel] = useState("");
  const [priority, setPriority] = useState("3");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [communicationDate, setCommunicationDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [direction, setDirection] = useState<"inbound" | "outbound">("inbound");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      if (preselectedClientId) {
        setSelectedClient(preselectedClientId);
      }
    }
  }, [isOpen, preselectedClientId]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("id, first_name, last_name, email, phone")
      .order("last_name");

    if (error) {
      console.error("Error fetching clients:", error);
      return;
    }

    setClients(data || []);
  };

  const handleSubmit = async () => {
    if (!selectedClient || !messageType || !channel || !title || !message) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
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

      const { error: messagerieError } = await supabase
        .from("messageries")
        .insert({
          company_id: userCompany.company_id,
          client_id: selectedClient,
          title,
          summary: summary || title,
          message,
          channel,
          priority: parseInt(priority),
          tags: [messageType],
          actual_communication_date: new Date(communicationDate).toISOString(),
          is_inbound: direction === "inbound",
          eta: "30min",
          time: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          resolved: false,
          archived: false,
        });

      if (messagerieError) throw messagerieError;

      toast({
        title: "Communication enregistrée",
        description: "L'échange a été ajouté à l'historique",
      });

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error creating record:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer la communication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedClient("");
    setMessageType("");
    setChannel("");
    setPriority("3");
    setTitle("");
    setSummary("");
    setMessage("");
    setCommunicationDate(new Date().toISOString().slice(0, 16));
    setDirection("inbound");
    setSearchTerm("");
    onClose();
  };

  const filteredClients = clients.filter(
    (client) =>
      client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enregistrer une communication passée</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Client *</Label>
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name} - {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date de l'échange *</Label>
            <Input
              type="datetime-local"
              value={communicationDate}
              onChange={(e) => setCommunicationDate(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label>Qui a contacté ? *</Label>
            <RadioGroup value={direction} onValueChange={(v) => setDirection(v as "inbound" | "outbound")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inbound" id="inbound" />
                <Label htmlFor="inbound" className="font-normal cursor-pointer">
                  Client → Carrosserie
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outbound" id="outbound" />
                <Label htmlFor="outbound" className="font-normal cursor-pointer">
                  Carrosserie → Client
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de communication *</Label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
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

            <div className="space-y-2">
              <Label>Canal utilisé *</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <SelectItem key={ch.value} value={ch.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {ch.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priorité *</Label>
            <Select value={priority} onValueChange={setPriority}>
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

          <div className="space-y-2">
            <Label>Titre *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Objet de la communication"
            />
          </div>

          <div className="space-y-2">
            <Label>Résumé (optionnel)</Label>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Courte description"
            />
          </div>

          <div className="space-y-2">
            <Label>Résumé de l'échange *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détails de la communication..."
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer dans l'historique"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
