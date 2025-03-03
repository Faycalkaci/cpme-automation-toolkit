
import React from 'react';
import { motion } from 'framer-motion';
import SettingsTabs from '@/components/settings/SettingsTabs';

const Settings = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres</h1>
        <p className="text-slate-600 mb-6">
          Gérez votre profil, la sécurité et les notifications
        </p>
        
        <SettingsTabs />
      </motion.div>
    </div>
  );
};

export default Settings;
