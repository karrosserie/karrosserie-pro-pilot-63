import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { useDossierMessageries } from '@/hooks/useDossiers';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DossierMessageriesProps {
  dossierId: string;
}

const getChannelIcon = (channel: string) => {
  switch (channel?.toLowerCase()) {
    case 'email':
      return Mail;
    case 'sms':
    case 'whatsapp':
      return MessageCircle;
    case 'phone':
      return Phone;
    default:
      return MessageSquare;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel?.toLowerCase()) {
    case 'email':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400';
    case 'sms':
      return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
    case 'whatsapp':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400';
    case 'phone':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
    case 'urgent':
      return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
    case 'medium':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const DossierMessageries = ({ dossierId }: DossierMessageriesProps) => {
  const { data: messageries, isLoading } = useDossierMessageries(dossierId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!messageries || messageries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium text-foreground mb-1">Aucune messagerie</h3>
        <p className="text-sm text-muted-foreground">
          Ce dossier n'a pas encore de communications associées.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {messageries.map((message: any) => {
        const ChannelIcon = getChannelIcon(message.channel);
        const isInbound = message.is_inbound;
        
        return (
          <Card key={message.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              {/* Channel Icon */}
              <div className={cn("p-2 rounded-lg shrink-0", getChannelColor(message.channel))}>
                <ChannelIcon className="h-4 w-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {message.title || 'Message'}
                  </h4>
                  {isInbound !== undefined && (
                    <Badge variant="outline" className="text-xs gap-1">
                      {isInbound ? (
                        <>
                          <ArrowDownLeft className="h-3 w-3" />
                          Entrant
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="h-3 w-3" />
                          Sortant
                        </>
                      )}
                    </Badge>
                  )}
                  {message.priority && message.priority !== 'normal' && (
                    <Badge className={cn("text-xs", getPriorityColor(message.priority))}>
                      {message.priority}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {message.channel || 'N/A'}
                  </Badge>
                  {message.status && (
                    <Badge variant="secondary" className="text-xs">
                      {message.status}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {message.created_at && format(new Date(message.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
