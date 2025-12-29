import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Messagerie, Client } from '@/hooks/use-messageries';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  User,
  Clock,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getCategoryConfig } from '@/lib/messageries-utils';

interface MessageriesMobileTimelineCardProps {
  message: Messagerie;
  onViewMessage: (message: Messagerie) => void;
  onViewClientHistory?: (client: Client) => void;
}

function getChannelIcon(channel: string): LucideIcon {
  const channelLower = channel.toLowerCase();
  if (channelLower.includes('mail') || channelLower.includes('email')) return Mail;
  if (channelLower.includes('phone') || channelLower.includes('téléphone')) return Phone;
  return MessageSquare;
}

function getPriorityStyle(priority: number) {
  switch (priority) {
    case 1: return { border: 'border-l-red-500', bg: 'bg-red-50 dark:bg-red-950/30', emoji: '🔴' };
    case 2: return { border: 'border-l-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', emoji: '🟠' };
    case 3: return { border: 'border-l-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', emoji: '🟡' };
    case 4: return { border: 'border-l-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', emoji: '🔵' };
    default: return { border: 'border-l-gray-300', bg: 'bg-gray-50 dark:bg-gray-950/30', emoji: '⚪' };
  }
}

export function MessageriesMobileTimelineCard({ 
  message, 
  onViewMessage,
  onViewClientHistory 
}: MessageriesMobileTimelineCardProps) {
  const ChannelIcon = getChannelIcon(message.channel);
  const priorityStyle = getPriorityStyle(message.priority);
  const categoryConfig = getCategoryConfig(message.category || 'autre');
  const CategoryIcon = categoryConfig.icon;

  return (
    <Card 
      className={cn(
        "border-l-4 active:scale-[0.98] transition-transform cursor-pointer",
        priorityStyle.border,
        message.resolved && "opacity-70"
      )}
      onClick={() => onViewMessage(message)}
    >
      <CardContent className="p-3">
        {/* Ligne 1: Icône catégorie + Titre + Time */}
        <div className="flex items-start gap-2 mb-2">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
            `bg-gradient-to-br ${categoryConfig.gradient}`
          )}>
            <CategoryIcon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-1">{message.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{message.summary}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Ligne 2: Client + Canal */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          {message.client && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onViewClientHistory?.(message.client!);
              }}
            >
              <User className="h-3 w-3" />
              <span className="truncate max-w-[120px]">
                {message.client.first_name} {message.client.last_name}
              </span>
            </Button>
          )}
          <Badge variant="outline" className="text-xs h-5 px-1.5 gap-0.5">
            <ChannelIcon className="h-3 w-3" />
          </Badge>
        </div>

        {/* Ligne 3: Badges et temps */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 flex-wrap">
            <Badge 
              variant="outline" 
              className={cn("text-xs h-5 px-1.5", priorityStyle.bg)}
            >
              {priorityStyle.emoji}
            </Badge>
            {message.resolved && (
              <Badge variant="outline" className="text-xs h-5 px-1.5 bg-green-50 dark:bg-green-950/30">
                ✅
              </Badge>
            )}
            {message.is_inbound === false && (
              <Badge variant="outline" className="text-xs h-5 px-1.5">
                ←
              </Badge>
            )}
            {(message.replies_count !== undefined && message.replies_count > 0) && (
              <Badge variant="outline" className="text-xs h-5 px-1.5 bg-purple-50 dark:bg-purple-950/30">
                💬 {message.replies_count}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(message.actual_communication_date), { 
              locale: fr, 
              addSuffix: false 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
