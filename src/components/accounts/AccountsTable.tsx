
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
                <span className="text-blue-600 font-semibold">1.</span>
                <p>
                  Karrosserie.pro <strong>ne peut ni voir vos codes ni déplacer un centime</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">2.</span>
                <p>
                  Bridge, agréé ACPR par la Banque de France, se contente de <strong>lire vos lignes bancaires</strong> pour rapprocher automatiquement vos paiements reçus dans Karrosserie.pro.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">3.</span>
                <p>
                  <strong>Aucun virement, aucun prélèvement</strong> : connexion strictement « consultation de paiement ».
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowBankConnectDialog(true)}
                    title="Connecter le compte bancaire"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Link className="h-4 w-4" />
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
    </>
  );
};
