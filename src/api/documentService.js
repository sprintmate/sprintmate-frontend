import axios from 'axios';
import { authUtils } from '../utils/authUtils';

import httpInstance from './axiosInstance';

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
  

  export const fetchSecureDocument = async (documentId) => {
    const token = authUtils.getAuthToken();
  
    try {
      // Get the document stream
      const response = await httpInstance.get(`/v1/documents/${documentId}/stream`, {
        responseType: 'blob'  // Important to specify responseType for binary data
      });

      console.log('response from fetchSecureDocument',response)
      console.log('response headers ', response.headers)
  
      const contentType = response.headers['content-type']; // Get the content type
      const contentDisposition = response.headers['content-disposition']; // Get the disposition header
  
      // Extract filename from Content-Disposition header
      const match = contentDisposition?.match(/filename="(.+)"/);
      const fileName = match?.[1] || 'document';
  
      // Create a URL for the file object
      const fileUrl = window.URL.createObjectURL(response.data); // Axios response data is the file blob
  
      return {
        fileUrl,
        fileName,
        contentType,
        blob: response.data, // Directly use the blob from the response
      };
    } catch (error) {
      console.error('Error fetching secure document:', error);
      throw error; // Optionally handle errors more gracefully
    }
  };
  