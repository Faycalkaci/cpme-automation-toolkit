
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, BarChart2, AreaChart, PieChart } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';

const Statistics = () => {
  // Données fictives pour les graphiques
  const monthlyData = [
    { name: 'Jan', documents: 65, users: 4, templates: 12 },
    { name: 'Fév', documents: 78, users: 5, templates: 14 },
    { name: 'Mar', documents: 98, users: 6, templates: 16 },
    { name: 'Avr', documents: 115, users: 7, templates: 19 },
    { name: 'Mai', documents: 125, users: 7, templates: 21 },
    { name: 'Juin', documents: 132, users: 8, templates: 22 },
    { name: 'Juil', documents: 142, users: 9, templates: 23 },
    { name: 'Août', documents: 158, users: 11, templates: 25 },
    { name: 'Sept', documents: 175, users: 12, templates: 26 },
    { name: 'Oct', documents: 190, users: 13, templates: 29 },
    { name: 'Nov', documents: 210, users: 14, templates: 31 },
    { name: 'Déc', documents: 230, users: 15, templates: 33 },
  ];

  const pieData = [
    { name: 'Documents PDF', value: 65 },
    { name: 'Emails envoyés', value: 45 },
    { name: 'Modèles utilisés', value: 30 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
        <BarChart2 className="h-8 w-8 mr-3 text-purple-500" />
        Statistiques
      </h1>
      <p className="text-slate-600 mb-6">
        Visualisez les performances et l'utilisation de votre plateforme
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Documents générés
            </CardTitle>
            <CardDescription>
              Nombre de documents générés par mois
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="documents" fill="#6366f1" name="Documents" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AreaChart className="h-5 w-5 mr-2 text-blue-500" />
              Utilisateurs actifs
            </CardTitle>
            <CardDescription>
              Évolution du nombre d'utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" fill="#3b82f6" stroke="#2563eb" name="Utilisateurs" />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-green-500" />
            Utilisation des modèles
          </CardTitle>
          <CardDescription>
            Progression de l'utilisation des modèles au fil du temps
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="templates" stroke="#10b981" name="Modèles" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Statistics;
