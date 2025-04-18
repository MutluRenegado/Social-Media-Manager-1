'use client';
//Poll.tsx
import { useState, useEffect } from 'react';
export default function Poll() {
    const [polls, setPolls] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        // Fetch polls from the backend
        const fetchPolls = async () => {
            try {
                const res = await fetch('/api/poll');
                const data = await res.json();
                setPolls(data.polls);
            }
            catch (error) {
                console.error('Error fetching polls:', error);
                setErrorMessage('Failed to load polls. Please try again later.');
            }
        };
        fetchPolls();
    }, []);
    const handleVote = async (pollId) => {
        if (!selectedOption)
            return;
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
            }
            else {
                console.error('Error voting:', data.error);
                setErrorMessage('Failed to submit your vote. Please try again later.');
            }
        }
        catch (error) {
            console.error('Error voting:', error);
            setErrorMessage('An error occurred while voting. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    };
    return (React.createElement("div", { className: "space-y-4" },
        errorMessage && React.createElement("div", { className: "text-red-600" }, errorMessage),
        polls.map((poll) => (React.createElement("div", { key: poll.pollId, className: "border p-4 rounded-lg" },
            React.createElement("h2", { className: "font-semibold" }, poll.question),
            React.createElement("div", null, poll.options.map((option) => (React.createElement("div", { key: option.option, className: "flex items-center space-x-2" },
                React.createElement("input", { type: "radio", id: option.option, name: `poll-option-${poll.pollId}`, value: option.option, onChange: () => setSelectedOption(option.option), checked: selectedOption === option.option, disabled: poll.hasVoted }),
                React.createElement("label", { htmlFor: option.option }, option.option))))),
            poll.hasVoted ? (React.createElement("p", { className: "text-green-600 mt-2" }, "You have already voted in this poll.")) : (React.createElement("button", { onClick: () => handleVote(poll.pollId), disabled: loading || !selectedOption || poll.hasVoted, className: "mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" }, loading ? 'Submitting...' : 'Submit Vote')))))));
}
