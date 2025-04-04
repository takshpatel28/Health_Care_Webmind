import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaImage, FaPaperPlane, FaTimes, FaRobot, FaUser, FaPlus, FaStethoscope } from 'react-icons/fa';
import { IoMdMedical } from 'react-icons/io';
import '../index.css'

export default function DoctorChat() {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message && !image) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('message', message);
            if (image) {
                formData.append('image', image);
            }
            formData.append('chatHistory', JSON.stringify(chatHistory));

            const response = await axios.post(
                'https://health-care-webmind.onrender.com/api/chat',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setChatHistory([
                ...chatHistory,
                { role: 'user', content: message || 'Image uploaded' },
                { role: 'assistant', content: response.data.response },
            ]);
            setMessage('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.error || 'Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            {/* <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100">
                <div className="max-w-3xl mx-auto flex items-center">
                    <div className="flex items-center">
                        <div className="bg-blue-600 p-2 rounded-lg mr-3">
                            <IoMdMedical className="text-white text-xl" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Dr. AI Assistant</h1>
                    </div>
                    <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        Online
                    </div>
                </div>
            </header> */}

            {/* Chat Container */}
            <main className="flex-1 overflow-y-auto p-4 pb-24">
                <div className="max-w-3xl mx-auto space-y-4">
                    {chatHistory.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                            <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 transform transition-all hover:scale-105">
                                <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                                    <FaRobot className="text-3xl text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
                                <p className="text-gray-600 max-w-md">
                                    Ask me anything about health, symptoms, or upload an image for analysis.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                <button 
                                    className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                                    onClick={() => setMessage("What are common flu symptoms?")}
                                >
                                    Flu symptoms
                                </button>
                                <button 
                                    className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                                    onClick={() => setMessage("How to treat a headache?")}
                                >
                                    Headache remedies
                                </button>
                            </div>
                        </div>
                    )}

                    {chatHistory.map((msg, index) => (
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
                                    {msg.content.startsWith('data:image') ? (
                                        <img 
                                            src={msg.content} 
                                            alt="Uploaded content" 
                                            className="rounded-lg max-w-full max-h-60 object-contain mt-2 border border-gray-200 shadow-sm"
                                        />
                                    ) : (
                                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
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
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 shadow-lg backdrop-blur-sm bg-opacity-90">
                <div className="max-w-3xl mx-auto">
                    {image && (
                        <div className="relative mb-3 bg-gray-50 rounded-xl p-3 flex items-center border border-gray-200 shadow-inner">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="h-24 rounded-lg object-cover border border-gray-200 shadow-sm"
                            />
                            <button 
                                type="button" 
                                onClick={removeImage}
                                className="ml-3 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors absolute -top-2 -right-2 shadow-sm"
                                title="Remove image"
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
                                placeholder="Message Dr. AI..."
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-transparent outline-none text-sm rounded-l-xl"
                            />
                            <div className="flex items-center pr-2 space-x-1">
                                <label 
                                    htmlFor="image-upload" 
                                    className={`p-2 rounded-lg cursor-pointer transition-all ${isLoading 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                                    title="Upload image"
                                >
                                    <FaImage size={18} />
                                    <input
                                        id="image-upload"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                </label>
                                <button 
                                    type="submit" 
                                    disabled={isLoading || (!message && !image)}
                                    className={`p-2 rounded-lg transition-all ${(isLoading || (!message && !image)) 
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
                        Dr. AI may produce inaccurate information. Always consult a real doctor for medical advice.
                    </div>
                </div>
            </footer>
        </div>
    );
}