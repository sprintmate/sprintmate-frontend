import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const ApplicationList = ({ applications, onWithdraw, onPageChange }) => {
  console.log('ApplicationList received applications:', applications);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await onWithdraw(applicationId);
      toast.success('Application withdrawn successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to withdraw application');
    }
  };

  if (!applications || !Array.isArray(applications)) {
    console.log('Applications is not an array:', applications);
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Applications</h2>
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">My Applications</h2>
      
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.externalId}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{application.task.title}</h3>
                      <p className="text-sm text-gray-500">Task ID: {application.task.externalId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Proposal</h4>
                    <p className="text-gray-600">{application.proposal}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      <p>Budget: {application.task.budget} {application.task.currency}</p>
                      <p>Deadline: {new Date(application.task.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p>Applied: {new Date(application.createdAt).toLocaleDateString()}</p>
                      {application.status === 'APPLIED' && (
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => handleWithdraw(application.externalId)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => onPageChange(applications.number - 1)}
              disabled={applications.first}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {applications.number + 1} of {applications.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => onPageChange(applications.number + 1)}
              disabled={applications.last}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationList; 