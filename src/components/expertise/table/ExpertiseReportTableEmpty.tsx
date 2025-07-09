
import React from 'react';
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FileText } from 'lucide-react';

export const ExpertiseReportTableEmpty: React.FC = () => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={8} className="text-center py-16">
          <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <div className="bg-gray-100 p-4 rounded-full">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Aucun rapport d'expertise
              </h3>
              <p className="text-sm text-gray-500">
                Commencez par importer votre premier rapport d'expertise.
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
