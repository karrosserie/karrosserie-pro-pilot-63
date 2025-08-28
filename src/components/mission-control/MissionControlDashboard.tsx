import React, { useState } from 'react';
import MissionControlHeader from './MissionControlHeader';
import AlertCard from './AlertCard';
import { Eye, Package, Wrench, Calendar, Users, Clock, FileText } from 'lucide-react';

const MissionControlDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const getMissionsForPeriod = (period: 'today' | 'week' | 'month') => {
    switch (period) {
      case 'today':
        return [
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

      case 'week':
        return [
          {
            type: 'critical' as const,
            icon: 'weather' as const,
            title: 'Planification hebdomadaire critique',
            description: 'Surcharge équipes : 15 interventions prévues, capacité 12 max',
            impact: 'Risque de débordement - Clients prioritaires impactés',
            suggestion: 'Redistribution automatique + recrutement temporaire recommandé',
            metrics: [
              { value: '15', label: 'Interventions prévues', unit: '' },
              { value: '12', label: 'Capacité max', unit: '' },
              { value: '125', label: 'Charge', unit: '%' }
            ],
            actions: [
              { label: 'Redistribuer charges', variant: 'primary' as const },
              { label: 'Recruter temporaire', variant: 'secondary' as const }
            ]
          },
          {
            type: 'important' as const,
            icon: 'payment' as const,
            title: 'Échéances paiements semaine',
            subtitle: 'Factures en attente : 18 500€ - 7 clients',
            description: 'Relances programmées - Suivi automatique activé',
            impact: 'Trésorerie stable - Risque modéré si non encaissé',
            suggestion: 'Campagne de relance ciblée + conditions préférentielles pour paiement rapide',
            metrics: [
              { value: '18.5', label: 'Montant total', unit: 'k€' },
              { value: '7', label: 'Clients concernés', unit: '' },
              { value: '3', label: 'Relances envoyées', unit: '' }
            ],
            actions: [
              { label: 'Lancer campagne', variant: 'primary' as const },
              { label: 'Conditions préférentielles', variant: 'outline' as const }
            ]
          },
          {
            type: 'important' as const,
            icon: 'cooling' as const,
            title: 'Maintenance préventive',
            description: '8 équipements nécessitent maintenance cette semaine',
            impact: 'Prévention pannes - Optimisation performances clients',
            suggestion: 'Planning optimisé par IA - Groupage géographique efficace',
            metrics: [
              { value: '8', label: 'Équipements', unit: '' },
              { value: '3', label: 'Secteurs', unit: '' },
              { value: '2', label: 'Équipes nécessaires', unit: '' }
            ],
            actions: [
              { label: 'Valider planning', variant: 'primary' as const },
              { label: 'Optimiser trajets', variant: 'outline' as const, icon: <Calendar className="h-3 w-3" /> }
            ]
          }
        ];

      case 'month':
        return [
          {
            type: 'critical' as const,
            icon: 'weather' as const,
            title: 'Objectifs mensuels en péril',
            description: 'CA prévisionnel : 78% de l\'objectif - Écart significatif',
            impact: 'Manque à gagner estimé : 25 000€ sur le mois',
            suggestion: 'Stratégie de rattrapage : prospection intensive + offres flash',
            metrics: [
              { value: '78', label: 'Objectif atteint', unit: '%' },
              { value: '25', label: 'Manque à gagner', unit: 'k€' },
              { value: '12', label: 'Jours restants', unit: '' }
            ],
            actions: [
              { label: 'Plan de rattrapage', variant: 'primary' as const },
              { label: 'Offres flash', variant: 'secondary' as const }
            ]
          },
          {
            type: 'important' as const,
            icon: 'payment' as const,
            title: 'Bilan financier mensuel',
            subtitle: 'Encaissements : 142 000€ - Charges : 89 000€',
            description: 'Résultat positif mais en baisse vs mois précédent',
            impact: 'Marge brute : 37% (objectif 40%) - Optimisation nécessaire',
            suggestion: 'Révision des coûts variables + négociation fournisseurs prioritaire',
            metrics: [
              { value: '142', label: 'Encaissements', unit: 'k€' },
              { value: '89', label: 'Charges', unit: 'k€' },
              { value: '37', label: 'Marge brute', unit: '%' }
            ],
            actions: [
              { label: 'Analyser coûts', variant: 'primary' as const },
              { label: 'Renégocier fournisseurs', variant: 'outline' as const }
            ]
          },
          {
            type: 'important' as const,
            icon: 'cooling' as const,
            title: 'Performance équipes mensuelle',
            description: 'Productivité moyenne : 92% - 3 équipes sous-performantes',
            impact: 'Potentiel d\'amélioration identifié - Formation recommandée',
            suggestion: 'Programme de formation ciblé + système de prime performance',
            metrics: [
              { value: '92', label: 'Productivité moy.', unit: '%' },
              { value: '3', label: 'Équipes à former', unit: '' },
              { value: '47', label: 'Interventions/équipe', unit: '' }
            ],
            actions: [
              { label: 'Programmer formations', variant: 'primary' as const },
              { label: 'Système primes', variant: 'secondary' as const }
            ]
          },
          {
            type: 'important' as const,
            icon: 'power' as const,
            title: 'Investissements prévus',
            description: 'Budget équipement : 45 000€ - 2 machines critiques',
            impact: 'Modernisation nécessaire pour maintenir compétitivité',
            suggestion: 'Financement optimisé identifié - ROI prévu 18 mois',
            metrics: [
              { value: '45', label: 'Budget prévu', unit: 'k€' },
              { value: '2', label: 'Machines critiques', unit: '' },
              { value: '18', label: 'ROI prévu', unit: 'mois' }
            ],
            actions: [
              { label: 'Valider financement', variant: 'primary' as const },
              { label: 'Planifier installation', variant: 'outline' as const, icon: <Wrench className="h-3 w-3" /> }
            ]
          }
        ];
    }
  };

  const currentMissions = getMissionsForPeriod(selectedPeriod);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <MissionControlHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentMissions.map((alert, index) => (
          <AlertCard
            key={`${selectedPeriod}-${index}`}
            {...alert}
            className={currentMissions.length === 4 && index === 3 ? 'lg:col-span-1 xl:col-span-1' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionControlDashboard;