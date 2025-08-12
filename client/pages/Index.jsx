import { useState } from "react";
import { MessageSquare, Send, Paperclip } from "lucide-react";

export default function Index() {
  const [selectedThread, setSelectedThread] = useState("1");
  const [inputText, setInputText] = useState("DOG is a smart touch panel, that replaces traditional switches. It is targeted towards urban home owners who are looking for");
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
      <div className="flex-1 bg-white flex flex-col">
        {/* Image Gallery Placeholders at Top */}
        <div className="h-32 bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex gap-3 h-full">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 h-full w-24 bg-gray-200 rounded"
              />
            ))}
          </div>
        </div>

        {/* Empty center area */}
        <div className="flex-1"></div>

        {/* Input Area at Bottom */}
        <div className="border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white border-2 border-gray-300 rounded-xl p-4">
              <div className="pr-20">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="DOG is a smart touch panel, that replaces traditional switches. It is targeted towards urban home owners who are looking for"
                  className="w-full resize-none border-0 p-0 focus:outline-none focus:ring-0 text-sm min-h-[20px] max-h-48 bg-transparent text-gray-600 placeholder-gray-400"
                  rows={1}
                />
              </div>

              {/* Paperclip icon - bottom left */}
              <button className="absolute bottom-2 left-2 p-1 h-6 w-6 text-gray-400 hover:text-gray-600">
                <Paperclip size={16} />
              </button>

              {/* Send button - bottom right */}
              <button className="absolute bottom-2 right-2 p-2 h-8 w-8 bg-blue-500 hover:bg-blue-600 rounded-full border-0 flex items-center justify-center">
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
