
export const calculateOrderAmount = (order: any) => {
  console.log('=== CALCULATING ORDER AMOUNT ===');
  console.log('Order ID:', order.id);
  console.log('Order notes:', order.notes);
  let totalAmount = 0;
  
  // Parse notes to get repair data
  let notesData = null;
  if (order.notes) {
    try {
      notesData = typeof order.notes === 'string' ? JSON.parse(order.notes) : order.notes;
      console.log('Parsed notes data:', notesData);
    } catch (error) {
      console.error('Error parsing notes data:', error);
      return 0;
    }
  } else {
    console.log('No notes found in order');
  }

  // Calculer le total des réparations
  if (notesData?.repairs) {
    try {
      const repairs = notesData.repairs;
      
      if (Array.isArray(repairs)) {
        repairs.forEach((repair: any) => {
          const unitPrice = Number(repair.unitCost || repair.unit_price || repair.unitPrice || 0);
          const quantity = Number(repair.quantity || 0);
          const discount = Number(repair.discount || 0);
          const vat = Number(repair.vat || 0);
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          const afterDiscount = subtotal - discountAmount;
          const vatAmount = afterDiscount * (vat / 100);
          totalAmount += afterDiscount + vatAmount;
        });
      }
    } catch (error) {
      console.error('Error calculating repairs total:', error);
    }
  }

  // Calculer le total des pièces
  if (notesData?.parts) {
    try {
      const parts = notesData.parts;
      
      if (Array.isArray(parts)) {
        parts.forEach((part: any) => {
          const unitPrice = Number(part.unitCost || part.unit_price || part.unitPrice || 0);
          const quantity = Number(part.quantity || 0);
          const discount = Number(part.discount || 0);
          const vat = Number(part.vat || 0);
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          const afterDiscount = subtotal - discountAmount;
          const vatAmount = afterDiscount * (vat / 100);
          totalAmount += afterDiscount + vatAmount;
        });
      }
    } catch (error) {
      console.error('Error calculating parts total:', error);
    }
  }

  // Appliquer les remises globales
  if (notesData?.discounts) {
    try {
      const discounts = notesData.discounts;
      
      if (Array.isArray(discounts)) {
        discounts.forEach((discount: any) => {
          const value = Number(discount.value || discount.amount || 0);
          if (discount.type === 'percentage') {
            totalAmount -= totalAmount * (value / 100);
          } else if (discount.type === 'fixed') {
            totalAmount -= value;
          }
        });
      }
    } catch (error) {
      console.error('Error applying discounts:', error);
    }
  }

  console.log('Final calculated amount:', totalAmount);
  return totalAmount > 0 ? totalAmount : 0;
};

export const formatAmount = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
