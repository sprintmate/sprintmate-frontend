// src/services/developerService.js
import { apiFetch } from "@/lib/apiClient";
import httpInstance from "../api/axiosInstance";

// User Profile
export async function getUserProfile() {
  return apiFetch("/v1/users/profile");
}

// Developer Profile
// export const createDeveloperProfile = async (profileData) => {
//   return apiFetch('/v1/developers', {
//     method: 'POST',
//     body: JSON.stringify(profileData)
//   });
// };



export const createDeveloperProfile = async (profileData) => {
  try {
    const response = await httpInstance.post('/v1/developers', profileData);
    console.log("response ", response)
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export const getDeveloperProfile = async (developerId) => {
  return apiFetch(`/v1/developers/${developerId}`);
};

export const getDeveloperStatistics = async () => {
  const url = '/v1/developers/statistics';
  try {
    const response = await httpInstance.get(url);
    console.log("response ", response)
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Tasks
export const getAvailableTasks = async (page = 0, size = 10) => {
  return apiFetch(`/v1/developers/tasks?page=${page}&size=${size}`);
};

export const getTaskDetails = async (taskId) => {
  return apiFetch(`/v1/tasks/${taskId}`);
};

// Applications
export const getApplications = async (page = 0, size = 10) => {
  try {
    const response = await apiFetch(`/v1/developers/applications?page=${page}&size=${size}`);
    console.log('Applications API response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const applyForTask = async (taskId, applicationData) => {
  return apiFetch(`/v1/tasks/${taskId}/apply`, {
    method: 'POST',
    body: JSON.stringify(applicationData)
  });
};

export const withdrawApplication = async (taskId, applicationId) => {
  return apiFetch(`/v1/tasks/${taskId}/applications/${applicationId}/withdraw`, {
    method: 'PUT'
  });
};

// Documents
export const uploadDocument = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  return apiFetch('/v1/documents/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // Remove Content-Type header to let the browser set it with the boundary
      'Content-Type': undefined
    }
  });
};

export const getDocument = async (documentId) => {
  return apiFetch(`/v1/documents/${documentId}/stream`);
};

export const developerService = {
  getAvailableTasks,
  getApplications
};
