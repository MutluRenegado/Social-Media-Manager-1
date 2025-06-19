// pages/api/poll-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase/firestore';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

// Helper function to check if user has voted
const hasUserVoted = (pollData: any, userId: string) => {
  return pollData.voters && pollData.voters.includes(userId);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { pollId, option, userId } = req.body;

    if (!pollId || !option || !userId) {
      return res.status(400).json({ error: 'Poll ID, option, and user ID are required' });
    }

    try {
      // Fetch poll from Firestore
      const pollRef = collection(db, 'polls');
      const q = query(pollRef, where('pollId', '==', pollId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const pollData = docSnapshot.data();

        // Check if the user has already voted
        if (hasUserVoted(pollData, userId)) {
          return res.status(400).json({ error: 'User has already voted on this poll' });
        }

        // Update the vote count for the selected option
        if (!pollData.options) pollData.options = {};
        pollData.options[option] = (pollData.options[option] || 0) + 1;

        // Add the user to the voters list
        pollData.voters = pollData.voters || [];
        pollData.voters.push(userId);

        // Update Firestore document
        const pollDocRef = doc(db, 'polls', docSnapshot.id);
        await updateDoc(pollDocRef, { options: pollData.options, voters: pollData.voters });

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
      // Fetch all polls
      const pollRef = collection(db, 'polls');
      const pollSnapshot = await getDocs(pollRef);
      const polls = pollSnapshot.docs.map((doc) => {
        const poll = doc.data();
        // Set default hasVoted flag for client-side logic
        poll.hasVoted = false; // Default value, assuming client checks it
        return poll;
      });

      return res.status(200).json({ polls });
    } catch (error) {
      console.error('Error fetching polls:', error);
      return res.status(500).json({ error: 'Failed to fetch polls' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
