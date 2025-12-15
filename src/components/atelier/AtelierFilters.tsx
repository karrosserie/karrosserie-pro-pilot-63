import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ClipboardList, AlertCircle, Eye, Key, FolderArchive } from 'lucide-react';
import { STATUS_CONFIG } from '@/types/atelier';

interface AtelierFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  alertsCount: number;
}

export const AtelierFilters = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  alertsCount
}: AtelierFiltersProps) => {
  const tabs = [
    { id: 'all', label: 'Tous', Icon: ClipboardList },
    { id: 'alertes', label: 'Alertes', Icon: AlertCircle, count: alertsCount },
    { id: 'expertise', label: 'Expertises', Icon: Eye },
    { id: 'restitution', label: 'Restitutions', Icon: Key },
    { id: 'clotures', label: 'Clôturés', Icon: FolderArchive }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
        {tabs.map(t => (
          <Button
            key={t.id}
            variant={activeTab === t.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2"
          >
            <t.Icon className="h-4 w-4" />
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-1.5 rounded-full">
                {t.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                <div className="flex items-center gap-2">
                  <v.Icon className="h-4 w-4" />
                  {v.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
