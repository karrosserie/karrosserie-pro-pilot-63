import React from 'react';
import DefaultRepairOrderHeader from './components/DefaultRepairOrderHeader';
import DefaultRepairOrderItemsTable from './components/DefaultRepairOrderItemsTable';
import DefaultRepairOrderTotals from './components/DefaultRepairOrderTotals';
import DefaultRepairOrderSignatureFooter from './components/DefaultRepairOrderSignatureFooter';

interface DefaultRepairOrderSignaturePreviewProps {
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
  signatureData?: {
    signature: string | null;
    clientName: string;
    signatureDate: string | null;
  };
}

const DefaultRepairOrderSignaturePreview: React.FC<DefaultRepairOrderSignaturePreviewProps> = (props) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black">
      <DefaultRepairOrderHeader
        companyData={props.companyData}
        orderData={props.orderData}
        clientData={props.clientData}
        vehicleData={props.vehicleData}
      />

      <DefaultRepairOrderItemsTable items={props.items || []} />

      <DefaultRepairOrderTotals totals={props.totals} />

      <DefaultRepairOrderSignatureFooter
        companyData={props.companyData}
        signatureData={props.signatureData}
        isForOodriveSignature={true}
      />
    </div>
  );
};

export default DefaultRepairOrderSignaturePreview;