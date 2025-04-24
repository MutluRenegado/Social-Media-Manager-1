import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from 'lib/firebase-admin';

// Helper function to check if user has voted
const hasUserVoted = (pollData: Record<string, any>, userId: string) => {
  return pollData.voters && pollData.voters.includes(userId);
};

export async function POST(request: NextRequest) {
  console.log('Poll-status API POST called');
  try {
    const body = await request.json();
    console.log('Poll-status POST request body:', body);
    const { pollId, option, userId } = body;

    if (!pollId || !option || !userId) {
      return NextResponse.json({ error: 'Poll ID, option, and user ID are required' }, { status: 400 });
    }

    // Fetch poll from Firestore using Admin SDK
    const pollsRef = adminDb.collection('polls');
    const querySnapshot = await pollsRef.where('pollId', '==', pollId).get();

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      const pollData = docSnapshot.data();

      // Check if the user has already voted
      if (hasUserVoted(pollData, userId)) {
        return NextResponse.json({ error: 'User has already voted on this poll' }, { status: 400 });
      }

      // Update the vote count for the selected option
      if (!pollData.options) pollData.options = {};
      pollData.options[option] = (pollData.options[option] || 0) + 1;

      // Add the user to the voters list
      pollData.voters = pollData.voters || [];
      pollData.voters.push(userId);

      // Update Firestore document
      await docSnapshot.ref.update({ options: pollData.options, voters: pollData.voters });

      return NextResponse.json({ message: 'Vote added successfully', poll: pollData });
    } else {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error handling poll vote:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}

export async function GET() {
  console.log('Poll-status API GET called');
  try {
    // Test log to confirm handler is reached
    console.log('Fetching polls from Firestore...');
    // Fetch all polls using Admin SDK
    const pollsRef = adminDb.collection('polls');
    const querySnapshot = await pollsRef.get();

    const polls = querySnapshot.docs.map((doc) => {
      const poll = doc.data();
      // Set default hasVoted flag for client-side logic
      poll.hasVoted = false; // Default value, assuming client checks it
      return poll;
    });

    console.log(`Fetched ${polls.length} polls.`);
    return NextResponse.json({ polls });
  } catch (error) {
    console.error('Error fetching polls:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}
