import admin from 'firebase-admin';

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export default admin;
