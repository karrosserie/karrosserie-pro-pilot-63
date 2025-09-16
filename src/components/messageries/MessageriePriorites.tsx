import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Info, 
  ChevronRight, 
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Calendar,
  Tag,
  X,
  Loader2
} from "lucide-react";
import { useMessageries } from "@/hooks/use-messageries";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessagerieMobileCard } from './MessagerieMobileCard';
import { SemiAutoModal } from './SemiAutoModal';
import { ReplyModal } from './ReplyModal';

// -------------------------------
// MessageriePriorites (connecté à Supabase)
// - Version basée sur un tableau de bord par priorité.
// - Onglets: Urgent / Haute / Normale / Basse
// - Vue détaillée par priorité
// -------------------------------

const PRIORITY_META = {
  1: { 
    label: "Urgent", 
    bgColor: "bg-destructive/10", 
    borderColor: "border-destructive", 
    textColor: "text-destructive", 
    icon: AlertTriangle,
    description: "immédiate (2h)"
  },
  2: { 
    label: "Haute", 
    bgColor: "bg-karrosserie-orange/10", 
    borderColor: "border-karrosserie-orange", 
    textColor: "text-karrosserie-orange", 
    icon: AlertCircle,
    description: "rapide (24h)"
  },
  3: { 
    label: "Normale", 
    bgColor: "bg-yellow-100", 
    borderColor: "border-yellow-500", 
    textColor: "text-yellow-700", 
    icon: FileText,
    description: "à l'étude (48h)"
  },
  4: { 
    label: "Basse", 
    bgColor: "bg-green-100", 
    borderColor: "border-green-500", 
    textColor: "text-green-700", 
    icon: Info,
    description: "simple (7j)"
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Téléphone": return Phone;
    case "Mail": return Mail;
    case "WhatsApp": return MessageSquare;
    case "Message": default: return Smartphone;
  }
};

export default function MessageriePriorites() {
  const [searchParams] = useSearchParams();
  const messageIdFromUrl = searchParams.get('messageId');
  
  const {
    messageries,
    loading,
    toggleResolved,
    toggleArchived,
    escalateMessage,
    autoManage,
    handleReply,
    handleSemiAuto,
  } = useMessageries();

  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof messageries[0] | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [semiAutoModalOpen, setSemiAutoModalOpen] = useState(false);
  const [semiAutoMessage, setSemiAutoMessage] = useState<typeof messageries[0] | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState<typeof messageries[0] | null>(null);
  const isMobile = useIsMobile();

  // Auto-select message when messageId is provided in URL
  useEffect(() => {
    if (messageIdFromUrl && messageries.length > 0) {
      const targetMessage = messageries.find(msg => msg.id === messageIdFromUrl);
      if (targetMessage) {
        setSelectedPriority(targetMessage.priority);
        setSelectedItem(targetMessage);
      }
    }
  }, [messageIdFromUrl, messageries]);

  const activeItems = useMemo(() => {
    if (showResolved) {
      return messageries.filter(item => item.resolved);
    }
    if (showArchived) {
      return messageries.filter(item => item.archived);
    }
    return messageries.filter(item => !item.resolved && !item.archived);
  }, [messageries, showResolved, showArchived]);

  const priorityCounts = useMemo(() => {
    return activeItems.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [activeItems]);

  function handleViewDetails(id: string) {
    const it = messageries.find((i) => i.id === id);
    if (it) setSelectedItem(it);
  }

  const handleBack = () => {
    setSelectedPriority(null);
  };

  const handleArchive = (id: string) => {
    toggleArchived(id);
  };

  const handleSemiAutoClick = (id: string) => {
    const messagerie = messageries.find(m => m.id === id);
    if (messagerie) {
      setSemiAutoMessage(messagerie);
      setSemiAutoModalOpen(true);
    }
  };

  const handleReplyClick = (id: string) => {
    const messagerie = messageries.find(m => m.id === id);
    if (messagerie) {
      setReplyMessage(messagerie);
      setReplyModalOpen(true);
    }
  };

  // Composant pour le tableau de bord des priorités
  const DashboardView = () => (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Classification Intelligente des Messages</CardTitle>
          <CardDescription>
            Notre IA analyse automatiquement tous les messages entrants et les classe par niveau de priorité
          </CardDescription>
          <div className="mt-4 text-2xl font-bold text-primary">
            {activeItems.length} message{activeItems.length > 1 ? "s" : ""} {
              showResolved ? "traités" : (showArchived ? "archivés" : "en attente")
            }
          </div>
        </CardHeader>
      </Card>

      {[1, 2, 3, 4].map(priority => {
        const meta = PRIORITY_META[priority];
        const count = priorityCounts[priority] || 0;
        const IconComponent = meta.icon;
        
        return (
          <Card
            key={priority}
            className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${meta.borderColor}`}
            onClick={() => setSelectedPriority(priority)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{meta.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    Messages nécessitant une intervention {meta.description}
                  </p>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {count} message{count > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Composant pour la vue détaillée d'une priorité
  const PriorityView = ({ priority }: { priority: number }) => {
    const meta = PRIORITY_META[priority];
    const filteredItems = useMemo(() => activeItems.filter(item => item.priority === priority), [activeItems, priority]);
    const IconComponent = meta.icon;

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
              <IconComponent size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{meta.label}</h1>
              <p className="text-sm text-muted-foreground">
                Messages nécessitant une intervention {meta.description}
              </p>
            </div>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          isMobile ? (
            <div className="space-y-4">
              {filteredItems.map(it => (
                <MessagerieMobileCard
                  key={it.id}
                  item={it}
                  onViewDetails={handleViewDetails}
                  onReply={handleReplyClick}
                  onToggleResolved={toggleResolved}
                  onArchive={handleArchive}
                  onEscalate={escalateMessage}
                  onAutoManage={autoManage}
                  onSemiAuto={handleSemiAutoClick}
                  showResolved={showResolved}
                />
              ))}
            </div>
          ) : (
            filteredItems.map(it => {
              const ChannelIcon = getChannelIcon(it.channel);
              
              return (
                <Card key={it.id} className={`border-l-4 ${meta.borderColor}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{it.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{it.summary}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={meta.textColor}>
                              {meta.label}
                            </Badge>
                            <Badge variant="outline">
                              <ChannelIcon size={12} className="mr-1" />
                              {it.channel}
                            </Badge>
                            <Badge variant="outline">
                              <Clock size={12} className="mr-1" />
                              {it.eta}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{it.time}</div>
                    </div>
                    
                    <p className="mt-4 text-sm">{it.message}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => handleViewDetails(it.id)}>
                        Détails complets
                      </Button>
                      {!showResolved && (
                        <>
                          <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => handleReplyClick(it.id)}>
                            Répondre
                          </Button>
                           {it.priority !== 1 && (
                             <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white" onClick={() => autoManage(it.id)}>
                               Réponse auto
                             </Button>
                           )}
                           <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white" onClick={() => handleSemiAutoClick(it.id)}>
                              Semi auto
                            </Button>
                           <Button size="sm" variant="destructive" onClick={() => escalateMessage(it.id)}>
                             Escalader
                           </Button>
                        </>
                      )}
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => toggleResolved(it.id)}>
                        {it.resolved ? "Marquer non résolu" : "Marquer résolu"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleArchive(it.id)}>
                        {it.archived ? "Désarchiver" : "Archiver"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">Aucun message de cette priorité.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} bg-background min-h-screen`}>
      <header className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'} gap-4 mb-6`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Centre de messages</h1>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Tous vos canaux de communication</p>
          </div>
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
          <Button
            size={isMobile ? "sm" : "default"}
            variant={!showResolved && !showArchived ? "default" : "outline"}
            onClick={() => { setShowResolved(false); setShowArchived(false); }}
          >
            {isMobile ? 'En attente' : 'Messages en attente'}
          </Button>
          <Button
            size={isMobile ? "sm" : "default"}
            variant={showResolved ? "default" : "outline"}
            onClick={() => { setShowResolved(true); setShowArchived(false); }}
          >
            {isMobile ? 'Traités' : 'Messages traités'}
          </Button>
          <Button
            size={isMobile ? "sm" : "default"}
            variant={showArchived ? "default" : "outline"}
            onClick={() => { setShowArchived(true); setShowResolved(false); }}
          >
            {isMobile ? 'Archivés' : 'Messages archivés'}
          </Button>
        </div>
      </header>

      {loading && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg transition-all duration-300 z-50 animate-fade-in flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Chargement des messages...
        </div>
      )}

      {selectedPriority === null ? <DashboardView /> : <PriorityView priority={selectedPriority} />}

      {/* Modal des détails */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${PRIORITY_META[selectedItem.priority].bgColor} ${PRIORITY_META[selectedItem.priority].textColor}`}>
                    {React.createElement(PRIORITY_META[selectedItem.priority].icon, { size: 24 })}
                  </div>
                  <div>
                    <CardTitle>Détails de l'incident #{selectedItem.id}</CardTitle>
                    <Badge className={PRIORITY_META[selectedItem.priority].textColor}>
                      Priorité {selectedItem.priority} - {PRIORITY_META[selectedItem.priority].label}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Titre</h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description détaillée</h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Canal de communication</h3>
                  <div className="flex items-center gap-2">
                    {React.createElement(getChannelIcon(selectedItem.channel), { size: 20 })}
                    <Badge variant="outline">{selectedItem.channel}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Temps de traitement estimé</h3>
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <Badge variant="outline">{selectedItem.eta}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Horodatage</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <Badge variant="outline">{selectedItem.time}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tags associés</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Actions rapides</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => { handleReplyClick(selectedItem.id); setSelectedItem(null); }}>
                    Répondre
                  </Button>
                  {selectedItem.priority !== 1 && (
                    <>
                      <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white" onClick={() => { autoManage(selectedItem.id); setSelectedItem(null); }}>
                        Réponse auto
                      </Button>
                       <Button size="sm" variant="outline" onClick={() => { handleSemiAutoClick(selectedItem.id); setSelectedItem(null); }}>
                         Semi auto
                       </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { escalateMessage(selectedItem.id); setSelectedItem(null); }}>
                    Escalader
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { toggleResolved(selectedItem.id); setSelectedItem(null); }}>
                    Marquer résolu
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { handleArchive(selectedItem.id); setSelectedItem(null); }}>
                    Archiver
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setSelectedItem(null)}>
                Fermer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Modal Semi Auto */}
      <SemiAutoModal
        isOpen={semiAutoModalOpen}
        onClose={() => setSemiAutoModalOpen(false)}
        messagerie={semiAutoMessage}
      />
      
      {/* Modal Réponse */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        messagerie={replyMessage}
      />
    </div>
  );
}
