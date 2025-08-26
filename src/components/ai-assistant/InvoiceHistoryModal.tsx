import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { History, MessageSquare, Mail } from 'lucide-react';
import { useInvoiceRelances } from '@/hooks/use-invoice-relances';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  openFromUnreadResponse: boolean;
  getActionIcon: (action: string) => React.ReactNode;
  getActionLabel: (action: string) => string;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  onOpenChange,
  invoice,
  openFromUnreadResponse,
  getActionIcon,
  getActionLabel,
}) => {
  // Debug log pour identifier le problème
  console.log('InvoiceHistoryModal - invoice object:', invoice);
  console.log('InvoiceHistoryModal - invoice.id:', invoice?.id, 'type:', typeof invoice?.id);
  
  const { relances, loading, markResponseAsRead } = useInvoiceRelances(invoice?.uuid);

  useEffect(() => {
    if (isOpen && openFromUnreadResponse && relances.length > 0) {
      // Marquer toutes les réponses non lues comme lues
      relances.forEach(relance => {
        if (relance.client_response && !relance.response_read) {
          markResponseAsRead(relance.id);
        }
      });
    }
  }, [isOpen, openFromUnreadResponse, relances, markResponseAsRead]);

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Historique des relances - {invoice.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de la facture */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Informations de la facture</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Client:</span>
                <p className="font-medium">{invoice.client}</p>
              </div>
              <div>
                <span className="text-gray-600">Montant:</span>
                <p className="font-medium text-orange-600">{invoice.amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Échéance:</span>
                <p className="font-medium">{invoice.dueDate}</p>
              </div>
              <div>
                <span className="text-gray-600">Statut:</span>
                <Badge className={invoice.relanceTypeColor}>
                  {invoice.relanceType}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timeline des relances */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Historique chronologique des relances</h3>
            {loading ? (
              <div className="text-center py-4">
                <span className="text-sm text-gray-500">Chargement de l'historique...</span>
              </div>
            ) : relances.length === 0 ? (
              <div className="text-center py-4">
                <span className="text-sm text-gray-500">Aucune relance envoyée pour cette facture</span>
              </div>
            ) : (
              <div className="relative">
                {/* Ligne de timeline */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {relances.map((relance, index) => (
                  <div key={relance.id} className="relative flex items-start space-x-4 pb-6">
                    {/* Icône de timeline */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                      {getActionIcon(relance.channel)}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {getActionLabel(relance.channel)}
                          </h4>
                          <Badge 
                            className={`text-xs ${
                              relance.status === 'envoye' ? 'bg-blue-100 text-blue-800' :
                              relance.status === 'recu' ? 'bg-green-100 text-green-800' :
                              relance.status === 'repondu' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {relance.status}
                          </Badge>
                          {relance.client_response && !relance.response_read && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Nouvelle réponse
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {relance.sent_at ? new Date(relance.sent_at).toLocaleDateString('fr-FR') : 
                           new Date(relance.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      {relance.subject && (
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          <strong>Objet:</strong> {relance.subject}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-700 mb-2">{relance.message}</p>
                      
                      <div className="text-xs text-gray-500 mb-2">
                        <strong>Client:</strong> {relance.clients?.first_name} {relance.clients?.last_name}
                      </div>

                      {/* Réponse du client */}
                      {relance.client_response && (
                        <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Réponse du client:</span>
                          </div>
                          <p className="text-sm text-green-700">{relance.client_response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Statistiques des relances</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total relances:</span>
                <p className="font-bold text-blue-900">{relances.length}</p>
              </div>
              <div>
                <span className="text-blue-700">Emails envoyés:</span>
                <p className="font-bold text-blue-900">
                  {relances.filter(r => r.channel === 'email').length}
                </p>
              </div>
              <div>
                <span className="text-blue-700">SMS envoyés:</span>
                <p className="font-bold text-blue-900">
                  {relances.filter(r => r.channel === 'sms').length}
                </p>
              </div>
              <div>
                <span className="text-blue-700">Réponses reçues:</span>
                <p className="font-bold text-blue-900">
                  {relances.filter(r => r.client_response).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};