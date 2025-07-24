
import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Car, Users, FileText, ArrowRight, Zap, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useVehicles } from '@/hooks/use-vehicles';

const MobileHomePage = () => {
  console.log('MobileHomePage: Component rendering');
  
  const { dashboardStats } = useDashboardData();
  const { vehicles } = useVehicles();

  const quickActions = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Prendre une photo",
      color: "bg-blue-500",
      path: "/camera"
    },
    // {
    //   icon: <Bot className="h-6 w-6" />,
    //   title: "Assistant IA",
    //   description: "Gestion automatique",
    //   color: "bg-gradient-to-br from-blue-500 to-purple-600",
    //   path: "/ai-assistant"
    // },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Véhicules",
      color: "bg-karrosserie-orange",
      path: "/vehicles"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Clients",
      color: "bg-green-600",
      path: "/clients"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Documents",
      color: "bg-purple-600",
      path: "/documents"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
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
              <div className="text-2xl font-bold text-karrosserie-orange mb-1">
                {vehicles?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Véhicules</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {vehicles?.filter(v => v.status === 'En cours').length || 0}
              </div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {vehicles?.filter(v => v.status === 'Terminé').length || 0}
              </div>
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
        
        {/* Bouton principal remonté */}
        <div className="mb-8">
          <Link to="/documents/expertise">
            <Button className="w-full h-12 bg-karrosserie-orange text-white hover:bg-karrosserie-orange/90 font-medium transition-all duration-300">
              <FileText className="h-4 w-4 mr-2" />
              Charger un rapport d&apos;expertise
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <Button 
                variant="outline" 
                className="flex-col h-20 p-2 w-full text-sm hover:shadow-sm transition-shadow"
              >
                <div className="mb-2">
                  {React.cloneElement(action.icon, { className: "h-6 w-6" })}
                </div>
                <span className="leading-tight text-center">{action.title}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Bouton accès complet */}
        <div className="space-y-4">
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
