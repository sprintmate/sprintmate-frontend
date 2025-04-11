import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

const ProfileSection = ({ profile, onUpdate, onDocumentUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    skills: profile?.skills || '',
    about: profile?.about || '',
    availability: profile?.availability || 'FULL_TIME',
    preferredWorkType: profile?.preferredWorkType || 'REMOTE',
    portfolio: {
      GITHUB: profile?.portfolio?.GITHUB || '',
      LINKEDIN: profile?.portfolio?.LINKEDIN || '',
    },
    resume: profile?.resume || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('portfolio.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await onDocumentUpload(file, 'RESUME');
      setFormData(prev => ({
        ...prev,
        resume: response.externalId
      }));
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g. React, Node.js, Python"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">About</label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preferred Work Type</label>
              <select
                name="preferredWorkType"
                value={formData.preferredWorkType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GitHub Profile</label>
              <Input
                name="portfolio.GITHUB"
                value={formData.portfolio.GITHUB}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
              <Input
                name="portfolio.LINKEDIN"
                value={formData.portfolio.LINKEDIN}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Resume</label>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="w-full p-2 border rounded"
              />
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Skills</h3>
              <p className="text-gray-600">{profile?.skills || 'No skills listed'}</p>
            </div>

            <div>
              <h3 className="font-medium">About</h3>
              <p className="text-gray-600">{profile?.about || 'No about section'}</p>
            </div>

            <div>
              <h3 className="font-medium">Availability</h3>
              <p className="text-gray-600">{profile?.availability || 'Not specified'}</p>
            </div>

            <div>
              <h3 className="font-medium">Preferred Work Type</h3>
              <p className="text-gray-600">{profile?.preferredWorkType || 'Not specified'}</p>
            </div>

            <div>
              <h3 className="font-medium">Portfolio</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">GitHub:</span>{' '}
                  <a href={profile?.portfolio?.GITHUB} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile?.portfolio?.GITHUB || 'Not provided'}
                  </a>
                </p>
                <p>
                  <span className="font-medium">LinkedIn:</span>{' '}
                  <a href={profile?.portfolio?.LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile?.portfolio?.LINKEDIN || 'Not provided'}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection; 