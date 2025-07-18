import React from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatAmount } from '@/utils/invoiceCalculations';
import { useReceiptsData } from '@/hooks/use-receipts-data';

interface InvoiceHeaderProps {
  invoice: Invoice;
  companyData: any;
  finalTotal: number;
}

const InvoiceHeader = ({ invoice, companyData, finalTotal }: InvoiceHeaderProps) => {
  const { receipts } = useReceiptsData();
  
  // Calculer le total des encaissements pour cette facture
  const totalPaidAmount = receipts
    ?.filter(receipt => receipt.invoice_id === invoice.id)
    ?.reduce((total, receipt) => total + (receipt.amount || 0), 0) || 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne 1 - Informations entreprise */}
        <div>
          <div>
            <h1 className="text-2xl font-bold text-white px-4 py-2 text-center" style={{backgroundColor: 'rgba(64,67,72,255)'}}>FACTURE</h1>
            {companyData.logo_url ? (
              <div className="flex items-center justify-start my-5" style={{maxWidth: '120px'}}>
                <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
              </div>
            ) : (
              <div className="bg-orange-500 rounded-full p-3 w-fit my-5">
                <span className="text-white font-bold text-xl">LOGO</span>
              </div>
            )}
            <p className="text-gray-600 font-bold">{companyData.name || ''}</p>
            <div className="text-sm text-gray-600">
              <p>{companyData.address || ''}</p>
              <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
              <p>Téléphone : {companyData.phone || ''}</p>
              <p>E-mail : {companyData.email || '}</p>
              <p>SIRET : {companyData.siret || ''}</p>
              <p>N° TVA : {companyData.tva || ''}</p>
            </div>
          </div>
        </div>

        {/* Colonne 2 - Détails de la facture */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Détails de la facture</h3>
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Facture</span>
              <span className="text-right">N° {invoice.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">N° de sinistre</span>
              <span className="text-right">{invoice.claim_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date de facturation</span>
              <span className="text-right">{formatDate(invoice.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date d'échéance</span>
              <span className="text-right">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Véhicule</span>
              <span className="text-right">
                {invoice.vehicles ? 
                  `${invoice.vehicles.car_brands?.name || 'N/A'} ${invoice.vehicles.car_models?.name || 'N/A'}` : 
                  'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Immatriculation</span>
              <span className="text-right">{invoice.vehicles?.license_plate || 'N/A'}</span>
            </div>
            {invoice.vehicles?.mileage != null && (
              <div className="flex justify-between">
                <span className="font-medium">Kilométrage</span>
                <span className="text-right">{invoice.vehicles.mileage} km</span>
              </div>
            )}
            {totalPaidAmount > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Montant payé</span>
                <span className="text-right">{formatAmount(totalPaidAmount)}</span>
              </div>
            )}
          </div>
          
          {/* Encadré Montant dû */}
          <div className="bg-blue-600 text-white p-4 text-center mt-4">
            <p className="text-sm mb-1">Montant dû</p>
            <p className="text-2xl font-bold">{formatAmount(finalTotal - totalPaidAmount)}</p>
          </div>
        </div>

        {/* Colonne 3 - Facture pour */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Facture pour</h3>
          <div className="text-sm mb-4">
            <p className="font-medium">{invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié'}</p>
            <p>{invoice.clients?.address || 'Adresse non renseignée'}</p>
            <p>{invoice.clients?.postal_code || ''} {invoice.clients?.city || 'Ville non renseignée'}</p>
            {invoice.clients?.phone && (
              <p>Téléphone : {invoice.clients.phone}</p>
            )}
            {invoice.clients?.email && (
              <p>E-mail : {invoice.clients.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;