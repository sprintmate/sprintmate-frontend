import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Eye, Mail, User, KeyRound } from 'lucide-react';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    projectUpdates: true,
    newProjects: true,
    messages: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={18} /> Notification Settings
            </CardTitle>
            <CardDescription>Configure how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-500">Receive notifications via email</div>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Browser Notifications</div>
                  <div className="text-sm text-gray-500">Get desktop notifications</div>
                </div>
                <Switch 
                  checked={notifications.browser}
                  onCheckedChange={() => handleNotificationChange('browser')}
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium mb-3">Notification Types</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Project updates</div>
                    <Switch 
                      checked={notifications.projectUpdates}
                      onCheckedChange={() => handleNotificationChange('projectUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">New matching projects</div>
                    <Switch 
                      checked={notifications.newProjects}
                      onCheckedChange={() => handleNotificationChange('newProjects')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Messages from clients</div>
                    <Switch 
                      checked={notifications.messages}
                      onCheckedChange={() => handleNotificationChange('messages')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={18} /> Privacy & Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Enter current password" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Enter new password" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Confirm new password" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Update Password</Button>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium mb-3">Security Options</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Two-factor authentication</div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Active sessions</div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end gap-4"
      >
        <Button variant="outline">Cancel</Button>
        <Button>Save Settings</Button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
