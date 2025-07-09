
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ExpertiseReportTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Numéro de rapport</TableHead>
        <TableHead className="w-[120px]">Date du rapport</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Véhicule</TableHead>
        <TableHead>Expert</TableHead>
        <TableHead className="w-[120px]">Montant</TableHead>
        <TableHead className="w-[120px]">Statut</TableHead>
        <TableHead className="text-right w-[160px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
