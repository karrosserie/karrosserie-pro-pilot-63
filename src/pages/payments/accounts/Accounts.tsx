
import React, { useState } from 'react';
import { AccountsHeader } from '@/components/accounts/AccountsHeader';
import { AccountsTable } from '@/components/accounts/AccountsTable';
import AccountDialog from '@/components/accounts/AccountDialog';
import { useAccounts } from '@/hooks/use-accounts';

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  const { accounts, handleDelete, handleSync, filterAccounts } = useAccounts();
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
    <div className="page-container">
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
