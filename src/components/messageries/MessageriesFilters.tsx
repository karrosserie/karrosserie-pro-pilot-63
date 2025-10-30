import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MessageriesFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedCarrosserie: string;
  selectedPeriod: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onCarrosserieChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
}

export function MessageriesFilters({
  searchTerm,
  selectedType,
  selectedCarrosserie,
  selectedPeriod,
  onSearchChange,
  onTypeChange,
  onCarrosserieChange,
  onPeriodChange,
}: MessageriesFiltersProps) {
  return (
    <div className="bg-card rounded-lg border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Select value={selectedCarrosserie} onValueChange={onCarrosserieChange}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les carrosseries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les carrosseries</SelectItem>
            <SelectItem value="carrosserie1">Carrosserie 1</SelectItem>
            <SelectItem value="carrosserie2">Carrosserie 2</SelectItem>
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
