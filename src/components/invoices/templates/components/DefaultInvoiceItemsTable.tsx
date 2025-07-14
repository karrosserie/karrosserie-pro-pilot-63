import React from 'react';

interface Item {
  ref?: string;
  description?: string;
  quantity?: number;
  discount?: number;
  unitPrice?: number;
  vat?: number;
  totalHT?: number;
  totalTTC?: number;
}

interface DefaultInvoiceItemsTableProps {
  items: Item[];
}

const DefaultInvoiceItemsTable = ({ items }: DefaultInvoiceItemsTableProps) => {
  return (
    <div className="mt-6">
      <table className="w-full text-base bg-white border-collapse">
        <thead>
          <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
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
          {items.map((item, index) => (
            <tr key={index}>
              <td className="p-3">{item.ref}</td>
              <td className="p-3">{item.description}</td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-center">{item.discount}%</td>
              <td className="p-3 text-center">{item.unitPrice?.toFixed(2).replace('.', ',')}€</td>
              <td className="p-3 text-center">{item.vat}%</td>
              <td className="p-3 text-center">{item.totalHT?.toFixed(2).replace('.', ',')}€</td>
              <td className="p-3 text-center">{item.totalTTC?.toFixed(2).replace('.', ',')}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefaultInvoiceItemsTable;