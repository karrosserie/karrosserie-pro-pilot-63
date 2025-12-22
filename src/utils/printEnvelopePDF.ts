import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import EnvelopePDF from '@/components/invoices/pdf/EnvelopePDF';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

export const printEnvelopePDF = async (
  invoice: Invoice,
  companyData: any,
  clientData?: any
) => {
  try {
    // Préparer les données client
    const formattedClientData = clientData ? {
      name: getClientDisplayName(clientData),
      address: clientData.address || '',
      city: clientData.city || '',
      postal_code: clientData.postal_code || ''
    } : {
      name: '',
      address: '',
      city: '',
      postal_code: ''
    };

    // Créer le document PDF enveloppe
    const doc = React.createElement(EnvelopePDF, { 
      companyData, 
      clientData: formattedClientData,
      invoiceReference: invoice.reference 
    }) as React.ReactElement;
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob);
    
    // Ouvrir le PDF dans un nouvel onglet pour impression
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erreur lors de la génération de l\'enveloppe:', error);
    return { success: false, error: error.message };
  }
};
