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
import { Pencil, Trash, CreditCard, Building, Wallet, Link, RefreshCw, MoreVertical } from 'lucide-react';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { useCompanyId } from '@/hooks/use-company-id';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  bridge?: {
    id: string;
    created_at: string;
    updated_at: string;
    bridge_id: string;
    access_token: string;
  } | null;
}

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onSync: (account: Account) => void;
}

export const AccountsTable = ({ accounts, onEdit, onDelete, onSync }: AccountsTableProps) => {
  const [showBankConnectDialog, setShowBankConnectDialog] = useState(false);
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

  const isAccountConnected = (account: Account) => {
    console.log('=== CHECKING CONNECTION STATUS ===');
    console.log('Account:', account.name);
    console.log('Bridge data:', account.bridge);
    
    if (!account.bridge) {
      console.log('No bridge data found');
      return false;
    }
    
    const updatedAt = new Date(account.bridge.updated_at);
    const createdAt = new Date(account.bridge.created_at);
    console.log('Created at:', createdAt);
    console.log('Updated at:', updatedAt);
    console.log('Updated > Created:', updatedAt > createdAt);
    
    return updatedAt > createdAt;
  };

  const formatLastSync = (account: Account) => {
    if (!account.bridge || !isAccountConnected(account)) return null;
    
    const updatedAt = new Date(account.bridge.updated_at);
    return updatedAt.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        setShowBankConnectDialog(false);
        toast.success('Redirection vers la connexion bancaire...');
        window.location.href = data.url;
      } else {
        toast.error('URL de connexion non reçue');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion bancaire:', error);
      toast.error('Erreur lors de la connexion bancaire');
    }
  };

  // Composant de carte mobile pour chaque compte
  const AccountCard = ({ account }: { account: Account }) => (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(account.type)}
            <CardTitle className="text-base font-semibold">{account.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(account.status)}`}>
              {account.status}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50">
                {isAccountConnected(account) ? (
                  <DropdownMenuItem disabled className="text-green-600">
                    <Link className="h-4 w-4 mr-2" />
                    Connecté
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => {
                    setSelectedAccount(account);
                    setShowBankConnectDialog(true);
                  }}>
                    <Link className="h-4 w-4 mr-2" />
                    Connecter
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onEdit(account)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(account)}
                  className="text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Banque</span>
            <span className="font-medium">{account.bank}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Solde</span>
            <span className="font-bold text-lg">{formatAmount(account.balance)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">IBAN</span>
              <span className="font-mono text-xs text-right break-all">{account.iban}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">BIC</span>
              <span className="font-mono text-sm">{account.bic}</span>
            </div>
          </div>
          
          {isAccountConnected(account) && formatLastSync(account) && (
            <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t">
              <RefreshCw className="h-3 w-3" />
              Dernière sync : {formatLastSync(account)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (sortedData.length === 0) {
    return (
      <div className="w-full">
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
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center space-y-2">
              <div className="text-4xl">🔒</div>
              <div className="text-base sm:text-lg">Pointer vos paiements dans Karrosserie.pro</div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="min-w-[28px] w-7 h-7 sm:min-w-[32px] sm:w-8 sm:h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-xs sm:text-sm">Bridge (ACPR – Autorité de contrôle Banque de France) assure la connexion sécurisée.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[28px] w-7 h-7 sm:min-w-[32px] sm:w-8 sm:h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-xs sm:text-sm">Karrosserie.pro ne voit ni ne stocke vos codes d'accès.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[28px] w-7 h-7 sm:min-w-[32px] sm:w-8 sm:h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-xs sm:text-sm">L'accès sert uniquement à lire le paiement de vos clients pour le rapprochement bancaire.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[28px] w-7 h-7 sm:min-w-[32px] sm:w-8 sm:h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  4
                </div>
                <p className="text-xs sm:text-sm">Aucun débit possible : ni virement, ni prélèvement via cette connexion.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[28px] w-7 h-7 sm:min-w-[32px] sm:w-8 sm:h-8 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  5
                </div>
                <p className="text-xs sm:text-sm">Vous contrôlez tout : autorisation révocable en 1 clic, traçabilité complète.</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white mt-2 text-sm sm:text-base"
                onClick={handleBankConnection}
              >
                je valide en 15 secondes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vue mobile - Cartes */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {sortedData.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      {/* Vue tablette/desktop - Tableau */}
      <div className="hidden lg:block">
        <div className="card-container overflow-x-auto">
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(account.type)}
                      <span className="font-medium">{account.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{account.bank}</TableCell>
                  <TableCell className="font-mono text-sm">{account.iban}</TableCell>
                  <TableCell className="font-mono text-sm">{account.bic}</TableCell>
                  <TableCell className="font-semibold">
                    {formatAmount(account.balance)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {isAccountConnected(account) ? (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          disabled
                        >
                          <Link className="h-4 w-4 mr-1" />
                          Connecté
                        </Button>
                      ) : (
                        <Button 
                          variant="create"
                          size="sm"
                          onClick={() => {
                            setSelectedAccount(account);
                            setShowBankConnectDialog(true);
                          }}
                        >
                          <Link className="h-4 w-4 mr-1" />
                          Connecter
                        </Button>
                      )}
                       <Button variant="edit" size="sm" onClick={() => onEdit(account)}>
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button variant="delete" size="sm" onClick={() => onDelete(account)}>
                         <Trash className="h-4 w-4" />
                       </Button>
                    </div>
                    {isAccountConnected(account) && formatLastSync(account) && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Dernière sync : {formatLastSync(account)}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};