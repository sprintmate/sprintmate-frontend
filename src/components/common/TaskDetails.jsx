import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Code } from 'lucide-react';
import CurrencyFormatter from '../ui/CurrencyFormatter';
import { formatDate } from '../../utils/applicationUtils';
import { getToken } from '../../services/authService';

function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/company-profiles/abcd/tasks/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setTask(response.data);
      } catch (err) {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">Loading task details...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">No task found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="border-blue-100 shadow">
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          <CardDescription className="mt-2">{task.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            {(task.skills ? task.skills.split(',') : []).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 flex items-center">
                <Code size={12} className="mr-1" />
                {skill.trim()}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign size={16} />
              <span>
                <CurrencyFormatter currency={task.currency}>
                  {task.expectedEarnings}
                </CurrencyFormatter>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={16} />
              <span>
                Deadline: {task.deadline ? formatDate(task.deadline) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={16} />
              <span>
                Applicants: {task.applicants !== undefined ? task.applicants : (task.applicationsCount || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>
                Posted: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
          {/* Add more fields as needed */}
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskDetails;