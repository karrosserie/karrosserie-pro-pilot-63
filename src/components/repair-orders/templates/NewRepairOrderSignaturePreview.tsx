import React from 'react';
import NewRepairOrderHeader from './components/NewRepairOrderHeader';
import NewRepairOrderGeneralConditions from './components/NewRepairOrderGeneralConditions';
import NewRepairOrderAcceptance from './components/NewRepairOrderAcceptance';

interface NewRepairOrderSignaturePreviewProps {
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
}

const NewRepairOrderSignaturePreview: React.FC<NewRepairOrderSignaturePreviewProps> = (props) => {
  const {
    companyData,
    orderData,
    clientData,
    vehicleData,
    expertiseData,
    incidentData,
    signatureData,
  } = props;

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
    <div className="max-w-4xl mx-auto p-8 bg-white text-black space-y-8">
      {/* Page 1 - Identification */}
      <div className="border-b border-gray-200 pb-8">
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
      <div className="border-b border-gray-200 pb-8">
        <NewRepairOrderGeneralConditions 
          companyData={companyData} 
          pageNumber={1}
        />
      </div>

      {/* Page 3 - Conditions Générales (Partie 2) + Textes réglementaires */}
      <div className="border-b border-gray-200 pb-8">
        <NewRepairOrderGeneralConditions 
          companyData={companyData} 
          pageNumber={2}
        />
      </div>

      {/* Page 4 - Récapitulatif et Signature (pour Oodrive) */}
      <div>
        <NewRepairOrderAcceptance
          orderData={acceptanceOrderData}
          vehicleData={acceptanceVehicleData}
          expertiseData={expertiseData}
          clientData={clientData}
          signatureData={signatureData}
          isForOodrive={true}
        />
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
        <p>Document généré par Karrosserie Pro - www.karrosserie.pro</p>
      </div>
    </div>
  );
};

export default NewRepairOrderSignaturePreview;
