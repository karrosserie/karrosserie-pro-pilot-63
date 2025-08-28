import React, { useState } from 'react';
import MissionControlHeader from './MissionControlHeader';
import AlertCard from './AlertCard';
import { Eye, Package, Wrench, Calendar, Users, Clock, FileText } from 'lucide-react';

const MissionControlDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isAIOn, setIsAIOn] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'super_admin' | 'finance' | 'chef_equipe' | 'ouvrier'>('super_admin');

  const handleAIToggle = () => {
    setIsAIOn(!isAIOn);
  };

  const getMissionsForPeriod = (period: 'today' | 'week' | 'month', mode: string) => {
    const allMissions = {
      today: [
        // Alerte météo pour peinture extérieure
        {
          type: 'critical' as const,
          icon: 'weather' as const,
          title: 'Alerte météo critique - Peinture extérieure',
          subtitle: 'Pluie prévue demain - 4 véhicules en cours de peinture',
          description: 'Risque de défauts de peinture si exposition à l\'humidité',
          impact: 'Reprise complète peinture = 2 jours supplémentaires par véhicule',
          suggestion: 'Mise à l\'abri immédiate + accélération séchage avec étuves',
          metrics: [
            { value: '85%', label: 'Probabilité pluie', unit: '' },
            { value: '4', label: 'Véhicules exposés', unit: '' },
            { value: '2h', label: 'Temps pour mise à l\'abri', unit: '' }
          ],
          actions: [
            { 
              label: 'Mettre à l\'abri maintenant', 
              variant: 'primary' as const,
              modalType: 'mise_abri_vehicules',
              modalData: { title: 'Mise à l\'abri véhicules', vehicules: 4 }
            },
            { 
              label: 'Programmer étuvage', 
              variant: 'outline' as const, 
              modalType: 'programmer_etuvage',
              modalData: { title: 'Programmation étuvage' }
            }
          ],
          modes: ['super_admin', 'chef_equipe', 'carrossier']
        },
        // Retard paiement client carrosserie
        {
          type: 'critical' as const,
          icon: 'payment' as const,
          title: 'Impayé critique - Réparation sinistre',
          subtitle: 'Mme MARTIN - Peugeot 308 - 2 847€ - 45j de retard',
          description: 'Réparation terminée il y a 45 jours - Client injoignable',
          impact: 'Trésorerie bloquée - Procédure contentieuse recommandée',
          suggestion: 'Séquence de relance automatique + saisie véhicule si nécessaire',
          metrics: [
            { value: '45j', label: 'Retard paiement', unit: '' },
            { value: '2.8k€', label: 'Montant dû', unit: '' },
            { value: '7', label: 'Relances envoyées', unit: '' }
          ],
          actions: [
            { 
              label: 'Lancer contentieux', 
              variant: 'primary' as const,
              modalType: 'contentieux_client',
              modalData: { title: 'Procédure contentieuse', client: 'Mme MARTIN', montant: '2 847€' }
            },
            { 
              label: 'Négocier arrangement', 
              variant: 'secondary' as const,
              modalType: 'negocier_arrangement',
              modalData: { title: 'Négociation arrangement' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Sinistre automobile urgent
        {
          type: 'important' as const,
          icon: 'insurance' as const,
          title: 'Nouveau sinistre automobile urgent',
          subtitle: 'BMW X3 2019 - Choc frontal - Assurance MAIF',
          description: 'Véhicule accidenté remorqué - Expertise à programmer sous 48h',
          impact: 'Véhicule de remplacement en attente - Satisfaction client prioritaire',
          suggestion: 'Prise de RDV expertise + préparation dossier automatique',
          metrics: [
            { value: '48h', label: 'Délai expertise', unit: '' },
            { value: '15k€', label: 'Valeur véhicule', unit: '' },
            { value: '24h', label: 'Véhicule courtoisie max', unit: '' }
          ],
          actions: [
            { 
              label: 'Programmer expertise', 
              variant: 'primary' as const,
              modalType: 'programmer_expertise',
              modalData: { title: 'Programmation expertise', vehicule: 'BMW X3 2019' }
            },
            { 
              label: 'Préparer dossier', 
              variant: 'outline' as const,
              modalType: 'preparer_dossier_sinistre',
              modalData: { title: 'Préparation dossier sinistre' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Rupture stock pièces critiques
        {
          type: 'critical' as const,
          icon: 'supplier' as const,
          title: 'Rupture stock critique - Pièces BMW',
          subtitle: 'Pare-choc avant BMW Série 3 - 3 réparations bloquées',
          description: 'Stock épuisé - Fournisseur principal en rupture - Délai 10 jours',
          impact: 'Immobilisation 3 véhicules - Pénalités retard 150€/jour/véhicule',
          suggestion: 'Sourcing alternatif identifié - Pièce occasion/adaptable disponible',
          metrics: [
            { value: '3', label: 'Véhicules bloqués', unit: '' },
            { value: '10j', label: 'Délai fournisseur', unit: '' },
            { value: '450€', label: 'Pénalité/jour', unit: '' }
          ],
          actions: [
            { 
              label: 'Commander alternatif', 
              variant: 'primary' as const,
              modalType: 'commander_alternatif',
              modalData: { title: 'Commande alternative', piece: 'Pare-choc BMW Série 3' }
            },
            { 
              label: 'Chercher occasion', 
              variant: 'secondary' as const,
              modalType: 'chercher_occasion',
              modalData: { title: 'Recherche pièce occasion' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Équipement carrosserie en panne
        {
          type: 'important' as const,
          icon: 'cooling' as const,
          title: 'Panne cabine de peinture n°2',
          subtitle: 'Système de ventilation défaillant - Température excessive',
          description: 'Cabine surchauffe - Risque défauts peinture + arrêt production',
          impact: 'Capacité réduite 50% - Retard livraisons client estimé 3 jours',
          suggestion: 'Intervention maintenance urgente + utilisation cabine n°1 en priorité',
          metrics: [
            { value: '42°C', label: 'Température cabine', unit: '' },
            { value: '50%', label: 'Capacité réduite', unit: '' },
            { value: '8', label: 'Véhicules en attente', unit: '' }
          ],
          actions: [
            { 
              label: 'Intervention urgente', 
              variant: 'primary' as const,
              modalType: 'intervention_cabine',
              modalData: { title: 'Intervention cabine peinture' }
            },
            { 
              label: 'Réorganiser planning', 
              variant: 'secondary' as const,
              modalType: 'reorganiser_planning',
              modalData: { title: 'Réorganisation planning peinture' }
            }
          ],
          modes: ['super_admin', 'responsable', 'carrossier']
        }
      ],
      week: [
        // Clientèle Financière - Semaine
        {
          type: 'important' as const,
          icon: 'finance' as const,
          title: 'Révision budgets prévisionnels - Semaine 47',
          subtitle: '12 clients - Budgets 2025 à valider',
          description: 'Validation budgets prévisionnels 2025 - Ajustements nécessaires',
          impact: 'Retard validation = décalage stratégies financières clients',
          suggestion: 'Analyse comparative automatique + recommandations IA sectorielles',
          metrics: [
            { value: '12', label: 'Budgets à valider', unit: '' },
            { value: '2.4M€', label: 'Montant total', unit: '' },
            { value: '85%', label: 'Conformité prévisions', unit: '' }
          ],
          actions: [
            { 
              label: 'Valider budgets', 
              variant: 'primary' as const,
              modalType: 'valider_budgets',
              modalData: { title: 'Validation budgets 2025' }
            },
            { 
              label: 'Ajustements sectoriels', 
              variant: 'outline' as const,
              modalType: 'ajustements_budgets',
              modalData: { title: 'Ajustements sectoriels' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Clientèle Comptable - Semaine
        {
          type: 'critical' as const,
          icon: 'accounting' as const,
          title: 'Arrêtés de comptes trimestriels',
          subtitle: '8 dossiers en attente - Échéance 30/11',
          description: 'Clôtures trimestrielles Q3 - Liasses fiscales à produire',
          impact: 'Retard = pénalités clients + surcharge période de pointe',
          suggestion: 'Priorisation automatique par complexité + affectation ressources',
          metrics: [
            { value: '8', label: 'Dossiers restants', unit: '' },
            { value: '5j', label: 'Délai moyen', unit: '' },
            { value: '30/11', label: 'Échéance', unit: '' }
          ],
          actions: [
            { 
              label: 'Prioriser dossiers', 
              variant: 'primary' as const,
              modalType: 'prioriser_dossiers',
              modalData: { title: 'Priorisation arrêtés comptes' }
            },
            { 
              label: 'Affecter ressources', 
              variant: 'secondary' as const,
              modalType: 'affecter_ressources',
              modalData: { title: 'Affectation ressources' }
            }
          ],
          modes: ['super_admin', 'finance']
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
            { 
              label: 'Lancer campagne', 
              variant: 'primary' as const,
              modalType: 'campagne_relance',
              modalData: { title: 'Campagne de relance' }
            },
            { 
              label: 'Conditions préférentielles', 
              variant: 'outline' as const,
              modalType: 'conditions_preferentielles',
              modalData: { title: 'Conditions préférentielles' }
            }
          ],
          modes: ['super_admin', 'finance']
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
            { 
              label: 'Valider planning', 
              variant: 'primary' as const,
              modalType: 'maintenance_preventive',
              modalData: { title: 'Planning maintenance préventive' }
            },
            { 
              label: 'Optimiser trajets', 
              variant: 'outline' as const, 
              icon: <Calendar className="h-3 w-3" />,
              modalType: 'optimiser_trajets',
              modalData: { title: 'Optimisation trajets' }
            }
          ],
          modes: ['super_admin', 'ouvrier', 'chef_equipe']
        }
      ],
      month: [
        // Clientèle Financière - Mois
        {
          type: 'critical' as const,
          icon: 'finance' as const,
          title: 'Clôture fiscale annuelle - HOLDING MEDITERRANEE',
          subtitle: 'Consolidation 15 filiales - Échéance 31/12',
          description: 'Consolidation complexe 15 filiales - Optimisation fiscale recommandée',
          impact: 'Risque pénalités fiscales 45 000€ + surcharge équipes',
          suggestion: 'Consolidation automatisée + optimisation niches fiscales IA',
          metrics: [
            { value: '15', label: 'Filiales à consolider', unit: '' },
            { value: '45k€', label: 'Risque pénalités', unit: '' },
            { value: '31/12', label: 'Échéance légale', unit: '' }
          ],
          actions: [
            { 
              label: 'Consolidation auto', 
              variant: 'primary' as const,
              modalType: 'consolidation_auto',
              modalData: { title: 'Consolidation automatique', filiales: 15 }
            },
            { 
              label: 'Optimisation fiscale', 
              variant: 'secondary' as const,
              modalType: 'optimisation_fiscale',
              modalData: { title: 'Optimisation fiscale' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Clientèle Comptable - Mois
        {
          type: 'important' as const,
          icon: 'accounting' as const,
          title: 'Révision tarifs comptables 2025',
          subtitle: 'Mise à jour grille tarifaire - 45 clients impactés',
          description: 'Révision annuelle tarifs - Négociation avenant clients',
          impact: 'Augmentation CA prévisionnelle +12% vs inflation +8%',
          suggestion: 'Négociation progressive + accompagnement valeur ajoutée',
          metrics: [
            { value: '45', label: 'Clients concernés', unit: '' },
            { value: '+12%', label: 'Hausse moyenne', unit: '' },
            { value: '89%', label: 'Taux acceptation prévu', unit: '' }
          ],
          actions: [
            { 
              label: 'Négocier avenants', 
              variant: 'primary' as const,
              modalType: 'negocier_avenants',
              modalData: { title: 'Négociation avenants tarifaires' }
            },
            { 
              label: 'Plan accompagnement', 
              variant: 'outline' as const,
              modalType: 'plan_accompagnement',
              modalData: { title: 'Plan d\'accompagnement clients' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Clientèle Assurance - Mois
        {
          type: 'critical' as const,
          icon: 'insurance' as const,
          title: 'Renouvellement polices collectives',
          subtitle: 'RC Pro + Cyber-risques - 23 clients',
          description: 'Renouvellement annuel polices - Négociation groupe recommandée',
          impact: 'Économies potentielles 28 000€ en négociation groupée',
          suggestion: 'Négociation collective + renforcement couverture cyber',
          metrics: [
            { value: '23', label: 'Polices à renouveler', unit: '' },
            { value: '28k€', label: 'Économies potentielles', unit: '' },
            { value: '95%', label: 'Taux renouvellement', unit: '' }
          ],
          actions: [
            { 
              label: 'Négociation groupe', 
              variant: 'primary' as const,
              modalType: 'negociation_groupe',
              modalData: { title: 'Négociation groupe assurances' }
            },
            { 
              label: 'Audit couvertures', 
              variant: 'secondary' as const,
              modalType: 'audit_couvertures',
              modalData: { title: 'Audit couvertures' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Fournisseurs - Mois
        {
          type: 'important' as const,
          icon: 'supplier' as const,
          title: 'Renégociation contrats fournisseurs',
          subtitle: 'Révision annuelle - 12 contrats majeurs',
          description: 'Renégociation contrats annuels - Optimisation coûts recommandée',
          impact: 'Potentiel économies 15% sur achats = 67 000€/an',
          suggestion: 'Appel d\'offres concurrentiel + négociation volume',
          metrics: [
            { value: '12', label: 'Contrats à renégocier', unit: '' },
            { value: '67k€', label: 'Économies potentielles/an', unit: '' },
            { value: '15%', label: 'Réduction coûts cible', unit: '' }
          ],
          actions: [
            { 
              label: 'Lancer appels offres', 
              variant: 'primary' as const,
              modalType: 'appels_offres',
              modalData: { title: 'Appels d\'offres fournisseurs' }
            },
            { 
              label: 'Benchmark prix', 
              variant: 'outline' as const,
              modalType: 'benchmark_prix',
              modalData: { title: 'Benchmark prix marché' }
            }
          ],
          modes: ['super_admin', 'ouvrier']
        },
        // Banques - Mois
        {
          type: 'important' as const,
          icon: 'bank' as const,
          title: 'Renégociation conditions bancaires',
          subtitle: 'Taux crédit + commissions - 3 banques',
          description: 'Révision annuelle conditions bancaires - Mise en concurrence',
          impact: 'Économies financières potentielles 8 400€/an sur frais',
          suggestion: 'Mise en concurrence + négociation taux préférentiels',
          metrics: [
            { value: '3', label: 'Banques partenaires', unit: '' },
            { value: '8.4k€', label: 'Économies potentielles/an', unit: '' },
            { value: '0.25%', label: 'Réduction taux cible', unit: '' }
          ],
          actions: [
            { 
              label: 'Négocier conditions', 
              variant: 'primary' as const,
              modalType: 'negocier_conditions',
              modalData: { title: 'Négociation conditions bancaires' }
            },
            { 
              label: 'Comparatif marché', 
              variant: 'secondary' as const,
              modalType: 'comparatif_marche',
              modalData: { title: 'Comparatif marché bancaire' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Administration - Mois
        {
          type: 'critical' as const,
          icon: 'administration' as const,
          title: 'Mise à jour registres légaux',
          subtitle: 'Registre unique du personnel + DUERP',
          description: 'Mise à jour obligatoire registres - Contrôle inspection probable',
          impact: 'Risque amende 3 750€ par manquement + mise en demeure',
          suggestion: 'Audit automatisé conformité + mise à jour prioritaire',
          metrics: [
            { value: '47', label: 'Registres à jour', unit: '' },
            { value: '3.75k€', label: 'Amende par manquement', unit: '' },
            { value: '15j', label: 'Délai mise à jour', unit: '' }
          ],
          actions: [
            { 
              label: 'Audit conformité', 
              variant: 'primary' as const,
              modalType: 'audit_conformite',
              modalData: { title: 'Audit conformité registres' }
            },
            { 
              label: 'Planifier mises à jour', 
              variant: 'outline' as const,
              modalType: 'planifier_maj',
              modalData: { title: 'Planification mises à jour' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
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
          ],
          modes: ['super_admin', 'finance', 'chef_equipe']
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
          ],
          modes: ['super_admin', 'finance']
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
          ],
          modes: ['super_admin', 'chef_equipe']
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
          ],
          modes: ['super_admin', 'finance']
        }
      ]
    };

    const periodMissions = allMissions[period] || [];
    
    // Si c'est Super Admin, retourner toutes les missions
    if (mode === 'super_admin') {
      return periodMissions;
    }
    
    // Sinon, filtrer par mode
    return periodMissions.filter(mission => 
      mission.modes && mission.modes.includes(mode)
    );
  };

  const currentMissions = getMissionsForPeriod(selectedPeriod, selectedMode);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <MissionControlHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        isAIOn={isAIOn}
        onAIToggle={handleAIToggle}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentMissions.map((alert, index) => (
          <AlertCard
            key={`${selectedPeriod}-${selectedMode}-${index}`}
            {...alert}
            className={currentMissions.length === 4 && index === 3 ? 'lg:col-span-1 xl:col-span-1' : ''}
          />
        ))}
      </div>
      
      {currentMissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune mission pour ce mode dans la période sélectionnée</p>
        </div>
      )}
    </div>
  );
};

export default MissionControlDashboard;