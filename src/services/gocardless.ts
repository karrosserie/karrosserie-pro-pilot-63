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
    
    return result.customer;
  }

  async createMandate(customerId: string, bankAccount: GoCardlessBankAccount) {
    console.log('Création du mandat SEPA pour le client:', customerId);
    
    const result = await this.callEdgeFunction('create_mandate', {
      customerId,
      bankAccount
    });
    
    return {
      mandate: result.mandate,
      bank_account: result.bank_account
    };
  }

  async createPayment(
    mandateId: string, 
    amount: number, 
    currency: string = 'EUR', 
    description: string,
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
    // Récupérer les informations de l'entreprise
    const { data: company } = await supabase
      .from('company_info')
      .select('gocardless_mandate_id, name')
      .eq('id', companyId)
      .single();

    if (!company?.gocardless_mandate_id) {
      throw new Error('Aucun mandat SEPA configuré pour cette entreprise');
    }

    const description = `Abonnement ${planName} - ${company.name}`;
    
    const payment = await this.createPayment(
      company.gocardless_mandate_id,
      amount,
      'EUR',
      description,
      {
        subscription_id: subscriptionId,
        company_id: companyId,
        type: 'subscription'
      }
    );

    // Enregistrer le paiement dans la base de données si nécessaire
    console.log('Paiement d\'abonnement créé:', payment.id);
    
    return payment;
  }
}

export const gocardlessService = new GoCardlessService();