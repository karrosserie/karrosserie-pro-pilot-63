
import React from 'react';
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
import { Eye, MoreHorizontal, Receipt, TrendingUp } from 'lucide-react';
import { Transaction } from '@/hooks/use-accounting-data';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Méthode</TableHead>
              <TableHead className="font-semibold text-right">Montant</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
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
                      Impayé
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-bold ${
                    transaction.type === 'Encaissement' 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`}>
                    {transaction.type === 'Encaissement' ? '+' : '-'} {transaction.amount}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
