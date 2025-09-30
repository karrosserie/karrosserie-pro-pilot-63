import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Settings, AlertTriangle, Calendar } from 'lucide-react';

interface ProcessStep {
  id: string;
  name: string;
  types: {
    name: string;
    description: string;
    duration: string;
    color: string;
  }[];
}

export const ProcessConfig = () => {
  const [activeTab, setActiveTab] = useState('accueil');

  const processSteps: ProcessStep[] = [
    {
      id: 'accueil',
      name: 'ACCUEIL & PRÉPARATION DU DOSSIER',
      types: [
        {
          name: 'Sinistre simple (rayure, petite bosse)',
          description: 'Devis rapide, photos basiques',
          duration: '30-45 min',
          color: 'text-blue-600'
        },
        {
          name: 'Sinistre moyen (plusieurs éléments)',
          description: 'Devis détaillé, multiples photos, recherche pièces',
          duration: '45-75 min',
          color: 'text-blue-600'
        },
        {
          name: 'Gros sinistre (structure touchée)',
          description: 'Expertise approfondie, mesures, déjantement complet',
          duration: '1-2 heures',
          color: 'text-blue-600'
        },
        {
          name: 'Véhicule de luxe/collection',
          description: 'Déshabillage spécialisé, photos détaillées, recherche pièces spécifiques',
          duration: '1-3 heures',
          color: 'text-blue-600'
        }
      ]
    },
    {
      id: 'remplacement',
      name: 'REMPLACEMENT OU DÉBOSSELAGE',
      types: [
        {
          name: 'Débosselage simple',
          description: 'Petites bosses, rayures superficielles',
          duration: '1-2 heures',
          color: 'text-orange-600'
        },
        {
          name: 'Remplacement éléments',
          description: 'Pare-chocs, ailes, portières',
          duration: '2-4 heures',
          color: 'text-orange-600'
        },
        {
          name: 'Travaux structure',
          description: 'Réparation châssis, marbre',
          duration: '4-8 heures',
          color: 'text-orange-600'
        }
      ]
    },
    {
      id: 'controle',
      name: 'CONTRÔLE TECHNIQUE DE SÉCURITÉ',
      types: [
        {
          name: 'Contrôle standard',
          description: 'Vérification sécurité, géométrie',
          duration: '1-2 heures',
          color: 'text-yellow-600'
        },
        {
          name: 'Contrôle approfondi',
          description: 'Contrôle complet après structure',
          duration: '2-3 heures',
          color: 'text-yellow-600'
        }
      ]
    },
    {
      id: 'preparation',
      name: 'PRÉPARATION PEINTURE',
      types: [
        {
          name: 'Préparation standard',
          description: 'Ponçage, apprêt, masquage',
          duration: '2-4 heures',
          color: 'text-purple-600'
        },
        {
          name: 'Préparation complexe',
          description: 'Mastic, apprêts multiples',
          duration: '4-6 heures',
          color: 'text-purple-600'
        }
      ]
    },
    {
      id: 'peinture',
      name: 'MISE EN PEINTURE',
      types: [
        {
          name: 'Peinture éléments',
          description: 'Application base, vernis',
          duration: '3-5 heures',
          color: 'text-green-600'
        },
        {
          name: 'Peinture complète',
          description: 'Véhicule entier, raccords',
          duration: '8-12 heures',
          color: 'text-green-600'
        }
      ]
    },
    {
      id: 'finitions',
      name: 'FINITIONS & REMONTAGE',
      types: [
        {
          name: 'Remontage standard',
          description: 'Pose éléments, réglages',
          duration: '2-4 heures',
          color: 'text-indigo-600'
        },
        {
          name: 'Finitions luxe',
          description: 'Polissage, contrôles qualité',
          duration: '3-6 heures',
          color: 'text-indigo-600'
        }
      ]
    },
    {
      id: 'cloture',
      name: 'CLÔTURE & LIVRAISON',
      types: [
        {
          name: 'Contrôle final',
          description: 'Vérifications, nettoyage',
          duration: '1-2 heures',
          color: 'text-slate-600'
        },
        {
          name: 'Livraison client',
          description: 'Présentation, signature',
          duration: '30 min',
          color: 'text-slate-600'
        }
      ]
    }
  ];

  const summaryData = [
    {
      category: 'Micro rayure/retouche',
      totalTime: '2-4 heures',
      calendarDuration: '1 jour'
    },
    {
      category: 'Sinistre léger (pare-chocs, rayures)',
      totalTime: '6-12 heures',
      calendarDuration: '2-3 jours'
    },
    {
      category: 'Sinistre moyen (1-2 éléments)',
      totalTime: '12-20 heures',
      calendarDuration: '2-3 jours'
    },
    {
      category: 'Sinistre important (3+ éléments)',
      totalTime: '20-40 heures',
      calendarDuration: '3-7 jours'
    },
    {
      category: 'Gros sinistre (structure touchée)',
      totalTime: '40-80 heures',
      calendarDuration: '1-3 semaines'
    },
    {
      category: 'Sinistre majeur (reconstruction)',
      totalTime: '80-200 heures',
      calendarDuration: '3-8 semaines'
    }
  ];

  const delayFactors = [
    {
      category: 'Attente pièces',
      delay: '+2-15 jours',
      description: 'Véhicules neufs, constructeur/grossiste',
      color: 'text-orange-600'
    },
    {
      category: 'Pièces sur commande',
      delay: '+3-30 jours',
      description: 'Pièces sur mesure/commande',
      color: 'text-orange-600'
    },
    {
      category: 'Expertise assurance',
      delay: '+1-5 jours',
      description: 'Attente visite expert',
      color: 'text-blue-600'
    },
    {
      category: 'Problèmes découverts',
      delay: '+20-100%',
      description: 'Dégâts cachés révélés',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Process de Réparation</h1>
            <p className="text-slate-600 mt-1">Temps estimés par type d'intervention</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-800">Temps optimisés</Badge>
          <Badge className="bg-blue-100 text-blue-800">Par atelier compétent</Badge>
        </div>
      </div>

      {/* Process Steps Tabs */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <Tabs defaultValue="accueil" className="w-full">
            <TabsList className="grid w-full grid-cols-7 h-auto p-2 bg-slate-50">
              {processSteps.map((step) => (
                <TabsTrigger 
                  key={step.id}
                  value={step.id}
                  className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <span className="text-center leading-tight">{step.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {processSteps.map((step) => (
              <TabsContent key={step.id} value={step.id} className="mt-6">
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <h2 className="text-xl font-bold text-blue-900 mb-4">{step.name}</h2>
                  
                  <div className="space-y-4">
                    {step.types.map((type, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{type.name}</h3>
                            <p className="text-sm text-slate-600">{type.description}</p>
                          </div>
                          <div className={`font-bold text-lg ${type.color} ml-4`}>
                            {type.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardHeader>
      </Card>

      {/* Summary Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Récapitulatif par Type de Sinistre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Catégorie de Sinistre</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Temps Total</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Durée Calendaire</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-slate-900">{row.category}</td>
                    <td className="p-4 font-semibold text-blue-600">{row.totalTime}</td>
                    <td className="p-4 text-slate-600">{row.calendarDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delay Factors */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Facteurs d'Allongement des Délais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {delayFactors.map((factor, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{factor.category}</h3>
                  <div className={`font-bold text-lg ${factor.color}`}>
                    {factor.delay}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};