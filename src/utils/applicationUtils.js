
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


export const formatDate = (dateString) => {
  if (!dateString) return "No deadline";
  const date = new Date(dateString.replace(' ', 'T'));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};