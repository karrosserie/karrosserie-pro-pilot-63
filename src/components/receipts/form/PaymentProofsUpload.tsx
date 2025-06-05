
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentProofsUploadProps {
  paymentProofs: string[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveProof: (index: number) => void;
}

export const PaymentProofsUpload = ({
  paymentProofs,
  onFileUpload,
  onRemoveProof
}: PaymentProofsUploadProps) => {
  return (
    <div>
      <Label htmlFor="payment_proofs">Preuves de paiement</Label>
      <div className="space-y-2">
        <Input
          id="payment_proofs"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={onFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-karrosserie-orange file:text-white hover:file:bg-karrosserie-orange/90"
        />
        <p className="text-sm text-gray-500">
          Vous pouvez uploader plusieurs fichiers (images ou PDF)
        </p>
        
        {paymentProofs && paymentProofs.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Fichiers ajoutés :</p>
            <div className="space-y-1">
              {paymentProofs.map((proof, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{proof}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProof(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
