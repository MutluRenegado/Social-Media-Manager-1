// components/Poll.tsx
import { useState, useEffect } from 'react';

const Poll = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userId, setUserId] = useState<string>('user123'); // Example user ID, replace with actual authentication logic

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch('/api/poll-status');
        const data = await res.json();
        if (res.ok) {
          setPolls(data.polls);
        } else {
          setErrorMessage(data.error || 'Failed to load polls');
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
        setErrorMessage('Failed to fetch polls');
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId: string, option: string) => {
    try {
      const res = await fetch('/api/poll-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId, option, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll.pollId === pollId ? { ...poll, options: data.poll.options } : poll
          )
        );
      } else {
        setErrorMessage(data.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setErrorMessage('Failed to submit vote');
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && <div className="text-red-600">{errorMessage}</div>} {/* Display error message */}
      {polls.map((poll) => (
        <div key={poll.pollId} className="poll-item">
          <h3>{poll.question}</h3>
          <div>
            {Object.keys(poll.options || {}).map((option) => (
              <div key={option}>
                <input type="radio" id={option} name={`poll-${poll.pollId}`} value={option} />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
          {poll.hasVoted ? (
            <p className="voted-message">You have already voted in this poll.</p>
          ) : (
            <button
              className="vote-button"
              onClick={() => handleVote(poll.pollId, 'option1')} // Example for 'option1', adjust as needed
            >
              Vote
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Poll;
