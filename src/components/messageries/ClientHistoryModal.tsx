import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, MessageCircle, Clock, Calendar } from "lucide-react";
import { Messagerie, Client } from "@/hooks/use-messageries";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  messages: Messagerie[];
  onNewMessage: (clientId: string) => void;
}

export function ClientHistoryModal({ 
  isOpen, 
  onClose, 
  client, 
  messages,
  onNewMessage 
}: ClientHistoryModalProps) {
  const [filteredMessages, setFilteredMessages] = useState<Messagerie[]>([]);

  useEffect(() => {
    if (client && messages) {
      const clientMessages = messages.filter(m => m.client_id === client.id);
      setFilteredMessages(clientMessages);
    }
  }, [client, messages]);

  if (!client) return null;

  const stats = {
    total: filteredMessages.length,
    resolved: filteredMessages.filter(m => m.resolved).length,
    pending: filteredMessages.filter(m => !m.resolved && !m.archived).length,
    avgResponseTime: "2h 30min", // TODO: Calculate from replies
  };

  const getPriorityBadge = (priority: number) => {
    const variants = {
      1: { label: "Urgent", variant: "destructive" as const },
      2: { label: "Normal", variant: "default" as const },
      3: { label: "Faible", variant: "secondary" as const },
    };
    const config = variants[priority as keyof typeof variants] || variants[2];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Historique de communication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {/* Infos client */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {client.first_name} {client.last_name}
                </h3>
                <Button 
                  size="sm" 
                  onClick={() => {
                    onClose();
                    onNewMessage(client.id);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nouvelle communication
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {client.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground mt-1">Total messages</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground mt-1">Résolus</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground mt-1">En attente</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-bold">{stats.avgResponseTime}</div>
              <div className="text-xs text-muted-foreground mt-1">Temps moyen</div>
            </Card>
          </div>

          {/* Timeline des messages */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Historique des communications
            </h4>

            {filteredMessages.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune communication avec ce client</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <Card key={message.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{message.channel}</Badge>
                            {getPriorityBadge(message.priority)}
                            {message.resolved && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                                Résolu
                              </Badge>
                            )}
                          </div>
                          <h5 className="font-medium">{message.title}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {message.summary}
                          </p>
                        </div>
                        <div className="text-right text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </div>
                      </div>

                      {message.replies_count !== undefined && message.replies_count > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t">
                          <MessageCircle className="h-3 w-3" />
                          {message.replies_count} réponse{message.replies_count > 1 ? 's' : ''}
                        </div>
                      )}

                      {message.tags && message.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {message.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
