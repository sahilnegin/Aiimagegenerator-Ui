
// // "use client";
// // import { useState, useRef, useEffect } from "react";
// // import Papa from "papaparse";
// // import {
// //   MessageSquare,
// //   Send,
// //   Paperclip,
// //   ChevronLeft,
// //   ChevronRight,
// //   X,
// // } from "lucide-react";

// // // Utility function to join class names
// // function cn(...args: any[]) {
// //   return args.filter(Boolean).join(" ");
// // }

// // interface Message {
// //   id: string;
// //   text: string;
// //   isUser: boolean;
// //   uploadedImages?: string[];
// //   timestamp: Date;
// // }

// // interface Thread {
// //   id: string;
// //   title: string;
// //   messages: Message[];
// //   outputImages: string[];
// //   createdAt: Date;
// //   isFrozen: boolean;
// // }

// // const prompts = [
// //   "Generate a modern smart touch panel UI design.",
// //   "Show me a luxury home automation setup.",
// //   "Create images of futuristic urban living spaces.",
// //   "Design a minimalist touch switch interface.",
// //   "Visualize smart home convenience features.",
// //   "Illustrate a smart panel replacing traditional switches.",
// //   "Concept art for a high-tech smart home control panel.",
// //   "Render a user-friendly smart touch panel layout.",
// // ];

// // export default function Page() {
// //   const [placeholderText, setPlaceholderText] = useState("");
// //   const [promptIndex, setPromptIndex] = useState(0);
// //   const [charIndex, setCharIndex] = useState(0);

// //   const [selectedThread, setSelectedThread] = useState("excel-new-1");
// //   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
// //   const [inputText, setInputText] = useState("");
// //   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [isLoadingSheetData, setIsLoadingSheetData] = useState(true);
// //   const [sheetConversations, setSheetConversations] = useState<any[]>([]);

// //   // Google Sheets configuration
// //   const GOOGLE_SHEET_ID = "133ZHExWO_6Jfdmx_VRntJG_XJuy7wTXgepPs78yRuyg";
// //   const SHEET_GID = "0";

// //   // Function to fetch data from Google Sheets
// //   const fetchGoogleSheetData = async () => {
// //     try {
// //       setIsLoadingSheetData(true);
// //       const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${SHEET_GID}&single=true&output=csv`;

// //       const response = await fetch(csvUrl, {
// //         method: "GET",
// //         headers: {
// //           Accept: "text/csv",
// //         },
// //       });

// //       if (!response.ok) {
// //         throw new Error(
// //           `Failed to fetch sheet data: ${response.status} ${response.statusText}`,
// //         );
// //       }

// //       const csvText = await response.text();
// //       const { data: rows } = Papa.parse(csvText, { skipEmptyLines: true });

// //       // Skip header row and parse data
// //       const conversations = [];
// //       for (let i = 1; i < rows.length; i++) {
// //         const row = rows[i];
// //         if (!row || row.length < 3) continue;
// //         const prompt = row[0]?.trim() || "";
// //         const agentOutput = row[1]?.trim() || "";
// //         const imageColumn = row[2]?.trim() || "";

// //         // Parse image links from the Image Link column (should be JSON array)
// //         let imageLinks: string[] = [];
// //         try {
// //           const parsed = JSON.parse(imageColumn);
// //           if (Array.isArray(parsed)) {
// //             imageLinks = parsed.filter((link) => typeof link === "string");
// //           }
// //         } catch {
// //           // fallback: try comma-separation or single link
// //           if (imageColumn.includes(",")) {
// //             imageLinks = imageColumn.split(",").map((x) => x.trim());
// //           } else if (imageColumn.includes("http")) {
// //             imageLinks = [imageColumn];
// //           }
// //         }

// //         // Only add if we have a valid prompt
// //         if (
// //           prompt &&
// //           prompt.length > 0 &&
// //           !prompt.includes("[{") &&
// //           !prompt.includes("shot_number")
// //         ) {
// //           conversations.push({
// //             prompt,
// //             response: agentOutput,
// //             imageLinks,
// //           });
// //         }
// //       }

// //       setSheetConversations(conversations);
// //     } catch (error) {
// //       setSheetConversations([]);
// //     } finally {
// //       setIsLoadingSheetData(false);
// //     }
// //   };

// //   // Load data on component mount
// //   useEffect(() => {
// //     fetchGoogleSheetData();
// //     // eslint-disable-next-line
// //   }, []);

// //   // Refetch on focus/visibility
// //   useEffect(() => {
// //     const handleFocus = () => fetchGoogleSheetData();
// //     window.addEventListener("focus", handleFocus);
// //     return () => window.removeEventListener("focus", handleFocus);
// //   }, []);
// //   useEffect(() => {
// //     const handleVisibilityChange = () => {
// //       if (!document.hidden) fetchGoogleSheetData();
// //     };
// //     document.addEventListener("visibilitychange", handleVisibilityChange);
// //     return () =>
// //       document.removeEventListener("visibilitychange", handleVisibilityChange);
// //   }, []);

// //   // Google Drive link converter
// //   const convertGoogleDriveLink = (driveLink: string) => {
// //     if (!driveLink || typeof driveLink !== "string") return driveLink;
// //     if (driveLink.includes("drive.google.com")) {
// //       let fileId = null;
// //       const patterns = [
// //         /\/file\/d\/([a-zA-Z0-9-_]+)/,
// //         /\/d\/([a-zA-Z0-9-_]+)/,
// //         /[?&]id=([a-zA-Z0-9-_]+)/,
// //         /\/([a-zA-Z0-9-_]{25,})(?:\/|$)/,
// //       ];
// //       for (const pattern of patterns) {
// //         const match = driveLink.match(pattern);
// //         if (match && match[1]) {
// //           fileId = match[1];
// //           break;
// //         }
// //       }
// //       if (fileId) {
// //         return `https://lh3.googleusercontent.com/d/${fileId}`;
// //       }
// //     }
// //     if (
// //       driveLink.includes("googleusercontent.com") ||
// //       driveLink.includes("uc?export=view") ||
// //       driveLink.match(/\.(jpg|jpeg|png|gif|webp)$/i)
// //     ) {
// //       return driveLink;
// //     }
// //     return driveLink;
// //   };

// //   // Fallback images for when Google Drive links fail
// //   const getFallbackImage = (index: number, prompt: string) => {
// //     const fallbackImages = {
// //       protein: [
// //         "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop",
// //         "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop",
// //         "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop",
// //       ],
// //       glass: [
// //         "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
// //         "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=300&h=200&fit=crop",
// //       ],
// //       airpod: [
// //         "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop",
// //         "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=300&h=200&fit=crop",
// //       ],
// //       oneplus: [
// //         "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop",
// //         "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop",
// //       ],
// //     };

// //     if (prompt.includes("protein"))
// //       return fallbackImages.protein[index % fallbackImages.protein.length];
// //     if (prompt.includes("glass"))
// //       return fallbackImages.glass[index % fallbackImages.glass.length];
// //     if (prompt.includes("airpod"))
// //       return fallbackImages.airpod[index % fallbackImages.airpod.length];
// //     if (prompt.includes("oneplus"))
// //       return fallbackImages.oneplus[index % fallbackImages.oneplus.length];

// //     return `https://images.unsplash.com/photo-${1500000000000 + index}?w=300&h=200&fit=crop`;
// //   };

// //   // Function to create threads from Google Sheets data
// //   const createThreadsFromSheetData = () => {
// //     return sheetConversations.map((conv, index) => {
// //       const threadId = `sheet-${index + 1}`;
// //       const userMessage: Message = {
// //         id: `${threadId}-user`,
// //         text: conv.prompt,
// //         isUser: true,
// //         uploadedImages: [],
// //         timestamp: new Date(
// //           Date.now() - (sheetConversations.length - index) * 60000,
// //         ),
// //       };
// //       const outputImages = conv.imageLinks
// //         ? conv.imageLinks.map(convertGoogleDriveLink)
// //         : [];
// //       return {
// //         id: threadId,
// //         title: conv.prompt.slice(0, 80),
// //         messages: [userMessage],
// //         outputImages: outputImages,
// //         createdAt: new Date(
// //           Date.now() - (sheetConversations.length - index) * 60000,
// //         ),
// //         isFrozen: true,
// //       };
// //     });
// //   };

// //   const [threads, setThreads] = useState<Thread[]>([
// //     {
// //       id: "excel-new-1",
// //       title: "New Chat",
// //       createdAt: new Date(),
// //       messages: [],
// //       outputImages: [],
// //       isFrozen: false,
// //     },
// //   ]);

// //   // Update threads when sheet data loads
// //   useEffect(() => {
// //     if (!isLoadingSheetData && sheetConversations.length > 0) {
// //       const sheetThreads = createThreadsFromSheetData();
// //       setThreads((prevThreads) => [
// //         prevThreads[0],
// //         ...sheetThreads,
// //       ]);
// //     }
// //     // eslint-disable-next-line
// //   }, [isLoadingSheetData, sheetConversations]);

// //   const textareaRef = useRef<HTMLTextAreaElement>(null);
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);
// //   const galleryRef = useRef<HTMLDivElement>(null);

// //   const currentThread = threads.find((t) => t.id === selectedThread);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [currentThread?.messages]);

// //   const adjustTextareaHeight = () => {
// //     const textarea = textareaRef.current;
// //     if (textarea) {
// //       textarea.style.height = "auto";
// //       textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
// //     }
// //   };

// //   useEffect(() => {
// //     adjustTextareaHeight();
// //   }, [inputText]);

// //   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
// //     setInputText(e.target.value);
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
// //     const items = e.clipboardData?.items;
// //     if (items) {
// //       for (let i = 0; i < items.length; i++) {
// //         const item = items[i];
// //         if (item.type.indexOf("image") !== -1) {
// //           const file = item.getAsFile();
// //           if (file) {
// //             const reader = new FileReader();
// //             reader.onload = (e) => {
// //               if (e.target?.result) {
// //                 setUploadedImages((prev) => [
// //                   ...prev,
// //                   e.target.result as string,
// //                 ]);
// //               }
// //             };
// //             reader.readAsDataURL(file);
// //           }
// //         }
// //       }
// //     }
// //   };

// //   const handleSendMessage = async () => {
// //     if (!inputText.trim() && uploadedImages.length === 0) return;
// //     if (isGenerating || currentThread?.isFrozen) return;

// //     setIsGenerating(true);

// //     const newMessage: Message = {
// //       id: Date.now().toString(),
// //       text: inputText,
// //       isUser: true,
// //       uploadedImages: [...uploadedImages],
// //       timestamp: new Date(),
// //     };

// //     setThreads((prevThreads) =>
// //       prevThreads.map((thread) =>
// //         thread.id === selectedThread
// //           ? {
// //               ...thread,
// //               messages: [...thread.messages, newMessage],
// //               title:
// //                 thread.messages.length === 0
// //                   ? inputText.slice(0, 80)
// //                   : thread.title,
// //               isFrozen: true,
// //             }
// //           : thread,
// //       ),
// //     );

// //     // Store the current input text and uploaded images before clearing
// //     const currentInputText = inputText;
// //     const currentUploadedImages = [...uploadedImages];

// //     setInputText("");
// //     setUploadedImages([]);
// //     if (textareaRef.current) {
// //       textareaRef.current.style.height = "auto";
// //     }

// //     try {
// //       // Submit to n8n webhook
// //       const formData = new FormData();
// //       formData.append("chatInput", currentInputText);

// //       // Convert first uploaded image to blob and append to form data
// //       if (currentUploadedImages.length > 0) {
// //         // Convert base64 to blob
// //         const base64Data = currentUploadedImages[0];
// //         const response = await fetch(base64Data);
// //         const blob = await response.blob();
// //         formData.append("data", blob, "uploaded-image.jpeg");
// //       }

// //       const webhookResponse = await fetch(
// //         "https://vidgy.app.n8n.cloud/webhook/84342f4e-4ba8-4a87-939f-2c2880571a5e",
// //         {
// //           method: "POST",
// //           body: formData,
// //         },
// //       );

// //       if (webhookResponse.ok) {
// //         const result = await webhookResponse.json();
// //         // Parse the response and extract generated images
// //         let generatedImages: string[] = [];

// //         if (result && typeof result === "object") {
// //           if (result.images && Array.isArray(result.images)) {
// //             generatedImages = result.images;
// //           } else if (result.imageUrls && Array.isArray(result.imageUrls)) {
// //             generatedImages = result.imageUrls;
// //           } else if (result.data && Array.isArray(result.data)) {
// //             generatedImages = result.data;
// //           } else if (result.output && Array.isArray(result.output)) {
// //             generatedImages = result.output;
// //           } else if (Array.isArray(result)) {
// //             generatedImages = result;
// //           } else {
// //             Object.keys(result).forEach((key) => {
// //               if (Array.isArray(result[key]) && result[key].length > 0) {
// //                 if (
// //                   typeof result[key][0] === "string" &&
// //                   result[key][0].includes("http")
// //                 ) {
// //                   generatedImages = result[key];
// //                 }
// //               }
// //             });
// //           }
// //         }

// //         setThreads((prevThreads) =>
// //           prevThreads.map((thread) =>
// //             thread.id === selectedThread
// //               ? {
// //                   ...thread,
// //                   outputImages: generatedImages,
// //                 }
// //               : thread,
// //           ),
// //         );

// //         setIsGenerating(false);
// //       } else {
// //         setThreads((prevThreads) =>
// //           prevThreads.map((thread) =>
// //             thread.id === selectedThread
// //               ? {
// //                   ...thread,
// //                   outputImages: [],
// //                 }
// //               : thread,
// //           ),
// //         );
// //         setIsGenerating(false);
// //       }
// //     } catch (error) {
// //       setThreads((prevThreads) =>
// //         prevThreads.map((thread) =>
// //           thread.id === selectedThread
// //             ? {
// //                 ...thread,
// //                 outputImages: [],
// //               }
// //             : thread,
// //         ),
// //       );

// //       setIsGenerating(false);
// //     }
// //   };

// //   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = e.target.files;
// //     if (files) {
// //       Array.from(files).forEach((file) => {
// //         const reader = new FileReader();
// //         reader.onload = (e) => {
// //           if (e.target?.result) {
// //             setUploadedImages((prev) => [...prev, e.target.result as string]);
// //           }
// //         };
// //         reader.readAsDataURL(file);
// //       });
// //     }
// //   };

// //   const removeUploadedImage = (index: number) => {
// //     setUploadedImages((prev) => prev.filter((_, i) => i !== index));
// //   };

// //   const createNewChat = () => {
// //     const newThread: Thread = {
// //       id: Date.now().toString(),
// //       title: "New Chat",
// //       messages: [],
// //       outputImages: [],
// //       createdAt: new Date(),
// //       isFrozen: false,
// //     };
// //     setThreads((prev) => [newThread, ...prev]);
// //     setSelectedThread(newThread.id);
// //     setSelectedImageIndex(null);
// //     setIsGenerating(false);
// //   };

// //   const scrollGallery = (direction: "left" | "right") => {
// //     if (galleryRef.current) {
// //       const scrollAmount = 320;
// //       galleryRef.current.scrollBy({
// //         left: direction === "left" ? -scrollAmount : scrollAmount,
// //         behavior: "smooth",
// //       });
// //     }
// //   };
// // ...other imports...
// import React, { useState, useEffect, useRef } from "react";
// // ...your other imports (icons, cn, Papa, etc.)...

// export default function Page() {
//   const [placeholderText, setPlaceholderText] = useState("");
//   const [promptIndex, setPromptIndex] = useState(0);
//   const [charIndex, setCharIndex] = useState(0);

//   const [selectedThread, setSelectedThread] = useState("excel-new-1");
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
//   const [inputText, setInputText] = useState("");
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isLoadingSheetData, setIsLoadingSheetData] = useState(true);
//   const [sheetConversations, setSheetConversations] = useState<any[]>([]);

//   // Google Sheets configuration
//   const GOOGLE_SHEET_ID = "133ZHExWO_6Jfdmx_VRntJG_XJuy7wTXgepPs78yRuyg";
//   const SHEET_GID = "0";

//   // Function to fetch data from Google Sheets
//   const fetchGoogleSheetData = async () => {
//     try {
//       setIsLoadingSheetData(true);
//       const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${SHEET_GID}&single=true&output=csv`;

//       const response = await fetch(csvUrl, {
//         method: "GET",
//         headers: {
//           Accept: "text/csv",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch sheet data: ${response.status} ${response.statusText}`,
//         );
//       }

//       const csvText = await response.text();
//       const { data: rows } = Papa.parse(csvText, { skipEmptyLines: true });

//       // Skip header row and parse data
//       const conversations = [];
//       for (let i = 1; i < rows.length; i++) {
//         const row = rows[i];
//         if (!row || row.length < 3) continue;
//         const prompt = row[0]?.trim() || "";
//         const agentOutput = row[1]?.trim() || "";
//         const imageColumn = row[2]?.trim() || "";

//         // Parse image links from the Image Link column (should be JSON array)
//         let imageLinks: string[] = [];
//         try {
//           const parsed = JSON.parse(imageColumn);
//           if (Array.isArray(parsed)) {
//             imageLinks = parsed.filter((link) => typeof link === "string");
//           }
//         } catch {
//           // fallback: try comma-separation or single link
//           if (imageColumn.includes(",")) {
//             imageLinks = imageColumn.split(",").map((x) => x.trim());
//           } else if (imageColumn.includes("http")) {
//             imageLinks = [imageColumn];
//           }
//         }

//         // Only add if we have a valid prompt
//         if (
//           prompt &&
//           prompt.length > 0 &&
//           !prompt.includes("[{") &&
//           !prompt.includes("shot_number")
//         ) {
//           conversations.push({
//             prompt,
//             response: agentOutput,
//             imageLinks,
//           });
//         }
//       }

//       setSheetConversations(conversations);
//     } catch (error) {
//       setSheetConversations([]);
//     } finally {
//       setIsLoadingSheetData(false);
//     }
//   };

//   // Load data on component mount
//   useEffect(() => {
//     fetchGoogleSheetData();
//     // eslint-disable-next-line
//   }, []);

//   // Refetch on focus/visibility
//   useEffect(() => {
//     const handleFocus = () => fetchGoogleSheetData();
//     window.addEventListener("focus", handleFocus);
//     return () => window.removeEventListener("focus", handleFocus);
//   }, []);
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden) fetchGoogleSheetData();
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   // Google Drive link converter
//   const convertGoogleDriveLink = (driveLink: string) => {
//     if (!driveLink || typeof driveLink !== "string") return driveLink;
//     if (driveLink.includes("drive.google.com")) {
//       let fileId = null;
//       const patterns = [
//         /\/file\/d\/([a-zA-Z0-9-_]+)/,
//         /\/d\/([a-zA-Z0-9-_]+)/,
//         /[?&]id=([a-zA-Z0-9-_]+)/,
//         /\/([a-zA-Z0-9-_]{25,})(?:\/|$)/,
//       ];
//       for (const pattern of patterns) {
//         const match = driveLink.match(pattern);
//         if (match && match[1]) {
//           fileId = match[1];
//           break;
//         }
//       }
//       if (fileId) {
//         return `https://lh3.googleusercontent.com/d/${fileId}`;
//       }
//     }
//     if (
//       driveLink.includes("googleusercontent.com") ||
//       driveLink.includes("uc?export=view") ||
//       driveLink.match(/\.(jpg|jpeg|png|gif|webp)$/i)
//     ) {
//       return driveLink;
//     }
//     return driveLink;
//   };

//   // Fallback images for when Google Drive links fail
//   const getFallbackImage = (index: number, prompt: string) => {
//     const fallbackImages = {
//       protein: [
//         "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop",
//         "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop",
//         "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop",
//       ],
//       glass: [
//         "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
//         "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=300&h=200&fit=crop",
//       ],
//       airpod: [
//         "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop",
//         "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=300&h=200&fit=crop",
//       ],
//       oneplus: [
//         "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop",
//         "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop",
//       ],
//     };

//     if (prompt.includes("protein"))
//       return fallbackImages.protein[index % fallbackImages.protein.length];
//     if (prompt.includes("glass"))
//       return fallbackImages.glass[index % fallbackImages.glass.length];
//     if (prompt.includes("airpod"))
//       return fallbackImages.airpod[index % fallbackImages.airpod.length];
//     if (prompt.includes("oneplus"))
//       return fallbackImages.oneplus[index % fallbackImages.oneplus.length];

//     return `https://images.unsplash.com/photo-${1500000000000 + index}?w=300&h=200&fit=crop`;
//   };

//   // Function to create threads from Google Sheets data
//   const createThreadsFromSheetData = () => {
//     return sheetConversations.map((conv, index) => {
//       const threadId = `sheet-${index + 1}`;
//       const userMessage = {
//         id: `${threadId}-user`,
//         text: conv.prompt,
//         isUser: true,
//         uploadedImages: [],
//         timestamp: new Date(
//           Date.now() - (sheetConversations.length - index) * 60000,
//         ),
//       };
//       const outputImages = conv.imageLinks
//         ? conv.imageLinks.map(convertGoogleDriveLink)
//         : [];
//       return {
//         id: threadId,
//         title: conv.prompt.slice(0, 80),
//         messages: [userMessage],
//         outputImages: outputImages,
//         createdAt: new Date(
//           Date.now() - (sheetConversations.length - index) * 60000,
//         ),
//         isFrozen: true,
//       };
//     });
//   };

//   const [threads, setThreads] = useState([
//     {
//       id: "excel-new-1",
//       title: "New Chat",
//       createdAt: new Date(),
//       messages: [],
//       outputImages: [],
//       isFrozen: false,
//     },
//   ]);

//   // Update threads when sheet data loads
//   useEffect(() => {
//     if (!isLoadingSheetData && sheetConversations.length > 0) {
//       const sheetThreads = createThreadsFromSheetData();
//       setThreads((prevThreads) => [
//         prevThreads[0],
//         ...sheetThreads,
//       ]);
//     }
//     // eslint-disable-next-line
//   }, [isLoadingSheetData, sheetConversations]);

//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const galleryRef = useRef(null);

//   const currentThread = threads.find((t) => t.id === selectedThread);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [currentThread?.messages]);

//   const adjustTextareaHeight = () => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
//     }
//   };

//   useEffect(() => {
//     adjustTextareaHeight();
//   }, [inputText]);

//   const handleInputChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handlePaste = (e) => {
//     const items = e.clipboardData?.items;
//     if (items) {
//       for (let i = 0; i < items.length; i++) {
//         const item = items[i];
//         if (item.type.indexOf("image") !== -1) {
//           const file = item.getAsFile();
//           if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//               if (e.target?.result) {
//                 setUploadedImages((prev) => [
//                   ...prev,
//                   e.target.result,
//                 ]);
//               }
//             };
//             reader.readAsDataURL(file);
//           }
//         }
//       }
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim() && uploadedImages.length === 0) return;
//     if (isGenerating || currentThread?.isFrozen) return;

//     setIsGenerating(true);

//     const newMessage = {
//       id: Date.now().toString(),
//       text: inputText,
//       isUser: true,
//       uploadedImages: [...uploadedImages],
//       timestamp: new Date(),
//     };

//     setThreads((prevThreads) =>
//       prevThreads.map((thread) =>
//         thread.id === selectedThread
//           ? {
//               ...thread,
//               messages: [...thread.messages, newMessage],
//               title:
//                 thread.messages.length === 0
//                   ? inputText.slice(0, 80)
//                   : thread.title,
//               isFrozen: true,
//             }
//           : thread,
//       ),
//     );

//     // Store the current input text and uploaded images before clearing
//     const currentInputText = inputText;
//     const currentUploadedImages = [...uploadedImages];

//     setInputText("");
//     setUploadedImages([]);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//     }

//     try {
//       // Submit to n8n webhook
//       const formData = new FormData();
//       formData.append("chatInput", currentInputText);

//       // Convert first uploaded image to blob and append to form data
//       if (currentUploadedImages.length > 0) {
//         // Convert base64 to blob
//         const base64Data = currentUploadedImages[0];
//         const response = await fetch(base64Data);
//         const blob = await response.blob();
//         formData.append("data", blob, "uploaded-image.jpeg");
//       }

//       const webhookResponse = await fetch(
//         "https://vidgy.app.n8n.cloud/webhook/84342f4e-4ba8-4a87-939f-2c2880571a5e",
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       if (webhookResponse.ok) {
//         const result = await webhookResponse.json();
//         // Parse the response and extract generated images
//         let generatedImages = [];

//         if (result && typeof result === "object") {
//           if (result.images && Array.isArray(result.images)) {
//             generatedImages = result.images;
//           } else if (result.imageUrls && Array.isArray(result.imageUrls)) {
//             generatedImages = result.imageUrls;
//           } else if (result.data && Array.isArray(result.data)) {
//             generatedImages = result.data;
//           } else if (result.output && Array.isArray(result.output)) {
//             generatedImages = result.output;
//           } else if (Array.isArray(result)) {
//             generatedImages = result;
//           } else {
//             Object.keys(result).forEach((key) => {
//               if (Array.isArray(result[key]) && result[key].length > 0) {
//                 if (
//                   typeof result[key][0] === "string" &&
//                   result[key][0].includes("http")
//                 ) {
//                   generatedImages = result[key];
//                 }
//               }
//             });
//           }
//         }

//         // PREPEND new images so they go to the top
//         setThreads((prevThreads) =>
//           prevThreads.map((thread) =>
//             thread.id === selectedThread
//               ? {
//                   ...thread,
//                   outputImages: [...generatedImages, ...(thread.outputImages || [])],
//                 }
//               : thread,
//           ),
//         );

//         setIsGenerating(false);
//       } else {
//         setThreads((prevThreads) =>
//           prevThreads.map((thread) =>
//             thread.id === selectedThread
//               ? {
//                   ...thread,
//                   outputImages: [],
//                 }
//               : thread,
//           ),
//         );
//         setIsGenerating(false);
//       }
//     } catch (error) {
//       setThreads((prevThreads) =>
//         prevThreads.map((thread) =>
//           thread.id === selectedThread
//             ? {
//                 ...thread,
//                 outputImages: [],
//               }
//             : thread,
//         ),
//       );

//       setIsGenerating(false);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const files = e.target.files;
//     if (files) {
//       Array.from(files).forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           if (e.target?.result) {
//             setUploadedImages((prev) => [...prev, e.target.result]);
//           }
//         };
//         reader.readAsDataURL(file);
//       });
//     }
//   };

//   const removeUploadedImage = (index) => {
//     setUploadedImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const createNewChat = () => {
//     const newThread = {
//       id: Date.now().toString(),
//       title: "New Chat",
//       messages: [],
//       outputImages: [],
//       createdAt: new Date(),
//       isFrozen: false,
//     };
//     setThreads((prev) => [newThread, ...prev]);
//     setSelectedThread(newThread.id);
//     setSelectedImageIndex(null);
//     setIsGenerating(false);
//   };

//   const scrollGallery = (direction) => {
//     if (galleryRef.current) {
//       const scrollAmount = 320;
//       galleryRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };
//   useEffect(() => {
//     if (isGenerating) return;

//     const currentPrompt = prompts[promptIndex];
//     if (charIndex < currentPrompt.length) {
//       const timeout = setTimeout(() => {
//         setPlaceholderText((prev) => prev + currentPrompt.charAt(charIndex));
//         setCharIndex(charIndex + 1);
//       }, 100);

//       return () => clearTimeout(timeout);
//     } else {
//       const timeout = setTimeout(() => {
//         setPlaceholderText("");
//         setCharIndex(0);
//         setPromptIndex((promptIndex + 1) % prompts.length);
//       }, 2000);

//       return () => clearTimeout(timeout);
//     }
//     // eslint-disable-next-line
//   }, [charIndex, promptIndex, isGenerating]);

//   return (
//     <div className="h-screen bg-gray-100 flex font-sans">
//       {/* Sidebar */}
//       <div className="w-60 bg-gray-200 flex flex-col z-40">
//         {/* Chat Icon */}
//         <div className="p-4">
//           <div className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center">
//             <MessageSquare size={16} className="text-black" />
//           </div>
//         </div>

//         {/* New Chat Button */}
//         <div className="px-4 pb-2">
//           <button
//             onClick={createNewChat}
//             className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
//           >
//             New Chat
//           </button>
//         </div>

//         {/* Thread List */}
//         <div className="flex-1 overflow-y-auto px-4">
//           {threads.map((thread) => (
//             <div
//               key={thread.id}
//               onClick={() => {
//                 setSelectedThread(thread.id);
//                 setSelectedImageIndex(null);
//               }}
//               className={cn(
//                 "px-3 py-3 text-sm font-medium cursor-pointer transition-colors rounded mb-1 group",
//                 selectedThread === thread.id
//                   ? "bg-white text-black font-semibold"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
//               )}
//               title={thread.messages[0]?.text || "New Chat"}
//             >
//               <div className="line-clamp-2 leading-tight">{thread.title}</div>
//             </div>
//           ))}

//           {/* Loading state for Google Sheets data */}
//           {isLoadingSheetData && (
//             <div className="px-3 py-4 text-center">
//               <div className="text-sm text-gray-500 mb-2">
//                 Loading from Google Sheets...
//               </div>
//               <div className="flex justify-center">
//                 <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
//               </div>
//             </div>
//           )}

//           {/* Status section */}
//           <div className="px-3 py-2 border-t border-gray-300 mt-2">
//             <div className="text-xs text-gray-500 text-center">
//               {sheetConversations.length} conversations loaded
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-white flex flex-col">

//         {/* Image Gallery at Top */}
//         <div className="h-32 bg-gray-50 border-b border-gray-200 p-4">
//           {currentThread?.outputImages &&
//           currentThread.outputImages.length > 0 ? (
//             <div className="relative h-full flex justify-center">
//               {currentThread.outputImages.length > 6 && (
//                 <>
//                   <button
//                     className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded border border-gray-300 flex items-center justify-center"
//                     onClick={() => scrollGallery("left")}
//                   >
//                     <ChevronLeft size={14} />
//                   </button>
//                   <button
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded border border-gray-300 flex items-center justify-center"
//                     onClick={() => scrollGallery("right")}
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                 </>
//               )}

//               <div
//                 ref={galleryRef}
//                 className="flex gap-3 overflow-x-auto scrollbar-hide h-full justify-center"
//               >
//                 {currentThread.outputImages.map((image, index) => (
//                   <div
//                     key={index}
//                     className={cn(
//                       "flex-shrink-0 cursor-pointer transition-all duration-200 h-full border-2 rounded",
//                       selectedImageIndex === index
//                         ? "border-gray-400"
//                         : "border-transparent hover:border-gray-300",
//                     )}
//                     onClick={() =>
//                       setSelectedImageIndex(
//                         selectedImageIndex === index ? null : index,
//                       )
//                     }
//                   >
//                     <img
//                       src={image}
//                       alt={`Generated image ${index + 1}`}
//                       className="h-full w-24 object-cover rounded bg-gray-200"
//                       onLoad={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.style.opacity = "1";
//                       }}
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.style.opacity = "0.5";
//                         target.title = `Failed to load: ${image}`;
//                         if (
//                           target.src !==
//                           getFallbackImage(index, currentThread?.title || "")
//                         ) {
//                           target.src = getFallbackImage(
//                             index,
//                             currentThread?.title || "",
//                           );
//                         }
//                       }}
//                       style={{ opacity: 0.7, transition: "opacity 0.3s" }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="flex gap-3 h-full justify-center">
//               {[...Array(8)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="flex-shrink-0 h-full w-24 bg-gray-200 rounded"
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Selected Image Large View */}
//         {selectedImageIndex !== null &&
//           currentThread?.outputImages[selectedImageIndex] && (
//             <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
//               <div className="relative max-w-4xl max-h-full">
//                 <img
//                   src={currentThread.outputImages[selectedImageIndex]}
//                   alt="Selected image"
//                   className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     if (
//                       target.src !==
//                       getFallbackImage(
//                         selectedImageIndex,
//                         currentThread?.title || "",
//                       )
//                     ) {
//                       target.src = getFallbackImage(
//                         selectedImageIndex,
//                         currentThread?.title || "",
//                       );
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//         {/* Chat Messages (when no image selected) */}
//         {selectedImageIndex === null && (
//           <div className="flex-1 overflow-y-auto p-6">
//             <div className="max-w-4xl mx-auto space-y-4">
//               {currentThread?.messages.map((message) => (
//                 <div key={message.id} className="flex">
//                   <div className="flex-1">
//                     <div
//                       className={cn(
//                         "p-4 rounded-lg max-w-2xl",
//                         message.isUser
//                           ? "bg-blue-500 text-white ml-auto"
//                           : "bg-gray-100 text-gray-900",
//                       )}
//                     >
//                       <div className="whitespace-pre-wrap text-base leading-relaxed font-normal">
//                         {message.text.includes("**Shot ") ? (
//                           // Format shot descriptions with better styling
//                           <div className="space-y-4">
//                             {message.text.split("\n\n").map((shot, index) => (
//                               <div
//                                 key={index}
//                                 className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50/50 rounded-r"
//                               >
//                                 <div
//                                   dangerouslySetInnerHTML={{
//                                     __html: shot
//                                       .replace(
//                                         /\*\*(.*?)\*\*/g,
//                                         '<strong class="text-blue-700">$1</strong>',
//                                       )
//                                       .replace(
//                                         /Type: (.*?)(?=\n|$)/g,
//                                         '<div class="text-sm text-gray-600 mt-1"><span class="font-medium">Type:</span> $1</div>',
//                                       )
//                                       .replace(
//                                         /Camera: (.*?)(?=\n|$)/g,
//                                         '<div class="text-sm text-gray-600"><span class="font-medium">Camera:</span> $1</div>',
//                                       )
//                                       .replace(
//                                         /Description: (.*?)(?=\n|$)/g,
//                                         '<div class="text-gray-700 mt-1">$1</div>',
//                                       )
//                                       .replace(/\n/g, "<br>"),
//                                   }}
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           message.text
//                         )}
//                       </div>

//                       {message.uploadedImages &&
//                         message.uploadedImages.length > 0 && (
//                           <div className="mt-3 grid grid-cols-2 gap-2">
//                             {message.uploadedImages.map((image, index) => (
//                               <img
//                                 key={index}
//                                 src={image}
//                                 alt={`Uploaded image ${index + 1}`}
//                                 className="w-full h-32 object-cover rounded border-2 border-white/20"
//                               />
//                             ))}
//                           </div>
//                         )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {isGenerating && (
//                 <div className="flex">
//                   <div className="flex-1">
//                     <div className="bg-gray-100 text-gray-900 p-4 rounded-lg max-w-2xl">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
//                         <span className="text-sm text-gray-600 font-medium">
//                           Generating images...
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           </div>
//         )}

//         {/* Input Area at Bottom */}
//         <div className="border-t border-gray-200 p-6">
//           {uploadedImages.length > 0 && (
//             <div className="mb-4 flex gap-2 flex-wrap max-w-4xl mx-auto">
//               {uploadedImages.map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={image}
//                     alt={`Upload ${index + 1}`}
//                     className="w-16 h-16 object-cover rounded border"
//                   />
//                   <button
//                     className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
//                     onClick={() => removeUploadedImage(index)}
//                   >
//                     <X size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="max-w-4xl mx-auto">
//             <div
//               className={cn(
//                 "relative bg-white border-2 border-gray-300 rounded-xl p-4 transition-opacity",
//                 (isGenerating || currentThread?.isFrozen) && "opacity-50",
//               )}
//             >
//               <div className="pr-20">
//                 <textarea
//                   ref={textareaRef}
//                   value={inputText}
//                   onChange={handleInputChange}
//                   onKeyDown={handleKeyDown}
//                   onPaste={handlePaste}
//                   placeholder={
//                     placeholderText || "Start typing your prompt here..."
//                   }
//                   className="w-full resize-none border-0 p-0 focus:outline-none focus:ring-0 text-base min-h-[20px] max-h-48 bg-transparent text-gray-700 placeholder-gray-400 font-normal"
//                   rows={1}
//                   disabled={isGenerating || currentThread?.isFrozen}
//                 />
//               </div>

//               {/* Paperclip icon - bottom left */}
//               <button
//                 className="absolute bottom-2 left-2 p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={isGenerating || currentThread?.isFrozen}
//               >
//                 <Paperclip size={16} />
//               </button>

//               {/* Send button - bottom right */}
//               <button
//                 onClick={handleSendMessage}
//                 disabled={
//                   (!inputText.trim() && uploadedImages.length === 0) ||
//                   isGenerating ||
//                   currentThread?.isFrozen
//                 }
//                 className="absolute bottom-2 right-2 p-2 h-8 w-8 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 rounded-full border-0 flex items-center justify-center"
//               >
//                 {isGenerating ? (
//                   <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Send size={14} className="text-white" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import {
  MessageSquare,
  Send,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// Utility function to join class names
function cn(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

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

export default function Page() {
  const [placeholderText, setPlaceholderText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [generationAttempted, setGenerationAttempted] = useState(false);
  const [selectedThread, setSelectedThread] = useState("excel-new-1");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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
      const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${SHEET_GID}&single=true&output=csv`;

      const response = await fetch(csvUrl, {
        method: "GET",
        headers: {
          Accept: "text/csv",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch sheet data: ${response.status} ${response.statusText}`,
        );
      }

      const csvText = await response.text();
      const { data: rows } = Papa.parse(csvText, { skipEmptyLines: true });

      // Skip header row and parse data
      const conversations = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 3) continue;
        const prompt = row[0]?.trim() || "";
        const agentOutput = row[1]?.trim() || "";
        const imageColumn = row[2]?.trim() || "";

        // Parse image links from the Image Link column (should be JSON array)
        let imageLinks: string[] = [];
        try {
          const parsed = JSON.parse(imageColumn);
          if (Array.isArray(parsed)) {
            imageLinks = parsed.filter((link) => typeof link === "string");
          }
        } catch {
          // fallback: try comma-separation or single link
          if (imageColumn.includes(",")) {
            imageLinks = imageColumn.split(",").map((x) => x.trim());
          } else if (imageColumn.includes("http")) {
            imageLinks = [imageColumn];
          }
        }

        // Only add if we have a valid prompt
        if (
          prompt &&
          prompt.length > 0 &&
          !prompt.includes("[{") &&
          !prompt.includes("shot_number")
        ) {
          conversations.push({
            prompt,
            response: agentOutput,
            imageLinks,
          });
        }
      }

      setSheetConversations(conversations);
    } catch (error) {
      setSheetConversations([]);
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchGoogleSheetData();
    // eslint-disable-next-line
  }, []);

  // Refetch on focus/visibility
  useEffect(() => {
    const handleFocus = () => fetchGoogleSheetData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchGoogleSheetData();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Google Drive link converter
  const convertGoogleDriveLink = (driveLink: string) => {
    if (!driveLink || typeof driveLink !== "string") return driveLink;
    if (driveLink.includes("drive.google.com")) {
      let fileId = null;
      const patterns = [
        /\/file\/d\/([a-zA-Z0-9-_]+)/,
        /\/d\/([a-zA-Z0-9-_]+)/,
        /[?&]id=([a-zA-Z0-9-_]+)/,
        /\/([a-zA-Z0-9-_]{25,})(?:\/|$)/,
      ];
      for (const pattern of patterns) {
        const match = driveLink.match(pattern);
        if (match && match[1]) {
          fileId = match[1];
          break;
        }
      }
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }
    if (
      driveLink.includes("googleusercontent.com") ||
      driveLink.includes("uc?export=view") ||
      driveLink.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    ) {
      return driveLink;
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

  // Function to create threads from Google Sheets data
  const createThreadsFromSheetData = () => {
    return sheetConversations.map((conv, index) => {
      const threadId = `sheet-${index + 1}`;
      const userMessage: Message = {
        id: `${threadId}-user`,
        text: conv.prompt,
        isUser: true,
        uploadedImages: [],
        timestamp: new Date(
          Date.now() - (sheetConversations.length - index) * 60000,
        ),
      };
      const outputImages = conv.imageLinks
        ? conv.imageLinks.map(convertGoogleDriveLink)
        : [];
      return {
        id: threadId,
        title: conv.prompt.slice(0, 80),
        messages: [userMessage],
        outputImages: outputImages,
        createdAt: new Date(
          Date.now() - (sheetConversations.length - index) * 60000,
        ),
        isFrozen: true,
      };
    });
  };

  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "excel-new-1",
      title: "New Chat",
      createdAt: new Date(),
      messages: [],
      outputImages: [],
      isFrozen: false,
    },
  ]);

  // Update threads when sheet data loads
  useEffect(() => {
    if (!isLoadingSheetData && sheetConversations.length > 0) {
      const sheetThreads = createThreadsFromSheetData();
      setThreads((prevThreads) => [
        prevThreads[0],
        ...sheetThreads,
      ]);
    }
    // eslint-disable-next-line
  }, [isLoadingSheetData, sheetConversations]);

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
        // Parse the response and extract generated images
        let generatedImages: string[] = [];
        console.log("Webhook result:", result, "Generated:", generatedImages);

        if (result && typeof result === "object") {
          if (result.images && Array.isArray(result.images)) {
            generatedImages = result.images;
          } else if (result.imageUrls && Array.isArray(result.imageUrls)) {
            generatedImages = result.imageUrls;
          } else if (result.data && Array.isArray(result.data)) {
            generatedImages = result.data;
          } else if (result.output && Array.isArray(result.output)) {
            generatedImages = result.output;
          } else if (Array.isArray(result)) {
            generatedImages = result;
          } else {
            Object.keys(result).forEach((key) => {
              if (Array.isArray(result[key]) && result[key].length > 0) {
                if (
                  typeof result[key][0] === "string" &&
                  result[key][0].includes("http")
                ) {
                  generatedImages = result[key];
                }
              }
            });
          }
          setGenerationAttempted(true);
        }

        // PREPEND new images so they go to the top
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === selectedThread
              ? {
                  ...thread,
                  outputImages: [
                    ...(generatedImages || []),
                    ...(thread.outputImages || [])
                  ],
                }
              : thread,
          ),
        );
        // Optionally select the new image
        setSelectedImageIndex(0);

        setIsGenerating(false);
      } else {
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === selectedThread
              ? {
                  ...thread,
                  outputImages: [],
                }
              : thread,
          ),
        );
        setIsGenerating(false);
      }
    } catch (error) {
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === selectedThread
            ? {
                ...thread,
                outputImages: [],
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
    // eslint-disable-next-line
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
        <div className="px-4 pb-2">
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
            </div>
          ))}

          {/* Loading state for Google Sheets data */}
          {isLoadingSheetData && (
            <div className="px-3 py-4 text-center">
              <div className="text-sm text-gray-500 mb-2">
                Loading from Google Sheets...
              </div>
              <div className="flex justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {/* Status section */}
          <div className="px-3 py-2 border-t border-gray-300 mt-2">
            <div className="text-xs text-gray-500 text-center">
              {sheetConversations.length} conversations loaded
            </div>
          </div>
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
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = "1";
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = "0.5";
                        target.title = `Failed to load: ${image}`;
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
                      style={{ opacity: 0.7, transition: "opacity 0.3s" }}
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