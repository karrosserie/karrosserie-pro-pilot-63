
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/hooks/use-accounting-data';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download, 
  Mail, 
  Copy,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface TransactionActionsMenuProps {
  transaction: Transaction;
}

export const TransactionActionsMenu = ({ transaction }: TransactionActionsMenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Modification",
      description: `Ouverture de l'édition pour la transaction ${transaction.id}`,
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    toast({
      title: "Transaction supprimée",
      description: `La transaction ${transaction.id} a été supprimée`,
      variant: "destructive",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement du reçu pour ${transaction.description}`,
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email envoyé",
      description: `Reçu envoyé par email à ${transaction.client}`,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.id);
    toast({
      title: "Copié",
      description: "ID de transaction copié dans le presse-papiers",
    });
  };

  const handleMarkAsPaid = () => {
    setMarkPaidDialogOpen(false);
    toast({
      title: "Statut mis à jour",
      description: `Transaction marquée comme payée`,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copier l'ID
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger le reçu
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Envoyer par email
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {transaction.status === 'En attente' && (
            <DropdownMenuItem onClick={() => setMarkPaidDialogOpen(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marquer comme payé
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
              <br /><br />
              <strong>Transaction :</strong> {transaction.description}
              <br />
              <strong>Montant :</strong> {transaction.amount}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation pour marquer comme payé */}
      <AlertDialog open={markPaidDialogOpen} onOpenChange={setMarkPaidDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marquer comme payé</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmer que cette transaction a été payée ?
              <br /><br />
              <strong>Client :</strong> {transaction.client}
              <br />
              <strong>Montant :</strong> {transaction.amount}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleMarkAsPaid}>
              Confirmer le paiement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
