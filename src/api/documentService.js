import axios from 'axios';
import { authUtils } from '../utils/authUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadDocuments = async (files, type = "LOGO") => {
    try {
        const uploaded = await Promise.all(
            files.map(async (file) => {
                console.log("file uploading ", file);
                const formData = new FormData();
                formData.append("file", file);
                formData.append("type", type);

                const response = await uploadFile(formData, '/v1/documents/upload');

                return response.data.externalId;
            })
        );
        return uploaded;
    } catch (error) {
        console.error('Error uploading documents:', error);
        throw error;
    }
};


const uploadFile = async (formData, urlPath) => {
    const token = authUtils.getAuthToken();
  
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
  
    headers['Authorization'] = `Bearer ${token}`;
  
  
    return axios.post(
      `${BASE_URL}/v1/documents/upload`,
      formData,
      {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  };
  