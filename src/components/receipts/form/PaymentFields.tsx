
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface PaymentFieldsProps {
  status: string;
  paymentMethod: string;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

export const PaymentFields = ({
  status,
  paymentMethod,
  onStatusChange,
  onPaymentMethodChange
}: PaymentFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="status" required>Statut</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Encaissé">Encaissé</SelectItem>
            <SelectItem value="Annulé">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="payment_method" required>Méthode de paiement</Label>
        <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Virement">Virement</SelectItem>
            <SelectItem value="Chèque">Chèque</SelectItem>
            <SelectItem value="Espèces">Espèces</SelectItem>
            <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
            <SelectItem value="Argent mobile">Argent mobile</SelectItem>
            <SelectItem value="Paiement en ligne">Paiement en ligne</SelectItem>
            <SelectItem value="Autres">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
