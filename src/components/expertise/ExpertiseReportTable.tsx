
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ExpertiseReportTableHeader } from './table/ExpertiseReportTableHeader';
import { ExpertiseReportTableRow } from './table/ExpertiseReportTableRow';
import { ExpertiseReportTableEmpty } from './table/ExpertiseReportTableEmpty';
import { ExpertiseReportTableLoading } from './table/ExpertiseReportTableLoading';
import { ExpertiseReportTableError } from './table/ExpertiseReportTableError';

interface ExpertiseReportTableProps {
  reports: ExpertiseReport[];
  isLoading: boolean;
  error: Error | null;
  onViewReport: (report: ExpertiseReport) => void;
  onEditReport: (report: ExpertiseReport) => void;
  onDeleteReport: (id: string) => void;
}

const ExpertiseReportTable: React.FC<ExpertiseReportTableProps> = ({
  reports,
  isLoading,
  error,
  onViewReport,
  onEditReport,
  onDeleteReport
}) => {
  if (isLoading) {
    return <ExpertiseReportTableLoading />;
  }

  if (error) {
    return <ExpertiseReportTableError error={error} />;
  }

  return (
    <TooltipProvider>
      <Table>
        <ExpertiseReportTableHeader />
        {reports.length > 0 ? (
          <TableBody>
            {reports.map((report) => (
              <ExpertiseReportTableRow
                key={report.id}
                report={report}
                onViewReport={onViewReport}
                onEditReport={onEditReport}
                onDeleteReport={onDeleteReport}
              />
            ))}
          </TableBody>
        ) : (
          <ExpertiseReportTableEmpty />
        )}
      </Table>
    </TooltipProvider>
  );
};

export default ExpertiseReportTable;
