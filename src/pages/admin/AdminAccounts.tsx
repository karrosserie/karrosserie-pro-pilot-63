import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, CreditCard, UserCheck, Coins, Search, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  created_at: string;
  user_count: number;
  subscription?: {
    id: string;
    plan_name: string;
    status: string;
    tokens_remaining: number;
    tokens_used: number;
    end_date: string;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  tokens_included: number;
}

const AdminAccounts = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTokens, setNewTokens] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
    fetchSubscriptionPlans();
  }, []);

  const fetchCompanies = async () => {
    try {
      // Fetch companies with their user count and subscription info
      const { data: companiesData, error: companiesError } = await supabase
        .from('company_info')
        .select(`
          id,
          name,
          email,
          phone,
          city,
          created_at
        `);

      if (companiesError) throw companiesError;

      // Fetch user counts for each company
      const companiesWithData = await Promise.all(
        companiesData.map(async (company) => {
          // Get user count
          const { count: userCount } = await supabase
            .from('user_companies')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('active', true);

          // Get subscription info
          const { data: subscriptionData } = await supabase
            .from('company_subscriptions')
            .select(`
              id,
              status,
              tokens_remaining,
              tokens_used,
              end_date,
              subscription_plans(name)
            `)
            .eq('company_id', company.id)
            .eq('status', 'active')
            .single();

          return {
            ...company,
            user_count: userCount || 0,
            subscription: subscriptionData ? {
              id: subscriptionData.id,
              plan_name: subscriptionData.subscription_plans?.name || 'Unknown',
              status: subscriptionData.status,
              tokens_remaining: subscriptionData.tokens_remaining,
              tokens_used: subscriptionData.tokens_used,
              end_date: subscriptionData.end_date,
            } : undefined
          };
        })
      );

      setCompanies(companiesWithData);
      setFilteredCompanies(companiesWithData);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les comptes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('id, name, price, tokens_included')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      setSubscriptionPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const handleAddTokens = async () => {
    if (!editingCompany?.subscription || !newTokens) return;

    try {
      const tokensToAdd = parseInt(newTokens);
      const { error } = await supabase
        .from('company_subscriptions')
        .update({
          tokens_remaining: editingCompany.subscription.tokens_remaining + tokensToAdd
        })
        .eq('id', editingCompany.subscription.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${tokensToAdd} jetons ajoutés à ${editingCompany.name}`
      });

      setEditingCompany(null);
      setNewTokens('');
      setDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error adding tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les jetons",
        variant: "destructive"
      });
    }
  };

  const handleChangeSubscription = async () => {
    if (!editingCompany || !selectedPlan) return;

    try {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (!plan) return;

      if (editingCompany.subscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('company_subscriptions')
          .update({
            subscription_plan_id: selectedPlan,
            tokens_remaining: plan.tokens_included,
            tokens_used: 0
          })
          .eq('id', editingCompany.subscription.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('company_subscriptions')
          .insert({
            company_id: editingCompany.id,
            subscription_plan_id: selectedPlan,
            status: 'active',
            tokens_remaining: plan.tokens_included,
            tokens_used: 0,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: `Abonnement mis à jour pour ${editingCompany.name}`
      });

      setEditingCompany(null);
      setSelectedPlan('');
      setDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error changing subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer l'abonnement",
        variant: "destructive"
      });
    }
  };

  const handleImpersonate = async (companyId: string, companyName: string) => {
    try {
      // For demo purposes, we'll store the impersonation data in localStorage
      // In a real app, you'd want a more secure approach
      localStorage.setItem('admin_impersonation', JSON.stringify({
        company_id: companyId,
        company_name: companyName,
        original_user: supabase.auth.getUser()
      }));

      toast({
        title: "Connexion établie",
        description: `Vous êtes maintenant connecté en tant que ${companyName}.`
      });

      // Force page reload to refresh all hooks and data
      window.location.href = '/';
    } catch (error) {
      console.error('Error impersonating:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter en tant que cette carrosserie",
        variant: "destructive"
      });
    }
  };

  // Fonction de recherche
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = companies.filter(company => 
      company.name.toLowerCase().includes(term.toLowerCase()) ||
      company.email.toLowerCase().includes(term.toLowerCase()) ||
      company.city.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  // Fonction de tri
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCompanies].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (key === 'subscription_end') {
        aValue = a.subscription?.end_date ? new Date(a.subscription.end_date) : new Date(0);
        bValue = b.subscription?.end_date ? new Date(b.subscription.end_date) : new Date(0);
      } else if (key === 'subscription_plan') {
        aValue = a.subscription?.plan_name || '';
        bValue = b.subscription?.plan_name || '';
      } else if (key === 'tokens') {
        aValue = a.subscription?.tokens_remaining || 0;
        bValue = b.subscription?.tokens_remaining || 0;
      } else {
        aValue = (a as any)[key] || '';
        bValue = (b as any)[key] || '';
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredCompanies(sorted);
  };

  // Effet pour mettre à jour les résultats filtrés quand les données changent
  useEffect(() => {
    handleSearch(searchTerm);
  }, [companies]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accès aux comptes</h1>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{companies.length} Carrosseries</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Barre de recherche */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou ville..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les carrosseries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Nom</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('city')}>
                  <div className="flex items-center space-x-1">
                    <span>Ville</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('user_count')}>
                  <div className="flex items-center space-x-1">
                    <span>Utilisateurs</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('subscription_plan')}>
                  <div className="flex items-center space-x-1">
                    <span>Abonnement</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('tokens')}>
                  <div className="flex items-center space-x-1">
                    <span>Jetons</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('subscription_end')}>
                  <div className="flex items-center space-x-1">
                    <span>Échéance</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{company.user_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.subscription ? (
                      <Badge variant="secondary">
                        {company.subscription.plan_name}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Aucun</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.subscription ? (
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4" />
                        <span>{company.subscription.tokens_remaining}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.subscription?.end_date ? (
                      <Badge variant={new Date(company.subscription.end_date) < new Date() ? "destructive" : "secondary"}>
                        {format(new Date(company.subscription.end_date), 'dd/MM/yyyy', { locale: fr })}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingCompany(company);
                            setSelectedPlan(company.subscription?.id || '');
                            setDialogOpen(true);
                          }}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Gérer
                        </Button>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Gérer {company.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="plan">Changer d'abonnement</Label>
                              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un plan" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subscriptionPlans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                      {plan.name} - {plan.price}€ ({plan.tokens_included} jetons)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                onClick={handleChangeSubscription} 
                                className="mt-2 w-full"
                                disabled={!selectedPlan}
                              >
                                Mettre à jour l'abonnement
                              </Button>
                            </div>
                            
                            {company.subscription && (
                              <div>
                                <Label htmlFor="tokens">Ajouter des jetons</Label>
                                <Input
                                  id="tokens"
                                  type="number"
                                  value={newTokens}
                                  onChange={(e) => setNewTokens(e.target.value)}
                                  placeholder="Nombre de jetons à ajouter"
                                />
                                <Button 
                                  onClick={handleAddTokens} 
                                  className="mt-2 w-full"
                                  disabled={!newTokens}
                                >
                                  Ajouter {newTokens} jetons
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImpersonate(company.id, company.name)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Se connecter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccounts;