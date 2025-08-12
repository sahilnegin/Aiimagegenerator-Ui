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
  "Render a user-friendly smart touch panel layout."
];

const [placeholderText, setPlaceholderText] = useState("");
const [promptIndex, setPromptIndex] = useState(0);
const [charIndex, setCharIndex] = useState(0);

  const [selectedThread, setSelectedThread] = useState("1");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Excel conversation data
  const excelConversations = [
    {
      prompt: "create ad for protein bar without nuts",
      response: "[{\"shot_number\":1,\"title\":\"Hero Shot\",\"shot_type\":\"hero\",\"shot_description\":\"A sleek, nut-free protein bar rests prominently on a textured rustic wooden surface with an ambient background. The surface is slightly dusted with flour, and the bar is unwrapped to reveal its smooth chocolate coating, free of any nut marks. The camera angle is flat-lay, slightly tilted to highlight the bar's rich texture and handcrafted appearance. The theme is natural and wholesome. The color palette includes earthy browns and soft beige, creating a cozy and inviting feeling.\",\"camera_angle\":\"Flat-lay\",\"camera_motion\":\"Static\"},{\"shot_number\":2,\"title\":\"Macro Shot - Ingredient Focus\",\"shot_type\":\"macro\",\"shot_description\":\"An extreme close-up zooms into the rich layers of the protein bar's chocolate texture, highlighting the absence of nuts, making the smooth, silky surface the hero. Soft, diffused side lighting enhances the creamy texture, and the camera gently tilts to bring a small cocoa nib into focus, suggesting the bar's quality. The theme remains natural and wholesome, maintaining a color palette of rich chocolate brown.\",\"camera_angle\":\"Extreme close-up\",\"camera_motion\":\"Tilt\"},{\"shot_number\":3,\"title\":\"Feature Shot - Nutritional Highlight\",\"shot_type\":\"feature\",\"shot_description\":\"A dynamic shot zooms out from an animated nutritional chart appearing above the bar, highlighting its high protein content and other benefits like being gluten-free and vegan-friendly. The camera is in a medium close-up, capturing the chart dissolving into the bar's realistic image where the wrapper slightly peels to emphasize freshness. The lighting shifts from bright and informative to focus on the warm tones of the bar. The theme stays wholesome, with a palette of greens and browns for a healthy impression.\",\"camera_angle\":\"Medium close-up\",\"camera_motion\":\"Zoom out\"},{\"shot_number\":4,\"title\":\"Interaction Shot - Lifestyle Integration\",\"shot_type\":\"lifestyle\",\"shot_description\":\"A hand reaches for the protein bar from a gym bag alongside a water bottle and towel, suggesting its role in an active lifestyle. The camera captures this in a medium shot with dynamic lighting that emphasizes movement and energy. The background shows a blurred gym environment. The theme is active and energetic, with a color palette of vibrant blues and greens mixed with the warm tones of the bar.\",\"camera_angle\":\"Medium shot\",\"camera_motion\":\"Follow motion\"}]"
    },
    {
      prompt: "creat ad for protien bar with lot of nuts and cashews",
      response: "[{\"shot_number\":1,\"title\":\"Reveal Shot\",\"shot_type\":\"Product\",\"shot_description\":\"A protein bar with visible chunks of nuts and cashews rests on a rustic wooden kitchen countertop with a warm, inviting background. The lighting is soft and natural, coming from a window. The camera angle is slightly overhead. The theme is wholesome and natural, with a color palette of earthy browns and creamy beiges. This shot's purpose is to introduce the product in a friendly, homey setting.\",\"camera_angle\":\"Slightly Overhead\",\"camera_motion\":\"Static Shot\"},{\"shot_number\":2,\"title\":\"Macro Shot\",\"shot_type\":\"Product Detail\",\"shot_description\":\"An extreme close-up focuses on the textured surface of the protein bar, emphasizing the rich, crunchy nuts and creamy cashews embedded within. The lighting is bright and directional to highlight the intricate textures and natural oils glistening. The camera very slowly pans across the surface. The theme continues with a wholesome, earthy color palette.\",\"camera_angle\":\"Macro\",\"camera_motion\":\"Slow Pan\"},{\"shot_number\":3,\"title\":\"Feature Shot\",\"shot_type\":\"Texture\",\"shot_description\":\"The bar is broken in half to reveal a chewy, delicious interior packed with nuts and cashews. The camera captures this in a close-up as pieces crumble slowly, and the lighting highlights the softness amidst the crunch. The theme remains natural and inviting, maintaining a warm color palette throughout.\",\"camera_angle\":\"Close-Up\",\"camera_motion\":\"Slow Motion\"},{\"shot_number\":4,\"title\":\"Hero Shot\",\"shot_type\":\"Product Essence\",\"shot_description\":\"Several protein bars are neatly arranged alongside scattered nuts and cashews, with one bar placed upright to showcase its form amidst the ingredients. The scene is lit by soft, diffused lighting from a nearby window, enhancing the freshness and richness of the ingredients. The color palette focuses on natural, earthy tones. This final shot emphasizes the product's quality and natural ingredients.\",\"camera_angle\":\"Wide Shot\",\"camera_motion\":\"Slow Zoom\"}]"
    },
    {
      prompt: "creat ad for protein bar without wrapper",
      response: "[{\"shot_number\":1,\"title\":\"Opening Shot\",\"shot_type\":\"Hero Shot\",\"shot_description\":\"A stack of protein bars rest on a polished wooden kitchen counter with a soft natural light before dawn. The surface is glossy and clean, capturing a sense of freshness. Camera angle: Wide angle. Theme: Morning Energy Boost. Colour palette: warm browns and golds.\",\"camera_angle\":\"Wide angle\",\"camera_motion\":\"Static\"},{\"shot_number\":2,\"title\":\"Texture Detail\",\"shot_type\":\"Macro Shot\",\"shot_description\":\"A close-up of the protein bar focuses on the textures of grains and nuts visible on the surface. Soft, diffused light highlights the intricate details and evokes a sense of quality and nutrition. Camera gently pans across the surface to emphasize the craftsmanship. Theme: Artisan Breakfast. Colour palette: Earthy neutrals with highlights.\",\"camera_angle\":\"Close-up\",\"camera_motion\":\"Slow Pan\"},{\"shot_number\":3,\"title\":\"Nutrient Layer\",\"shot_type\":\"Reveal Shot\",\"shot_description\":\"Layers of oats, nuts, and dried fruits are pulled apart in slow motion, revealing each layer meticulously. Each component is shown with detailed focus, glistening in warm light, symbolizing its freshness and nutritional value. Theme: Nutrient Packed Goodness. Colour palette: Rich browns and vibrant natural hues.\",\"camera_angle\":\"Extreme close-up\",\"camera_motion\":\"Slow Pull-out\"},{\"shot_number\":4,\"title\":\"Energy Boost\",\"shot_type\":\"Feature Shot\",\"shot_description\":\"The bar is broken in half, releasing small particles of nuts and grains in mid-air, captured at a high frame rate. This shot highlights its crisp satisfaction and crunchiness, suggesting immediate energy intake. Theme: Quick Nutrition. Colour palette: Bright and energetic golds and browns.\",\"camera_angle\":\"Mid shot\",\"camera_motion\":\"Fast Motion\"},{\"shot_number\":5,\"title\":\"Simplicity Focus\",\"shot_type\":\"Simple Shot\",\"shot_description\":\"The bar is positioned alone on a white, minimalist surface, with subtle shadows creating depth. The lighting is clean and even, highlighting the bar's natural beauty without distractions. Theme: Pure Nutrition. Colour palette: Clean whites and natural bar tones.\",\"camera_angle\":\"Top down\",\"camera_motion\":\"Static\"}]"
    }
  ];

  // Function to create threads from Excel data
  const createThreadsFromExcelData = () => {
    return excelConversations.map((conv, index) => {
      const threadId = `excel-${index + 1}`;

      // Parse the JSON response to extract shot descriptions
      let shotDescriptions: any[] = [];
      try {
        shotDescriptions = JSON.parse(conv.response);
      } catch (e) {
        console.error('Error parsing shot descriptions:', e);
      }

      // Create user message
      const userMessage: Message = {
        id: `${threadId}-user`,
        text: conv.prompt,
        isUser: true,
        uploadedImages: [],
        timestamp: new Date(Date.now() - (excelConversations.length - index) * 60000)
      };

      // Create AI response with shot descriptions
      const aiMessage: Message = {
        id: `${threadId}-ai`,
        text: shotDescriptions.map((shot, idx) =>
          `**Shot ${shot.shot_number}: ${shot.title}**\n` +
          `Type: ${shot.shot_type}\n` +
          `Description: ${shot.shot_description}\n` +
          `Camera: ${shot.camera_angle} | Motion: ${shot.camera_motion}`
        ).join('\n\n'),
        isUser: false,
        uploadedImages: [],
        timestamp: new Date(Date.now() - (excelConversations.length - index) * 60000 + 5000)
      };

      // Generate placeholder images for each shot
      const outputImages = shotDescriptions.map((_, imgIndex) =>
        `https://images.unsplash.com/photo-${1500000000000 + threadId.charCodeAt(0) * 1000 + imgIndex}?w=300&h=200&fit=crop&auto=format`
      );

      return {
        id: threadId,
        title: conv.prompt.slice(0, 40) + (conv.prompt.length > 40 ? "..." : ""),
        messages: [userMessage, aiMessage],
        outputImages: outputImages,
        createdAt: new Date(Date.now() - (excelConversations.length - index) * 60000),
        isFrozen: true
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
      ...excelThreads
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
              {thread.id.startsWith('excel-') && (
                <div className="text-xs text-blue-600 mt-1">📊 Imported</div>
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
                        {message.text.includes('**Shot ') ? (
                          // Format shot descriptions with better styling
                          <div className="space-y-4">
                            {message.text.split('\n\n').map((shot, index) => (
                              <div key={index} className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50/50 rounded-r">
                                <div dangerouslySetInnerHTML={{
                                  __html: shot
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700">$1</strong>')
                                    .replace(/Type: (.*?)(?=\n|$)/g, '<div class="text-sm text-gray-600 mt-1"><span class="font-medium">Type:</span> $1</div>')
                                    .replace(/Camera: (.*?)(?=\n|$)/g, '<div class="text-sm text-gray-600"><span class="font-medium">Camera:</span> $1</div>')
                                    .replace(/Description: (.*?)(?=\n|$)/g, '<div class="text-gray-700 mt-1">$1</div>')
                                    .replace(/\n/g, '<br>')
                                }} />
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
                  placeholder={placeholderText || "Start typing your prompt here..."}
                  className="w-full resize-none border-0 p-0 focus:outline-none focus:ring-0 text-sm min-h-[20px] max-h-48 bg-transparent text-gray-600 placeholder-gray-400"
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
