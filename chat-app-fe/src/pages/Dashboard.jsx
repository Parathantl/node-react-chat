import { useState } from 'react';
import ChatList from '../components/ChatList';
import UserSearch from '../components/UserSearch';
import ChatBox from '../components/ChatBox';
import { removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null); // Stores the selected chat
  const [selectedUser, setSelectedUser] = useState(null); // Stores the selected user for new chats

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const startChat = (chat) => {
    if (chat._id) {
      setSelectedChat(chat);  // Open existing chat
    } else {
      setSelectedUser(chat);  // Start a new chat if none exists
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl text-center">Dashboard</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mb-4">Logout</button>

      {!selectedChat && !selectedUser ? (
        <>
          <UserSearch startChat={startChat} />
          <ChatList startChat={startChat} />
        </>
      ) : (
        <ChatBox chatId={selectedChat ? selectedChat._id : null} selectedUser={selectedUser} />
      )}
    </div>
  );
};

export default Dashboard;
