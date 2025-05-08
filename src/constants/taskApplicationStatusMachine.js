// constants/taskApplication.js

export const Role = {
    ADMIN: "ADMIN",
    DEVELOPER: "DEVELOPER",
    CORPORATE: "CORPORATE"
};

export const TaskApplicationStatus = {
    APPLIED: "APPLIED",
    WITHDRAWN: "WITHDRAWN",
    IN_PROGRESS: "IN_PROGRESS",
    SUBMITTED: "SUBMITTED",
    SHORTLISTED: "SHORTLISTED",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED"
};

export const STATUS_LABELS = {
    [TaskApplicationStatus.APPLIED]: "Applied",
    [TaskApplicationStatus.WITHDRAWN]: "Withdraw Application",
    [TaskApplicationStatus.IN_PROGRESS]: "Start Working",
    [TaskApplicationStatus.SUBMITTED]: "Submit Work",
    [TaskApplicationStatus.SHORTLISTED]: "Shortlist",
    [TaskApplicationStatus.ACCEPTED]: "Accept",
    [TaskApplicationStatus.REJECTED]: "Reject",
    [TaskApplicationStatus.CANCELLED]: "Cancel",
    [TaskApplicationStatus.COMPLETED]: "Mark Completed"
};

export const ROLE_ALLOWED_STATUSES = {
    [Role.ADMIN]: new Set(Object.values(TaskApplicationStatus)),
    [Role.DEVELOPER]: new Set([
        TaskApplicationStatus.APPLIED,
        TaskApplicationStatus.WITHDRAWN,
        TaskApplicationStatus.IN_PROGRESS,
        TaskApplicationStatus.SUBMITTED
    ]),
    [Role.CORPORATE]: new Set([
        TaskApplicationStatus.SHORTLISTED,
        TaskApplicationStatus.ACCEPTED,
        TaskApplicationStatus.REJECTED,
        TaskApplicationStatus.CANCELLED,
        TaskApplicationStatus.COMPLETED
    ])
};

export const STATUS_TRANSITIONS = {
    [TaskApplicationStatus.APPLIED]: new Set([
        TaskApplicationStatus.SHORTLISTED,
        TaskApplicationStatus.REJECTED,
        TaskApplicationStatus.WITHDRAWN
    ]),
    [TaskApplicationStatus.SHORTLISTED]: new Set([
        // TaskApplicationStatus.ACCEPTED,
        // TaskApplicationStatus.REJECTED
    ]),
    [TaskApplicationStatus.ACCEPTED]: new Set([
        TaskApplicationStatus.IN_PROGRESS
    ]),
    [TaskApplicationStatus.IN_PROGRESS]: new Set([
        TaskApplicationStatus.SUBMITTED,
        TaskApplicationStatus.CANCELLED
    ]),
    [TaskApplicationStatus.SUBMITTED]: new Set([
        TaskApplicationStatus.COMPLETED,
        TaskApplicationStatus.REJECTED
    ]),
    [TaskApplicationStatus.WITHDRAWN]: new Set(),
    [TaskApplicationStatus.REJECTED]: new Set(),
    [TaskApplicationStatus.COMPLETED]: new Set(),
    [TaskApplicationStatus.CANCELLED]: new Set()
};

export function getAllowedTransitions(from) {
    console.log('get allowrted transis',from);
    return Array.from(STATUS_TRANSITIONS[from] || []);
}

export function canRoleUpdateStatus(role, status) {
    console.log('canRoleUpdateStatus',status,role)
    return ROLE_ALLOWED_STATUSES[role]?.has(status);
}

export function isValidTransition(from, to) {
    return STATUS_TRANSITIONS[from]?.has(to);
}


export const STATUS_DIALOG_CONFIG = {
    WITHDRAWN: {
      title: "Withdraw Application",
      message: "Are you sure you want to withdraw your application? This action cannot be undone.",
      confirmText: "Withdraw"
    },
    SUBMITTED: {
      title: "Submit Work",
      message: "Are you sure you want to mark this task as submitted?",
      confirmText: "Submit"
    },
    IN_PROGRESS: {
      title: "Start Task",
      message: "Do you want to begin working on this task?",
      confirmText: "Start"
    },
    REJECTED: {
      title: "Reject Application",
      message: "Are you sure you want to reject this application?",
      confirmText: "Reject"
    },
    SHORTLISTED: {
      title: "Shortlist Application",
      message: "Are you sure you want to shortlist this application?",
      confirmText: "Shortlist"
    },
  };
  