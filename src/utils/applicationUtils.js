```javascript
/**
 * Checks if chat functionality is available for the given application status
 * @param {string} status - The application status
 * @returns {boolean} - Whether chat is available for this status
 */
export const isChatAvailableForStatus = (status) => {
  if (!status) return false;
  
  const chatEnabledStatuses = [
    'SHORTLISTED',
    'ACCEPTED',
    'IN_PROGRESS',
    'COMPLETED',
    'SUBMITTED'
  ];
  
  return chatEnabledStatuses.includes(status.toUpperCase());
};

/**
 * Get display text for application status
 * @param {string} status - The application status
 * @returns {string} - Formatted status text for display
 */
export const getStatusDisplayText = (status) => {
  if (!status) return 'Unknown';
  
  // Convert statuses with underscores to space-separated words
  // and capitalize the first letter of each word
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};
```