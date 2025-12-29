import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Clock, CheckCircle, LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  compact?: boolean;
}

function StatCard({ icon: Icon, label, value, bgColor, iconColor, compact }: StatCardProps) {
  if (compact) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageriesStatsProps {
  totalMessages: number;
  urgentMessages: number;
  highPriorityMessages: number;
  unresolvedMessages: number;
}

export function MessageriesStats({ 
  totalMessages, 
  urgentMessages, 
  highPriorityMessages, 
  unresolvedMessages 
}: MessageriesStatsProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "gap-3 mb-4 sm:mb-6",
      isMobile ? "grid grid-cols-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    )}>
      <StatCard
        icon={AlertTriangle}
        label="🔴 Urgents"
        value={urgentMessages}
        bgColor="bg-red-100"
        iconColor="text-red-600"
        compact={isMobile}
      />
      <StatCard
        icon={AlertCircle}
        label="🟠 Haute priorité"
        value={highPriorityMessages}
        bgColor="bg-orange-100"
        iconColor="text-orange-600"
        compact={isMobile}
      />
      <StatCard
        icon={Clock}
        label="En attente"
        value={unresolvedMessages}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        compact={isMobile}
      />
      <StatCard
        icon={CheckCircle}
        label="Total échanges"
        value={totalMessages}
        bgColor="bg-gray-100"
        iconColor="text-gray-600"
        compact={isMobile}
      />
    </div>
  );
}
