
import { authUtils } from "./authUtils";
import { UserRole } from "../constants/Role";
export const isSuccessStatus = (statusCode) => {
  return statusCode >= 200 && statusCode < 300;
};


export const reloadPage = () => {
  window.location.reload();
};


export const getBaseRedirectionPath = () => {
  const role = authUtils.getUserProfile().role;
  let url;
  if (role == UserRole.CORPORATE) {
    url = `/company/dashboard`
  } else {
    url = `/developer/dashboard`;
  }
  console.log('url to redirect {} ', url)
  return url;
}


export const getDeveloperProfileRedirectionPath = (developerId) => {
  return `${getBaseRedirectionPath()}/developer-profile/${developerId}`
}

export const getCompanyProfileRedirectionPath = (companyId) => {
  return `${getBaseRedirectionPath()}/company-profile/${companyId}`
}

export const getApplicationDetailsRedirectionPath = (taskId,applicationId) => {
  return `${getBaseRedirectionPath()}/applications/${taskId}/${applicationId}`

}

export const formatDate = (dateString) => {
  if (!dateString) return "No deadline";
  const date = new Date(dateString.replace(' ', 'T'));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};


export const normalizeSocialUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};


export const capitalizeWords = (str) => {
  return str
    .split(' ')  // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words back together
};

export const getMatchLabelAndColor = (score) => {
  if (score >= 60) {
    return { label: 'Excellent Match', color: '#27ae60' }; // Darker Green
  } else if (score >= 30) {
    return { label: 'Good Fit', color: '#f39c12' }; // Warm Amber
  } else if (score >= 20) {
    return { label: 'Fair Match', color: '#d35400' }; // Deep Orange
  } else {
    return { label: 'Poor Match', color: '#c0392b' }; // Dark Red
  }
};