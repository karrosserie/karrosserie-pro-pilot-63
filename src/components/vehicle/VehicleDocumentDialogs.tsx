
import React from 'react';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';

interface VehicleDocumentDialogsProps {
  // Quote dialog props
  quoteDialogOpen: boolean;
  setQuoteDialogOpen: (open: boolean) => void;
  
  // Invoice dialog props
  invoiceDialogOpen: boolean;
  setInvoiceDialogOpen: (open: boolean) => void;
  
  // Selected vehicle
  selectedVehicleForDocument: any | null;
  setSelectedVehicleForDocument: (vehicle: any | null) => void;
}

const VehicleDocumentDialogs: React.FC<VehicleDocumentDialogsProps> = ({
  quoteDialogOpen,
  setQuoteDialogOpen,
  invoiceDialogOpen,
  setInvoiceDialogOpen,
  selectedVehicleForDocument,
  setSelectedVehicleForDocument
}) => {
  return (
    <>
      {/* Dialogue de création de devis */}
      <QuoteDialog
        open={quoteDialogOpen}
        onOpenChange={(open) => {
          console.log('Quote dialog open state changing to:', open);
          setQuoteDialogOpen(open);
          if (!open) {
            setSelectedVehicleForDocument(null);
          }
        }}
        quote={null}
        prefillData={selectedVehicleForDocument ? {
          client_id: selectedVehicleForDocument.client_id,
          vehicle_id: selectedVehicleForDocument.id,
          clients: selectedVehicleForDocument.clients ? {
            id: selectedVehicleForDocument.clients.id || selectedVehicleForDocument.client_id,
            first_name: selectedVehicleForDocument.clients.first_name,
            last_name: selectedVehicleForDocument.clients.last_name
          } : null,
          vehicles: {
            id: selectedVehicleForDocument.id,
            license_plate: selectedVehicleForDocument.license_plate,
            car_brands: selectedVehicleForDocument.car_brands,
            car_models: selectedVehicleForDocument.car_models
          }
        } : null}
      />

      {/* Dialogue de création de facture */}
      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={(open) => {
          console.log('Invoice dialog open state changing to:', open);
          setInvoiceDialogOpen(open);
          if (!open) {
            setSelectedVehicleForDocument(null);
          }
        }}
        invoice={selectedVehicleForDocument ? {
          client_id: selectedVehicleForDocument.client_id,
          vehicle_id: selectedVehicleForDocument.id,
          clients: selectedVehicleForDocument.clients ? {
            id: selectedVehicleForDocument.clients.id || selectedVehicleForDocument.client_id,
            first_name: selectedVehicleForDocument.clients.first_name,
            last_name: selectedVehicleForDocument.clients.last_name
          } : null,
          vehicles: {
            id: selectedVehicleForDocument.id,
            license_plate: selectedVehicleForDocument.license_plate,
            car_brands: selectedVehicleForDocument.car_brands,
            car_models: selectedVehicleForDocument.car_models
          }
        } as any : null}
      />
    </>
  );
};

export default VehicleDocumentDialogs;
