import { useState, useMemo } from "react";
import { useMessageries } from "@/hooks/use-messageries";
import { MessageriesStats } from "./MessageriesStats";
import { MessageriesFilters } from "./MessageriesFilters";
import { MessageriesTimeline } from "./MessageriesTimeline";
import { MessageDetailModal } from "./MessageDetailModal";
import { ReplyModal } from "./ReplyModal";
import { Loading } from "@/components/ui/loading";
import { Messagerie } from "@/hooks/use-messageries";

export default function MessageriesAnalytics() {
  const {
    messageries,
    loading,
    toggleResolved,
    toggleArchived,
  } = useMessageries();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCarrosserie, setSelectedCarrosserie] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Messagerie | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState<Messagerie | null>(null);

  // Filtrage des messages
  const filteredMessages = useMemo(() => {
    let filtered = messageries.filter(m => !m.archived);

    // Filtre par type
    if (selectedType !== "all") {
      filtered = filtered.filter(m => m.channel === selectedType);
    }

    // Filtre par période
    if (selectedPeriod !== "all") {
      const now = new Date();
      
      filtered = filtered.filter(m => {
        const messageDate = new Date(m.created_at);
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
        (m.contact && m.contact.toLowerCase().includes(search))
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [messageries, selectedType, selectedCarrosserie, selectedPeriod, searchTerm]);

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

  const handleReply = (id: string) => {
    const message = messageries.find(m => m.id === id);
    if (message) {
      setReplyMessage(message);
      setReplyModalOpen(true);
    }
  };

  if (loading) {
    return <Loading text="Chargement des messages..." />;
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Centre de Messageries</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos communications depuis un seul endroit
          </p>
        </header>

        <MessageriesStats
          totalMessages={stats.total}
          unreadMessages={stats.unread}
          aiMessages={stats.aiMessages}
          supportMessages={stats.support}
        />

        <MessageriesFilters
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedCarrosserie={selectedCarrosserie}
          selectedPeriod={selectedPeriod}
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          onCarrosserieChange={setSelectedCarrosserie}
          onPeriodChange={setSelectedPeriod}
        />

        <MessageriesTimeline
          messages={filteredMessages}
          onViewMessage={handleViewMessage}
        />

        <MessageDetailModal
          message={selectedMessage}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onReply={handleReply}
          onResolve={toggleResolved}
          onArchive={toggleArchived}
        />

        <ReplyModal
          isOpen={replyModalOpen}
          onClose={() => setReplyModalOpen(false)}
          messagerie={replyMessage}
        />
      </div>
    </div>
  );
}
