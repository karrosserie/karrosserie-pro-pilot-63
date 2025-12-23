import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building2, Users, CreditCard, UserCheck, Coins, Search, ChevronUp, ChevronDown, Calendar, RotateCcw } from 'lucide-react';

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
    plan_id: string;
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
  billing_period: string;
}

const AdminAccounts = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [newTokens, setNewTokens] = useState('');
  const [setTokensValue, setSetTokensValue] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [resetTokensOnPlanChange, setResetTokensOnPlanChange] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Company | 'subscription.plan_name' | 'subscription.end_date' | 'subscription.tokens_remaining'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

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
              subscription_plan_id,
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
               plan_id: subscriptionData.subscription_plan_id,
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
        .select('id, name, price, tokens_included, billing_period')
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

      // Calculate end date
      let endDate: Date;
      if (customEndDate) {
        endDate = new Date(customEndDate);
      } else {
        endDate = new Date();
        if (plan.billing_period === 'yearly' || plan.billing_period === 'annual') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }
      }

      if (editingCompany.subscription) {
        // Update existing subscription - only reset tokens if checkbox is checked
        const updateData: any = {
          subscription_plan_id: selectedPlan,
          end_date: endDate.toISOString()
        };

        // Only reset tokens if the option is checked
        if (resetTokensOnPlanChange) {
          updateData.tokens_remaining = plan.tokens_included;
          updateData.tokens_used = 0;
        }

        const { error } = await supabase
          .from('company_subscriptions')
          .update(updateData)
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
            end_date: endDate.toISOString()
          });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: `Abonnement mis à jour pour ${editingCompany.name}${resetTokensOnPlanChange ? ' (jetons réinitialisés)' : ''}`
      });

      setEditingCompany(null);
      setSelectedPlan('');
      setCustomEndDate('');
      setResetTokensOnPlanChange(false);
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

  const handleSetTokens = async () => {
    if (!editingCompany?.subscription || !setTokensValue) return;

    try {
      const newBalance = parseInt(setTokensValue);
      const { error } = await supabase
        .from('company_subscriptions')
        .update({
          tokens_remaining: newBalance
        })
        .eq('id', editingCompany.subscription.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Solde de jetons défini à ${newBalance} pour ${editingCompany.name}`
      });

      setSetTokensValue('');
      fetchCompanies();
      // Update local state
      setEditingCompany({
        ...editingCompany,
        subscription: {
          ...editingCompany.subscription,
          tokens_remaining: newBalance
        }
      });
    } catch (error) {
      console.error('Error setting tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de définir les jetons",
        variant: "destructive"
      });
    }
  };

  const handleResetTokens = async () => {
    if (!editingCompany?.subscription) return;

    try {
      const { error } = await supabase
        .from('company_subscriptions')
        .update({
          tokens_remaining: 0,
          tokens_used: 0
        })
        .eq('id', editingCompany.subscription.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Jetons remis à zéro pour ${editingCompany.name}`
      });

      fetchCompanies();
      // Update local state
      setEditingCompany({
        ...editingCompany,
        subscription: {
          ...editingCompany.subscription,
          tokens_remaining: 0,
          tokens_used: 0
        }
      });
    } catch (error) {
      console.error('Error resetting tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de remettre les jetons à zéro",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEndDate = async () => {
    if (!editingCompany?.subscription || !customEndDate) return;

    try {
      const { error } = await supabase
        .from('company_subscriptions')
        .update({
          end_date: new Date(customEndDate).toISOString()
        })
        .eq('id', editingCompany.subscription.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Date de fin mise à jour pour ${editingCompany.name}`
      });

      fetchCompanies();
      // Update local state
      setEditingCompany({
        ...editingCompany,
        subscription: {
          ...editingCompany.subscription,
          end_date: new Date(customEndDate).toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating end date:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la date de fin",
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
        description: `Redirection vers le dashboard de ${companyName}...`
      });

      // Rediriger vers le dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error impersonating:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter en tant que cette carrosserie",
        variant: "destructive"
      });
    }
  };

  // Filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter(company => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        company.name.toLowerCase().includes(searchLower) ||
        company.email.toLowerCase().includes(searchLower) ||
        company.city.toLowerCase().includes(searchLower) ||
        company.subscription?.plan_name.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField.includes('.')) {
        const [field, subField] = sortField.split('.');
        aValue = (a as any)[field]?.[subField] || '';
        bValue = (b as any)[field]?.[subField] || '';
      } else {
        aValue = (a as any)[sortField] || '';
        bValue = (b as any)[sortField] || '';
      }

      // Handle dates
      if (sortField === 'subscription.end_date') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: typeof sortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

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
              <span className="text-sm font-medium">{filteredAndSortedCompanies.length} / {companies.length} Carrosseries</span>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, ville ou abonnement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
                <SortableHeader field="name">Nom</SortableHeader>
                <SortableHeader field="email">Email</SortableHeader>
                <SortableHeader field="city">Ville</SortableHeader>
                <SortableHeader field="user_count">Utilisateurs</SortableHeader>
                <SortableHeader field="subscription.plan_name">Abonnement</SortableHeader>
                <SortableHeader field="subscription.end_date">Fin d'abonnement</SortableHeader>
                <SortableHeader field="subscription.tokens_remaining">Jetons</SortableHeader>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCompanies.map((company) => (
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
                    {company.subscription?.end_date ? (
                      <span className="text-sm">
                        {new Date(company.subscription.end_date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
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
                    <div className="flex space-x-2">
                      <Dialog 
                        open={editingCompany?.id === company.id} 
                        onOpenChange={(open) => !open && setEditingCompany(null)}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingCompany(company);
                              setSelectedPlan(company.subscription?.plan_id || '');
                              setCustomEndDate('');
                              setResetTokensOnPlanChange(false);
                              setNewTokens('');
                              setSetTokensValue('');
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Gérer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Gérer {company.name}</DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="subscription" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="subscription">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Abonnement
                              </TabsTrigger>
                              <TabsTrigger value="tokens">
                                <Coins className="h-4 w-4 mr-2" />
                                Jetons
                              </TabsTrigger>
                            </TabsList>
                            
                            {/* Onglet Abonnement */}
                            <TabsContent value="subscription" className="space-y-4 mt-4">
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="plan">Plan d'abonnement</Label>
                                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner un plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {subscriptionPlans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                          {plan.name} - {plan.price}€/{plan.billing_period === 'yearly' ? 'an' : 'mois'}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor="endDate">Date de fin d'abonnement</Label>
                                  <Input
                                    id="endDate"
                                    type="date"
                                    value={customEndDate || (company.subscription?.end_date ? new Date(company.subscription.end_date).toISOString().split('T')[0] : '')}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Laissez vide pour calculer automatiquement selon le plan
                                  </p>
                                </div>
                                
                                {company.subscription && (
                                  <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                                    <Checkbox
                                      id="resetTokens"
                                      checked={resetTokensOnPlanChange}
                                      onCheckedChange={(checked) => setResetTokensOnPlanChange(checked === true)}
                                    />
                                    <Label htmlFor="resetTokens" className="text-sm cursor-pointer">
                                      Réinitialiser les jetons avec le nouveau plan
                                    </Label>
                                  </div>
                                )}
                                
                                <div className="flex gap-2">
                                  <Button 
                                    onClick={handleChangeSubscription} 
                                    className="flex-1"
                                    disabled={!selectedPlan}
                                  >
                                    Mettre à jour l'abonnement
                                  </Button>
                                  {company.subscription && customEndDate && (
                                    <Button 
                                      onClick={handleUpdateEndDate}
                                      variant="outline"
                                    >
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {company.subscription && (
                                <>
                                  <Separator />
                                  <div className="p-3 bg-muted/30 rounded-lg text-sm">
                                    <p><strong>Plan actuel :</strong> {company.subscription.plan_name}</p>
                                    <p><strong>Fin :</strong> {new Date(company.subscription.end_date).toLocaleDateString('fr-FR')}</p>
                                    <p><strong>Statut :</strong> {company.subscription.status}</p>
                                  </div>
                                </>
                              )}
                            </TabsContent>
                            
                            {/* Onglet Jetons */}
                            <TabsContent value="tokens" className="space-y-4 mt-4">
                              {company.subscription ? (
                                <>
                                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Solde actuel</p>
                                    <p className="text-3xl font-bold">{editingCompany?.subscription?.tokens_remaining ?? company.subscription.tokens_remaining}</p>
                                    <p className="text-xs text-muted-foreground">
                                      ({editingCompany?.subscription?.tokens_used ?? company.subscription.tokens_used} utilisés)
                                    </p>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="space-y-3">
                                    <div>
                                      <Label htmlFor="addTokens">Ajouter des jetons</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          id="addTokens"
                                          type="number"
                                          value={newTokens}
                                          onChange={(e) => setNewTokens(e.target.value)}
                                          placeholder="Nombre à ajouter"
                                        />
                                        <Button 
                                          onClick={handleAddTokens} 
                                          disabled={!newTokens}
                                        >
                                          +{newTokens || 0}
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor="setTokens">Définir un nouveau solde</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          id="setTokens"
                                          type="number"
                                          value={setTokensValue}
                                          onChange={(e) => setSetTokensValue(e.target.value)}
                                          placeholder="Nouveau solde"
                                        />
                                        <Button 
                                          onClick={handleSetTokens}
                                          variant="secondary"
                                          disabled={!setTokensValue}
                                        >
                                          Définir
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <Button 
                                    onClick={handleResetTokens}
                                    variant="destructive"
                                    className="w-full"
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Remettre les jetons à zéro
                                  </Button>
                                </>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <Coins className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                  <p>Aucun abonnement actif</p>
                                  <p className="text-sm">Créez d'abord un abonnement dans l'onglet "Abonnement"</p>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
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