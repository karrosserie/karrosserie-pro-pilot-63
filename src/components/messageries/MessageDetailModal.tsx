import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Messagerie, Client, MessagerieReply } from "@/hooks/use-messageries";
import { Phone, Mail, MessageSquare, Smartphone, Clock, Calendar, Tag, User, History } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageDetailModalProps {
  message: Messagerie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: (id: string) => void;
  onResolve: (id: string) => void;
  onArchive: (id: string) => void;
  onViewClientHistory?: (client: Client) => void;
  onStatusChange?: (id: string, status: Messagerie['status']) => void;
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Téléphone": return Phone;
    case "Mail": return Mail;
    case "WhatsApp": return MessageSquare;
    case "Message": default: return Smartphone;
  }
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1: return { label: "Urgent", color: "text-destructive" };
    case 2: return { label: "Haute", color: "text-karrosserie-orange" };
    case 3: return { label: "Normale", color: "text-yellow-700" };
    case 4: return { label: "Basse", color: "text-blue-700" };
    default: return { label: "Inconnue", color: "text-muted-foreground" };
  }
};

export function MessageDetailModal({
  message,
  open,
  onOpenChange,
  onReply,
  onResolve,
  onArchive,
  onViewClientHistory,
  onStatusChange,
}: MessageDetailModalProps) {
  const [replies, setReplies] = useState<MessagerieReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    if (message && open) {
      fetchReplies();
      markMessageAsRead();
    }
  }, [message, open]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchReplies = async () => {
    if (!message) return;
    
    setLoadingReplies(true);
    try {
      const { data, error } = await supabase
        .from('messagerie_replies')
        .select('*')
        .eq('messagerie_id', message.id)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setReplies((data || []) as MessagerieReply[]);
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const markMessageAsRead = async () => {
    if (!message) return;
    
    try {
      // 1. Marquer les réponses non lues comme lues
      const { error: repliesError } = await supabase
        .from('messagerie_replies')
        .update({ read_by_company: true })
        .eq('messagerie_id', message.id)
        .eq('read_by_company', false);

      if (repliesError) {
        console.error('Erreur lors du marquage des réponses:', repliesError);
      }

      // 2. Si le message est "nouveau", le passer en "en_cours"
      if (message.status === 'nouveau') {
        const { error: statusError } = await supabase
          .from('messageries')
          .update({ status: 'en_cours' })
          .eq('id', message.id);

        if (statusError) {
          console.error('Erreur lors de la mise à jour du statut:', statusError);
        }
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleStatusChange = (status: Messagerie['status']) => {
    if (message && onStatusChange) {
      onStatusChange(message.id, status);
      onOpenChange(false);
    }
  };

  if (!message) return null;

  const ChannelIcon = getChannelIcon(message.channel);
  const priorityInfo = getPriorityLabel(message.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ChannelIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{message.title}</DialogTitle>
              <DialogDescription>
                <Badge className={priorityInfo.color}>
                  Priorité {message.priority} - {priorityInfo.label}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Informations Client */}
          {message.client && (
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations Client
                  </h4>
                  <p className="text-sm font-medium">
                    {message.client.first_name} {message.client.last_name}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {message.client.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.client.email}
                      </span>
                    )}
                    {message.client.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {message.client.phone}
                      </span>
                    )}
                  </div>
                </div>
                {onViewClientHistory && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onViewClientHistory(message.client!);
                      onOpenChange(false);
                    }}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Voir l'historique
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Fil de conversation */}
          {replies.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Fil de conversation ({replies.length})
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {replies.map((reply) => {
                  const isClientMessage = reply.sender_type === 'client' || reply.is_inbound;
                  const isInternalNote = reply.sender_type === 'internal';
                  const isCompanyMessage = reply.sender_type === 'carrosserie' && !reply.is_inbound;

                  return (
                    <Card
                      key={reply.id}
                      className={`p-3 ${
                        isInternalNote
                          ? 'bg-yellow-50 border-l-4 border-yellow-400'
                          : isClientMessage
                          ? 'bg-blue-50 border-l-4 border-blue-500 ml-4'
                          : 'bg-green-50 border-l-4 border-green-500 mr-4'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            isInternalNote ? 'secondary' :
                            isClientMessage ? 'outline' : 'default'
                          } className="text-xs">
                            {isInternalNote 
                              ? '📝 Note interne'
                              : isClientMessage 
                              ? '📩 Message client' 
                              : '📤 Envoyé par nous'}
                          </Badge>
                          {reply.channel && !isInternalNote && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              {reply.channel === 'Mail' && '📧'}
                              {reply.channel === 'WhatsApp' && '💬'}
                              {reply.channel === 'Téléphone' && '📞'}
                              {reply.channel === 'Message' && '💬'}
                              {reply.channel}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(reply.actual_communication_date)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                      
                      {/* Indicateur de lecture */}
                      {!isInternalNote && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          {isClientMessage ? (
                            reply.read_by_company ? '✓✓ Lu' : '✓ Envoyé'
                          ) : (
                            reply.read_by_client ? '✓✓ Lu par le client' : '✓ Envoyé au client'
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Résumé
            </h4>
            <p className="text-sm bg-muted p-3 rounded-lg">{message.summary}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message complet
            </h4>
            <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">{message.message}</p>
          </div>

          {message.reponse && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Réponse
              </h4>
              <p className="text-sm bg-muted p-3 rounded-lg">{message.reponse}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ChannelIcon className="h-4 w-4" />
                Canal
              </h4>
              <Badge variant="outline">{message.channel}</Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Temps estimé
              </h4>
              <Badge variant="outline">{message.eta}</Badge>
            </div>

            {message.contact && (
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm">{message.contact}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </h4>
              <p className="text-sm">{message.date} à {message.time}</p>
            </div>
          </div>

          {message.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex gap-2 flex-wrap">
                {message.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions de changement de statut */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('en_cours')}
                disabled={message.status === 'en_cours'}
              >
                Mettre en cours
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('en_attente_client')}
                disabled={message.status === 'en_attente_client'}
              >
                En attente client
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('resolu')}
                disabled={message.status === 'resolu'}
              >
                Marquer comme résolu
              </Button>
            </div>

            {/* Actions principales */}
            <div className="flex gap-2">
              <Button onClick={() => onReply(message.id)} className="flex-1">
                Répondre
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onResolve(message.id);
                  onOpenChange(false);
                }}
              >
                {message.resolved ? "Rouvrir" : "Résoudre"}
              </Button>
              <Button
                onClick={() => {
                  onArchive(message.id);
                  onOpenChange(false);
                }}
                variant="outline"
              >
                {message.archived ? "Désarchiver" : "Archiver"}
              </Button>
              {onViewClientHistory && message.client && (
                <Button 
                  variant="outline" 
                  onClick={() => onViewClientHistory(message.client!)}
                >
                  <History className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
