import React from 'react';
import { Home, CheckSquare, FileText, Users, Settings, LogOut } from 'react-feather';

const navLinks = [
  { to: '/company/dashboard', exact: true, icon: <Home />, label: 'Home' },
  { to: '/company/dashboard/tasks', icon: <CheckSquare />, label: 'My Tasks' },
  { to: '/company/dashboard/post-task', icon: <FileText />, label: 'Post Task' },
  { to: '/company/dashboard/applications', icon: <Users />, label: 'Applications' },
  { to: '/company/dashboard/settings', icon: <Settings />, label: 'Settings' },
  { logout: true, icon: <LogOut />, label: 'Logout' }
];

export default navLinks;