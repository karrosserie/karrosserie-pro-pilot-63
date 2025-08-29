
import React, { useState } from 'react';
import { AccountsHeader } from '@/components/accounts/AccountsHeader';
import { AccountsTable } from '@/components/accounts/AccountsTable';
import AccountDialog from '@/components/accounts/AccountDialog';
import { useAccounts } from '@/hooks/use-accounts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  const { accounts, isLoading, error, handleDelete, handleSync, filterAccounts } = useAccounts();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-center items-center h-32 sm:h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Accounts page error:', error);
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error.message?.includes('not authenticated') 
              ? 'Vous devez être connecté pour accéder à vos comptes.'
              : 'Erreur lors du chargement des comptes. Vérifiez votre connexion et réessayez.'
            }
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

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
