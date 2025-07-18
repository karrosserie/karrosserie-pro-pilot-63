import React from 'react';
import DefaultRepairOrderHeader from './components/DefaultRepairOrderHeader';
import DefaultRepairOrderItemsTable from './components/DefaultRepairOrderItemsTable';
import DefaultRepairOrderTotals from './components/DefaultRepairOrderTotals';
import DefaultRepairOrderFooter from './components/DefaultRepairOrderFooter';

interface DefaultRepairOrderPreviewProps {
  companyData: any;
  orderData?: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    orderDate?: string;
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
  vehicleData?: {
    start_date?: string;
    end_date?: string;
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

const DefaultRepairOrderPreview = ({ companyData, orderData, clientData, vehicleData, items, totals }: DefaultRepairOrderPreviewProps) => {

  return (
    <div className="bg-white p-4 rounded shadow-sm w-full flex flex-col" style={{ minHeight: '100vh', height: 'auto', backgroundColor: 'white' }}>
      <DefaultRepairOrderHeader 
        companyData={companyData}
        orderData={orderData}
        clientData={clientData}
        vehicleData={vehicleData}
      />
      
      <DefaultRepairOrderItemsTable items={items} />
      <DefaultRepairOrderTotals totals={totals} clientData={{ notes: orderData?.notes }} />

      <DefaultRepairOrderFooter companyData={companyData} />
    </div>
  );
};

export default DefaultRepairOrderPreview;