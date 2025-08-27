// Service de démonstration qui simule les appels à Supabase avec des données fictives
import { demoData } from '@/data/demoData';

// Configuration du mode démo
export const DEMO_MODE = true;

// Simulation des délais réseau
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

// Service clients
export const demoClientService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.clients, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const client = demoData.clients.find(c => c.id === id);
    return { data: client || null, error: client ? null : 'Client non trouvé' };
  },
  
  async create(clientData: any) {
    await simulateNetworkDelay();
    const newClient = {
      ...clientData,
      id: `client-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.clients.push(newClient);
    return { data: newClient, error: null };
  },
  
  async update(id: string, clientData: any) {
    await simulateNetworkDelay();
    const index = demoData.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      demoData.clients[index] = { ...demoData.clients[index], ...clientData, updated_at: new Date().toISOString() };
      return { data: demoData.clients[index], error: null };
    }
    return { data: null, error: 'Client non trouvé' };
  },
  
  async delete(id: string) {
    await simulateNetworkDelay();
    const index = demoData.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      demoData.clients.splice(index, 1);
      return { error: null };
    }
    return { error: 'Client non trouvé' };
  }
};

// Service véhicules
export const demoVehicleService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.vehicles, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const vehicle = demoData.vehicles.find(v => v.id === id);
    return { data: vehicle || null, error: vehicle ? null : 'Véhicule non trouvé' };
  },
  
  async getByClientId(clientId: string) {
    await simulateNetworkDelay();
    const vehicles = demoData.vehicles.filter(v => v.client_id === clientId);
    return { data: vehicles, error: null };
  },
  
  async create(vehicleData: any) {
    await simulateNetworkDelay();
    const newVehicle = {
      ...vehicleData,
      id: `vehicle-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.vehicles.push(newVehicle);
    return { data: newVehicle, error: null };
  },
  
  async update(id: string, vehicleData: any) {
    await simulateNetworkDelay();
    const index = demoData.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      demoData.vehicles[index] = { ...demoData.vehicles[index], ...vehicleData, updated_at: new Date().toISOString() };
      return { data: demoData.vehicles[index], error: null };
    }
    return { data: null, error: 'Véhicule non trouvé' };
  }
};

// Service devis
export const demoQuoteService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.quotes, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const quote = demoData.quotes.find(q => q.id === id);
    return { data: quote || null, error: quote ? null : 'Devis non trouvé' };
  },
  
  async create(quoteData: any) {
    await simulateNetworkDelay();
    const newQuote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      quote_number: `DEV-2024-${String(demoData.quotes.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.quotes.push(newQuote);
    return { data: newQuote, error: null };
  },
  
  async update(id: string, quoteData: any) {
    await simulateNetworkDelay();
    const index = demoData.quotes.findIndex(q => q.id === id);
    if (index !== -1) {
      demoData.quotes[index] = { ...demoData.quotes[index], ...quoteData };
      return { data: demoData.quotes[index], error: null };
    }
    return { data: null, error: 'Devis non trouvé' };
  }
};

// Service ordres de réparation
export const demoRepairOrderService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.repairOrders, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const order = demoData.repairOrders.find(o => o.id === id);
    return { data: order || null, error: order ? null : 'Ordre non trouvé' };
  },
  
  async create(orderData: any) {
    await simulateNetworkDelay();
    const newOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      order_number: `ORD-2024-${String(demoData.repairOrders.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.repairOrders.push(newOrder);
    return { data: newOrder, error: null };
  },
  
  async update(id: string, orderData: any) {
    await simulateNetworkDelay();
    const index = demoData.repairOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      demoData.repairOrders[index] = { ...demoData.repairOrders[index], ...orderData };
      return { data: demoData.repairOrders[index], error: null };
    }
    return { data: null, error: 'Ordre non trouvé' };
  }
};

// Service factures
export const demoInvoiceService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.invoices, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const invoice = demoData.invoices.find(i => i.id === id);
    return { data: invoice || null, error: invoice ? null : 'Facture non trouvée' };
  },
  
  async create(invoiceData: any) {
    await simulateNetworkDelay();
    const newInvoice = {
      ...invoiceData,
      id: `invoice-${Date.now()}`,
      invoice_number: `FAC-2024-${String(demoData.invoices.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.invoices.push(newInvoice);
    return { data: newInvoice, error: null };
  }
};

// Service avoirs
export const demoCreditService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.credits, error: null };
  },
  
  async create(creditData: any) {
    await simulateNetworkDelay();
    const newCredit = {
      ...creditData,
      id: `credit-${Date.now()}`,
      credit_number: `AVO-2024-${String(demoData.credits.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.credits.push(newCredit);
    return { data: newCredit, error: null };
  }
};

// Service dépenses
export const demoExpenseService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.expenses, error: null };
  },
  
  async create(expenseData: any) {
    await simulateNetworkDelay();
    const newExpense = {
      ...expenseData,
      id: `expense-${Date.now()}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.expenses.push(newExpense);
    return { data: newExpense, error: null };
  }
};

// Service véhicules de flotte
export const demoFleetVehicleService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.fleetVehicles, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const vehicle = demoData.fleetVehicles.find(v => v.id === id);
    return { data: vehicle || null, error: vehicle ? null : 'Véhicule de flotte non trouvé' };
  },
  
  async create(vehicleData: any) {
    await simulateNetworkDelay();
    const newVehicle = {
      ...vehicleData,
      id: `fleet-${Date.now()}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.fleetVehicles.push(newVehicle);
    return { data: newVehicle, error: null };
  }
};

// Service réservations de flotte
export const demoFleetReservationService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.fleetReservations, error: null };
  },
  
  async create(reservationData: any) {
    await simulateNetworkDelay();
    const newReservation = {
      ...reservationData,
      id: `reservation-${Date.now()}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.fleetReservations.push(newReservation);
    return { data: newReservation, error: null };
  },
  
  async update(id: string, reservationData: any) {
    await simulateNetworkDelay();
    const index = demoData.fleetReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      demoData.fleetReservations[index] = { ...demoData.fleetReservations[index], ...reservationData };
      return { data: demoData.fleetReservations[index], error: null };
    }
    return { data: null, error: 'Réservation non trouvée' };
  }
};

// Service cessions
export const demoCessionService = {
  async getAll() {
    await simulateNetworkDelay();
    return { data: demoData.cessions, error: null };
  },
  
  async create(cessionData: any) {
    await simulateNetworkDelay();
    const newCession = {
      ...cessionData,
      id: `cession-${Date.now()}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.cessions.push(newCession);
    return { data: newCession, error: null };
  }
};

// Service abonnement
export const demoSubscriptionService = {
  async getSubscription() {
    await simulateNetworkDelay();
    
    const subscription = {
      id: '00000000-0000-4000-8000-000000000100',
      company_id: '00000000-0000-4000-8000-000000000002',
      plan_type: 'annual',
      plan_name: 'Karrosserie Pro - Annuel',
      status: 'active',
      current_period_start: new Date(new Date().getFullYear(), 0, 1).toISOString(), // 1er janvier de l'année courante
      current_period_end: new Date(new Date().getFullYear(), 11, 31).toISOString(), // 31 décembre de l'année courante
      tokens_included: 120000, // 120k tokens par an
      tokens_used: 45230, // tokens utilisés
      tokens_remaining: 74770,
      price: 299.99,
      currency: 'EUR',
      auto_renew: true,
      created_at: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      updated_at: new Date().toISOString(),
      features: [
        'Gestion illimitée de clients et véhicules',
        'Génération de devis et factures',
        'Assistant IA pour l\'analyse d\'expertise',
        'Tableau de bord avancé',
        'Export comptable',
        'Support prioritaire'
      ],
      next_billing_date: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
      payment_method: 'Carte bancaire ****1234',
      billing_address: {
        company: 'Garage Dupont SARL',
        street: '15 rue de la République',
        city: 'Lyon',
        postal_code: '69003',
        country: 'France'
      }
    };
    
    return { data: subscription, error: null };
  },
  
  async getUsageStats() {
    await simulateNetworkDelay();
    
    const stats = {
      current_month_tokens: 8450,
      last_month_tokens: 7890,
      average_monthly_tokens: 8120,
      peak_month_tokens: 12340,
      tokens_per_day_last_30: [
        // Simulation des 30 derniers jours
        ...Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tokens: Math.floor(Math.random() * 500) + 150
        }))
      ]
    };
    
    return { data: stats, error: null };
  }
};

// Service générique pour les statistiques du dashboard
export const demoDashboardService = {
  async getStats() {
    await simulateNetworkDelay();
    
    const stats = {
      total_vehicles: demoData.vehicles.length,
      vehicles_in_repair: demoData.vehicles.filter(v => v.status === 'en_cours').length,
      active_clients: demoData.clients.length,
      pending_quotes: demoData.quotes.filter(q => q.status === 'en_attente').length,
      monthly_revenue: demoData.invoices.reduce((sum, inv) => sum + inv.total_ttc, 0),
      unpaid_invoices: demoData.invoices.filter(i => i.status === 'en_attente').length,
    };
    
    return { data: stats, error: null };
  },
  
  async getRecentActivity() {
    await simulateNetworkDelay();
    
    const activities = [
      { type: 'vehicle_added', description: 'Nouveau véhicule ajouté', date: new Date().toISOString() },
      { type: 'quote_created', description: 'Devis créé pour Marie Martin', date: new Date().toISOString() },
      { type: 'invoice_paid', description: 'Facture FAC-2024-001 payée', date: new Date().toISOString() },
    ];
    
    return { data: activities, error: null };
  }
};

// Export du service principal
export const demoService = {
  clients: demoClientService,
  vehicles: demoVehicleService,
  quotes: demoQuoteService,
  repairOrders: demoRepairOrderService,
  invoices: demoInvoiceService,
  credits: demoCreditService,
  expenses: demoExpenseService,
  fleetVehicles: demoFleetVehicleService,
  fleetReservations: demoFleetReservationService,
  cessions: demoCessionService,
  dashboard: demoDashboardService,
  subscription: demoSubscriptionService,
};