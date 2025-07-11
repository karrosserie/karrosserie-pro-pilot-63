import React from 'react';
import { InvoiceItem, formatAmount } from '@/utils/invoiceCalculations';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

const InvoiceItemsTable = ({ items }: InvoiceItemsTableProps) => {
  return (
    <div className="mb-6">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left text-sm font-medium">Article</th>
            <th className="border border-gray-300 p-3 text-center text-sm font-medium">Quantité</th>
            <th className="border border-gray-300 p-3 text-center text-sm font-medium">Coût Unitaire</th>
            <th className="border border-gray-300 p-3 text-center text-sm font-medium">Remise</th>
            <th className="border border-gray-300 p-3 text-center text-sm font-medium">TVA</th>
            <th className="border border-gray-300 p-3 text-center text-sm font-medium">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((item, index) => {
            const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
            const discountAmount = itemTotal * (item.discount || 0) / 100;
            const itemTotalHT = itemTotal - discountAmount;
            
            return (
              <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 text-sm">{item.label || item.description || 'N/A'}</td>
                <td className="border border-gray-300 p-3 text-sm text-center">{(item.quantity || 0).toString().replace('.', ',')}</td>
                <td className="border border-gray-300 p-3 text-sm text-center">{formatAmount(item.unitPrice || 0)}</td>
                <td className="border border-gray-300 p-3 text-sm text-center">{item.discount || 0}%</td>
                <td className="border border-gray-300 p-3 text-sm text-center">{item.vat || 20}%</td>
                <td className="border border-gray-300 p-3 text-sm text-center font-medium">{formatAmount(itemTotalHT)}</td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={6} className="border border-gray-300 p-6 text-center text-gray-500">
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