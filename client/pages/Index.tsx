import { useState, useRef, useEffect } from "react";
import { MessageSquare, Plus, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  images?: string[];
  timestamp: Date;
}

export default function Index() {
  const [selectedThread, setSelectedThread] = useState<string>("1");
  const [inputText, setInputText] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "New Chat",
      createdAt: new Date(),
      messages: []
    }
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find(t => t.id === selectedThread);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentThread?.messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === selectedThread
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              title: thread.messages.length === 0 ? inputText.slice(0, 30) + (inputText.length > 30 ? '...' : '') : thread.title
            }
          : thread
      )
    );

    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response (you can replace this with your actual API call)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'll generate some images based on your prompt. Please wait a moment...",
        isUser: false,
        images: [
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        ],
        timestamp: new Date()
      };

      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === selectedThread
            ? { ...thread, messages: [...thread.messages, aiResponse] }
            : thread
        )
      );
    }, 1000);
  };

  const createNewChat = () => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date()
    };
    setThreads(prev => [newThread, ...prev]);
    setSelectedThread(newThread.id);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-200">
          <Button 
            onClick={createNewChat}
            variant="outline"
            className="w-full justify-start gap-2 text-sm font-normal"
          >
            <Plus size={14} />
            New Chat
          </Button>
        </div>
        
        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={cn(
                "px-3 py-2 mx-2 my-1 rounded cursor-pointer text-sm transition-colors",
                selectedThread === thread.id 
                  ? "bg-gray-200" 
                  : "hover:bg-gray-200"
              )}
            >
              <div className="truncate text-gray-700">
                {thread.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-center">
          <h1 className="font-medium text-gray-900">ChatGPT</h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentThread?.messages.map((message) => (
            <div key={message.id} className="flex">
              <div className="flex-1 max-w-3xl">
                <div
                  className={cn(
                    "p-4 rounded-lg",
                    message.isUser 
                      ? "bg-blue-500 text-white ml-auto max-w-2xl" 
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Send a message..."
                  className="w-full resize-none border-0 px-4 py-3 focus:outline-none focus:ring-0 text-sm min-h-[48px] max-h-48"
                  rows={1}
                />
              </div>
              
              <div className="flex items-center gap-2 px-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip size={16} />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  size="sm"
                  className="p-2 h-8 w-8 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900"
                >
                  <Send size={14} className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
