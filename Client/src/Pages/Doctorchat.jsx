import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaImage, FaPaperPlane, FaTimes, FaRobot, FaUser, FaPlus, FaStethoscope, FaHistory, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import { IoMdMedical } from 'react-icons/io';
import '../index.css';

export default function DoctorChat() {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [showFileTypeMenu, setShowFileTypeMenu] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (chatSessions.length === 0) {
            createNewSession();
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentSessionId, chatSessions]);

    const getCurrentChat = () => {
        return chatSessions.find(session => session.id === currentSessionId) || 
               chatSessions[chatSessions.length - 1];
    };

    const createNewSession = () => {
        const newSession = {
            id: Date.now().toString(),
            title: `Chat ${chatSessions.length + 1}`,
            history: [],
            createdAt: new Date().toISOString()
        };
        setChatSessions([...chatSessions, newSession]);
        setCurrentSessionId(newSession.id);
        return newSession;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message && !file) return;

        setIsLoading(true);
        const currentChat = getCurrentChat();

        try {
            const formData = new FormData();
            formData.append('message', message);
            if (file) {
                formData.append('file', file);
            }
            formData.append('chatHistory', JSON.stringify(currentChat.history));

            // Add the user message immediately
            const userMessage = {
                role: 'user',
                content: message || getFileUploadMessage(file),
                ...(file && { 
                    fileUrl: URL.createObjectURL(file),
                    fileType: file.type,
                    fileName: file.name
                })
            };

            // Optimistic update
            const updatedSessionsWithUserMessage = chatSessions.map(session => {
                if (session.id === currentSessionId) {
                    return {
                        ...session,
                        history: [
                            ...session.history,
                            userMessage
                        ],
                        title: session.history.length === 0 
                            ? (message || getFileUploadMessage(file)).substring(0, 20) + (message?.length > 20 ? '...' : '') 
                            : session.title
                    };
                }
                return session;
            });
            setChatSessions(updatedSessionsWithUserMessage);

            const response = await axios.post(
                'https://health-care-webmind.onrender.com/api/chat',
                // 'http://localhost:8080/api/chat',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Update with assistant's response
            const updatedSessions = updatedSessionsWithUserMessage.map(session => {
                if (session.id === currentSessionId) {
                    return {
                        ...session,
                        history: [
                            ...session.history,
                            { 
                                role: 'assistant', 
                                content: response.data.response,
                                isAnalysis: !!file // Mark as analysis response if file was uploaded
                            }
                        ]
                    };
                }
                return session;
            });

            setChatSessions(updatedSessions);
            setMessage('');
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
            setChatSessions(chatSessions);
            alert(error.response?.data?.error || 'Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getFileUploadMessage = (file) => {
        if (!file) return '';
        if (file.type.startsWith('image/')) return 'Uploaded medical image for analysis';
        if (file.type === 'application/pdf') return 'Uploaded medical report for analysis';
        return 'Uploaded document for analysis';
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setShowFileTypeMenu(false);
            // Auto-focus message input after file selection
            setTimeout(() => {
                const input = document.querySelector('input[type="text"]');
                if (input) input.focus();
            }, 100);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const switchSession = (sessionId) => {
        setCurrentSessionId(sessionId);
    };

    const renderFilePreview = () => {
        if (!file) return null;
        
        if (file.type.startsWith('image/')) {
            return (
                <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="h-24 rounded-lg object-cover border border-gray-200 shadow-sm"
                    />
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                        <div className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB • {file.type.split('/')[1].toUpperCase()}
                        </div>
                        <div className="mt-1 text-xs text-blue-600 font-medium">
                            Ready for medical analysis
                        </div>
                    </div>
                </div>
            );
        } else if (file.type === 'application/pdf') {
            return (
                <div className="flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center justify-center h-24 w-24 bg-white rounded-lg border border-red-200 shadow-sm">
                        <FaFilePdf className="text-red-600 text-4xl" />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                        <div className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB • PDF
                        </div>
                        <div className="mt-1 text-xs text-red-600 font-medium">
                            Ready for medical report analysis
                        </div>
                    </div>
                </div>
            );
        }
    };

    // Format assistant's response with better readability for medical analysis
    const formatMedicalResponse = (content, isAnalysis = false) => {
        if (!isAnalysis) return content;

        // Add section headers and formatting for analysis responses
        const sections = content.split('\n\n').filter(part => part.trim().length > 0);
        
        return sections.map((section, index) => {
            if (section.startsWith('**')) {
                // Header section
                return (
                    <div key={index} className="mb-3">
                        <h3 className="font-bold text-blue-700 text-sm mb-1">
                            {section.replace(/\*\*/g, '')}
                        </h3>
                    </div>
                );
            } else if (section.startsWith('- ')) {
                // Bullet points
                return (
                    <ul key={index} className="list-disc pl-5 space-y-1 mb-3">
                        {section.split('\n').map((item, i) => (
                            <li key={i} className="text-sm">{item.replace('- ', '')}</li>
                        ))}
                    </ul>
                );
            } else {
                // Regular paragraph
                return (
                    <p key={index} className="whitespace-pre-wrap text-sm mb-3">
                        {section}
                    </p>
                );
            }
        });
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Sidebar - Chat History */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg">Medical Consultations</h2>
                        <button 
                            onClick={createNewSession}
                            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            title="New chat"
                        >
                            <FaPlus size={14} />
                        </button>
                    </div>
                    <div className="mt-2 relative">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chatSessions.map(session => (
                        <div 
                            key={session.id}
                            onClick={() => switchSession(session.id)}
                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                                currentSessionId === session.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="font-medium truncate flex-1">{session.title}</div>
                                <div className="text-xs text-gray-500 ml-2">
                                    {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                                {session.history.length > 0 ? 
                                    session.history[session.history.length - 1].content.substring(0, 60) + 
                                    (session.history[session.history.length - 1].content.length > 60 ? '...' : '') : 
                                    'New conversation'}
                            </div>
                            {session.history.some(msg => msg.fileUrl) && (
                                <div className="mt-1 flex space-x-1">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Attachment
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <FaUser size={12} />
                        </div>
                        <div className="text-sm font-medium">Dr. User</div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100 mt-3">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <div className="bg-blue-600 p-2 rounded-lg mr-3">
                                <IoMdMedical className="text-white text-xl" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">Dr. AI Medical Assistant</h1>
                        </div>
                    </div>
                </header>

                {/* Chat Container */}
                <main className="flex-1 overflow-y-auto p-4 pb-24 bg-gray-50">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {getCurrentChat()?.history.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                                <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 transform transition-all hover:scale-105">
                                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                                        <FaRobot className="text-3xl text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Medical Consultation</h2>
                                    <p className="text-gray-600 max-w-md">
                                        Upload medical images, reports, or describe symptoms for detailed analysis.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 max-w-md">
                                    <button 
                                        className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                                        onClick={() => setMessage("Can you analyze this X-ray for any abnormalities?")}
                                    >
                                        Analyze X-ray
                                    </button>
                                    <button 
                                        className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                                        onClick={() => setMessage("Please review my blood test results")}
                                    >
                                        Blood test review
                                    </button>
                                </div>
                            </div>
                        )}

                        {getCurrentChat()?.history.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`}
                            >
                                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex-shrink-0 mt-1 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-white text-green-600 border border-green-100'}`}>
                                            {msg.role === 'user' ? <FaUser size={14} /> : <FaStethoscope size={14} />}
                                        </div>
                                    </div>
                                    <div className={`px-4 py-3 rounded-xl ${msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'}`}>
                                        <div className="font-medium text-xs mb-1 opacity-80">
                                            {msg.role === 'user' ? 'You' : 'Dr. AI'}
                                        </div>
                                        {msg.fileUrl ? (
                                            <div className="mt-2">
                                                {msg.fileType.startsWith('image/') ? (
                                                    <div>
                                                        <img 
                                                            src={msg.fileUrl} 
                                                            alt="Medical image" 
                                                            className="rounded-lg max-w-full max-h-60 object-contain border border-gray-200 shadow-sm"
                                                        />
                                                        <div className="text-xs text-gray-500 mt-1">{msg.fileName}</div>
                                                    </div>
                                                ) : (
                                                    <div className={`flex items-center p-4 rounded-lg ${msg.fileType === 'application/pdf' 
                                                        ? 'bg-red-50 border border-red-200' 
                                                        : 'bg-blue-50 border border-blue-200'}`}>
                                                        {msg.fileType === 'application/pdf' ? (
                                                            <FaFilePdf className="text-red-600 text-4xl mr-3" />
                                                        ) : (
                                                            <FaFileAlt className="text-blue-600 text-4xl mr-3" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-sm">{msg.fileName}</div>
                                                            <div className="text-xs text-gray-500">{msg.fileType}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {msg.content !== getFileUploadMessage({ type: msg.fileType }) && (
                                                    <p className="whitespace-pre-wrap text-sm mt-2">{msg.content}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className={`${msg.isAnalysis ? 'medical-analysis' : ''}`}>
                                                {formatMedicalResponse(msg.content, msg.isAnalysis)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex max-w-[85%]">
                                    <div className="flex-shrink-0 mr-3 mt-1">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-green-600 border border-green-100 shadow-sm">
                                            <FaStethoscope size={14} />
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-white text-gray-800 border border-gray-100 rounded-xl rounded-bl-none shadow-sm">
                                        <div className="font-medium text-xs mb-1 opacity-80">Dr. AI is analyzing</div>
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </main>

                {/* Input Area */}
                <footer className="bg-white border-t border-gray-200 py-4 px-6 shadow-lg">
                    <div className="max-w-3xl mx-auto">
                        {file && (
                            <div className="relative mb-3 bg-gray-50 rounded-xl p-3 border border-gray-200 shadow-inner">
                                {renderFilePreview()}
                                <button 
                                    type="button" 
                                    onClick={removeFile}
                                    className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors absolute top-2 right-2 shadow-sm"
                                    title="Remove file"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative">
                            <div className="flex items-center bg-white rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm hover:shadow-md">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe symptoms or ask about medical reports..."
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 bg-transparent outline-none text-sm rounded-l-xl"
                                />
                                <div className="flex items-center pr-2 space-x-1">
                                    <div className="relative">
                                        <button 
                                            type="button"
                                            onClick={() => setShowFileTypeMenu(!showFileTypeMenu)}
                                            className={`p-2 rounded-lg cursor-pointer transition-all ${isLoading 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                                            title="Upload medical file"
                                            disabled={isLoading}
                                        >
                                            <FaImage size={18} />
                                        </button>
                                        
                                        {showFileTypeMenu && (
                                            <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-48">
                                                <label 
                                                    className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                    title="Upload medical image (X-ray, MRI, etc.)"
                                                >
                                                    <FaImage className="mr-2 text-blue-600" />
                                                    <span>Medical Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                        ref={fileInputRef}
                                                    />
                                                </label>
                                                <label 
                                                    className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                    title="Upload medical report (PDF)"
                                                >
                                                    <FaFilePdf className="mr-2 text-red-600" />
                                                    <span>Medical Report</span>
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || (!message && !file)}
                                        className={`p-2 rounded-lg transition-all ${(isLoading || (!message && !file)) 
                                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                                            : 'text-white bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                                        title="Send message"
                                    >
                                        <FaPaperPlane size={18} />
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                        <div className="text-center mt-3 text-xs text-gray-500">
                            Dr. AI provides preliminary analysis only. For medical emergencies, call your local emergency number.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}