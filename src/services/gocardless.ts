import { supabase } from "@/integrations/supabase/client";

export interface GoCardlessCustomer {
  given_name: string;
  family_name: string;
  email: string;
  phone_number?: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country_code: string;
}

export interface GoCardlessBankAccount {
  iban: string;
  account_holder_name: string;
}

export interface GoCardlessMandate {
  id: string;
  status: string;
  scheme: string;
  reference: string;
  created_at: string;
}

export interface GoCardlessPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  charge_date: string;
}

export class GoCardlessService {
  private async callEdgeFunction(action: string, params: any = {}) {
    const { data, error } = await supabase.functions.invoke('gocardless-payments', {
      body: { action, ...params }
    });

    if (error) {
      console.error('Erreur GoCardless:', error);
      throw new Error(`Erreur GoCardless: ${error.message}`);
    }

    return data;
  }

  async createCustomer(companyId: string, customerData: GoCardlessCustomer) {
    console.log('Création du client GoCardless pour la compagnie:', companyId);
    
    const result = await this.callEdgeFunction('create_customer', {
      companyId,
      customerData
    });
    
    // Enregistrer le client dans notre base de données
    if (result.customer) {
      const { error } = await supabase
        .from('gocardless_customers')
        .insert({
          company_id: companyId,
          gocardless_customer_id: result.customer.id,
          given_name: customerData.given_name,
          family_name: customerData.family_name,
          email: customerData.email,
          phone_number: customerData.phone_number,
          address_line1: customerData.address_line1,
          city: customerData.city,
          postal_code: customerData.postal_code,
          country_code: customerData.country_code,
        });

      if (error) {
        console.error('Erreur sauvegarde client GoCardless:', error);
        throw error;
      }
    }
    
    return result.customer;
  }

  async createMandate(companyId: string, customerId: string, bankAccount: GoCardlessBankAccount) {
    console.log('Création du mandat SEPA pour le client:', customerId);
    
    const result = await this.callEdgeFunction('create_mandate', {
      customerId,
      bankAccount
    });
    
    // Enregistrer le mandat dans notre base de données
    if (result.mandate) {
      // Récupérer l'ID de notre customer local
      const { data: localCustomer } = await supabase
        .from('gocardless_customers')
        .select('id')
        .eq('gocardless_customer_id', customerId)
        .single();

      if (localCustomer) {
        const { error } = await supabase
          .from('gocardless_mandates')
          .insert({
            company_id: companyId,
            gocardless_customer_id: localCustomer.id,
            gocardless_mandate_id: result.mandate.id,
            scheme: result.mandate.scheme,
            reference: result.mandate.reference,
            status: result.mandate.status,
            iban: bankAccount.iban,
            account_holder_name: bankAccount.account_holder_name,
          });

        if (error) {
          console.error('Erreur sauvegarde mandat GoCardless:', error);
          throw error;
        }
      }
    }
    
    return {
      mandate: result.mandate,
      bank_account: result.bank_account
    };
  }

  async createPayment(
    companyId: string,
    mandateId: string, 
    amount: number, 
    currency: string = 'EUR', 
    description: string,
    subscriptionId?: string,
    metadata?: Record<string, string>
  ) {
    console.log('Création du paiement SEPA:', { mandateId, amount, currency, description });
    
    const result = await this.callEdgeFunction('create_payment', {
      mandateId,
      amount,
      currency,
      description,
      metadata
    });
    
    // Enregistrer le paiement dans notre base de données
    if (result.payment) {
      // Récupérer l'ID de notre mandat local
      const { data: localMandate } = await supabase
        .from('gocardless_mandates')
        .select('id')
        .eq('gocardless_mandate_id', mandateId)
        .single();

      if (localMandate) {
        const { error } = await supabase
          .from('gocardless_payments')
          .insert({
            company_id: companyId,
            subscription_id: subscriptionId || null,
            gocardless_mandate_id: localMandate.id,
            gocardless_payment_id: result.payment.id,
            amount_cents: Math.round(amount * 100),
            currency: currency.toUpperCase(),
            description,
            status: result.payment.status,
            charge_date: result.payment.charge_date,
            metadata: metadata || {},
          });

        if (error) {
          console.error('Erreur sauvegarde paiement GoCardless:', error);
          throw error;
        }
      }
    }
    
    return result.payment;
  }

  async getMandateStatus(mandateId: string) {
    console.log('Récupération du statut du mandat:', mandateId);
    
    const result = await this.callEdgeFunction('get_mandate_status', {
      mandateId
    });
    
    return result.mandate;
  }

  async cancelMandate(mandateId: string) {
    console.log('Annulation du mandat:', mandateId);
    
    const result = await this.callEdgeFunction('cancel_mandate', {
      mandateId
    });
    
    return result.mandate;
  }

  // Méthode pour créer un paiement d'abonnement automatique
  async createSubscriptionPayment(
    companyId: string,
    subscriptionId: string,
    amount: number,
    planName: string
  ) {
    // Récupérer le mandat actif de l'entreprise
    const { data: mandate } = await supabase
      .from('gocardless_mandates')
      .select('gocardless_mandate_id, company_id')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .single();

    if (!mandate) {
      throw new Error('Aucun mandat SEPA actif configuré pour cette entreprise');
    }

    // Récupérer le nom de l'entreprise
    const { data: company } = await supabase
      .from('company_info')
      .select('name')
      .eq('id', companyId)
      .single();

    const description = `Abonnement ${planName} - ${company?.name || 'Carrosserie'}`;
    
    const payment = await this.createPayment(
      companyId,
      mandate.gocardless_mandate_id,
      amount,
      'EUR',
      description,
      subscriptionId,
      {
        subscription_id: subscriptionId,
        company_id: companyId,
        type: 'subscription'
      }
    );

    // Mettre à jour l'abonnement avec les infos de paiement
    await supabase
      .from('company_subscriptions')
      .update({
        payment_method: 'sepa_direct_debit',
        last_payment_date: new Date().toISOString(),
        last_payment_status: 'pending',
        auto_billing_enabled: true
      })
      .eq('id', subscriptionId);

    console.log('Paiement d\'abonnement créé:', payment.id);
    
    return payment;
  }

  // Créer une subscription GoCardless récurrente
  async createSubscription(
    companyId: string,
    mandateId: string,
    subscriptionPlanId: string,
    companySubscriptionId: string
  ) {
    // Récupérer les détails du plan
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', subscriptionPlanId)
      .single();

    if (!plan) throw new Error('Plan d\'abonnement introuvable');

    const intervalUnit = plan.billing_period === 'monthly' ? 'monthly' : 'yearly';

    const result = await this.callEdgeFunction('create_subscription', {
      mandateId,
      amount: plan.price,
      currency: 'EUR',
      name: `${plan.name} - Abonnement`,
      interval_unit: intervalUnit,
      day_of_month: 1,
      metadata: {
        company_id: companyId,
        subscription_plan_id: subscriptionPlanId
      },
      companySubscriptionId
    });

    return result.subscription;
  }

  // Annuler une subscription GoCardless
  async cancelSubscription(gocardlessSubscriptionId: string) {
    return await this.callEdgeFunction('cancel_subscription', {
      subscriptionId: gocardlessSubscriptionId
    });
  }
}

export const gocardlessService = new GoCardlessService();