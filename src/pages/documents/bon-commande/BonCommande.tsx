import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Trash2, Truck, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/use-company-id';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import BonLivraisonModal from '@/components/bon-commande/BonLivraisonModal';
import BonCommandeCreateModal from '@/components/bon-commande/BonCommandeCreateModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface BonCommandeItem {
  id: string;
  quote_id: string;
  client_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  created_at: string;
  client_name?: string;
  quote_reference?: string;
  bons_livraison?: BonLivraisonItem[];
}

interface BonLivraisonItem {
  id: string;
  transporteur: string | null;
  date_livraison_prevue: string | null;
  date_livraison_reelle: string | null;
  notes: string | null;
  statut: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
}

export default function BonCommande() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bonCommandes, setBonCommandes] = useState<BonCommandeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [livraisonModalOpen, setLivraisonModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBonCommande, setSelectedBonCommande] = useState<BonCommandeItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { companyId } = useCompanyId();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchBonCommandes = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bon_commande')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrichedData = await Promise.all(
        (data || []).map(async (bc) => {
          let client_name = 'Client inconnu';
          let quote_reference = 'N/A';

          if (bc.client_id) {
            const { data: client } = await supabase
              .from('clients')
              .select('first_name, last_name')
              .eq('id', bc.client_id)
              .maybeSingle();
            
            if (client) {
              client_name = `${client.first_name} ${client.last_name}`;
            }
          }

          if (bc.quote_id) {
            const { data: quote } = await supabase
              .from('quotes')
              .select('reference')
              .eq('id', bc.quote_id)
              .maybeSingle();
            
            if (quote) {
              quote_reference = quote.reference;
            }
          }

          const { data: bonsLivraison } = await supabase
            .from('bon_livraison')
            .select('*')
            .eq('bon_commande_id', bc.id)
            .order('created_at', { ascending: false });

          return {
            ...bc,
            client_name,
            quote_reference,
            bons_livraison: bonsLivraison || []
          };
        })
      );

      setBonCommandes(enrichedData);
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
    bc.quote_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBonLivraison = (bonCommande: BonCommandeItem) => {
    setSelectedBonCommande(bonCommande);
    setLivraisonModalOpen(true);
  };

  const toggleExpanded = (bonCommandeId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bonCommandeId)) {
        newSet.delete(bonCommandeId);
      } else {
        newSet.add(bonCommandeId);
      }
      return newSet;
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

  const handleDelete = async (bonCommande: BonCommandeItem) => {
    try {
      const { error } = await supabase
        .from('bon_commande')
        .delete()
        .eq('id', bonCommande.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Bon de commande supprimé avec succès."
      });

      fetchBonCommandes();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bon de commande.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadBonLivraison = (bl: BonLivraisonItem) => {
    if (!bl.file_url) return;
    const link = document.createElement('a');
    link.href = bl.file_url;
    link.download = bl.file_name || 'bon-livraison';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMobileCard = (bc: BonCommandeItem) => (
    <div key={bc.id} className="border rounded-lg overflow-hidden">
      <div className="p-4 space-y-3 bg-background">
        <div className="flex items-start gap-3">
          <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{bc.file_name}</h3>
            <p className="text-sm text-muted-foreground">{bc.client_name || 'Client inconnu'}</p>
            <p className="text-xs text-muted-foreground">Devis: {bc.quote_reference || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">{bc.file_type || 'Document'}</Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(bc.created_at), 'dd/MM/yyyy', { locale: fr })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => handleDownload(bc)} className="w-full">
            <Download className="w-4 h-4 mr-1" /> Télécharger
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBonLivraison(bc)} className="w-full">
            <Truck className="w-4 h-4 mr-1" /> Livraison
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(bc)} className="w-full text-destructive">
            <Trash2 className="w-4 h-4 mr-1" /> Supprimer
          </Button>
          {bc.bons_livraison && bc.bons_livraison.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => toggleExpanded(bc.id)} className="w-full">
              {expandedItems.has(bc.id) ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              {bc.bons_livraison.length} livraison(s)
            </Button>
          )}
        </div>
      </div>

      {expandedItems.has(bc.id) && bc.bons_livraison && bc.bons_livraison.length > 0 && (
        <div className="border-t bg-muted/20 p-3 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Bons de livraison</h4>
          {bc.bons_livraison.map((bl) => (
            <div key={bl.id} className="p-3 bg-background rounded border space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-medium text-sm">{bl.transporteur || 'Non spécifié'}</span>
                <Badge variant="default" className="ml-auto">{bl.statut}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {bl.date_livraison_prevue 
                  ? `Prévu: ${format(new Date(bl.date_livraison_prevue), 'dd/MM/yyyy', { locale: fr })}`
                  : 'Date non spécifiée'}
              </p>
              {bl.notes && <p className="text-xs text-muted-foreground">{bl.notes}</p>}
              {bl.file_url && (
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownloadBonLivraison(bl)}>
                  <Download className="w-4 h-4 mr-1" /> Télécharger
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDesktopRow = (bc: BonCommandeItem) => (
    <div key={bc.id} className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-background">
        <div className="flex items-center space-x-4 flex-1">
          <FileText className="w-8 h-8 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-semibold">{bc.file_name}</h3>
            <p className="text-sm text-muted-foreground">{bc.client_name || 'Client inconnu'}</p>
            <p className="text-xs text-muted-foreground">
              Devis: {bc.quote_reference || 'N/A'} • 
              Ajouté le {format(new Date(bc.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{bc.file_type || 'Document'}</Badge>
          
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
            
            <Button variant="outline" size="sm" onClick={() => handleDelete(bc)}>
              <Trash2 className="w-4 h-4" />
            </Button>

            {bc.bons_livraison && bc.bons_livraison.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => toggleExpanded(bc.id)}>
                {expandedItems.has(bc.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                {bc.bons_livraison.length}
              </Button>
            )}
          </div>
        </div>
      </div>

      {expandedItems.has(bc.id) && bc.bons_livraison && bc.bons_livraison.length > 0 && (
        <div className="border-t bg-muted/20 p-4 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Bons de livraison associés</h4>
          {bc.bons_livraison.map((bl) => (
            <div key={bl.id} className="flex items-center justify-between p-3 bg-background rounded border">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{bl.transporteur || 'Transporteur non spécifié'}</p>
                  <p className="text-xs text-muted-foreground">
                    {bl.date_livraison_prevue 
                      ? `Prévu le ${format(new Date(bl.date_livraison_prevue), 'dd/MM/yyyy', { locale: fr })}`
                      : 'Date non spécifiée'
                    } • Créé le {format(new Date(bl.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                  {bl.notes && <p className="text-xs text-muted-foreground mt-1">{bl.notes}</p>}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="default">{bl.statut}</Badge>
                {bl.file_url && (
                  <Button variant="outline" size="sm" onClick={() => handleDownloadBonLivraison(bl)}>
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">Bon de commande</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">Gérez vos commandes de pièces et matériaux</p>
        </div>
        {isMobile ? (
          <Button size="icon" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="flex items-center gap-2" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Nouveau bon de commande
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{bonCommandes.length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {bonCommandes.filter(bc => !bc.file_url.includes('livre')).length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {bonCommandes.filter(bc => bc.file_url.includes('livre')).length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Livrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-xl md:text-2xl font-bold text-primary">{bonCommandes.length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
            <CardTitle className="text-lg md:text-xl">Liste des bons de commande</CardTitle>
            <div className={isMobile ? 'w-full' : 'w-64'}>
              <Label htmlFor="search" className="sr-only">Rechercher</Label>
              <Input
                id="search"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : filteredBonCommandes.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {filteredBonCommandes.map((bc) => (
                isMobile ? renderMobileCard(bc) : renderDesktopRow(bc)
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <FileText className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium mb-2">Aucun bon de commande</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Aucun résultat' : 'Les bons de commande apparaîtront ici'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <BonCommandeCreateModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) fetchBonCommandes();
        }}
      />

      {selectedBonCommande && (
        <BonLivraisonModal
          open={livraisonModalOpen}
          onOpenChange={(open) => {
            setLivraisonModalOpen(open);
            if (!open) fetchBonCommandes();
          }}
          bonCommandeId={selectedBonCommande.id}
          clientId={selectedBonCommande.client_id}
          fileName={selectedBonCommande.file_name}
        />
      )}
    </div>
  );
}
