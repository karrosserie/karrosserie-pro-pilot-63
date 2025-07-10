
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { EmptyState } from '@/components/ui/empty-state';
import { Eye, Pencil, Trash, CreditCard, Building, Wallet, RefreshCw } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  bank: string;
  iban: string;
  bic: string;
  balance: number;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_sync?: string;
}

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onSync: (account: Account) => void;
}

export const AccountsTable = ({ accounts, onEdit, onDelete, onSync }: AccountsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-red-100 text-red-800';
      case 'Suspendu':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Courant':
        return <CreditCard className="h-4 w-4" />;
      case 'Épargne':
        return <Wallet className="h-4 w-4" />;
      case 'Professionnel':
        return <Building className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (accounts.length === 0) {
    return (
      <div className="card-container">
        <EmptyState
          icon={Wallet}
          title="Aucun compte"
          description="Commencez par créer votre premier compte bancaire."
        />
      </div>
    );
  }

  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du compte</TableHead>
            <TableHead>Banque</TableHead>
            <TableHead>IBAN</TableHead>
            <TableHead>BIC</TableHead>
            <TableHead>Solde</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div className="flex items-center">
                  <span>{account.name}</span>
                </div>
              </TableCell>
              <TableCell>{account.bank}</TableCell>
              <TableCell className="font-mono text-sm">{account.iban}</TableCell>
              <TableCell className="font-mono text-sm">{account.bic}</TableCell>
              <TableCell>
                {formatAmount(account.balance)}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(account.status)}`}>
                  {account.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="icon" title="Voir les détails">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onSync(account)}
                    title="Synchroniser"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(account)}
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(account)}
                    title="Supprimer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
