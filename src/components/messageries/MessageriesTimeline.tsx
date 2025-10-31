import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageSquare, User, Clock, LucideIcon } from "lucide-react";
import { Messagerie, Client } from "@/hooks/use-messageries";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MessageriesCategoryBadge } from "./MessageriesCategoryBadge";
import { MessageriesStatusBadge } from "./MessageriesStatusBadge";
import { getCategoryConfig } from "@/lib/messageries-utils";

interface MessageriesTimelineProps {
  messages: Messagerie[];
  onViewMessage: (message: Messagerie) => void;
  onViewClientHistory?: (client: Client) => void;
}

function getChannelIcon(channel: string): LucideIcon {
  const channelLower = channel.toLowerCase();
  if (channelLower.includes('mail') || channelLower.includes('email')) return Mail;
  if (channelLower.includes('phone') || channelLower.includes('téléphone')) return Phone;
  if (channelLower.includes('whatsapp') || channelLower.includes('message')) return MessageSquare;
  return Mail;
}

function getPriorityBadge(priority: number, resolved: boolean) {
  if (resolved) return <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">Traité</Badge>;
  
  switch (priority) {
    case 1: return <Badge className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">🔴 Urgent</Badge>;
    case 2: return <Badge className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800">🟠 Haute</Badge>;
    case 3: return <Badge className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">🟡 Normale</Badge>;
    case 4: return <Badge className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">🔵 Basse</Badge>;
    default: return null;
  }
}

function getPriorityBorderColor(priority: number) {
  switch (priority) {
    case 1: return 'border-l-red-500';
    case 2: return 'border-l-orange-500';
    case 3: return 'border-l-yellow-500';
    case 4: return 'border-l-blue-500';
    default: return 'border-l-gray-300';
  }
}

export function MessageriesTimeline({ messages, onViewMessage, onViewClientHistory }: MessageriesTimelineProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      {messages.length === 0 ? (
        <Card><CardContent className="flex items-center justify-center py-12"><p className="text-muted-foreground">Aucun message</p></CardContent></Card>
      ) : (
        messages.map((message, index) => {
          const ChannelIcon = getChannelIcon(message.channel);
          const categoryConfig = getCategoryConfig(message.category || 'autre');
          const CategoryIconComponent = categoryConfig.icon;
          
          return (
            <Card key={message.id} className={cn("group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 relative overflow-hidden animate-slide-in dark:bg-card/50 dark:backdrop-blur-sm dark:border-primary/20 dark:hover:border-primary/40", getPriorityBorderColor(message.priority))} style={{ animationDelay: `${index * 50}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-5 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow", `bg-gradient-to-br ${categoryConfig.gradient}`)}>
                    <CategoryIconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-xs"><ChannelIcon className="h-3 w-3 mr-1" />{message.channel}</Badge>
                      <MessageriesCategoryBadge category={message.category || 'autre'} className="text-xs" />
                      <MessageriesStatusBadge status={message.status || 'nouveau'} className="text-xs" />
                      {getPriorityBadge(message.priority, message.resolved)}
                      <Badge variant="outline" className={cn("text-xs transition-all", message.is_inbound ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800" : "bg-gray-50 dark:bg-gray-950/20")}>{message.is_inbound ? '→ Entrant' : '← Sortant'}</Badge>
                      {(message.replies_count !== undefined && message.replies_count > 0) && (
                        <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800">
                          💬 {message.replies_count} échange{message.replies_count > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{message.title}</h3>
                    {message.client && (
                      <Button variant="ghost" size="sm" className="h-auto p-1 mb-2 hover:bg-primary/10 transition-colors -ml-1" onClick={(e) => { e.stopPropagation(); onViewClientHistory?.(message.client!); }}>
                        <User className="h-3 w-3 mr-1" />
                        <span className="font-medium">{message.client.first_name} {message.client.last_name}</span>
                        {message.client.email && <span className="text-xs text-muted-foreground ml-2">• {message.client.email}</span>}
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{message.summary}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex gap-1 flex-wrap">
                        {message.tags.slice(0, 3).map((tag, i) => <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>)}
                        {message.tags.length > 3 && <Badge variant="outline" className="text-xs">+{message.tags.length - 3}</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(message.actual_communication_date), { locale: fr, addSuffix: true })}</span>
                        <Button size="sm" onClick={() => onViewMessage(message)} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all">Voir</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
