import React, { useEffect, useState } from 'react';
// import { fetchSecureDocument } from '@/services/developerService';
import { fetchSecureDocument } from '../../api/documentService';

const ProfilePicViewer = ({ documentId, developerName, className = '' }) => {
    const [profilePicUrl, setProfilePicUrl] = useState(null);
  
    useEffect(() => {
      const fetchProfilePic = async () => {
        if (!documentId) return;
  
        try {
          const response = await fetchSecureDocument(documentId);
          setProfilePicUrl(response.fileUrl);
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      };
  
      fetchProfilePic();
    }, [documentId]);
  
    const initials = developerName
      ? developerName.split(' ').map(n => n[0]).join('').toUpperCase()
      : '';
  
    return (
      <div className={`rounded-full bg-white p-1 shadow-md overflow-hidden ${className}`}>
        {profilePicUrl ? (
          <img
            src={profilePicUrl}
            alt={initials}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">{initials}</span>
          </div>
        )}
      </div>
    );
  };
  

export default ProfilePicViewer;
