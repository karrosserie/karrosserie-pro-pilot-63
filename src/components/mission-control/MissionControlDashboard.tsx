import React from 'react';
import MissionControlHeader from './MissionControlHeader';
import AlertCard from './AlertCard';
import { Eye, Package, Wrench, Calendar } from 'lucide-react';

const MissionControlDashboard = () => {
  const alerts = [
    {
      type: 'critical' as const,
      icon: 'weather' as const,
      title: 'Alerte météo critique',
      description: 'Pluie intense jeudi : 3 chantiers extérieurs impactés',
      impact: 'Risque de retard 2-3 jours sur projets prioritaires',
      suggestion: 'Replanification automatique recommandée - Optimisation par IA',
      metrics: [
        { value: '85', label: 'Probabilité pluie', unit: '%' },
        { value: '3', label: 'Chantiers impactés', unit: '' },
        { value: '48h', label: 'Fenêtre optimale', unit: '' }
      ],
      actions: [
        { label: 'Replanifier maintenant', variant: 'primary' as const },
        { label: 'Voir alternatives', variant: 'outline' as const, icon: <Eye className="h-3 w-3" /> }
      ]
    },
    {
      type: 'critical' as const,
      icon: 'payment' as const,
      title: 'Retard paiement critique',
      subtitle: 'DUPONT SARL - 4 520€ - 1+ 12 sans réponse',
      description: 'Impact trésorerie immédiat - Procédure recommandée',
      impact: 'Impact trésorerie immédiat - Procédure recommandée',
      suggestion: 'Séquence de relance intelligente + escalade automatique',
      metrics: [
        { value: '43', label: 'J. retard encaissement', unit: '%' },
        { value: '12j', label: 'Retard' },
        { value: '3', label: 'Relances ignorées', unit: '' }
      ],
      actions: [
        { label: 'Lancer séquence', variant: 'primary' as const },
        { label: 'Négocier échéances', variant: 'secondary' as const }
      ]
    },
    {
      type: 'critical' as const,
      icon: 'power' as const,
      title: 'Panne électrique urgente',
      subtitle: 'Cabinet médical BERNARD - Système d\'urgence KO',
      description: 'Activité client paralysée - Intervention sous 2h obligatoire',
      impact: 'Activité client paralysée - Intervention sous 2h obligatoire',
      suggestion: 'Équipe urgence disponible - Pièces en stock - Facturation majoration 100%',
      metrics: [
        { value: '2h', label: 'Délai max', unit: '' },
        { value: '100', label: 'Majoration', unit: '%' },
        { value: '1', label: 'Équipe dispo', unit: '' }
      ],
      actions: [
        { label: 'Déclencher intervention', variant: 'primary' as const },
        { label: 'Vérifier stock', variant: 'outline' as const, icon: <Package className="h-3 w-3" /> }
      ]
    },
    {
      type: 'important' as const,
      icon: 'cooling' as const,
      title: 'Clim défaillante restaurant',
      subtitle: 'LA BRASSERIE - système principal en panne - 35°C prévu',
      description: 'Risque fermeture client - Perte CA weekend - Réparation urgente',
      impact: 'Risque fermeture client - Perte CA weekend - Réparation urgente',
      suggestion: 'Compresseur de secours disponible - Intervention ce soir recommandée',
      metrics: [
        { value: '35', label: 'Temp prévue', unit: '°C' },
        { value: '18h', label: 'Fermeture si non réparé' },
        { value: '2800', label: 'CA weekend', unit: '€' }
      ],
      actions: [
        { label: 'Programmer réparation', variant: 'primary' as const },
        { label: 'Solution temporaire', variant: 'secondary' as const }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <MissionControlHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {alerts.map((alert, index) => (
          <AlertCard
            key={index}
            {...alert}
            className={index === 3 ? 'lg:col-span-1 xl:col-span-1' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionControlDashboard;