import { QuoteRepairItem, QuotePartItem, GlobalTotals } from '../form/types';

const formatEuro = (amount: number): string => {
  return amount.toFixed(2).replace('.', ',') + '€';
};

const padRight = (str: string, length: number): string => {
  return str.length >= length ? str.substring(0, length) : str + ' '.repeat(length - str.length);
};

const padLeft = (str: string, length: number): string => {
  return str.length >= length ? str.substring(0, length) : ' '.repeat(length - str.length) + str;
};

export const formatQuoteTable = (
  repairs: QuoteRepairItem[],
  parts: QuotePartItem[],
  totals: GlobalTotals
): string => {
  const descWidth = 35;
  const qtyWidth = 6;
  const priceWidth = 12;
  const discountWidth = 10;
  const totalWidth = 12;
  
  const separator = '+' + 
    '-'.repeat(descWidth + 2) + '+' +
    '-'.repeat(qtyWidth + 2) + '+' +
    '-'.repeat(priceWidth + 2) + '+' +
    '-'.repeat(discountWidth + 2) + '+' +
    '-'.repeat(totalWidth + 2) + '+';
  
  const headerRow = '| ' + 
    padRight('Description', descWidth) + ' | ' +
    padLeft('Qté', qtyWidth) + ' | ' +
    padLeft('P.U. HT', priceWidth) + ' | ' +
    padLeft('Remise', discountWidth) + ' | ' +
    padLeft('Total HT', totalWidth) + ' |';
  
  let table = separator + '\n' + headerRow + '\n' + separator + '\n';
  
  // Ajouter les réparations
  if (repairs && repairs.length > 0) {
    repairs.forEach(repair => {
      const desc = repair.description.substring(0, descWidth);
      const qty = repair.quantity.toString();
      const unitCost = formatEuro(repair.unitCost);
      const discount = repair.discount > 0 ? `${repair.discount}%` : '-';
      const total = formatEuro(repair.total);
      
      table += '| ' + 
        padRight(desc, descWidth) + ' | ' +
        padLeft(qty, qtyWidth) + ' | ' +
        padLeft(unitCost, priceWidth) + ' | ' +
        padLeft(discount, discountWidth) + ' | ' +
        padLeft(total, totalWidth) + ' |\n';
    });
  }
  
  // Ajouter les pièces
  if (parts && parts.length > 0) {
    parts.forEach(part => {
      const desc = part.description.substring(0, descWidth);
      const qty = part.quantity.toString();
      const unitCost = formatEuro(part.unitCost);
      const discount = part.discount > 0 ? `${part.discount}%` : '-';
      const total = formatEuro(part.total);
      
      table += '| ' + 
        padRight(desc, descWidth) + ' | ' +
        padLeft(qty, qtyWidth) + ' | ' +
        padLeft(unitCost, priceWidth) + ' | ' +
        padLeft(discount, discountWidth) + ' | ' +
        padLeft(total, totalWidth) + ' |\n';
    });
  }
  
  // Si aucune ligne
  if ((!repairs || repairs.length === 0) && (!parts || parts.length === 0)) {
    table += '| ' + 
      padRight('Aucune ligne', descWidth) + ' | ' +
      padLeft('-', qtyWidth) + ' | ' +
      padLeft('-', priceWidth) + ' | ' +
      padLeft('-', discountWidth) + ' | ' +
      padLeft('-', totalWidth) + ' |\n';
  }
  
  // Ajouter les totaux
  table += separator + '\n';
  table += '| ' + 
    padRight('TOTAL HT', descWidth) + ' | ' +
    padLeft('', qtyWidth) + ' | ' +
    padLeft('', priceWidth) + ' | ' +
    padLeft('', discountWidth) + ' | ' +
    padLeft(formatEuro(totals.subTotal), totalWidth) + ' |\n';
  
  table += '| ' + 
    padRight('TVA', descWidth) + ' | ' +
    padLeft('', qtyWidth) + ' | ' +
    padLeft('', priceWidth) + ' | ' +
    padLeft('', discountWidth) + ' | ' +
    padLeft(formatEuro(totals.totalVat), totalWidth) + ' |\n';
  
  if (totals.totalDiscount > 0) {
    table += '| ' + 
      padRight('Remise globale', descWidth) + ' | ' +
      padLeft('', qtyWidth) + ' | ' +
      padLeft('', priceWidth) + ' | ' +
      padLeft('', discountWidth) + ' | ' +
      padLeft('-' + formatEuro(totals.totalDiscount), totalWidth) + ' |\n';
  }
  
  table += '| ' + 
    padRight('TOTAL TTC', descWidth) + ' | ' +
    padLeft('', qtyWidth) + ' | ' +
    padLeft('', priceWidth) + ' | ' +
    padLeft('', discountWidth) + ' | ' +
    padLeft(formatEuro(totals.total), totalWidth) + ' |\n';
  
  table += separator;
  
  return table;
};
