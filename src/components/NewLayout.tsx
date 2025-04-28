import React, { useState } from "react";
import NewHeader from "./NewHeader";
import NewMenuClient from "./NewMenuClient";

const NewLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>("/");

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="flex flex-col h-screen">
      <NewHeader userId="User123" />
      <div className="flex flex-1">
        <NewMenuClient selectedTopic={selectedTopic} onTopicSelect={handleTopicSelect} />
        <main className="flex-1 p-6 ml-56 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default NewLayout;
