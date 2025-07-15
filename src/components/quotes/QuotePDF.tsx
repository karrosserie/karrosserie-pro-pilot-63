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
  tableContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  tableHeaderCellLast: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  tableCellLast: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
  tableCellCenter: {
    textAlign: 'center',
  },
  tableCellLeft: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'left',
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsTable: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
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
              
              <View style={[alternativeStyles.clientInfoSection, { marginTop: 0 }]}>
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
          <View style={alternativeStyles.tableContainer}>
            <View style={alternativeStyles.tableHeader}>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 30 }]}>Réf</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 225 }]}>Description</Text>
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
                <Text style={[alternativeStyles.tableCellLeft, { width: 225 }]}>{item.description || 'N/A'}</Text>
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

  // Template par défaut - aligné sur le style des factures
  return (
    <Document>
      <Page size="A4" style={defaultStyles.page}>
        {/* Header par défaut - 3 colonnes comme les factures */}
        <View style={defaultStyles.header}>
          <View style={defaultStyles.headerColumn}>
            <View style={defaultStyles.title}>
              <Text>DEVIS</Text>
            </View>
            {companyData?.logo_url && (
              <Image src={companyData.logo_url} style={{ width: 80, height: 60, marginBottom: 8 }} />
            )}
            <Text style={defaultStyles.companyName}>{companyData?.name || 'KARROSSERIE'}</Text>
            <View style={defaultStyles.companyInfo}>
              <Text>{companyData?.address || 'Votre adresse'}</Text>
              <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
              <Text>Téléphone : {companyData?.phone || '+33 1 23 45 67 89'}</Text>
              <Text>E-mail : {companyData?.email || 'contact@karrosserie.fr'}</Text>
              <Text>SIRET : {companyData?.siret || '123 456 789 00123'}</Text>
              <Text>N° TVA : {companyData?.tva || 'FR 12 123456789'}</Text>
            </View>
          </View>

          <View style={defaultStyles.headerColumn}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#404348' }}>Détails du devis</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Devis</Text>
              <Text style={{ fontSize: 9, textAlign: 'right' }}>N° {clientData?.number || quote.reference}</Text>
            </View>
            {clientData?.claimNumber && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 9 }}>N° de sinistre</Text>
                <Text style={{ fontSize: 9, textAlign: 'right' }}>{clientData.claimNumber}</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Date de création</Text>
              <Text style={{ fontSize: 9, textAlign: 'right' }}>{clientData?.billingDate || formatDate(quote.created_at)}</Text>
            </View>
            {quote.valid_until && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Validité</Text>
                <Text style={{ fontSize: 9, textAlign: 'right' }}>{formatDate(quote.valid_until)}</Text>
              </View>
            )}
            {clientData?.vehicle && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Véhicule</Text>
                <Text style={{ fontSize: 9, textAlign: 'right' }}>{clientData.vehicle}</Text>
              </View>
            )}
            {clientData?.licensePlate && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Immatriculation</Text>
                <Text style={{ fontSize: 9, textAlign: 'right' }}>{clientData.licensePlate}</Text>
              </View>
            )}
            {clientData?.mileage && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, fontSize: 9 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Kilométrage</Text>
                <Text style={{ fontSize: 9, textAlign: 'right' }}>{clientData.mileage}</Text>
              </View>
            )}
          </View>

          <View style={defaultStyles.headerColumn}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#404348' }}>Devis pour</Text>
            <View style={defaultStyles.companyInfo}>
              <Text style={defaultStyles.companyName}>{clientData?.name || (quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : 'Client non spécifié')}</Text>
              <Text>{clientData?.address || quote.clients?.address || 'Adresse non renseignée'}</Text>
              <Text>{clientData?.city || quote.clients?.city || 'Ville non renseignée'}</Text>
              {clientData?.phone && <Text>Téléphone : {clientData.phone}</Text>}
              {clientData?.email && <Text>E-mail : {clientData.email}</Text>}
            </View>
          </View>
        </View>

        {/* Tableau des articles par défaut */}
        <View style={defaultStyles.table}>
          <View style={{ backgroundColor: '#404348', flexDirection: 'row', padding: 6 }}>
            <Text style={[{ color: 'white', fontSize: 9, fontWeight: 'bold' }, { flex: 3 }]}>Description</Text>
            <Text style={[{ color: 'white', fontSize: 9, fontWeight: 'bold' }, { flex: 1, textAlign: 'center' }]}>Quantité</Text>
            <Text style={[{ color: 'white', fontSize: 9, fontWeight: 'bold' }, { flex: 1, textAlign: 'center' }]}>Remise</Text>
            <Text style={[{ color: 'white', fontSize: 9, fontWeight: 'bold' }, { flex: 1, textAlign: 'center' }]}>Coût unitaire</Text>
            <Text style={[{ color: 'white', fontSize: 9, fontWeight: 'bold' }, { flex: 1, textAlign: 'center' }]}>TVA</Text>
            <Text style={[{ color: 'white', fontSize: 9, fontWeight: 'bold' }, { flex: 1, textAlign: 'center' }]}>Total HT</Text>
          </View>
          
          {(clientData?.items || []).length > 0 ? (clientData?.items || []).map((item: any, index: number) => (
            <View key={index} style={{ flexDirection: 'row', padding: 6 }}>
              <Text style={[{ fontSize: 9 }, { flex: 3 }]}>{item.description || 'N/A'}</Text>
              <Text style={[{ fontSize: 9 }, { flex: 1, textAlign: 'center' }]}>{item.quantity?.toString().replace('.', ',') || '0'}</Text>
              <Text style={[{ fontSize: 9 }, { flex: 1, textAlign: 'center' }]}>{item.discount || 0}%</Text>
              <Text style={[{ fontSize: 9 }, { flex: 1, textAlign: 'center' }]}>{item.unitPrice?.toFixed(2).replace('.', ',') || '0,00'}€</Text>
              <Text style={[{ fontSize: 9 }, { flex: 1, textAlign: 'center' }]}>{item.vat || 20}%</Text>
              <Text style={[{ fontSize: 9 }, { flex: 1, textAlign: 'center' }]}>{item.totalHT?.toFixed(2).replace('.', ',') || '0,00'}€</Text>
            </View>
          )) : (
            <View style={{ flexDirection: 'row', padding: 6 }}>
              <Text style={[{ fontSize: 9 }, { flex: 6, textAlign: 'center' }]}>
                Aucun article dans ce devis
              </Text>
            </View>
          )}
        </View>

        {/* Totaux par défaut */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
          <View style={{ width: 200 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, fontWeight: 'bold', paddingVertical: 2 }}>
              <Text>Sous-total</Text>
              <Text>{clientData?.totals?.subtotal || formatCurrency(subtotalHT)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, fontSize: 9, paddingVertical: 2 }}>
              <Text>TVA</Text>
              <Text>{clientData?.totals?.vat || formatCurrency(totalTVA)}</Text>
            </View>
            <View style={{ backgroundColor: '#2563eb', color: 'white', padding: 8, flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 11, marginTop: 5 }}>
              <Text>TOTAL</Text>
              <Text>{clientData?.totals?.total || formatCurrency(totalTTC)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 3 }}>Notes:</Text>
            <Text style={{ fontSize: 9 }}>{quote.notes}</Text>
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