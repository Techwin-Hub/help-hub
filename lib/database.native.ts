import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('helphub.db');

const initDB = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      age INTEGER,
      city TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    );
    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      city TEXT,
      email TEXT UNIQUE,
      password TEXT,
      status TEXT DEFAULT 'active'
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      description TEXT,
      voicePath TEXT,
      imagePath TEXT,
      status TEXT DEFAULT 'pending',
      assignedVolunteerId INTEGER,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
};

const registerUser = (name, phone, age, city, email, password) => {
  const result = db.runSync('INSERT INTO users (name, phone, age, city, email, password) VALUES (?, ?, ?, ?, ?, ?)', name, phone, age, city, email, password);
  return result.lastInsertRowId;
};

const loginUser = (email, password) => {
  const user = db.getFirstSync('SELECT * FROM users WHERE email = ? AND password = ?', email, password);
  return user;
};

const registerVolunteer = (name, phone, city, email, password) => {
  const result = db.runSync('INSERT INTO volunteers (name, phone, city, email, password) VALUES (?, ?, ?, ?, ?)', name, phone, city, email, password);
  return result.lastInsertRowId;
};

const loginVolunteer = (email, password) => {
  const volunteer = db.getFirstSync('SELECT * FROM volunteers WHERE email = ? AND password = ?', email, password);
  return volunteer;
};

const submitReport = (userId, description, voicePath, imagePath) => {
  const createdAt = new Date().toISOString();
  const result = db.runSync('INSERT INTO reports (userId, description, voicePath, imagePath, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)', userId, description, voicePath, imagePath, 'pending', createdAt, createdAt);
  return result.lastInsertRowId;
};

const submitAnonymousReport = (description, voicePath, imagePath) => {
  return submitReport(null, description, voicePath, imagePath);
};

const listReportsForUser = (userId) => {
  const reports = db.getAllSync('SELECT * FROM reports WHERE userId = ? ORDER BY createdAt DESC', userId);
  return reports;
};

const listReportsForAdmin = () => {
  const reports = db.getAllSync('SELECT * FROM reports ORDER BY createdAt DESC');
  return reports;
};

const assignReport = (reportId, volunteerId) => {
  const updatedAt = new Date().toISOString();
  const result = db.runSync('UPDATE reports SET assignedVolunteerId = ?, status = ?, updatedAt = ? WHERE id = ?', volunteerId, 'inProgress', updatedAt, reportId);
  return result.changes > 0;
};

const listReportsForVolunteer = (volunteerId) => {
  const reports = db.getAllSync('SELECT * FROM reports WHERE assignedVolunteerId = ? ORDER BY updatedAt DESC', volunteerId);
  return reports;
};

const updateReportStatus = (reportId, status, imagePath = null) => {
  const updatedAt = new Date().toISOString();
  let query = 'UPDATE reports SET status = ?, updatedAt = ?';
  const params = [status, updatedAt];

  if (imagePath) {
    query += ', imagePath = ?';
    params.push(imagePath);
  }

  query += ' WHERE id = ?';
  params.push(reportId);

  const result = db.runSync(query, ...params);
  if (result.changes > 0 && status === 'resolved') {
    sendEmailNotification(reportId);
  }
  return result.changes > 0;
};

const listAllVolunteers = () => {
  const volunteers = db.getAllSync('SELECT * FROM volunteers');
  return volunteers;
};

const getUserById = (userId) => {
  const user = db.getFirstSync('SELECT * FROM users WHERE id = ?', userId);
  return user;
}

const sendEmailNotification = (reportId) => {
  const report = db.getFirstSync('SELECT * FROM reports WHERE id = ?', reportId);
  if (report && report.userId) {
    const user = getUserById(report.userId);
    if (user) {
      console.log(`
        ==================================================
        SIMULATING SENDING EMAIL NOTIFICATION
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
