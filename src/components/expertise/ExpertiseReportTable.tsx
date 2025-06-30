
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
  const isMobile = useIsMobile();

  if (isLoading) {
    return <ExpertiseReportTableLoading />;
  }

  if (error) {
    return <ExpertiseReportTableError error={error} />;
  }

  if (reports.length === 0) {
    return <ExpertiseReportTableEmpty />;
  }

  // Mobile view: cards
  if (isMobile) {
    return (
      <div className="space-y-3 p-4">
        {reports.map((report) => (
          <ExpertiseReportMobileCard
            key={report.id}
            report={report}
            onViewReport={onViewReport}
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
          <ExpertiseReportTableHeader />
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
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default ExpertiseReportTable;
