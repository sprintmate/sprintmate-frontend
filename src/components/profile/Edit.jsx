import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Briefcase, BookOpen, Globe, Github, Linkedin, FileText } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../../services/authService';

function Edit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setProfile(response.data);
        setForm({ ...response.data });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested fields (e.g., portfolio)
  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = getToken();
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        form,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSaving(false);
      navigate(-1); // Go back after save
    } catch (err) {
      setError('Failed to update profile.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-500">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
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
          <User size={36} className="text-blue-500 drop-shadow" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-500 mt-1">Update your profile details below</p>
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
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User size={16} className="text-blue-400" /> Name
          </label>
          <Input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            required
            className="w-full"
            maxLength={100}
            placeholder="Full name"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Mail size={16} className="text-blue-400" /> Email
          </label>
          <Input
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            required
            className="w-full"
            maxLength={100}
            placeholder="Email"
            type="email"
          />
        </div>
        {/* About */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText size={16} className="text-blue-400" /> About
          </label>
          <textarea
            name="about"
            value={form.about || ''}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
            placeholder="Tell us about yourself"
          />
        </div>
        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Briefcase size={16} className="text-blue-400" /> Skills
          </label>
          <Input
            name="skills"
            value={form.skills || ''}
            onChange={handleChange}
            className="w-full"
            placeholder="Comma separated (e.g. React,Node.js)"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {(form.skills || '').split(',').filter(Boolean).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">{skill.trim()}</Badge>
            ))}
          </div>
        </div>
        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Star size={16} className="text-blue-400" /> Experience (years)
          </label>
          <Input
            name="experience"
            value={form.experience || ''}
            onChange={handleChange}
            className="w-full"
            placeholder="Years of experience"
            type="number"
            min={0}
          />
        </div>
        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <BookOpen size={16} className="text-blue-400" /> Education
          </label>
          <textarea
            name="education"
            value={form.education || ''}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
            placeholder="Education details"
          />
        </div>
        {/* Portfolio Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Globe size={16} className="text-blue-400" /> Portfolio Links
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              name="GITHUB"
              value={form.portfolio?.GITHUB || ''}
              onChange={(e) => handleNestedChange(e, 'portfolio')}
              className="w-full"
              placeholder="GitHub URL"
              icon={<Github size={14} />}
            />
            <Input
              name="LINKEDIN"
              value={form.portfolio?.LINKEDIN || ''}
              onChange={(e) => handleNestedChange(e, 'portfolio')}
              className="w-full"
              placeholder="LinkedIn URL"
              icon={<Linkedin size={14} />}
            />
            <Input
              name="WEBSITE"
              value={form.portfolio?.WEBSITE || ''}
              onChange={(e) => handleNestedChange(e, 'portfolio')}
              className="w-full"
              placeholder="Website URL"
              icon={<Globe size={14} />}
            />
          </div>
        </div>
        {/* Actions */}
        {error && <div className="text-red-500 text-sm">{error}</div>}
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

export default Edit;
