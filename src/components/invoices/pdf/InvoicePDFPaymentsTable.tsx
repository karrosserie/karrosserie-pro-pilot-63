import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { pdfStyles } from './styles';

interface InvoicePDFPaymentsTableProps {
  payments: any[];
  totalPaidAmount: number;
  remainingAmount: number;
}

const InvoicePDFPaymentsTable = ({ payments, totalPaidAmount, remainingAmount }: InvoicePDFPaymentsTableProps) => {
  if (payments.length === 0) return null;

  return (
    <View style={pdfStyles.paymentTable}>
      <Text style={pdfStyles.sectionTitle}>Liste des paiements</Text>
      <View style={pdfStyles.tableHeader}>
        <Text style={[pdfStyles.tableHeaderText, { flex: 2 }]}>Date</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 2 }]}>Mode de paiement</Text>
        <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Montant</Text>
      </View>
      
      {payments.map((payment, index) => (
        <View key={payment.id} style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableCell, { flex: 2 }]}>
            {payment.created_at ? format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: fr }) : '-'}
          </Text>
          <Text style={[pdfStyles.tableCell, { flex: 2 }]}>{payment.payment_method_name || payment.payment_method || '-'}</Text>
          <Text style={[pdfStyles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>
            {formatAmount(payment.amount || 0)}
          </Text>
        </View>
      ))}
      
      <View style={pdfStyles.tableRow}>
        <Text style={[pdfStyles.tableCellRight, { flex: 4, fontWeight: 'bold' }]}>
          Total encaissé :
        </Text>
        <Text style={[pdfStyles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>
          {formatAmount(totalPaidAmount)}
        </Text>
      </View>
      <View style={pdfStyles.tableRow}>
        <Text style={[pdfStyles.tableCellRight, { flex: 4, fontWeight: 'bold', color: '#dc2626' }]}>
          Solde restant :
        </Text>
        <Text style={[pdfStyles.tableCellRight, { flex: 1, fontWeight: 'bold', color: '#dc2626' }]}>
          {formatAmount(remainingAmount)}
        </Text>
      </View>
    </View>
  );
};

export default InvoicePDFPaymentsTable;