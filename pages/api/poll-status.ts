// pages/api/poll-status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from '/firebase/firestore';
import { initializeApp } from '/firebase/app';

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Poll data route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle vote submission
    const { pollId, option } = req.body;

    if (!pollId || !option) {
      return res.status(400).json({ error: 'Poll ID and option are required' });
    }

    try {
      const pollRef = collection(db, 'polls');
      const q = query(pollRef, where('pollId', '==', pollId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const pollData = docSnapshot.data();

        // Ensure options exists in the pollData
        if (!pollData.options) {
          pollData.options = {};
        }

        // Increment the vote for the selected option, or initialize if it doesn't exist
        pollData.options[option] = (pollData.options[option] || 0) + 1;

        // Update the existing poll document with the new vote count
        const pollDocRef = doc(db, 'polls', docSnapshot.id);
        await updateDoc(pollDocRef, { options: pollData.options });

        return res.status(200).json({ message: 'Vote added successfully', poll: pollData });
      } else {
        return res.status(404).json({ error: 'Poll not found' });
      }
    } catch (error) {
      console.error('Error handling poll vote:', error);
      return res.status(500).json({ error: 'Failed to submit vote' });
    }
  } else if (req.method === 'GET') {
    // Handle fetching poll data
    try {
      const pollRef = collection(db, 'polls');
      const pollSnapshot = await getDocs(pollRef);
      const polls = pollSnapshot.docs.map((doc) => doc.data());

      return res.status(200).json({ polls });
    } catch (error) {
      console.error('Error fetching polls:', error);
      return res.status(500).json({ error: 'Failed to fetch polls' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
