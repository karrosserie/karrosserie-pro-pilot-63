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
  signatureData?: {
    signature: string | null;
    clientName: string;
    signatureDate: string | null;
  };
}

const DefaultRepairOrderPreview = ({ companyData, orderData, clientData, vehicleData, items, totals, signatureData }: DefaultRepairOrderPreviewProps) => {

  return (
    <div className="bg-white p-2 sm:p-4 rounded shadow-sm w-full flex flex-col" style={{ minHeight: '100vh', height: 'auto', backgroundColor: 'white' }}>
      <DefaultRepairOrderHeader
        companyData={companyData}
        orderData={orderData}
        clientData={clientData}
        vehicleData={vehicleData}
      />
      
      <DefaultRepairOrderItemsTable items={items} />
      <DefaultRepairOrderTotals totals={totals} clientData={{ notes: orderData?.notes }} />

      {/* Section signature client */}
      {signatureData && (
        <div className="mt-8 flex justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Signature du client</h3>
            {signatureData.signature ? (
              <div className="border border-gray-300 p-4 rounded">
                <img 
                  src={signatureData.signature} 
                  alt="Signature du client"
                  className="mx-auto mb-2"
                  style={{ maxWidth: '200px', maxHeight: '100px' }}
                />
                <p className="text-sm font-medium">{signatureData.clientName}</p>
                {signatureData.signatureDate && (
                  <p className="text-xs text-gray-600">Signé le {signatureData.signatureDate}</p>
                )}
              </div>
            ) : (
              <div className="border border-gray-300 border-dashed p-4 rounded text-gray-500">
                <div style={{ width: '200px', height: '100px' }} className="mx-auto flex items-center justify-center">
                  <span className="text-sm">Signature en attente</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <DefaultRepairOrderFooter companyData={companyData} />
    </div>
  );
};

export default DefaultRepairOrderPreview;