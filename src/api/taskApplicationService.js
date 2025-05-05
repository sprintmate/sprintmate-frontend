import httpInstance from './axiosInstance';
import { isSuccessStatus } from '../utils/applicationUtils';

import { ApplicationStatus } from '../constants/ApplicationStatus';

export const updateApplicationStatus = async (taskId, applicationId, status) => {
    try {
        const response = await httpInstance.patch(
            `/v1/tasks/${taskId}/applications/${applicationId}/status`,
            {status}
        );
        return isSuccessStatus(response.status);
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
}


export const acceptApplicationStatus = async (taskId, applicationId) => {
    return updateApplicationStatus(taskId, applicationId, ApplicationStatus.ACCEPTED);
};