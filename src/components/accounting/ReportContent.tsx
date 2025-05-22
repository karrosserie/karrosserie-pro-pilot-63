
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const ReportContent = () => {
  return (
    <div className="card-container p-6">
      <h3 className="text-lg font-semibold mb-4">Rapports financiers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button variant="outline" className="flex flex-col p-6 h-auto items-center justify-center">
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-medium">Bilan mensuel</span>
          <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
        </Button>
        <Button variant="outline" className="flex flex-col p-6 h-auto items-center justify-center">
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-medium">Bilan trimestriel</span>
          <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
        </Button>
        <Button variant="outline" className="flex flex-col p-6 h-auto items-center justify-center">
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-medium">Bilan annuel</span>
          <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
        </Button>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-4">Export pour cabinet comptable</h4>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter au format FEC
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter au format CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter au format Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
