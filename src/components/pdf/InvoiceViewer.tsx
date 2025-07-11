import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './invoice/InvoicePDF';
import { mockInvoiceData } from './invoice/invoiceData';

const InvoiceViewer = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Facture PDF</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Cliquez sur le bouton ci-dessous pour télécharger la facture en PDF
            </p>
            
            <PDFDownloadLink
              document={<InvoicePDF invoice={mockInvoiceData} />}
              fileName="facture-geoffrey-moya.pdf"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Génération du PDF...' : 'Télécharger la facture PDF'
              }
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InvoicePDF } from './invoice/InvoicePDF';
export default InvoiceViewer;