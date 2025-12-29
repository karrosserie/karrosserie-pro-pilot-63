import React from 'react';

interface RepairOrderMobileItemCardProps {
  item: {
    ref?: string;
    description?: string;
    quantity?: number;
    discount?: number;
    unitPrice?: number;
    vat?: number;
    totalHT?: number;
    totalTTC?: number;
  };
}

const RepairOrderMobileItemCard = ({ item }: RepairOrderMobileItemCardProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      {/* Description en titre */}
      <p className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
        {item.description || 'Sans description'}
      </p>
      
      {/* Grid 2x2 pour les détails */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Qté:</span>
          <span className="font-medium">{item.quantity ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">P.U.:</span>
          <span className="font-medium">{item.unitPrice?.toFixed(2).replace('.', ',') ?? '0,00'}€</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Remise:</span>
          <span className="font-medium">{item.discount ?? 0}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">TVA:</span>
          <span className="font-medium">{item.vat ?? 20}%</span>
        </div>
      </div>
      
      {/* Totaux */}
      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 text-xs">
        <div>
          <span className="text-gray-500">Total HT: </span>
          <span className="font-semibold">{item.totalHT?.toFixed(2).replace('.', ',') ?? '0,00'}€</span>
        </div>
        <div>
          <span className="text-gray-500">TTC: </span>
          <span className="font-bold text-gray-900">{item.totalTTC?.toFixed(2).replace('.', ',') ?? '0,00'}€</span>
        </div>
      </div>
    </div>
  );
};

export default RepairOrderMobileItemCard;
