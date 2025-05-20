
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('payé') || lowerStatus.includes('terminé') || lowerStatus.includes('validé') || lowerStatus.includes('accepté') || lowerStatus.includes('disponible')) {
      return "bg-green-100 text-green-800 hover:bg-green-100";
    }
    
    if (lowerStatus.includes('attente') || lowerStatus.includes('confirmé') || lowerStatus.includes('brouillon') || lowerStatus.includes('cours') || lowerStatus.includes('importé')) {
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    }
    
    if (lowerStatus.includes('annulé') || lowerStatus.includes('refusé')) {
      return "bg-red-100 text-red-800 hover:bg-red-100";
    }
    
    if (lowerStatus.includes('réservé')) {
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
    
    return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  return (
    <Badge 
      className={cn(
        "font-normal text-xs",
        getStatusColor(status),
        className
      )}
      variant="outline"
    >
      {status}
    </Badge>
  );
}
