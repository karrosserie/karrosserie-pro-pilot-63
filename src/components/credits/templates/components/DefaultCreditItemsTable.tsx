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

interface DefaultCreditItemsTableProps {
  items: Item[];
}

const DefaultCreditItemsTable = ({ items }: DefaultCreditItemsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm md:text-base bg-white border-collapse">
        <thead>
          <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
            <th className="p-1.5 sm:p-2 md:p-3 text-left font-medium">Description</th>
            <th className="p-1.5 sm:p-2 md:p-3 text-center font-medium">Qté</th>
            <th className="p-1.5 sm:p-2 md:p-3 text-center font-medium hidden sm:table-cell">Remise</th>
            <th className="p-1.5 sm:p-2 md:p-3 text-center font-medium hidden sm:table-cell">P.U.</th>
            <th className="p-1.5 sm:p-2 md:p-3 text-center font-medium hidden sm:table-cell">TVA</th>
            <th className="p-1.5 sm:p-2 md:p-3 text-center font-medium">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="p-1.5 sm:p-2 md:p-3">{item.description}</td>
              <td className="p-1.5 sm:p-2 md:p-3 text-center">{item.quantity}</td>
              <td className="p-1.5 sm:p-2 md:p-3 text-center hidden sm:table-cell">{item.discount}%</td>
              <td className="p-1.5 sm:p-2 md:p-3 text-center hidden sm:table-cell">{item.unitPrice?.toFixed(2).replace('.', ',')}€</td>
              <td className="p-1.5 sm:p-2 md:p-3 text-center hidden sm:table-cell">{item.vat}%</td>
              <td className="p-1.5 sm:p-2 md:p-3 text-center">{item.totalHT?.toFixed(2).replace('.', ',')}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefaultCreditItemsTable;