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
    borderTop: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
});

// Styles pour le template alternatif
const alternativeStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 40,
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
    borderLeft: 4,
    borderLeftColor: '#ff6b35',
  },
  companySection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  logoSection: {
    width: 80,
    marginRight: 20,
  },
  companyDetails: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  companyInfo: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.3,
  },
  quoteInfo: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quoteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quoteDetailItem: {
    fontSize: 10,
  },
  clientCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    borderLeft: 3,
    borderLeftColor: '#ff6b35',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 3,
  },
  clientInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 8,
    fontSize: 8,
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'center' },
  col5: { flex: 1, textAlign: 'right' },
  totalsCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    width: 250,
  },
  totalLabel: {
    fontSize: 10,
    flex: 1,
    textAlign: 'right',
    paddingRight: 15,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6b35',
    borderTop: 1,
    borderTopColor: '#ccc',
    paddingTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  notes: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
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
          {/* Header avec informations de l'entreprise */}
          <View style={alternativeStyles.header}>
            <View style={alternativeStyles.companySection}>
              <View style={alternativeStyles.logoSection}>
                {companyData?.logo_url && (
                  <Image src={companyData.logo_url} style={defaultStyles.logo} />
                )}
              </View>
              <View style={alternativeStyles.companyDetails}>
                <Text style={alternativeStyles.companyName}>
                  {companyData?.name || 'KARROSSERIE'}
                </Text>
                <Text style={alternativeStyles.companyInfo}>
                  {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''}
                  {'\n'}SIRET: {companyData?.siret || ''} - N° TVA: {companyData?.tva || ''}
                  {'\n'}Tel: {companyData?.phone || ''} - Email: {companyData?.email || ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Informations du devis */}
          <View style={alternativeStyles.quoteInfo}>
            <Text style={alternativeStyles.quoteTitle}>DEVIS N° {quote.reference}</Text>
            <View style={alternativeStyles.quoteDetails}>
              <Text style={alternativeStyles.quoteDetailItem}>
                Date: {formatDate(quote.created_at)}
              </Text>
              <Text style={alternativeStyles.quoteDetailItem}>
                Validité: {quote.valid_until ? formatDate(quote.valid_until) : 'Non définie'}
              </Text>
            </View>
          </View>

          {/* Informations client */}
          <View style={alternativeStyles.clientCard}>
            <Text style={alternativeStyles.sectionTitle}>Informations client</Text>
            <Text style={alternativeStyles.clientInfo}>
              {clientData?.clientName || (quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : '')}
            </Text>
            <Text style={alternativeStyles.clientInfo}>
              {clientData?.address || quote.clients?.address || ''}
            </Text>
            <Text style={alternativeStyles.clientInfo}>
              {clientData?.postalCode || quote.clients?.postal_code || ''} {clientData?.city || quote.clients?.city || ''}
            </Text>
          </View>

          {/* Informations véhicule */}
          {(quote.vehicles || vehicleData) && (
            <View style={alternativeStyles.clientCard}>
              <Text style={alternativeStyles.sectionTitle}>Véhicule</Text>
              <Text style={alternativeStyles.clientInfo}>
                {vehicleData?.vehicle || (quote.vehicles ? `${quote.vehicles.car_brands?.name || ''} ${quote.vehicles.car_models?.name || ''}` : '')}
              </Text>
              <Text style={alternativeStyles.clientInfo}>
                Immatriculation: {vehicleData?.licensePlate || quote.vehicles?.license_plate || ''}
              </Text>
              {quote.vehicles?.mileage && (
                <Text style={alternativeStyles.clientInfo}>
                  Kilométrage: {quote.vehicles.mileage.toLocaleString()} km
                </Text>
              )}
            </View>
          )}

          {/* Tableau des réparations */}
          {repairs.length > 0 && (
            <View style={alternativeStyles.table}>
              <View style={alternativeStyles.tableHeader}>
                <Text style={alternativeStyles.col1}>Réparations</Text>
                <Text style={alternativeStyles.col2}>Qté</Text>
                <Text style={alternativeStyles.col3}>Prix unit.</Text>
                <Text style={alternativeStyles.col4}>TVA</Text>
                <Text style={alternativeStyles.col5}>Total</Text>
              </View>
              {repairs.map((repair: any, index: number) => (
                <View key={index} style={alternativeStyles.tableRow}>
                  <Text style={alternativeStyles.col1}>{repair.description}</Text>
                  <Text style={alternativeStyles.col2}>{repair.quantity}</Text>
                  <Text style={alternativeStyles.col3}>{formatCurrency(repair.unitCost)}</Text>
                  <Text style={alternativeStyles.col4}>{repair.vat}%</Text>
                  <Text style={alternativeStyles.col5}>{formatCurrency(calculateItemTotal(repair))}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tableau des pièces */}
          {parts.length > 0 && (
            <View style={alternativeStyles.table}>
              <View style={alternativeStyles.tableHeader}>
                <Text style={alternativeStyles.col1}>Pièces</Text>
                <Text style={alternativeStyles.col2}>Qté</Text>
                <Text style={alternativeStyles.col3}>Prix unit.</Text>
                <Text style={alternativeStyles.col4}>TVA</Text>
                <Text style={alternativeStyles.col5}>Total</Text>
              </View>
              {parts.map((part: any, index: number) => (
                <View key={index} style={alternativeStyles.tableRow}>
                  <Text style={alternativeStyles.col1}>{part.description}</Text>
                  <Text style={alternativeStyles.col2}>{part.quantity}</Text>
                  <Text style={alternativeStyles.col3}>{formatCurrency(part.unitCost)}</Text>
                  <Text style={alternativeStyles.col4}>{part.vat}%</Text>
                  <Text style={alternativeStyles.col5}>{formatCurrency(calculateItemTotal(part))}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Totaux */}
          <View style={alternativeStyles.totalsCard}>
            <View style={alternativeStyles.totalRow}>
              <Text style={alternativeStyles.totalLabel}>Sous-total HT:</Text>
              <Text style={alternativeStyles.totalValue}>{formatCurrency(subtotalHT)}</Text>
            </View>
            <View style={alternativeStyles.totalRow}>
              <Text style={alternativeStyles.totalLabel}>TVA:</Text>
              <Text style={alternativeStyles.totalValue}>{formatCurrency(totalTVA)}</Text>
            </View>
            <View style={alternativeStyles.totalRow}>
              <Text style={[alternativeStyles.totalLabel, alternativeStyles.grandTotal]}>Total TTC:</Text>
              <Text style={[alternativeStyles.totalValue, alternativeStyles.grandTotal]}>{formatCurrency(totalTTC)}</Text>
            </View>
          </View>

          {/* Notes */}
          {quote.notes && (
            <View style={alternativeStyles.notes}>
              <Text style={alternativeStyles.sectionTitle}>Notes</Text>
              <Text style={alternativeStyles.clientInfo}>{quote.notes}</Text>
            </View>
          )}

          {/* Footer */}
          <Text style={alternativeStyles.footer} fixed>
            {companyData?.name || 'AUTO PAINT'} - {companyData?.address || '25 rue sainte victoire'} {companyData?.zipcode || '13006'} {companyData?.city || 'MARSEILLE'} - 
            SIRET {companyData?.siret || '123456789000'} - N° TVA : {companyData?.tva || 'FR123456789'} - 
            Tel : {companyData?.phone || '+33064646524'} - Email : {companyData?.email || 'autopaint@yopmail.com'}
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