import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { pdfStyles } from './styles';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

interface InvoicePDFHeaderProps {
  invoice: Invoice;
  companyData: any;
  totalPaidAmount: number;
  finalTotal: number;
}

const InvoicePDFHeader = ({ invoice, companyData, totalPaidAmount, finalTotal }: InvoicePDFHeaderProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  return (
    <View style={pdfStyles.header}>
      {/* Colonne 1 - Informations entreprise */}
      <View style={pdfStyles.headerColumn} wrap={false}>
        <View style={pdfStyles.title}>
          <Text>FACTURE</Text>
        </View>
        {companyData?.logo_url ? (
          <Image style={pdfStyles.logo} src={companyData.logo_url} />
        ) : null}
        <Text style={pdfStyles.companyName}>{companyData?.name || 'KARROSSERIE'}</Text>
        <View style={pdfStyles.companyInfo}>
          <Text>{companyData?.address || 'Votre adresse'}</Text>
          <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
          <Text>Téléphone : {companyData?.phone || '+33 1 23 45 67 89'}</Text>
          <Text>E-mail : {companyData?.email || 'contact@karrosserie.fr'}</Text>
          <Text>SIRET : {companyData?.siret || '123 456 789 00123'}</Text>
          <Text>N° TVA : {companyData?.tva || 'FR 12 123456789'}</Text>
        </View>
      </View>

      {/* Colonne 2 - Détails de la facture */}
      <View style={pdfStyles.headerColumn}>
        <Text style={pdfStyles.sectionTitle}>Détails de la facture</Text>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.detailLabel}>Facture</Text>
          <Text style={pdfStyles.detailValue}>N° {invoice.reference}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.detailLabel}>N° de sinistre</Text>
          <Text style={pdfStyles.detailValue}>{invoice.claim_number || 'N/A'}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.detailLabel}>Date de facturation</Text>
          <Text style={pdfStyles.detailValue}>{formatDate(invoice.created_at)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.detailLabel}>Date d'échéance</Text>
          <Text style={pdfStyles.detailValue}>{formatDate(invoice.due_date)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.detailLabel}>Véhicule</Text>
          <Text style={pdfStyles.detailValue}>
            {invoice.vehicles ? 
              `${invoice.vehicles.car_brands?.name || 'N/A'} ${invoice.vehicles.car_models?.name || 'N/A'}` : 
              'N/A'
            }
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.detailLabel}>Immatriculation</Text>
          <Text style={pdfStyles.detailValue}>{invoice.vehicles?.license_plate || 'N/A'}</Text>
        </View>
        {invoice.vehicles?.mileage != null && (
          <View style={pdfStyles.detailRow}>
            <Text style={pdfStyles.detailLabel}>Kilométrage</Text>
            <Text style={pdfStyles.detailValue}>{invoice.vehicles.mileage} km</Text>
          </View>
        )}
        {totalPaidAmount > 0 && (
          <View style={pdfStyles.detailRow}>
            <Text style={pdfStyles.detailLabel}>Montant payé</Text>
            <Text style={pdfStyles.detailValue}>{formatAmount(totalPaidAmount)}</Text>
          </View>
        )}
        
        {/* Encadré Montant dû */}
        <View style={pdfStyles.amountDue}>
          <Text style={pdfStyles.amountDueText}>Montant dû</Text>
          <Text style={pdfStyles.amountDueValue}>{formatAmount(finalTotal - totalPaidAmount)}</Text>
        </View>
      </View>

      {/* Colonne 3 - Facture pour */}
      <View style={pdfStyles.headerColumn}>
        <Text style={pdfStyles.sectionTitle}>Facture pour</Text>
        <View style={pdfStyles.companyInfo}>
          <Text style={pdfStyles.companyName}>
            {invoice.clients ? getClientDisplayName(invoice.clients) : 'Client non spécifié'}
          </Text>
          <Text>{invoice.clients?.address || 'Adresse non renseignée'}</Text>
          <Text>{invoice.clients?.postal_code || ''} {invoice.clients?.city || 'Ville non renseignée'}</Text>
          {invoice.clients?.phone && (
            <Text>Téléphone : {invoice.clients.phone}</Text>
          )}
          {invoice.clients?.email && (
            <Text>E-mail : {invoice.clients.email}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default InvoicePDFHeader;