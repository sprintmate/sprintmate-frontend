import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/developer/dashboard">
        <Button className="gap-2">
          <Home size={16} />
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
