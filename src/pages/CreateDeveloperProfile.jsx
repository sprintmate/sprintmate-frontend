import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeveloperProfile, uploadDocument } from '@/services/developerService';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateDeveloperProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    about: '',
    availability: 'FULL_TIME',
    preferredWorkType: 'REMOTE',
    portfolio: {
      GITHUB: '',
      LINKEDIN: '',
      LATEST_RESUME: '',
      PROFILE_PIC: ''
    }
  });

  const url = import.meta.env.VITE_API_BASE_URL 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('portfolio.')) {
      const portfolioKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [portfolioKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadDocument(file, type);
      if (type === 'RESUME') {
        setFormData(prev => ({
          ...prev,
          resume: response.externalId,
          portfolio: {
            ...prev.portfolio,
            LATEST_RESUME: response.externalId
          }
        }));
      } else if (type === 'PROFILE_PIC') {
        setFormData(prev => ({
          ...prev,
          portfolio: {
            ...prev.portfolio,
            PROFILE_PIC: response.externalId
          }
        }));
      }
      toast.success(`${type === 'RESUME' ? 'Resume' : 'Profile picture'} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'RESUME' ? 'resume' : 'profile picture'}`);
      console.error('Upload error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDeveloperProfile(formData);
      toast.success('Developer profile created successfully');
      navigate('/developer/dashboard');
    } catch (error) {
      toast.error('Failed to create developer profile');
      console.error('Profile creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Developer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, React, Node.js"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself and your experience"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredWorkType">Preferred Work Type</Label>
              <Select
                value={formData.preferredWorkType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferredWorkType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="ONSITE">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile</Label>
              <Input
                id="github"
                name="portfolio.GITHUB"
                value={formData.portfolio.GITHUB}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                name="portfolio.LINKEDIN"
                value={formData.portfolio.LINKEDIN}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'RESUME')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePic">Profile Picture</Label>
              <Input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'PROFILE_PIC')}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/developer/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDeveloperProfile; 