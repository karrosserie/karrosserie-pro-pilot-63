
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ExpertiseReportTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Numéro</TableHead>
        <TableHead className="w-[120px]">Date</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Véhicule</TableHead>        
        <TableHead className="w-[120px]">Montant</TableHead>
        <TableHead className="w-[120px]">Statut</TableHead>
      </TableRow>
    </TableHeader>
  );
};
