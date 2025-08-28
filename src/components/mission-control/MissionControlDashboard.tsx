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
        // Clientèle Financière
        {
          type: 'critical' as const,
          icon: 'finance' as const,
          title: 'Audit fiscal urgent - FINANCIERE OCCITANE',
          subtitle: 'Contrôle fiscal URSSAF - Documentation manquante',
          description: 'Contrôle fiscal en cours - Documents comptables demandés sous 48h',
          impact: 'Risque de redressement fiscal - Pénalités possibles 15 000€',
          suggestion: 'Extraction automatique des pièces comptables + accompagnement expert-comptable',
          metrics: [
            { value: '48h', label: 'Délai réponse', unit: '' },
            { value: '15k€', label: 'Risque pénalités', unit: '' },
            { value: '847', label: 'Pièces à fournir', unit: '' }
          ],
          actions: [
            { 
              label: 'Générer dossier fiscal', 
              variant: 'primary' as const, 
              modalType: 'audit_fiscal',
              modalData: { title: 'Générer dossier fiscal', client: 'FINANCIERE OCCITANE' }
            },
            { 
              label: 'Contacter expert-comptable', 
              variant: 'secondary' as const, 
              modalType: 'contact_expert',
              modalData: { title: 'Contacter expert-comptable' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Clientèle Comptable
        {
          type: 'critical' as const,
          icon: 'accounting' as const,
          title: 'Clôture mensuelle bloquée - COMPTA+',
          subtitle: 'Écritures en suspens - Balance déséquilibrée',
          description: 'Clôture comptable impossible - Écart de 2 847€ non identifié',
          impact: 'Retard déclaration TVA - Risque pénalités client final',
          suggestion: 'Analyse automatique des écarts + correction proposée par IA comptable',
          metrics: [
            { value: '2.8k€', label: 'Écart détecté', unit: '' },
            { value: '156', label: 'Écritures suspens', unit: '' },
            { value: '3j', label: 'Retard clôture', unit: '' }
          ],
          actions: [
            { 
              label: 'Analyser les écarts', 
              variant: 'primary' as const,
              modalType: 'analyser_ecarts',
              modalData: { title: 'Analyse des écarts comptables', montant: '2 847€' }
            },
            { 
              label: 'Lettrage automatique', 
              variant: 'outline' as const,
              modalType: 'lettrage_auto',
              modalData: { title: 'Lettrage automatique' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Clientèle Assurance  
        {
          type: 'important' as const,
          icon: 'insurance' as const,
          title: 'Déclaration sinistre - ASSUR+ CONSEIL',
          subtitle: 'Sinistre dégât des eaux - Expertise demandée',
          description: 'Dégât des eaux bureaux client - Dossier à constituer pour assureur',
          impact: 'Interruption activité client - Perte exploitation estimée 8 500€/jour',
          suggestion: 'Constitution automatique dossier sinistre + mise en relation expert',
          metrics: [
            { value: '8.5k€', label: 'Perte/jour', unit: '' },
            { value: '72h', label: 'Délai déclaration', unit: '' },
            { value: '95%', label: 'Chance prise charge', unit: '' }
          ],
          actions: [
            { 
              label: 'Constituer dossier', 
              variant: 'primary' as const,
              modalType: 'dossier_sinistre',
              modalData: { title: 'Constitution dossier sinistre', type: 'Dégât des eaux' }
            },
            { 
              label: 'Contacter expert', 
              variant: 'secondary' as const,
              modalType: 'contact_expert_assurance',
              modalData: { title: 'Contacter expert assurance' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Fournisseur
        {
          type: 'critical' as const,
          icon: 'supplier' as const,
          title: 'Rupture stock critique - FOURNI-TECH',
          subtitle: 'Pièce essentielle en rupture - Production bloquée',
          description: 'Composant électronique critique en rupture - Arrêt production client',
          impact: 'Arrêt ligne production - Pénalité retard 12 000€/jour',
          suggestion: 'Sourcing alternatif identifié + livraison express 24h disponible',
          metrics: [
            { value: '24h', label: 'Délai fournisseur alternatif', unit: '' },
            { value: '12k€', label: 'Pénalité/jour', unit: '' },
            { value: '3', label: 'Fournisseurs alternatifs', unit: '' }
          ],
          actions: [
            { 
              label: 'Commander express', 
              variant: 'primary' as const,
              modalType: 'commande_express',
              modalData: { title: 'Commande express', fournisseur: 'FOURNI-TECH' }
            },
            { 
              label: 'Négocier délais', 
              variant: 'outline' as const,
              modalType: 'negocier_delais',
              modalData: { title: 'Négociation délais' }
            }
          ],
          modes: ['super_admin', 'ouvrier']
        },
        // Banque
        {
          type: 'critical' as const,
          icon: 'bank' as const,
          title: 'Découvert autorisé dépassé - CREDIT MUTUEL',
          subtitle: 'Solde: -25 847€ - Autorisation: 20 000€',
          description: 'Dépassement découvert autorisé - Agios majorés depuis 3 jours',
          impact: 'Frais bancaires majorés 89€/jour + risque rejet prélèvements',
          suggestion: 'Virement d\'urgence recommandé + négociation extension découvert',
          metrics: [
            { value: '5.8k€', label: 'Dépassement', unit: '' },
            { value: '89€', label: 'Agios/jour', unit: '' },
            { value: '3j', label: 'Durée dépassement', unit: '' }
          ],
          actions: [
            { 
              label: 'Virement d\'urgence', 
              variant: 'primary' as const,
              modalType: 'virement_urgence',
              modalData: { title: 'Virement d\'urgence', montant: '5 847€' }
            },
            { 
              label: 'Négocier découvert', 
              variant: 'secondary' as const,
              modalType: 'negocier_decouvert',
              modalData: { title: 'Négocier découvert' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
        // Administration
        {
          type: 'important' as const,
          icon: 'administration' as const,
          title: 'Déclaration URSSAF échéance demain',
          subtitle: 'DSN mensuelle + cotisations sociales',
          description: 'Déclaration sociale nominative à transmettre avant 15h demain',
          impact: 'Pénalités 0.40% par mois de retard + majoration 10%',
          suggestion: 'Transmission automatique activée + vérification données paie',
          metrics: [
            { value: '15h', label: 'Échéance demain', unit: '' },
            { value: '847€', label: 'Montant cotisations', unit: '' },
            { value: '0.40%', label: 'Pénalité retard/mois', unit: '' }
          ],
          actions: [
            { 
              label: 'Transmettre DSN', 
              variant: 'primary' as const,
              modalType: 'transmettre_dsn',
              modalData: { title: 'Transmission DSN', echeance: 'Demain 15h' }
            },
            { 
              label: 'Vérifier données', 
              variant: 'outline' as const,
              modalType: 'verifier_donnees',
              modalData: { title: 'Vérification données paie' }
            }
          ],
          modes: ['super_admin', 'finance']
        },
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
            { 
              label: 'Replanifier maintenant', 
              variant: 'primary' as const,
              modalType: 'replanifier_meteo',
              modalData: { title: 'Replanification météo', chantiers: 3 }
            },
            { 
              label: 'Voir alternatives', 
              variant: 'outline' as const, 
              icon: <Eye className="h-3 w-3" />,
              modalType: 'alternatives_meteo',
              modalData: { title: 'Alternatives météo' }
            }
          ],
          modes: ['super_admin', 'chef_equipe']
        },
        {
          type: 'critical' as const,
          icon: 'payment' as const,
          title: 'Retard paiement critique',
          subtitle: 'DUPONT SARL - 4 520€ - 43j sans réponse',
          description: 'Impact trésorerie immédiat - Procédure recommandée',
          impact: 'Impact trésorerie immédiat - Procédure recommandée',
          suggestion: 'Séquence de relance intelligente + escalade automatique',
          metrics: [
            { value: '43j', label: 'Retard encaissement', unit: '' },
            { value: '4.5k€', label: 'Montant dû', unit: '' },
            { value: '3', label: 'Relances ignorées', unit: '' }
          ],
          actions: [
            { 
              label: 'Lancer séquence', 
              variant: 'primary' as const,
              modalType: 'relance_paiement',
              modalData: { title: 'Séquence de relance', client: 'DUPONT SARL', montant: '4 520€' }
            },
            { 
              label: 'Négocier échéances', 
              variant: 'secondary' as const,
              modalType: 'negocier_echeances',
              modalData: { title: 'Négociation échéances' }
            }
          ],
          modes: ['super_admin', 'finance']
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
            { 
              label: 'Déclencher intervention', 
              variant: 'primary' as const,
              modalType: 'intervention_urgence',
              modalData: { title: 'Intervention d\'urgence', client: 'Cabinet médical BERNARD' }
            },
            { 
              label: 'Vérifier stock', 
              variant: 'outline' as const, 
              icon: <Package className="h-3 w-3" />,
              modalType: 'verifier_stock',
              modalData: { title: 'Vérification stock' }
            }
          ],
          modes: ['super_admin', 'ouvrier', 'chef_equipe']
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
            { 
              label: 'Programmer réparation', 
              variant: 'primary' as const,
              modalType: 'programmer_reparation',
              modalData: { title: 'Programmer réparation', client: 'LA BRASSERIE' }
            },
            { 
              label: 'Solution temporaire', 
              variant: 'secondary' as const,
              modalType: 'solution_temporaire',
              modalData: { title: 'Solution temporaire' }
            }
          ],
          modes: ['super_admin', 'ouvrier']
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