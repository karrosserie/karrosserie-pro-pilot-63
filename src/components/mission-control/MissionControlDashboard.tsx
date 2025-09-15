import React, { useState } from 'react';
import MissionControlHeader from './MissionControlHeader';
import AlertCard from './AlertCard';
import { Eye, Package, Wrench, Calendar, Users, Clock, FileText } from 'lucide-react';
import { useSystemAlerts } from '@/hooks/use-system-alerts';
import { createMissingVehicleAlerts } from '@/utils/createMissingVehicleAlerts';


const MissionControlDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isAIOn, setIsAIOn] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'super_admin' | 'finance' | 'chef_equipe' | 'ouvrier'>('super_admin');
  const { alerts, resolveAlert, refetch } = useSystemAlerts();

  const handleCreateMissingAlerts = async () => {
    await createMissingVehicleAlerts();
    // Recharger les alertes après création
    refetch();
  };

  const handleAIToggle = () => {
    setIsAIOn(!isAIOn);
  };

  const getMissionsForPeriod = (period: 'today' | 'week' | 'month', mode: string) => {
    const allMissions = {
      today: [
        // Ajouter dynamiquement les alertes système en premier
        ...alerts
          .filter(alert => alert.alert_type === 'retard_pointage' || alert.alert_type === 'vehicle_waiting' || alert.alert_type === 'messagerie_urgente')
          .map(alert => {
            if (alert.entity_type === 'employee' && alert.alert_type === 'retard_pointage') {
              const clockInTime = new Date(alert.clock_in_time || '');
              const timeString = clockInTime.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              
              return {
                type: 'important' as const,
                icon: 'administration' as const,
                title: 'Retard employé détecté',
                subtitle: `${alert.employee_name} - Pointage ${timeString}`,
                description: alert.message,
                impact: 'Gestion des retards nécessaire pour maintenir la discipline',
                suggestion: 'Contacter l\'employé pour comprendre les raisons du retard et prendre les mesures appropriées',
                metrics: [
                  { value: timeString, label: 'Heure de pointage', unit: '' },
                  { value: '9h00', label: 'Heure limite', unit: '' },
                  { value: `${Math.max(0, clockInTime.getHours() - 9)}h${String(clockInTime.getMinutes()).padStart(2, '0')}`, label: 'Retard', unit: '' }
                ],
                actions: [
                  { 
                    label: 'Marquer comme traité', 
                    variant: 'primary' as const,
                    modalType: 'resolve_alert',
                    modalData: { 
                      title: 'Résoudre l\'alerte', 
                      alertId: alert.id, 
                      employeeName: alert.employee_name,
                      resolveAlert 
                    }
                  },
                  { 
                    label: 'Contacter employé', 
                    variant: 'outline' as const,
                    modalType: 'contact_employee',
                    modalData: { title: 'Contacter l\'employé', employeeName: alert.employee_name }
                  }
                ],
                modes: ['super_admin', 'chef_equipe']
              };
            } else if (alert.entity_type === 'vehicle' && alert.alert_type === 'vehicle_waiting') {
              return {
                type: 'critical' as const,
                icon: 'supplier' as const,
                title: 'Véhicule en attente',
                subtitle: `${alert.vehicle_info || 'Véhicule inconnu'}`,
                description: alert.message,
                impact: 'Véhicule immobilisé - Impact sur la productivité et satisfaction client',
                suggestion: alert.reason ? `Traiter la raison de l'attente : ${alert.reason}` : 'Vérifier les causes du blocage et débloquer le véhicule',
                metrics: [
                  { value: new Date(alert.created_at).toLocaleDateString('fr-FR'), label: 'Date mise en attente', unit: '' },
                  { value: alert.reason || 'Non spécifiée', label: 'Raison', unit: '' },
                  { value: Math.ceil((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60)).toString(), label: 'Heures d\'attente', unit: 'h' }
                ],
                actions: [
                  { 
                    label: 'Débloquer véhicule', 
                    variant: 'primary' as const,
                    modalType: 'resolve_vehicle_alert',
                    modalData: { 
                      title: 'Débloquer le véhicule', 
                      alertId: alert.id, 
                      vehicleInfo: alert.vehicle_info,
                      reason: alert.reason,
                      resolveAlert 
                    }
                  },
                  { 
                    label: 'Voir détails', 
                    variant: 'outline' as const,
                    modalType: 'vehicle_details',
                    modalData: { title: 'Détails véhicule', vehicleInfo: alert.vehicle_info }
                  }
                ],
                modes: ['super_admin', 'chef_equipe']
              };
            } else if (alert.entity_type === 'messagerie' && alert.alert_type === 'messagerie_urgente') {
              const priorityLabel = alert.messagerie_info?.priority === 4 ? 'CRITICAL' : 'IMPORTANT';
              const isCritical = alert.messagerie_info?.priority === 4;
              
              return {
                type: isCritical ? 'critical' as const : 'important' as const,
                icon: 'administration' as const,
                title: 'Message urgent - ' + priorityLabel,
                subtitle: `${alert.messagerie_info?.title || 'Message sans titre'}`,
                description: alert.message,
                impact: 'Message nécessitant une attention immédiate - Impact sur la communication client/fournisseur',
                suggestion: `Traiter le message via le canal ${alert.messagerie_info?.channel || 'non spécifié'} et donner une réponse appropriée`,
                metrics: [
                  { value: priorityLabel, label: 'Priorité', unit: '' },
                  { value: alert.messagerie_info?.channel || 'Non spécifié', label: 'Canal', unit: '' },
                  { value: Math.ceil((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60)).toString(), label: 'Minutes écoulées', unit: 'min' }
                ],
                actions: [
                  { 
                    label: 'Traiter le message', 
                    variant: 'primary' as const,
                    modalType: 'resolve_message_alert',
                    modalData: { 
                      title: 'Traiter le message urgent', 
                      alertId: alert.id, 
                      messageTitle: alert.messagerie_info?.title,
                      messageSummary: alert.messagerie_info?.summary,
                      channel: alert.messagerie_info?.channel,
                      priority: priorityLabel,
                      resolveAlert 
                    }
                  },
                  { 
                    label: 'Voir messagerie', 
                    variant: 'outline' as const,
                    modalType: 'view_messagerie',
                    modalData: { 
                      title: 'Voir dans messagerie', 
                      messagerieId: alert.messagerie_id,
                      messageTitle: alert.messagerie_info?.title 
                    }
                  }
                ],
                modes: ['super_admin', 'chef_equipe', 'finance']
              };
            }
            return null;
          })
          .filter(Boolean),
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
        // Maintenance préventive équipements carrosserie
        {
          type: 'important' as const,
          icon: 'cooling' as const,
          title: 'Maintenance préventive hebdomadaire',
          subtitle: '5 équipements carrosserie - Planning semaine 47',
          description: 'Entretien préventif équipements essentiels - Éviter pannes coûteuses',
          impact: 'Prévention arrêts production + optimisation performances',
          suggestion: 'Planning optimisé par IA - Maintenance groupée par zone',
          metrics: [
            { value: '5', label: 'Équipements concernés', unit: '' },
            { value: '8h', label: 'Temps total prévu', unit: '' },
            { value: '2', label: 'Techniciens assignés', unit: '' }
          ],
          actions: [
            { 
              label: 'Valider planning', 
              variant: 'primary' as const,
              modalType: 'maintenance_preventive',
              modalData: { title: 'Planning maintenance préventive' }
            },
            { 
              label: 'Ajuster créneaux', 
              variant: 'outline' as const, 
              modalType: 'ajuster_creneaux_maintenance',
              modalData: { title: 'Ajustement créneaux' }
            }
          ],
          modes: ['super_admin', 'responsable', 'carrossier']
        },
        // Suivi sinistres en cours - semaine
        {
          type: 'critical' as const,
          icon: 'insurance' as const,
          title: 'Suivi sinistres hebdomadaire',
          subtitle: '12 dossiers en cours - 3 expertises cette semaine',
          description: 'Point d\'étape sinistres - Relances nécessaires assureurs',
          impact: 'Déblocage paiements + satisfaction client maintenue',
          suggestion: 'Automatisation relances + préparation documents manquants',
          metrics: [
            { value: '12', label: 'Sinistres en cours', unit: '' },
            { value: '3', label: 'Expertises prévues', unit: '' },
            { value: '47k€', label: 'Montant total', unit: '' }
          ],
          actions: [
            { 
              label: 'Relancer assureurs', 
              variant: 'primary' as const,
              modalType: 'relancer_assureurs',
              modalData: { title: 'Relances assureurs' }
            },
            { 
              label: 'Préparer expertises', 
              variant: 'secondary' as const,
              modalType: 'preparer_expertises',
              modalData: { title: 'Préparation expertises' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Planning livraisons véhicules - semaine
        {
          type: 'important' as const,
          icon: 'payment' as const,
          title: 'Livraisons véhicules prévues',
          subtitle: '8 véhicules à livrer - 6 clients à contacter',
          description: 'Organisation livraisons hebdomadaires - Coordination clients',
          impact: 'Fluidité rotation atelier + satisfaction client optimale',
          suggestion: 'Système de notification automatique + planification optimisée',
          metrics: [
            { value: '8', label: 'Véhicules prêts', unit: '' },
            { value: '6', label: 'Clients à contacter', unit: '' },
            { value: '23.5k€', label: 'CA à encaisser', unit: '' }
          ],
          actions: [
            { 
              label: 'Programmer livraisons', 
              variant: 'primary' as const,
              modalType: 'programmer_livraisons',
              modalData: { title: 'Planning livraisons' }
            },
            { 
              label: 'Contacter clients', 
              variant: 'outline' as const,
              modalType: 'contacter_clients_livraison',
              modalData: { title: 'Contact clients' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Gestion stocks pièces - semaine
        {
          type: 'critical' as const,
          icon: 'supplier' as const,
          title: 'Réapprovisionnement stocks',
          subtitle: '15 références en seuil critique - Commandes urgentes',
          description: 'Stock pièces détachées critique - Risque rupture imminente',
          impact: 'Éviter blocage réparations + maintenir délais clients',
          suggestion: 'Commandes automatiques + négociation délais fournisseurs',
          metrics: [
            { value: '15', label: 'Références critiques', unit: '' },
            { value: '6.8k€', label: 'Montant commandes', unit: '' },
            { value: '48h', label: 'Délai moyen livraison', unit: '' }
          ],
          actions: [
            { 
              label: 'Commander maintenant', 
              variant: 'primary' as const,
              modalType: 'commander_stock_urgent',
              modalData: { title: 'Commandes urgentes' }
            },
            { 
              label: 'Négocier délais', 
              variant: 'secondary' as const,
              modalType: 'negocier_delais_stock',
              modalData: { title: 'Négociation délais' }
            }
          ],
          modes: ['super_admin', 'responsable']
        }
      ],
      month: [
        // Bilan mensuel activité carrosserie
        {
          type: 'important' as const,
          icon: 'payment' as const,
          title: 'Bilan mensuel carrosserie',
          subtitle: 'CA: 142 000€ - 89 véhicules réparés - Marge: 37%',
          description: 'Performance mensuelle en légère baisse vs objectifs',
          impact: 'Marge brute inférieure objectif 40% - Optimisation requise',
          suggestion: 'Analyse coûts pièces + révision tarifs main d\'œuvre',
          metrics: [
            { value: '142k€', label: 'Chiffre d\'affaires', unit: '' },
            { value: '89', label: 'Véhicules traités', unit: '' },
            { value: '37%', label: 'Marge brute', unit: '' }
          ],
          actions: [
            { 
              label: 'Analyser rentabilité', 
              variant: 'primary' as const,
              modalType: 'analyser_rentabilite',
              modalData: { title: 'Analyse rentabilité mensuelle' }
            },
            { 
              label: 'Réviser tarifs', 
              variant: 'outline' as const,
              modalType: 'reviser_tarifs',
              modalData: { title: 'Révision grille tarifaire' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Révision contrats assurances partenaires
        {
          type: 'critical' as const,
          icon: 'insurance' as const,
          title: 'Renouvellement accords assureurs',
          subtitle: 'MAIF, AXA, GROUPAMA - Négociation annuelle',
          description: 'Révision conditions partenariats assureurs - Enjeu volume',
          impact: '68% du CA via assurances - Négociation stratégique critique',
          suggestion: 'Mise en concurrence + valorisation expertise technique',
          metrics: [
            { value: '68%', label: 'CA via assurances', unit: '' },
            { value: '3', label: 'Contrats à renégocier', unit: '' },
            { value: '96k€', label: 'CA annuel concerné', unit: '' }
          ],
          actions: [
            { 
              label: 'Négocier contrats', 
              variant: 'primary' as const,
              modalType: 'negocier_contrats_assurance',
              modalData: { title: 'Négociation contrats assureurs' }
            },
            { 
              label: 'Étudier concurrence', 
              variant: 'secondary' as const,
              modalType: 'etudier_concurrence',
              modalData: { title: 'Étude concurrentielle' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Formation équipe nouvelles technologies
        {
          type: 'important' as const,
          icon: 'cooling' as const,
          title: 'Formation véhicules électriques',
          subtitle: 'Certification Tesla + BMW i - 4 carrossiers',
          description: 'Adaptation compétences véhicules électriques/hybrides',
          impact: 'Accès marché VE en croissance + différenciation concurrentielle',
          suggestion: 'Formation certifiante + investissement outils spécialisés',
          metrics: [
            { value: '4', label: 'Carrossiers concernés', unit: '' },
            { value: '28%', label: 'Croissance marché VE', unit: '' },
            { value: '3.2k€', label: 'Coût formation/personne', unit: '' }
          ],
          actions: [
            { 
              label: 'Programmer formation', 
              variant: 'primary' as const,
              modalType: 'programmer_formation_ve',
              modalData: { title: 'Formation véhicules électriques' }
            },
            { 
              label: 'Budgéter équipements', 
              variant: 'outline' as const,
              modalType: 'budgeter_equipements',
              modalData: { title: 'Budget équipements VE' }
            }
          ],
          modes: ['super_admin', 'responsable']
        },
        // Investissement équipements carrosserie
        {
          type: 'important' as const,
          icon: 'power' as const,
          title: 'Modernisation équipements',
          subtitle: 'Marbre de redressage + système mixage peinture',
          description: 'Renouvellement équipements critiques - Fin de vie atteinte',
          impact: 'Qualité réparations + réduction temps intervention',
          suggestion: 'Financement étalé + ROI calculé sur gains productivité',
          metrics: [
            { value: '67k€', label: 'Budget équipements', unit: '' },
            { value: '24', label: 'ROI prévu', unit: 'mois' },
            { value: '15%', label: 'Gain productivité', unit: '' }
          ],
          actions: [
            { 
              label: 'Valider investissement', 
              variant: 'primary' as const,
              modalType: 'valider_investissement',
              modalData: { title: 'Validation investissement' }
            },
            { 
              label: 'Étudier financement', 
              variant: 'outline' as const,
              modalType: 'etudier_financement',
              modalData: { title: 'Options financement' }
            }
          ],
          modes: ['super_admin', 'responsable']
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
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <MissionControlHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        isAIOn={isAIOn}
        onAIToggle={handleAIToggle}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
      
      {/* Bouton temporaire pour créer les alertes manquantes */}
      <button 
        onClick={handleCreateMissingAlerts}
        className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        🔧 Créer alertes véhicules manquantes
      </button>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {currentMissions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucune mission pour cette période</h3>
              <p className="mt-2">Tout semble sous contrôle pour le moment.</p>
            </div>
          </div>
        ) : (
          currentMissions.map((alert, index) => (
            <AlertCard
              key={`${selectedPeriod}-${selectedMode}-${index}`}
              {...alert}
              className={currentMissions.length === 4 && index === 3 ? 'md:col-span-2 xl:col-span-1' : ''}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MissionControlDashboard;