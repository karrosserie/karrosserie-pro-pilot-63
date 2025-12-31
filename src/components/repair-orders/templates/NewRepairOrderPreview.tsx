import React from 'react';
import NewRepairOrderHeader from './components/NewRepairOrderHeader';
import NewRepairOrderGeneralConditions from './components/NewRepairOrderGeneralConditions';
import NewRepairOrderAcceptance from './components/NewRepairOrderAcceptance';
import DefaultRepairOrderFooter from './components/DefaultRepairOrderFooter';

interface NewRepairOrderPreviewProps {
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
    amount?: number;
    date?: string;
    reference?: string;
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
    brand?: string;
    model?: string;
  };
  expertiseData?: {
    reportNumber?: string;
    expertName?: string;
    reportDate?: string;
  };
  incidentData?: {
    policyNumber?: string;
    claimNumber?: string;
    incidentDate?: string;
  };
  signatureData?: {
    signature: string | null;
    clientName: string;
    signatureDate: string | null;
  };
  isForOodrive?: boolean;
}

const NewRepairOrderPreview: React.FC<NewRepairOrderPreviewProps> = ({
  companyData,
  orderData,
  clientData,
  vehicleData,
  expertiseData,
  incidentData,
  signatureData,
  isForOodrive = false,
}) => {
  // Préparer les données pour le composant acceptance
  const acceptanceOrderData = {
    reference: orderData?.number || orderData?.reference,
    date: orderData?.orderDate || orderData?.date,
    amount: orderData?.amount || (orderData?.amountDue ? parseFloat(orderData.amountDue.replace(/[^\d,.-]/g, '').replace(',', '.')) : 0),
  };

  const acceptanceVehicleData = {
    brand: vehicleData?.brand || orderData?.vehicle?.split(' ')[0],
    model: vehicleData?.model || orderData?.vehicle?.split(' ').slice(1).join(' '),
    licensePlate: orderData?.licensePlate,
    start_date: vehicleData?.start_date,
    end_date: vehicleData?.end_date,
  };

  return (
    <div className="bg-white rounded shadow-sm w-full flex flex-col space-y-8">
      {/* Page 1 - Identification */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <NewRepairOrderHeader
          companyData={companyData}
          orderData={orderData || {}}
          clientData={clientData || {}}
          vehicleData={vehicleData}
          expertiseData={expertiseData}
          incidentData={incidentData}
        />
      </div>

      {/* Page 2 - Conditions Générales (Partie 1) */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <NewRepairOrderGeneralConditions 
          companyData={companyData} 
          pageNumber={1}
        />
      </div>

      {/* Page 3 - Conditions Générales (Partie 2) + Textes réglementaires */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <NewRepairOrderGeneralConditions 
          companyData={companyData} 
          pageNumber={2}
        />
      </div>

      {/* Page 4 - Récapitulatif et Signature */}
      <div className="p-4 sm:p-6">
        <NewRepairOrderAcceptance
          orderData={acceptanceOrderData}
          vehicleData={acceptanceVehicleData}
          expertiseData={expertiseData}
          clientData={clientData}
          signatureData={signatureData}
          isForOodrive={isForOodrive}
        />
      </div>

      {/* Footer */}
      <DefaultRepairOrderFooter companyData={companyData} />
    </div>
  );
};

export default NewRepairOrderPreview;
