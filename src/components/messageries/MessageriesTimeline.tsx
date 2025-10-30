import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, Smartphone, Clock } from "lucide-react";
import { Messagerie } from "@/hooks/use-messageries";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageriesTimelineProps {
  messages: Messagerie[];
  onViewMessage: (message: Messagerie) => void;
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
      return <Badge className="bg-destructive/10 text-destructive border-destructive">Urgent</Badge>;
    case 2:
      return <Badge className="bg-karrosserie-orange/10 text-karrosserie-orange border-karrosserie-orange">Haute</Badge>;
    case 3:
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Normale</Badge>;
    case 4:
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Basse</Badge>;
    default:
      return null;
  }
};

export function MessageriesTimeline({ messages, onViewMessage }: MessageriesTimelineProps) {
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
          <Card key={message.id} className="hover:shadow-md transition-shadow">
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
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {timeAgo}
                    </div>
                  </div>

                  <h3 className="font-semibold text-base mb-1">{message.title}</h3>
                  
                  {message.contact && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Client: {message.contact}
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
