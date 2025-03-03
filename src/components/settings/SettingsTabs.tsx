
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MailIcon, Shield } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import { useAuth } from '@/contexts/AuthContext';

const SettingsTabs = () => {
  const { user } = useAuth();
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profile" className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          Profil
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Sécurité
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center">
          <MailIcon className="h-4 w-4 mr-2" />
          Notifications
        </TabsTrigger>
      </TabsList>
      
      {/* Profile Tab */}
      <TabsContent value="profile">
        <ProfileSettings user={user} />
      </TabsContent>
      
      {/* Security Tab */}
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
      
      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
