import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function Index() {
  const [selectedThread, setSelectedThread] = useState("1");
  const [threads, setThreads] = useState([
    {
      id: "1",
      title: "New Chat",
      createdAt: new Date(),
    },
  ]);

  const createNewChat = () => {
    const newThread = {
      id: Date.now().toString(),
      title: "New Chat",
      createdAt: new Date(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread.id);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <div className="w-60 bg-gray-200 flex flex-col">
        {/* Chat Icon */}
        <div className="p-4">
          <div className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center">
            <MessageSquare size={16} className="text-black" />
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <button
            onClick={createNewChat}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            New Chat
          </button>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto px-4">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors rounded mb-1 ${
                selectedThread === thread.id
                  ? "bg-white text-black font-medium"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <div className="truncate">{thread.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        {/* Content Grid */}
        <div className="h-full p-6">
          <div className="grid grid-cols-4 gap-4 h-full">
            {/* Empty placeholders matching the design */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg aspect-square"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
