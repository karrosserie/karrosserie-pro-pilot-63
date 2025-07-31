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
import { useCompanyId } from '@/hooks/use-company-id';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  const [showIframeDialog, setShowIframeDialog] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { sortedData, sortConfig, handleSort } = useTableSorting(accounts, 'name');
  const { companyId } = useCompanyId();
  const { user, profile } = useAuth();
  
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

  const handleBankConnection = async () => {
    console.log('handleBankConnection appelée');
    console.log('companyId:', companyId);
    console.log('selectedAccount:', selectedAccount);
    console.log('user email:', user?.email);

    if (!companyId || !selectedAccount || !user?.email) {
      toast.error('Informations manquantes pour la connexion bancaire');
      return;
    }

    try {
      const payload = {
        companyId: companyId,
        accountId: selectedAccount.id,
        email: user.email
      };

      console.log('Payload envoyé:', payload);

      const response = await fetch('https://n8n.karrosserie.pro/webhook/55668c4e-89f9-4987-91df-c1e05b12693d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Réponse reçue:', response);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (data.url) {
        setIframeUrl(data.url);
        setShowBankConnectDialog(false);
        setShowIframeDialog(true);
        toast.success('Connexion bancaire initiée');
      } else {
        toast.error('URL de connexion non reçue');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion bancaire:', error);
      toast.error('Erreur lors de la connexion bancaire');
    }
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
            <DialogTitle className="text-lg font-semibold text-center space-y-2">
              <div className="text-4xl">🔒</div>
              <div>Vérification bancaire 100 % sécurisée</div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="min-w-[32px] w-8 h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p>
                  Karrosserie.pro <strong className="text-karrosserie-orange">ne peut ni voir vos codes ni déplacer un centime</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[32px] w-8 h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p>
                  Bridge, agréé ACPR par la Banque de France, se contente de <strong className="text-karrosserie-orange">lire vos lignes bancaires</strong> pour rapprocher automatiquement vos paiements reçus dans Karrosserie.pro.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[32px] w-8 h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p>
                  <strong className="text-karrosserie-orange">Aucun virement, aucun prélèvement</strong> : connexion strictement « consultation de paiement ».
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white mt-2"
                onClick={handleBankConnection}
              >
                Je relie mon compte en 30 secondes →
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showIframeDialog} onOpenChange={setShowIframeDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Connexion bancaire</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] w-full">
            {iframeUrl && (
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0 rounded-lg"
                title="Connexion bancaire"
              />
            )}
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
                      onClick={() => {
                        console.log('Bouton Connecter cliqué pour:', account);
                        setSelectedAccount(account);
                        setShowBankConnectDialog(true);
                      }}
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