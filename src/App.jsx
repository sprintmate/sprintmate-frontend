import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

const Landing = React.lazy(() => import('./pages/Landing'))
const DeveloperLogin = React.lazy(() => import('./pages/DeveloperLogin'))
const DeveloperDashboard = React.lazy(() => import('./pages/DeveloperDashboard'))
const CreateDeveloperProfile = React.lazy(() => import('./pages/CreateDeveloperProfile'))
const CompanyDashboard = React.lazy(() => import('./pages/CompanyDashboard'))
const CompanyLogin = React.lazy(() => import('./pages/CompanyLogin'))

const App = () => {
  return (
    <AuthProvider>
      <div className="bg-white min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/developer/login" element={<DeveloperLogin />} />
            <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
            <Route path="/developer/create-profile" element={<CreateDeveloperProfile />} />
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/dashboard/*" element={<CompanyDashboard />} />
            
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
};

export default App;
