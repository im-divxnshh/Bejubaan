// utils/FirebaseAdmin.ts
import * as admin from "firebase-admin";

let adminApp: admin.app.App;

export const getAdmin = () => {
  if (admin.apps.length) {
    return admin.app();
  }

  if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase Admin credentials are not set in env variables");
  }

  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  return adminApp;
};
