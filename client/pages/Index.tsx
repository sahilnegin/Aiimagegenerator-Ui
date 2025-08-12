import { useState, useRef, useEffect } from "react";
import { MessageSquare, Plus, Send, Paperclip, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string>("1");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "New Chat",
      createdAt: new Date(),
      messages: [],
      outputImages: []
    }
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                setUploadedImages(prev => [...prev, e.target!.result as string]);
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
    if (isGenerating) return; // Prevent sending while generating

    setIsGenerating(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      uploadedImages: [...uploadedImages],
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
    setUploadedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response with generated images
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I've generated some images based on your prompt. You can see them in the gallery above.",
        isUser: false,
        timestamp: new Date()
      };

      const generatedImages = [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
      ];

      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === selectedThread
            ? {
                ...thread,
                messages: [...thread.messages, aiResponse],
                outputImages: generatedImages
              }
            : thread
        )
      );

      setIsGenerating(false); // Re-enable input after generation
    }, 3000); // Increased to 3 seconds to simulate real generation time
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const createNewChat = () => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      outputImages: [],
      createdAt: new Date()
    };
    setThreads(prev => [newThread, ...prev]);
    setSelectedThread(newThread.id);
    setIsSidePanelOpen(false);
    setSelectedImageIndex(null);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 320;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-screen bg-white flex relative">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-gray-50 border-r border-gray-200 transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <Button 
              onClick={createNewChat}
              className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} />
              New Chat
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => {
                    setSelectedThread(thread.id);
                    setIsSidePanelOpen(false);
                    setSelectedImageIndex(null);
                  }}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors group",
                    selectedThread === thread.id 
                      ? "bg-blue-100 border border-blue-200" 
                      : "hover:bg-gray-100"
                  )}
                  title={thread.messages[0]?.text || "New Chat"}
                >
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {thread.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {thread.messages.length} messages • {thread.outputImages.length} images
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidePanelOpen(true)}
            className="gap-2 lg:hidden"
          >
            <MessageSquare size={16} />
            Chat
          </Button>
          <h1 className="font-semibold text-gray-900">AI Image Generator</h1>
          <div className="w-16" />
        </div>

        {/* Image Gallery at Top */}
        {currentThread?.outputImages && currentThread.outputImages.length > 0 && (
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="p-6">
              <div className="relative">
                {currentThread.outputImages.length > 4 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                      onClick={() => scrollGallery('left')}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                      onClick={() => scrollGallery('right')}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                
                <div 
                  ref={galleryRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide"
                >
                  {currentThread.outputImages.map((image, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex-shrink-0 cursor-pointer transition-all duration-200",
                        selectedImageIndex === index && "ring-4 ring-gray-400"
                      )}
                      onClick={() => setSelectedImageIndex(selectedImageIndex === index ? null : index)}
                    >
                      <img
                        src={image}
                        alt={`Generated image ${index + 1}`}
                        className="w-72 h-56 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Image Large View */}
        {selectedImageIndex !== null && currentThread?.outputImages[selectedImageIndex] && (
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

        {/* Chat Messages */}
        {selectedImageIndex === null && (
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
                    
                    {/* Display uploaded images */}
                    {message.uploadedImages && message.uploadedImages.length > 0 && (
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
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white">
          {uploadedImages.length > 0 && (
            <div className="mb-4 flex gap-2 flex-wrap">
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
          
          <div className="max-w-3xl mx-auto">
            <div className={cn(
              "flex items-end gap-3 bg-white border border-gray-300 rounded-lg overflow-hidden transition-opacity",
              isGenerating && "opacity-50"
            )}>
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder={isGenerating ? "Generating images... Please wait" : "Describe the image you want to generate... (Ctrl+V to paste images)"}
                  className="w-full resize-none border-0 px-4 py-3 focus:outline-none focus:ring-0 text-sm min-h-[48px] max-h-48"
                  rows={1}
                  disabled={isGenerating}
                />
              </div>

              <div className="flex items-center gap-2 px-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                >
                  <Paperclip size={16} />
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={(!inputText.trim() && uploadedImages.length === 0) || isGenerating}
                  size="sm"
                  className="p-2 h-8 w-8 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900"
                >
                  {isGenerating ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={14} className="text-white" />
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

      {/* Overlay for mobile */}
      {isSidePanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}
    </div>
  );
}
