
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import LicenseManager from '@/components/admin/LicenseManager';

const Licenses = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
        <ShieldCheck className="h-8 w-8 mr-3 text-primary" />
        Gestion des licences
      </h1>
      <p className="text-slate-600 mb-6">
        Consultez et gérez les licences de votre organisation
      </p>

      <LicenseManager />
    </motion.div>
  );
};

export default Licenses;
