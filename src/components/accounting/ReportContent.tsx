
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { ReportDateRangeDialog } from './ReportDateRangeDialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type DialogType = 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel' | null;

const ReportContent = () => {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const { toast } = useToast();

  const handleGenerate = (type: string, fromDate: Date, toDate: Date) => {
    const fromDateStr = format(fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(toDate, 'dd/MM/yyyy', { locale: fr });
    
    toast({
      title: "Génération en cours",
      description: `${type} du ${fromDateStr} au ${toDateStr} en cours de génération...`,
    });

    // Simulate file generation
    setTimeout(() => {
      toast({
        title: "Fichier généré",
        description: `${type} du ${fromDateStr} au ${toDateStr} prêt au téléchargement.`,
      });
    }, 2000);
  };

  const getDialogTitle = (type: DialogType): string => {
    switch (type) {
      case 'monthly': return 'Générer le bilan mensuel';
      case 'quarterly': return 'Générer le bilan trimestriel';
      case 'yearly': return 'Générer le bilan annuel';
      case 'fec': return 'Export au format FEC';
      case 'csv': return 'Export au format CSV';
      case 'excel': return 'Export au format Excel';
      default: return '';
    }
  };

  const getReportName = (type: DialogType): string => {
    switch (type) {
      case 'monthly': return 'Bilan mensuel';
      case 'quarterly': return 'Bilan trimestriel';
      case 'yearly': return 'Bilan annuel';
      case 'fec': return 'Export FEC';
      case 'csv': return 'Export CSV';
      case 'excel': return 'Export Excel';
      default: return '';
    }
  };

  return (
    <div className="card-container p-6">
      <h3 className="text-lg font-semibold mb-4">Rapports financiers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button 
          variant="outline" 
          className="flex flex-col p-6 h-auto items-center justify-center"
          onClick={() => setOpenDialog('monthly')}
        >
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-medium">Bilan mensuel</span>
          <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col p-6 h-auto items-center justify-center"
          onClick={() => setOpenDialog('quarterly')}
        >
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-medium">Bilan trimestriel</span>
          <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col p-6 h-auto items-center justify-center"
          onClick={() => setOpenDialog('yearly')}
        >
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-medium">Bilan annuel</span>
          <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
        </Button>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-4">Export pour cabinet comptable</h4>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => setOpenDialog('fec')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter au format FEC
          </Button>
          <Button 
            variant="outline"
            onClick={() => setOpenDialog('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter au format CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => setOpenDialog('excel')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter au format Excel
          </Button>
        </div>
      </div>

      <ReportDateRangeDialog
        open={openDialog !== null}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        title={getDialogTitle(openDialog)}
        onGenerate={(fromDate, toDate) => handleGenerate(getReportName(openDialog), fromDate, toDate)}
      />
    </div>
  );
};

export default ReportContent;
