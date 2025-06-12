
import React, { useState } from 'react';
import { Eye, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import IntelligentStatusBadge from '@/components/shared/IntelligentStatusBadge';
import IATimelineModal from './IATimelineModal';

interface PaymentItem {
  invoice: string;
  client: string;
  project: string;
  amount: string;
  dueDate: string;
  relanceLevel: number;
  channelsUsed: string[];
  nextAction: string;
  daysRemaining: number;
  timeline: any[];
}

const IAPaymentTracking = () => {
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const paymentData: PaymentItem[] = [
    {
      invoice: 'F-2023-124',
      client: 'Durand Auto',
      project: 'RENAULT MEGANE',
      amount: '2 450,75 €',
      dueDate: '10/04/2025',
      relanceLevel: 1,
      channelsUsed: ['SMS', 'Courrier'],
      nextAction: 'J-7 (19/05)',
      daysRemaining: 7,
      timeline: [
        { date: '08/05', action: 'SMS envoyé', type: 'sms' },
        { date: '09/05', action: 'Courrier généré', type: 'letter' }
      ]
    },
    {
      invoice: 'F-2023-122',
      client: 'Martin SARL',
      project: 'PEUGEOT 308',
      amount: '3 825,50 €',
      dueDate: '05/04/2025',
      relanceLevel: 2,
      channelsUsed: ['SMS', 'Email'],
      nextAction: 'J-5 (17/05)',
      daysRemaining: 5,
      timeline: [
        { date: '06/05', action: 'Email de relance envoyé', type: 'email' },
        { date: '08/05', action: 'SMS de suivi', type: 'sms' }
      ]
    },
    {
      invoice: 'F-2023-120',
      client: 'Dubois et Fils',
      project: 'CITROEN C3',
      amount: '6 120,25 €',
      dueDate: '28/03/2025',
      relanceLevel: 3,
      channelsUsed: ['SMS', 'Email', 'Courrier'],
      nextAction: 'J-1 (12/05)',
      daysRemaining: 1,
      timeline: [
        { date: '01/05', action: 'Premier rappel SMS', type: 'sms' },
        { date: '05/05', action: 'Email de relance', type: 'email' },
        { date: '10/05', action: 'Courrier officiel', type: 'letter' }
      ]
    },
    {
      invoice: 'F-2023-118',
      client: 'Garage Central',
      project: 'BMW X3',
      amount: '4 250,00 €',
      dueDate: '15/03/2025',
      relanceLevel: 4,
      channelsUsed: ['SMS', 'Courrier', 'RAR'],
      nextAction: 'Aujourd\'hui',
      daysRemaining: 0,
      timeline: [
        { date: '15/04', action: 'Première relance SMS', type: 'sms' },
        { date: '25/04', action: 'Courrier de mise en demeure', type: 'letter' },
        { date: '05/05', action: 'RAR envoyé', type: 'registered' }
      ]
    },
    {
      invoice: 'F-2023-116',
      client: 'Auto Express',
      project: 'AUDI A4',
      amount: '5 780,50 €',
      dueDate: '01/03/2025',
      relanceLevel: 5,
      channelsUsed: ['SMS', 'Email', 'Courrier', 'RAR'],
      nextAction: 'Escalade judiciaire',
      daysRemaining: -10,
      timeline: [
        { date: '10/03', action: 'Relances multiples', type: 'multiple' },
        { date: '01/04', action: 'Mise en demeure RAR', type: 'registered' },
        { date: '15/04', action: 'Dossier contentieux préparé', type: 'legal' }
      ]
    }
  ];

  const getRelanceStatusType = (level: number) => {
    switch (level) {
      case 1: return 'relance1';
      case 2: return 'relance2';
      case 3: return 'relance3';
      case 4: return 'contentieux';
      case 5: return 'judiciaire';
      default: return 'attente';
    }
  };

  const getDaysRemainingBadge = (days: number) => {
    if (days > 5) return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
    if (days > 0) return { color: 'bg-orange-100 text-orange-800', icon: Clock };
    return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
  };

  const getChannelBadge = (channel: string) => {
    const configs: { [key: string]: string } = {
      'SMS': '💬',
      'Email': '✉️',
      'Courrier': '📬',
      'RAR': '📮'
    };
    return configs[channel] || '📄';
  };

  const handleDetailClick = (item: PaymentItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📊 Tableau Secrétariat IA - Suivi des impayés</span>
            <Badge className="bg-green-100 text-green-800">
              IA activée. Vous pouvez respirer.
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Relance IA</TableHead>
                  <TableHead>Canaux utilisés</TableHead>
                  <TableHead>Prochaine action</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentData.map((item, index) => {
                  const daysBadge = getDaysRemainingBadge(item.daysRemaining);
                  const IconComponent = daysBadge.icon;
                  
                  return (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.invoice}</TableCell>
                      <TableCell>{item.client}</TableCell>
                      <TableCell>{item.project}</TableCell>
                      <TableCell className="font-semibold">{item.amount}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell>
                        <IntelligentStatusBadge 
                          status={getRelanceStatusType(item.relanceLevel) as any}
                          showAnimation={true}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.channelsUsed.map((channel, idx) => (
                            <span key={idx} className="text-lg" title={channel}>
                              {getChannelBadge(channel)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={daysBadge.color}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {item.nextAction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDetailClick(item)}
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          🔍 Détail IA
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">L'IA gère. Vous réparez. 🔧</p>
                <p className="text-sm text-gray-600">+3h gagnées cette semaine – grâce à vos relances automatisées</p>
              </div>
              <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 shadow-md hover:shadow-lg transition-all">
                ⚡ Activer relance IA en cascade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <IATimelineModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </>
  );
};

export default IAPaymentTracking;
