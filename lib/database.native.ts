import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('helphub.db');

const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        age INTEGER,
        city TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
      );`,
      [],
      () => console.log('Users table created successfully'),
      (_, error) => {
        console.log('Error creating users table', error);
        return false;
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS volunteers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        city TEXT,
        email TEXT UNIQUE,
        password TEXT,
        status TEXT DEFAULT 'active'
      );`,
      [],
      () => console.log('Volunteers table created successfully'),
      (_, error) => {
        console.log('Error creating volunteers table', error);
        return false;
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        description TEXT,
        voicePath TEXT,
        imagePath TEXT,
        status TEXT DEFAULT 'pending',
        assignedVolunteerId INTEGER,
        createdAt TEXT,
        updatedAt TEXT
      );`,
      [],
      () => console.log('Reports table created successfully'),
      (_, error) => {
        console.log('Error creating reports table', error);
        return false;
      }
    );
  });
};

// User functions
const registerUser = (name, phone, age, city, email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (name, phone, age, city, email, password) VALUES (?, ?, ?, ?, ?, ?)',
        [name, phone, age, city, email, password],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Volunteer functions
const registerVolunteer = (name, phone, city, email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO volunteers (name, phone, city, email, password) VALUES (?, ?, ?, ?, ?)',
        [name, phone, city, email, password],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const loginVolunteer = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM volunteers WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Report functions
const submitReport = (userId, description, voicePath, imagePath) => {
  const createdAt = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO reports (userId, description, voicePath, imagePath, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, description, voicePath, imagePath, 'pending', createdAt, createdAt],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const submitAnonymousReport = (description, voicePath, imagePath) => {
  return submitReport(null, description, voicePath, imagePath);
};
const listReportsForUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reports WHERE userId = ? ORDER BY createdAt DESC',
        [userId],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
const listReportsForAdmin = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reports ORDER BY createdAt DESC',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
const assignReport = (reportId, volunteerId) => {
  const updatedAt = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE reports SET assignedVolunteerId = ?, status = ?, updatedAt = ? WHERE id = ?',
        [volunteerId, 'inProgress', updatedAt, reportId],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
const listReportsForVolunteer = (volunteerId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reports WHERE assignedVolunteerId = ? ORDER BY updatedAt DESC',
        [volunteerId],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
const updateReportStatus = (reportId, status, imagePath = null) => {
  const updatedAt = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let query = 'UPDATE reports SET status = ?, updatedAt = ?';
      const params = [status, updatedAt];

      if (imagePath) {
        query += ', imagePath = ?';
        params.push(imagePath);
      }

      query += ' WHERE id = ?';
      params.push(reportId);

      tx.executeSql(
        query,
        params,
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            if (status === 'resolved') {
              sendEmailNotification(reportId);
            }
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const listAllVolunteers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM volunteers',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE id = ?',
        [userId],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const sendEmailNotification = async (reportId) => {
  try {
    const report = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM reports WHERE id = ?', [reportId], (_, { rows }) => {
          if (rows.length > 0) resolve(rows.item(0));
          else resolve(null);
        }, (_, error) => {
          reject(error);
          return false;
        });
      });
    });

    if (report && report.userId) {
      const user = await getUserById(report.userId);
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
  } catch (error) {
    console.error('Failed to send email notification:', error);
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
