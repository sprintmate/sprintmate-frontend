import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

const TaskList = ({ tasks, currentPage, totalPages, onPageChange, onApply }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [proposal, setProposal] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApply = async () => {
    if (!proposal.trim()) {
      toast.error('Please write a proposal');
      return;
    }

    try {
      await onApply(selectedTask.externalId, { proposal });
      setIsDialogOpen(false);
      setProposal('');
      toast.success('Application submitted successfully');
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
        
        <div className="space-y-4">
          {tasks?.map((task) => (
            <Card key={task.externalId}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <div className="mt-2 space-x-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {task.category}
                      </span>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {task.budget} {task.currency}
                      </span>
                      {task.tags && (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {task.tags}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDialogOpen(true);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Task</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="Write your proposal here..."
                className="min-h-[200px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TaskList; 