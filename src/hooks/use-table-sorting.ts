import { useState, useMemo, useEffect } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useTableSorting<T>(
  data: T[], 
  initialSortKey?: string,
  initialDirection: SortDirection = null
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: initialSortKey || '',
    direction: initialSortKey ? (initialDirection ?? 'asc') : null
  });

  // Synchroniser quand les props initiales changent (tri externe)
  useEffect(() => {
    setSortConfig({
      key: initialSortKey || '',
      direction: initialSortKey ? (initialDirection ?? 'asc') : null
    });
  }, [initialSortKey, initialDirection]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction || !data) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Convert to comparable types
      const aCompare = getComparableValue(aValue);
      const bCompare = getComparableValue(bValue);

      let comparison = 0;
      
      // Utiliser localeCompare pour les chaînes (tri français naturel)
      if (typeof aCompare === 'string' && typeof bCompare === 'string') {
        comparison = aCompare.localeCompare(bCompare, 'fr', { 
          sensitivity: 'base'  // Ignore casse ET accents
        });
      } else {
        if (aCompare < bCompare) comparison = -1;
        if (aCompare > bCompare) comparison = 1;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }

    setSortConfig({ key, direction });
  };

  return {
    sortedData,
    sortConfig,
    handleSort
  };
}

// Helper function to get nested object values (e.g., "clients.first_name")
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
}

// Helper function to convert values to comparable types
function getComparableValue(value: any): any {
  if (typeof value === 'string') {
    // Try to parse as date first
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateValue.getTime();
    }
    // Try to parse as number
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      return numValue;
    }
    // Return lowercase string for case-insensitive sorting
    return value.toLowerCase();
  }
  
  if (value instanceof Date) {
    return value.getTime();
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  // For objects, try to extract a meaningful string representation
  if (typeof value === 'object' && value !== null) {
    if (value.name) return value.name.toLowerCase();
    if (value.first_name && value.last_name) {
      return `${value.first_name} ${value.last_name}`.toLowerCase();
    }
    return JSON.stringify(value).toLowerCase();
  }
  
  return String(value).toLowerCase();
}