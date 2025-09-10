import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Plus, Edit2, Trash2, Calendar, Users, Wrench, CheckCircle, Bell, Settings, User, LogOut, Search, Filter, Zap, Activity, Clock, Target } from 'lucide-react';
import { usePlanningManager, Vehicule } from '@/hooks/usePlanningManager';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useVehicleData } from '@/hooks/useVehicleData';
import { usePlanningTasks } from '@/hooks/usePlanningTasks';
import { SimpleTacheCard } from '@/components/planning/SimpleTacheCard';
import { DeplacerTacheModal } from '@/components/planning/DeplacerTacheModal';
import { VehiculeModal } from '@/components/VehiculeModal';
import { VehiculeDetailModal } from '@/components/VehiculeDetailModal';
import { VehiculeUrgenceModal } from '@/components/VehiculeUrgenceModal';
import { VehiculeDebloquerModal } from '@/components/VehiculeDebloquerModal';
import { VehiculePlanifierModal } from '@/components/VehiculePlanifierModal';
import { VehiculeModifierModal } from '@/components/VehiculeModifierModal';
import { NotificationCenter } from '@/components/NotificationCenter';
import { PlanningEmploye } from '@/components/PlanningEmploye';
import { EmployeStats } from '@/components/planning/EmployeStats';
import { TachesSection } from '@/components/planning/TachesSection';
import { PointageModal } from '@/components/PointageModal';
import { GestionPointageDropdown } from '@/components/GestionPointageDropdown';
import { RetourPauseModal } from '@/components/RetourPauseModal';
import { EmployePointageModal } from '@/components/EmployePointageModal';



import { useToast } from '@/hooks/use-toast';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { QuickActions, type QuickAction } from '@/components/ui/quick-actions';
import { aPointe as aPointeUtil, enregistrerArrivee, aPauseEnCours, enregistrerDepart, terminerPause } from '@/utils/pointageUtils';
import { getCurrentCompanyId } from '@/utils/pointageSupabaseUtils';
import { FloatingNotifications, type FloatingNotification } from '@/components/ui/floating-notifications';
import { useParentCommunication } from '@/hooks/useParentCommunication';

const CarrosseriePlanning = () => {
  console.log('🚀 COMPOSANT CARROSSERIE PLANNING CHARGÉ - DEBUT');
  const [selectedProcessCategory, setSelectedProcessCategory] = useState('accueil');
  const [showEmployeModal, setShowEmployeModal] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  const [showAttenteModal, setShowAttenteModal] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null);
  const [showVehiculeModal, setShowVehiculeModal] = useState(false);
  const [selectedPlanningTache, setSelectedPlanningTache] = useState<any>(null);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('etapes-atelier');
  
  // Parent communication integration
  const parentComm = useParentCommunication();
  
  // Local state for view management - Default to employee view
  const [localCurrentView, setLocalCurrentView] = useState<'manager' | 'employe'>('employe');
  const [selectedEmployeView, setSelectedEmployeView] = useState<string | null>(null);
  
  // Memoize parent-derived values to prevent recalculations
  const parentData = useMemo(() => {
    const parentCurrentView = parentComm.getCurrentView();
    const parentUserRole = parentComm.getUserRole();
    const parentEmployeeId = parentComm.getEmployeeId();
    const parentCompanyId = parentComm.getCompanyId();
    
    // Map parent view types to existing types
    const mappedView: 'manager' | 'employe' = parentCurrentView === 'employee' ? 'employe' : 'manager';
    const employeeIdString = parentEmployeeId ? parentEmployeeId : null;
    
    return {
      currentView: mappedView,
      userRole: parentUserRole,
      employeeId: employeeIdString,
      companyId: parentCompanyId,
    };
  }, [parentComm.isParentConnected, parentComm.getCurrentView(), parentComm.getUserRole(), parentComm.getEmployeeId(), parentComm.getCompanyId()]);
  
  // Final values that respect parent communication or fallback to local state
  const currentView = parentComm.isParentConnected ? parentData.currentView : localCurrentView;
  const finalSelectedEmployeView = parentComm.isParentConnected ? parentData.employeeId : selectedEmployeView;

  const [searchFilter, setSearchFilter] = useState('');
  const [floatingNotifications, setFloatingNotifications] = useState<FloatingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showVehiculeUrgenceModal, setShowVehiculeUrgenceModal] = useState(false);
  const [showDebloquerModal, setShowDebloquerModal] = useState(false);
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [selectedVehiculeAction, setSelectedVehiculeAction] = useState<any>(null);
  
  // États pour la gestion du pointage dans Vue Employé
  const [showPointageModal, setShowPointageModal] = useState(false);
  const [showRetourPauseModal, setShowRetourPauseModal] = useState(false);
  const [showEmployePointageModal, setShowEmployePointageModal] = useState(false);
  const [selectedEmployePointage, setSelectedEmployePointage] = useState<{id: string, nom: string} | null>(null);
  const [showDeplacerModal, setShowDeplacerModal] = useState(false);
  const [selectedTacheToMove, setSelectedTacheToMove] = useState<any>(null);
  
  const [aPointe, setAPointe] = useState(false);
  const [localCompanyId, setLocalCompanyId] = useState<string | null>(null);
  
  // Final values that respect parent communication or fallback to local state
  const companyId = parentComm.isParentConnected ? parentData.companyId : localCompanyId;

  // Récupérer le company_id au chargement du composant (only if not using parent)
  useEffect(() => {
    if (!parentComm.isParentConnected) {
      const fetchCompanyId = async () => {
        try {
          const id = await getCurrentCompanyId();
          setLocalCompanyId(id);
        } catch (error) {
          console.error('Erreur lors de la récupération du company_id:', error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les informations de l'entreprise",
            variant: "destructive",
          });
        }
      };
      
      fetchCompanyId();
    }
  }, [parentComm.isParentConnected]);
  
  

  const { toast } = useToast();

  // Enhanced floating notifications handler
  const dismissFloatingNotification = (id: string) => {
    setFloatingNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Récupérer les données réelles depuis la base de données
  console.log('🔍 CarrosseriePlanning: companyId utilisé pour les hooks:', {
    companyId,
    isParentConnected: parentComm.isParentConnected,
    parentCompanyId: parentData.companyId,
    localCompanyId,
    fullParentData: parentData,
    companyData: parentComm.companyData
  });
  
  // Log spécifique pour le debug du company ID
  console.log('🚨 DEBUG COMPANY ID COMPLET:', {
    'parentComm.getCompanyId()': parentComm.getCompanyId(),
    'parentComm.companyData': parentComm.companyData,
    'parentComm.companyData?.id': parentComm.companyData?.id,
    'parentComm.company?.id': parentComm.company?.id,
    'parentData.companyId': parentData.companyId,
    'companyId final': companyId,
    'Type de companyId': typeof companyId,
    'CompanyId truthy': !!companyId
  });
  
  // Log avant d'appeler useEmployeeData
  console.log('🚨 EMPLOYES DATA - AVANT APPEL HOOK:', {
    companyId,
    companyIdType: typeof companyId,
    companyIdString: String(companyId),
    aboutToCallHook: true
  });
  
  const { employees: employesFromData, loading: employesLoading, createEmployee, refetch: refetchEmployees } = useEmployeeData(companyId);
  
  // Log après l'appel du hook
  console.log('🚨 EMPLOYES DATA REÇUES:', {
    employesFromData,
    employesLength: employesFromData.length,
    employesLoading,
    companyId,
    companyIdType: typeof companyId
  });
  const { vehicles, loading: vehiclesLoading, refetch: refetchVehicles } = useVehicleData(companyId);
  const { planningTaches, getTasksForEmployee, getTasksForEmployeeById, getTodayTasks, loading: planningLoading, refetch: refetchPlanning } = usePlanningTasks(companyId);
  
  console.log('🚀 COMPOSANT CARROSSERIE PLANNING - HOOKS APPELÉS:', {
    employesFromDataLength: employesFromData.length,
    planningTachesLength: planningTaches.length,
    getTodayTasksLength: getTodayTasks().length,
    planningLoading,
    companyId
  });
  
  const {
    // employes, // Supprimé - on utilise employesFromData maintenant
    setEmployes,
    notifications,
    setNotifications,
    userRole: localUserRole,
    setUserRole,
    currentEmployeId,
    setCurrentEmployeId,
    calculerPlanningAutomatique,
    assignerTacheAutomatique,
    terminerTache,
    marquerNotificationLue,
    getNotificationsNonLues,
    getPlanningEmploye,
    ajouterVehiculeUrgence,
    deplacerTache
  } = usePlanningManager();

  // Utiliser les employés réels depuis la base de données
  const employes = employesFromData;
  
  // Memoize role calculations to prevent recalculations (AVANT la condition de loading)
  const roleInfo = useMemo(() => {
    console.log('🔧 CarrosseriePlanning: Calculating role info:', {
      isParentConnected: parentComm.isParentConnected,
      originalUserRole: parentData.userRole,
      localUserRole,
      permissions: parentComm.permissions,
      restrictedView: parentComm.permissions?.restrictedView
    });
    
    const originalUserRole = parentComm.isParentConnected ? parentData.userRole : localUserRole;
    
    // Use Supabase permissions directly instead of manual role comparisons
    const getUserRoleTyped = (): 'manager' | 'employe' => {
      if (parentComm.isParentConnected && parentComm.permissions) {
        // Use restrictedView from Supabase permissions
        return parentComm.permissions.restrictedView === 'employee' ? 'employe' : 'manager';
      }
      return localUserRole;
    };
    
    const userRole = getUserRoleTyped();
    
    // Use Supabase permissions for access control
    const isEmployeeRole = parentComm.isParentConnected && parentComm.permissions ? parentComm.permissions.viewOnly : (localUserRole === 'employe');
    const canManageUsers = parentComm.isParentConnected && parentComm.permissions ? parentComm.permissions.canManage : (localUserRole === 'manager');
    const canSwitchViews = parentComm.isParentConnected && parentComm.permissions ? 
      (parentComm.permissions.restrictedView !== 'employee' && parentComm.permissions.restrictedView !== 'manager' && parentComm.permissions.canManage) : 
      (localUserRole === 'manager');
    
    return {
      originalUserRole,
      userRole,
      isCarrossier: isEmployeeRole, // Keep same property name for compatibility
      isResponsable: canManageUsers, // Keep same property name for compatibility
      canSwitchViews
    };
  }, [parentComm.isParentConnected, parentData.userRole, localUserRole, parentComm.permissions]);
  
  const { originalUserRole, userRole, isCarrossier, isResponsable, canSwitchViews } = roleInfo;
  
  // Automatically set view based on JWT role permissions (AVANT la condition de loading)
  useEffect(() => {
    console.log('🔧 CarrosseriePlanning: useEffect triggered for role restrictions:', {
      isCarrossier,
      isResponsable,
      currentView,
      parentConnected: parentComm.isParentConnected,
      parentEmployeeId: parentData.employeeId,
      restrictedView: parentComm.permissions?.restrictedView || null
    });

    // When connected to parent app, use JWT role permissions directly
    if (parentComm.isParentConnected && parentComm.permissions) {
      const { restrictedView, viewOnly } = parentComm.permissions;
      
      console.log('🔧 JWT Role Processing:', {
        userRole: parentData.userRole, 
        restrictedView,
        viewOnly,
        permissions: parentComm.permissions,
        currentView: currentView
      });
      
      // Force employee view for employees or restricted users  
      if (restrictedView === 'employee') {
        console.log('🔒 JWT: Affichage vue employé automatique pour role:', parentData.userRole);
        if (currentView !== 'employe') {
          setLocalCurrentView('employe');
          setUserRole('employe'); // Set correct user role
        }
        
        // Auto-select the employee based on JWT employee ID
        if (parentData.employeeId && selectedEmployeView !== parentData.employeeId) {
          console.log('👤 JWT: Auto-sélection employé ID:', parentData.employeeId);
          setSelectedEmployeView(parentData.employeeId);
        }
      } else if (restrictedView === 'manager') {
        // Force manager view for responsables - they can only see manager view
        console.log('🔒 JWT: FORÇAGE vue manager pour role:', parentData.userRole, 'currentView:', currentView);
        if (currentView !== 'manager') {
          console.log('🔒 JWT: CHANGEMENT vers manager view');
          setLocalCurrentView('manager');
          setUserRole('manager');
        }
      } else if (restrictedView === null) {
        // No restriction - allow switching between views, default to manager for owners/admins
        if (parentData.userRole === 'Propriétaire' || parentData.userRole === 'Gestionnaire d\'inventaire') {
          console.log('📊 JWT: Affichage vue manager pour propriétaire/gestionnaire:', parentData.userRole);
          setLocalCurrentView('manager');
          setUserRole('manager');
        } else {
          console.log('👤 JWT: Pas de restriction spécifique pour role:', parentData.userRole);
          // Keep current view or default to employee
          if (currentView !== 'manager' && currentView !== 'employe') {
            setLocalCurrentView('employe');
            setUserRole('employe');
          }
        }
      }
      return;
    }

    // Standalone mode fallback logic - Default to employee view
    if (isCarrossier && currentView !== 'employe') {
      console.log('🔄 Standalone: Passage en vue employé');
      setLocalCurrentView('employe');
      setUserRole('employe');
    } else if (isResponsable && currentView !== 'manager') {
      console.log('🔄 Standalone: Passage en vue manager');  
      setLocalCurrentView('manager');
      setUserRole('manager');
    }
  }, [parentComm.isParentConnected, parentComm.permissions, parentData.employeeId, isCarrossier, isResponsable]);

  // Initialisation simplifiée - maintenant géré par les données réelles
  useEffect(() => {
    // Notifications d'exemple (une seule fois) - seulement si nécessaire pour les tests
    if (notifications.length === 0) {
      const notificationsExemple = [
        {
          id: 'notif_1',
          type: 'nouvelle_tache' as const,
          titre: 'Nouvelle tâche assignée',
          message: 'Débosselage portière - VS-901-AB (Audi A4)',
          employeId: "1",
          vehiculeId: 3,
          tacheId: 'lundi_1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          lue: false
        }
      ];
      setNotifications?.(notificationsExemple);
    }
  }, [notifications.length, setNotifications]); // Dépendance sécurisée

  // Vérifier si l'employé a pointé aujourd'hui (AVANT la condition de loading)
  useEffect(() => {
    console.log('useEffect triggered - selectedEmployeView:', selectedEmployeView, 'currentView:', currentView);
    
    if (selectedEmployeView && currentView === 'employe') {
      const employe = employesFromData.find(e => e.user_id === selectedEmployeView || e.nom === selectedEmployeView);
      const employeNom = employe?.nom || '';
      
      const checkEmployeeStatus = async () => {
        try {
          const aPointeAujourdhui = await aPointeUtil(selectedEmployeView);
          const enPause = await aPauseEnCours(selectedEmployeView);
          
          console.log(`DEBUG - Checking pointage for employee ${selectedEmployeView}:`, {
            aPointeAujourdhui,
            enPause
          });
          
          setAPointe(aPointeAujourdhui);
          
          // ❌ SYSTÈME DE POINTAGE DÉSACTIVÉ ICI
          // Le pointage est maintenant géré exclusivement par usePointageStatus
          console.log('🚫 CarrosseriePlanning - Système pointage DÉSACTIVÉ');
          console.log('✅ Pointage géré par usePointageStatus dans PlanningEmploye');
          
          // Forcer la fermeture de tous les modals pour éviter les conflits
          setShowPointageModal(false);
          setShowRetourPauseModal(false);
          
          /*
          // Ancienne logique désactivée :
          if (!aPointeAujourdhui) {
            console.log('Employee has not punched in, showing pointage modal');
            setShowPointageModal(true);
          } else if (enPause) {
            console.log('Employee is on break, showing return from break modal');
            setShowRetourPauseModal(true);
          } else {
            console.log('Employee already punched in and not on break, not showing modal');
            setShowPointageModal(false);
            setShowRetourPauseModal(false);
          }
          */
        } catch (error) {
          console.error('Error checking employee status:', error);
          // En cas d'erreur, réinitialiser les états
          setShowPointageModal(false);
          setShowRetourPauseModal(false);
          setAPointe(false);
        }
      };
      
      checkEmployeeStatus();
    } else {
      // Réinitialiser les états si on n'est pas en vue employé
      setShowPointageModal(false);
      setShowRetourPauseModal(false);
      setAPointe(false);
    }
  }, [selectedEmployeView, currentView, employes]);

  // Véhicules en attente avec raisons de blocage (AVANT la condition de loading)
  const [vehiculesEnAttente, setVehiculesEnAttente] = useState([
    {
      id: 101,
      plaque: 'AB-123-CD',
      modele: 'Peugeot 308',
      etapeBloquee: 'Réparation carrosserie',
      raisonBlocage: 'Attente pièces',
      detailBlocage: 'Pare-chocs avant en commande - Délai 5-7 jours',
      dateAttente: '2025-01-02',
      priorite: 'normale',
      prix: '2500€',
      client: 'M. Dupont'
    },
    {
      id: 102,
      plaque: 'FG-456-GH',
      modele: 'Renault Megane',
      etapeBloquee: 'Peinture',
      raisonBlocage: 'Validation assurance',
      detailBlocage: 'Expertise complémentaire requise - RDV expert lundi',
      dateAttente: '2025-01-06',
      priorite: 'haute',
      prix: '3800€',
      client: 'Mme Martin'
    },
    {
      id: 103,
      plaque: 'PQ-012-UV',
      modele: 'BMW Série 3',
      etapeBloquee: 'Préparation',
      raisonBlocage: 'Attente technicien',
      detailBlocage: 'Spécialiste BMW requis - Disponible jeudi',
      dateAttente: '2025-01-03',
      priorite: 'normale',
      prix: '3200€',
      client: 'M. Leroy'
    },
    {
      id: 104,
      plaque: 'XY-789-ZA',
      modele: 'Volkswagen Golf',
      etapeBloquee: 'Peinture',
      raisonBlocage: 'Problème découvert',
      detailBlocage: 'Corrosion cachée détectée - Devis supplémentaire requis',
      dateAttente: '2025-01-02',
      priorite: 'normale',
      prix: '1800€',
      client: 'M. Durand'
    },
    {
      id: 105,
      plaque: 'BC-345-EF',
      modele: 'Mercedes Classe A',
      etapeBloquee: 'Finitions',
      raisonBlocage: 'Pièces sur commande',
      detailBlocage: 'Optiques LED spécifiques - Délai constructeur 10 jours',
      dateAttente: '2024-12-28',
      priorite: 'normale',
      prix: '4100€',
      client: 'Mme Dubois'
    }
  ]);

  // État pour nouvel employé (AVANT la condition de loading)
  const [nouvelEmploye, setNouvelEmploye] = useState({
    nom: '',
    email: '',
    telephone: '',
    qualifications: [],
    actif: true
  });

  // Remplacer le state hardcodé par les données réelles du planning (AVANT la condition de loading)
  const planningDetaille = useMemo(() => {
    // Convertir les tâches en format détaillé par jour
    const detailsByDay = {
      lundi: [],
      mardi: [],
      mercredi: [],
      jeudi: [],
      vendredi: [],
      samedi: [],
      dimanche: []
    };
    
    planningTaches.forEach(tache => {
      const jour = tache.jour || 'lundi';
      if (detailsByDay[jour]) {
        detailsByDay[jour].push({
          vehicule: tache.vehicule,
          modele: tache.modele,
          heure: tache.heure,
          technicien: tache.technicien,
          tache: tache.tache,
          etape: tache.etape,
          client: tache.client
        });
      }
    });
    
    return detailsByDay;
  }, [planningTaches]);

  // Debug: Afficher les données réelles chargées
  console.log('🔍 CarrosseriePlanning: Données réelles chargées:', {
    employesFromData,
    vehicles,
    planningTaches,
    employesLoading,
    vehiclesLoading,
    planningLoading,
    companyId,
    refreshCallbacks: {
      refetchEmployees,
      refetchVehicles,
      refetchPlanning
    }
  });

  // Affichage du loading pendant que les données se chargent (APRÈS TOUS les hooks)
  if (employesLoading || vehiclesLoading || planningLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Chargement des données en cours...</p>
        </div>
      </div>
    );
  }
  
  // Handler pour ajouter un véhicule d'urgence
  const handleAjouterVehiculeUrgence = async (vehiculeUrgence: {
    plaque: string;
    nom: string;
    prenom: string;
    heure: string;
    employeId: string;
  }) => {
    console.log('handleAjouterVehiculeUrgence called with:', vehiculeUrgence);
    
    // Récupérer le companyId depuis le contexte parent
    const companyId = parentComm.companyId;
    
    const result = await ajouterVehiculeUrgence(vehiculeUrgence, companyId, {
      refetchEmployees,
      refetchVehicles,
      refetchPlanning // Connecter le vrai refetch du planning
    });
    
    if (result.success) {
      toast({
        title: "🚨 Véhicule d'urgence ajouté",
        description: `${vehiculeUrgence.plaque} assigné à ${employesFromData.find(e => e.user_id === vehiculeUrgence.employeId.toString() || e.id === vehiculeUrgence.employeId.toString())?.nom} à ${vehiculeUrgence.heure}`,
        duration: 5000,
      });

      // Ajouter notification flottante
      const newFloatingNotif: FloatingNotification = {
        id: `urgent_${Date.now()}`,
        title: "Véhicule urgent ajouté",
        message: `${vehiculeUrgence.plaque} - Traitement immédiat ${companyId ? '(Persisté en BD)' : '(Local)'}`,
        type: "success",
        duration: 8000,
        actions: [{
          label: "Voir planning",
          onClick: () => {
            setLocalCurrentView('employe' as 'employe');
            setSelectedEmployeView(vehiculeUrgence.employeId.toString());
          }
        }]
      };
      
      setFloatingNotifications(prev => [newFloatingNotif, ...prev]);

      // Déclencher le rafraîchissement des données si persisté en BD
      if (companyId) {
        if (refetchEmployees) {
          refetchEmployees();
        }
        if (refetchVehicles) {
          refetchVehicles();
        }
      }
    } else {
      toast({
        title: "❌ Erreur",
        description: result.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  // Handlers pour les actions véhicules en attente
  const handleDebloquer = (vehiculeId: number, solution: string, notes: string) => {
    setVehiculesEnAttente(prev => prev.filter(v => v.id !== vehiculeId));
    toast({
      title: "Véhicule débloqué avec succès",
      description: `Solution appliquée: ${solution}`,
    });
    setShowDebloquerModal(false);
    setSelectedVehiculeAction(null);
  };

  const handlePlanifier = (vehiculeId: number, employeId: string, datePrevu: string, heurePrevu: string, notes: string) => {
    const vehicule = vehiculesEnAttente.find(v => v.id === vehiculeId);
    const employe = employesFromData.find(e => e.user_id === employeId || e.id === employeId);
    if (vehicule && employe) {
      // Retirer le véhicule de la liste d'attente
      setVehiculesEnAttente(prev => prev.filter(v => v.id !== vehiculeId));
      
      // Convertir la date en nom de jour français pour la cohérence
      const jourFrancais = new Date(datePrevu).toLocaleDateString('fr-FR', { weekday: 'long' });
      
      // Créer une nouvelle tâche planifiée et l'ajouter au planning de l'employé
      const nouvelleTache = {
        id: `planif_${Date.now()}`,
        vehiculeId: vehicule.id,
        vehicule: vehicule.plaque,
        modele: vehicule.modele,
        heure: `${heurePrevu}-${parseInt(heurePrevu.split(':')[0]) + 2}:${heurePrevu.split(':')[1]}`,
        technicien: employe.nom,
        tache: vehicule.etapeBloquee,
        etape: vehicule.etapeBloquee.toLowerCase(),
        client: vehicule.client,
        duree: 2, // Durée par défaut de 2h
        status: 'planifie' as const,
        dateCreation: new Date(),
        jour: jourFrancais  // Utiliser le format français (lundi, mardi, etc.)
      };

      // Ajouter la tâche au planning de l'employé
      setEmployes(prev => prev.map(emp => 
        emp.id === employeId
          ? { 
              ...emp, 
              planningJour: [...(emp.planningJour || []), nouvelleTache]
            }
          : emp
      ));

      // TODO: La mise à jour du planning détaillé se fera via la base de données
      // Le planning sera rechargé automatiquement depuis useRealPlanningData
      
      toast({
        title: "Véhicule planifié avec succès",
        description: `${vehicule.plaque} assigné à ${employe.nom} le ${new Date(datePrevu).toLocaleDateString()} à ${heurePrevu}`,
      });
    }
    setShowPlanifierModal(false);
    setSelectedVehiculeAction(null);
  };

  const handleModifier = (vehiculeId: number, modifications: any) => {
    setVehiculesEnAttente(prev => 
      prev.map(v => v.id === vehiculeId ? { ...v, ...modifications } : v)
    );
    toast({
      title: "Véhicule modifié avec succès",
      description: "Les informations ont été mises à jour",
    });
    setShowModifierModal(false);
    setSelectedVehiculeAction(null);
  };

  // Handler pour déplacer une tâche
  const handleDeplacerTache = (tacheId: string, nouvelEmployeId: string, nouveauJour: string, nouvelleHeure: string) => {
    try {
      deplacerTache(tacheId, nouvelEmployeId, nouveauJour, nouvelleHeure);
      toast({
        title: "Tâche déplacée avec succès",
        description: `La tâche a été assignée au nouvel employé`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de déplacer la tâche",
        variant: "destructive",
      });
    }
  };

  // Gestion du pointage pour Vue Employé
  const handlePointer = () => {
    if (selectedEmployeView) {
      console.log('handlePointer called for employee:', selectedEmployeView);
      const heureActuelle = enregistrerArrivee(selectedEmployeView);
      console.log('Pointage saved:', heureActuelle);
      
      // Fermer le modal et mettre à jour l'état immédiatement
      setShowPointageModal(false);
      setAPointe(true);
      console.log('aPointe state immediately set to:', true);
      
      toast({
        title: "Pointage enregistré",
        description: `Pointage de ${heureActuelle} enregistré avec succès.`,
      });
    }
  };

  // Handlers pour la gestion des pointages dans la vue employé
  const handleDepointer = () => {
    if (selectedEmployeView) {
      const heureActuelle = enregistrerDepart(selectedEmployeView);
      setAPointe(false);
      
      toast({
        title: "👋 Fin de journée",
        description: `Dépointe enregistré à ${heureActuelle}. À bientôt !`,
      });
    }
  };

  const handlePauseStart = () => {
    // La gestion des pauses se fait maintenant directement dans le dropdown
    // Pas besoin d'ouvrir un modal séparé
  };

  const handlePauseEnd = () => {
    // La fin de pause se fait maintenant directement dans le dropdown
    // Pas besoin de logique spéciale ici
  };

  const handleRevenirDePause = () => {
    if (selectedEmployeView) {
      const heureRetour = terminerPause(selectedEmployeView);
      setShowRetourPauseModal(false);
      
      if (heureRetour) {
        toast({
          title: "🎯 Retour de pause",
          description: `Reprise du travail à ${heureRetour}. Bon courage !`,
        });
      }
    }
  };


  // Données des étapes atelier organisées par étapes du processus
  const vehiculesParEtape = {
    accueil: [
      { id: 1, plaque: 'EZ-787-KL', modele: 'Citroën C4', sousEtape: 'Devis en cours', temps: '0.5h', prix: '800€', status: 'en_cours', client: 'M. Durand', technicien: 'Martin Dubois' },
      { id: 2, plaque: 'QR-345-ST', modele: 'Mercedes Classe C', sousEtape: 'Expertise assurance', temps: '1h', prix: '400€', status: 'planifier', client: 'Mme Leclerc', technicien: null }
    ],
    remplacement: [
      { id: 3, plaque: 'VS-901-AB', modele: 'Audi A4', sousEtape: 'Débosselage portière', temps: '2h', prix: '520€', status: 'en_cours', client: 'M. Bernard', technicien: 'Sophie Martin' },
      { id: 4, plaque: 'HT-556-GH', modele: 'BMW Série 1', sousEtape: 'Remplacement pare-chocs', temps: '3h', prix: '950€', status: 'planifier', client: 'M. Rousseau', technicien: null }
    ],
    preparation: [
      { id: 5, plaque: 'AB-789-XY', modele: 'Peugeot 308', sousEtape: 'Ponçage aile avant', temps: '2.5h', prix: '680€', status: 'en_cours', client: 'Mme Moreau', technicien: 'Sophie Martin' }
    ],
    peinture: [
      { id: 6, plaque: 'CD-123-ZW', modele: 'Renault Clio', sousEtape: 'Application base', temps: '4h', prix: '1200€', status: 'en_cours', client: 'M. Petit', technicien: 'Sophie Martin' }
    ],
    finitions: [
      { id: 7, plaque: 'EF-456-UV', modele: 'Volkswagen Golf', sousEtape: 'Polissage final', temps: '1.5h', prix: '350€', status: 'en_cours', client: 'Mme Blanc', technicien: 'Martin Dubois' }
    ],
    cloture: [
      { id: 8, plaque: 'GH-789-ST', modele: 'Ford Focus', sousEtape: 'Contrôle qualité', temps: '0.5h', prix: '80€', status: 'en_cours', client: 'M. Roux', technicien: 'Martin Dubois' }
    ]
  };

  // Calcul des statistiques totales
  const totalVehicules = Object.values(vehiculesParEtape).flat().length;
  const stats = {
    vehicules: totalVehicules,
    termines: 0,
    enAttente: vehiculesEnAttente.length,
    ca: '18700€'
  };

  // planningDetaille maintenant défini avant la condition de loading

  // Qualifications
  const qualifications = [
    { id: 'accueil', name: 'Accueil & Préparation du dossier', color: 'bg-primary/10 text-primary' },
    { id: 'remplacement', name: 'Remplacement ou débosselage', color: 'bg-success/10 text-success' },
    { id: 'preparation', name: 'Préparation peinture', color: 'bg-warning/10 text-warning' },
    { id: 'peinture', name: 'Mise en peinture', color: 'bg-destructive/10 text-destructive' },
    { id: 'finitions', name: 'Finitions & remontage', color: 'bg-accent/20 text-accent-foreground' },
    { id: 'cloture', name: 'Clôture du dossier et livraison', color: 'bg-muted text-muted-foreground' }
  ];

  // Employés - maintenant géré par le hook usePlanningManager

  // Process data
  const processData = {
    accueil: {
      title: "ACCUEIL & PRÉPARATION DU DOSSIER",
      color: "border-primary bg-primary/5",
      interventions: [
        { type: "Sinistre simple (rayure, petite bosse)", temps: "30-45 min", details: "Devis rapide, photos basiques" },
        { type: "Sinistre moyen (plusieurs éléments)", temps: "45-75 min", details: "Devis détaillé, multiple photos, recherche pièces" },
        { type: "Gros sinistre (structure touchée)", temps: "1-2 heures", details: "Expertise approfondie, mesures, négociation expert" },
        { type: "Véhicule de luxe/collection", temps: "1-3 heures", details: "Documentation spéciale, photos détaillées, recherche pièces spécifiques" }
      ]
    },
    remplacement: {
      title: "REMPLACEMENT OU DÉBOSSELAGE",
      color: "border-success bg-success/5",
      interventions: [
        { type: "Petit impact (grêle, parking)", temps: "30 min - 1h", details: "Par impact, débosselage sans peinture" },
        { type: "Bosse moyenne", temps: "1-3 heures", details: "Débosselage traditionnel ou à la ventouse" },
        { type: "Grosse déformation", temps: "3-6 heures", details: "Martelage, planage, multiple passes" },
        { type: "Pare-chocs avant/arrière", temps: "2-4 heures", details: "Démontage, préparation, montage" },
        { type: "Aile avant", temps: "3-5 heures", details: "Soudure nécessaire" }
      ]
    },
    preparation: {
      title: "PRÉPARATION PEINTURE",
      color: "border-warning bg-warning/5",
      interventions: [
        { type: "Retouche localisée", temps: "1-2 heures", details: "Ponçage local, masquage précis" },
        { type: "Un élément (aile, portière)", temps: "2-3 heures", details: "Ponçage complet, apprêt si nécessaire" },
        { type: "Plusieurs éléments adjacents", temps: "3-4 heures", details: "Raccordement des zones" },
        { type: "Véhicule complet", temps: "6-8 heures", details: "Ponçage intégral, masquage complexe" }
      ]
    },
    peinture: {
      title: "MISE EN PEINTURE",
      color: "border-destructive bg-destructive/5",
      interventions: [
        { type: "Retouche au pinceau", temps: "30 min", details: "Séchage rapide" },
        { type: "Retouche pistolet (petit élément)", temps: "1-2 heures", details: "2-3 couches + vernis" },
        { type: "Un élément standard", temps: "2-3 heures", details: "Base + vernis, séchage" },
        { type: "Plusieurs éléments", temps: "3-5 heures", details: "Plusieurs passages cabine" },
        { type: "Véhicule complet", temps: "6-10 heures", details: "Multiple couches, séchage étagé" }
      ]
    },
    finitions: {
      title: "FINITIONS & REMONTAGE",
      color: "border-accent bg-accent/5",
      interventions: [
        { type: "Finitions simples", temps: "1-2 heures", details: "Polissage léger, remontage basique" },
        { type: "Finitions standard", temps: "2-3 heures", details: "Polissage, lustrage, remontage complet" },
        { type: "Finitions haut de gamme", temps: "3-5 heures", details: "Polissage multi-étapes, cire protection" }
      ]
    },
    cloture: {
      title: "CLÔTURE & LIVRAISON",
      color: "border-muted bg-muted/5",
      interventions: [
        { type: "Livraison simple", temps: "15-30 min", details: "Nettoyage, remise clés" },
        { type: "Livraison avec explications", temps: "30-45 min", details: "Tour du véhicule, conseils entretien" },
        { type: "Formalités assurance", temps: "+15-30 min", details: "Signatures, photos finales" }
      ]
    }
  };

  const recapSinistres = [
    { categorie: "Micro-rayure/retouche", tempsTotal: "2-4 heures", dureeCalendaire: "1 jour" },
    { categorie: "Sinistre léger (pare-chocs, rayures)", tempsTotal: "6-12 heures", dureeCalendaire: "1-2 jours" },
    { categorie: "Sinistre moyen (1-2 éléments)", tempsTotal: "12-20 heures", dureeCalendaire: "2-3 jours" },
    { categorie: "Sinistre important (3+ éléments)", tempsTotal: "20-40 heures", dureeCalendaire: "3-7 jours" },
    { categorie: "Gros sinistre (structure touchée)", tempsTotal: "40-80 heures", dureeCalendaire: "1-3 semaines" },
    { categorie: "Sinistre majeur (reconstruction)", tempsTotal: "80-200 heures", dureeCalendaire: "3-8 semaines" }
  ];

  const facteursAllongement = [
    { facteur: "Attente pièces", impact: "+2-15 jours", observation: "Variable selon constructeur/modèle" },
    { facteur: "Expertise assurance", impact: "+1-5 jours", observation: "Rendez-vous expert" },
    { facteur: "Pièces sur commande", impact: "+3-30 jours", observation: "Véhicules anciens/rares" },
    { facteur: "Problèmes découverts", impact: "+20-100%", observation: "Dégâts cachés révélés" }
  ];

  const getStatusVariant = (status) => {
    switch(status) {
      case 'en_cours': return 'default';
      case 'planifie': return 'secondary';
      case 'en_attente': return 'destructive';
      case 'planifier': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'en_cours': return 'En cours';
      case 'planifie': return 'Planifié';
      case 'en_attente': return 'En attente';
      case 'planifier': return 'À planifier';
      default: return 'Inconnu';
    }
  };

  const ajouterEmploye = async () => {
    if (nouvelEmploye.nom && nouvelEmploye.email && nouvelEmploye.qualifications.length > 0) {
      console.log('🔄 CarrosseriePlanning: Creating new employee:', nouvelEmploye);
      
      const success = await createEmployee({
        nom: nouvelEmploye.nom,
        email: nouvelEmploye.email,
        telephone: nouvelEmploye.telephone,
        qualifications: nouvelEmploye.qualifications
      });
      
      if (success) {
        toast({
          title: "Employé créé avec succès",
          description: `${nouvelEmploye.nom} a été ajouté à l'équipe`,
        });
        
        setNouvelEmploye({
          nom: '',
          email: '',
          telephone: '',
          qualifications: [],
          actif: true
        });
        setShowEmployeModal(false);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer l'employé",
          variant: "destructive",
        });
      }
    }
  };

  const modifierEmploye = () => {
    if (editingEmploye && editingEmploye.nom && editingEmploye.email) {
      // Note: Cette fonctionnalité nécessite une implémentation côté base de données
      console.warn('Modification d\'employé non implémentée avec employesFromData');
      setEditingEmploye(null);
      setShowEmployeModal(false);
    }
  };

  const supprimerEmploye = (id) => {
    // Note: Cette fonctionnalité nécessite une implémentation côté base de données
    console.warn('Suppression d\'employé non implémentée avec employesFromData');
  };


  const toggleQualification = (qualificationId, isEditing = false) => {
    const target = isEditing ? editingEmploye : nouvelEmploye;
    const setter = isEditing ? setEditingEmploye : setNouvelEmploye;
    
    const newQualifications = target.qualifications.includes(qualificationId)
      ? target.qualifications.filter(q => q !== qualificationId)
      : [...target.qualifications, qualificationId];
    
    setter({ ...target, qualifications: newQualifications });
  };

  const debloquerVehicule = (vehiculeId) => {
    const vehicule = vehiculesEnAttente.find(v => v.id === vehiculeId);
    setVehiculesEnAttente(vehiculesEnAttente.filter(v => v.id !== vehiculeId));
    
    console.log(`Véhicule ${vehicule.plaque} débloqué et réintégré dans les étapes atelier`);
    
    if (vehiculesEnAttente.length === 1) {
      setShowAttenteModal(false);
    }
  };

  const getPrioriteVariant = (priorite) => {
    switch(priorite) {
      case 'urgente': return 'destructive';
      case 'haute': return 'outline';
      case 'normale': return 'secondary';
      case 'basse': return 'outline';
      default: return 'outline';
    }
  };

  const getJoursAttente = (dateAttente: string) => {
    const aujourdHui = new Date();
    const dateAttente_date = new Date(dateAttente);
    const diffTime = Math.abs(aujourdHui.getTime() - dateAttente_date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fonction pour terminer une tâche
  const terminerTacheEmploye = (tacheId: string) => {
    const employe = employesFromData.find(emp => emp.user_id === selectedEmployeView || emp.id === selectedEmployeView);
    if (employe) {
      terminerTache(tacheId, employe.user_id);
      toast({
        title: "Tâche terminée",
        description: "L'étape suivante sera automatiquement assignée",
      });
    }
  };

  // Fonction utilitaire pour trier les tâches par ordre chronologique
  const trierTachesParHeure = (taches: any[]) => {
    const getHeureEnMinutes = (heure: string): number => {
      try {
        const debut = heure.split('-')[0];
        const parts = debut.trim().split('h');
        const heureNum = parseInt(parts[0], 10);
        const minutesNum = parts[1] ? parseInt(parts[1], 10) : 0;
        return heureNum * 60 + minutesNum;
      } catch (error) {
        console.warn('Format d\'heure non reconnu:', heure);
        return 999999; // Placer à la fin si format incorrect
      }
    };

    return [...taches].sort((a, b) => {
      const heureA = getHeureEnMinutes(a.heure);
      const heureB = getHeureEnMinutes(b.heure);
      return heureA - heureB;
    });
  };

  // Rendu de la vision employé - Utilise maintenant le composant PlanningEmploye
  const renderVisionEmploye = () => {
    const employe = employesFromData.find(emp => emp.user_id === selectedEmployeView || emp.id === selectedEmployeView);
    if (!employe) {
      console.log('DEBUG - Employee not found for selectedEmployeView:', selectedEmployeView);
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Récupérer les tâches réelles depuis useVehicleData (planning réel)
    const tachesReelles = vehicles.filter(vehicle => 
      vehicle.technicien && vehicle.technicien.includes(`${employe.nom}`)
    );
    
    console.log('🚨 DEBUG - Données réelles pour employé:', {
      employeNom: employe.nom,
      employeId: employe.id,
      tachesReelles,
      vehiclesTotal: vehicles.length
    });
    
    // Mapper les données réelles vers le format PlanningTache
    const tachesAujourdhui = tachesReelles.map(vehicle => ({
      id: vehicle.id,
      vehiculeId: parseInt(vehicle.id) || 0,
      vehicule: vehicle.plaque,
      modele: vehicle.modele,
      heure: vehicle.temps ? `8h-${(8 + parseFloat(vehicle.temps.replace('h', ''))).toFixed(0)}h` : '8h-10h',
      technicien: employe.nom,
      tache: vehicle.etape,
      etape: vehicle.sousEtape,
      client: vehicle.client,
      duree: parseFloat(vehicle.temps?.replace('h', '') || '2'),
      status: vehicle.status as any,
      dateCreation: new Date(),
      dateAssignation: today,
      jour: 'aujourd\'hui'
    }));
    
    console.log('🔄 Tâches mappées pour PlanningEmploye:', tachesAujourdhui);

    const notificationsEmploye = getNotificationsNonLues(employe.user_id);

    return (
      <div className="space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mon Planning - {employe.nom}</h2>
          <div className="flex gap-2">
            {canSwitchViews && (
              <Button
                variant="outline"
                onClick={() => {
                  console.log('🔄 Passage en vue manager');
                  setLocalCurrentView('manager');
                  setUserRole('manager');
                  setSelectedEmployeView(null);
                  console.log('✅ UserRole changé vers manager');
                }}
                className="text-sm"
              >
                Vue Manager
              </Button>
            )}
            {notificationsEmploye.length > 0 && (
              <Badge variant="destructive">{notificationsEmploye.length}</Badge>
            )}
          </div>
        </div>

        {/* ✅ UTILISATION DU COMPOSANT PlanningEmploye avec le hook usePointageStatus */}
        <PlanningEmploye
          employe={employe}
          taches={(() => {
            console.log('🔍 CarrosseriePlanning: Récupération tâches pour employé:', {
              employeId: employe.id,
              employeUserId: employe.user_id,
              employeNom: employe.nom,
              searchingBy: 'user_id'
            });
            
            // Utiliser user_id si disponible, sinon fallback sur id, puis nom
            const searchKey = employe.user_id || employe.id;
            let taches = [];
            
            if (employe.user_id) {
              // Priorité à la recherche par user_id (système optimal)
              taches = getTasksForEmployeeById(employe.user_id);
              console.log('🎯 Recherche par user_id:', employe.user_id, 'résultat:', taches.length);
            }
            
            // Si pas de résultats par user_id, essayer par nom (fallback)
            if (taches.length === 0) {
              taches = getTasksForEmployee(employe.nom);
              console.log('🔄 Fallback par nom:', employe.nom, 'résultat:', taches.length);
            }
            
            console.log('📊 Tâches trouvées:', {
              employeUserId: employe.user_id,
              employeNom: employe.nom,
              taskCount: taches.length,
              tasks: taches.map(t => ({
                id: t.id,
                vehicule: t.vehicule,
                technicien: t.technicien,
                dateAssignation: t.dateAssignation,
                user_id: t.user_id
              }))
            });
            
            return taches;
          })()}
          onTerminerTache={(tacheId) => {
            setEmployes(prev => prev.map(emp => 
              emp.id === employe.id 
                ? {
                    ...emp,
                    planningJour: emp.planningJour?.map(t => 
                      t.id === tacheId ? { ...t, status: 'termine' as const } : t
                    )
                  }
                : emp
            ));
            toast({
              title: "Tâche terminée",
              description: `Tâche marquée comme terminée`,
            });
          }}
          onVoirVehicule={(vehiculeId) => {
            const tache = tachesAujourdhui.find(t => t.vehiculeId === vehiculeId);
            if (tache) {
              setSelectedVehicule({
                id: tache.vehiculeId,
                plaque: tache.vehicule,
                modele: tache.modele,
                client: tache.client,
                sousEtape: tache.tache,
                etape: tache.etape,
                technicien: tache.technicien,
                status: tache.status,
                temps: `${tache.duree}h`,
                prix: '500€'
              });
              setShowVehiculeModal(true);
            }
          }}
          userRole={userRole} // ✅ CRITIQUE: Passer le userRole correct ('employe')
          companyId={companyId || "temp-company-id"}
        />

        {/* Notifications pour l'employé */}
        {notificationsEmploye.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications ({notificationsEmploye.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationsEmploye.map((notif) => (
                  <div 
                    key={notif.id}
                    className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{notif.titre}</div>
                      <div className="text-sm text-muted-foreground">{notif.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {notif.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => marquerNotificationLue(notif.id)}
                    >
                      Marquer comme lu
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Sélecteur de vue en haut
  const renderViewSelector = () => (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-3 sm:p-4">
        {/* Affichage des restrictions de rôle */}
        {(isCarrossier || isResponsable || (parentComm.isParentConnected && parentComm.permissions?.restrictedView === 'employee')) && (
          <div className="mb-3 p-2 bg-muted rounded-md text-sm text-muted-foreground">
            {isCarrossier && "🔒 Accès limité : Vue employé uniquement (Rôle: Carrossier)"}
            {isResponsable && !isCarrossier && "🔒 Accès limité : Vue manager uniquement (Rôle: Responsable)"}
            {parentComm.isParentConnected && parentComm.permissions?.restrictedView === 'manager' && "🔒 Accès limité : Vue manager uniquement (Rôle: Responsable)"}
            {parentComm.isParentConnected && parentComm.permissions?.restrictedView === 'employee' && "🔒 Accès limité : Vue employé uniquement"}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Manager View Button - Only show if user can switch views and not restricted */}
            {canSwitchViews && !(parentComm.isParentConnected && parentComm.permissions?.restrictedView === 'employee') && (
              <Button
                variant={currentView === 'manager' ? 'default' : 'outline'}
                onClick={() => {
                  console.log('🔄 Passage en vue manager');
                  setLocalCurrentView('manager');
                  setUserRole('manager');
                  setSelectedEmployeView(null);
                  console.log('✅ UserRole changé vers manager');
                }}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                Vue Manager
              </Button>
            )}
            
            {/* Employee View Button - Only show for employees or managers who can switch views - NEVER for responsables */}
            {(
              // NEVER show for responsables (connected or standalone)
              !isResponsable &&
              // NEVER show if parent connected with manager restriction
              !(parentComm.isParentConnected && parentComm.permissions?.restrictedView === 'manager') &&
              (
                // Show for employees who are restricted to employee view only
                (parentComm.isParentConnected && parentComm.permissions?.restrictedView === 'employee') ||
                // Show for standalone carrossiers
                (isCarrossier && !canSwitchViews && !parentComm.isParentConnected) ||
                // Show for managers who can switch views
                canSwitchViews
              )
            ) && (
              <Button
                variant={currentView === 'employe' ? 'default' : 'outline'}
                onClick={() => {
                  console.log('🔄 Passage en vue employé');
                  setLocalCurrentView('employe' as 'employe');
                  setUserRole('employe');
                  console.log('✅ UserRole changé vers employe');
                }}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Vue Employé
              </Button>
            )}
          </div>

          {/* Bouton d'urgence - uniquement pour le manager */}
          {currentView === 'manager' && (
            <div className="flex gap-2">
              <EnhancedButton
                variant="destructive"
                onClick={() => setShowVehiculeUrgenceModal(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <Zap className="w-3 h-3" />
                Véhicule Urgence
              </EnhancedButton>
            </div>
          )}
          
          {currentView === 'employe' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Label className="text-sm">Employé:</Label>
              <select
                value={selectedEmployeView || ''}
                onChange={(e) => setSelectedEmployeView(e.target.value)}
                className="px-2 py-1 text-sm border rounded-md bg-background w-full sm:w-auto min-w-[180px]"
              >
                <option value="">Sélectionner un employé</option>
                {employesFromData.filter(emp => emp.qualifications && emp.qualifications.length > 0).map(employe => (
                  <option key={employe.user_id} value={employe.user_id}>
                    {employe.nom}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderEtapesAtelier = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-foreground">Étapes atelier</CardTitle>
              <CardDescription className="text-sm sm:text-base">Parcours complet avec synchronisation planning automatique</CardDescription>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full lg:w-auto">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-primary">{stats.vehicules}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">VÉHICULES</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-success">{stats.termines}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">TERMINÉS</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-warning">{stats.enAttente}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">EN ATTENTE</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-accent">{stats.ca}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">CA EN COURS</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
              <button 
                onClick={() => setShowAttenteModal(true)}
                className="font-medium text-warning-foreground hover:text-warning hover:underline cursor-pointer p-0 h-auto bg-transparent border-none text-left"
              >
                {stats.enAttente} véhicules en attente
              </button>
            </div>
            <p className="text-xs sm:text-sm text-warning-foreground mt-1">
              Pièces: 2 • Approbations: 1 • Techniciens: {vehiculesEnAttente.filter(v => v.raisonBlocage === 'Attente technicien').length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Étapes atelier organisées par étapes du processus */}
      {Object.entries(vehiculesParEtape).map(([etapeId, vehicules]) => {
        const qual = qualifications.find(q => q.id === etapeId);
        return (
          <Card key={etapeId} className={`${qual?.color.replace('text-', 'border-l-').replace('bg-', 'border-l-')} border-l-4`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {qual?.name}
                <Badge variant="secondary">{vehicules.length} véhicule(s)</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {vehicules.map(vehicule => (
                  <Card 
                    key={vehicule.id} 
                    className="hover:shadow-md transition-all cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedVehicule(vehicule);
                      setShowVehiculeModal(true);
                    }}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm sm:text-base truncate">{vehicule.modele}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{vehicule.plaque}</p>
                          <p className="text-xs text-muted-foreground truncate">{vehicule.client}</p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="text-xs sm:text-sm font-medium text-success">{vehicule.prix}</div>
                          <div className="text-xs text-muted-foreground">{vehicule.temps}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="font-medium text-primary text-xs sm:text-sm">{vehicule.sousEtape}</div>
                          {vehicule.technicien && (
                            <div className="text-muted-foreground text-xs">👤 {vehicule.technicien}</div>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <Badge variant={getStatusVariant(vehicule.status)} className="text-xs">
                            {getStatusLabel(vehicule.status)}
                          </Badge>
                          
                          {vehicule.status === 'planifier' && (
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto">
                              <Calendar className="w-3 h-3 mr-1" />
                              Planifier
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {vehicules.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    Aucun véhicule dans cette étape
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Rendu du Planning avec Drag & Drop
  const renderPlanning = () => {
    const getEtapeColor = (etape) => {
      const qual = qualifications.find(q => q.id === etape);
      return qual?.color || 'bg-muted text-muted-foreground';
    };

    // Suppression des créneaux horaires avec le système drag & drop

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">Planning Détaillé</CardTitle>
            <CardDescription className="text-sm sm:text-base">Toutes les tâches par véhicule et jour par jour</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(planningDetaille).map(([jour, taches]) => (
                <Card key={jour} className="bg-muted/30">
                   <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                     <CardTitle className="text-base sm:text-lg capitalize text-primary">{jour}</CardTitle>
                     <div className="text-xs sm:text-sm text-muted-foreground">
                       {getTodayTasks().length} tâche(s)
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
                       {/* Utiliser les vraies tâches des employés plutôt que planningDetaille */}
                       {employes
                         .flatMap(emp => (emp.planningJour || []).map(tache => ({ ...tache, employeNom: emp.nom })))
                         .filter(tache => tache.jour === jour)
                         .sort((a, b) => {
                           const heureA = a.heure.split('-')[0] || a.heure;
                           const heureB = b.heure.split('-')[0] || b.heure;
                           return heureA.localeCompare(heureB);
                         })
                          .map((tache) => (
                            <SimpleTacheCard
                              key={tache.id}
                              tache={tache}
                              qualifications={qualifications}
                              onCardClick={() => {
                                const vehiculeFromTache = {
                                  id: tache.vehiculeId,
                                  plaque: tache.vehicule,
                                  modele: tache.modele,
                                  sousEtape: tache.tache,
                                  client: tache.client,
                                  technicien: tache.technicien,
                                  etape: tache.etape,
                                  temps: '2h',
                                  prix: '500€',
                                  status: tache.status
                                };
                                setSelectedVehicule(vehiculeFromTache);
                                setShowVehiculeModal(true);
                              }}
                              showDeplacerButton={true}
                              onDeplacer={() => {
                                setSelectedTacheToMove(tache);
                                setShowDeplacerModal(true);
                              }}
                            />
                          ))}
                       
                        {/* Affichage simple sans créneaux horaires */}
                    
                     {getTodayTasks().length === 0 && (
                       <div className="text-center py-6 sm:py-8 text-muted-foreground">
                         <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                         <div className="text-xs sm:text-sm">Aucune tâche planifiée</div>
                       </div>
                     )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Résumé hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Résumé de la semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Object.values(planningDetaille).flat().length}
                  </div>
                  <div className="text-sm text-muted-foreground">Tâches totales</div>
                </CardContent>
              </Card>
              
              <Card className="bg-success/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {new Set(Object.values(planningDetaille).flat().map(t => t.vehicule)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Véhicules traités</div>
                </CardContent>
              </Card>
              
              <Card className="bg-warning/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">
                    {new Set(Object.values(planningDetaille).flat().map(t => t.technicien)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Techniciens mobilisés</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
         </Card>

        </div>
    );
  };

  // Rendu du Planning par Employé (nouvel onglet)
  const renderPlanningEmployes = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Planning par Employé
              <Badge variant="secondary" className="text-xs">
                Tri chronologique automatique
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Vue détaillée des tâches de chaque employé triées par heure (uniquement pour le manager)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
             {/* DEBUG: Afficher les informations sur employesFromData */}
             {(() => {
               console.log('🚨 DEBUG renderPlanningEmployes:', {
                 employesFromData,
                 employesCount: employesFromData?.length || 0,
                 employesAvecQualifications: employesFromData?.filter(emp => emp.qualifications && emp.qualifications.length > 0) || [],
                 getTasksForEmployeeById: typeof getTasksForEmployeeById,
                 getTasksForEmployee: typeof getTasksForEmployee
               });
               return null;
             })()}
            
             {employesFromData && employesFromData.length > 0 ? (
               employesFromData.filter(emp => emp.qualifications && emp.qualifications.length > 0).length > 0 ? (
                 employesFromData.filter(emp => emp.qualifications && emp.qualifications.length > 0).map(employe => {
                   // Utiliser le nouveau système de planning avec user_id
                   const planningEmploye = employe.user_id 
                     ? getTasksForEmployeeById(employe.user_id)
                     : getTasksForEmployee(employe.nom);
                   
                   console.log(`🔄 Planning nouveau système pour ${employe.nom} (user_id: ${employe.user_id}):`, planningEmploye);
                 
                 return (
                   <div key={employe.id} className="space-y-4">
                     {/* En-tête employé avec statistiques */}
                     <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                       <CardContent className="p-4">
                         <div className="flex justify-between items-center">
                           <div>
                             <h3 className="text-lg font-bold text-primary">{employe.nom}</h3>
                             <p className="text-sm text-muted-foreground">{employe.email}</p>
                             <div className="flex items-center gap-2 mt-2">
                               {employe.qualifications.map(qualId => {
                                 const qual = qualifications.find(q => q.id === qualId);
                                 return qual ? (
                                   <Badge key={qualId} variant="outline" className={qual.color + " text-xs"}>
                                     {qual.name}
                                   </Badge>
                                 ) : null;
                               })}
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="grid grid-cols-3 gap-4 text-center">
                               <div>
                                 <div className="text-lg font-bold text-primary">
                                   {planningEmploye.filter(t => t.status === 'en_cours' || t.status === 'planifie').length}
                                 </div>
                                 <div className="text-xs text-muted-foreground">En cours</div>
                               </div>
                               <div>
                                 <div className="text-lg font-bold text-success">
                                   {planningEmploye.filter(t => t.status === 'termine').length}
                                 </div>
                                 <div className="text-xs text-muted-foreground">Terminées</div>
                               </div>
                               <div>
                                 <div className="text-lg font-bold text-accent">
                                   {planningEmploye.length}
                                 </div>
                                 <div className="text-xs text-muted-foreground">Total</div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </CardContent>
                     </Card>

                     {/* Planning détaillé de l'employé */}
                     {planningEmploye.length > 0 ? (
                       <PlanningEmploye
                         employe={employe}
                         taches={planningEmploye}
                         onTerminerTache={(tacheId) => {
                           console.log('🚫 ISOLATION TOTALE - Terminer tâche sans pointage:', tacheId);
                           console.log('🚨 Mode BYPASS - Aucune vérification de pointage autorisée');
                           
                           // Terminer la tâche directement sans déclencher de vérifications
                           terminerTache(tacheId, employe.user_id);
                           
                           console.log('✅ Tâche terminée en mode isolé');
                           toast({
                             title: "Tâche terminée",
                             description: `Tâche terminée par ${employe.nom}`,
                           });
                         }}
                         onVoirVehicule={(vehiculeId) => {
                           // Trouver le véhicule dans les données et l'afficher
                           const vehiculeData = Object.values(vehiculesParEtape).flat().find(v => v.id === vehiculeId);
                           if (vehiculeData) {
                             setSelectedVehicule(vehiculeData);
                             setShowVehiculeModal(true);
                           } else {
                             // Créer un véhicule fictif basé sur l'ID
                             const tacheVehicule = planningEmploye.find(t => t.vehiculeId === vehiculeId);
                             if (tacheVehicule) {
                               setSelectedVehicule({
                                 id: vehiculeId,
                                 plaque: tacheVehicule.vehicule,
                                 modele: tacheVehicule.modele,
                                 client: tacheVehicule.client,
                                 sousEtape: tacheVehicule.tache,
                                 etape: tacheVehicule.etape,
                                 technicien: tacheVehicule.technicien,
                                 temps: `${tacheVehicule.duree}h`,
                                 prix: '500€',
                                 status: tacheVehicule.status
                               });
                               setShowVehiculeModal(true);
                             }
                           }
                         }}
                         userRole={userRole}
                         companyId={companyId || "temp-company-id"}
                       />
                     ) : (
                       <Card className="border-dashed border-2 border-muted">
                         <CardContent className="p-8 text-center">
                           <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                           <h4 className="font-medium text-muted-foreground mb-2">Aucune tâche assignée</h4>
                           <p className="text-sm text-muted-foreground">
                             {employe.nom} n'a pas de tâches assignées pour le moment
                           </p>
                         </CardContent>
                       </Card>
                     )}
                   </div>
                 );
               })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucun employé qualifié</h3>
                    <p className="text-muted-foreground">
                      Ajoutez des qualifications aux employés pour voir leur planning
                    </p>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucun employé trouvé</h3>
                  <p className="text-muted-foreground">
                    Ajoutez des employés dans l'onglet "Employés" pour voir leur planning
                  </p>
                </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Rendu des Véhicules en Attente (nouvel onglet)
  const renderVehiculesAttente = () => {
    const calculateDaysWaiting = (dateAttente: string) => {
      const today = new Date();
      const waitingDate = new Date(dateAttente);
      const diffTime = Math.abs(today.getTime() - waitingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Véhicules en Attente
              <Badge variant="destructive" className="text-xs">
                {vehiculesEnAttente.length} véhicule(s) bloqué(s)
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {vehiculesEnAttente.length} véhicule(s) bloqué(s) dans les étapes atelier
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Liste des véhicules en attente */}
        <div className="space-y-4">
          {vehiculesEnAttente.map((vehicule, index) => {
            const joursAttente = calculateDaysWaiting(vehicule.dateAttente);
            
            return (
              <Card key={vehicule.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Informations du véhicule */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-foreground">
                          {vehicule.modele}
                        </h3>
                        <Badge variant="outline" className="text-sm">
                          {vehicule.plaque}
                        </Badge>
                        {vehicule.priorite === 'urgente' && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Client :</span>
                          <div className="font-medium">{vehicule.client}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Prix :</span>
                          <div className="font-bold text-success">{vehicule.prix}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Étape bloquée :</span>
                          <div className="font-medium">{vehicule.etapeBloquee}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">En attente depuis :</span>
                          <div className="font-bold text-warning">{joursAttente} jour(s)</div>
                        </div>
                      </div>

                      {/* Raison du blocage */}
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-warning-foreground">
                              Raison du blocage : {vehicule.raisonBlocage}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {vehicule.detailBlocage}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Boutons d'actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => {
                          setSelectedVehiculeAction(vehicule);
                          setShowDebloquerModal(true);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Débloquer
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setSelectedVehiculeAction(vehicule);
                          setShowPlanifierModal(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Planifier
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedVehiculeAction(vehicule);
                          setShowModifierModal(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {vehiculesEnAttente.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Aucun véhicule en attente
                </h3>
                <p className="text-muted-foreground">
                  Tous les véhicules sont dans les étapes atelier normales
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Statistiques de répartition */}
        {vehiculesEnAttente.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium text-sm">Répartition des blocages :</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Pièces: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('pièces') || v.raisonBlocage.includes('Pièces')).length}
                  </Badge>
                  <Badge variant="outline" className="bg-warning/10 text-warning">
                    Expertise: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('expert') || v.raisonBlocage.includes('Accord')).length}
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent-foreground">
                    Technicien: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('technicien')).length}
                  </Badge>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive">
                    Problèmes: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('Problème')).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Rendu des Employés
  const renderEmployes = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Gestion des Employés</CardTitle>
              <CardDescription>Créer et gérer les profils avec leurs qualifications</CardDescription>
            </div>
            <Dialog open={showEmployeModal} onOpenChange={setShowEmployeModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un employé
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEmploye ? 'Modifier l\'employé' : 'Ajouter un employé'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      value={editingEmploye ? editingEmploye.nom : nouvelEmploye.nom}
                      onChange={(e) => {
                        if (editingEmploye) {
                          setEditingEmploye({...editingEmploye, nom: e.target.value});
                        } else {
                          setNouvelEmploye({...nouvelEmploye, nom: e.target.value});
                        }
                      }}
                      placeholder="Martin Dubois"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingEmploye ? editingEmploye.email : nouvelEmploye.email}
                      onChange={(e) => {
                        if (editingEmploye) {
                          setEditingEmploye({...editingEmploye, email: e.target.value});
                        } else {
                          setNouvelEmploye({...nouvelEmploye, email: e.target.value});
                        }
                      }}
                      placeholder="martin.dubois@carrosserie.fr"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={editingEmploye ? editingEmploye.telephone : nouvelEmploye.telephone}
                      onChange={(e) => {
                        if (editingEmploye) {
                          setEditingEmploye({...editingEmploye, telephone: e.target.value});
                        } else {
                          setNouvelEmploye({...nouvelEmploye, telephone: e.target.value});
                        }
                      }}
                      placeholder="06.12.34.56.78"
                    />
                  </div>

                  <div>
                    <Label>Qualifications * (sélectionnez une ou plusieurs)</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3 mt-2">
                      {qualifications.map(qual => (
                        <div key={qual.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={qual.id}
                            checked={editingEmploye 
                              ? editingEmploye.qualifications.includes(qual.id)
                              : nouvelEmploye.qualifications.includes(qual.id)
                            }
                            onCheckedChange={() => toggleQualification(qual.id, !!editingEmploye)}
                          />
                          <Label htmlFor={qual.id} className="text-sm">
                            <Badge className={qual.color}>{qual.name}</Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {editingEmploye 
                        ? `${editingEmploye.qualifications.length} qualification(s) sélectionnée(s)`
                        : `${nouvelEmploye.qualifications.length} qualification(s) sélectionnée(s)`
                      }
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEmployeModal(false);
                      setEditingEmploye(null);
                      setNouvelEmploye({
                        nom: '',
                        email: '',
                        telephone: '',
                        qualifications: [],
                        actif: true
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={editingEmploye ? modifierEmploye : ajouterEmploye}
                    disabled={
                      !(editingEmploye ? editingEmploye.nom && editingEmploye.email && editingEmploye.qualifications.length > 0
                        : nouvelEmploye.nom && nouvelEmploye.email && nouvelEmploye.qualifications.length > 0)
                    }
                  >
                    {editingEmploye ? 'Modifier' : 'Créer l\'employé'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Qualifications disponibles :</h3>
            <div className="flex flex-wrap gap-2">
              {qualifications.map(qual => (
                <Badge key={qual.id} className={qual.color}>
                  {qual.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employesFromData.filter(emp => emp.qualifications && emp.qualifications.length > 0).map(employe => (
          <Card key={employe.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold">{employe.nom}</h3>
                  <p className="text-sm text-muted-foreground">{employe.email}</p>
                  <p className="text-sm text-muted-foreground">{employe.telephone}</p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedEmployePointage({id: employe.id, nom: employe.nom});
                      setShowEmployePointageModal(true);
                    }}
                    title="Voir les pointages"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingEmploye(employe);
                      setShowEmployeModal(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => supprimerEmploye(employe.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Qualifications :</h4>
                <div className="flex flex-wrap gap-1">
                  {employe.qualifications.map(qualId => {
                    const qual = qualifications.find(q => q.id === qualId);
                    return qual ? (
                      <Badge key={qualId} className={qual.color}>
                        {qual.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section employés temporairement désactivée */}
      {false && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employés inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employes.filter(emp => !emp.actif).map(employe => (
                <div key={employe.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-muted-foreground">{employe.nom}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmployes(employes.map(emp => 
                      emp.id === employe.id ? { ...emp, actif: true } : emp
                    ))}
                  >
                    Réactiver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Rendu du Process
  const renderProcess = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Process de Réparation</CardTitle>
              <CardDescription>Temps indicatifs par type d'intervention</CardDescription>
            </div>
            <Badge variant="outline" className="text-warning">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Temps indicatifs - Variables selon complexité
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(processData).map(([key, data]) => (
              <Button
                key={key}
                variant={selectedProcessCategory === key ? "default" : "outline"}
                onClick={() => setSelectedProcessCategory(key)}
                className="text-sm"
              >
                {data.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${processData[selectedProcessCategory].color}`}>
        <CardHeader>
          <CardTitle className="text-xl">
            {processData[selectedProcessCategory].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processData[selectedProcessCategory].interventions.map((intervention, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{intervention.type}</div>
                      <div className="text-muted-foreground text-sm mt-1">{intervention.details}</div>
                    </div>
                    <div className="text-primary font-bold text-lg ml-4">
                      {intervention.temps}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Récapitulatif par Type de Sinistre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Catégorie de Sinistre</th>
                  <th className="text-left p-3 font-medium">Temps Total</th>
                  <th className="text-left p-3 font-medium">Durée Calendaire</th>
                </tr>
              </thead>
              <tbody>
                {recapSinistres.map((sinistre, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">{sinistre.categorie}</td>
                    <td className="p-3 font-bold text-primary">{sinistre.tempsTotal}</td>
                    <td className="p-3 text-success">{sinistre.dureeCalendaire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Facteurs d'Allongement des Délais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facteursAllongement.map((facteur, index) => (
              <Card key={index} className="bg-warning/5 border-warning/20">
                <CardContent className="p-4">
                  <div className="font-medium">{facteur.facteur}</div>
                  <div className="text-warning font-bold text-lg">{facteur.impact}</div>
                  <div className="text-muted-foreground text-sm mt-1">{facteur.observation}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      {/* Floating Notifications */}
      <FloatingNotifications
        notifications={floatingNotifications}
        onDismiss={dismissFloatingNotification}
        position="top-right"
      />

      {/* Enhanced Header */}
      {renderViewSelector()}
        
      <div className="container mx-auto px-4 pb-8">
        {currentView === 'employe' ? (
          // Vision employé
          selectedEmployeView ? (
            <div className="fade-in">
              {renderVisionEmploye()}
            </div>
          ) : (
            <Card className="interactive-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Sélectionnez votre profil employé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Choisissez un employé dans le sélecteur ci-dessus pour accéder à son planning personnel
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {employesFromData.map(emp => (
                    <EnhancedButton
                      key={emp.user_id}
                      variant="outline"
                      onClick={() => setSelectedEmployeView(emp.user_id)}
                      className="h-16 flex-col gap-1"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">{emp.nom}</span>
                    </EnhancedButton>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          // Vision manager with enhanced tabs
          <div className="fade-in">
            <Tabs defaultValue="etapes-atelier" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 h-auto p-2 bg-muted/50 rounded-xl">
                <TabsTrigger 
                  value="etapes-atelier" 
                  className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Étapes atelier</span>
                  <span className="sm:hidden">Étapes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="vehicules-attente" 
                  className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Véhicules en Attente</span>
                  <span className="sm:hidden">Attente</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="planning" 
                  className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Planning</span>
                  <span className="sm:hidden">Plan</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="planning-employes" 
                  className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Planning Employés</span>
                  <span className="sm:hidden">P.Emp</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="employes" 
                  className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Employés</span>
                  <span className="sm:hidden">Emp</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="process" 
                  className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Process</span>
                  <span className="sm:hidden">Proc</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="etapes-atelier" className="mt-6 slide-up">
                {renderEtapesAtelier()}
              </TabsContent>
              
              <TabsContent value="vehicules-attente" className="mt-6 slide-up">
                {renderVehiculesAttente()}
              </TabsContent>
              
              <TabsContent value="planning" className="mt-6 slide-up">
                {renderPlanning()}
              </TabsContent>
              
              <TabsContent value="planning-employes" className="mt-6 slide-up">
                {renderPlanningEmployes()}
              </TabsContent>
              
              <TabsContent value="employes" className="mt-6 slide-up">
                {renderEmployes()}
              </TabsContent>
              
              <TabsContent value="process" className="mt-6 slide-up">
                {renderProcess()}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Modal de pointage employé */}
        {showEmployePointageModal && selectedEmployePointage && (
          <EmployePointageModal
            open={showEmployePointageModal}
            onOpenChange={setShowEmployePointageModal}
            employeId={selectedEmployePointage.id}
            employeNom={selectedEmployePointage.nom}
          />
        )}

        {/* Modal de gestion des véhicules en attente */}
        {showAttenteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
            <div className="bg-card rounded-lg w-full max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col animate-scale-in shadow-2xl">
              {/* En-tête fixe */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-border gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-card-foreground">Véhicules en Attente</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{vehiculesEnAttente.length} véhicule(s) bloqué(s) dans les étapes atelier</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAttenteModal(false)}
                    className="transition-colors"
                  >
                    ← Retour
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAttenteModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Zone de contenu avec scroll */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {vehiculesEnAttente.map(vehicule => (
                    <Card key={vehicule.id} className="hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-bold text-lg">{vehicule.modele}</h4>
                              <Badge variant="outline">{vehicule.plaque}</Badge>
                              <Badge variant={getPrioriteVariant(vehicule.priorite)}>
                                {vehicule.priorite === 'urgente' && '🔴 Urgent'}
                                {vehicule.priorite === 'haute' && '🟠 Haute'}
                                {vehicule.priorite === 'normale' && '🔵 Normale'}
                                {vehicule.priorite === 'basse' && '⚪ Basse'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                              <div className="flex justify-between">
                                <span className="font-medium">Client :</span>
                                <span>{vehicule.client}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Prix :</span>
                                <span className="font-bold text-success">{vehicule.prix}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Étape bloquée :</span>
                                <span>{vehicule.etapeBloquee}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">En attente depuis :</span>
                                <span className="font-medium text-destructive">{getJoursAttente(vehicule.dateAttente)} jour(s)</span>
                              </div>
                            </div>

                            <div className="bg-warning/10 border border-warning/20 rounded p-3">
                              <div className="flex items-start gap-2 mb-1">
                                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-warning-foreground">Raison du blocage :</span>
                                    <span className="font-medium">{vehicule.raisonBlocage}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{vehicule.detailBlocage}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="ml-6 flex flex-col gap-2 min-w-[140px]">
                            <Button
                              onClick={() => {
                                setSelectedVehiculeAction(vehicule);
                                setShowDebloquerModal(true);
                              }}
                              className="text-sm transition-all duration-200 hover:scale-105 bg-green-500 hover:bg-green-600 text-white"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Débloquer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVehiculeAction(vehicule);
                                setShowPlanifierModal(true);
                              }}
                              className="transition-all duration-200 hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Planifier
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedVehiculeAction(vehicule);
                                setShowModifierModal(true);
                              }}
                              className="transition-all duration-200 hover:scale-105"
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {vehiculesEnAttente.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground text-6xl mb-4">🎉</div>
                      <h4 className="text-lg font-medium text-muted-foreground mb-2">Aucun véhicule en attente</h4>
                      <p className="text-muted-foreground">Tous les véhicules sont dans les étapes atelier normales</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pied de page fixe */}
              <div className="border-t border-border p-6 bg-muted/30 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Répartition des blocages :</span>
                    <Badge variant="outline" className="ml-3 bg-primary/10 text-primary">
                      Pièces: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('pièces') || v.raisonBlocage.includes('Pièces')).length}
                    </Badge>
                    <Badge variant="outline" className="ml-2 bg-warning/10 text-warning">
                      Expertise: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('expert') || v.raisonBlocage.includes('Accord')).length}
                    </Badge>
                    <Badge variant="outline" className="ml-2 bg-accent/10 text-accent-foreground">
                      Technicien: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('technicien')).length}
                    </Badge>
                    <Badge variant="outline" className="ml-2 bg-destructive/10 text-destructive">
                      Problèmes: {vehiculesEnAttente.filter(v => v.raisonBlocage.includes('Problème')).length}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => console.log('Export des données')}
                      className="text-sm transition-all duration-200 hover:scale-105"
                    >
                      📊 Exporter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAttenteModal(false)}
                      className="font-medium transition-all duration-200 hover:scale-105"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale de détail du véhicule */}
      <VehiculeDetailModal
        vehicule={selectedVehicule}
        isOpen={showVehiculeModal}
        onClose={() => setShowVehiculeModal(false)}
        userRole={userRole}
        onAssignerTache={(vehicule) => {
          const tacheAssignee = assignerTacheAutomatique(vehicule);
          if (tacheAssignee) {
            toast({
              title: "Tâche assignée",
              description: `${vehicule.sousEtape} assignée à ${tacheAssignee.technicien}`,
            });
          }
          setShowVehiculeModal(false);
        }}
      />

      {/* Modale véhicule urgence */}
      <VehiculeUrgenceModal
        isOpen={showVehiculeUrgenceModal}
        onClose={() => setShowVehiculeUrgenceModal(false)}
        employes={employes}
        onAjouterVehicule={handleAjouterVehiculeUrgence}
      />

      {/* Modales d'actions véhicules en attente */}
      <VehiculeDebloquerModal
        isOpen={showDebloquerModal}
        onClose={() => {
          setShowDebloquerModal(false);
          setSelectedVehiculeAction(null);
        }}
        vehicule={selectedVehiculeAction}
        onDebloquer={handleDebloquer}
      />

      <VehiculePlanifierModal
        isOpen={showPlanifierModal}
        onClose={() => {
          setShowPlanifierModal(false);
          setSelectedVehiculeAction(null);
        }}
        vehicule={selectedVehiculeAction}
        employes={employes}
        onPlanifier={handlePlanifier}
      />

      <VehiculeModifierModal
        isOpen={showModifierModal}
        onClose={() => {
          setShowModifierModal(false);
          setSelectedVehiculeAction(null);
        }}
        vehicule={selectedVehiculeAction}
        onModifier={handleModifier}
      />

      {/* Modal pour déplacer une tâche */}
      <DeplacerTacheModal
        isOpen={showDeplacerModal}
        onClose={() => {
          setShowDeplacerModal(false);
          setSelectedTacheToMove(null);
        }}
        tache={selectedTacheToMove}
        employes={employes}
        onDeplacer={handleDeplacerTache}
      />

      </div>
    );
  };

  export default CarrosseriePlanning;