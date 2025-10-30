import { Badge } from "@/components/ui/badge";
import { getCategoryConfig, MessageCategory } from "@/lib/messageries-utils";
import { cn } from "@/lib/utils";

interface MessageriesCategoryBadgeProps {
  category: MessageCategory;
  className?: string;
}

export function MessageriesCategoryBadge({ category, className }: MessageriesCategoryBadgeProps) {
  const config = getCategoryConfig(category);
  
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
