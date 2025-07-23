
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
    </div>
  );
};
