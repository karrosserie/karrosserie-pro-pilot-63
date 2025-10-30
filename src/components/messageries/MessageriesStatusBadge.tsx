import { Badge } from "@/components/ui/badge";
import { getStatusConfig, MessageStatus } from "@/lib/messageries-utils";
import { cn } from "@/lib/utils";

interface MessageriesStatusBadgeProps {
  status: MessageStatus;
  className?: string;
}

export function MessageriesStatusBadge({ status, className }: MessageriesStatusBadgeProps) {
  const config = getStatusConfig(status);
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "transition-transform hover:scale-110 border",
        config.color,
        className
      )}
    >
      {config.emoji} {config.label}
    </Badge>
  );
}
