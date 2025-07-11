import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatAmount } from '@/utils/invoiceCalculations';
import { pdfStyles } from './styles';

interface InvoicePDFTotalsProps {
  subtotalAfterDiscount: number;
  totalVAT: number;
  finalTotal: number;
}

const InvoicePDFTotals = ({ subtotalAfterDiscount, totalVAT, finalTotal }: InvoicePDFTotalsProps) => {
  return (
    <View style={pdfStyles.totalsSection}>
      <View style={pdfStyles.totalsBox}>
        <View style={pdfStyles.totalRowBold}>
          <Text>Sous-total</Text>
          <Text>{formatAmount(subtotalAfterDiscount)}</Text>
        </View>
        <View style={pdfStyles.totalRow}>
          <Text>TVA</Text>
          <Text>{formatAmount(totalVAT)}</Text>
        </View>
        <View style={pdfStyles.finalTotal}>
          <Text>TOTAL</Text>
          <Text>{formatAmount(finalTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

export default InvoicePDFTotals;