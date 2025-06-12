
import React, { useState } from 'react';
import { Bot, Mic, Send, Lightbulb, Clock, TrendingUp, X, Minimize2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: () => void }>;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
}

interface AIContextualPanelProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

const AIContextualPanel: React.FC<AIContextualPanelProps> = ({ 
  isMinimized, 
  onToggleMinimize, 
  onClose 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Bonjour ! J\'ai détecté 3 actions urgentes à traiter. Voulez-vous que je vous aide ?',
      timestamp: new Date(),
      actions: [
        { label: 'Voir les urgences', action: () => console.log('Show urgent tasks') },
        { label: 'Plus tard', action: () => console.log('Dismiss') }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const suggestions: AISuggestion[] = [
    {
      id: '1',
      title: 'Relance F-2023-124',
      description: 'Client Durand Auto - Échéance dépassée de 2 jours',
      priority: 'high',
      action: () => console.log('Send reminder')
    },
    {
      id: '2',
      title: 'Devis automatique',
      description: 'Martin SARL attend une réponse depuis 3h',
      priority: 'medium',
      action: () => console.log('Generate quote')
    },
    {
      id: '3',
      title: 'Appel de suivi',
      description: 'Dubois et Fils - Réparation terminée',
      priority: 'low',
      action: () => console.log('Schedule call')
    }
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

      // Simuler une réponse IA
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Je traite votre demande. Voici ce que je peux faire pour vous...',
          timestamp: new Date(),
          actions: [
            { label: 'Exécuter', action: () => console.log('Execute') },
            { label: 'Modifier', action: () => console.log('Modify') }
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-16 h-16 shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-0 flex items-center justify-center h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            className="w-full h-full"
          >
            <Bot className="h-6 w-6 text-blue-600" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-xl border-2 border-blue-200 bg-white flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Assistant IA</h3>
            <p className="text-xs text-gray-600">Toujours là pour vous</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Suggestions */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Actions suggérées</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${getPriorityColor(suggestion.priority)}`}
                onClick={suggestion.action}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-xs opacity-80">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.actions && (
                  <div className="mt-2 space-x-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex space-x-2">
            <Input
              placeholder="Demandez-moi n'importe quoi..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? 'bg-red-100 text-red-600' : ''}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIContextualPanel;
