
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
      <Card className="fixed bottom-4 left-4 w-14 h-14 sm:w-16 sm:h-16 shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 z-50">
        <CardContent className="p-0 flex items-center justify-center h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            className="w-full h-full p-2"
          >
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-[90vw] max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl h-[70vh] sm:h-[600px] shadow-xl border-2 border-blue-200 bg-white flex flex-col z-50">
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center min-w-0 flex-1">
          <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Assistant IA</h3>
            <p className="text-xs text-gray-600 hidden sm:block">Toujours là pour vous</p>
          </div>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onToggleMinimize} className="p-1.5">
            <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5">
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Suggestions */}
        <div className="p-3 sm:p-4 border-b bg-gray-50 overflow-y-auto max-h-[30%]">
          <div className="flex items-center mb-2 sm:mb-3">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Actions suggérées</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-2 sm:p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${getPriorityColor(suggestion.priority)}`}
                onClick={suggestion.action}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-xs sm:text-sm truncate flex-1 mr-2">{suggestion.title}</p>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-xs opacity-80 line-clamp-2">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-xs sm:text-sm break-words">{message.content}</p>
                {message.actions && (
                  <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t bg-gray-50">
          <div className="flex space-x-2">
            <Input
              placeholder="Demandez-moi..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-1.5 sm:p-2 h-8 sm:h-10 w-8 sm:w-10 ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
            >
              <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              className="p-1.5 sm:p-2 h-8 sm:h-10 w-8 sm:w-10"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIContextualPanel;
