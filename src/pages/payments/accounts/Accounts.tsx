
import React, { useState } from 'react';
import { AccountsHeader } from '@/components/accounts/AccountsHeader';
import { AccountsTable } from '@/components/accounts/AccountsTable';
import AccountDialog from '@/components/accounts/AccountDialog';
import { useAccounts } from '@/hooks/use-accounts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Database } from 'lucide-react';

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  const { accounts, isLoading, error, handleDelete, handleSync, filterAccounts } = useAccounts();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Accounts page error:', error);
    return (
      <div className="page-container">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des comptes. Vérifiez votre connexion et réessayez.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredAccounts = filterAccounts(accounts, searchTerm);

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setDialogOpen(true);
  };

  const handleEdit = (account: any) => {
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  // Afficher une notification si on utilise le service mock
  const isUsingMockData = accounts.length === 0 || 
    (accounts.length > 0 && !accounts[0].user_id);

  return (
    <div className="page-container">
      {isUsingMockData && (
        <Alert className="mb-4">
          <Database className="h-4 w-4" />
          <AlertDescription>
            Mode démo actif. Les données sont stockées localement. 
            Connectez-vous à Supabase pour la persistance des données.
          </AlertDescription>
        </Alert>
      )}
      
      <AccountsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateAccount={handleCreateAccount}
      />
      
      <AccountsTable
        accounts={filteredAccounts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSync={handleSync}
      />

      <AccountDialog
        account={selectedAccount}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Accounts;
