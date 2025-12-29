import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Messagerie, Client, MessagerieReply } from "@/hooks/use-messageries";
import { Phone, Mail, MessageSquare, Smartphone, Clock, Calendar, Tag, User, History, MoreVertical, CheckCircle, Archive, MessageCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const processedMessageIdRef = useRef<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (message && open && message.id !== processedMessageIdRef.current) {
      processedMessageIdRef.current = message.id;
      fetchReplies();
      markMessageAsRead();
    }
    
    if (!open) {
      processedMessageIdRef.current = null;
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
      const { error: repliesError } = await supabase
        .from('messagerie_replies')
        .update({ read_by_company: true })
        .eq('messagerie_id', message.id)
        .eq('read_by_company', false);

      if (repliesError) {
        console.error('Erreur lors du marquage des réponses:', repliesError);
      }

      if (message.status === 'nouveau') {
        const { error: statusError } = await supabase
          .from('messageries')
          .update({ status: 'en_cours' })
          .eq('id', message.id);

        if (statusError) {
          console.error('Erreur lors de la mise à jour du statut:', statusError);
        } else if (onStatusChange) {
          onStatusChange(message.id, 'en_cours');
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
  const isInboundMessage = message.is_inbound !== false;
  const isOutboundMessage = message.is_inbound === false;

  // Contenu partagé entre mobile et desktop
  const messageContent = (
    <div className="space-y-4">
      {/* Badge priorité */}
      <Badge className={priorityInfo.color}>
        Priorité {message.priority} - {priorityInfo.label}
      </Badge>

      {/* Informations Client */}
      {message.client && (
        <Card className="p-3 bg-muted/30">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-1">
                <User className="h-4 w-4 shrink-0" />
                Client
              </h4>
              <p className="text-sm font-medium truncate">
                {message.client.first_name} {message.client.last_name}
              </p>
              <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                {message.client.email && (
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 shrink-0" />
                    {message.client.email}
                  </span>
                )}
                {message.client.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 shrink-0" />
                    {message.client.phone}
                  </span>
                )}
              </div>
            </div>
            {onViewClientHistory && !isMobile && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onViewClientHistory(message.client!);
                  onOpenChange(false);
                }}
              >
                <History className="h-4 w-4 mr-2" />
                Historique
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Fil de conversation */}
      {replies.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversation ({replies.length})
          </h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {replies.map((reply) => {
              const isClientMessage = reply.sender_type === 'client' || reply.is_inbound;
              const isInternalNote = reply.sender_type === 'internal';

              return (
                <Card
                  key={reply.id}
                  className={`p-2 text-sm ${
                    isInternalNote
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : isClientMessage
                      ? 'bg-blue-50 border-l-4 border-blue-500 ml-2'
                      : 'bg-green-50 border-l-4 border-green-500 mr-2'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant={
                      isInternalNote ? 'secondary' :
                      isClientMessage ? 'outline' : 'default'
                    } className="text-xs">
                      {isInternalNote 
                        ? '📝 Note'
                        : isClientMessage 
                        ? '📩 Client' 
                        : '📤 Envoyé'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(reply.actual_communication_date)}
                    </span>
                  </div>
                  <p className="text-xs whitespace-pre-wrap line-clamp-3">{reply.content}</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Résumé */}
      <div>
        <h4 className="font-semibold text-sm mb-1">Résumé</h4>
        <p className="text-sm bg-muted p-2 rounded-lg">{message.summary}</p>
      </div>

      {/* Message complet */}
      <div>
        <h4 className="font-semibold text-sm mb-1">Message complet</h4>
        <p className="text-sm bg-muted p-2 rounded-lg whitespace-pre-wrap">{message.message}</p>
      </div>

      {/* Métadonnées */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <h4 className="font-semibold text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <ChannelIcon className="h-3 w-3" />
            Canal
          </h4>
          <Badge variant="outline" className="text-xs">{message.channel}</Badge>
        </div>

        <div>
          <h4 className="font-semibold text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ETA
          </h4>
          <Badge variant="outline" className="text-xs">{message.eta}</Badge>
        </div>

        <div className="col-span-2">
          <h4 className="font-semibold text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Date
          </h4>
          <p className="text-xs">{message.date} à {message.time}</p>
        </div>
      </div>

      {/* Tags */}
      {message.tags.length > 0 && (
        <div>
          <h4 className="font-semibold text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Tags
          </h4>
          <div className="flex gap-1 flex-wrap">
            {message.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Rendu mobile avec Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] flex flex-col p-0">
          {/* Header sticky */}
          <SheetHeader className="px-4 py-3 border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ChannelIcon className="h-5 w-5 text-primary" />
              </div>
              <SheetTitle className="text-left text-base line-clamp-2 flex-1">
                {message.title}
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {messageContent}
          </div>

          {/* Footer sticky avec actions */}
          <div className="shrink-0 border-t bg-background p-3 space-y-2">
            {/* Actions principales */}
            <div className="flex gap-2">
              {isInboundMessage ? (
                <Button onClick={() => onReply(message.id)} className="flex-1" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Répondre
                </Button>
              ) : (
                <Button onClick={() => onReply(message.id)} className="flex-1" variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Suivi
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => {
                  onResolve(message.id);
                  onOpenChange(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {message.resolved ? "Rouvrir" : "Résoudre"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isInboundMessage && (
                    <>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange('en_cours')}
                        disabled={message.status === 'en_cours'}
                      >
                        <Loader2 className="h-4 w-4 mr-2" />
                        Mettre en cours
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange('en_attente_client')}
                        disabled={message.status === 'en_attente_client'}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        En attente client
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('resolu')}
                    disabled={message.status === 'resolu'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marquer résolu
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      onArchive(message.id);
                      onOpenChange(false);
                    }}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    {message.archived ? "Désarchiver" : "Archiver"}
                  </DropdownMenuItem>
                  {onViewClientHistory && message.client && (
                    <DropdownMenuItem onClick={() => onViewClientHistory(message.client!)}>
                      <History className="h-4 w-4 mr-2" />
                      Historique client
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Rendu desktop avec Dialog (inchangé)
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
              {isInboundMessage && (
                <>
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
                </>
              )}
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
              {isInboundMessage && (
                <Button onClick={() => onReply(message.id)} className="flex-1">
                  Répondre
                </Button>
              )}
              {isOutboundMessage && (
                <Button onClick={() => onReply(message.id)} className="flex-1" variant="outline">
                  Ajouter un suivi
                </Button>
              )}
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
