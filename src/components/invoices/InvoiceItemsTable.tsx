import React from 'react';
import { InvoiceItem, formatAmount } from '@/utils/invoiceCalculations';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

const InvoiceItemsTable = ({ items }: InvoiceItemsTableProps) => {
  return (
    <div className="mb-6">
      <table className="w-full bg-white">
        <thead>
          <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
            <th className="p-3 text-left text-sm font-medium">Article</th>
            <th className="p-3 text-center text-sm font-medium">Quantité</th>
            <th className="p-3 text-center text-sm font-medium">Coût Unitaire</th>
            <th className="p-3 text-center text-sm font-medium">Remise</th>
            <th className="p-3 text-center text-sm font-medium">TVA</th>
            <th className="p-3 text-center text-sm font-medium">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((item, index) => {
            const itemTotal = (item.quantity || 0) * (item.unitCost || 0);
            const discountAmount = itemTotal * (item.discount || 0) / 100;
            const itemTotalHT = itemTotal - discountAmount;
            
            return (
              <tr key={item.id || index} className="bg-transparent">
                <td className="p-3 text-sm">{item.label || item.description || 'N/A'}</td>
                <td className="p-3 text-sm text-center">{(item.quantity || 0).toString().replace('.', ',')}</td>
                <td className="p-3 text-sm text-center">{formatAmount(item.unitCost || 0)}</td>
                <td className="p-3 text-sm text-center">{item.discount || 0}%</td>
                <td className="p-3 text-sm text-center">{item.vat || 20}%</td>
                <td className="p-3 text-sm text-center font-medium">{formatAmount(itemTotalHT)}</td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500">
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