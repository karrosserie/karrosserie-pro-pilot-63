import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Eye, Bot, Headphones, LucideIcon } from "lucide-react";

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
  unreadMessages: number;
  aiMessages: number;
  supportMessages: number;
}

export function MessageriesStats({ 
  totalMessages, 
  unreadMessages, 
  aiMessages, 
  supportMessages 
}: MessageriesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={MessageSquare}
        label="Total Communications"
        value={totalMessages}
        bgColor="bg-primary/10"
        iconColor="text-primary"
      />
      <StatCard
        icon={Eye}
        label="Messages non lus"
        value={unreadMessages}
        bgColor="bg-karrosserie-orange/10"
        iconColor="text-karrosserie-orange"
      />
      <StatCard
        icon={Bot}
        label="Assistant IA"
        value={aiMessages}
        bgColor="bg-violet-100"
        iconColor="text-violet-600"
      />
      <StatCard
        icon={Headphones}
        label="Support SAV"
        value={supportMessages}
        bgColor="bg-muted"
        iconColor="text-muted-foreground"
      />
    </div>
  );
}
