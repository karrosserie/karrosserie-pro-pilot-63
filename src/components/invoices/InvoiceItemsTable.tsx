import React from 'react';
import { InvoiceItem, formatAmount } from '@/utils/invoiceCalculations';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  tableRowClasses?: string;
  tableHeaderClasses?: string;
}

const InvoiceItemsTable = ({ items, tableRowClasses = "", tableHeaderClasses = "border-b" }: InvoiceItemsTableProps) => {
  return (
    <div className="mb-6">
      <table className="w-full bg-white text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className={`text-white ${tableHeaderClasses}`}>
            <th className="p-3 text-left font-medium">Réf</th>
            <th className="p-3 text-left font-medium">Description</th>
            <th className="p-3 text-center font-medium">Quantité</th>
            <th className="p-3 text-center font-medium">Remise</th>
            <th className="p-3 text-center font-medium">Prix HT</th>
            <th className="p-3 text-center font-medium">TVA</th>
            <th className="p-3 text-center font-medium">Total HT</th>
            <th className="p-3 text-center font-medium">Total TTC</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((item, index) => {
            const itemTotal = (item.quantity || 0) * (item.unitCost || 0);
            const discountAmount = itemTotal * (item.discount || 0) / 100;
            const itemTotalHT = itemTotal - discountAmount;
            const vatAmount = itemTotalHT * (item.vat || 20) / 100;
            const itemTotalTTC = itemTotalHT + vatAmount;
            
            return (
              <tr key={item.id || index} className={`bg-transparent ${tableRowClasses}`}>
                <td className="p-3"></td>
                <td className="p-3">{item.label || item.description || 'N/A'}</td>
                <td className="p-3 text-center">{(item.quantity || 0).toString().replace('.', ',')}</td>
                <td className="p-3 text-center">{item.discount || 0}%</td>
                <td className="p-3 text-center">{formatAmount(item.unitCost || 0)}</td>
                <td className="p-3 text-center">{item.vat || 20}%</td>
                <td className="p-3 text-center">{formatAmount(itemTotalHT)}</td>
                <td className="p-3 text-center">{formatAmount(itemTotalTTC)}</td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={8} className="p-6 text-center text-gray-500">
                Aucun article dans cette facture
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;