import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortConfig } from '@/hooks/use-table-sorting';
import { cn } from '@/lib/utils';

interface SortableTableHeaderProps {
  sortKey: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  sortKey,
  sortConfig,
  onSort,
  children,
  className
}) => {
  const isActive = sortConfig.key === sortKey;
  const direction = isActive ? sortConfig.direction : null;

  const getSortIcon = () => {
    if (!isActive || direction === null) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (direction === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  return (
    <TableHead 
      className={cn(
        "cursor-pointer select-none hover:bg-gray-50 transition-colors",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {getSortIcon()}
      </div>
    </TableHead>
  );
};