
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Receipt {
  id: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  client: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
}

// Mock data for receipts
const mockReceipts: Receipt[] = [
  {
    id: '1',
    reference: 'ENC2024-001',
    date: '2024-01-15',
    amount: 1250.00,
    status: 'Encaissé',
    client: 'Jean Dupont',
    invoice: 'F2024-045',
    payment_method: 'Virement',
    bank_account: 'Compte Principal'
  },
  {
    id: '2',
    reference: 'ENC2024-002',
    date: '2024-01-20',
    amount: 850.50,
    status: 'En attente',
    client: 'Marie Martin',
    invoice: 'F2024-052',
    payment_method: 'Chèque',
    bank_account: 'Compte Principal'
  }
];

export const useReceipts = () => {
  const [receipts] = useState<Receipt[]>(mockReceipts);
  const { toast } = useToast();

  const handleDelete = (receipt: Receipt) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'encaissement ${receipt.reference} ?`)) {
      toast({
        title: "Suppression",
        description: `Encaissement ${receipt.reference} supprimé`
      });
    }
  };

  const filterReceipts = (receipts: Receipt[], searchTerm: string) => {
    return receipts.filter(receipt => 
      receipt.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.invoice.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    receipts,
    handleDelete,
    filterReceipts
  };
};
