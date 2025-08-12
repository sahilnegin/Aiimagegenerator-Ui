import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  uploadedImages?: string[];
  timestamp: Date;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  outputImages: string[];
  createdAt: Date;
  isFrozen: boolean;
}

export default function Index() {
  const [selectedThread, setSelectedThread] = useState("1");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      title: "New Chat",
      createdAt: new Date(),
      messages: [],
      outputImages: [],
      isFrozen: false,
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

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
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
                  e.target.result as string,
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
    if (isGenerating || currentThread?.isFrozen) return;

    setIsGenerating(true);

    const newMessage: Message = {
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
              isFrozen: true,
            }
          : thread,
      ),
    );

    setInputText("");
    setUploadedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response with generated images only (no text)
    setTimeout(() => {

      const generatedImages = [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=200&fit=crop",
      ];

      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === selectedThread
            ? {
                ...thread,
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
            setUploadedImages((prev) => [...prev, e.target.result as string]);
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
    const newThread: Thread = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      outputImages: [],
      createdAt: new Date(),
      isFrozen: false,
    };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread.id);
    setSelectedImageIndex(null);
    setIsGenerating(false);
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
      {/* Sidebar */}
      <div className="w-60 bg-gray-200 flex flex-col z-40">
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
              onClick={() => {
                setSelectedThread(thread.id);
                setSelectedImageIndex(null);
              }}
              className={cn(
                "px-3 py-2 text-sm cursor-pointer transition-colors rounded mb-1 group",
                selectedThread === thread.id
                  ? "bg-white text-black font-medium"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
              )}
              title={thread.messages[0]?.text || "New Chat"}
            >
              <div className="truncate">{thread.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Image Gallery at Top */}
        <div className="h-32 bg-gray-50 border-b border-gray-200 p-4">
          {currentThread?.outputImages &&
          currentThread.outputImages.length > 0 ? (
            <div className="relative h-full flex justify-center">
              {currentThread.outputImages.length > 6 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded border border-gray-300 flex items-center justify-center"
                    onClick={() => scrollGallery("left")}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded border border-gray-300 flex items-center justify-center"
                    onClick={() => scrollGallery("right")}
                  >
                    <ChevronRight size={14} />
                  </button>
                </>
              )}

              <div
                ref={galleryRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide h-full justify-center"
              >
                {currentThread.outputImages.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-shrink-0 cursor-pointer transition-all duration-200 h-full border-2 rounded",
                      selectedImageIndex === index
                        ? "border-gray-400"
                        : "border-transparent hover:border-gray-300",
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
            <div className="flex gap-3 h-full justify-center">
              {[...Array(8)].map((_, i) => (
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
                      <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-normal">
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
              {isGenerating && (
                <div className="flex">
                  <div className="flex-1">
                    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <span className="text-sm text-gray-600">
                          Generating images...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  <button
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                    onClick={() => removeUploadedImage(index)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <div
              className={cn(
                "relative bg-white border-2 border-gray-300 rounded-xl p-4 transition-opacity",
                (isGenerating || currentThread?.isFrozen) && "opacity-50",
              )}
            >
              <div className="pr-20">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="DOG is a smart touch panel, that replaces traditional switches. It is targeted towards urban home owners who are looking for comfort, convenience and luxury in their lives."
                  className="w-full resize-none border-0 p-0 focus:outline-none focus:ring-0 text-[15px] min-h-[20px] max-h-48 bg-transparent text-gray-700 placeholder-gray-400 font-normal leading-relaxed"
                  rows={1}
                  disabled={isGenerating || currentThread?.isFrozen}
                />
              </div>

              {/* Paperclip icon - bottom left */}
              <button
                className="absolute bottom-2 left-2 p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || isFrozen}
              >
                <Paperclip size={16} />
              </button>

              {/* Send button - bottom right */}
              <button
                onClick={handleSendMessage}
                disabled={
                  (!inputText.trim() && uploadedImages.length === 0) ||
                  isGenerating ||
                  isFrozen
                }
                className="absolute bottom-2 right-2 p-2 h-8 w-8 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 rounded-full border-0 flex items-center justify-center"
              >
                {isGenerating ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={14} className="text-white" />
                )}
              </button>
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
