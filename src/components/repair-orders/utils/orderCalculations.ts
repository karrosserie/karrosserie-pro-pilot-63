
export const calculateOrderAmount = (order: any) => {
  console.log('=== CALCULATING ORDER AMOUNT ===');
  console.log('Order ID:', order.id);
  let totalAmount = 0;
  
  // Calculer le total des réparations depuis repairs_data
  if (order.repairs_data) {
    try {
      const repairsData = typeof order.repairs_data === 'string' ? JSON.parse(order.repairs_data) : order.repairs_data;
      console.log('Repairs data:', repairsData);
      
      if (Array.isArray(repairsData)) {
        repairsData.forEach((repair: any) => {
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

  // Calculer le total des pièces depuis parts_data
  if (order.parts_data) {
    try {
      const partsData = typeof order.parts_data === 'string' ? JSON.parse(order.parts_data) : order.parts_data;
      console.log('Parts data:', partsData);
      
      if (Array.isArray(partsData)) {
        partsData.forEach((part: any) => {
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

  // Appliquer les remises globales depuis discounts_data
  if (order.discounts_data) {
    try {
      const discountsData = typeof order.discounts_data === 'string' ? JSON.parse(order.discounts_data) : order.discounts_data;
      console.log('Discounts data:', discountsData);
      
      if (Array.isArray(discountsData)) {
        discountsData.forEach((discount: any) => {
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
