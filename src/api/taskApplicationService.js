import httpInstance from './axiosInstance';
import { isSuccessStatus } from '../utils/applicationUtils';

import { ApplicationStatus } from '../constants/ApplicationStatus';
import { AnalyticEvents } from '../constants/AnalyticsEvents';
import { trackEvent } from '../utils/analytics';

export const updateApplicationStatus = async (taskId, applicationId, status) => {
    try {
        const response = await httpInstance.patch(
            `/v1/tasks/${taskId}/applications/${applicationId}/status`,
            status
        );
        trackEvent(AnalyticEvents.TASK_APPLICATION_UPDATE,{taskId:taskId,applicationId:applicationId,status:status})
        return isSuccessStatus(response.status);
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
}


export const acceptApplicationStatus = async (taskId, applicationId) => {
    return updateApplicationStatus(taskId, applicationId, {status:ApplicationStatus.ACCEPTED});
};

export const withdrawApplication = async (taskId, applicationId) => {
    try {
        const response = await httpInstance.put(
            `/v1/tasks/${taskId}/applications/${applicationId}/withdraw`,
            {}
        );
    trackEvent(AnalyticEvents.TASK_APPLICATION_UPDATE,{label:'withdraw',applicationId:applicationId})    
        return isSuccessStatus(response.status);
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
}


export const fetchApplications = async(userId,companyId,queryParams) => {
    const url = `/v1/users/${userId}/company-profile/${companyId}/applications?${queryParams.toString()}`;

    try {
        const response = await httpInstance.get(url);
        return response;
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
}

export const getTaskApplications = async(taskId,queryParams) => {
    const url = `/v1/tasks/${taskId}/applications?${queryParams.toString()}`;

    try {
        const response = await httpInstance.get(url);
        return response;
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
}