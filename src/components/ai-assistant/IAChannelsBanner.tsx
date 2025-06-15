
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, FileText, Settings } from 'lucide-react';

const IAChannelsBanner = () => {
  const channels = [
    {
      icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'Téléphone',
      status: 'Actif',
      count: 3,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'Email',
      status: 'Actif',
      count: 12,
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'SMS',
      status: 'Actif',
      count: 5,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'Courrier',
      status: 'Configuré',
      count: 0,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <Card className="bg-white border-blue-200">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Canaux de Communication IA</h2>
            <p className="text-sm text-gray-600 mt-1">Gestion automatisée des interactions clients</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Configurer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {channels.map((channel, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {channel.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{channel.name}</p>
                  <Badge className={`${channel.color} text-xs mt-1`}>
                    {channel.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{channel.count}</p>
                <p className="text-xs text-gray-500">en cours</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IAChannelsBanner;
