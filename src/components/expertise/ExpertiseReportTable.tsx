
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ExpertiseReportTableHeader } from './table/ExpertiseReportTableHeader';
import { ExpertiseReportTableRow } from './table/ExpertiseReportTableRow';
import { ExpertiseReportTableEmpty } from './table/ExpertiseReportTableEmpty';
import { ExpertiseReportTableLoading } from './table/ExpertiseReportTableLoading';
import { ExpertiseReportTableError } from './table/ExpertiseReportTableError';
import ExpertiseReportMobileCard from './ExpertiseReportMobileCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText } from 'lucide-react';
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableSorting } from '@/hooks/use-table-sorting';

interface ExpertiseReportTableProps {
  reports: ExpertiseReport[];
  isLoading: boolean;
  error: Error | null;
  onEditReport: (report: ExpertiseReport) => void;
  onDeleteReport: (id: string) => void;
  onConvertToQuote?: (report: ExpertiseReport) => void;
  convertingReportId?: string | null;
  convertedReports?: Record<string, any>;
}

const ExpertiseReportTable: React.FC<ExpertiseReportTableProps> = ({
  reports,
  isLoading,
  error,
  onEditReport,
  onDeleteReport,
  onConvertToQuote,
  convertingReportId,
  convertedReports = {}
}) => {
  const isMobile = useIsMobile();
  const { sortedData, sortConfig, handleSort } = useTableSorting(reports, 'created_at');

  // Mobile view: cards
  if (isMobile) {
    return (
      <div className="space-y-3 p-4">
        {sortedData.map((report) => (
          <ExpertiseReportMobileCard
            key={report.id}
            report={report}
            onEditReport={onEditReport}
            onDeleteReport={onDeleteReport}
          />
        ))}
      </div>
    );
  }

  // Desktop view: table
  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table>
          <ExpertiseReportTableHeader 
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Chargement des rapports d'expertise...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-red-500">
                  Erreur lors du chargement des rapports: {error.message}
                </TableCell>
              </TableRow>
            ) : sortedData.length > 0 ? (
              sortedData.map((report) => (
                <ExpertiseReportTableRow
                  key={report.id}
                  report={report}
                  onEditReport={onEditReport}
                  onDeleteReport={onDeleteReport}
                  onConvertToQuote={onConvertToQuote}
                  isConverting={convertingReportId === report.id}
                  isConverted={!!convertedReports[report.id]}
                />
              ))
            ) : (
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
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default ExpertiseReportTable;
