
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-slate-500">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        {change && <p className="text-xs text-slate-500 mt-1">{change}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
