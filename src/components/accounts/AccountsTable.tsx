import React, { useState } from 'react';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash, CreditCard, Building, Wallet, RefreshCw, Link } from 'lucide-react';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

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
  const [showBankConnectDialog, setShowBankConnectDialog] = useState(false);
  const { sortedData, sortConfig, handleSort } = useTableSorting(accounts, 'name');
  
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

  if (sortedData.length === 0) {
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
    <>
      <Dialog open={showBankConnectDialog} onOpenChange={setShowBankConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              🔒 Vérification bancaire 100 % sécurisée
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-base font-bold">
                  1
                </div>
                <p>
                  Karrosserie.pro <strong className="text-karrosserie-orange">ne peut ni voir vos codes ni déplacer un centime</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-base font-bold">
                  2
                </div>
                <p>
                  Bridge, agréé ACPR par la Banque de France, se contente de <strong className="text-karrosserie-orange">lire vos lignes bancaires</strong> pour rapprocher automatiquement vos paiements reçus dans Karrosserie.pro.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-base font-bold">
                  3
                </div>
                <p>
                  <strong className="text-karrosserie-orange">Aucun virement, aucun prélèvement</strong> : connexion strictement « consultation de paiement ».
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
                onClick={() => {
                  // Ici vous pouvez ajouter la logique de connexion bancaire
                  console.log('Connexion bancaire Bridge');
                  setShowBankConnectDialog(false);
                }}
              >
                Je relie mon compte en 30 secondes →
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader sortKey="name" sortConfig={sortConfig} onSort={handleSort}>
              Nom du compte
            </SortableTableHeader>
            <SortableTableHeader sortKey="bank" sortConfig={sortConfig} onSort={handleSort}>
              Banque
            </SortableTableHeader>
            <SortableTableHeader sortKey="iban" sortConfig={sortConfig} onSort={handleSort}>
              IBAN
            </SortableTableHeader>
            <SortableTableHeader sortKey="bic" sortConfig={sortConfig} onSort={handleSort}>
              BIC
            </SortableTableHeader>
            <SortableTableHeader sortKey="balance" sortConfig={sortConfig} onSort={handleSort}>
              Solde
            </SortableTableHeader>
            <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
              Statut
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((account) => (
            <React.Fragment key={account.id}>
              <TableRow className="hover:bg-gray-50 border-b-0">
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
              </TableRow>
              <TableRow className="border-t-0">
                <TableCell colSpan={6} className="py-3 border-t-0">
                  <div className="flex flex-wrap gap-2 justify-end px-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBankConnectDialog(true)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Connecter
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => onSync(account)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Synchroniser
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => onEdit(account)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                      onClick={() => onDelete(account)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  );
};