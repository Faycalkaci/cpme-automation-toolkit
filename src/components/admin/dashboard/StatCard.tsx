
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
}) => {
  // Determine if change is positive or negative
  const isPositive = change?.includes('+');
  
  return (
    <Card className="border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        {change && (
          <p className={`text-xs mt-2 flex items-center ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
