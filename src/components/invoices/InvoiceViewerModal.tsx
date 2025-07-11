import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/services/supabase/invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewerModal = ({ invoice, open, onOpenChange }: InvoiceViewerModalProps) => {
  if (!invoice) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calcul des montants à partir des données stockées
  const repairsData = Array.isArray(invoice.repairs_data) ? invoice.repairs_data : 
    (typeof invoice.repairs_data === 'string' ? JSON.parse(invoice.repairs_data || '[]') : []);
  const partsData = Array.isArray(invoice.parts_data) ? invoice.parts_data : 
    (typeof invoice.parts_data === 'string' ? JSON.parse(invoice.parts_data || '[]') : []);
  const discountsData = Array.isArray(invoice.discounts_data) ? invoice.discounts_data : 
    (typeof invoice.discounts_data === 'string' ? JSON.parse(invoice.discounts_data || '[]') : []);
  
  const allItems = [...repairsData, ...partsData];
  const subtotal = allItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  const totalDiscount = allItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + (itemTotal * (item.discount || 0) / 100);
  }, 0);
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const totalVAT = allItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    const itemAfterDiscount = itemTotal - (itemTotal * (item.discount || 0) / 100);
    return sum + (itemAfterDiscount * (item.vat || 20) / 100);
  }, 0);
  const finalTotal = subtotalAfterDiscount + totalVAT;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-white">
          {/* Header sans fond noir */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne 1 - Informations entreprise */}
              <div>
                <div>
                  <h1 className="text-2xl font-bold text-white px-4 py-2 rounded" style={{backgroundColor: 'rgba(64,67,72,255)'}}>FACTURE</h1>
                  <div className="bg-orange-500 rounded-full p-3 w-fit mt-2">
                    <span className="text-white font-bold text-xl">KR</span>
                  </div>
                  <p className="text-gray-600 mt-2">KARROSSERIE</p>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Votre adresse</p>
                    <p>Téléphone : +33 1 23 45 67 89</p>
                    <p>E-mail : contact@karrosserie.fr</p>
                    <p>SIRET : 123 456 789 00123</p>
                    <p>N° de TVA : FR 12 123456789</p>
                  </div>
                </div>
              </div>

              {/* Colonne 2 - Détails de la facture */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Détails de la facture</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-medium w-32">Facture</span>
                    <span>N° {invoice.reference}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Date facturation</span>
                    <span>{formatDate(invoice.created_at)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Date d'échéance</span>
                    <span>{formatDate(invoice.due_date)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Véhicule</span>
                    <span>
                      {invoice.vehicles ? 
                        `${invoice.vehicles.car_brands?.name || 'N/A'} ${invoice.vehicles.car_models?.name || 'N/A'}` : 
                        'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Immatriculation</span>
                    <span>{invoice.vehicles?.license_plate || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">N° de sinistre</span>
                    <span>{invoice.claim_number || 'N/A'}</span>
                  </div>
                </div>
                
                {/* Encadré Montant dû */}
                <div className="bg-blue-600 text-white p-4 rounded-lg text-center mt-4">
                  <p className="text-sm mb-1">Montant dû:</p>
                  <p className="text-2xl font-bold">{formatAmount(finalTotal)}</p>
                </div>
              </div>

              {/* Colonne 3 - Facture pour */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Facture pour</h3>
                <div className="text-sm mb-4">
                  <p className="font-medium">{invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'N/A'}</p>
                  <p>Adresse du client disponible</p>
                  <p>dans les données client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Corps de la facture */}
          <div className="p-6">
            {/* Le contenu a été déplacé dans le header */}

            {/* Tableau des articles */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left text-sm font-medium">Article</th>
                    <th className="border border-gray-300 p-3 text-center text-sm font-medium">Quantité</th>
                    <th className="border border-gray-300 p-3 text-center text-sm font-medium">Coût Unitaire</th>
                    <th className="border border-gray-300 p-3 text-center text-sm font-medium">Remise</th>
                    <th className="border border-gray-300 p-3 text-center text-sm font-medium">TVA</th>
                    <th className="border border-gray-300 p-3 text-center text-sm font-medium">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.length > 0 ? allItems.map((item, index) => {
                    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
                    const discountAmount = itemTotal * (item.discount || 0) / 100;
                    const itemTotalHT = itemTotal - discountAmount;
                    
                    return (
                      <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-3 text-sm">{item.label || item.description || 'N/A'}</td>
                        <td className="border border-gray-300 p-3 text-sm text-center">{item.quantity || 0}</td>
                        <td className="border border-gray-300 p-3 text-sm text-center">{formatAmount(item.unitPrice || 0)}</td>
                        <td className="border border-gray-300 p-3 text-sm text-center">{item.discount || 0}%</td>
                        <td className="border border-gray-300 p-3 text-sm text-center">{item.vat || 20}%</td>
                        <td className="border border-gray-300 p-3 text-sm text-center font-medium">{formatAmount(itemTotalHT)}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="border border-gray-300 p-6 text-center text-gray-500">
                        Aucun article dans cette facture
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatAmount(subtotalAfterDiscount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA</span>
                    <span>{formatAmount(totalVAT)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remise</span>
                    <span className="text-red-600">-{formatAmount(totalDiscount)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between bg-blue-600 text-white p-3 rounded font-bold">
                      <span>TOTAL</span>
                      <span>{formatAmount(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
              <p>Les factures émises par KARROSSERIE sont basées sur les informations disponibles au moment de leur établissement.</p>
              <p>Toute modification des conditions pourra entraîner le règlement intégral.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewerModal;