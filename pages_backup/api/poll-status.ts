"use strict";
//poll-status
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from '../../lib/firebase/firestore'; // Updated path
import { initializeApp } from '../../lib/firebase/firebase-config'; // Updated path

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
export default async function handler(req, res) {
    if (req.method === 'POST') {
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
                if (!pollData.options) {
                    pollData.options = {};
                }
                pollData.options[option] = (pollData.options[option] || 0) + 1;
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
