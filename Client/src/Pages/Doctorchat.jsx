
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiImage, FiMenu, FiPlus, FiMessageSquare, FiTrash2 } from 'react-icons/fi';

function DoctorChat() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Welcome to SpaceMed AI. Upload medical scans or ask your space medicine questions.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a new conversation
  const newConversation = () => {
    const newId = Date.now().toString();
    setCurrentConversationId(newId);
    setMessages([{ 
      role: 'assistant', 
      content: 'Welcome to SpaceMed AI. Upload medical scans or ask your space medicine questions.',
      timestamp: new Date().toISOString()
    }]);
    
    setConversations(prev => [
      ...prev,
      {
        id: newId,
        title: 'New Space Chat',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Load a conversation
  const loadConversation = (id) => {
    setCurrentConversationId(id);
    setMessages([{ 
      role: 'assistant', 
      content: 'Welcome to SpaceMed AI. Upload medical scans or ask your space medicine questions.',
      timestamp: new Date().toISOString()
    }]);
  };

  // Delete a conversation
  const deleteConversation = (id, e) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (id === currentConversationId) {
      newConversation();
    }
  };

  // Handle text message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/medical-chat', {
        messages: [...messages, userMessage]
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.message,
        timestamp: new Date().toISOString()
      }]);
      
      if (messages.length === 1) {
        const title = input.length > 30 ? `${input.substring(0, 30)}...` : input;
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId ? { ...conv, title } : conv
        ));
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle X-ray image upload
  const handleXrayUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please upload an image file (JPEG, PNG, etc.)',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Image size too large. Please upload an image smaller than 5MB.',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const userMessage = { 
        role: 'user', 
        content: `Uploaded medical scan: ${file.name}`,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type
        },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await axios.post(
        'http://localhost:5000/api/analyze-xray', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );

      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: response.data.report,
          timestamp: new Date().toISOString()
        },
        {
          role: 'system',
          content: `Medical scan: ${response.data.imageUrl}`,
          imageUrl: response.data.imageUrl,
          timestamp: new Date().toISOString()
        }
      ]);
      
      const title = `Scan: ${file.name}`;
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId ? { ...conv, title } : conv
      ));
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.response?.data?.error || 'Failed to analyze scan. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle key down for Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift+Enter will naturally create a new line
  };

  // Initialize with a new conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      newConversation();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className={`fixed md:relative z-10 w-64 h-full bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-64'} md:left-0`}>
        <div className="p-4 h-full flex flex-col">
          <button 
            onClick={newConversation}
            className="flex items-center justify-center gap-2 w-full p-3 rounded-md border border-gray-700 hover:bg-gray-700 transition-colors mb-4 bg-gray-800"
          >
            <FiPlus /> New Space Chat
          </button>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                onClick={() => loadConversation(conversation.id)}
                className={`flex items-center justify-between p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-700 ${currentConversationId === conversation.id ? 'bg-gray-700' : 'bg-gray-800'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FiMessageSquare className="flex-shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 py-3 px-4 flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden mr-4 text-gray-300 hover:text-white"
          >
            <FiMenu size={20} />
          </button>
          <h1 className="text-lg font-semibold">SpaceMed AI</h1>
        </header>

        {/* Chat container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-6 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block max-w-full rounded-lg p-4 ${message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.role === 'system' 
                    ? 'hidden'
                    : 'bg-gray-800 text-gray-100'}`}
                >
                  {message.role === 'system' && message.imageUrl ? (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Medical Scan:</h3>
                      <div className="relative group">
                        <img 
                          src={message.imageUrl} 
                          alt="Medical scan" 
                          className="max-w-full h-auto rounded-md border border-gray-700 max-h-64"
                        />
                        <a 
                          href={message.imageUrl} 
                          download 
                          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{message.content}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-6 text-left">
                <div className="inline-block bg-gray-800 rounded-lg p-4">
                  {uploadProgress > 0 ? (
                    <div>
                      <p>Uploading scan: {uploadProgress}%</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your space medicine query (Shift+Enter for new line)..."
                className="w-full rounded-lg border border-gray-700 py-3 px-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white resize-none"
                rows={Math.min(5, Math.max(1, input.split('\n').length))}
              />
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleXrayUpload} 
                className="hidden" 
              />
              <div className="absolute right-2 bottom-2 flex gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="text-gray-400 hover:text-blue-400 p-1"
                  title="Upload medical scan"
                >
                  <FiImage size={20} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="text-blue-400 hover:text-blue-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              SpaceMed AI may produce information about space medicine conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorChat;
