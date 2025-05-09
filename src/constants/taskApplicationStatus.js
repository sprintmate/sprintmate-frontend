export const TASK_APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  // ...add other statuses as needed
};

// Also export with the name expected by CompanyDashboard.jsx
export const TaskApplicationStatus = TASK_APPLICATION_STATUS;

export function canRoleUpdateStatus(role, status) {
  // Placeholder logic, update as needed
  return true;
}

export const STATUS_DIALOG_CONFIG = {
  PENDING: { title: 'Pending', description: 'This application is pending.' },
  APPROVED: { title: 'Approved', description: 'This application is approved.' },
  REJECTED: { title: 'Rejected', description: 'This application is rejected.' },
  // ...add other configs as needed
};

// Add this export if Role is needed by CompanyDashboard.jsx
export const Role = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  DEVELOPER: 'DEVELOPER',
  // ...add other roles as needed
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  // ...add other statuses as needed
};

export function getAllowedTransitions(currentStatus, role) {
  // Placeholder logic, update as needed
  // Example: return an array of allowed next statuses
  return ['APPROVED', 'REJECTED'];
}
