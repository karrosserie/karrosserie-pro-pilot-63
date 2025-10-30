import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Clock, CheckCircle, LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, bgColor, iconColor }: StatCardProps) {
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={AlertTriangle}
        label="🔴 Urgents"
        value={urgentMessages}
        bgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard
        icon={AlertCircle}
        label="🟠 Haute priorité"
        value={highPriorityMessages}
        bgColor="bg-orange-100"
        iconColor="text-orange-600"
      />
      <StatCard
        icon={Clock}
        label="En attente"
        value={unresolvedMessages}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={CheckCircle}
        label="Total échanges"
        value={totalMessages}
        bgColor="bg-gray-100"
        iconColor="text-gray-600"
      />
    </div>
  );
}
