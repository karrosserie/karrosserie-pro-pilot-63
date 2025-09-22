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
  
  // Données d'exemple - à remplacer par de vraies données depuis Supabase
  const [bonCommandes] = useState<BonCommandeItem[]>([
    {
      id: '1',
      numero: 'BC001',
      fournisseur: 'Pièces Auto Service',
      dateCommande: '2024-01-15',
      dateLivraison: '2024-01-20',
      montant: 1250.50,
      statut: 'Livré',
      articles: 5
    },
    {
      id: '2',
      numero: 'BC002',
      fournisseur: 'Euro Carrosserie',
      dateCommande: '2024-01-18',
      montant: 890.00,
      statut: 'En attente',
      articles: 3
    }
  ]);

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
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-muted-foreground">Total des commandes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">1</div>
            <div className="text-sm text-muted-foreground">Livrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">2 140,50 €</div>
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
          <div className="space-y-4">
            {filteredBonCommandes.map((bc) => (
              <div key={bc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{bc.numero}</h3>
                    <p className="text-sm text-muted-foreground">{bc.fournisseur}</p>
                    <p className="text-xs text-muted-foreground">
                      Commandé le {new Date(bc.dateCommande).toLocaleDateString()}
                      {bc.dateLivraison && ` • Livré le ${new Date(bc.dateLivraison).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold">{bc.montant.toFixed(2)} €</div>
                    <div className="text-sm text-muted-foreground">{bc.articles} articles</div>
                  </div>
                  <Badge className={getStatusColor(bc.statut)}>
                    {bc.statut}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredBonCommandes.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun bon de commande trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}