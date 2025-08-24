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
  return new Promise((resolve) => {
    const newUser = { id: userIdCounter++, name, phone, age, city, email, password, role: 'user' };
    mockDb.users.push(newUser);
    resolve(newUser.id);
  });
};

export const loginUser = (email, password) => {
  return new Promise((resolve) => {
    const user = mockDb.users.find(u => u.email === email && u.password === password);
    resolve(user || null);
  });
};

export const registerVolunteer = (name, phone, city, email, password) => {
  return new Promise((resolve) => {
    const newVolunteer = { id: volunteerIdCounter++, name, phone, city, email, password, status: 'active' };
    mockDb.volunteers.push(newVolunteer);
    resolve(newVolunteer.id);
  });
};

export const loginVolunteer = (email, password) => {
  return new Promise((resolve) => {
    const volunteer = mockDb.volunteers.find(v => v.email === email && v.password === password);
    resolve(volunteer || null);
  });
};

export const submitReport = (userId, description, voicePath, imagePath) => {
  const createdAt = new Date().toISOString();
  return new Promise((resolve) => {
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
    resolve(newReport.id);
  });
};

export const submitAnonymousReport = (description, voicePath, imagePath) => {
  return submitReport(null, description, voicePath, imagePath);
};

export const listReportsForUser = (userId) => {
  return new Promise((resolve) => {
    const reports = mockDb.reports.filter(r => r.userId === userId);
    resolve(reports);
  });
};

export const listReportsForAdmin = () => {
  return new Promise((resolve) => {
    resolve(mockDb.reports);
  });
};

export const assignReport = (reportId, volunteerId) => {
  return new Promise((resolve) => {
    const report = mockDb.reports.find(r => r.id === reportId);
    if (report) {
      report.assignedVolunteerId = volunteerId;
      report.status = 'inProgress';
      report.updatedAt = new Date().toISOString();
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export const listReportsForVolunteer = (volunteerId) => {
  return new Promise((resolve) => {
    const reports = mockDb.reports.filter(r => r.assignedVolunteerId === volunteerId);
    resolve(reports);
  });
};

export const updateReportStatus = (reportId, status, imagePath = null) => {
  return new Promise((resolve) => {
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
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export const listAllVolunteers = () => {
  return new Promise((resolve) => {
    resolve(mockDb.volunteers);
  });
};

const getUserById = (userId) => {
  return new Promise((resolve) => {
    const user = mockDb.users.find(u => u.id === userId);
    resolve(user || null);
  });
}

const sendEmailNotification = async (reportId) => {
  const report = mockDb.reports.find(r => r.id === reportId);
  if (report && report.userId) {
    const user = await getUserById(report.userId);
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
