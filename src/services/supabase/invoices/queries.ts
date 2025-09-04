
import { STATIC_INVOICES, STATIC_CLIENTS, STATIC_VEHICLES, STATIC_REPAIR_ORDERS, mockApiDelay, filterByCompanyId } from '@/data/staticData';
import { Invoice } from './types';

// Variable pour stocker les factures modifiées
let invoicesData = [...STATIC_INVOICES];

export const invoiceQueries = {
  getAll: async (): Promise<Invoice[]> => {
    console.log('=== DEBUT RÉCUPÉRATION FACTURES ===');
    console.log('Fetching invoices...');
    await mockApiDelay(400);
    
    // Gérer l'impersonation côté client
    const impersonationData = localStorage.getItem('admin_impersonation');
    let companyId = 'demo-company-123';
    
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        console.log('Using impersonation company_id for invoices:', data.company_id);
        companyId = data.company_id;
      } catch (error) {
        console.error('Error parsing impersonation data for invoices:', error);
      }
    }
    
    // Filtrer et enrichir les factures avec les données associées
    const filteredInvoices = filterByCompanyId(invoicesData, companyId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((invoice) => {
        // Enrichir avec les données client
        let clientData = null;
        if (invoice.client_id) {
          clientData = STATIC_CLIENTS.find(c => c.id === invoice.client_id) || null;
          if (clientData) {
            clientData = {
              id: clientData.id,
              first_name: clientData.first_name,
              last_name: clientData.last_name,
              email: clientData.email,
              phone: clientData.phone,
              address: clientData.address,
              postal_code: clientData.postal_code,
              city: clientData.city,
            };
          }
        }

        // Enrichir avec les données véhicule
        let vehicleData = null;
        if (invoice.vehicle_id) {
          vehicleData = STATIC_VEHICLES.find(v => v.id === invoice.vehicle_id) || null;
          if (vehicleData) {
            vehicleData = {
              id: vehicleData.id,
              license_plate: vehicleData.license_plate,
              mileage: vehicleData.mileage,
              car_brands: vehicleData.car_brands,
              car_models: vehicleData.car_models,
            };
          }
        }

        // Enrichir avec les données d'ordre de réparation
        let repairOrderData = null;
        if (invoice.repair_order_id) {
          repairOrderData = STATIC_REPAIR_ORDERS.find(ro => ro.id === invoice.repair_order_id) || null;
          if (repairOrderData) {
            repairOrderData = {
              id: repairOrderData.id,
              reference: repairOrderData.reference,
            };
          }
        }

        return {
          ...invoice,
          clients: clientData,
          vehicles: vehicleData,
          repair_orders: repairOrderData
        } as Invoice;
      });
    
    console.log('=== FACTURES TRANSFORMÉES AVANT RETOUR ===');
    console.log('transformedInvoices:', filteredInvoices);
    console.log('Premier invoice transformé:', filteredInvoices[0]);
    console.log('Premier invoice.clients transformé:', filteredInvoices[0]?.clients);
    
    return filteredInvoices;
  },

  getById: async (id: string): Promise<Invoice> => {
    console.log(`Fetching invoice with id: ${id}`);
    await mockApiDelay(200);
    
    const invoice = invoicesData.find(i => i.id === id);
    
    if (!invoice) {
      console.error(`Invoice with id ${id} not found`);
      throw new Error(`Invoice with id ${id} not found`);
    }
    
    console.log('Données récupérées depuis les données statiques:', invoice);
    
    // Enrichir avec les données associées
    let clientData = null;
    if (invoice.client_id) {
      clientData = STATIC_CLIENTS.find(c => c.id === invoice.client_id) || null;
      if (clientData) {
        clientData = {
          id: clientData.id,
          first_name: clientData.first_name,
          last_name: clientData.last_name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          postal_code: clientData.postal_code,
          city: clientData.city,
        };
      }
    }

    let vehicleData = null;
    if (invoice.vehicle_id) {
      vehicleData = STATIC_VEHICLES.find(v => v.id === invoice.vehicle_id) || null;
      if (vehicleData) {
        vehicleData = {
          id: vehicleData.id,
          license_plate: vehicleData.license_plate,
          mileage: vehicleData.mileage,
          car_brands: vehicleData.car_brands,
          car_models: vehicleData.car_models,
        };
      }
    }

    let repairOrderData = null;
    if (invoice.repair_order_id) {
      repairOrderData = STATIC_REPAIR_ORDERS.find(ro => ro.id === invoice.repair_order_id) || null;
      if (repairOrderData) {
        repairOrderData = {
          id: repairOrderData.id,
          reference: repairOrderData.reference,
        };
      }
    }
    
    const transformedInvoice = {
      ...invoice,
      clients: clientData,
      vehicles: vehicleData,
      repair_orders: repairOrderData
    } as Invoice;
    
    return transformedInvoice;
  },

  getLastInvoiceByUser: async () => {
    await mockApiDelay(200);
    
    const companyId = 'demo-company-123';
    const companyInvoices = filterByCompanyId(invoicesData, companyId)
      .sort((a, b) => b.reference.localeCompare(a.reference));

    if (companyInvoices.length === 0) {
      return null;
    }

    return {
      reference: companyInvoices[0].reference
    };
  }
};
