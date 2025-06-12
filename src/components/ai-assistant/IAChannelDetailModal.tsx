
import React from 'react';
import { X, Phone, MessageSquare, Mail, FileText, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IAChannelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string | null;
}

const IAChannelDetailModal: React.FC<IAChannelDetailModalProps> = ({ isOpen, onClose, channelName }) => {
  if (!channelName) return null;

  const getChannelData = (channel: string) => {
    switch (channel) {
      case 'Appels':
        return {
          icon: Phone,
          color: 'text-green-600',
          data: [
            {
              date: '12/06/2025 14:30',
              client: 'Durand Auto',
              numero: '+33 6 12 34 56 78',
              duree: '3min 45s',
              objet: 'Demande de devis',
              action_ia: 'Transcription + Création devis auto',
              statut: 'Traité',
              suivi: 'Devis envoyé par email'
            },
            {
              date: '12/06/2025 11:15',
              client: 'Martin SARL',
              numero: '+33 6 98 76 54 32',
              duree: '2min 20s',
              objet: 'Suivi réparation',
              action_ia: 'Mise à jour statut + SMS auto',
              statut: 'Traité',
              suivi: 'Client informé par SMS'
            },
            {
              date: '12/06/2025 09:45',
              client: 'Garage Central',
              numero: '+33 6 11 22 33 44',
              duree: '5min 10s',
              objet: 'Réclamation',
              action_ia: 'Escalade vers responsable',
              statut: 'Escaladé',
              suivi: 'Rappel programmé'
            },
            {
              date: '11/06/2025 16:20',
              client: 'Auto Express',
              numero: '+33 6 55 66 77 88',
              duree: '1min 30s',
              objet: 'Prise de RDV',
              action_ia: 'Réservation créneau auto',
              statut: 'Traité',
              suivi: 'RDV confirmé'
            }
          ]
        };
      case 'SMS':
        return {
          icon: MessageSquare,
          color: 'text-blue-600',
          data: [
            {
              date: '12/06/2025 15:45',
              client: 'Dubois et Fils',
              numero: '+33 6 12 34 56 78',
              message: 'Bonjour, mon véhicule est-il prêt ?',
              reponse_ia: 'Bonjour ! Votre véhicule sera prêt demain à 14h. Nous vous confirmerons par SMS.',
              statut: 'Répondu',
              suivi: 'Satisfaction client'
            },
            {
              date: '12/06/2025 13:20',
              client: 'Durand Auto',
              numero: '+33 6 98 76 54 32',
              message: 'Merci pour le devis',
              reponse_ia: 'De rien ! N\'hésitez pas si vous avez des questions. Cordialement.',
              statut: 'Répondu',
              suivi: 'Suivi commercial'
            },
            {
              date: '12/06/2025 10:30',
              client: 'Martin SARL',
              numero: '+33 6 11 22 33 44',
              message: 'Relance facture F-2023-124',
              reponse_ia: 'Nous avons bien noté votre demande. Facture envoyée par email.',
              statut: 'Traité',
              suivi: 'Facture envoyée'
            }
          ]
        };
      case 'WhatsApp':
        return {
          icon: MessageSquare,
          color: 'text-green-600',
          data: [
            {
              date: '12/06/2025 16:00',
              client: 'Garage Central',
              numero: '+33 6 12 34 56 78',
              type: 'Photo sinistre',
              contenu: '📸 Photos reçues + analyse IA',
              action_ia: 'Analyse dégâts + Estimation auto',
              statut: 'Analysé',
              suivi: 'Devis en préparation'
            },
            {
              date: '12/06/2025 14:15',
              client: 'Auto Express',
              numero: '+33 6 98 76 54 32',
              type: 'Relance client',
              contenu: 'Bonjour, avez-vous reçu notre devis ?',
              action_ia: 'Relance automatique programmée',
              statut: 'Envoyé',
              suivi: 'Attente réponse'
            }
          ]
        };
      case 'Emails':
        return {
          icon: Mail,
          color: 'text-purple-600',
          data: [
            {
              date: '12/06/2025 17:30',
              expediteur: 'contact@durandauto.fr',
              objet: 'Demande de devis carrosserie',
              categorie: 'Commercial',
              action_ia: 'Tri automatique + Réponse template',
              priorite: 'Normale',
              statut: 'Traité',
              suivi: 'Devis envoyé'
            },
            {
              date: '12/06/2025 16:45',
              expediteur: 'comptabilite@martingarage.fr',
              objet: 'Facture en retard F-2023-120',
              categorie: 'Comptabilité',
              action_ia: 'Escalade service comptable',
              priorite: 'Urgente',
              statut: 'Escaladé',
              suivi: 'Traitement en cours'
            }
          ]
        };
      case 'Courrier simple':
        return {
          icon: FileText,
          color: 'text-orange-600',
          data: [
            {
              date: '12/06/2025 09:00',
              expediteur: 'Dubois et Fils',
              type: 'Courrier client',
              objet: 'Réclamation qualité réparation',
              scan_ia: 'Texte extrait + Analyse sentiment',
              action_ia: 'Génération réponse + Escalade',
              statut: 'En cours',
              suivi: 'Réponse en rédaction'
            },
            {
              date: '11/06/2025 14:30',
              expediteur: 'Administration fiscale',
              type: 'Courrier officiel',
              objet: 'Contrôle TVA',
              scan_ia: 'Document scanné + Catégorisé',
              action_ia: 'Transfert comptable',
              statut: 'Transféré',
              suivi: 'Traitement comptable'
            }
          ]
        };
      case 'Recommandé':
        return {
          icon: Send,
          color: 'text-red-600',
          data: [
            {
              date: '12/06/2025 10:00',
              destinataire: 'Auto Express',
              objet: 'Mise en demeure - Facture F-2023-116',
              reference_rar: 'RAR123456789',
              action_ia: 'Génération automatique + Signature électronique',
              statut: 'Envoyé',
              suivi: 'Suivi La Poste',
              echeance: '19/06/2025'
            }
          ]
        };
      default:
        return { icon: FileText, color: 'text-gray-600', data: [] };
    }
  };

  const channelData = getChannelData(channelName);
  const IconComponent = channelData.icon;

  const renderTableHeaders = (channel: string) => {
    switch (channel) {
      case 'Appels':
        return (
          <>
            <TableHead>Date/Heure</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Objet</TableHead>
            <TableHead>Action IA</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Suivi</TableHead>
          </>
        );
      case 'SMS':
        return (
          <>
            <TableHead>Date/Heure</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Message reçu</TableHead>
            <TableHead>Réponse IA</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Suivi</TableHead>
          </>
        );
      case 'WhatsApp':
        return (
          <>
            <TableHead>Date/Heure</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contenu</TableHead>
            <TableHead>Action IA</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Suivi</TableHead>
          </>
        );
      case 'Emails':
        return (
          <>
            <TableHead>Date/Heure</TableHead>
            <TableHead>Expéditeur</TableHead>
            <TableHead>Objet</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Action IA</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Suivi</TableHead>
          </>
        );
      case 'Courrier simple':
        return (
          <>
            <TableHead>Date</TableHead>
            <TableHead>Expéditeur</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Objet</TableHead>
            <TableHead>Scan IA</TableHead>
            <TableHead>Action IA</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Suivi</TableHead>
          </>
        );
      case 'Recommandé':
        return (
          <>
            <TableHead>Date</TableHead>
            <TableHead>Destinataire</TableHead>
            <TableHead>Objet</TableHead>
            <TableHead>Référence RAR</TableHead>
            <TableHead>Action IA</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Suivi</TableHead>
            <TableHead>Échéance</TableHead>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = (channel: string, data: any[]) => {
    return data.map((item, index) => (
      <TableRow key={index} className="hover:bg-gray-50">
        {Object.values(item).map((value, cellIndex) => (
          <TableCell key={cellIndex} className="text-sm">
            {cellIndex === Object.values(item).length - 3 && typeof value === 'string' && value.includes('Traité') ? (
              <Badge className="bg-green-100 text-green-800">{value as string}</Badge>
            ) : cellIndex === Object.values(item).length - 3 && typeof value === 'string' && value.includes('Escaladé') ? (
              <Badge className="bg-orange-100 text-orange-800">{value as string}</Badge>
            ) : cellIndex === Object.values(item).length - 3 && typeof value === 'string' && value.includes('En cours') ? (
              <Badge className="bg-blue-100 text-blue-800">{value as string}</Badge>
            ) : (
              value as string
            )}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <IconComponent className={`h-6 w-6 ${channelData.color} mr-3`} />
              <span>📋 Détails du canal : {channelName}</span>
            </div>
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4 mr-2" />
              Fermer l'écran
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-karrosserie-orange/10 to-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              🤖 Canal {channelName} - Gestion IA Automatisée
            </h4>
            <p className="text-sm text-gray-600">
              L'IA traite automatiquement tous les éléments de ce canal. Vous pouvez consulter l'historique complet ci-dessous.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {renderTableHeaders(channelName)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableRows(channelName, channelData.data)}
              </TableBody>
            </Table>
          </div>

          {channelData.data.length === 0 && (
            <div className="text-center py-12">
              <IconComponent className={`mx-auto h-12 w-12 ${channelData.color} opacity-50`} />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun élément traité</h3>
              <p className="mt-1 text-sm text-gray-500">
                L'IA n'a encore rien traité sur ce canal aujourd'hui.
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  📊 Résumé du canal {channelName}
                </p>
                <p className="text-sm text-gray-600">
                  {channelData.data.length} éléments traités • IA active 24h/24
                </p>
              </div>
              <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                📥 Exporter les données
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IAChannelDetailModal;
