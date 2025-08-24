// Mock implementation for web
const mockDb = {
  users: [],
  volunteers: [],
  reports: [],
};

let userIdCounter = 1;
let volunteerIdCounter = 1;
let reportIdCounter = 1;

export const initDB = () => {
  console.log('Mock DB initialized for web');
};

export const registerUser = (name, phone, age, city, email, password) => {
  const newUser = { id: userIdCounter++, name, phone, age, city, email, password, role: 'user' };
  mockDb.users.push(newUser);
  return newUser.id;
};

export const loginUser = (email, password) => {
  const user = mockDb.users.find(u => u.email === email && u.password === password);
  return user || null;
};

export const registerVolunteer = (name, phone, city, email, password) => {
  const newVolunteer = { id: volunteerIdCounter++, name, phone, city, email, password, status: 'active' };
  mockDb.volunteers.push(newVolunteer);
  return newVolunteer.id;
};

export const loginVolunteer = (email, password) => {
  const volunteer = mockDb.volunteers.find(v => v.email === email && v.password === password);
  return volunteer || null;
};

export const submitReport = (userId, description, voicePath, imagePath) => {
  const createdAt = new Date().toISOString();
  const newReport = {
    id: reportIdCounter++,
    userId,
    description,
    voicePath,
    imagePath,
    status: 'pending',
    assignedVolunteerId: null,
    createdAt,
    updatedAt: createdAt,
  };
  mockDb.reports.push(newReport);
  return newReport.id;
};

export const submitAnonymousReport = (description, voicePath, imagePath) => {
  return submitReport(null, description, voicePath, imagePath);
};

export const listReportsForUser = (userId) => {
  const reports = mockDb.reports.filter(r => r.userId === userId);
  return reports;
};

export const listReportsForAdmin = () => {
  return mockDb.reports;
};

export const assignReport = (reportId, volunteerId) => {
  const report = mockDb.reports.find(r => r.id === reportId);
  if (report) {
    report.assignedVolunteerId = volunteerId;
    report.status = 'inProgress';
    report.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
};

export const listReportsForVolunteer = (volunteerId) => {
  const reports = mockDb.reports.filter(r => r.assignedVolunteerId === volunteerId);
  return reports;
};

export const updateReportStatus = (reportId, status, imagePath = null) => {
  const report = mockDb.reports.find(r => r.id === reportId);
  if (report) {
    report.status = status;
    if (imagePath) {
      report.imagePath = imagePath;
    }
    report.updatedAt = new Date().toISOString();
    if (status === 'resolved') {
      sendEmailNotification(reportId);
    }
    return true;
  }
  return false;
};

export const listAllVolunteers = () => {
  return mockDb.volunteers;
};

const getUserById = (userId) => {
  const user = mockDb.users.find(u => u.id === userId);
  return user || null;
}

const sendEmailNotification = (reportId) => {
  const report = mockDb.reports.find(r => r.id === reportId);
  if (report && report.userId) {
    const user = getUserById(report.userId);
    if (user) {
      console.log(`
        ==================================================
        SIMULATING SENDING EMAIL NOTIFICATION (WEB)
        ==================================================
        TO: ${user.email}
        SUBJECT: Your report has been resolved!

        Hi ${user.name},

        We're happy to inform you that your report regarding:
        "${report.description.substring(0, 50)}..."
        has been successfully resolved.

        Thank you for helping improve our community!

        Best,
        The HelpHub Team
        ==================================================
      `);
    }
  }
};
export {
    db,
    initDB,
    registerUser,
    loginUser,
    registerVolunteer,
    loginVolunteer,
    submitReport,
    submitAnonymousReport,
    listReportsForUser,
    listReportsForAdmin,
    assignReport,
    listReportsForVolunteer,
    updateReportStatus,
    listAllVolunteers,
  };
