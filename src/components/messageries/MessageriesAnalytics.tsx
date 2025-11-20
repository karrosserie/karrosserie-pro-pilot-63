import { useState, useMemo, useEffect } from "react";
import { useMessageries } from "@/hooks/use-messageries";
import { MessageriesStats } from "./MessageriesStats";
import { MessageriesFilters } from "./MessageriesFilters";
import { MessageriesTimeline } from "./MessageriesTimeline";
import { MessageDetailModal } from "./MessageDetailModal";
import { ClientHistoryModal } from "./ClientHistoryModal";
import { MessageriesHeader } from "./MessageriesHeader";
import { MessageriesTabs } from "./MessageriesTabs";
import { Loading } from "@/components/ui/loading";
import { Messagerie, Client } from "@/hooks/use-messageries";
import { clientsService } from "@/services/supabase/clients";

export default function MessageriesAnalytics() {
  const {
    messageries,
    loading,
    updateStatus,
    toggleResolved,
    toggleArchived,
    refetch,
  } = useMessageries();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedClientFilter, setSelectedClientFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeView, setActiveView] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Messagerie | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [clientHistoryModalOpen, setClientHistoryModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);

  // Charger tous les clients au montage
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clients = await clientsService.getAll();
        const transformedClients = clients.map(c => ({
          id: c.id,
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: c.phone,
        }));
        setAllClients(transformedClients);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
      }
    };
    loadClients();
  }, []);

  // Filtrage des messages
  const filteredMessages = useMemo(() => {
    let filtered = messageries.filter(m => !m.archived);

    // Filtre par vue active
    if (activeView === "urgent") {
      filtered = filtered.filter(m => m.priority === 1 && !m.resolved);
    } else if (activeView === "new") {
      filtered = filtered.filter(m => m.status === 'nouveau');
    } else if (activeView === "pending") {
      filtered = filtered.filter(m => m.status === 'en_cours' || m.status === 'en_attente_client');
    } else if (activeView === "resolved") {
      filtered = filtered.filter(m => m.resolved || m.status === 'resolu');
    }

    // Filtre par type
    if (selectedType !== "all") {
      filtered = filtered.filter(m => m.channel === selectedType);
    }

    // Filtre par client
    if (selectedClientFilter !== "all") {
      filtered = filtered.filter(m => m.client_id === selectedClientFilter);
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter(m => m.status === selectedStatus);
    }

    // Filtre par période
    if (selectedPeriod !== "all") {
      const now = new Date();
      
      filtered = filtered.filter(m => {
        const messageDate = new Date(m.actual_communication_date || m.created_at);
        switch (selectedPeriod) {
          case "today":
            return messageDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return messageDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return messageDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filtre par priorité
    if (selectedPriority !== "all") {
      filtered = filtered.filter(m => m.priority === parseInt(selectedPriority));
    }

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(search) ||
        m.summary.toLowerCase().includes(search) ||
        m.message.toLowerCase().includes(search) ||
        (m.contact && m.contact.toLowerCase().includes(search)) ||
        (m.client && `${m.client.first_name} ${m.client.last_name}`.toLowerCase().includes(search))
      );
    }

    // Tri intelligent : non résolus d'abord, puis par priorité (1 = plus urgent), puis par date
    return filtered.sort((a, b) => {
      // 1. Messages non résolus d'abord
      if (a.resolved !== b.resolved) {
        return a.resolved ? 1 : -1;
      }
      
      // 2. Par priorité (1 = plus urgent, donc ordre croissant)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      // 3. Par date (plus récent en premier)
      return new Date(b.actual_communication_date || b.created_at).getTime() - 
             new Date(a.actual_communication_date || a.created_at).getTime();
    });
  }, [messageries, selectedType, selectedClientFilter, selectedPeriod, searchTerm, selectedPriority, selectedCategory, selectedStatus, activeView]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const nonArchived = messageries.filter(m => !m.archived);
    
    return {
      total: nonArchived.length,
      urgent: nonArchived.filter(m => m.priority === 1 && !m.resolved).length,
      highPriority: nonArchived.filter(m => m.priority === 2 && !m.resolved).length,
      unresolved: nonArchived.filter(m => !m.resolved).length,
      new: nonArchived.filter(m => m.status === 'nouveau').length,
      pending: nonArchived.filter(m => m.status === 'en_cours' || m.status === 'en_attente_client').length,
      resolved: nonArchived.filter(m => m.resolved || m.status === 'resolu').length,
    };
  }, [messageries]);

  const handleViewMessage = (message: Messagerie) => {
    setSelectedMessage(message);
    setDetailModalOpen(true);
  };

  const handleViewClientHistory = (client: Client) => {
    setSelectedClient(client);
    setClientHistoryModalOpen(true);
  };

  if (loading) {
    return <Loading text="Chargement des messages..." />;
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <MessageriesHeader 
          onQuickFilterUrgent={() => {
            setSelectedPriority("1");
            setActiveView("urgent");
          }}
          onQuickFilterHigh={() => {
            setSelectedPriority("2");
            setActiveView("all");
          }}
          onShowAll={() => {
            setSelectedPriority("all");
            setActiveView("all");
          }}
          urgentCount={stats.urgent}
          highPriorityCount={stats.highPriority}
          currentFilter={selectedPriority}
        />

        <MessageriesStats
          totalMessages={stats.total}
          urgentMessages={stats.urgent}
          highPriorityMessages={stats.highPriority}
          unresolvedMessages={stats.unresolved}
        />

        <MessageriesTabs
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            // Reset autres filtres quand on change de vue
            if (view !== "all") {
              setSelectedPriority("all");
            }
          }}
          stats={{
            total: stats.total,
            urgent: stats.urgent,
            new: stats.new,
            pending: stats.pending,
            resolved: stats.resolved,
          }}
        />

        <MessageriesFilters
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedClient={selectedClientFilter}
          selectedPeriod={selectedPeriod}
          selectedPriority={selectedPriority}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          clients={allClients}
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          onClientChange={setSelectedClientFilter}
          onPeriodChange={setSelectedPeriod}
          onPriorityChange={setSelectedPriority}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
        />

        <MessageriesTimeline
          messages={filteredMessages}
          onViewMessage={handleViewMessage}
          onViewClientHistory={handleViewClientHistory}
        />

        <MessageDetailModal
          message={selectedMessage}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onReply={() => {}}
          onResolve={toggleResolved}
          onArchive={toggleArchived}
          onViewClientHistory={handleViewClientHistory}
          onStatusChange={updateStatus}
        />

        <ClientHistoryModal
          isOpen={clientHistoryModalOpen}
          onClose={() => setClientHistoryModalOpen(false)}
          client={selectedClient}
          messages={messageries}
        />
      </div>
    </div>
  );
}
