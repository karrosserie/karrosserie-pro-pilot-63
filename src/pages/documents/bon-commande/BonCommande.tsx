import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BonCommandeItem {
  id: string;
  numero: string;
  fournisseur: string;
  dateCommande: string;
  dateLivraison?: string;
  montant: number;
  statut: 'En attente' | 'Validé' | 'Livré' | 'Annulé';
  articles: number;
}

export default function BonCommande() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données vides - à connecter avec Supabase
  const [bonCommandes] = useState<BonCommandeItem[]>([]);

  const filteredBonCommandes = bonCommandes.filter(bc =>
    bc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré': return 'bg-green-100 text-green-800';
      case 'Validé': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Bon de commande</h1>
          <p className="text-gray-600 mt-1">Gérez vos commandes de pièces et matériaux</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau bon de commande
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-muted-foreground">Total des commandes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-muted-foreground">Livrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">0,00 €</div>
            <div className="text-sm text-muted-foreground">Montant total</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Liste des bons de commande</CardTitle>
            <div className="w-64">
              <Label htmlFor="search" className="sr-only">Rechercher</Label>
              <Input
                id="search"
                placeholder="Rechercher par numéro ou fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bon de commande</h3>
            <p className="text-gray-500 mb-4">Commencez par créer votre premier bon de commande</p>
            <Button className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Créer un bon de commande
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}