import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMessageries } from '@/hooks/use-messageries';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { Messagerie } from '@/hooks/use-messageries';

interface ClientConversationsTabProps {
  clientId: string;
}

const ClientConversationsTab: React.FC<ClientConversationsTabProps> = ({ clientId }) => {
  const { messageries, loading, getClientHistory } = useMessageries();
  const [clientMessages, setClientMessages] = useState<Messagerie[]>([]);

  useEffect(() => {
    const fetchClientHistory = async () => {
      if (clientId) {
        const history = await getClientHistory(clientId);
        setClientMessages(history as Messagerie[]);
      }
    };
    fetchClientHistory();
  }, [clientId, getClientHistory]);

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
        {clientMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientConversationsTab;
