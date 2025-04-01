// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, SearchIcon, PaperClipIcon, PhotographIcon, EmojiHappyIcon, MicrophoneIcon, DotsVerticalIcon, CheckIcon } from '@heroicons/react/outline';
import { UserCircleIcon, ClockIcon, ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/solid';

const DoctorChatApp = () => {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', lastMessage: 'What dosage would you recommend for this case?', time: '10:30 AM', unread: 2, online: true, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'Dr. Michael Brown', specialty: 'Neurology', lastMessage: 'I reviewed the MRI scans you sent', time: 'Yesterday', unread: 0, online: false, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrics', lastMessage: 'The patient responded well to treatment', time: 'Yesterday', unread: 1, online: true, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 4, name: 'Dr. Robert Wilson', specialty: 'Orthopedics', lastMessage: 'Can we discuss the surgery approach?', time: 'Monday', unread: 0, online: false, avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('colleagues'); // 'colleagues' or 'groups'
  const messagesEndRef = useRef(null);

  // Sample messages for the selected doctor
  useEffect(() => {
    if (selectedDoctor) {
      const sampleMessages = [
        { id: 1, text: 'Hi Sarah, I have a cardiology case I wanted to consult with you about.', sender: 'you', time: '10:30 AM' },
        { id: 2, text: 'Of course, what are the patient details?', sender: 'colleague', time: '10:32 AM' },
        { id: 3, text: '65yo male with history of hypertension, presenting with chest pain. ECG shows ST elevation.', sender: 'you', time: '10:33 AM' },
        { id: 4, text: 'Have you started anticoagulation therapy? Troponin levels?', sender: 'colleague', time: '10:35 AM' },
        { id: 5, text: 'Troponin positive, started on heparin drip. Considering cath lab.', sender: 'you', time: '10:36 AM' },
      ];
      setMessages(sampleMessages);
    }
  }, [selectedDoctor]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'you',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate colleague reply after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        text: 'Thanks for the details. I agree cath lab is appropriate. Let me know if you need anything else.',
        sender: 'colleague',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, replyMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white w-full md:w-80 flex-shrink-0 border-r ${selectedDoctor ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-800">Medical Collaboration</h1>
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <BellIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex mt-4 border-b">
            <button
              className={`flex-1 py-2 font-medium ${activeTab === 'colleagues' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('colleagues')}
            >
              Colleagues
            </button>
            <button
              className={`flex-1 py-2 font-medium ${activeTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
          </div>
          
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-170px)]">
          {activeTab === 'colleagues' ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-4 border-b flex items-center cursor-pointer hover:bg-blue-50 ${selectedDoctor?.id === doctor.id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="relative">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {doctor.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{doctor.name}</h3>
                    <span className="text-xs text-gray-500">{doctor.time}</span>
                  </div>
                  <p className="text-xs text-blue-600">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500 truncate">{doctor.lastMessage}</p>
                </div>
                {doctor.unread > 0 && (
                  <div className="ml-2 bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {doctor.unread}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">Medical discussion groups will appear here</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Create Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedDoctor ? (
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="bg-white p-4 border-b flex items-center">
            <button
              className="md:hidden p-1 mr-2 rounded-full hover:bg-gray-100"
              onClick={() => setSelectedDoctor(null)}
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div className="relative">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              {selectedDoctor.online && (
                <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-medium">{selectedDoctor.name}</h3>
              <p className="text-xs text-blue-600">{selectedDoctor.specialty}</p>
              <p className="text-xs text-gray-500">
                {selectedDoctor.online ? 'Online - Available for consultation' : 'Offline'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <SearchIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-1 rounded-full hover:bg-gray-100">
                <DotsVerticalIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${message.sender === 'you' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                >
                  <p>{message.text}</p>
                  <div className={`text-xs mt-1 flex items-center ${message.sender === 'you' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                    {message.sender === 'you' && (
                      <CheckIcon className="h-3 w-3 ml-1 text-blue-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Dr. {selectedDoctor.name.split(' ')[1]} is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white p-4 border-t">
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <PaperClipIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <PhotographIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <EmojiHappyIcon className="h-5 w-5 text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Secure HIPAA-compliant messaging
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <UserGroupIcon className="h-20 w-20 mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-medium text-gray-700">Select a colleague to start consulting</h2>
            <p className="mt-2 text-gray-500">Case discussions and medical collaboration</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChatApp;