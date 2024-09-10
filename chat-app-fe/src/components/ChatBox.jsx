import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { getToken } from '../utils/auth';
import PropTypes from 'prop-types';

let socket;

const ChatBox = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!chatId) return;

    // Fetch messages for the chat when the component loads
    const fetchMessages = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://localhost:3000/api/chat/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
        scrollToBottom();  // Scroll to bottom after loading messages
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();

    // Initialize Socket.IO client and join the chat room
    socket = io('http://localhost:3000');
    socket.emit('joinRoom', { chatId });

    // Listen for new messages
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();  // Scroll to the bottom when a new message is received
    });

    return () => {
      socket.disconnect();  // Clean up the socket connection
    };
  }, [chatId]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:3000/api/chat/send',
        { chatId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit the message to the Socket.IO server
      socket.emit('sendMessage', response.data);

      setNewMessage('');  // Clear the input field after sending the message
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 mb-4">
        <h4 className="text-xl mb-4">Chat</h4>
        <div className="messages-list max-h-[400px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 border mb-2">
              {msg.sender?.username || 'Unknown'}: {msg.message}
            </div>
          ))}
          <div ref={messagesEndRef}></div> {/* Reference to the bottom of the message list */}
        </div>
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 w-full">
        Send
      </button>
    </div>
  );
};

ChatBox.propTypes = {
  chatId: PropTypes.string.isRequired,
};

export default ChatBox;
