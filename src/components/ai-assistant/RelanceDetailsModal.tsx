import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, Mail, MessageCircle, MessageSquare, FileText, Mic, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useClientRelances, ClientRelance } from '@/hooks/use-client-relances';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RelanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelKey: string;
}

const RelanceDetailsModal: React.FC<RelanceDetailsModalProps> = ({
  isOpen,
  onClose,
  channelName,
  channelKey
}) => {
  const { relances, updateRelanceStatus } = useClientRelances();

  // Filtrer les relances par canal
  const channelRelances = relances.filter(relance => relance.channel === channelKey);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'phone': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'email': return <Mail className="h-4 w-4 text-green-600" />;
      case 'sms': return <MessageCircle className="h-4 w-4 text-purple-600" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'vms': return <Mic className="h-4 w-4 text-indigo-600" />;
      case 'courrier': return <FileText className="h-4 w-4 text-orange-600" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: ClientRelance['status']) => {
    switch (status) {
      case 'en_attente': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'en_cours': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'envoye': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'recu': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'repondu': return <CheckCircle className="h-4 w-4 text-green-700" />;
      case 'echec': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'annule': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: ClientRelance['status']) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'envoye': return 'bg-green-100 text-green-800';
      case 'recu': return 'bg-green-100 text-green-800';
      case 'repondu': return 'bg-green-100 text-green-800';
      case 'echec': return 'bg-red-100 text-red-800';
      case 'annule': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToneColor = (tone: ClientRelance['tone']) => {
    switch (tone) {
      case 'amical': return 'bg-green-100 text-green-800';
      case 'ferme': return 'bg-orange-100 text-orange-800';
      case 'serieux': return 'bg-yellow-100 text-yellow-800';
      case 'menacant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ClientRelance['status']) => {
    const labels = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'envoye': 'Envoyé',
      'recu': 'Reçu',
      'repondu': 'Répondu',
      'echec': 'Échec',
      'annule': 'Annulé'
    };
    return labels[status] || status;
  };

  const getToneLabel = (tone: ClientRelance['tone']) => {
    const labels = {
      'amical': 'Amical',
      'ferme': 'Ferme',
      'serieux': 'Sérieux',
      'menacant': 'Menaçant'
    };
    return labels[tone] || tone;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChannelIcon(channelKey)}
            Détails des relances - {channelName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {channelRelances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune relance trouvée pour ce canal</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {channelRelances.length} relance{channelRelances.length > 1 ? 's' : ''} trouvée{channelRelances.length > 1 ? 's' : ''}
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Ton</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelRelances.map((relance) => (
                    <TableRow key={relance.id}>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(relance.created_at), 'dd/MM/yyyy', { locale: fr })}
                          <div className="text-xs text-gray-500">
                            {format(new Date(relance.created_at), 'HH:mm', { locale: fr })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {relance.clients 
                            ? `${relance.clients.first_name} ${relance.clients.last_name}`
                            : `Client #${relance.client_id.slice(-8)}`
                          }
                        </div>
                        {(relance.channel === 'sms' || relance.channel === 'vms') && relance.clients?.phone && (
                          <div className="text-xs text-blue-600 font-mono">{relance.clients.phone}</div>
                        )}
                        {relance.invoice_id && (
                          <div className="text-xs text-gray-500">Facture #{relance.invoice_id.slice(-8)}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(relance.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(relance.status)}
                          {getStatusLabel(relance.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getToneColor(relance.tone)}>
                          {getToneLabel(relance.tone)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {relance.cycle_day && `J+${relance.cycle_day}`}
                          {relance.step_number && (
                            <div className="text-xs text-gray-500">Étape {relance.step_number}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate" title={relance.subject || relance.message}>
                          {relance.subject || relance.message || '-'}
                        </div>
                        {relance.objective && (
                          <div className="text-xs text-gray-500 max-w-xs truncate" title={relance.objective}>
                            {relance.objective}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {relance.status === 'en_attente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRelanceStatus(relance.id, 'en_cours')}
                            >
                              Démarrer
                            </Button>
                          )}
                          {relance.status === 'en_cours' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRelanceStatus(relance.id, 'envoye')}
                            >
                              Marquer envoyé
                            </Button>
                          )}
                          {relance.status === 'envoye' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRelanceStatus(relance.id, 'recu')}
                            >
                              Marquer reçu
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelanceDetailsModal;