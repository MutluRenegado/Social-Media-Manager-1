import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

try {
  if (!admin.apps.length) {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (err) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', err);
        throw err;
      }
    } else {
      // Fallback: load service account key from JSON file
      const serviceAccountPath = path.resolve(process.cwd(), 'netlistore-firebase-adminsdk-fbsvc-4fcc8adca2.json');
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
      } else {
        throw new Error('Missing Firebase service account key. Set FIREBASE_SERVICE_ACCOUNT_KEY env variable or place JSON file at ' + serviceAccountPath);
      }
    }

    if (!serviceAccount || Object.keys(serviceAccount).length === 0) {
      throw new Error('Missing or invalid Firebase service account key');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw error;
}

const adminDb = admin.firestore();

export { adminDb };
