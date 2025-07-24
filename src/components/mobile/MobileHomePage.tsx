
import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Car, Users, FileText, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MobileHomePage = () => {
  console.log('MobileHomePage: Component rendering');

  const quickActions = [
    // {
    //   icon: <Bot className="h-6 w-6" />,
    //   title: "Assistant IA",
    //   description: "Gestion automatique",
    //   color: "bg-gradient-to-br from-blue-500 to-purple-600",
    //   path: "/ai-assistant"
    // },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Véhicules",
      description: "Suivi réparations",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      path: "/vehicles"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Clients",
      description: "Gestion clientèle",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      path: "/clients"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Documents",
      description: "Devis & Factures",
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      path: "/documents"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 bg-gradient-to-br from-orange-50 to-orange-100/30">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold text-karrosserie-orange">
              Karrosserie
            </span>
            <span className="text-3xl font-bold text-foreground ml-2">
              Pro
            </span>
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            Votre atelier, digitalisé
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-karrosserie-orange" />
            <span>Rapide • Simple • Efficace</span>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-karrosserie-orange mb-1">12</div>
              <div className="text-xs text-muted-foreground">Véhicules</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">8</div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">4</div>
              <div className="text-xs text-muted-foreground">Terminés</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex-1 px-6">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          Accès rapide
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <Card className="border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 h-32 bg-card">
                <CardContent className="p-0 h-full">
                  <div className={`${action.color} h-full rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-center">
                      <div className="mb-2">
                        {action.icon}
                      </div>
                      <div className="font-semibold text-sm mb-1">
                        {action.title}
                      </div>
                      <div className="text-xs opacity-90">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bouton principal */}
        <div className="space-y-4">
          <Link to="/documents/expertise">
            <Button className="w-full h-14 bg-gradient-to-r from-karrosserie-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
              <FileText className="h-6 w-6 mr-3" />
              Charger un rapport d&apos;expertise
              <ArrowRight className="h-5 w-5 ml-3" />
            </Button>
          </Link>

          <Link to="/vehicles">
            <Button variant="outline" className="w-full h-12 border-2 border-border hover:border-karrosserie-orange hover:bg-orange-50 font-medium text-muted-foreground hover:text-karrosserie-orange transition-all duration-300">
              Accéder à l&apos;application complète
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 Karrosserie Pro • Version Mobile
        </p>
      </div>
    </div>
  );
};

export default MobileHomePage;
