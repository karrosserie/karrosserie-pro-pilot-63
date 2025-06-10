
export const calculateOrderAmount = (order: any) => {
  let totalAmount = 0;

  // Calculer le total des réparations
  if (order.repairs_data) {
    try {
      const repairs = typeof order.repairs_data === 'string' 
        ? JSON.parse(order.repairs_data) 
        : order.repairs_data;
      
      if (Array.isArray(repairs)) {
        repairs.forEach((repair: any) => {
          const unitPrice = Number(repair.unitPrice || repair.unit_price || repair.unitCost || 0);
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
      console.error('Error parsing repairs_data:', error);
    }
  }

  // Calculer le total des pièces
  if (order.parts_data) {
    try {
      const parts = typeof order.parts_data === 'string' 
        ? JSON.parse(order.parts_data) 
        : order.parts_data;
      
      if (Array.isArray(parts)) {
        parts.forEach((part: any) => {
          const unitPrice = Number(part.unitPrice || part.unit_price || part.unitCost || 0);
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
      console.error('Error parsing parts_data:', error);
    }
  }

  // Appliquer les remises globales
  if (order.discounts_data) {
    try {
      const discounts = typeof order.discounts_data === 'string' 
        ? JSON.parse(order.discounts_data) 
        : order.discounts_data;
      
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
      console.error('Error parsing discounts_data:', error);
    }
  }

  return totalAmount > 0 ? totalAmount : 0;
};

export const formatAmount = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
