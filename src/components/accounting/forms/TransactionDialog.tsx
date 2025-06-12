
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import ReceiptForm from '@/components/receipts/ReceiptForm';
import ExpenseForm from '@/components/expenses/ExpenseForm';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDialog = ({ isOpen, onClose }: TransactionDialogProps) => {
  const [activeTab, setActiveTab] = useState('receipt');

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receipt">
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Encaissement
            </TabsTrigger>
            <TabsTrigger value="expense">
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Dépense
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="receipt" className="mt-4 max-h-[70vh] overflow-y-auto">
            <ReceiptForm onSuccess={handleSuccess} onCancel={onClose} />
          </TabsContent>
          
          <TabsContent value="expense" className="mt-4 max-h-[70vh] overflow-y-auto">
            <ExpenseForm onSuccess={handleSuccess} onCancel={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
