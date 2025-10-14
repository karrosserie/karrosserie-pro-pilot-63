import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWelcomeTour } from '@/hooks/tour/useWelcomeTour';
import { WELCOME_FEATURES } from '@/config/welcomeFeatures';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { markWelcomeAsSeen, setCurrentFeature, markFeatureCompleted, completedFeatures } = useWelcomeTour();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleStartTour = (featureId: string) => {
    const feature = WELCOME_FEATURES.find(f => f.id === featureId);
    if (!feature) return;

    // Marquer la bienvenue comme vue
    markWelcomeAsSeen();
    
    // Marquer la fonctionnalité comme effectuée
    markFeatureCompleted(featureId);
    
    // Définir la fonctionnalité en cours
    setCurrentFeature(featureId, 0);
    
    // Pour painting, planning et ai-secretary, ne pas naviguer immédiatement - le modal s'affichera
    if (featureId === 'painting' || featureId === 'planning' || featureId === 'ai-secretary') {
      return;
    }
    
    // Naviguer vers la route de la fonctionnalité
    // Vérifier si c'est une URL externe
    if (feature.route.startsWith('http')) {
      window.open(feature.route, '_blank');
    } else {
      navigate(feature.route);
    }
  };

  const handleSkipWelcome = () => {
    markWelcomeAsSeen();
    navigate('/');
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header avec bouton skip */}
        <div className="flex justify-end mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSkipWelcome}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Passer
          </Button>
        </div>

        {/* Message de bienvenue */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Bienvenue sur la nouvelle application,{' '}
            <span className="text-primary">
              {profile?.first_name || 'Utilisateur'}
            </span> !
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Découvrez toutes les nouveautés et améliorations que nous avons préparées pour vous. 
            Explorez chaque fonctionnalité à votre rythme avec notre tour guidé interactif.
          </p>

          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setSelectedFeature(WELCOME_FEATURES[0].id)}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Découvrir les nouvelles fonctionnalités
          </Button>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WELCOME_FEATURES.map((feature) => {
            const isCompleted = completedFeatures.includes(feature.id);
            
            return (
              <Card 
                key={feature.id}
                className={`hover:shadow-lg transition-all cursor-pointer relative ${
                  selectedFeature === feature.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedFeature(feature.id)}
              >
                {isCompleted && (
                  <Badge className="absolute top-3 right-3 bg-green-500">
                    ✓ Vu
                  </Badge>
                )}
                
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {getIcon(feature.icon)}
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button
                    className="w-full"
                    variant={selectedFeature === feature.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTour(feature.id);
                    }}
                  >
                    Découvrir
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>
            Vous pourrez toujours accéder à ce guide depuis le menu d'aide
          </p>
        </div>
      </div>
    </div>
  );
}
