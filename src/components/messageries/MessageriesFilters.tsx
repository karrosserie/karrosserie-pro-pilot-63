import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface MessageriesFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedClient: string;
  selectedPeriod: string;
  selectedPriority: string;
  selectedCategory: string;
  selectedStatus: string;
  clients: Client[];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClientChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function MessageriesFilters({
  searchTerm,
  selectedType,
  selectedClient,
  selectedPeriod,
  selectedPriority,
  selectedCategory,
  selectedStatus,
  clients,
  onSearchChange,
  onTypeChange,
  onClientChange,
  onPeriodChange,
  onPriorityChange,
  onCategoryChange,
  onStatusChange,
}: MessageriesFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger><SelectValue placeholder="Tous les canaux" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les canaux</SelectItem>
            <SelectItem value="Téléphone">📞 Téléphone</SelectItem>
            <SelectItem value="Mail">✉️ Mail</SelectItem>
            <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
            <SelectItem value="Message">📱 Message</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedClient} onValueChange={onClientChange}>
          <SelectTrigger><SelectValue placeholder="Tous les clients" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger><SelectValue placeholder="Toutes les périodes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={onPriorityChange}>
          <SelectTrigger><SelectValue placeholder="Toutes les urgences" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les urgences</SelectItem>
            <SelectItem value="1">🔴 Urgents</SelectItem>
            <SelectItem value="2">🟠 Haute priorité</SelectItem>
            <SelectItem value="3">🟡 Normale</SelectItem>
            <SelectItem value="4">🔵 Basse</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger><SelectValue placeholder="Toutes les catégories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="sinistre">🚗 Sinistre</SelectItem>
            <SelectItem value="devis">💰 Devis</SelectItem>
            <SelectItem value="sav">🔧 SAV</SelectItem>
            <SelectItem value="reclamation">⚠️ Réclamation</SelectItem>
            <SelectItem value="information">ℹ️ Information</SelectItem>
            <SelectItem value="facturation">📄 Facturation</SelectItem>
            <SelectItem value="autre">📦 Autre</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="nouveau">🆕 Nouveau</SelectItem>
            <SelectItem value="en_cours">⏳ En cours</SelectItem>
            <SelectItem value="en_attente_client">⏸️ En attente client</SelectItem>
            <SelectItem value="planifie">📅 Planifié</SelectItem>
            <SelectItem value="resolu">✅ Résolu</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
