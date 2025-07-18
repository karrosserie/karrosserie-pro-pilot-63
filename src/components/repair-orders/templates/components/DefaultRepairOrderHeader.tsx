import React from 'react';

interface DefaultRepairOrderHeaderProps {
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
  };
}

const DefaultRepairOrderHeader = ({ companyData, orderData, clientData, vehicleData }: DefaultRepairOrderHeaderProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* Colonne 1 - Entreprise */}
      <div>
        <h1 className="text-2xl font-bold text-white px-3 py-1 text-center mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>ORDRE DE RÉPARATION</h1>
        {companyData.logo_url ? (
          <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
            <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
          </div>
        ) : (
          <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
            <span className="text-white font-bold text-base">LOGO</span>
          </div>
        )}
        <p className="text-gray-600 font-bold mb-2">{companyData.name || ''}</p>
        <div className="text-base text-gray-600 space-y-1">
          <p>{companyData.address || ''}</p>
          <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
          <p>Téléphone : {companyData.phone || ''}</p>
          <p>E-mail : {companyData.email || ''}</p>
          <p>SIRET : {companyData.siret || ''}</p>
          <p>N° TVA : {companyData.tva || ''}</p>
        </div>
      </div>

      {/* Colonne 2 - Détails de l'ordre de réparation */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Détails de l'ordre de réparation</h3>
        <div className="text-base space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Ordre de réparation</span>
            <span>{orderData.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">N° de sinistre</span>
            <span>{orderData.claimNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date de création</span>
            <span>{orderData.billingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date d'ordre</span>
            <span>{orderData.orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Véhicule</span>
            <span>{orderData.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Immatriculation</span>
            <span>{orderData.licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Kilométrage</span>
            <span>{orderData.mileage}</span>
          </div>
        </div>
        
        {/* Encadré Montant total */}
        <div className="bg-blue-600 text-white p-2 text-center mt-3">
          <p className="text-base mb-1">Montant total</p>
          <p className="text-lg font-bold">{orderData.amountDue}</p>
        </div>
      </div>

      {/* Colonne 3 - Ordre de réparation pour */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Ordre de réparation pour</h3>
        <div className="text-base space-y-1">
          <p className="font-medium">{clientData.name}</p>
          <p>{clientData.address}</p>
          <p>{clientData.city}</p>
          {clientData.phone && <p>Téléphone : {clientData.phone}</p>}
          {clientData.email && <p>E-mail : {clientData.email}</p>}
        </div>
        
        {/* Délai prévisionnel - affiché seulement si les deux dates sont renseignées */}
        {vehicleData?.start_date && vehicleData?.end_date && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Délai prévisionnel</h4>
            <div className="text-base space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Date de début</span>
                <span>{vehicleData.start_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date de fin</span>
                <span>{vehicleData.end_date}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultRepairOrderHeader;