
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
