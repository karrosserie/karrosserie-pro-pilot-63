import { useState, useCallback } from 'react';
import { UrgencyVehicleService } from '@/services/urgencyVehicleService';

export interface Vehicule {
  id: number;
  plaque: string;
  modele: string;
  client: string;
  etape: string;
  sousEtape: string;
  temps: string;
  prix: string;
  status: 'en_cours' | 'planifie' | 'en_attente' | 'planifier' | 'termine';
  technicien?: string;
  dateDebut?: string;
  dateFin?: string;
  qualificationRequise: string;
}

export interface EntrepriseInfo {
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  latitude: number;
  longitude: number;
  rayonGeolocalisation: number; // en mètres
  email: string;
  telephone: string;
}

export interface Employe {
  id: string; // Changed from number to string to match user_companies.id  
  user_id: string; // Add user_id reference
  nom: string;
  email: string;
  telephone: string;  
  qualifications: string[];
  actif: boolean;
  role: string; // Add role from user_companies
  planningJour?: PlanningTache[];
  entreprise?: EntrepriseInfo;
}

export interface PlanningTache {
  id: string;
  vehiculeId: number;
  vehicle_id?: string; // UUID du véhicule pour les photos et la base de données
  vehicule: string;
  modele: string;
  marque?: string; // Marque de la voiture
  heure: string;
  technicien: string;
  tache: string;
  etape: string;
  client: string;
  duree: number; // en heures
  status: 'planifie' | 'en_cours' | 'termine';
  dateCreation: Date;
  dateAssignation?: string; // Date d'assignation au format YYYY-MM-DD
  jour?: string; // Jour de la semaine
  user_id?: string; // ID utilisateur pour l'association correcte
  detailed_instructions?: {
    instructions: Array<{
      number: number;
      task: string;
    }>;
    received_at: string;
    task_type_confirmed: string;
    source: string;
  } | null;
}

export interface Notification {
  id: string;
  type: 'nouvelle_tache' | 'tache_terminee' | 'vehicule_debloque' | 'probleme';
  titre: string;
  message: string;
  employeId?: string; // Changed from number to string
  vehiculeId?: number;
  tacheId?: string;
  timestamp: Date;
  lue: boolean;
}

export const usePlanningManager = () => {
  const [employes, setEmployes] = useState<Employe[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userRole, setUserRole] = useState<'manager' | 'employe'>('employe');
  const [currentEmployeId, setCurrentEmployeId] = useState<string | null>(null);

  // Calcul automatique du planning basé sur le temps et qualifications
  const calculerPlanningAutomatique = useCallback((vehicule: Vehicule, dateDebut: Date) => {
    const tempsRequis = parseFloat(vehicule.temps.replace('h', ''));
    const qualification = vehicule.qualificationRequise || vehicule.etape;
    
    // Trouver les employés qualifiés - tous rôles inclus avec priorisation automatique
    const employesQualifies = employes.filter(emp => 
      emp.actif && 
      emp.qualifications.includes(qualification)
    ).sort((a, b) => {
      // Priorisation par rôle : Carrossier > Responsable > Propriétaire
      const priorite = {
        'Carrossier': 100,
        'Carrossier-Véhicule de courtoisie': 90,
        'Responsable': 50,
        'Propriétaire': 30
      };
      return (priorite[b.role] || 0) - (priorite[a.role] || 0);
    });

    if (employesQualifies.length === 0) {
      console.warn(`Aucun employé qualifié pour ${qualification}`);
      return null;
    }

    // Trouver le premier employé disponible
    let employeDisponible = null;
    let prochainCreneau = new Date(dateDebut);

    for (const employe of employesQualifies) {
      const creneauLibre = trouverProchainCreneauLibre(employe, dateDebut, tempsRequis);
      if (creneauLibre && (!employeDisponible || creneauLibre < prochainCreneau)) {
        employeDisponible = employe;
        prochainCreneau = creneauLibre;
      }
    }

    if (!employeDisponible) {
      return {
        employe: null,
        creneauPropose: prochainCreneau,
        message: `Premier créneau disponible: ${prochainCreneau.toLocaleString()}`
      };
    }

    return {
      employe: employeDisponible,
      creneauPropose: prochainCreneau,
      message: 'Assignation immédiate possible'
    };
  }, [employes]);

  const trouverProchainCreneauLibre = (employe: Employe, dateDebut: Date, dureeRequise: number): Date => {
    // Simulation - dans un vrai système, analyser le planning existant
    const planningJour = employe.planningJour || [];
    const heureDebut = 8; // 8h du matin
    const heureFin = 18; // 18h le soir
    const now = new Date();
    
    let creneauTest = new Date(dateDebut);
    
    // Si c'est aujourd'hui, commencer à l'heure actuelle + 1h, sinon à 8h
    const isToday = dateDebut.toDateString() === now.toDateString();
    if (isToday) {
      const heureActuelle = now.getHours() + 1; // +1h de marge
      const minutesActuelles = now.getMinutes();
      // Arrondir à la prochaine demi-heure
      const prochaineDemiHeure = minutesActuelles <= 30 ? 30 : 60;
      const heureDebutAjustee = Math.max(heureDebut, prochaineDemiHeure === 60 ? heureActuelle + 1 : heureActuelle);
      creneauTest.setHours(heureDebutAjustee, prochaineDemiHeure === 60 ? 0 : 30, 0, 0);
    } else {
      creneauTest.setHours(heureDebut, 0, 0, 0);
    }

    // Vérifier les créneaux occupés
    for (let heure = heureDebut; heure < heureFin - dureeRequise; heure += 0.5) {
      const creneauLibre = !planningJour.some(tache => {
        const [debutHeure] = tache.heure.split('h-')[0].split('h');
        const [finHeure] = tache.heure.split('h-')[1]?.split('h') || ['0'];
        return heure >= parseInt(debutHeure) && heure < parseInt(finHeure);
      });

      if (creneauLibre) {
        creneauTest.setHours(heure, (heure % 1) * 60, 0, 0);
        return creneauTest;
      }
    }

    // Si pas de créneau aujourd'hui, proposer demain
    creneauTest.setDate(creneauTest.getDate() + 1);
    creneauTest.setHours(heureDebut, 0, 0, 0);
    return creneauTest;
  };

  const assignerTacheAutomatique = useCallback((vehicule: Vehicule, etapeSuivante?: string) => {
    const etapeActuelle = etapeSuivante || vehicule.etape;
    const planning = calculerPlanningAutomatique({
      ...vehicule,
      etape: etapeActuelle,
      qualificationRequise: etapeActuelle
    }, new Date());

    if (planning?.employe) {
      const nouvelleTache: PlanningTache = {
        id: `tache_${Date.now()}`,
        vehiculeId: vehicule.id,
        vehicule: vehicule.plaque,
        modele: vehicule.modele,
        heure: `${planning.creneauPropose.getHours()}h-${planning.creneauPropose.getHours() + parseFloat(vehicule.temps)}h`,
        technicien: planning.employe.nom,
        tache: vehicule.sousEtape,
        etape: etapeActuelle,
        client: vehicule.client,
        duree: parseFloat(vehicule.temps.replace('h', '')),
        status: 'planifie',
        dateCreation: new Date()
      };

      // Mettre à jour le planning de l'employé
      setEmployes(prev => prev.map(emp => 
        emp.id === planning.employe!.id 
          ? { ...emp, planningJour: [...(emp.planningJour || []), nouvelleTache] }
          : emp
      ));

      // Créer notification
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        type: 'nouvelle_tache',
        titre: 'Nouvelle tâche assignée',
        message: `${vehicule.sousEtape} - ${vehicule.plaque} (${vehicule.modele})`,
        employeId: planning.employe.id.toString(),
        vehiculeId: vehicule.id,
        tacheId: nouvelleTache.id,
        timestamp: new Date(),
        lue: false
      };

      setNotifications(prev => [notification, ...prev]);
      return nouvelleTache;
    }

    return null;
  }, [calculerPlanningAutomatique]);

  const terminerTache = useCallback((tacheId: string, employeId: string) => {
    console.log('🎯 usePlanningManager - terminerTache appelée:', { tacheId, employeId });
    console.log('🚫 AUCUNE vérification de pointage ne doit être déclenchée');
    
    setEmployes(prev => prev.map(emp => {
      if (emp.id === employeId) {
        const tacheTerminee = emp.planningJour?.find(t => t.id === tacheId);
        if (tacheTerminee) {
          console.log('📝 Tâche trouvée et terminée:', tacheTerminee.tache);
          
          // Marquer la tâche comme terminée
          const planningMisAJour = emp.planningJour?.map(t => 
            t.id === tacheId ? { ...t, status: 'termine' as const } : t
          ) || [];

          // Programmer automatiquement l'étape suivante
          const etapesSuivantes = {
            'accueil': 'remplacement',
            'remplacement': 'preparation', 
            'preparation': 'peinture',
            'peinture': 'finitions',
            'finitions': 'cloture',
            'cloture': null
          };

          const etapeSuivante = etapesSuivantes[tacheTerminee.etape as keyof typeof etapesSuivantes];
          
          if (etapeSuivante) {
            console.log('⏭️ Programmation étape suivante:', etapeSuivante);
            // Simuler l'assignation automatique de l'étape suivante
            setTimeout(() => {
              const vehiculeSimule: Vehicule = {
                id: tacheTerminee.vehiculeId,
                plaque: tacheTerminee.vehicule,
                modele: tacheTerminee.modele,
                client: tacheTerminee.client,
                etape: etapeSuivante,
                sousEtape: `Tâche ${etapeSuivante}`,
                temps: '2h',
                prix: '500€',
                status: 'planifier',
                qualificationRequise: etapeSuivante
              };

              console.log('🔄 Assignation automatique sans pointage');
              assignerTacheAutomatique(vehiculeSimule, etapeSuivante);
            }, 1000);
          }

          console.log('✅ Mise à jour planning terminée SANS vérification pointage');
          return { ...emp, planningJour: planningMisAJour };
        }
      }
      return emp;
    }));
  }, [assignerTacheAutomatique]);

  const marquerNotificationLue = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, lue: true } : notif
    ));
  }, []);

  const getNotificationsNonLues = useCallback((employeId?: string) => {
    return notifications.filter(notif => 
      !notif.lue && (!employeId || notif.employeId === employeId)
    );
  }, [notifications]);

  const getPlanningEmploye = useCallback((employeId: string) => {
    const employe = employes.find(emp => emp.id === employeId);
    return employe?.planningJour || [];
  }, [employes]);

  const ajouterVehiculeUrgence = useCallback(async (vehiculeUrgence: {
    plaque: string;
    nom: string;
    prenom: string;
    heure: string;
    employeId: string;
  }, companyId?: string, refreshCallbacks?: {
    refetchEmployees?: () => void;
    refetchVehicles?: () => void;
    refetchPlanning?: () => void;
  }) => {
    // Ne pas vérifier côté client si l'employé existe - on le fait côté serveur
    // La vérification côté client peut échouer si les employés ne sont pas encore chargés
    console.log('🚨 Tentative d\'ajout véhicule urgence:', vehiculeUrgence);

    // Récupérer l'employé pour l'affichage local (optionnel)
    const employe = employes.find(emp => emp.id === vehiculeUrgence.employeId);
    const nomEmploye = employe?.nom || 'Employé assigné';

    // Si companyId est fourni, persister en base de données
    if (companyId) {
      console.log('🚨 Ajout véhicule urgence en base de données');
      
      try {
        // Utiliser le service de persistance
        const result = await UrgencyVehicleService.ajouterVehiculeUrgence({
          ...vehiculeUrgence,
          companyId
        });
        
        if (result.success) {
          // Créer notification de succès avec information sur les tâches décalées et pause
          const baseMessage = `Traitement immédiat - ${vehiculeUrgence.plaque} (${vehiculeUrgence.prenom} ${vehiculeUrgence.nom})`;
          const shiftInfo = result.data?.conflictsResolved ? ` - ${result.data.conflictsResolved} tâche(s) décalée(s)` : '';
          const pauseInfo = result.data?.pausedTaskId ? ' - Tâche en cours mise en pause ⏸️' : '';
          
          const notificationUrgence: Notification = {
            id: `notif_urgence_${Date.now()}`,
            type: 'nouvelle_tache',
            titre: '🚨 VÉHICULE URGENCE - TRAITEMENT IMMÉDIAT',
            message: baseMessage + shiftInfo + pauseInfo,
            employeId: vehiculeUrgence.employeId.toString(),
            vehiculeId: 0, // Sera mis à jour par la vraie donnée DB
            tacheId: result.data?.scheduleId || 'unknown',
            timestamp: new Date(),
            lue: false
          };

          setNotifications(prev => [notificationUrgence, ...prev]);
          
          // Déclencher un refresh automatique des données si les callbacks sont fournis
          if (refreshCallbacks) {
            console.log('🔄 Triggering automatic data refresh after urgent vehicle creation');
            setTimeout(() => {
              refreshCallbacks.refetchEmployees?.();
              refreshCallbacks.refetchVehicles?.();
              refreshCallbacks.refetchPlanning?.();
            }, 1500); // Délai pour s'assurer que les données sont bien persistées
          }
          
          return { success: true, message: 'Véhicule d\'urgence ajouté et persisté en base', data: result };
        } else {
          return result;
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du véhicule d\'urgence:', error);
        return { success: false, message: 'Erreur lors de l\'ajout du véhicule d\'urgence' };
      }
    }

    // Fallback vers l'ancien système (données locales uniquement)
    console.log('🚨 Ajout véhicule urgence en local seulement');
    
    // Créer une nouvelle tâche urgente locale
    const nouvelleTacheUrgence: PlanningTache = {
      id: `urgence_${Date.now()}`,
      vehiculeId: Date.now(), // ID unique temporaire
      vehicule: vehiculeUrgence.plaque,
      modele: 'Urgence - À déterminer',
      heure: `${vehiculeUrgence.heure}-${vehiculeUrgence.heure}+2h`,
      technicien: nomEmploye,
      tache: 'Traitement d\'urgence',
      etape: 'accueil',
      client: `${vehiculeUrgence.prenom} ${vehiculeUrgence.nom}`,
      duree: 2, // Durée estimée 2h
      status: 'en_cours', // Démarre immédiatement
      dateCreation: new Date()
    };

    // Ajouter la tâche au planning de l'employé (données locales)
    setEmployes(prev => prev.map(emp => 
      emp.id === vehiculeUrgence.employeId
        ? { 
            ...emp, 
            planningJour: [nouvelleTacheUrgence, ...(emp.planningJour || [])]
          }
        : emp
    ));

    // Créer notification d'urgence locale
    const notificationUrgence: Notification = {
      id: `notif_urgence_${Date.now()}`,
      type: 'nouvelle_tache',
      titre: '🚨 VÉHICULE URGENCE AJOUTÉ (LOCAL)',
      message: `Traitement immédiat - ${vehiculeUrgence.plaque} (${vehiculeUrgence.prenom} ${vehiculeUrgence.nom})`,
      employeId: vehiculeUrgence.employeId.toString(),
      vehiculeId: nouvelleTacheUrgence.vehiculeId,
      tacheId: nouvelleTacheUrgence.id,
      timestamp: new Date(),
      lue: false
    };

    setNotifications(prev => [notificationUrgence, ...prev]);
    
    return { success: true, message: 'Véhicule d\'urgence ajouté localement', data: nouvelleTacheUrgence };
  }, [employes, setEmployes, setNotifications]);

  // Fonction pour déplacer une tâche vers un nouvel employé/jour/heure
  const deplacerTache = useCallback((
    tacheId: string,
    nouvelEmployeId: string,
    nouveauJour: string,
    nouvelleHeure: string
  ) => {
    console.log('🔄 Début déplacement tâche:', { tacheId, nouvelEmployeId, nouveauJour, nouvelleHeure });
    
    setEmployes(prevEmployes => {
      const updatedEmployes = [...prevEmployes];
      
      // Trouver la tâche à déplacer
      let tacheADeplacer: PlanningTache | null = null;
      let ancienEmployeIndex = -1;
      
      for (let i = 0; i < updatedEmployes.length; i++) {
        const tacheIndex = updatedEmployes[i].planningJour?.findIndex(t => t.id === tacheId) ?? -1;
        if (tacheIndex !== -1) {
          tacheADeplacer = updatedEmployes[i].planningJour![tacheIndex];
          ancienEmployeIndex = i;
          // Retirer la tâche de l'ancien emplacement
          updatedEmployes[i].planningJour!.splice(tacheIndex, 1);
          break;
        }
      }
      
      if (!tacheADeplacer) {
        console.warn(`❌ Tâche ${tacheId} non trouvée`);
        return prevEmployes;
      }
      
      // Trouver l'employé cible
      const employeCibleIndex = updatedEmployes.findIndex(emp => emp.id === nouvelEmployeId);
      if (employeCibleIndex === -1) {
        console.warn(`❌ Employé ${nouvelEmployeId} non trouvé`);
        // Remettre la tâche à sa place originale
        if (ancienEmployeIndex >= 0 && updatedEmployes[ancienEmployeIndex].planningJour) {
          updatedEmployes[ancienEmployeIndex].planningJour!.push(tacheADeplacer);
        }
        return prevEmployes;
      }
      
      const employeCible = updatedEmployes[employeCibleIndex];
      console.log('🎯 Employé cible trouvé:', employeCible.nom, 'qualifications:', employeCible.qualifications);
      
      // Vérifier les qualifications
      if (!employeCible.qualifications.includes(tacheADeplacer.etape)) {
        console.warn(`❌ L'employé ${employeCible.nom} n'a pas la qualification requise pour ${tacheADeplacer.etape}`);
        
        // Remettre la tâche à sa place originale
        if (ancienEmployeIndex >= 0 && updatedEmployes[ancienEmployeIndex].planningJour) {
          updatedEmployes[ancienEmployeIndex].planningJour!.push(tacheADeplacer);
        }
        
        // Créer une notification d'erreur
        const notificationErreur: Notification = {
          id: `error-${Date.now()}`,
          type: 'probleme',
          titre: 'Déplacement impossible',
          message: `${employeCible.nom} n'a pas la qualification requise pour ${tacheADeplacer.etape}. Qualifications disponibles: ${employeCible.qualifications.join(', ')}`,
          employeId: employeCible.id,
          tacheId: tacheId,
          timestamp: new Date(),
          lue: false
        };
        
        setNotifications(prev => [notificationErreur, ...prev]);
        return prevEmployes;
      }
      
      // Convertir la date en nom de jour français pour la cohérence avec planningDetaille
      const jourFormate = (() => {
        // Si c'est déjà un nom de jour français, le garder tel quel
        if (['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].includes(nouveauJour.toLowerCase())) {
          return nouveauJour.toLowerCase();
        }
        // Sinon, convertir la date ISO en nom de jour
        const date = new Date(nouveauJour);
        return date.toLocaleDateString('fr-FR', { weekday: 'long' });
      })();
      
      // Calculer la nouvelle dateAssignation basée sur le nouveau jour
      const nouvelleDate = (() => {
        // Si c'est une date ISO, l'utiliser directement
        if (nouveauJour.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return nouveauJour;
        }
        
        // Sinon, calculer la date basée sur le nom du jour
        const joursDeuxDateIndex = {
          'lundi': 1, 'mardi': 2, 'mercredi': 3, 'jeudi': 4, 
          'vendredi': 5, 'samedi': 6, 'dimanche': 0
        };
        
        const aujourdhui = new Date();
        const jourActuel = aujourdhui.getDay();
        const jourCible = joursDeuxDateIndex[jourFormate];
        
        if (jourCible !== undefined) {
          const diffJours = jourCible - jourActuel;
          const dateCalculee = new Date(aujourdhui);
          dateCalculee.setDate(dateCalculee.getDate() + diffJours);
          return dateCalculee.toISOString().split('T')[0];
        }
        
        // Par défaut, utiliser aujourd'hui
        return aujourdhui.toISOString().split('T')[0];
      })();
      
      // Mettre à jour la tâche avec les nouvelles informations
      const tacheModifiee = {
        ...tacheADeplacer,
        heure: nouvelleHeure,
        jour: jourFormate,
        technicien: employeCible.nom,
        dateAssignation: nouvelleDate  // ✅ IMPORTANT: Mettre à jour la dateAssignation
      };
      
      console.log('📝 Tâche modifiée:', tacheModifiee);
      
      // Ajouter la tâche modifiée à l'employé cible
      if (!updatedEmployes[employeCibleIndex].planningJour) {
        updatedEmployes[employeCibleIndex].planningJour = [];
      }
      updatedEmployes[employeCibleIndex].planningJour!.push(tacheModifiee);
      
      console.log('✅ Tâche ajoutée au planning de:', employeCible.nom);
      console.log('📋 État employés après déplacement:', updatedEmployes.map(emp => ({
        id: emp.id,
        nom: emp.nom,
        tachesCount: emp.planningJour?.length || 0,
        taches: emp.planningJour?.map(t => ({ id: t.id, vehicule: t.vehicule, heure: t.heure }))
      })));
      
      // Créer une notification de succès
      const notification: Notification = {
        id: `move-${Date.now()}`,
        type: 'nouvelle_tache',
        titre: 'Tâche déplacée',
        message: `La tâche ${tacheModifiee.tache} pour ${tacheModifiee.vehicule} a été déplacée vers ${employeCible.nom} le ${nouveauJour} à ${nouvelleHeure}`,
        employeId: employeCible.id,
        tacheId: tacheId,
        timestamp: new Date(),
        lue: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      return updatedEmployes;
    });
  }, [setNotifications]);

  // Fonction supprimée avec le système drag & drop

  return {
    employes,
    setEmployes,
    notifications,
    setNotifications,
    userRole,
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
  };
};