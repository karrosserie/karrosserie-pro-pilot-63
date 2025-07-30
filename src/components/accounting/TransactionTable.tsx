
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Transaction } from '@/hooks/use-accounting-data';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';
import { TransactionActionsMenu } from './TransactionActionsMenu';
import { Receipt } from 'lucide-react';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { sortedData, sortConfig, handleSort } = useTableSorting(transactions, 'date');

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsDialogOpen(true);
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <EmptyState
            icon={Receipt}
            title="Aucune transaction trouvée"
            description="Commencez par ajouter vos premières transactions pour suivre votre activité comptable."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          {/* Version mobile */}
          <div className="md:hidden">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border-b border-gray-200 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{transaction.date}</span>
                      <Badge 
                        variant={transaction.type === 'Encaissement' ? 'default' : 'secondary'}
                        className={
                          transaction.type === 'Encaissement' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100 text-xs' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs'
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-900 font-medium truncate mb-1">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-600 truncate mb-1">
                      {transaction.client}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {transaction.method}
                      </span>
                      {transaction.status === 'En attente' && (
                        <Badge 
                          variant="secondary"
                          className="bg-red-100 text-red-800 hover:bg-red-100 text-xs"
                        >
                          En attente de paiement
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-2">
                    <span className={`font-bold text-sm ${
                      transaction.status === 'En attente' 
                        ? 'text-red-600' 
                        : transaction.type === 'Encaissement' 
                          ? 'text-green-600' 
                          : 'text-orange-600'
                    }`}>
                      {transaction.type === 'Encaissement' ? '+' : '-'} {transaction.amount}
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewDetails(transaction)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <TransactionActionsMenu transaction={transaction} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Version desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <SortableTableHeader sortKey="date" sortConfig={sortConfig} onSort={handleSort} className="font-semibold">
                    Date
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="description" sortConfig={sortConfig} onSort={handleSort} className="font-semibold">
                    Description
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="client" sortConfig={sortConfig} onSort={handleSort} className="font-semibold">
                    Client
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="type" sortConfig={sortConfig} onSort={handleSort} className="font-semibold">
                    Type
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="method" sortConfig={sortConfig} onSort={handleSort} className="font-semibold">
                    Méthode
                  </SortableTableHeader>
                  <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort} className="font-semibold text-right">
                    Montant
                  </SortableTableHeader>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium">
                      {transaction.date}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate font-medium">
                        {transaction.client}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === 'Encaissement' ? 'default' : 'secondary'}
                        className={
                          transaction.type === 'Encaissement' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {transaction.method}
                      </span>
                      {transaction.status === 'En attente' && (
                        <Badge 
                          variant="secondary"
                          className="ml-2 bg-red-100 text-red-800 hover:bg-red-100"
                        >
                          En attente de paiement
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${
                        transaction.status === 'En attente' 
                          ? 'text-red-600' 
                          : transaction.type === 'Encaissement' 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                      }`}>
                        {transaction.type === 'Encaissement' ? '+' : '-'} {transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <TransactionActionsMenu transaction={transaction} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
};
