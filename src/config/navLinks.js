import {
    Home,
    CheckSquare,
    FileText,
    Users,
    Settings,
    Briefcase,
    User,
    DollarSign,
    MessageCircleCodeIcon
  } from 'lucide-react';
  
  export const NAV_LINKS = {
    company: [
      { to: "/company/dashboard", icon: Home, label: 'Dashboard' },
      { to: "/company/dashboard/inbox", icon: MessageCircleCodeIcon, label: 'Messages' },
      { to: "/company/dashboard/tasks", icon: CheckSquare, label: 'My Tasks' },
      { to: "/company/dashboard/post-task", icon: FileText, label: 'Post Task' },
      { to: "/company/dashboard/applications", icon: Users, label: 'Applications' },
      { to: '/company/dashboard/payments', icon: DollarSign, label: 'Payments' },
      { to: "/company/dashboard/settings", icon: Settings, label: 'Settings' },

    ],
    developer: [
      { to: '/developer/dashboard', icon: Home, label: 'Dashboard' },
      { to: "/developer/dashboard/inbox", icon: MessageCircleCodeIcon, label: 'Messages' },
      { to: '/developer/dashboard/earnings', icon: DollarSign, label: 'Earnings' },
      { to: '/developer/dashboard/projects', icon: Briefcase, label: 'Find Projects' },
      { to: '/developer/dashboard/applications', icon: CheckSquare, label: 'My Applications' },
      { to: '/developer/dashboard/profile/:developerId', icon: User, label: 'Profile' },
      { to: '/developer/dashboard/settings', icon: Settings, label: 'Settings' },

    ]
  };
  