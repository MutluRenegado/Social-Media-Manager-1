// src/components/TeamProvider.tsx
import React, { useEffect, useState } from "react";

interface Stats {
  members: number;
  projects: number;
  tasksCompleted: number;
}

const TeamProvider = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching stats data
  useEffect(() => {
    // Replace this with your real data fetching logic
    const fetchStats = async () => {
      setLoading(true);
      // Simulated delay
      await new Promise((res) => setTimeout(res, 1000));
      setStats({
        members: 12,
        projects: 5,
        tasksCompleted: 124,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-background shadow-md rounded-md text-foreground dark:bg-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">Team Statistics</h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading stats...</p>
      ) : stats ? (
        <ul className="space-y-2">
          <li>
            <strong>Members:</strong> {stats.members}
          </li>
          <li>
            <strong>Projects:</strong> {stats.projects}
          </li>
          <li>
            <strong>Tasks Completed:</strong> {stats.tasksCompleted}
          </li>
        </ul>
      ) : (
        <p className="text-red-500">Failed to load stats.</p>
      )}
    </div>
  );
};

export default TeamProvider;
