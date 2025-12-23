import { useState, useMemo, useEffect } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedData: T[];
  setCurrentPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function usePagination<T>({ 
  data, 
  itemsPerPage = 10 
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  
  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);
  
  // Réinitialiser à la page 1 si les données changent et la page actuelle est hors limites
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, totalPages, currentPage]);
  
  return {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    goToNextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    goToPreviousPage: () => setCurrentPage(p => Math.max(p - 1, 1)),
    startIndex: data.length > 0 ? startIndex + 1 : 0,
    endIndex,
    totalItems: data.length
  };
}
