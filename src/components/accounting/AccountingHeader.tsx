
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Plus, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AccountingHeaderProps {
  onAddTransaction: () => void;
  onExport: (type: 'fec' | 'excel' | 'pdf') => void;
}

export const AccountingHeader = ({ onAddTransaction, onExport }: AccountingHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          Comptabilité
        </h1>
        <p className="text-gray-600 mt-1">
          Pilotez votre activité en temps réel
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('fec')}>
              <FileText className="h-4 w-4 mr-2" />
              Export FEC (DGFiP)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('excel')}>
              <FileText className="h-4 w-4 mr-2" />
              Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              Bilan PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={onAddTransaction}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter transaction
        </Button>
      </div>
    </div>
  );
};
