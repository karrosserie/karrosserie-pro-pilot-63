
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Account {
  id: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  type: string;
  status: string;
  last_sync: string;
}

// Mock data for accounts
const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Compte Principal',
    bank: 'Banque Populaire',
    iban: 'FR76 1***************45',
    bic: 'CCBPFRPPNCY',
    balance: 15420.50,
    type: 'Courant',
    status: 'Actif',
    last_sync: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Compte Épargne',
    bank: 'Crédit Agricole',
    iban: 'FR14 2***************89',
    bic: 'AGRIFRPP',
    balance: 8750.00,
    type: 'Épargne',
    status: 'Actif',
    last_sync: '2024-01-19T10:15:00Z'
  },
  {
    id: '3',
    name: 'Compte Professionnel',
    bank: 'BNP Paribas',
    iban: 'FR35 3***************12',
    bic: 'BNPAFRPP',
    balance: 3250.75,
    type: 'Professionnel',
    status: 'Inactif',
    last_sync: '2024-01-18T16:45:00Z'
  }
];

export const useAccounts = () => {
  const [accounts] = useState<Account[]>(mockAccounts);
  const { toast } = useToast();

  const handleDelete = (account: Account) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte ${account.name} ?`)) {
      toast({
        title: "Suppression",
        description: `Compte ${account.name} supprimé`
      });
    }
  };

  const handleSync = (account: Account) => {
    toast({
      title: "Synchronisation",
      description: `Synchronisation du compte ${account.name} en cours...`
    });
  };

  const filterAccounts = (accounts: Account[], searchTerm: string) => {
    return accounts.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    accounts,
    handleDelete,
    handleSync,
    filterAccounts
  };
};
