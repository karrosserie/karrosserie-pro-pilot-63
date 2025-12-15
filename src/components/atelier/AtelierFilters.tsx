import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    { id: 'all', label: 'Tous', icon: '📋' },
    { id: 'alertes', label: 'Alertes', icon: '⚠️', count: alertsCount },
    { id: 'expertise', label: 'Expertises', icon: '🔍' },
    { id: 'restitution', label: 'Restitutions', icon: '🔑' },
    { id: 'clotures', label: 'Clôturés', icon: '📁' }
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
        {tabs.map(t => (
          <Button
            key={t.id}
            variant={activeTab === t.id ? 'default' : 'secondary'}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2"
          >
            <span>{t.icon}</span>
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">
                {t.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Input
          type="text"
          placeholder="🔍 Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.icon} {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
