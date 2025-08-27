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
  },
  
  async delete(id: string) {
    await simulateNetworkDelay();
    const index = demoData.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      demoData.vehicles.splice(index, 1);
      return { error: null };
    }
    return { error: 'Véhicule non trouvé' };
  }
};

// Service devis
export const demoQuoteService = {
  async getAll() {
    await simulateNetworkDelay();
    
    // Joindre les données clients et véhicules aux devis
    const quotesWithRelations = demoData.quotes.map(quote => {
      const client = demoData.clients.find(c => c.id === quote.client_id);
      const vehicle = demoData.vehicles.find(v => v.id === quote.vehicle_id);
      
      return {
        ...quote,
        reference: quote.quote_number,
        clients: client ? {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name
        } : null,
        vehicles: vehicle ? {
          id: vehicle.id,
          license_plate: vehicle.registration_number,
          car_brands: { name: vehicle.brand },
          car_models: { name: vehicle.model }
        } : null
      };
    });
    
    return { data: quotesWithRelations, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const quote = demoData.quotes.find(q => q.id === id);
    
    if (!quote) return { data: null, error: 'Devis non trouvé' };
    
    // Joindre les relations
    const client = demoData.clients.find(c => c.id === quote.client_id);
    const vehicle = demoData.vehicles.find(v => v.id === quote.vehicle_id);
    
    const quoteWithRelations = {
      ...quote,
      reference: quote.quote_number,
      clients: client ? {
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name
      } : null,
      vehicles: vehicle ? {
        id: vehicle.id,
        license_plate: vehicle.registration_number,
        car_brands: { name: vehicle.brand },
        car_models: { name: vehicle.model }
      } : null
    };
    
    return { data: quoteWithRelations, error: null };
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
    
    // Retourner avec les relations jointes
    const client = demoData.clients.find(c => c.id === newQuote.client_id);
    const vehicle = demoData.vehicles.find(v => v.id === newQuote.vehicle_id);
    
    const quoteWithRelations = {
      ...newQuote,
      reference: newQuote.quote_number,
      clients: client ? {
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name
      } : null,
      vehicles: vehicle ? {
        id: vehicle.id,
        license_plate: vehicle.registration_number,
        car_brands: { name: vehicle.brand },
        car_models: { name: vehicle.model }
      } : null
    };
    
    return { data: quoteWithRelations, error: null };
  },
  
  async update(id: string, quoteData: any) {
    await simulateNetworkDelay();
    const index = demoData.quotes.findIndex(q => q.id === id);
    if (index !== -1) {
      demoData.quotes[index] = { ...demoData.quotes[index], ...quoteData };
      const updatedQuote = demoData.quotes[index];
      
      // Retourner avec les relations jointes
      const client = demoData.clients.find(c => c.id === updatedQuote.client_id);
      const vehicle = demoData.vehicles.find(v => v.id === updatedQuote.vehicle_id);
      
      const quoteWithRelations = {
        ...updatedQuote,
        reference: updatedQuote.quote_number,
        clients: client ? {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name
        } : null,
        vehicles: vehicle ? {
          id: vehicle.id,
          license_plate: vehicle.registration_number,
          car_brands: { name: vehicle.brand },
          car_models: { name: vehicle.model }
        } : null
      };
      
      return { data: quoteWithRelations, error: null };
    }
    return { data: null, error: 'Devis non trouvé' };
  },
  
  async delete(id: string) {
    await simulateNetworkDelay();
    const index = demoData.quotes.findIndex(q => q.id === id);
    if (index !== -1) {
      demoData.quotes.splice(index, 1);
      return { error: null };
    }
    return { error: 'Devis non trouvé' };
  }
};

// Service ordres de réparation
export const demoRepairOrderService = {
  async getAll() {
    await simulateNetworkDelay();
    
    // Joindre les données clients et véhicules aux ordres de réparation
    const ordersWithRelations = demoData.repairOrders.map(order => {
      const client = demoData.clients.find(c => c.id === order.client_id);
      const vehicle = demoData.vehicles.find(v => v.id === order.vehicle_id);
      
      return {
        ...order,
        reference: order.order_number,
        amount: order.total_ttc,
        clients: client ? {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name
        } : null,
        vehicles: vehicle ? {
          id: vehicle.id,
          license_plate: vehicle.registration_number,
          car_brands: { name: vehicle.brand },
          car_models: { name: vehicle.model }
        } : null,
        quotes: order.quote_id ? {
          id: order.quote_id,
          reference: `DEV-${order.quote_id}`
        } : null
      };
    });
    
    return { data: ordersWithRelations, error: null };
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
  },
  
  async delete(id: string) {
    await simulateNetworkDelay();
    const index = demoData.repairOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      demoData.repairOrders.splice(index, 1);
      return { error: null };
    }
    return { error: 'Ordre non trouvé' };
  }
};

// Service factures
export const demoInvoiceService = {
  async getAll() {
    await simulateNetworkDelay();
    
    // Joindre les données clients et véhicules aux factures
    const invoicesWithRelations = demoData.invoices.map(invoice => {
      const client = demoData.clients.find(c => c.id === invoice.client_id);
      const vehicle = demoData.vehicles.find(v => v.id === invoice.vehicle_id);
      
      return {
        ...invoice,
        reference: invoice.invoice_number,
        amount: invoice.total_ttc,
        date: invoice.created_at,
        due_date: invoice.payment_due_date,
        repairs_data: [],
        parts_data: [],
        discounts_data: [],
        clients: client ? {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          postal_code: client.postal_code
        } : null,
        vehicles: vehicle ? {
          id: vehicle.id,
          license_plate: vehicle.registration_number,
          mileage: vehicle.mileage,
          car_brands: { id: 'brand-1', name: vehicle.brand },
          car_models: { id: 'model-1', name: vehicle.model }
        } : null,
        repair_orders: invoice.repair_order_id ? {
          id: invoice.repair_order_id,
          reference: `ORD-${invoice.repair_order_id}`
        } : null
      };
    });
    
    return { data: invoicesWithRelations, error: null };
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
  },
  
  async update(id: string, invoiceData: any) {
    await simulateNetworkDelay();
    const index = demoData.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      demoData.invoices[index] = { ...demoData.invoices[index], ...invoiceData };
      return { data: demoData.invoices[index], error: null };
    }
    return { data: null, error: 'Facture non trouvée' };
  },
  
  async delete(id: string) {
    await simulateNetworkDelay();
    const index = demoData.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      demoData.invoices.splice(index, 1);
      return { error: null };
    }
    return { error: 'Facture non trouvée' };
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

// Service rapports d'expertise
export const demoExpertiseReportService = {
  async getAll() {
    await simulateNetworkDelay();
    
    // Joindre les données clients et véhicules aux rapports
    const reportsWithRelations = demoData.expertiseReports.map(report => {
      const client = demoData.clients.find(c => c.id === report.client_id);
      const vehicle = demoData.vehicles.find(v => v.id === report.vehicle_id);
      
      return {
        ...report,
        clients: client ? {
          first_name: client.first_name,
          last_name: client.last_name
        } : null,
        vehicles: vehicle ? {
          id: vehicle.id,
          license_plate: vehicle.registration_number,
          car_brands: { name: vehicle.brand },
          car_models: { name: vehicle.model }
        } : null
      };
    });
    
    return { data: reportsWithRelations, error: null };
  },
  
  async getById(id: string) {
    await simulateNetworkDelay();
    const report = demoData.expertiseReports.find(r => r.id === id);
    
    if (!report) return { data: null, error: 'Rapport non trouvé' };
    
    // Joindre les relations
    const client = demoData.clients.find(c => c.id === report.client_id);
    const vehicle = demoData.vehicles.find(v => v.id === report.vehicle_id);
    
    const reportWithRelations = {
      ...report,
      clients: client ? {
        first_name: client.first_name,
        last_name: client.last_name
      } : null,
      vehicles: vehicle ? {
        id: vehicle.id,
        license_plate: vehicle.registration_number,
        car_brands: { name: vehicle.brand },
        car_models: { name: vehicle.model }
      } : null
    };
    
    return { data: reportWithRelations, error: null };
  },
  
  async create(reportData: any) {
    await simulateNetworkDelay();
    const newReport = {
      ...reportData,
      id: `expertise-${Date.now()}`,
      report_number: `EXP-2024-${String(demoData.expertiseReports.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      company_id: 'demo-company-id',
    };
    demoData.expertiseReports.push(newReport);
    return { data: newReport, error: null };
  },
  
  async update(id: string, reportData: any) {
    await simulateNetworkDelay();
    const index = demoData.expertiseReports.findIndex(r => r.id === id);
    if (index !== -1) {
      demoData.expertiseReports[index] = { ...demoData.expertiseReports[index], ...reportData };
      return { data: demoData.expertiseReports[index], error: null };
    }
    return { data: null, error: 'Rapport non trouvé' };
  },
  
  async delete(id: string) {
    await simulateNetworkDelay();
    const index = demoData.expertiseReports.findIndex(r => r.id === id);
    if (index !== -1) {
      demoData.expertiseReports.splice(index, 1);
      return { error: null };
    }
    return { error: 'Rapport non trouvé' };
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
      vehiclesInRepair: demoData.vehicles.filter(v => v.status === 'en_cours').length,
      activeClients: demoData.clients.length,
      pendingQuotes: demoData.quotes.filter(q => q.status === 'en_attente').length,
      revenue: 15420.50,
      revenueChange: '+12%',
      revenueIsPositive: true,
      clientsChange: '+8%',
      clientsIsPositive: true,
      carBodyRevenue: 9850.25,
      carBodyChange: '+15%',
      carBodyIsPositive: true,
      mechanicRevenue: 5570.25,
      mechanicChange: '+7%',
      mechanicIsPositive: true
    };
    
    return { data: stats, error: null };
  },
  
  async getRecentActivity() {
    await simulateNetworkDelay();
    
    const now = new Date();
    const activities = [
      {
        id: 'activity-1',
        icon: 'Car',
        iconBackground: 'bg-purple-500',
        title: 'Véhicule créé',
        description: 'Renault Clio - AB-123-CD',
        time: `${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: now.getTime()
      },
      {
        id: 'activity-2',
        icon: 'FileText',
        iconBackground: 'bg-blue-500',
        title: 'Devis créé',
        description: 'Devis n°DEV-2024-001 - Marie Martin',
        time: `${new Date(now.getTime() - 3600000).toLocaleDateString('fr-FR')} à ${new Date(now.getTime() - 3600000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: now.getTime() - 3600000
      },
      {
        id: 'activity-3',
        icon: 'CreditCard',
        iconBackground: 'bg-amber-500',
        title: 'Paiement reçu',
        description: 'Facture n°FAC-2024-001 - Pierre Durand (890,00 €)',
        time: `${new Date(now.getTime() - 7200000).toLocaleDateString('fr-FR')} à ${new Date(now.getTime() - 7200000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: now.getTime() - 7200000
      },
      {
        id: 'activity-4',
        icon: 'Wrench',
        iconBackground: 'bg-orange-500',
        title: 'Ordre de réparation créé',
        description: 'Ordre n°ORD-2024-003 - Sophie Bernard',
        time: `${new Date(now.getTime() - 10800000).toLocaleDateString('fr-FR')} à ${new Date(now.getTime() - 10800000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: now.getTime() - 10800000
      },
      {
        id: 'activity-5',
        icon: 'User',
        iconBackground: 'bg-green-500',
        title: 'Nouveau client créé',
        description: 'Antoine Petit',
        time: `${new Date(now.getTime() - 14400000).toLocaleDateString('fr-FR')} à ${new Date(now.getTime() - 14400000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: now.getTime() - 14400000
      }
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
  expertiseReports: demoExpertiseReportService,
  dashboard: demoDashboardService,
  subscription: demoSubscriptionService,
};