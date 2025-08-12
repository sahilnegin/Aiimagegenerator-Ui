import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  outputImages: string[];
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  uploadedImages?: string[];
  timestamp: Date;
}

export default function Index() {
  const [selectedThread, setSelectedThread] = useState<string>("1");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "New Chat",
      createdAt: new Date(),
      messages: [],
      outputImages: [],
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find((t) => t.id === selectedThread);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentThread?.messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                setUploadedImages((prev) => [
                  ...prev,
                  e.target!.result as string,
                ]);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && uploadedImages.length === 0) return;
    if (isGenerating) return;

    setIsGenerating(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      uploadedImages: [...uploadedImages],
      timestamp: new Date(),
    };

    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === selectedThread
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              title:
                thread.messages.length === 0
                  ? inputText.slice(0, 30) +
                    (inputText.length > 30 ? "..." : "")
                  : thread.title,
            }
          : thread,
      ),
    );

    setInputText("");
    setUploadedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response with generated images
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I've generated some images based on your prompt. You can see them in the gallery above.",
        isUser: false,
        timestamp: new Date(),
      };

      const generatedImages = [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
      ];

      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === selectedThread
            ? {
                ...thread,
                messages: [...thread.messages, aiResponse],
                outputImages: generatedImages,
              }
            : thread,
        ),
      );

      setIsGenerating(false);
    }, 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const createNewChat = () => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      outputImages: [],
      createdAt: new Date(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread.id);
    setSelectedImageIndex(null);
  };

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = 320;
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Always Visible Sidebar */}
      <div className="w-40 bg-white border-2 border-blue-400 flex flex-col">
        {/* Chat Icon */}
        <div className="p-3 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <MessageSquare size={16} className="text-white" />
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-200">
          <Button
            onClick={createNewChat}
            variant="outline"
            className="w-full justify-start text-xs h-8 px-2"
          >
            <Plus size={12} className="mr-1" />
            New Chat
          </Button>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                setSelectedThread(thread.id);
                setSelectedImageIndex(null);
              }}
              className={cn(
                "px-3 py-2 text-xs cursor-pointer transition-colors border-b border-gray-100",
                selectedThread === thread.id
                  ? "bg-blue-50 border-l-2 border-l-blue-500"
                  : "hover:bg-gray-50",
              )}
              title={thread.messages[0]?.text || "New Chat"}
            >
              <div className="truncate text-gray-700">{thread.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Image Gallery at Top */}
        <div className="h-32 bg-gray-50 border-b border-gray-200 p-4">
          {currentThread?.outputImages &&
          currentThread.outputImages.length > 0 ? (
            <div className="relative h-full">
              {currentThread.outputImages.length > 6 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white h-8 w-8 p-0"
                    onClick={() => scrollGallery("left")}
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white h-8 w-8 p-0"
                    onClick={() => scrollGallery("right")}
                  >
                    <ChevronRight size={14} />
                  </Button>
                </>
              )}

              <div
                ref={galleryRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide h-full"
              >
                {currentThread.outputImages.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-shrink-0 cursor-pointer transition-all duration-200 h-full",
                      selectedImageIndex === index &&
                        "ring-3 ring-gray-400 rounded",
                    )}
                    onClick={() =>
                      setSelectedImageIndex(
                        selectedImageIndex === index ? null : index,
                      )
                    }
                  >
                    <img
                      src={image}
                      alt={`Generated image ${index + 1}`}
                      className="h-full w-24 object-cover rounded bg-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-3 h-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-full w-24 bg-gray-200 rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Selected Image Large View */}
        {selectedImageIndex !== null &&
          currentThread?.outputImages[selectedImageIndex] && (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={currentThread.outputImages[selectedImageIndex]}
                  alt="Selected image"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

        {/* Chat Messages (when no image selected) */}
        {selectedImageIndex === null && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {currentThread?.messages.map((message) => (
                <div key={message.id} className="flex">
                  <div className="flex-1">
                    <div
                      className={cn(
                        "p-4 rounded-lg max-w-2xl",
                        message.isUser
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-100 text-gray-900",
                      )}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text}
                      </div>

                      {message.uploadedImages &&
                        message.uploadedImages.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {message.uploadedImages.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-32 object-cover rounded border-2 border-white/20"
                              />
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area at Bottom */}
        <div className="border-t border-gray-200 p-6">
          {uploadedImages.length > 0 && (
            <div className="mb-4 flex gap-2 flex-wrap max-w-4xl mx-auto">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    onClick={() => removeUploadedImage(index)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <div
              className={cn(
                "flex items-end gap-3 bg-white border border-gray-300 rounded-lg p-3 transition-opacity",
                isGenerating && "opacity-50",
              )}
            >
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder={
                    isGenerating
                      ? "Generating images... Please wait"
                      : "DOG is a smart touch panel, that replaces traditional switches. It is targeted towards urban home owners who are looking for comfort, convenience and luxury in their lives."
                  }
                  className="w-full resize-none border-0 p-0 focus:outline-none focus:ring-0 text-sm min-h-[20px] max-h-48 bg-transparent"
                  rows={1}
                  disabled={isGenerating}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                >
                  <Paperclip size={14} />
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={
                    (!inputText.trim() && uploadedImages.length === 0) ||
                    isGenerating
                  }
                  size="sm"
                  className="p-1 h-6 w-6 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900 rounded-full"
                >
                  {isGenerating ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={12} className="text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
