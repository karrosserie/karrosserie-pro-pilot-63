
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { SortConfig } from '@/hooks/use-table-sorting';

interface ExpertiseReportTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export const ExpertiseReportTableHeader: React.FC<ExpertiseReportTableHeaderProps> = ({
  sortConfig,
  onSort
}) => {
  return (
    <TableHeader>
      <TableRow>
        <SortableTableHeader 
          sortKey="report_number" 
          onSort={onSort} 
          sortConfig={sortConfig}
          className="w-[200px]"
        >
          Numéro
        </SortableTableHeader>
        <SortableTableHeader 
          sortKey="created_at" 
          onSort={onSort} 
          sortConfig={sortConfig}
          className="w-[120px]"
        >
          Date
        </SortableTableHeader>
        <SortableTableHeader 
          sortKey="client" 
          onSort={onSort} 
          sortConfig={sortConfig}
        >
          Client
        </SortableTableHeader>
        <SortableTableHeader 
          sortKey="vehicle" 
          onSort={onSort} 
          sortConfig={sortConfig}
        >
          Véhicule
        </SortableTableHeader>
        <SortableTableHeader 
          sortKey="amount" 
          onSort={onSort} 
          sortConfig={sortConfig}
          className="w-[120px]"
        >
          Montant
        </SortableTableHeader>
        <SortableTableHeader 
          sortKey="status" 
          onSort={onSort} 
          sortConfig={sortConfig}
          className="w-[120px]"
        >
          Statut
        </SortableTableHeader>
      </TableRow>
    </TableHeader>
  );
};
