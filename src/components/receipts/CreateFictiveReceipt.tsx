import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { receiptMutations } from '@/services/supabase/receipts/mutations';
import { receiptsService } from '@/services/supabase/receipts';
import { useQueryClient } from '@tanstack/react-query';

export const CreateFictiveReceipt = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createFictiveCardReceipt = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    
    try {
      // Générer une référence unique
      const reference = await receiptsService.generateReference();
      
      // Créer l'encaissement fictif par carte
      const fictiveReceipt = {
        reference: reference,
        date: new Date().toISOString().split('T')[0], // Date d'aujourd'hui
        amount: 150.00, // Montant fictif
        status: 'Encaissé',
        payment_method: 'Carte bancaire',
        bank_account: 'Compte Principal',
        notes: 'Encaissement fictif par carte bancaire - Test',
        payment_proofs: [],
        invoice_id: null
      };

      await receiptMutations.create(fictiveReceipt);

      // Invalider le cache pour mettre à jour les tableaux
      await queryClient.invalidateQueries({ queryKey: ['receipts'] });
      
      toast({
        title: "Encaissement fictif créé",
        description: `Encaissement de ${fictiveReceipt.amount}€ par carte bancaire créé avec succès.`
      });
      
    } catch (error) {
      console.error('Error creating fictive receipt:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'encaissement fictif.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Encaissement fictif
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Créer un encaissement fictif par carte bancaire pour tester l'affichage.
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Montant:</span>
            <span className="font-medium">150,00 €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Méthode:</span>
            <span className="font-medium">Carte bancaire</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Compte:</span>
            <span className="font-medium">Compte Principal</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Statut:</span>
            <span className="font-medium text-green-600">Encaissé</span>
          </div>
        </div>

        <Button 
          onClick={createFictiveCardReceipt}
          disabled={isCreating}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Création...' : 'Créer l\'encaissement fictif'}
        </Button>
      </CardContent>
    </Card>
  );
};