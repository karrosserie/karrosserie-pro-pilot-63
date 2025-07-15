import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quote } from '@/services/supabase/quotes';

// Type étendu avec les relations
interface QuoteWithRelations extends Quote {
  clients?: {
    first_name: string;
    last_name: string;
    address?: string;
    postal_code?: string;
    city?: string;
  } | null;
  vehicles?: {
    car_brands?: { name: string };
    car_models?: { name: string };
    license_plate: string;
    mileage?: number;
  } | null;
}

interface QuotePDFProps {
  quote: QuoteWithRelations;
  companyData: any;
  receipts?: any[];
  clientData?: any;
  vehicleData?: any;
  template?: string;
}

// Styles pour le template par défaut
const defaultStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
  },
  headerColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#404348',
    padding: 8,
    textAlign: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  clientSection: {
    marginVertical: 15,
  },
  clientTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    padding: 6,
  },
  clientInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 3,
  },
  infoGrid: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  infoColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 9,
    marginBottom: 8,
  },
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#404348',
    color: 'white',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 6,
    fontSize: 8,
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'center' },
  col5: { flex: 1, textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
    width: 200,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
});

// Styles pour le template alternatif - basé sur AlternativeQuotePreview
const alternativeStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    position: 'relative',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 15,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  quoteSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  clientInfoSection: {
    marginTop: 4,
    width: 200,
  },
  clientInfo: {
    fontSize: 8,
    lineHeight: 1.3,
    marginBottom: 1,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dateBox: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  dateLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  tableHeaderCellLast: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tableCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  tableCellLast: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  tableCellLeft: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsTable: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  totalsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  totalsHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    width: 80,
  },
  totalsHeaderCellLast: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    width: 80,
  },
  totalsRow: {
    flexDirection: 'row',
  },
  totalsCell: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    width: 80,
  },
  totalsCellLast: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    width: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
});

const QuotePDF = ({ quote, companyData, receipts = [], clientData, vehicleData, template = 'default' }: QuotePDFProps) => {
  const styles = template === 'alternative' ? alternativeStyles : defaultStyles;
  
  // Fonction pour parser les données JSON
  const parseJSONData = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return Array.isArray(data) ? data : [];
  };

  // Parser les données du devis
  const repairs = parseJSONData(quote.repairs_data);
  const parts = parseJSONData(quote.parts_data);
  const discounts = parseJSONData(quote.discounts_data);

  // Calculer les totaux
  const calculateItemTotal = (item: any) => {
    const unitCost = parseFloat(item.unitCost) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const discount = parseFloat(item.discount) || 0;
    const vat = parseFloat(item.vat) || 0;
    
    const subtotal = unitCost * quantity;
    const afterDiscount = subtotal - discount;
    const vatAmount = (afterDiscount * vat) / 100;
    
    return afterDiscount + vatAmount;
  };

  const subtotalHT = [...repairs, ...parts].reduce((sum, item) => {
    const unitCost = parseFloat(item.unitCost) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const discount = parseFloat(item.discount) || 0;
    return sum + (unitCost * quantity - discount);
  }, 0);

  const totalTVA = [...repairs, ...parts].reduce((sum, item) => {
    const unitCost = parseFloat(item.unitCost) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const discount = parseFloat(item.discount) || 0;
    const vat = parseFloat(item.vat) || 0;
    const afterDiscount = unitCost * quantity - discount;
    return sum + (afterDiscount * vat) / 100;
  }, 0);

  const totalTTC = subtotalHT + totalTVA;

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace('.', ',') + ' €';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (template === 'alternative') {
    return (
      <Document>
        <Page size="A4" style={alternativeStyles.page}>
          {/* Header avec entreprise et devis */}
          <View style={alternativeStyles.mainHeader}>
            <View style={alternativeStyles.companySection}>
              <Text style={alternativeStyles.companyName}>{companyData?.name || 'AUTO PAINT'}</Text>
              <View>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>ADRESSE :</Text> {companyData?.address || '25 rue sainte victoire'}</Text>
                <Text style={alternativeStyles.companyInfo}>{companyData?.zipcode || '13006'} {companyData?.city || 'MARSEILLE'}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>TEL :</Text> {companyData?.phone || '+33064646524'}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>EMAIL :</Text> {companyData?.email || 'autopaint@yopmail.com'}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>SIRET :</Text> {companyData?.siret || '123456789000'}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>TVA :</Text> {companyData?.tva || 'FR123456789'}</Text>
              </View>
            </View>
            
            <View style={alternativeStyles.quoteSection}>
              <Text style={alternativeStyles.quoteTitle}>DEVIS N° {clientData?.number || quote.reference}</Text>
              
              <View style={alternativeStyles.clientInfoSection}>
                <Text style={[alternativeStyles.clientInfo, { fontWeight: 'bold' }]}>{clientData?.name || 'Client'}</Text>
                {clientData?.phone && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>TEL :</Text> {clientData.phone}</Text>}
                {clientData?.email && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>EMAIL :</Text> {clientData.email}</Text>}
                {clientData?.address && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>ADRESSE :</Text> {clientData.address}</Text>}
                {clientData?.city && <Text style={alternativeStyles.clientInfo}>{clientData.city}</Text>}
                {clientData?.licensePlate && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>Immatriculation :</Text> {clientData.licensePlate}</Text>}
                {clientData?.mileage && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>Kilométrage :</Text> {clientData.mileage}</Text>}
                {clientData?.vehicle && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>Véhicule :</Text> {clientData.vehicle}</Text>}
              </View>
            </View>
          </View>

          {/* Date */}
          <View style={alternativeStyles.dateSection}>
            <View style={alternativeStyles.dateBox}>
              <Text style={alternativeStyles.dateLabel}>DATE</Text>
              <Text style={alternativeStyles.dateValue}>{clientData?.billingDate || formatDate(quote.created_at)}</Text>
            </View>
          </View>

          {/* Tableau des articles */}
          <View style={alternativeStyles.table}>
            <View style={alternativeStyles.tableHeader}>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 30 }]}>Réf</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 120 }]}>Description</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 50 }]}>Quantité</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 40 }]}>Remise</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 50 }]}>Prix HT</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 35 }]}>TVA</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 50 }]}>Total HT</Text>
              <Text style={[alternativeStyles.tableHeaderCellLast, { width: 50 }]}>Total TTC</Text>
            </View>
            
            {(clientData?.items || []).map((item: any, index: number) => (
              <View key={index} style={alternativeStyles.tableRow}>
                <Text style={[alternativeStyles.tableCellLeft, { width: 30 }]}>{item.ref || ''}</Text>
                <Text style={[alternativeStyles.tableCellLeft, { width: 120 }]}>{item.description || 'N/A'}</Text>
                <Text style={[alternativeStyles.tableCell, { width: 50 }]}>
                  {item.quantity?.toString().replace('.', ',') || '0'}
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 40 }]}>
                  {item.discount || 0}%
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 50 }]}>
                  {item.unitPrice?.toFixed(2).replace('.', ',') || '0,00'}€
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 35 }]}>
                  {item.vat || 20}%
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 50 }]}>
                  {item.totalHT?.toFixed(2).replace('.', ',') || '0,00'}€
                </Text>
                <Text style={[alternativeStyles.tableCellLast, { width: 50 }]}>
                  {item.totalTTC?.toFixed(2).replace('.', ',') || '0,00'}€
                </Text>
              </View>
            ))}
          </View>

          {/* Totaux */}
          <View style={alternativeStyles.totalsSection}>
            <View style={alternativeStyles.totalsTable}>
              <View style={alternativeStyles.totalsHeader}>
                <Text style={alternativeStyles.totalsHeaderCell}>Total HT</Text>
                <Text style={alternativeStyles.totalsHeaderCell}>Total TVA</Text>
                <Text style={alternativeStyles.totalsHeaderCell}>Total Remise</Text>
                <Text style={alternativeStyles.totalsHeaderCellLast}>Total TTC</Text>
              </View>
              <View style={alternativeStyles.totalsRow}>
                <Text style={alternativeStyles.totalsCell}>{clientData?.totals?.totalHT || '0,00 €'}</Text>
                <Text style={alternativeStyles.totalsCell}>{clientData?.totals?.totalVAT || '0,00 €'}</Text>
                <Text style={alternativeStyles.totalsCell}>{clientData?.totals?.totalDiscount || '0,00 €'}</Text>
                <Text style={alternativeStyles.totalsCellLast}>{clientData?.totals?.totalTTC || '0,00 €'}</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text style={alternativeStyles.footer} fixed>
            {companyData?.name || 'AUTO PAINT'} - {companyData?.address || '25 rue sainte victoire'} {companyData?.zipcode || '13006'} {companyData?.city || 'MARSEILLE'} - 
            SIRET {companyData?.siret || '12345678900010'} - N° TVA : {companyData?.tva || 'FR123456789'} - 
            Tel : {companyData?.phone || '+330646465242'} - Email : {companyData?.email || 'autopaint@yopmail.com'}
          </Text>
        </Page>
      </Document>
    );
  }

  // Template par défaut
  return (
    <Document>
      <Page size="A4" style={defaultStyles.page}>
        {/* Header */}
        <View style={defaultStyles.header}>
          <View style={defaultStyles.headerColumn}>
            {companyData?.logo_url && (
              <Image src={companyData.logo_url} style={defaultStyles.logo} />
            )}
            <Text style={defaultStyles.companyName}>
              {companyData?.name || 'KARROSSERIE'}
            </Text>
            <Text style={defaultStyles.companyInfo}>
              {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''}
              {'\n'}SIRET: {companyData?.siret || ''} - N° TVA: {companyData?.tva || ''}
              {'\n'}Tel: {companyData?.phone || ''} - Email: {companyData?.email || ''}
            </Text>
          </View>
          
          <View style={defaultStyles.headerColumn}>
            <Text style={defaultStyles.title}>DEVIS N° {quote.reference}</Text>
            <Text style={defaultStyles.companyInfo}>
              Date: {formatDate(quote.created_at)}
              {'\n'}Validité: {quote.valid_until ? formatDate(quote.valid_until) : 'Non définie'}
            </Text>
          </View>
        </View>

        {/* Client */}
        <View style={defaultStyles.clientSection}>
          <Text style={defaultStyles.clientTitle}>Client</Text>
          <Text style={defaultStyles.clientInfo}>
            {clientData?.clientName || (quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : '')}
          </Text>
          <Text style={defaultStyles.clientInfo}>
            {clientData?.address || quote.clients?.address || ''}
          </Text>
          <Text style={defaultStyles.clientInfo}>
            {clientData?.postalCode || quote.clients?.postal_code || ''} {clientData?.city || quote.clients?.city || ''}
          </Text>
        </View>

        {/* Informations véhicule et sinistre */}
        <View style={defaultStyles.infoGrid}>
          <View style={defaultStyles.infoColumn}>
            <Text style={defaultStyles.infoLabel}>Véhicule:</Text>
            <Text style={defaultStyles.infoValue}>
              {vehicleData?.vehicle || (quote.vehicles ? `${quote.vehicles.car_brands?.name || ''} ${quote.vehicles.car_models?.name || ''}` : '')}
            </Text>
            <Text style={defaultStyles.infoLabel}>Immatriculation:</Text>
            <Text style={defaultStyles.infoValue}>
              {vehicleData?.licensePlate || quote.vehicles?.license_plate || ''}
            </Text>
            {quote.vehicles?.mileage && (
              <>
                <Text style={defaultStyles.infoLabel}>Kilométrage:</Text>
                <Text style={defaultStyles.infoValue}>{quote.vehicles.mileage.toLocaleString()} km</Text>
              </>
            )}
          </View>
          
          <View style={defaultStyles.infoColumn}>
            {quote.claim_number && (
              <>
                <Text style={defaultStyles.infoLabel}>N° Sinistre:</Text>
                <Text style={defaultStyles.infoValue}>{quote.claim_number}</Text>
              </>
            )}
            {quote.report_number && (
              <>
                <Text style={defaultStyles.infoLabel}>N° Rapport:</Text>
                <Text style={defaultStyles.infoValue}>{quote.report_number}</Text>
              </>
            )}
            {quote.expert_name && (
              <>
                <Text style={defaultStyles.infoLabel}>Expert:</Text>
                <Text style={defaultStyles.infoValue}>{quote.expert_name}</Text>
              </>
            )}
          </View>
        </View>

        {/* Réparations */}
        {repairs.length > 0 && (
          <View style={defaultStyles.table}>
            <View style={defaultStyles.tableHeader}>
              <Text style={defaultStyles.col1}>Réparations</Text>
              <Text style={defaultStyles.col2}>Qté</Text>
              <Text style={defaultStyles.col3}>Prix unit.</Text>
              <Text style={defaultStyles.col4}>TVA</Text>
              <Text style={defaultStyles.col5}>Total</Text>
            </View>
            {repairs.map((repair: any, index: number) => (
              <View key={index} style={defaultStyles.tableRow}>
                <Text style={defaultStyles.col1}>{repair.description}</Text>
                <Text style={defaultStyles.col2}>{repair.quantity}</Text>
                <Text style={defaultStyles.col3}>{formatCurrency(repair.unitCost)}</Text>
                <Text style={defaultStyles.col4}>{repair.vat}%</Text>
                <Text style={defaultStyles.col5}>{formatCurrency(calculateItemTotal(repair))}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Pièces */}
        {parts.length > 0 && (
          <View style={defaultStyles.table}>
            <View style={defaultStyles.tableHeader}>
              <Text style={defaultStyles.col1}>Pièces</Text>
              <Text style={defaultStyles.col2}>Qté</Text>
              <Text style={defaultStyles.col3}>Prix unit.</Text>
              <Text style={defaultStyles.col4}>TVA</Text>
              <Text style={defaultStyles.col5}>Total</Text>
            </View>
            {parts.map((part: any, index: number) => (
              <View key={index} style={defaultStyles.tableRow}>
                <Text style={defaultStyles.col1}>{part.description}</Text>
                <Text style={defaultStyles.col2}>{part.quantity}</Text>
                <Text style={defaultStyles.col3}>{formatCurrency(part.unitCost)}</Text>
                <Text style={defaultStyles.col4}>{part.vat}%</Text>
                <Text style={defaultStyles.col5}>{formatCurrency(calculateItemTotal(part))}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Totaux */}
        <View style={defaultStyles.totalsSection}>
          <View style={defaultStyles.totalRow}>
            <Text style={defaultStyles.totalLabel}>Sous-total HT:</Text>
            <Text style={defaultStyles.totalValue}>{formatCurrency(subtotalHT)}</Text>
          </View>
          <View style={defaultStyles.totalRow}>
            <Text style={defaultStyles.totalLabel}>TVA:</Text>
            <Text style={defaultStyles.totalValue}>{formatCurrency(totalTVA)}</Text>
          </View>
          <View style={defaultStyles.totalRow}>
            <Text style={defaultStyles.totalLabel}>Total TTC:</Text>
            <Text style={defaultStyles.totalValue}>{formatCurrency(totalTTC)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={defaultStyles.infoLabel}>Notes:</Text>
            <Text style={defaultStyles.infoValue}>{quote.notes}</Text>
          </View>
        )}

        {/* Footer par défaut */}
        <Text style={defaultStyles.footer} fixed>
          {companyData?.name || 'KARROSSERIE'} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
          SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
          Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
        </Text>
      </Page>
    </Document>
  );
};

export default QuotePDF;