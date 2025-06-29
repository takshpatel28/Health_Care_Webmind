import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiImage, FiMenu, FiX, FiSun, FiMoon, FiTrash2, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { BsRobot, BsPerson, BsLightbulb, BsPlus } from 'react-icons/bs';
import { MdMedicalServices, MdOutlineSchool, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helper/supabaseClient';

function DoctorChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeChatType, setActiveChatType] = useState('general');
  const [chatInstances, setChatInstances] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Store chats by ID
  const [chats, setChats] = useState({});
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Track newly created chats to prevent loading history
  const [newlyCreatedChatId, setNewlyCreatedChatId] = useState(null);

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
        } else {
          // Redirect to login if no user is found
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };
    
    fetchCurrentUser();
  }, [navigate]);

  // Initialize with a default chat
  useEffect(() => {
    if (chatInstances.length === 0 && currentUser) {
      createNewChat();
    }
  }, [chatInstances.length, currentUser]);

  // Load chat sessions from Supabase
  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', currentUser?.id) // Filter by user ID
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedSessions = data.map(session => ({
            id: session.id,
            type: activeChatType,
            title: session.session_title || 'New Chat',
            createdAt: session.created_at
          }));
          
          setChatInstances(formattedSessions);
          
          // Set the most recent chat as active if none is selected
          if (!activeChatId && formattedSessions.length > 0) {
            setActiveChatId(formattedSessions[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      }
    };

    if (currentUser) {
      fetchChatSessions();
    }
  }, [activeChatType, currentUser, activeChatId]);

  useEffect(() => {
    if (activeChatId) {
      // Only load chat history if this is not a newly created chat
      if (activeChatId !== newlyCreatedChatId) {
        loadChatHistory(activeChatId);
      } else {
        // Reset the newly created chat ID after it's been used
        setNewlyCreatedChatId(null);
      }
    }
  }, [activeChatId, activeChatType, newlyCreatedChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const loadChatHistory = async (chatId) => {
    try {
      setIsSending(true);
      
      // Fetch chat history from Supabase filtered by session ID
      const { data, error } = await supabase
        .from('chatHistory')
        .select('*')
        .eq('session_id', chatId)
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch chat history: ${error.message}`);
      }

      // Format the chat history for the UI
      const formattedHistory = data.map(msg => ({
        role: msg.sender_role,
        content: msg.content,
        timestamp: msg.created_at || new Date().toISOString(),
        chatType: activeChatType
      }));
      
      setChats(prev => ({
        ...prev,
        [chatId]: formattedHistory || []
      }));
      
      // Update chat title if this is the first message
      if (formattedHistory.length > 0 && chatInstances.length > 0) {
        const chatInstance = chatInstances.find(chat => chat.id === chatId);
        if (chatInstance && chatInstance.title === 'New Chat') {
          updateChatTitle(chatId, formattedHistory[0].content);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChats(prev => ({
        ...prev,
        [chatId]: []
      }));
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    const userMessage = {
      role: 'user',
      content: message,
      image: image ? URL.createObjectURL(image) : null,
      timestamp: new Date().toISOString(),
      chatType: activeChatType
    };
    
    // Update local state immediately
    setChats(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMessage]
    }));
    
    setIsSending(true);
    setIsTyping(true);
    setMessage('');
    setImage(null);
    
    try {
      // Store user message in Supabase with user ID
      const { error: userMsgError } = await supabase
        .from('chatHistory')
        .insert({
          session_id: activeChatId,
          sender_role: 'user',
          content: message,
          user_id: currentUser?.id // Add user ID to the message
        });

      if (userMsgError) throw userMsgError;

      // Call Mistral AI API directly
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY || 'h4fxd9juHwPuRpXoqh2pTzMSxzBl0Vzy'}`
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages: [
            ...chats[activeChatId]?.map(msg => ({
              role: msg.role,
              content: msg.content
            })) || [],
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API responded with status: ${response.status}`);
      }

      const mistralResponse = await response.json();
      const aiResponseData = {
        response: mistralResponse.choices[0].message.content
      };
      
      // Format AI response for UI
      const aiResponse = {
        role: 'assistant',
        content: aiResponseData.response || "I'm sorry, I couldn't process your request.",
        timestamp: new Date().toISOString(),
        chatType: activeChatType
      };

      // Store AI response in Supabase
      const { error: aiMsgError } = await supabase
        .from('chatHistory')
        .insert({
          session_id: activeChatId,
          sender_role: 'assistant',
          content: aiResponse.content,
          response_to: message,
          user_id: currentUser?.id // Add user ID to the AI response
        });

      if (aiMsgError) throw aiMsgError;
      
      // Update local state with AI response
      setChats(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), aiResponse]
      }));
      
      // Update chat title based on first message
      if (chatInstances.find(chat => chat.id === activeChatId)?.title === 'New Chat') {
        const newTitle = message.substring(0, 20) + (message.length > 20 ? '...' : '');
        
        // Update session title in Supabase
        const { error: updateError } = await supabase
          .from('sessions')
          .update({ 
            session_title: newTitle,
            user_id: currentUser?.id // Ensure user ID is set on the session
          })
          .eq('id', activeChatId);

        if (updateError) throw updateError;
        
        // Update local state
        setChatInstances(prev => 
          prev.map(chat => 
            chat.id === activeChatId 
              ? { ...chat, title: newTitle } 
              : chat
          )
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setChats(prev => ({
        ...prev,
        [activeChatId]: [
          ...(prev[activeChatId] || []),
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error processing your request. Please try again.',
            timestamp: new Date().toISOString(),
            chatType: activeChatType
          }
        ]
      }));
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const createNewChat = async () => {
    try {
      // Create a new session in Supabase
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          session_title: 'New Chat',
          user_id: currentUser?.id // Set the authenticated user's ID
        })
        .select();

      if (error) throw error;

      const newChatId = data[0].id;
      const newChat = {
        id: newChatId,
        type: activeChatType,
        title: 'New Chat',
        createdAt: data[0].created_at
      };
      
      // Mark this as a newly created chat to prevent loading history
      setNewlyCreatedChatId(newChatId);
      
      // Add to chat instances
      setChatInstances(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
      
      // Initialize empty messages
      setChats(prev => ({
        ...prev,
        [newChatId]: []
      }));
      
      // Clear the message input
      setMessage('');
      setImage(null);
      
      // Close the sidebar on mobile after creating new chat
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('Failed to create a new chat. Please try again.');
    }
  };

  const confirmDeleteChat = (chatId) => {
    setChatToDelete(chatId);
    setShowDeleteConfirm(true);
  };

  const deleteChatInstance = async () => {
    if (!chatToDelete) return;
    
    try {
      setIsSending(true);
      
      // Delete chat history from Supabase
      const { error: historyError } = await supabase
        .from('chatHistory')
        .delete()
        .eq('session_id', chatToDelete)
        .eq('user_id', currentUser?.id); // Filter by user ID

      if (historyError) throw historyError;
      
      // Delete session from Supabase
      const { error: sessionError } = await supabase
        .from('sessions')
        .delete()
        .eq('id', chatToDelete)
        .eq('user_id', currentUser?.id); // Filter by user ID

      if (sessionError) throw sessionError;
      
      // Remove chat from instances
      setChatInstances(prev => prev.filter(chat => chat.id !== chatToDelete));
      
      // Remove from local state
      setChats(prev => {
        const newChats = {...prev};
        delete newChats[chatToDelete];
        return newChats;
      });
      
      // If we're deleting the active chat, switch to another one or create new
      if (activeChatId === chatToDelete) {
        const remainingChats = chatInstances.filter(chat => chat.id !== chatToDelete);
        if (remainingChats.length > 0) {
          // Find the most recent chat of the same type
          const sameTypeChats = remainingChats.filter(chat => chat.type === activeChatType);
          if (sameTypeChats.length > 0) {
            // Sort by creation date (newest first) and select the first one
            const sortedChats = sameTypeChats.sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            setActiveChatId(sortedChats[0].id);
          } else {
            // If no chats of the same type, create a new one
            createNewChat();
          }
        } else {
          // Create a new one if this was the last chat
          createNewChat();
        }
      }
      
    } catch (err) {
      console.error('Error deleting chat:', err);
      alert('Failed to delete chat. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
      setChatToDelete(null);
      setIsSending(false);
    }
  };

  const deleteAllChats = async () => {
    if (!window.confirm('Are you sure you want to delete ALL chats? This cannot be undone.')) {
      return;
    }
    
    try {
      setIsSending(true);
      
      // Get all chats for current chat type
      const chatsToDelete = chatInstances.filter(chat => chat.type === activeChatType);
      const chatIds = chatsToDelete.map(chat => chat.id);
      
      // Delete all chat history for these sessions
      const { error: historyError } = await supabase
        .from('chatHistory')
        .delete()
        .in('session_id', chatIds)
        .eq('user_id', currentUser?.id); // Filter by user ID

      if (historyError) throw historyError;
      
      // Delete all sessions
      const { error: sessionError } = await supabase
        .from('sessions')
        .delete()
        .in('id', chatIds)
        .eq('user_id', currentUser?.id); // Filter by user ID

      if (sessionError) throw sessionError;
      
      // Clear all chats of current type from state
      setChatInstances(prev => prev.filter(chat => chat.type !== activeChatType));
      
      // Clear from local state
      const newChats = {...chats};
      chatsToDelete.forEach(chat => {
        delete newChats[chat.id];
      });
      setChats(newChats);
      
      // Create a new chat
      createNewChat();
      
    } catch (err) {
      console.error('Error deleting all chats:', err);
      alert('Failed to delete all chats. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const updateChatTitle = async (chatId, content) => {
    try {
      // Generate a title from the first few words of content
      const title = content.split(' ').slice(0, 4).join(' ') + '...';
      
      // Update the chat title in Supabase
      const { error } = await supabase
        .from('sessions')
        .update({ session_title: title })
        .eq('id', chatId)
        .eq('user_id', currentUser?.id);
      
      if (error) throw error;
      
      // Update local state
      setChatInstances(prev => 
        prev.map(chat => 
          chat.id === chatId ? {...chat, title} : chat
        )
      );
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };

  const selectChatType = (chatType) => {
    if (activeChatType !== chatType) {
      if (window.confirm('Switching chat type will create a new chat. Continue?')) {
        setActiveChatType(chatType);
        createNewChat();
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const currentChatMessages = chats[activeChatId] || [];

  // Modal for delete confirmation
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`p-6 rounded-lg shadow-xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-100">
            <FiAlertTriangle className="text-red-600 text-xl" />
          </div>
          <h3 className="text-xl font-bold">Delete Chat</h3>
        </div>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Are you sure you want to delete this chat? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={deleteChatInstance}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiTrash2 size={16} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* Sidebar */}
      <div className={`fixed md:relative z-30 w-72 h-full bg-gradient-to-b from-gray-800 to-gray-900 transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BsRobot className="text-blue-400" />
              <span>Doctor WebMind</span>
            </h3>
            <button 
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={toggleSidebar}
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex gap-2 mb-6">
              <button 
                onClick={createNewChat}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
              >
                <BsPlus size={20} />
                <span>New Chat</span>
              </button>
              
              <button 
                onClick={toggleDeleteMode}
                className={`p-3 rounded-xl ${deleteMode 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-700 hover:bg-gray-600'} 
                  text-white transition-all duration-200 shadow-lg`}
                title={deleteMode ? 'Exit delete mode' : 'Enter delete mode'}
              >
                <MdDelete size={20} />
              </button>
            </div>
            
            {chatInstances.filter(chat => chat.type === activeChatType).length > 0 && (
              <button 
                onClick={deleteAllChats}
                className="w-full py-2 px-4 mb-4 rounded-xl bg-red-600/80 hover:bg-red-700 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <FiTrash2 size={16} />
                <span>Delete All Chats</span>
              </button>
            )}
            
            <div className="space-y-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-1">Chat Options</div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-xl ${activeChatType === 'general' ? 'bg-gray-700 shadow-md' : 'bg-gray-800 hover:bg-gray-700'} text-white cursor-pointer transition-all duration-200 border border-gray-700`}
                onClick={() => selectChatType('general')}
              >
                <div className={`p-2 rounded-lg ${activeChatType === 'general' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  <MdOutlineSchool className="text-white" />
                </div>
                <div>
                  <div className="font-medium">General Chat</div>
                  <div className="text-xs text-gray-400">For general healthcare questions</div>
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-3 p-3 rounded-xl ${activeChatType === 'medical' ? 'bg-gray-700 shadow-md' : 'bg-gray-800 hover:bg-gray-700'} text-white cursor-pointer transition-all duration-200 border border-gray-700`}
                onClick={() => selectChatType('medical')}
              >
                <div className={`p-2 rounded-lg ${activeChatType === 'medical' ? 'bg-green-500' : 'bg-gray-700'}`}>
                  <MdMedicalServices className="text-white" />
                </div>
                <div>
                  <div className="font-medium">Medical Consultation</div>
                  <div className="text-xs text-gray-400">For health-related questions</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400 uppercase tracking-wider px-2">Recent Chats</div>
                {deleteMode && (
                  <div className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-md">
                    Delete Mode
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                {chatInstances
                  .filter(chat => chat.type === activeChatType)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(chat => (
                    <div 
                      key={chat.id}
                      className={`flex items-center justify-between gap-2 p-3 rounded-xl cursor-pointer transition-all 
                        ${activeChatId === chat.id ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}
                        ${deleteMode ? 'border border-red-500/30' : ''}`}
                      onClick={() => !deleteMode && setActiveChatId(chat.id)}
                    >
                      <div className="flex-1 truncate">
                        <div className="font-medium truncate">{chat.title}</div>
                        <div className="text-xs text-gray-400">{formatDate(chat.createdAt)}</div>
                      </div>
                      {deleteMode ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteChat(chat.id);
                          }}
                          className="text-white bg-red-600 hover:bg-red-700 transition-colors p-2 rounded-lg"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteChat(chat.id);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                          title="Delete this chat"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
              </div>

              {chatInstances.filter(chat => chat.type === activeChatType).length === 0 && (
                <div className="text-center p-4 text-gray-500 text-sm">
                  No chats yet. Create a new chat to get started.
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Dark Mode</span>
              <button 
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                {darkMode ? (
                  <FiMoon className="text-white absolute left-1 top-1 text-xs" />
                ) : (
                  <FiSun className="text-yellow-300 absolute right-1 top-1 text-xs" />
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Doctor WebMind AI v1.0
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full transition-colors duration-300 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gray-50'}`}>
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-gray-700 flex items-center bg-gray-800 shadow-sm">
          <button 
            className="text-gray-400 hover:text-white mr-3 transition-colors"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft size={20} />
          </button>
          <button 
            className="text-gray-400 hover:text-white mr-4 transition-colors"
            onClick={toggleSidebar}
          >
            <FiMenu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BsRobot className="text-blue-400" />
            <span>Doctor WebMind</span>
          </h2>
        </div>
        
        {/* Chat Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center">
            <button 
              className={`hidden md:block text-gray-400 hover:${darkMode ? 'text-white' : 'text-gray-700'} mr-4 transition-colors`}
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {activeChatType === 'medical' ? 'Medical Consultation' : 'General Healthcare'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {activeChatId && chatInstances.find(chat => chat.id === activeChatId)?.title}
            </div>
            {activeChatId && (
              <button 
                onClick={() => confirmDeleteChat(activeChatId)}
                className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                title="Delete this chat"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                <BsRobot className="text-5xl text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Doctor WebMind AI
              </h1>
              <p className={`text-lg mb-8 max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your intelligent assistant for medical consultation and healthcare
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                <div 
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'}`}
                  onClick={() => setMessage('Explain the concept of hypertension')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <BsLightbulb size={18} />
                    </div>
                    <h3 className="font-medium">Medical Concepts</h3>
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ask about any medical topic or concept
                  </p>
                </div>
                
                <div 
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'}`}
                  onClick={() => setMessage('Help me interpret these blood pressure readings: 140/90')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500 text-white">
                      <MdOutlineSchool size={18} />
                    </div>
                    <h3 className="font-medium">Diagnosis Help</h3>
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get step-by-step diagnostic guidance
                  </p>
                </div>
                
                <div 
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'}`}
                  onClick={() => setMessage('What are the treatment options for hypertension?')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500 text-white">
                      <MdMedicalServices size={18} />
                    </div>
                    <h3 className="font-medium">Treatment Options</h3>
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get information about treatments and medications
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentChatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl rounded-2xl px-5 py-3 ${msg.role === 'user' 
                      ? darkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : darkMode 
                        ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                        : 'bg-white text-gray-800 border border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {msg.role === 'user' ? (
                        <BsPerson className="text-lg" />
                      ) : (
                        <BsRobot className="text-lg text-blue-400" />
                      )}
                      <span className="font-medium">
                        {msg.role === 'user' ? 'You' : 'DoctorMind'}
                      </span>
                      <span className={`text-xs ${msg.role === 'user' ? 'text-blue-200' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    
                    <div className="whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    
                    {msg.image && (
                      <div className="mt-3">
                        <img 
                          src={msg.image} 
                          alt="User attached" 
                          className="max-w-full h-auto rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`max-w-3xl rounded-2xl px-5 py-3 ${darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <BsRobot className="text-lg text-blue-400" />
                      <span className="font-medium">DoctorMind</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {image && (
            <div className={`relative mb-3 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-300 overflow-hidden">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm truncate max-w-xs">{image.name}</span>
              </div>
              <button 
                onClick={() => setImage(null)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
          )}
          
          <div className={`flex items-end gap-2 p-2 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <button 
              onClick={handleImageClick}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <FiImage size={20} />
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type your ${activeChatType === 'medical' ? 'medical' : 'healthcare'} question here...`}
              className={`flex-1 max-h-32 resize-none py-2 px-3 rounded-lg focus:outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-800 placeholder-gray-400'}`}
              rows={1}
            />
            
            <button
              onClick={sendMessage}
              disabled={isSending || (!message.trim() && !image)}
              className={`p-3 rounded-lg ${(!message.trim() && !image) || isSending 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiSend size={18} />
              )}
            </button>
          </div>
          
          <div className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Doctor WebMind may produce inaccurate information. Consult with a healthcare professional for medical advice.
          </div>
        </div>
      </div>
      
      {showDeleteConfirm && <DeleteConfirmModal />}
    </div>
  );
}

export default DoctorChat;