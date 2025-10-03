import React from 'react';
import DefaultCreditHeader from './components/DefaultCreditHeader';
import DefaultCreditItemsTable from './components/DefaultCreditItemsTable';
import DefaultCreditTotals from './components/DefaultCreditTotals';
import DefaultCreditFooter from './components/DefaultCreditFooter';

interface DefaultCreditPreviewProps {
  companyData: any;
  creditData?: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    dueDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountDue?: string;
    notes?: string;
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

const DefaultCreditPreview = ({ companyData, creditData, clientData, items, totals }: DefaultCreditPreviewProps) => {
  // Données par défaut pour l'aperçu
  const defaultCreditData = {
    number: 'N° 5',
    claimNumber: 'SIN-2024-001',
    billingDate: '11/07/2025',
    dueDate: '10/08/2025',
    vehicle: 'Peugeot 308',
    licensePlate: 'AB-123-CD',
    mileage: '85 679 km',
    amountDue: '250,00 €',
    ...creditData
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
    { ref: '', description: 'Remboursement pièce défectueuse', quantity: 1, discount: 0, unitPrice: 200.00, vat: 20, totalHT: 200.00, totalTTC: 240.00 },
    { ref: '', description: 'Remise commerciale', quantity: 1, discount: 0, unitPrice: 50.00, vat: 20, totalHT: 50.00, totalTTC: 60.00 }
  ];

  const defaultTotals = {
    subtotal: '250,00 €',
    vat: '50,00 €',
    total: '300,00 €',
    ...totals
  };

  return (
    <div className="bg-white p-2 sm:p-4 rounded shadow-sm w-full flex flex-col" style={{ minHeight: '100vh', height: 'auto', backgroundColor: 'white' }}>
      <DefaultCreditHeader
        companyData={companyData}
        creditData={defaultCreditData}
        clientData={defaultClientData}
      />
      
      <DefaultCreditItemsTable items={defaultItems} />
      <DefaultCreditTotals totals={defaultTotals} clientData={{ notes: defaultCreditData.notes }} />

      <DefaultCreditFooter companyData={companyData} />
    </div>
  );
};

export default DefaultCreditPreview;