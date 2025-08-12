import { useState, useRef, useEffect } from "react";
import { MessageSquare, Plus, ChevronLeft, ChevronRight, Upload, Send, X } from "lucide-react";
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
  images: string[];
  timestamp: Date;
}

export default function Index() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "Sample Image Generation",
      createdAt: new Date(),
      messages: [
        {
          id: "1",
          text: "Generate a beautiful sunset landscape",
          images: [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
          ],
          timestamp: new Date()
        }
      ]
    }
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find(t => t.id === selectedThread) || threads[0];
  const currentImages = currentThread?.messages[currentThread.messages.length - 1]?.images || [];

  useEffect(() => {
    if (threads.length > 0 && !selectedThread) {
      setSelectedThread(threads[0].id);
    }
  }, [threads, selectedThread]);

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
    if (!inputText.trim() && uploadedImages.length === 0) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      images: [...uploadedImages],
      timestamp: new Date()
    };

    if (currentThread) {
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === currentThread.id 
            ? { ...thread, messages: [...thread.messages, newMessage] }
            : thread
        )
      );
    }

    setInputText("");
    setUploadedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
      title: `New Chat ${threads.length + 1}`,
      messages: [],
      createdAt: new Date()
    };
    setThreads(prev => [newThread, ...prev]);
    setSelectedThread(newThread.id);
    setIsSidePanelOpen(false);
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
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-gray-50 border-r border-gray-200 transition-transform duration-300",
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
                  }}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors",
                    selectedThread === thread.id 
                      ? "bg-blue-100 border border-blue-200" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {thread.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {thread.messages.length} messages
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidePanelOpen(true)}
            className="gap-2"
          >
            <MessageSquare size={16} />
            Chat
          </Button>
          <h1 className="font-semibold text-gray-900">AI Image Generator</h1>
          <div className="w-16" />
        </div>

        {/* Image Gallery */}
        {currentImages.length > 0 && (
          <div className="relative bg-gray-50 border-b border-gray-200">
            <div className="p-6">
              <div className="relative">
                {currentImages.length > 4 && (
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
                  {currentImages.map((image, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex-shrink-0 cursor-pointer transition-all duration-200",
                        selectedImageIndex === index && "ring-2 ring-gray-400"
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
        {selectedImageIndex !== null && currentImages[selectedImageIndex] && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={currentImages[selectedImageIndex]}
                alt="Selected image"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
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
          
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to generate..."
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-48 min-h-[48px]"
                rows={1}
                title={inputText}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() && uploadedImages.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-3"
            >
              <Send size={16} />
            </Button>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}
    </div>
  );
}
