
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TabItemProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  comingSoon?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ title, description, children, comingSoon = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {comingSoon ? (
          <div className="h-96 flex items-center justify-center border rounded-lg">
            <p className="text-slate-500">Les {title.toLowerCase()} avancés seront disponibles prochainement.</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default TabItem;
