
import React from 'react';
import { Building, Users, FileText, Activity } from 'lucide-react';
import StatCard from './StatCard';

interface StatItem {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change: string;
}

const StatsSection: React.FC = () => {
  const stats: StatItem[] = [
    {
      title: "Licences actives",
      value: "24",
      description: "Accès à la plateforme",
      icon: <Building className="h-8 w-8 text-primary/60" />,
      change: "+12% depuis le mois dernier"
    },
    {
      title: "Utilisateurs totaux",
      value: "187",
      description: "Utilisateurs enregistrés",
      icon: <Users className="h-8 w-8 text-blue-500/60" />,
      change: "+8% depuis le mois dernier"
    },
    {
      title: "Documents générés",
      value: "1,234",
      description: "PDF générés ce mois-ci",
      icon: <FileText className="h-8 w-8 text-green-500/60" />,
      change: "+27% depuis le mois dernier"
    },
    {
      title: "Taux de conversion",
      value: "68%",
      description: "Essais vers abonnements",
      icon: <Activity className="h-8 w-8 text-purple-500/60" />,
      change: "+4% depuis le mois dernier"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default StatsSection;
