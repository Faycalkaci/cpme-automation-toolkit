
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';

const Users = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
        <UsersIcon className="h-8 w-8 mr-3 text-blue-500" />
        Gestion des utilisateurs
      </h1>
      <p className="text-slate-600 mb-6">
        Gérez les comptes utilisateurs et leurs permissions
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            Liste des utilisateurs de votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center border rounded-lg">
            <p className="text-slate-500">La gestion des utilisateurs sera disponible prochainement.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Users;
