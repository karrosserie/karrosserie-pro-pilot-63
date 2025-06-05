
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { Plus, X } from 'lucide-react';

interface MultiplePaymentProofsProps {
  receiptId: string;
  paymentProofs: string[];
  isViewMode: boolean;
  onProofAdd: (url: string) => void;
  onProofRemove: (index: number) => void;
  onProofUpdate: (index: number, url: string) => void;
}

const MultiplePaymentProofs: React.FC<MultiplePaymentProofsProps> = ({
  receiptId,
  paymentProofs,
  isViewMode,
  onProofAdd,
  onProofRemove,
  onProofUpdate
}) => {
  const addNewProofSlot = () => {
    // Ajouter un slot vide pour une nouvelle preuve
    onProofAdd('');
  };

  const handleProofUpload = (index: number, url: string) => {
    if (paymentProofs[index] === '') {
      // Si c'est un slot vide, utiliser onProofUpdate pour le remplir
      onProofUpdate(index, url);
    } else {
      // Si c'est une preuve existante, la remplacer
      onProofUpdate(index, url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Preuves de paiement</Label>
        {!isViewMode && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addNewProofSlot}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une preuve
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {paymentProofs.length === 0 && !isViewMode && (
          <DocumentUploader
            documentType="payment-proof"
            documentId={`${receiptId}-0`}
            currentDocumentUrl=""
            onUploadComplete={(url) => handleProofUpload(0, url)}
            isViewMode={isViewMode}
          />
        )}
        
        {paymentProofs.map((proofUrl, index) => (
          <div key={index} className="relative">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <DocumentUploader
                  documentType="payment-proof"
                  documentId={`${receiptId}-${index}`}
                  currentDocumentUrl={proofUrl}
                  onUploadComplete={(url) => handleProofUpload(index, url)}
                  isViewMode={isViewMode}
                />
              </div>
              {!isViewMode && paymentProofs.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onProofRemove(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiplePaymentProofs;
