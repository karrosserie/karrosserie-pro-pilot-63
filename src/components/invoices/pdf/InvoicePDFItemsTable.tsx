import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { InvoiceItem, formatAmount } from '@/utils/invoiceCalculations';
import { pdfStyles } from './styles';

interface InvoicePDFItemsTableProps {
  items: InvoiceItem[];
}

const InvoicePDFItemsTable = ({ items }: InvoicePDFItemsTableProps) => {
  return (
    <View style={pdfStyles.table}>
      <View style={pdfStyles.tableHeader}>
        <Text style={[pdfStyles.tableHeaderText, { flex: 3 }]}>Article</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Quantité</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Coût Unitaire</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Remise</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TVA</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total HT</Text>
      </View>
      
      {items.length > 0 ? items.map((item, index) => {
        const itemTotal = (item.quantity || 0) * (item.unitCost || 0);
        const discountAmount = itemTotal * (item.discount || 0) / 100;
        const itemTotalHT = itemTotal - discountAmount;
        
        return (
          <View key={item.id || index} style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 3 }]}>{item.label || item.description || 'N/A'}</Text>
            <Text style={[pdfStyles.tableCellRight, { flex: 1 }]}>{(item.quantity || 0).toString().replace('.', ',')}</Text>
            <Text style={[pdfStyles.tableCellRight, { flex: 1 }]}>{formatAmount(item.unitCost || 0)}</Text>
            <Text style={[pdfStyles.tableCellRight, { flex: 1 }]}>{item.discount || 0}%</Text>
            <Text style={[pdfStyles.tableCellRight, { flex: 1 }]}>{item.vat || 20}%</Text>
            <Text style={[pdfStyles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>{formatAmount(itemTotalHT)}</Text>
          </View>
        );
      }) : (
        <View style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableCell, { flex: 6, textAlign: 'center' }]}>
            Aucun article dans cette facture
          </Text>
        </View>
      )}
    </View>
  );
};

export default InvoicePDFItemsTable;