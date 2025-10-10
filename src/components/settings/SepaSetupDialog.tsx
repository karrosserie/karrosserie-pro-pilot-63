import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGoCardless } from '@/hooks/use-gocardless';
import { useSubscription } from '@/hooks/use-subscription';
import { CreditCard, Building2, MapPin, Mail, Phone, User, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SepaSetupDialogProps {
  isChangingPlan?: boolean;
}

export const SepaSetupDialog: React.FC<SepaSetupDialogProps> = ({ isChangingPlan = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [mandateResult, setMandateResult] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({
    given_name: '',
    family_name: '',
    email: '',
    phone_number: '',
    address_line1: '',
    city: '',
    postal_code: '',
    country_code: 'FR'
  });
  const [bankData, setBankData] = useState({
    iban: '',
    account_holder_name: ''
  });

  const {
    companyData,
    setupGoCardlessForCompany,
    createSubscription,
    isCreatingCustomer,
    isCreatingMandate,
    isCreatingSubscription,
  } = useGoCardless();

  const {
    subscriptionPlans,
    companySubscription,
  } = useSubscription();

  const handleNext = () => {
    if (step === 1) {
      // Pré-remplir avec les données de l'entreprise si disponibles
      setCustomerData(prev => ({
        ...prev,
        given_name: prev.given_name || '',
        family_name: prev.family_name || '',
        email: prev.email || (companyData as any)?.email || '',
        address_line1: prev.address_line1 || (companyData as any)?.address || '',
        city: prev.city || (companyData as any)?.city || '',
        postal_code: prev.postal_code || (companyData as any)?.zipcode || '',
      }));
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      const result = await setupGoCardlessForCompany(customerData, bankData);
      setMandateResult(result);
      setStep(3); // Passer à l'étape de sélection du plan
    } catch (error) {
      console.error('Erreur configuration SEPA:', error);
    }
  };

  const handlePlanSelection = async () => {
    if (!selectedPlanId || !mandateResult || !companySubscription) return;
    
    try {
      await createSubscription({
        mandateId: mandateResult.mandateId,
        subscriptionPlanId: selectedPlanId,
        companySubscriptionId: companySubscription.id,
      });
      
      // Fermer et réinitialiser
      setIsOpen(false);
      setStep(1);
      setMandateResult(null);
      setSelectedPlanId(null);
      setCustomerData({
        given_name: '',
        family_name: '',
        email: '',
        phone_number: '',
        address_line1: '',
        city: '',
        postal_code: '',
        country_code: 'FR'
      });
      setBankData({
        iban: '',
        account_holder_name: ''
      });
    } catch (error) {
      console.error('Erreur activation abonnement:', error);
    }
  };

  const isLoading = isCreatingCustomer || isCreatingMandate || isCreatingSubscription;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={isChangingPlan ? "outline" : "default"}>
          <CreditCard className="mr-2 h-4 w-4" />
          {isChangingPlan ? 'Changer d\'abonnement' : 'Configurer le prélèvement SEPA'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration du prélèvement SEPA avec GoCardless</DialogTitle>
        </DialogHeader>
        
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations du responsable financier
              </CardTitle>
              <CardDescription>
                Ces informations seront utilisées pour créer votre compte GoCardless et configurer le mandat de prélèvement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="given_name">Prénom</Label>
                  <Input
                    id="given_name"
                    value={customerData.given_name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, given_name: e.target.value }))}
                    placeholder="Prénom du responsable"
                  />
                </div>
                <div>
                  <Label htmlFor="family_name">Nom de famille</Label>
                  <Input
                    id="family_name"
                    value={customerData.family_name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, family_name: e.target.value }))}
                    placeholder="Nom de famille"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@entreprise.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="phone_number"
                    value={customerData.phone_number}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="+33123456789"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="flex items-center text-base font-medium">
                  <MapPin className="mr-2 h-4 w-4" />
                  Adresse de facturation
                </Label>
                
                <div>
                  <Label htmlFor="address_line1">Adresse</Label>
                  <Input
                    id="address_line1"
                    value={customerData.address_line1}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, address_line1: e.target.value }))}
                    placeholder="123 Rue de la République"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={customerData.city}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Code postal</Label>
                    <Input
                      id="postal_code"
                      value={customerData.postal_code}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, postal_code: e.target.value }))}
                      placeholder="75001"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleNext}>Continuer</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Informations bancaires
              </CardTitle>
              <CardDescription>
                Ces informations permettront de configurer le mandat de prélèvement SEPA pour vos abonnements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="iban">IBAN du compte à débiter</Label>
                <Input
                  id="iban"
                  value={bankData.iban}
                  onChange={(e) => setBankData(prev => ({ ...prev, iban: e.target.value.replace(/\s/g, '').toUpperCase() }))}
                  placeholder="FR76 3000 6000 0112 3456 7890 189"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Format : FRXX XXXX XXXX XXXX XXXX XXXX XXX
                </p>
              </div>
              
              <div>
                <Label htmlFor="account_holder_name">Nom du titulaire du compte</Label>
                <Input
                  id="account_holder_name"
                  value={bankData.account_holder_name}
                  onChange={(e) => setBankData(prev => ({ ...prev, account_holder_name: e.target.value }))}
                  placeholder="Nom de l'entreprise ou du titulaire"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Information importante</h4>
                <p className="text-sm text-blue-800">
                  En configurant ce mandat SEPA, vous autorisez GoCardless à prélever automatiquement 
                  les montants de vos abonnements sur le compte bancaire indiqué. Vous pourrez annuler 
                  ce mandat à tout moment.
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !bankData.iban || !bankData.account_holder_name}
                >
                  {isLoading ? "Configuration..." : "Configurer le prélèvement"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Choisissez votre plan d'abonnement
              </CardTitle>
              <CardDescription>
                Sélectionnez le plan qui correspond le mieux à vos besoins. Le prélèvement sera automatique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {subscriptionPlans?.filter(plan => plan.is_active && plan.price > 0).map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlanId === plan.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      {selectedPlanId === plan.id && (
                        <Badge variant="default">Sélectionné</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-2xl font-bold">{plan.price}€</span>
                      <span className="text-muted-foreground">
                        / {plan.billing_period === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {plan.tokens_included} jetons inclus
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Information sur le prélèvement</h4>
                <p className="text-sm text-blue-800">
                  Le montant de l'abonnement sélectionné sera automatiquement prélevé sur votre compte bancaire 
                  selon la périodicité choisie. Le premier prélèvement interviendra après validation du mandat 
                  par votre banque (sous 3-5 jours ouvrés).
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Retour
                </Button>
                <Button 
                  onClick={handlePlanSelection}
                  disabled={!selectedPlanId || isCreatingSubscription}
                >
                  {isCreatingSubscription ? "Activation..." : "Activer l'abonnement"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};