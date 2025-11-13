import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useMessageries } from '@/hooks/use-messageries';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, Clock, ChevronDown, ChevronUp, User, Building2 } from 'lucide-react';
import { Messagerie, MessagerieReply } from '@/hooks/use-messageries';
import { cn } from '@/lib/utils';

interface ClientConversationsTabProps {
  clientId: string;
}

const ClientConversationsTab: React.FC<ClientConversationsTabProps> = ({ clientId }) => {
  const { messageries, loading, getClientHistory, fetchReplies } = useMessageries();
  const [clientMessages, setClientMessages] = useState<Messagerie[]>([]);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [repliesCache, setRepliesCache] = useState<Record<string, MessagerieReply[]>>({});

  useEffect(() => {
    const fetchClientHistory = async () => {
      if (clientId) {
        const history = await getClientHistory(clientId);
        setClientMessages(history as Messagerie[]);
      }
    };
    fetchClientHistory();
  }, [clientId, getClientHistory]);

  const toggleExpanded = async (messageId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
      // Charger les réponses si pas déjà en cache
      if (!repliesCache[messageId]) {
        const replies = await fetchReplies(messageId);
        setRepliesCache(prev => ({ ...prev, [messageId]: replies }));
      }
    }
    setExpandedMessages(newExpanded);
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) {
      return <Badge variant="destructive">Urgent</Badge>;
    } else if (priority >= 5) {
      return <Badge variant="default">Normal</Badge>;
    } else {
      return <Badge variant="secondary">Faible</Badge>;
    }
  };

  const getStatusBadge = (status: string, isResolved: boolean) => {
    if (isResolved) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Résolu</Badge>;
    }
    
    switch (status) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'new':
        return <Badge className="bg-blue-500">Nouveau</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  if (clientMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune conversation</h3>
        <p className="text-muted-foreground">
          Ce client n'a pas encore de conversation enregistrée.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Historique des conversations</h3>
          <p className="text-sm text-muted-foreground">
            {clientMessages.length} conversation{clientMessages.length > 1 ? 's' : ''} trouvée{clientMessages.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {clientMessages.map((message) => {
          const isExpanded = expandedMessages.has(message.id);
          const replies = repliesCache[message.id] || [];
          
          return (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(message.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(message.status || '', message.resolved || false)}
                        {getPriorityBadge(message.priority || 5)}
                        <Badge variant="outline" className="capitalize">
                          {message.channel || 'email'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{message.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {message.summary}
                      </CardDescription>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {message.created_at 
                          ? format(new Date(message.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })
                          : 'Date inconnue'}
                      </span>
                    </div>
                    {message.replies_count !== undefined && message.replies_count > 0 && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{message.replies_count} réponse{message.replies_count > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {message.tags && message.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        {message.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <CollapsibleContent>
                    <div className="border-t pt-4 space-y-4">
                      {/* Message initial */}
                      <div className={cn(
                        "flex gap-3 p-4 rounded-lg",
                        message.is_inbound 
                          ? "bg-muted/50" 
                          : "bg-primary/5 border border-primary/10"
                      )}>
                        <div className={cn(
                          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                          message.is_inbound ? "bg-muted" : "bg-primary/10"
                        )}>
                          {message.is_inbound ? (
                            <User className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Building2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {message.is_inbound ? 'Client' : 'Carrosserie'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.created_at 
                                ? format(new Date(message.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })
                                : ''}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        </div>
                      </div>

                      {/* Réponses */}
                      {replies.length > 0 && (
                        <div className="space-y-3 pl-4 border-l-2 border-border">
                          {replies.map((reply) => (
                            <div key={reply.id} className={cn(
                              "flex gap-3 p-4 rounded-lg",
                              reply.sender_type === 'client'
                                ? "bg-muted/50"
                                : "bg-primary/5 border border-primary/10"
                            )}>
                              <div className={cn(
                                "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                reply.sender_type === 'client' ? "bg-muted" : "bg-primary/10"
                              )}>
                                {reply.sender_type === 'client' ? (
                                  <User className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Building2 className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {reply.sender_type === 'client' ? 'Client' : 'Carrosserie'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {reply.sent_at 
                                      ? format(new Date(reply.sent_at), "d MMM yyyy 'à' HH:mm", { locale: fr })
                                      : ''}
                                  </span>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {reply.channel}
                                  </Badge>
                                </div>
                                <p className="text-sm whitespace-pre-wrap break-words">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClientConversationsTab;
