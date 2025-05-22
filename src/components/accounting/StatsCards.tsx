
import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface StatsCardItem {
  title: string;
  value: string;
  period: string;
  trend: string;
  trendUp: boolean;
}

interface StatsCardsProps {
  cards: StatsCardItem[];
}

const StatsCards = ({ cards }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {card.period}
            </p>
            <div className={`flex items-center mt-2 text-sm ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {card.trendUp ? (
                <ArrowUpCircle className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 mr-1" />
              )}
              <span>{card.trend} par rapport à l'an dernier</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
