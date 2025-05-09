import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const [companyName, setCompanyName] = useState('TechSolutions Inc.');
  const [email, setEmail] = useState('company@example.com');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences with ease</p>
      </div>

      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a new password"
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-sm font-medium text-gray-700">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => setNotifications(checked)}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-full py-2 mt-4"
            onClick={() => toast.success('Settings updated successfully!')}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-gray-600">
              Deleting your account will remove all your data permanently. This action cannot be undone.
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2 mt-4"
              onClick={() => toast.error('Account deletion is not implemented yet!')}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
