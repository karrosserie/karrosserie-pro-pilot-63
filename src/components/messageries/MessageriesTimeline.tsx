import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, Smartphone, Clock, User } from "lucide-react";
import { Messagerie, Client } from "@/hooks/use-messageries";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageriesTimelineProps {
  messages: Messagerie[];
  onViewMessage: (message: Messagerie) => void;
  onViewClientHistory?: (client: Client) => void;
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Téléphone": return Phone;
    case "Mail": return Mail;
    case "WhatsApp": return MessageSquare;
    case "Message": default: return Smartphone;
  }
};

const getPriorityBadge = (priority: number, resolved: boolean) => {
  if (resolved) {
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Traité</Badge>;
  }
  
  switch (priority) {
    case 1:
      return <Badge className="bg-destructive/10 text-destructive border-destructive">🔴 Urgent</Badge>;
    case 2:
      return <Badge className="bg-karrosserie-orange/10 text-karrosserie-orange border-karrosserie-orange">🟠 Haute</Badge>;
    case 3:
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">🟡 Normale</Badge>;
    case 4:
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">🔵 Basse</Badge>;
    default:
      return null;
  }
};

const getPriorityBorderColor = (priority: number) => {
  switch (priority) {
    case 1: return 'border-l-red-500';
    case 2: return 'border-l-orange-500';
    case 3: return 'border-l-yellow-500';
    case 4: return 'border-l-blue-500';
    default: return 'border-l-gray-300';
  }
};

export function MessageriesTimeline({ messages, onViewMessage, onViewClientHistory }: MessageriesTimelineProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun message trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const ChannelIcon = getChannelIcon(message.channel);
        const timeAgo = formatDistanceToNow(new Date(message.created_at), {
          addSuffix: true,
          locale: fr,
        });

        return (
          <Card key={message.id} className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityBorderColor(message.priority)}`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ChannelIcon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPriorityBadge(message.priority, message.resolved)}
                      {!message.resolved && (
                        <Badge variant="secondary" className="bg-karrosserie-orange/10 text-karrosserie-orange">
                          Non lu
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <ChannelIcon className="h-3 w-3 mr-1" />
                        {message.channel}
                      </Badge>
                      <span className={`text-xs px-2 py-1 rounded ${
                        message.is_inbound 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {message.is_inbound ? '→ Entrant' : '← Sortant'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end text-sm text-muted-foreground whitespace-nowrap">
                      <span className="text-xs">
                        {new Date(message.actual_communication_date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-base mb-1">{message.title}</h3>
                  
                  {message.client && (
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewClientHistory && message.client) {
                            onViewClientHistory(message.client);
                          }
                        }}
                      >
                        <User className="h-3 w-3 mr-1" />
                        {message.client.first_name} {message.client.last_name}
                      </Button>
                      {message.client.email && (
                        <span className="text-xs text-muted-foreground">• {message.client.email}</span>
                      )}
                    </div>
                  )}
                  
                  {!message.client && message.contact && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Contact: {message.contact}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {message.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {message.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onViewMessage(message)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
