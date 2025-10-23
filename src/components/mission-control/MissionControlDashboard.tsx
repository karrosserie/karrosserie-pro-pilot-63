import React, { useState } from 'react';
import MissionControlHeader from './MissionControlHeader';
import AlertCard from './AlertCard';
import { Eye, Package, Wrench, Calendar, Users, Clock, FileText } from 'lucide-react';
import { useSystemAlerts } from '@/hooks/use-system-alerts';
import { createMissingVehicleAlerts } from '@/utils/createMissingVehicleAlerts';
import { useCompany } from '@/hooks/use-company';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import DocumentRequestAlerts from '@/components/ai-assistant/DocumentRequestAlerts';


const MissionControlDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isAIOn, setIsAIOn] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'super_admin' | 'finance' | 'chef_equipe' | 'ouvrier'>('super_admin');
  const { alerts, resolveAlert, refetch } = useSystemAlerts();
  const { companyData } = useCompany();
  const { employees } = useEmployeeData(companyData?.id || null);

  const handleCreateMissingAlerts = async () => {
    await createMissingVehicleAlerts();
    // Recharger les alertes après création
    refetch();
  };

  const handleAIToggle = () => {
    setIsAIOn(!isAIOn);
  };

  const getMissionsForPeriod = (period: 'today' | 'week' | 'month', mode: string) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filtrer les alertes selon la période demandée
    const filteredAlerts = alerts.filter(alert => {
      const alertDate = new Date(alert.created_at);
      
      switch (period) {
        case 'today':
          return alertDate >= twentyFourHoursAgo;
        case 'week':
          return alertDate < twentyFourHoursAgo && alertDate >= sevenDaysAgo;
        case 'month':
          return alertDate < sevenDaysAgo;
        default:
          return true;
      }
    });
    
    // Fonction pour mapper les alertes système
    const mapSystemAlerts = (alerts: any[]) => {
      return alerts
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
            const licensePlate = alert.vehicle_info?.split(' - ')[1] || 
                                alert.message?.split('Le véhicule ')[1]?.split(' est en attente')[0] || 
                                'Plaque inconnue';
            
            // Gérer les raisons vides ou non descriptives
            let displayReason = 'En attente de planification';
            if (alert.reason && 
                alert.reason.trim() !== '' && 
                alert.reason.toLowerCase() !== 'en attente' && 
                alert.reason.toLowerCase() !== 'attente') {
              displayReason = alert.reason;
            }
            
            return {
              type: 'critical' as const,
              icon: 'supplier' as const,
              title: 'Véhicule en attente',
              subtitle: `🚗 **${licensePlate.toUpperCase()}**`,
              description: `Véhicule immobilisé - Impact sur la productivité et satisfaction client`,
              impact: 'Immobilisation prolongée du véhicule client',
              suggestion: `Raison de l'attente: ${displayReason}`,
              metrics: [
                { value: licensePlate.toUpperCase(), label: '🚗 PLAQUE', unit: '' },
                { value: new Date(alert.created_at).toLocaleDateString('fr-FR'), label: 'Date mise en attente', unit: '' },
                { value: Math.ceil((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60)).toString(), label: 'Heures d\'attente', unit: 'h' }
              ],
              actions: [
                { 
                  label: 'Planifier', 
                  variant: 'primary' as const,
                  modalType: 'plan_vehicle_alert',
                  modalData: { 
                    title: 'Planifier le véhicule', 
                    alertId: alert.id, 
                    vehicleInfo: alert.vehicle_info,
                    vehicle: {
                      id: alert.vehicle_id || '',
                      brand: 'Marque non renseignée',
                      model: 'Modèle non renseigné', 
                      licensePlate: licensePlate,
                      client: 'Client non renseigné'
                    },
                    employees: employees || [],
                    companyId: companyData?.id || null,
                    reason: displayReason,
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
                  navigationTo: `/messageries?messageId=${alert.messagerie_id}`
                }
              ],
              modes: ['super_admin', 'chef_equipe', 'finance']
            };
          }
          return null;
        })
        .filter(Boolean);
    };

    const allMissions = {
      today: mapSystemAlerts(filteredAlerts),
      week: mapSystemAlerts(filteredAlerts),
      month: mapSystemAlerts(filteredAlerts)
    };

    // Filtrer par mode utilisateur
    const missions = allMissions[period] || [];
    return missions.filter((mission: any) => 
      mission.modes.includes(mode) || mode === 'super_admin'
    );
  };

  const currentMissions = getMissionsForPeriod(selectedPeriod, selectedMode);

  const iconMap = {
    supplier: Package,
    administration: Users,
    workshop: Wrench,
    planning: Calendar,
    cooling: FileText,
    weather: Eye,
    payment: FileText,
    insurance: FileText,
  };

  return (
    <div className="min-h-screen bg-background">
      <MissionControlHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        isAIOn={isAIOn}
        onAIToggle={handleAIToggle}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
      
      {/* Section Demandes de Documents */}
      <div className="mb-6">
        <DocumentRequestAlerts />
      </div>
      
      <div className="alert-cards-container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {currentMissions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucune mission pour cette période</h3>
              <p className="text-sm mt-2">Toutes les alertes ont été traitées ou aucune alerte n'est active pour le moment.</p>
            </div>
          </div>
        ) : (
          currentMissions.map((mission: any, index: number) => {
            const IconComponent = iconMap[mission.icon as keyof typeof iconMap] || Eye;
            return (
              <AlertCard
                key={index}
                type={mission.type}
                icon={mission.icon}
                title={mission.title}
                subtitle={mission.subtitle}
                description={mission.description}
                impact={mission.impact}
                suggestion={mission.suggestion}
                metrics={mission.metrics}
                actions={mission.actions}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default MissionControlDashboard;