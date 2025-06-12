
import React from 'react';
import { X, MessageSquare, Mail, FileText, Send, Gavel, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TimelineItem {
  date: string;
  action: string;
  type: 'sms' | 'email' | 'letter' | 'registered' | 'legal' | 'multiple';
}

interface PaymentItem {
  invoice: string;
  client: string;
  project: string;
  amount: string;
  timeline: TimelineItem[];
}

interface IATimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentItem | null;
}

const IATimelineModal: React.FC<IATimelineModalProps> = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'sms': return { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'email': return { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'letter': return { icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'registered': return { icon: Send, color: 'text-red-600', bg: 'bg-red-50' };
      case 'legal': return { icon: Gavel, color: 'text-gray-600', bg: 'bg-gray-50' };
      case 'multiple': return { icon: Users, color: 'text-green-600', bg: 'bg-green-50' };
      default: return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>🤖 Timeline IA - {item.invoice}</span>
            <Badge className="bg-green-100 text-green-800">Géré par votre assistant IA</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Informations client</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Client :</span>
                <p className="font-medium">{item.client}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Projet :</span>
                <p className="font-medium">{item.project}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Montant :</span>
                <p className="font-medium text-karrosserie-orange">{item.amount}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Historique des actions IA</h3>
            <div className="space-y-3">
              {item.timeline.map((timelineItem, index) => {
                const iconConfig = getTimelineIcon(timelineItem.type);
                const IconComponent = iconConfig.icon;
                
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white border">
                    <div className={`p-2 rounded-full ${iconConfig.bg}`}>
                      <IconComponent className={`h-4 w-4 ${iconConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{timelineItem.action}</p>
                        <span className="text-sm text-gray-500">{timelineItem.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Action automatique générée par l'IA</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-karrosserie-orange/10 to-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Actions disponibles</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                📤 Réémettre relance
              </Button>
              <Button variant="outline" size="sm">
                📞 Programmer appel IA
              </Button>
              <Button variant="outline" size="sm">
                📮 Générer RAR
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                ⚠️ Passer en contentieux
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              💡 L'IA peut générer automatiquement tous ces documents. Vous validez et signez.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
            📄 Télécharger PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IATimelineModal;
