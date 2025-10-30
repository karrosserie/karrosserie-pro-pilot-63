import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  clients: Client[];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClientChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function MessageriesFilters({
  searchTerm,
  selectedType,
  selectedClient,
  selectedPeriod,
  selectedPriority,
  clients,
  onSearchChange,
  onTypeChange,
  onClientChange,
  onPeriodChange,
  onPriorityChange,
}: MessageriesFiltersProps) {
  return (
    <div className="bg-card rounded-lg border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Téléphone">Téléphone</SelectItem>
            <SelectItem value="Mail">Mail</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Message">Message</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedClient} onValueChange={onClientChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les clients" />
          </SelectTrigger>
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
          <SelectTrigger>
            <SelectValue placeholder="Toutes les périodes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={onPriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Urgence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les urgences</SelectItem>
            <SelectItem value="1">🔴 Urgents seulement</SelectItem>
            <SelectItem value="2">🟠 Haute priorité</SelectItem>
            <SelectItem value="3">🟡 Normale</SelectItem>
            <SelectItem value="4">🔵 Basse</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}
