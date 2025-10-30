import { useState, useMemo } from "react";
import { useMessageries } from "@/hooks/use-messageries";
import { MessageriesStats } from "./MessageriesStats";
import { MessageriesFilters } from "./MessageriesFilters";
import { MessageriesTimeline } from "./MessageriesTimeline";
import { MessageDetailModal } from "./MessageDetailModal";
import { ClientHistoryModal } from "./ClientHistoryModal";
import { MessageriesHeader } from "./MessageriesHeader";
import { Loading } from "@/components/ui/loading";
import { Messagerie, Client } from "@/hooks/use-messageries";

export default function MessageriesAnalytics() {
  const {
    messageries,
    loading,
    toggleResolved,
    toggleArchived,
    refetch,
  } = useMessageries();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedClientFilter, setSelectedClientFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Messagerie | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [clientHistoryModalOpen, setClientHistoryModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Liste unique des clients
  const uniqueClients = useMemo(() => {
    const clientsMap = new Map<string, Client>();
    messageries.forEach(m => {
      if (m.client && m.client_id) {
        clientsMap.set(m.client_id, m.client);
      }
    });
    return Array.from(clientsMap.values()).sort((a, b) => 
      `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
    );
  }, [messageries]);

  // Filtrage des messages
  const filteredMessages = useMemo(() => {
    let filtered = messageries.filter(m => !m.archived);

    // Filtre par type
    if (selectedType !== "all") {
      filtered = filtered.filter(m => m.channel === selectedType);
    }

    // Filtre par client
    if (selectedClientFilter !== "all") {
      filtered = filtered.filter(m => m.client_id === selectedClientFilter);
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

    return filtered.sort((a, b) => 
      new Date(b.actual_communication_date || b.created_at).getTime() - 
      new Date(a.actual_communication_date || a.created_at).getTime()
    );
  }, [messageries, selectedType, selectedClientFilter, selectedPeriod, searchTerm]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = messageries.filter(m => !m.archived).length;
    const unread = messageries.filter(m => !m.resolved && !m.archived).length;
    const aiMessages = messageries.filter(m => m.priority === 4 && !m.archived).length;
    const support = messageries.filter(m => 
      (m.channel === "Téléphone" || m.channel === "Mail") && !m.archived
    ).length;

    return {
      total,
      unread,
      aiMessages,
      support,
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
        <MessageriesHeader />

        <MessageriesStats
          totalMessages={stats.total}
          unreadMessages={stats.unread}
          aiMessages={stats.aiMessages}
          supportMessages={stats.support}
        />

        <MessageriesFilters
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedClient={selectedClientFilter}
          selectedPeriod={selectedPeriod}
          clients={uniqueClients}
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          onClientChange={setSelectedClientFilter}
          onPeriodChange={setSelectedPeriod}
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
