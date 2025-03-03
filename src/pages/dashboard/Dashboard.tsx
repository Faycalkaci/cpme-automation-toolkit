
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  Settings 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Importer un fichier',
      description: 'Téléchargez un fichier Excel ou CSV pour commencer',
      icon: <Upload className="h-6 w-6 text-primary" />,
      link: '/spreadsheets',
      color: 'bg-primary/10'
    },
    {
      title: 'Mes classeurs',
      description: 'Gérez vos fichiers de données importés',
      icon: <FileSpreadsheet className="h-6 w-6 text-blue-500" />,
      link: '/spreadsheets',
      color: 'bg-blue-500/10'
    },
    {
      title: 'Mes documents',
      description: 'Accédez aux PDFs générés précédemment',
      icon: <FileText className="h-6 w-6 text-green-500" />,
      link: '/documents',
      color: 'bg-green-500/10'
    },
    {
      title: 'Emails envoyés',
      description: 'Historique des emails automatiques envoyés',
      icon: <Mail className="h-6 w-6 text-amber-500" />,
      link: '/emails',
      color: 'bg-amber-500/10'
    }
  ];

  // Admin-only cards
  const adminCards = [
    {
      title: 'Gérer les modèles',
      description: 'Configurer les modèles de documents PDF',
      icon: <FileText className="h-6 w-6 text-indigo-500" />,
      link: '/templates',
      color: 'bg-indigo-500/10'
    },
    {
      title: 'Paramètres',
      description: 'Configuration du compte et des options',
      icon: <Settings className="h-6 w-6 text-slate-500" />,
      link: '/settings',
      color: 'bg-slate-500/10'
    }
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
        <p className="text-slate-600">
          Bienvenue, <span className="font-medium">{user?.name}</span>. Que souhaitez-vous faire aujourd'hui?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer" onClick={() => navigate(card.link)}>
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="p-0 flex items-center text-primary group">
                  Accéder <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {isAdmin && adminCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (dashboardCards.length + index) * 0.1 }}
          >
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer" onClick={() => navigate(card.link)}>
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="p-0 flex items-center text-primary group">
                  Accéder <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
