import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Building2, ArrowRight, Search, MessageSquare } from 'lucide-react';

// Sample applications data (empty for now)
const applications = [];

const statusColors = {
  accepted: "green",
  under_review: "amber",
  rejected: "red",
  completed: "blue"
};

const statusLabels = {
  accepted: "Accepted",
  under_review: "Under Review",
  rejected: "Rejected",
  completed: "Completed"
};

const MyApplications = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
        <p className="text-gray-600 mt-1">Track the status of your project applications</p>
      </div>
      
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{application.projectTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Building2 size={14} />
                        <span>{application.company}</span>
                        <span className="text-gray-400">•</span>
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={statusColors[application.status]} className="capitalize">
                        {statusLabels[application.status]}
                      </Badge>
                      <span className="text-gray-700 font-medium">{application.budget}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>
                        Status updated:
                        {' ' + new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare size={14} className="mr-1" />
                        Messages
                      </Button>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">No applications yet</h3>
            <p className="mt-2 text-gray-600 max-w-sm mx-auto">
              You haven't applied to any projects yet. Browse available projects and start applying.
            </p>
            <Link to="/developer/dashboard/projects" className="mt-6 inline-block">
              <Button className="gap-2">
                <Search size={16} />
                Browse Projects
              </Button>
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
