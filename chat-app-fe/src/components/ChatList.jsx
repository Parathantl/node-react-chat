import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUserIdFromToken } from '../utils/auth';  // Import the functions
import PropTypes from 'prop-types';

const ChatList = ({ startChat }) => {
  const [chats, setChats] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = getToken();  // Get the JWT token
        const userId = getUserIdFromToken();  // Get the logged-in user's ID from the token
        setLoggedInUserId(userId);  // Store the logged-in user ID

        const response = await axios.get('http://localhost:3000/api/chat', {
          headers: { Authorization: `Bearer ${token}` },  // Send the token in headers
        });
        setChats(response.data);  // Set the fetched chats in state
      } catch (error) {
        console.error('Error fetching chats', error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl mb-4">Your Chats</h3>
      <ul>
        {chats.map((chat) => {
          // For one-to-one chats, find the other participant's username
          const otherParticipant = chat.members.find(
            (member) => member._id !== loggedInUserId
          );

          return (
            <li key={chat._id} className="border p-2 mb-2">
              {chat.isGroupChat
                ? chat.chatName
                : otherParticipant?.username || 'Unnamed Chat'}  {/* Show the other participant's name for one-to-one chats */}
              <button
                className="ml-4 bg-green-500 text-white p-1 rounded"
                onClick={() => startChat(chat)}  // Pass the chat object to the parent component
              >
                Open Chat
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ChatList.propTypes = {
  startChat: PropTypes.func.isRequired,
};

export default ChatList;
