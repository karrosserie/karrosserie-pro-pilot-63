
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Bot, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const AISecretaryPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: 'Bonjour ! Je suis votre assistant IA pour la gestion des paiements. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: '10:30'
    },
    {
      id: '2',
      type: 'user',
      content: 'Peux-tu me faire un résumé des paiements en retard ?',
      timestamp: '10:32'
    },
    {
      id: '3',
      type: 'ai',
      content: 'Vous avez actuellement 3 paiements en retard pour un montant total de €4,025. Je peux envoyer des rappels automatiques si vous le souhaitez.',
      timestamp: '10:32'
    }
  ]);

  const tasks = [
    {
      id: '1',
      title: 'Relance client Pierre Durand',
      description: 'Paiement en retard de 5 jours',
      status: 'En cours',
      priority: 'Haute'
    },
    {
      id: '2',
      title: 'Génération rapport mensuel',
      description: 'Rapport des paiements de janvier 2024',
      status: 'Terminé',
      priority: 'Normale'
    },
    {
      id: '3',
      title: 'Mise à jour statuts paiements',
      description: 'Synchronisation avec la banque',
      status: 'En attente',
      priority: 'Normale'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: message,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: 'Je traite votre demande. Veuillez patienter quelques instants...',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Normale':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chat with AI */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-karrosserie-orange" />
            Chat avec l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages */}
            <div className="h-64 overflow-y-auto space-y-3 border border-gray-100 rounded-lg p-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-karrosserie-orange' : 'bg-gray-200'}`}>
                      {msg.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-karrosserie-orange text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Tapez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Tasks */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-karrosserie-orange" />
            Tâches automatisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex gap-2">
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {task.status === 'Terminé' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {task.status === 'En cours' && <Clock className="h-5 w-5 text-blue-500" />}
                    {task.status === 'En attente' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  </div>
                </div>
              </div>
            ))}
            
            <Button className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90">
              Créer une nouvelle tâche
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISecretaryPanel;
