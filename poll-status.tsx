'use client';

import { useState, useEffect } from 'react';

type PollOption = {
  option: string;
  votes: number;
};

type Poll = {
  pollId: string;
  question: string;
  options: PollOption[];
  hasVoted: boolean; // Flag to track if the user has voted in this poll
};

export default function Poll() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch polls from the backend
    const fetchPolls = async () => {
      try {
        const res = await fetch('/api/poll');
        const data = await res.json();
        setPolls(data.polls);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setErrorMessage('Failed to load polls. Please try again later.');
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId: string) => {
    if (!selectedOption) return;

    setLoading(true);
    setErrorMessage(null); // Clear any previous errors

    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
          option: selectedOption,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Fetch updated polls after submitting vote
        const updatedPolls = await fetch('/api/poll').then((res) => res.json());
        setPolls(updatedPolls.polls);
        setSelectedOption(null); // Reset selection
      } else {
        console.error('Error voting:', data.error);
        setErrorMessage('Failed to submit your vote. Please try again later.');
      }
    } catch (error) {
      console.error('Error voting:', error);
      setErrorMessage('An error occurred while voting. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      
      {polls.map((poll) => (
        <div key={poll.pollId} className="border p-4 rounded-lg">
          <h2 className="font-semibold">{poll.question}</h2>
          <div>
            {poll.options.map((option) => (
              <div key={option.option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option.option}
                  name={`poll-option-${poll.pollId}`} // Unique name per poll
                  value={option.option}
                  onChange={() => setSelectedOption(option.option)}
                  checked={selectedOption === option.option}
                  disabled={poll.hasVoted} // Disable options if the user has already voted
                />
                <label htmlFor={option.option}>{option.option}</label>
              </div>
            ))}
          </div>

          {poll.hasVoted ? (
            <p className="text-green-600 mt-2">You have already voted in this poll.</p>
          ) : (
            <button
              onClick={() => handleVote(poll.pollId)}
              disabled={loading || !selectedOption || poll.hasVoted}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Submitting...' : 'Submit Vote'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
