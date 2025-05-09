
import httpInstance from './axiosInstance';

export const getOrCreateRoom = async (taskId, appId) => {
    try {
        const url = `/v1/tasks/${taskId}/applications/${appId}/communications/rooms`;
        const response = await httpInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getOrCreateRoom:', error);
        throw error;
    }
};

export const getAllRooms = async (params) => {
    try {
        const url = `/v1/tasks/dummy/applications/dummy/communications/all-rooms`
        const response = await httpInstance.get(url,params);
        return response;
    } catch (error) {
        console.error('Error getOrCreateRoom:', error);
        throw error;
    }
};


export const getMessages = async (taskId, appId) => {
    try {
        const url = `/v1/tasks/${taskId}/applications/${appId}/communications/messages`;
        const response = await httpInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getMessages :', error);
        throw error;
    }
};

