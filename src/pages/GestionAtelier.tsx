import { useState, useEffect, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dossier, Alert, STATUS_CONFIG, ALERT_CONFIG } from '@/types/atelier';
import { AtelierHeader } from '@/components/atelier/AtelierHeader';
import { AtelierStats } from '@/components/atelier/AtelierStats';
import { AtelierFilters } from '@/components/atelier/AtelierFilters';
import { DossierCard } from '@/components/atelier/DossierCard';
import { NewDossierModal } from '@/components/atelier/modals/NewDossierModal';
import { AlertsModal } from '@/components/atelier/modals/AlertsModal';
import { RestitutionModal } from '@/components/atelier/modals/RestitutionModal';
import { DossierDetailModal } from '@/components/atelier/modals/DossierDetailModal';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Mock data - à remplacer par des vraies données Supabase
const MOCK_DOSSIERS: Dossier[] = [
  { id: 1001, nom: 'Martin', prenom: 'Jean', immatriculation: 'AB-123-CD', mobile: '06 12 34 56 78', email: 'jean.martin@email.com', dateEntree: '2025-01-10', heureEntree: '09:00', status: 'expertise_planifiee', expertisePrevue: true, dateExpertise: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString().split('T')[0], heureExpertise: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toTimeString().slice(0, 5), notes: 'Choc avant droit', marqueModele: 'Peugeot 308', vin: 'VF3LBHZTXJS123456', numeroSinistre: 'SIN-2025-00123', kmEntree: '45230', relances: [], historique: [{ date: '2025-01-10T09:00:00', action: 'Création', status: 'entree_atelier' }] },
  { id: 1002, nom: 'Dupont', prenom: 'Marie', immatriculation: 'EF-456-GH', mobile: '06 98 76 54 32', email: 'marie.dupont@email.com', dateEntree: '2025-01-08', heureEntree: '14:30', status: 'termine', expertiseEffectuee: true, dateFin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Portière + peinture', marqueModele: 'Renault Clio V', kmEntree: '32100', montantTTC: '2450.00', relances: [], historique: [{ date: '2025-01-08T14:30:00', action: 'Création', status: 'entree_atelier' }] },
  { id: 1003, nom: 'Bernard', prenom: 'Pierre', immatriculation: 'IJ-789-KL', mobile: '06 11 22 33 44', dateEntree: '2025-01-07', heureEntree: '11:00', status: 'rdv_restitution', dateRestitution: new Date().toISOString().split('T')[0], heureRestitution: '16:00', notes: 'Client VIP', marqueModele: 'Porsche 911', kmEntree: '12500', montantTTC: '8900.00', relances: [], historique: [{ date: '2025-01-07T11:00:00', action: 'Création', status: 'entree_atelier' }] },
  { id: 1004, nom: 'Petit', prenom: 'Sophie', immatriculation: 'MN-012-OP', mobile: '06 55 66 77 88', dateEntree: '2025-01-09', heureEntree: '08:30', status: 'en_reparation', notes: 'Pare-brise', marqueModele: 'Citroën C3', kmEntree: '67800', relances: [], historique: [{ date: '2025-01-09T08:30:00', action: 'Création', status: 'entree_atelier' }] }
];

const GestionAtelier = () => {
  const isMobile = useIsMobile();
  const [dossiers, setDossiers] = useState<Dossier[]>(MOCK_DOSSIERS);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [showNewDossier, setShowNewDossier] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showRestitutionModal, setShowRestitutionModal] = useState<Dossier | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateAlerts = (d: Dossier): Alert[] => {
    const alerts: Alert[] = [];
    const now = currentTime;
    
    if (d.dateExpertise && d.status === 'expertise_planifiee') {
      const exp = new Date(`${d.dateExpertise}T${d.heureExpertise || '09:00'}`);
      const diff = exp.getTime() - now.getTime();
      if (diff < 0) alerts.push({ type: 'expertise_passee', dossier: d });
      else if (diff <= 2 * 60 * 60 * 1000) alerts.push({ type: 'expertise_2h', dossier: d, countdown: diff });
      else if (diff <= 24 * 60 * 60 * 1000) alerts.push({ type: 'expertise_24h', dossier: d, countdown: diff });
    }
    
    if (d.dateRestitution && d.status === 'rdv_restitution') {
      const rest = new Date(`${d.dateRestitution}T${d.heureRestitution || '09:00'}`);
      const diff = rest.getTime() - now.getTime();
      if (diff < 0) alerts.push({ type: 'restitution_passee', dossier: d });
      else if (rest.toDateString() === now.toDateString()) alerts.push({ type: 'restitution_aujourdhui', dossier: d, countdown: diff });
    }
    
    if (d.status === 'termine' && !d.dateRestitution && d.dateFin && (now.getTime() - new Date(d.dateFin).getTime()) > 60 * 60 * 1000) {
      alerts.push({ type: 'sans_rdv_restitution', dossier: d });
    }
    
    return alerts;
  };

  const allAlerts = useMemo(() =>
    dossiers.flatMap(d => calculateAlerts(d)).sort((a, b) => ALERT_CONFIG[a.type].priority - ALERT_CONFIG[b.type].priority),
    [dossiers, currentTime]
  );

  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const mins = Math.floor((ms % (60 * 60 * 1000)) / 60000);
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };

  const filteredDossiers = useMemo(() => {
    let result = [...dossiers];

    if (activeTab === 'alertes') {
      const alertDossierIds = allAlerts.map(a => a.dossier.id);
      result = result.filter(d => alertDossierIds.includes(d.id));
    } else if (activeTab === 'expertise') {
      result = result.filter(d => ['attente_expertise', 'expertise_planifiee', 'expertise_effectuee'].includes(d.status));
    } else if (activeTab === 'restitution') {
      result = result.filter(d => ['termine', 'rdv_restitution'].includes(d.status));
    } else if (activeTab === 'clotures') {
      result = result.filter(d => d.status === 'cloture');
    }

    if (filterStatus !== 'all') {
      result = result.filter(d => d.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.immatriculation.toLowerCase().includes(term) ||
        d.nom.toLowerCase().includes(term) ||
        d.prenom?.toLowerCase().includes(term) ||
        d.mobile.includes(term)
      );
    }

    return result;
  }, [dossiers, activeTab, filterStatus, searchTerm, allAlerts]);

  const updateStatus = (id: number, status: string, data: Partial<Dossier> = {}) => {
    setDossiers(dossiers.map(d => d.id === id ? {
      ...d, status, ...data,
      historique: [...d.historique, { date: new Date().toISOString(), action: STATUS_CONFIG[status].label, status }]
    } : d));
    if (selectedDossier?.id === id) {
      setSelectedDossier(prev => prev ? { ...prev, status, ...data } : null);
    }
    toast.success(`Statut mis à jour: ${STATUS_CONFIG[status].label}`);
  };

  const handleCreateDossier = (data: any) => {
    const newDossier: Dossier = {
      ...data,
      id: Date.now(),
      dateEntree: new Date().toISOString().split('T')[0],
      heureEntree: new Date().toTimeString().slice(0, 5),
      status: data.expertisePrevue ? (data.dateExpertise ? 'expertise_planifiee' : 'attente_expertise') : 'entree_atelier',
      relances: [],
      historique: [{ date: new Date().toISOString(), action: 'Création', status: 'entree_atelier' }]
    };
    setDossiers([newDossier, ...dossiers]);
    toast.success('Dossier créé');
  };

  const handlePlanifierRestitution = (dossier: Dossier, dateRestitution: string, heureRestitution: string) => {
    updateStatus(dossier.id, 'rdv_restitution', { dateRestitution, heureRestitution });
  };

  const openWhatsApp = (d: Dossier, type: string) => {
    const phone = d.mobile.replace(/\s/g, '');
    let msg = '';
    if (type === 'rdv_restitution') {
      msg = `Bonjour ${d.prenom}, votre véhicule ${d.immatriculation} est prêt. Merci de nous contacter pour planifier la restitution.`;
    } else if (type === 'rappel_expertise') {
      msg = `Bonjour ${d.prenom}, rappel: expertise prévue le ${d.dateExpertise} à ${d.heureExpertise} pour ${d.immatriculation}.`;
    }
    window.open(`https://wa.me/33${phone.slice(1)}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAction = (action: string, dossier: Dossier) => {
    switch (action) {
      case 'whatsapp_rdv':
        openWhatsApp(dossier, 'rdv_restitution');
        break;
      case 'whatsapp_expertise':
        openWhatsApp(dossier, 'rappel_expertise');
        break;
      case 'planifier_rdv':
        setShowRestitutionModal(dossier);
        setSelectedDossier(null);
        break;
      case 'signer_pv':
        toast.info('PV de réception - Fonctionnalité à venir');
        break;
      case 'attente_pieces':
        const pieces = prompt('Pièces en attente:');
        if (pieces) updateStatus(dossier.id, 'attente_pieces', { piecesAttente: pieces });
        break;
      case 'terminer':
        updateStatus(dossier.id, 'termine', { dateFin: new Date().toISOString() });
        break;
      case 'expertise_effectuee':
        updateStatus(dossier.id, 'expertise_effectuee');
        break;
    }
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      <AtelierHeader
        allAlerts={allAlerts}
        onShowAlerts={() => setShowAlerts(true)}
        onNewDossier={() => setShowNewDossier(true)}
      />

      <AtelierStats dossiers={dossiers} allAlerts={allAlerts} />

      <AtelierFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        alertsCount={allAlerts.length}
      />

      <div className="space-y-3">
        {filteredDossiers.map(d => (
          <DossierCard
            key={d.id}
            dossier={d}
            alerts={calculateAlerts(d)}
            onSelect={setSelectedDossier}
            onAction={handleAction}
            formatCountdown={formatCountdown}
          />
        ))}
        
        {filteredDossiers.length === 0 && (
          <Card className="p-8 text-center">
            <span className="text-4xl">🔍</span>
            <p className="text-muted-foreground mt-2">Aucun véhicule trouvé</p>
          </Card>
        )}
      </div>

      {/* Modals */}
      <NewDossierModal
        open={showNewDossier}
        onOpenChange={setShowNewDossier}
        onSubmit={handleCreateDossier}
      />

      <AlertsModal
        open={showAlerts}
        onOpenChange={setShowAlerts}
        alerts={allAlerts}
        onSelectDossier={setSelectedDossier}
        formatCountdown={formatCountdown}
      />

      <RestitutionModal
        open={!!showRestitutionModal}
        onOpenChange={(open) => !open && setShowRestitutionModal(null)}
        dossier={showRestitutionModal}
        onSubmit={handlePlanifierRestitution}
      />

      <DossierDetailModal
        open={!!selectedDossier}
        onOpenChange={(open) => !open && setSelectedDossier(null)}
        dossier={selectedDossier}
        onAction={handleAction}
      />
    </div>
  );
};

export default GestionAtelier;
