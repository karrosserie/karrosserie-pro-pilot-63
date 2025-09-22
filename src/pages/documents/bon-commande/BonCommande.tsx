import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Edit, Trash2, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/use-company-id';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BonCommandeItem {
  id: string;
  quote_id: string;
  client_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  created_at: string;
  // Données relationnelles
  clients?: {
    first_name: string;
    last_name: string;
  };
  quotes?: {
    reference: string;
  };
}

export default function BonCommande() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bonCommandes, setBonCommandes] = useState<BonCommandeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { companyId } = useCompanyId();
  const { toast } = useToast();

  // Récupérer les bons de commande de l'entreprise
  const fetchBonCommandes = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bon_commande')
        .select(`
          *,
          clients (
            first_name,
            last_name
          ),
          quotes (
            reference
          )
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBonCommandes(data || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des bons de commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les bons de commande.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonCommandes();
  }, [companyId]);

  const filteredBonCommandes = bonCommandes.filter(bc =>
    bc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.quotes?.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bc.clients && `${bc.clients.first_name} ${bc.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBonLivraison = (bonCommande: BonCommandeItem) => {
    // TODO: Ouvrir modal pour créer bon de livraison
    toast({
      title: "Bon de livraison",
      description: `Création d'un bon de livraison pour ${bonCommande.file_name}`
    });
  };

  const handleDownload = async (bonCommande: BonCommandeItem) => {
    try {
      const link = document.createElement('a');
      link.href = bonCommande.file_url;
      link.download = bonCommande.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier.",
        variant: "destructive"
      });
    }
  };

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
            <div className="text-2xl font-bold text-blue-600">{bonCommandes.length}</div>
            <div className="text-sm text-muted-foreground">Total des commandes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bonCommandes.filter(bc => !bc.file_url.includes('livre')).length}
            </div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bonCommandes.filter(bc => bc.file_url.includes('livre')).length}
            </div>
            <div className="text-sm text-muted-foreground">Livrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{bonCommandes.length}</div>
            <div className="text-sm text-muted-foreground">Documents</div>
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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des bons de commande...</p>
            </div>
          ) : filteredBonCommandes.length > 0 ? (
            <div className="space-y-4">
              {filteredBonCommandes.map((bc) => (
                <div key={bc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{bc.file_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {bc.clients ? `${bc.clients.first_name} ${bc.clients.last_name}` : 'Client inconnu'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Devis: {bc.quotes?.reference || 'N/A'} • 
                        Ajouté le {format(new Date(bc.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {bc.file_type || 'Document'}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(bc)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBonLivraison(bc)}
                        className="flex items-center gap-1"
                      >
                        <Truck className="w-4 h-4" />
                        Bon de livraison
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bon de commande</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Les bons de commande ajoutés via les devis apparaîtront ici'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}