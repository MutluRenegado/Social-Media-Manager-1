import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

// Runs every 5 minutes: pick schedules due to run and mark as processing.
export const schedulerTick = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const nowISO = new Date().toISOString();
  const snap = await db.collection('schedules')
    .where('status', '==', 'queued')
    .where('runAtISO', '<=', nowISO)
    .limit(10).get();

  const batch = db.batch();
  snap.docs.forEach(doc => batch.update(doc.ref, { status: 'processing', pickedAt: new Date() }));
  await batch.commit();
  // TODO: enqueue to a worker to publish to social platforms
  return null;
});
