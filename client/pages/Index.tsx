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
  const prompts = [
    "Generate a modern smart touch panel UI design.",
    "Show me a luxury home automation setup.",
    "Create images of futuristic urban living spaces.",
    "Design a minimalist touch switch interface.",
    "Visualize smart home convenience features.",
    "Illustrate a smart panel replacing traditional switches.",
    "Concept art for a high-tech smart home control panel.",
    "Render a user-friendly smart touch panel layout.",
  ];

  const [placeholderText, setPlaceholderText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [selectedThread, setSelectedThread] = useState("excel-new-1");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSheetData, setIsLoadingSheetData] = useState(true);
  const [sheetConversations, setSheetConversations] = useState<any[]>([]);

  // Google Sheets configuration
  const GOOGLE_SHEET_ID = "133ZHExWO_6Jfdmx_VRntJG_XJuy7wTXgepPs78yRuyg";
  const SHEET_GID = "0";

  // Function to fetch data from Google Sheets
  const fetchGoogleSheetData = async () => {
    try {
      setIsLoadingSheetData(true);
      const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data: ${response.status}`);
      }

      const csvText = await response.text();
      const rows = csvText.split('\n').filter(row => row.trim());

      // Skip header row and parse data
      const conversations = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row.trim()) continue;

        // Parse CSV row (handle quoted values)
        const columns = parseCSVRow(row);

        if (columns.length >= 2) {
          const prompt = columns[0]?.trim() || "";
          const response = columns[1]?.trim() || "";

          // Parse image links from subsequent columns (columns 2, 3, 4, etc.)
          const imageLinks = [];
          for (let j = 2; j < columns.length; j++) {
            const link = columns[j]?.trim();
            if (link && link.includes('drive.google.com')) {
              imageLinks.push(link);
            }
          }

          if (prompt) {
            conversations.push({
              prompt,
              response,
              imageLinks
            });
          }
        }
      }

      setSheetConversations(conversations);
      console.log(`Loaded ${conversations.length} conversations from Google Sheets`);
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      // Fallback to empty array
      setSheetConversations([]);
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  // Simple CSV parser that handles quoted values
  const parseCSVRow = (row: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result.map(cell => cell.replace(/^"|"$/g, '')); // Remove surrounding quotes
  };

  // Load data on component mount
  useEffect(() => {
    fetchGoogleSheetData();
  }, []);

  // Function to convert Google Drive links to direct image URLs
  const convertGoogleDriveLink = (driveLink: string) => {
    if (driveLink.includes("drive.google.com")) {
      const fileId = driveLink.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        // Use a different Google Drive URL format that works better for images
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`;
      }
    }
    return driveLink;
  };

  // Fallback images for when Google Drive links fail
  const getFallbackImage = (index: number, prompt: string) => {
    const fallbackImages = {
      protein: [
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop",
      ],
      glass: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=300&h=200&fit=crop",
      ],
      airpod: [
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=300&h=200&fit=crop",
      ],
      oneplus: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop",
      ],
    };

    if (prompt.includes("protein"))
      return fallbackImages.protein[index % fallbackImages.protein.length];
    if (prompt.includes("glass"))
      return fallbackImages.glass[index % fallbackImages.glass.length];
    if (prompt.includes("airpod"))
      return fallbackImages.airpod[index % fallbackImages.airpod.length];
    if (prompt.includes("oneplus"))
      return fallbackImages.oneplus[index % fallbackImages.oneplus.length];

    return `https://images.unsplash.com/photo-${1500000000000 + index}?w=300&h=200&fit=crop`;
  };

  // Function to create threads from Excel data
  const createThreadsFromExcelData = () => {
    return excelConversations.map((conv, index) => {
      const threadId = `excel-new-${index + 1}`;

      // Create user message only
      const userMessage: Message = {
        id: `${threadId}-user`,
        text: conv.prompt,
        isUser: true,
        uploadedImages: [],
        timestamp: new Date(
          Date.now() - (excelConversations.length - index) * 60000,
        ),
      };

      // Use the Google Drive image links from Excel data
      const outputImages = conv.imageLinks
        ? conv.imageLinks.map(convertGoogleDriveLink)
        : [];

      return {
        id: threadId,
        title: conv.prompt.slice(0, 80),
        messages: [userMessage], // Only user message, no AI response
        outputImages: outputImages,
        createdAt: new Date(
          Date.now() - (excelConversations.length - index) * 60000,
        ),
        isFrozen: true,
      };
    });
  };

  const [threads, setThreads] = useState<Thread[]>(() => {
    const excelThreads = createThreadsFromExcelData();
    return [
      {
        id: "1",
        title: "New Chat",
        createdAt: new Date(),
        messages: [],
        outputImages: [],
        isFrozen: false,
      },
      ...excelThreads,
    ];
  });

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

  const handleSendMessage = async () => {
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
                  ? inputText.slice(0, 80)
                  : thread.title,
              isFrozen: true,
            }
          : thread,
      ),
    );

    // Store the current input text and uploaded images before clearing
    const currentInputText = inputText;
    const currentUploadedImages = [...uploadedImages];

    setInputText("");
    setUploadedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Submit to n8n webhook
      const formData = new FormData();
      formData.append("chatInput", currentInputText);

      // Convert first uploaded image to blob and append to form data
      if (currentUploadedImages.length > 0) {
        // Convert base64 to blob
        const base64Data = currentUploadedImages[0];
        const response = await fetch(base64Data);
        const blob = await response.blob();
        formData.append("data", blob, "uploaded-image.jpeg");
      }

      const webhookResponse = await fetch(
        "https://vidgy.app.n8n.cloud/webhook/84342f4e-4ba8-4a87-939f-2c2880571a5e",
        {
          method: "POST",
          body: formData,
        },
      );

      if (webhookResponse.ok) {
        const result = await webhookResponse.json();
        console.log("n8n webhook response:", result);
        console.log("Response type:", typeof result);
        console.log("Response keys:", Object.keys(result || {}));

        // Parse the response and extract generated images
        let generatedImages: string[] = [];

        if (result && typeof result === "object") {
          // Try multiple possible response formats
          if (result.images && Array.isArray(result.images)) {
            generatedImages = result.images;
            console.log("Found images in result.images:", generatedImages);
          } else if (result.imageUrls && Array.isArray(result.imageUrls)) {
            generatedImages = result.imageUrls;
            console.log("Found images in result.imageUrls:", generatedImages);
          } else if (result.data && Array.isArray(result.data)) {
            generatedImages = result.data;
            console.log("Found images in result.data:", generatedImages);
          } else if (result.output && Array.isArray(result.output)) {
            generatedImages = result.output;
            console.log("Found images in result.output:", generatedImages);
          } else if (Array.isArray(result)) {
            generatedImages = result;
            console.log("Result is an array:", generatedImages);
          } else {
            // Look for any array of strings that might be image URLs
            Object.keys(result).forEach((key) => {
              if (Array.isArray(result[key]) && result[key].length > 0) {
                if (
                  typeof result[key][0] === "string" &&
                  result[key][0].includes("http")
                ) {
                  generatedImages = result[key];
                  console.log(
                    `Found images in result.${key}:`,
                    generatedImages,
                  );
                }
              }
            });
          }
        }

        console.log("Final generatedImages:", generatedImages);

        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === selectedThread
              ? {
                  ...thread,
                  outputImages: generatedImages, // Will be empty array if no images from API
                }
              : thread,
          ),
        );

        setIsGenerating(false);
      } else {
        const errorText = await webhookResponse.text();
        console.error(
          `Webhook request failed: ${webhookResponse.status}`,
          errorText,
        );
        throw new Error(`Webhook request failed: ${webhookResponse.status}`);
      }
    } catch (error) {
      console.error("Error submitting to n8n webhook:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        inputText: currentInputText,
        hasImages: currentUploadedImages.length > 0,
      });

      // No fallback images - just show empty gallery on error
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === selectedThread
            ? {
                ...thread,
                outputImages: [], // Empty array - no images on error
              }
            : thread,
        ),
      );

      setIsGenerating(false);
    }
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
  useEffect(() => {
    if (isGenerating) return;

    const currentPrompt = prompts[promptIndex];
    if (charIndex < currentPrompt.length) {
      const timeout = setTimeout(() => {
        setPlaceholderText((prev) => prev + currentPrompt.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPlaceholderText("");
        setCharIndex(0);
        setPromptIndex((promptIndex + 1) % prompts.length);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, promptIndex, isGenerating]);

  return (
    <div className="h-screen bg-gray-100 flex font-sans">
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
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
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
                "px-3 py-3 text-sm font-medium cursor-pointer transition-colors rounded mb-1 group",
                selectedThread === thread.id
                  ? "bg-white text-black font-semibold"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
              )}
              title={thread.messages[0]?.text || "New Chat"}
            >
              <div className="line-clamp-2 leading-tight">{thread.title}</div>
              {thread.id.startsWith("excel-new-") && (
                <div className="text-xs text-green-600 mt-1">✨ New Import</div>
              )}
              {thread.id.startsWith("excel-") &&
                !thread.id.startsWith("excel-new-") && (
                  <div className="text-xs text-blue-600 mt-1">
                    📊 Old Import
                  </div>
                )}
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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (
                          target.src !==
                          getFallbackImage(index, currentThread?.title || "")
                        ) {
                          target.src = getFallbackImage(
                            index,
                            currentThread?.title || "",
                          );
                        }
                      }}
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (
                      target.src !==
                      getFallbackImage(
                        selectedImageIndex,
                        currentThread?.title || "",
                      )
                    ) {
                      target.src = getFallbackImage(
                        selectedImageIndex,
                        currentThread?.title || "",
                      );
                    }
                  }}
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
                      <div className="whitespace-pre-wrap text-base leading-relaxed font-normal">
                        {message.text.includes("**Shot ") ? (
                          // Format shot descriptions with better styling
                          <div className="space-y-4">
                            {message.text.split("\n\n").map((shot, index) => (
                              <div
                                key={index}
                                className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50/50 rounded-r"
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: shot
                                      .replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong class="text-blue-700">$1</strong>',
                                      )
                                      .replace(
                                        /Type: (.*?)(?=\n|$)/g,
                                        '<div class="text-sm text-gray-600 mt-1"><span class="font-medium">Type:</span> $1</div>',
                                      )
                                      .replace(
                                        /Camera: (.*?)(?=\n|$)/g,
                                        '<div class="text-sm text-gray-600"><span class="font-medium">Camera:</span> $1</div>',
                                      )
                                      .replace(
                                        /Description: (.*?)(?=\n|$)/g,
                                        '<div class="text-gray-700 mt-1">$1</div>',
                                      )
                                      .replace(/\n/g, "<br>"),
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          message.text
                        )}
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
                        <span className="text-sm text-gray-600 font-medium">
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
                  placeholder={
                    placeholderText || "Start typing your prompt here..."
                  }
                  className="w-full resize-none border-0 p-0 focus:outline-none focus:ring-0 text-base min-h-[20px] max-h-48 bg-transparent text-gray-700 placeholder-gray-400 font-normal"
                  rows={1}
                  disabled={isGenerating || currentThread?.isFrozen}
                />
              </div>

              {/* Paperclip icon - bottom left */}
              <button
                className="absolute bottom-2 left-2 p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || currentThread?.isFrozen}
              >
                <Paperclip size={16} />
              </button>

              {/* Send button - bottom right */}
              <button
                onClick={handleSendMessage}
                disabled={
                  (!inputText.trim() && uploadedImages.length === 0) ||
                  isGenerating ||
                  currentThread?.isFrozen
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
