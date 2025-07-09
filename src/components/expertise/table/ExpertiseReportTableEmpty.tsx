
import React from 'react';
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FileText } from 'lucide-react';

export const ExpertiseReportTableEmpty: React.FC = () => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={8} className="text-center py-4">
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="font-medium text-gray-900">Aucun rapport d'expertise</h3>
            <p className="text-gray-500 mt-1">
              Commencez par importer votre premier rapport d'expertise.
            </p>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
