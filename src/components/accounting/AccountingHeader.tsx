
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AccountingHeaderProps {
  onExport: (type: 'fec' | 'excel' | 'pdf') => void;
}

export const AccountingHeader = ({ onExport }: AccountingHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
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
      </div>
    </div>
  );
};
