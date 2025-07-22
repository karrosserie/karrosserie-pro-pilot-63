import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface FleetAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string | null;
  loanData?: {
    vehicle: string;
    client: string;
    startDate: string;
    expectedReturnDate: string;
  };
}

const FleetAttestationDialog: React.FC<FleetAttestationDialogProps> = ({
  open,
  onOpenChange,
  loanId,
  loanData
}) => {
  const handleDownloadAttestation = () => {
    // TODO: Implémenter la génération et le téléchargement de l'attestation PDF
    console.log('Télécharger attestation pour le prêt:', loanId);
  };

  const handleViewAttestation = () => {
    // TODO: Implémenter l'ouverture de l'attestation dans un nouvel onglet
    console.log('Visualiser attestation pour le prêt:', loanId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attestation de prêt
          </DialogTitle>
          <DialogDescription>
            Visualisation et téléchargement de l'attestation de prêt de véhicule
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loanData && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-gray-900">Détails du prêt</h3>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Véhicule:</span> {loanData.vehicle}</p>
                <p><span className="font-medium">Client:</span> {loanData.client}</p>
                <p><span className="font-medium">Période:</span> Du {loanData.startDate} au {loanData.expectedReturnDate}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleViewAttestation}
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Visualiser l'attestation
            </Button>
            
            <Button 
              onClick={handleDownloadAttestation}
              className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger l'attestation
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            L'attestation sera générée au format PDF avec les informations du prêt
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FleetAttestationDialog;