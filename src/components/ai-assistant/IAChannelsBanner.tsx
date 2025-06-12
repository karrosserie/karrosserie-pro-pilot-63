
import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, FileText, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import IAChannelDetailModal from './IAChannelDetailModal';

const IAChannelsBanner = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const channels = [
    {
      name: 'Appels',
      status: 'active',
      description: 'IA en réception + transcription',
      count: '4 appels traités',
      icon: Phone,
      color: 'green'
    },
    {
      name: 'SMS',
      status: 'active',
      description: 'IA auto-réponse + relance',
      count: '7 messages',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      name: 'WhatsApp',
      status: 'active',
      description: 'Relance client / photo sinistre',
      count: '5 échanges',
      icon: MessageSquare,
      color: 'green'
    },
    {
      name: 'Emails',
      status: 'active',
      description: 'Analyse + tri automatique',
      count: '12 emails',
      icon: Mail,
      color: 'purple'
    },
    {
      name: 'Courrier simple',
      status: 'warning',
      description: 'Scan IA + génération réponse',
      count: '2 lettres',
      icon: FileText,
      color: 'orange'
    },
    {
      name: 'Recommandé',
      status: 'alert',
      description: 'Génération automatique + signature manuelle',
      count: '1 RAR envoyé',
      icon: Send,
      color: 'red'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'warning': return '🟠';
      case 'alert': return '🔴';
      default: return '⚪';
    }
  };

  const handleChannelClick = (channelName: string) => {
    setSelectedChannel(channelName);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            Canaux Multicanaux IA
            <span className="ml-2 text-sm text-gray-500">L'IA analyse, répond ou escalade si besoin – Zéro stress.</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow h-auto flex flex-col items-start text-left"
                onClick={() => handleChannelClick(channel.name)}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getStatusIcon(channel.status)}</span>
                    <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                  </div>
                  <Badge className={getStatusColor(channel.status)}>
                    {channel.count}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <IAChannelDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        channelName={selectedChannel}
      />
    </>
  );
};

export default IAChannelsBanner;
