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
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAtelierDossiers } from '@/hooks/use-atelier-dossiers';

const GestionAtelier = () => {
  const isMobile = useIsMobile();
  const { dossiers, isLoading, updateStatus: updateStatusMutation, refetch } = useAtelierDossiers();
  
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
        d.mobile?.includes(term)
      );
    }

    return result;
  }, [dossiers, activeTab, filterStatus, searchTerm, allAlerts]);

  const handleUpdateStatus = (id: string, status: string, data: Partial<Dossier> = {}) => {
    updateStatusMutation({ 
      id, 
      status,
      endDate: data.dateRestitution && data.heureRestitution 
        ? `${data.dateRestitution}T${data.heureRestitution}:00` 
        : undefined
    });
    toast.success(`Statut mis à jour: ${STATUS_CONFIG[status]?.label || status}`);
  };

  const handleCreateDossier = (data: any) => {
    // TODO: Créer un repair_order via le service existant
    toast.info('Création de dossier - Utilisez la page Ordres de réparation');
    setShowNewDossier(false);
  };

  const handlePlanifierRestitution = (dossier: Dossier, dateRestitution: string, heureRestitution: string) => {
    handleUpdateStatus(dossier.id, 'rdv_restitution', { dateRestitution, heureRestitution });
    setShowRestitutionModal(null);
  };

  const openWhatsApp = (d: Dossier, type: string) => {
    if (!d.mobile) {
      toast.error('Numéro de téléphone non disponible');
      return;
    }
    const phone = d.mobile.replace(/\s/g, '').replace(/^0/, '33');
    let msg = '';
    if (type === 'rdv_restitution') {
      msg = `Bonjour ${d.prenom}, votre véhicule ${d.immatriculation} est prêt. Merci de nous contacter pour planifier la restitution.`;
    } else if (type === 'rappel_expertise') {
      msg = `Bonjour ${d.prenom}, rappel: expertise prévue le ${d.dateExpertise} à ${d.heureExpertise} pour ${d.immatriculation}.`;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
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
        if (pieces) handleUpdateStatus(dossier.id, 'attente_pieces');
        break;
      case 'terminer':
        handleUpdateStatus(dossier.id, 'termine');
        break;
      case 'expertise_effectuee':
        handleUpdateStatus(dossier.id, 'expertise_effectuee');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
            <Search className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-2">
              {dossiers.length === 0 ? 'Aucun véhicule en atelier' : 'Aucun véhicule trouvé'}
            </p>
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
