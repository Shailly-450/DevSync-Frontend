import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../App';
import { fetchMessages, sendMessage } from '../utils/api';
import { FiSend } from 'react-icons/fi';
import io from 'socket.io-client';
import { BACKEND_URL } from '../utils/env';

const socket = io(BACKEND_URL);

function getAvatarColor(name) {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProjectChat({ projectId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', projectId);
    fetchMessages(projectId).then(res => setMessages(res.data));
    const handleNewMessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    };
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveRoom', projectId);
    };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendMessage(projectId, { content: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Could not send message. Please try again.');
    }
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-4">Project Chat</h3>
      <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.user._id === user._id;
          const avatarColor = getAvatarColor(msg.user.name || 'U');
          return (
            <div key={msg._id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${avatarColor}`} title={msg.user.name}>
                {msg.user.name ? msg.user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className={`p-3 rounded-2xl max-w-xs shadow-md ${isMe ? 'bg-blue-500 text-white ml-2' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-2'}`}
                style={{ borderBottomRightRadius: isMe ? 0 : 16, borderBottomLeftRadius: isMe ? 16 : 0 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{isMe ? 'You' : msg.user.name}</span>
                  <span className="text-xs opacity-70 ml-2">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="break-words">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
          <FiSend /> Send
        </button>
      </form>
    </section>
  );
}
