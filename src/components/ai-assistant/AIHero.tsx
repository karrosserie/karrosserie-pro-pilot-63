
import React from 'react';
import { Bot, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-karrosserie-orange to-orange-600 rounded-2xl p-8 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
            <span className="text-sm font-medium opacity-90">IA PREMIUM ACTIVÉE</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Votre Assistant IA
              <span className="block text-3xl opacity-90">Karrosserie Pro</span>
            </h1>
            <p className="text-xl opacity-90 mb-6 leading-relaxed">
              Économisez <strong>3h par jour</strong> avec nos automatisations intelligentes. 
              Plus de temps pour votre business, moins de paperasse.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-karrosserie-orange hover:bg-gray-100 font-semibold px-8"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Démarrer maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Voir les gains
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">+47%</div>
              <div className="text-sm opacity-90">Productivité</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">3.2h</div>
              <div className="text-sm opacity-90">Économisées/jour</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHero;
