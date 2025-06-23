import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { fetchProject, fetchMessages, sendMessage } from '../utils/api';
import { FiSend, FiArrowLeft, FiLoader } from 'react-icons/fi';
import io from 'socket.io-client';
import { BACKEND_URL } from '../utils/env';
import styles from './ProjectChatPage.module.css';
import BackButton from '../components/BackButton';

// Initialize socket connection
const socket = io(BACKEND_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
});

const UserAvatar = ({ name }) => (
  <div className={styles.userAvatar}>
    {name?.charAt(0).toUpperCase() || '?'}
  </div>
);

export default function ProjectChatPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Basic connection and error listeners
    socket.on('connect', () => console.log('Socket connected!'));
    socket.on('disconnect', () => console.log('Socket disconnected.'));
    socket.on('connect_error', (err) => console.error('Socket connection error:', err));
    
    // Join the project's chat room
    socket.emit('joinRoom', projectId);

    // Fetch initial project and message data
    Promise.all([
      fetchProject(projectId),
      fetchMessages(projectId)
    ]).then(([projectRes, messagesRes]) => {
      setProject(projectRes.data);
      setMessages(messagesRes.data);
    }).catch(err => {
      console.error(err);
      setError('Failed to load chat data.');
    }).finally(() => {
      setLoading(false);
    });

    // Listen for new messages
    const handleNewMessage = (message) => {
      // Ensure the message belongs to the current project
      if (message.project === projectId) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };
    socket.on('newMessage', handleNewMessage);

    // Clean up on component unmount
    return () => {
      socket.emit('leaveRoom', projectId);
      socket.off('newMessage', handleNewMessage);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [projectId]);

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // Create a temporary message for instant UI feedback
    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`,
      project: projectId,
      user: { _id: user._id, name: user.name },
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add the message to the state immediately
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setNewMessage('');

    try {
      // Send the message to the server in the background.
      // We no longer need to `await` the response here because the
      // socket listener will handle receiving the "real" message.
      await sendMessage(projectId, { content: optimisticMessage.content });
    } catch (err) {
      // If the API call fails, the user will have already seen their message.
      // The socket broadcast won't happen, so their message won't be "confirmed"
      // for others. In a more advanced implementation, we could show a "failed" icon.
      // For now, we'll log the error and avoid showing a disruptive alert.
      console.error('Failed to send message to server:', err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
        <div className={styles.loaderContainer}>
            <FiLoader className={styles.loaderIcon} />
        </div>
    );
  }
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      {/* Chat Header */}
      <header className={styles.header}>
        <BackButton to={`/project/${projectId}`} className={styles.backButton} />
        <div className={styles.projectAvatar}>
            {project?.title?.charAt(0).toUpperCase() || 'P'}
        </div>
        <div className={styles.projectInfo}>
            <h2>{project?.title}</h2>
            <p>Team Chat</p>
        </div>
      </header>

      {/* Messages Area */}
      <main className={styles.messagesArea}>
        {messages.map((msg, index) => {
          const isUser = msg.user?._id === user?._id;
          const prevMsg = messages[index - 1];
          const showAvatar = !prevMsg || prevMsg.user?._id !== msg.user?._id;

          return (
            <div key={msg._id} className={`${styles.messageGroup} ${isUser ? styles.isUser : ''} ${showAvatar ? styles.showAvatar : ''}`}>
              {showAvatar ? <UserAvatar name={msg.user?.name} /> : <div style={{width: '2.5rem'}} />}
              <div className={styles.messageContent}>
                {!isUser && showAvatar && <p className={styles.senderName}>{msg.user?.name}</p>}
                <p className={styles.messageText}>{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Form */}
      <footer className={styles.footer}>
        <form onSubmit={handleSendMessage} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className={styles.sendButton} disabled={!newMessage.trim()}>
            <FiSend className={styles.sendIcon} />
          </button>
        </form>
      </footer>
    </div>
  );
}