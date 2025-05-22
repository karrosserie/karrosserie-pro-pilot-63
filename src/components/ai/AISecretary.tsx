
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AISecretary = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Bonjour, je suis votre secrétaire IA pour la comptabilité. Comment puis-je vous aider aujourd\'hui ?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      let responseContent = '';
      
      // Simple pattern matching for common accounting questions
      if (inputValue.toLowerCase().includes('facture')) {
        responseContent = 'Je peux vous aider à gérer vos factures. Vous pouvez créer une nouvelle facture, voir les factures existantes ou rechercher une facture spécifique.';
      } else if (inputValue.toLowerCase().includes('paiement')) {
        responseContent = 'Je peux vous aider à enregistrer un nouveau paiement ou vérifier le statut des paiements existants.';
      } else if (inputValue.toLowerCase().includes('rapport') || inputValue.toLowerCase().includes('bilan')) {
        responseContent = 'Je peux générer différents types de rapports financiers comme un bilan mensuel, trimestriel ou annuel.';
      } else if (inputValue.toLowerCase().includes('dépense')) {
        responseContent = 'Voulez-vous enregistrer une nouvelle dépense ou consulter les dépenses existantes ?';
      } else {
        responseContent = 'Je suis votre assistant comptable. Je peux vous aider avec la gestion des factures, l\'enregistrement des paiements, la création de rapports financiers et le suivi des dépenses.';
      }
      
      const assistantMessage = { role: 'assistant' as const, content: responseContent };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-karrosserie-orange" />
          Secrétaire IA
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto mb-4 p-2 border rounded-md bg-gray-50">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-karrosserie-orange/10 ml-6' 
                  : 'bg-white border mr-6'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="mb-3 p-3 rounded-lg bg-white border mr-6 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <p className="text-sm text-gray-500">En train de répondre...</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez une question sur votre comptabilité..."
            className="flex-1 mr-2 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()} 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 h-full"
            type="submit"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISecretary;
