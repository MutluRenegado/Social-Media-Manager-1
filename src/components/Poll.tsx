// components/Poll.tsx
import { useState, useEffect } from 'react';

const Poll = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userId, setUserId] = useState<string>('user123'); // Example user ID
  const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: string }>({});
  const [loadingPollId, setLoadingPollId] = useState<string | null>(null); // 🌀 Loading per poll

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

  const handleVote = async (pollId: string) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) {
      setErrorMessage('Please select an option before voting.');
      return;
    }

    try {
      setLoadingPollId(pollId); // Start loading spinner
      const res = await fetch('/api/poll-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, option: selectedOption, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll.pollId === pollId ? { ...poll, options: data.poll.options, hasVoted: true } : poll
          )
        );
        setErrorMessage('');
      } else {
        setErrorMessage(data.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setErrorMessage('Failed to submit vote');
    } finally {
      setLoadingPollId(null); // Stop loading spinner
    }
  };

  const handleOptionChange = (pollId: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [pollId]: option }));
  };

  return (
    <div className="space-y-6 p-4">
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}

      {polls.map((poll) => {
        const totalVotes = Object.values(poll.options || {}).reduce((sum: number, votes: any) => sum + votes, 0);

        return (
          <div key={poll.pollId} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-4">{poll.question}</h3>

            <div className="space-y-3 mb-4">
              {Object.entries(poll.options || {}).map(([option, votes]) => {
                const percentage = totalVotes > 0 ? ((votes as number) / totalVotes) * 100 : 0;
                const isSelected = selectedOptions[poll.pollId] === option;

                return (
                  <div key={option} className="space-y-1">
                    {poll.hasVoted ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{option}</span>
                          <span>{votes} votes ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`${poll.pollId}-${option}`}
                          name={`poll-${poll.pollId}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleOptionChange(poll.pollId, option)}
                          className="accent-blue-600"
                        />
                        <label htmlFor={`${poll.pollId}-${option}`} className="text-gray-700">
                          {option}
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {poll.hasVoted ? (
              <p className="text-green-600 font-semibold">You have already voted in this poll.</p>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                onClick={() => handleVote(poll.pollId)}
                disabled={loadingPollId === poll.pollId}
              >
                {loadingPollId === poll.pollId ? "Submitting..." : "Submit Vote"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Poll;
