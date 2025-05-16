import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Tag, Layers, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../../services/authService';

const categories = [
  { value: 'p0', label: 'P0 (Critical)' },
  { value: 'p1', label: 'P1 (High)' },
  { value: 'p2', label: 'P2 (Medium)' },
  { value: 'p3', label: 'P3 (Low)' }
];

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch task details
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
        setForm({
          title: response.data.title || '',
          description: response.data.description || '',
          category: response.data.category || '',
          budget: response.data.budget || '',
          currency: response.data.currency || 'INR',
          deadline: response.data.deadline ? response.data.deadline.slice(0, 16) : '',
          tags: response.data.tags || '',
          ndaRequired: !!response.data.ndaRequired
        });
      } catch (err) {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Save (simulate API call)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Simulate PATCH/PUT API call here
      // await axios.patch(...);
      setTimeout(() => {
        setSaving(false);
        navigate(-1); // Go back after save
      }, 1200);
    } catch (err) {
      setError('Failed to save task.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-500">
        <Loader2 className="animate-spin mr-2" /> Loading task...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    );
  }

  if (!form) return null;

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-xl shadow-lg bg-gradient-to-r from-blue-50 via-white to-green-50 border border-blue-100 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="flex items-center gap-4 p-6">
          <Layers size={36} className="text-blue-500 drop-shadow" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
            <p className="text-gray-500 mt-1">Update your task details below</p>
          </div>
        </div>
      </motion.div>

      <motion.form
        className="rounded-xl bg-white shadow border border-gray-100 p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSave}
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText size={16} className="text-blue-400" /> Title
          </label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full"
            maxLength={100}
            placeholder="Task title"
          />
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText size={16} className="text-blue-400" /> Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
            placeholder="Describe the task in detail"
          />
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Tag size={16} className="text-blue-400" /> Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg p-2"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <DollarSign size={16} className="text-blue-400" /> Budget
            </label>
            <Input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              min={0}
              required
              className="w-full"
              placeholder="Budget"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar size={16} className="text-blue-400" /> Deadline
          </label>
          <Input
            name="deadline"
            type="datetime-local"
            value={form.deadline}
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Tag size={16} className="text-blue-400" /> Tags
          </label>
          <Input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full"
            placeholder="Comma separated (e.g. react,node.js)"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.split(',').filter(Boolean).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">{tag.trim()}</Badge>
            ))}
          </div>
        </div>
        {/* NDA Required */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ndaRequired"
            checked={form.ndaRequired}
            onChange={handleChange}
            id="ndaRequired"
            className="accent-blue-600"
          />
          <label htmlFor="ndaRequired" className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <ShieldCheck size={16} className="text-blue-400" /> NDA Required
          </label>
        </div>
        {/* Error */}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin mr-2" /> : null}
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default EditTask;