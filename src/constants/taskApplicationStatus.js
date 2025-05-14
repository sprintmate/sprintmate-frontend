export const TaskApplicationStatus = {
  APPLIED: 'APPLIED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const STATUS_LABELS = {
  APPLIED: 'Applied',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
};

export const STATUS_DIALOG_CONFIG = {
  WITHDRAWN: {
    title: 'Withdraw Application',
    message: 'Are you sure you want to withdraw your application?',
    confirmText: 'Withdraw',
  },
  ACCEPTED: {
    title: 'Accept Application',
    message: 'Are you sure you want to accept this application?',
    confirmText: 'Accept',
  },
  REJECTED: {
    title: 'Reject Application',
    message: 'Are you sure you want to reject this application?',
    confirmText: 'Reject',
  },
};

export const getAllowedTransitions = (currentStatus) => {
  const transitions = {
    APPLIED: ['WITHDRAWN', 'ACCEPTED', 'REJECTED'],
    ACCEPTED: ['COMPLETED', 'REJECTED'],
    REJECTED: [],
    WITHDRAWN: [],
    COMPLETED: [],
    IN_PROGRESS: ['COMPLETED'],
  };
  return transitions[currentStatus] || [];
};

export const canRoleUpdateStatus = (role, status) => {
  // Define role-based permissions for status updates
  const rolePermissions = {
    ADMIN: ['ACCEPTED', 'REJECTED', 'WITHDRAWN', 'COMPLETED'],
    DEVELOPER: ['WITHDRAWN'],
    MANAGER: ['ACCEPTED', 'REJECTED', 'COMPLETED'],
  };
  return rolePermissions[role]?.includes(status) || false;
};

export const Role = {
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
  MANAGER: 'MANAGER',
};
