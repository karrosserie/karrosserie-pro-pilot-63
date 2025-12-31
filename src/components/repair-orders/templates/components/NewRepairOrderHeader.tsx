import React from 'react';

interface NewRepairOrderHeaderProps {
  companyData: any;
  orderData: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    orderDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountDue?: string;
  };
  clientData: {
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
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};

const NewRepairOrderHeader: React.FC<NewRepairOrderHeaderProps> = ({
  companyData,
  orderData,
  clientData,
  vehicleData,
  expertiseData,
  incidentData,
}) => {
  const hasExpertiseData = expertiseData?.reportNumber || expertiseData?.expertName;
  const hasIncidentData = incidentData?.policyNumber || incidentData?.claimNumber || incidentData?.incidentDate;

  return (
    <div className="bg-white text-black">
      {/* Titre */}
      <h1 className="text-xl font-bold text-white px-4 py-3 text-center mb-4" style={{ backgroundColor: 'rgba(64,67,72,255)' }}>
        ORDRE DE RÉPARATION CARROSSERIE
      </h1>
      
      <p className="text-center text-lg font-bold text-gray-700 mb-6">
        N° {orderData.number}
      </p>

      {/* Prestataire et Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Prestataire */}
        <div>
          <h3 className="font-bold text-gray-700 bg-gray-100 px-3 py-2 mb-3">PRESTATAIRE</h3>
          {companyData?.logo_url && (
            <img 
              src={companyData.logo_url} 
              alt="Logo entreprise" 
              className="max-w-[100px] h-auto mb-3"
            />
          )}
          <div className="space-y-1 text-sm">
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">Raison sociale :</span>
              <span className="text-gray-800">{companyData?.name || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">Adresse :</span>
              <span className="text-gray-800">{companyData?.address || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">CP / Ville :</span>
              <span className="text-gray-800">{companyData?.zipcode || ''} {companyData?.city || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">SIRET :</span>
              <span className="text-gray-800">{companyData?.siret || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">N° TVA :</span>
              <span className="text-gray-800">{companyData?.tva || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">Téléphone :</span>
              <span className="text-gray-800">{companyData?.phone || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">Email :</span>
              <span className="text-gray-800 break-all">{companyData?.email || ''}</span>
            </div>
          </div>
        </div>

        {/* Client */}
        <div>
          <h3 className="font-bold text-gray-700 bg-gray-100 px-3 py-2 mb-3">CLIENT</h3>
          <div className="space-y-1 text-sm">
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">Nom :</span>
              <span className="text-gray-800">{clientData?.name || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">Adresse :</span>
              <span className="text-gray-800">{clientData?.address || ''}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600">CP / Ville :</span>
              <span className="text-gray-800">{clientData?.city || ''}</span>
            </div>
            {clientData?.phone && (
              <div className="flex">
                <span className="font-medium w-32 text-gray-600">Téléphone :</span>
                <span className="text-gray-800">{clientData.phone}</span>
              </div>
            )}
            {clientData?.email && (
              <div className="flex">
                <span className="font-medium w-32 text-gray-600">Email :</span>
                <span className="text-gray-800 break-all">{clientData.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Véhicule */}
      <h3 className="font-bold text-gray-700 bg-gray-100 px-3 py-2 mb-3">VÉHICULE</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="font-medium w-32 text-gray-600">Immatriculation :</span>
            <span className="text-gray-800">{orderData.licensePlate || ''}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32 text-gray-600">Marque / Modèle :</span>
            <span className="text-gray-800">{orderData.vehicle || ''}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32 text-gray-600">Kilométrage :</span>
            <span className="text-gray-800">{orderData.mileage || '-'}</span>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          {vehicleData?.start_date && (
            <div className="flex">
              <span className="font-medium w-36 text-gray-600">Date début travaux :</span>
              <span className="text-gray-800">{formatDate(vehicleData.start_date)}</span>
            </div>
          )}
          {vehicleData?.end_date && (
            <div className="flex">
              <span className="font-medium w-36 text-gray-600">Date fin prévue :</span>
              <span className="text-gray-800">{formatDate(vehicleData.end_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sinistre (optionnel) */}
      {hasIncidentData && (
        <>
          <h3 className="font-bold text-gray-700 bg-gray-100 px-3 py-2 mb-3">SINISTRE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1 text-sm">
              {incidentData?.policyNumber && (
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">N° Police :</span>
                  <span className="text-gray-800">{incidentData.policyNumber}</span>
                </div>
              )}
              {incidentData?.claimNumber && (
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">N° Sinistre :</span>
                  <span className="text-gray-800">{incidentData.claimNumber}</span>
                </div>
              )}
            </div>
            <div className="space-y-1 text-sm">
              {incidentData?.incidentDate && (
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">Date sinistre :</span>
                  <span className="text-gray-800">{formatDate(incidentData.incidentDate)}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Rapport d'expertise (optionnel) */}
      {hasExpertiseData && (
        <>
          <h3 className="font-bold text-gray-700 bg-gray-100 px-3 py-2 mb-3">RAPPORT D'EXPERTISE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1 text-sm">
              {expertiseData?.reportNumber && (
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">N° Rapport :</span>
                  <span className="text-gray-800 font-bold">{expertiseData.reportNumber}</span>
                </div>
              )}
            </div>
            <div className="space-y-1 text-sm">
              {expertiseData?.expertName && (
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">Nom Expert :</span>
                  <span className="text-gray-800">{expertiseData.expertName}</span>
                </div>
              )}
              {expertiseData?.reportDate && (
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">Date rapport :</span>
                  <span className="text-gray-800">{formatDate(expertiseData.reportDate)}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Page 1/4
      </div>
    </div>
  );
};

export default NewRepairOrderHeader;
