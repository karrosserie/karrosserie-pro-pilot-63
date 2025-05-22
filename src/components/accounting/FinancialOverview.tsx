
import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ChartDataItem {
  month: string;
  revenue: number;
  expenses: number;
}

interface FinancialOverviewProps {
  chartData: ChartDataItem[];
}

const FinancialOverview = ({ chartData }: FinancialOverviewProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Aperçu financier</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" name="Chiffre d'affaires" fill="#F97316" />
            <Bar dataKey="expenses" name="Dépenses" fill="#555555" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
