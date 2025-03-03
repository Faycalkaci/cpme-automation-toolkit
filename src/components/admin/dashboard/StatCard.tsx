
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

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
  return (
    <Card className="border-none shadow-soft hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-slate-500">
            {title}
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        {change && (
          <p className={`text-xs mt-2 flex items-center ${change.startsWith('+') ? 'text-green-500' : change.startsWith('-') ? 'text-red-500' : 'text-slate-500'}`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
