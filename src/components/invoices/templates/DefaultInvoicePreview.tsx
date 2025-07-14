import React from 'react';
import DefaultInvoiceHeader from './components/DefaultInvoiceHeader';
import DefaultInvoiceItemsTable from './components/DefaultInvoiceItemsTable';
import DefaultInvoiceTotals from './components/DefaultInvoiceTotals';
import DefaultInvoicePaymentsTable from './components/DefaultInvoicePaymentsTable';
import DefaultInvoiceFooter from './components/DefaultInvoiceFooter';

interface DefaultInvoicePreviewProps {
  companyData: any;
  invoiceData?: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    dueDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountDue?: string;
  };
  clientData?: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  items?: Array<{
    ref?: string;
    description?: string;
    quantity?: number;
    discount?: number;
    unitPrice?: number;
    vat?: number;
    totalHT?: number;
    totalTTC?: number;
  }>;
  totals?: {
    subtotal?: string;
    vat?: string;
    total?: string;
  };
}

const DefaultInvoicePreview = ({ companyData, invoiceData, clientData, items, totals }: DefaultInvoicePreviewProps) => {
  // Données par défaut pour l'aperçu
  const defaultInvoiceData = {
    number: 'N° 5',
    claimNumber: 'SIN-2024-001',
    billingDate: '11/07/2025',
    dueDate: '10/08/2025',
    vehicle: 'Peugeot 308',
    licensePlate: 'AB-123-CD',
    mileage: '85 679 km',
    amountDue: '1 250,00 €',
    ...invoiceData
  };

  const defaultClientData = {
    name: 'Jean Dupont',
    address: '134 Boulevard Michelet',
    city: '13008 MARSEILLE',
    phone: '+33 6 12 34 56 78',
    email: 'jean.dupont@email.com',
    ...clientData
  };

  const defaultItems = items || [
    { ref: '', description: 'T1', quantity: 2, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 220.00, totalTTC: 264.00 },
    { ref: '', description: 'T2', quantity: 2, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 220.00, totalTTC: 264.00 },
    { ref: '', description: 'GRILLE DE PARE-CHOCS AV', quantity: 1, discount: 5, unitPrice: 95.00, vat: 20, totalHT: 90.25, totalTTC: 108.30 },
    { ref: '', description: 'CONDENSEUR DE CLIMATISATION MOTRIO', quantity: 5, discount: 0, unitPrice: 0.00, vat: 20, totalHT: 0.00, totalTTC: 0.00 }
  ];

  const defaultTotals = {
    subtotal: '918,75 €',
    vat: '183,75 €',
    total: '1 102,50 €',
    ...totals
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm w-full h-full flex flex-col" style={{ minHeight: '500px', backgroundColor: 'white', height: '100%' }}>
      <DefaultInvoiceHeader 
        companyData={companyData}
        invoiceData={defaultInvoiceData}
        clientData={defaultClientData}
      />
      
      <DefaultInvoiceItemsTable items={defaultItems} />
      <DefaultInvoiceTotals totals={defaultTotals} />
      <DefaultInvoicePaymentsTable />

      <DefaultInvoiceFooter companyData={companyData} />
    </div>
  );
};

export default DefaultInvoicePreview;