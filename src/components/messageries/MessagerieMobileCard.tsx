import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Info, 
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Archive,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const PRIORITY_META = {
  1: { 
    label: "Urgent", 
    bgColor: "bg-destructive/10", 
    borderColor: "border-destructive", 
    textColor: "text-destructive", 
    icon: AlertTriangle,
    description: "immédiate (2h)"
  },
  2: { 
    label: "Haute", 
    bgColor: "bg-karrosserie-orange/10", 
    borderColor: "border-karrosserie-orange", 
    textColor: "text-karrosserie-orange", 
    icon: AlertCircle,
    description: "rapide (24h)"
  },
  3: { 
    label: "Normale", 
    bgColor: "bg-yellow-100", 
    borderColor: "border-yellow-500", 
    textColor: "text-yellow-700", 
    icon: FileText,
    description: "à l'étude (48h)"
  },
  4: { 
    label: "Basse", 
    bgColor: "bg-green-100", 
    borderColor: "border-green-500", 
    textColor: "text-green-700", 
    icon: Info,
    description: "simple (7j)"
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Téléphone": return Phone;
    case "Mail": return Mail;
    case "WhatsApp": return MessageSquare;
    case "Message": default: return Smartphone;
  }
};

interface MessagerieMobileCardProps {
  item: {
    id: string;
    priority: number;
    title: string;
    summary: string;
    message: string;
    channel: string;
    eta: string;
    time: string;
    resolved: boolean;
    archived: boolean;
    tags: string[];
  };
  onViewDetails: (id: string) => void;
  onReply: (id: string) => void;
  onToggleResolved: (id: string) => void;
  onArchive: (id: string) => void;
  onEscalate: (id: string) => void;
  onAutoManage?: (id: string) => void;
  onSemiAuto?: (id: string) => void;
  showResolved: boolean;
}

export const MessagerieMobileCard = ({ 
  item, 
  onViewDetails, 
  onReply, 
  onToggleResolved, 
  onArchive, 
  onEscalate, 
  onAutoManage,
  onSemiAuto,
  showResolved 
}: MessagerieMobileCardProps) => {
  const meta = PRIORITY_META[item.priority];
  const IconComponent = meta.icon;
  const ChannelIcon = getChannelIcon(item.channel);

  return (
    <div className={`bg-card border rounded-lg p-4 space-y-3 border-l-4 ${meta.borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
            <IconComponent size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {item.summary}
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
          {item.time}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className={`${meta.textColor} text-xs`}>
          {meta.label}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <ChannelIcon size={12} className="mr-1" />
          {item.channel}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Clock size={12} className="mr-1" />
          {item.eta}
        </Badge>
      </div>

      <p className="text-sm text-card-foreground line-clamp-3">
        {item.message}
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={() => onViewDetails(item.id)}>
          <FileText className="h-4 w-4 mr-1" />
          Détails
        </Button>
        
        {!showResolved && (
          <>
            <Button size="sm" variant="outline" onClick={() => onReply(item.id)}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Répondre
            </Button>
            
            {item.priority !== 1 && onAutoManage && (
              <Button size="sm" variant="outline" onClick={() => onAutoManage(item.id)}>
                Auto
              </Button>
            )}
            
            {onSemiAuto && (
              <Button size="sm" variant="outline" onClick={() => onSemiAuto(item.id)}>
                Semi
              </Button>
            )}
            
            <Button size="sm" variant="destructive" onClick={() => onEscalate(item.id)}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Escalader
            </Button>
          </>
        )}
        
        <Button size="sm" variant="outline" onClick={() => onToggleResolved(item.id)}>
          <CheckCircle className="h-4 w-4 mr-1" />
          {item.resolved ? "Non résolu" : "Résolu"}
        </Button>
        
        <Button size="sm" variant="outline" onClick={() => onArchive(item.id)}>
          <Archive className="h-4 w-4 mr-1" />
          {item.archived ? "Désarchiver" : "Archiver"}
        </Button>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{item.tags.length - 3} autres
            </span>
          )}
        </div>
      )}
    </div>
  );
};