import * as admin from "firebase-admin";

let adminApp: admin.app.App;

if (!admin.apps.length) {
  if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase Admin credentials are not set in env variables");
  }

  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDPbYGE50LYYhsN\nPGd7fDN0jCkSrMfY/AAlKd0LrYyjYeH5EcKPQEFgcpQhA2MjkB3XE7dn2eAU5qTC\n...your key...\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} else {
  adminApp = admin.app();
}

export { adminApp as admin };
