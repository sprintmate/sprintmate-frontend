import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authUtils } from '@/utils/authUtils';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest'
  });

  const fetchProjects = async () => {
    try {
      const token = authUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/projects`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ... rest of the component code ...
}; 