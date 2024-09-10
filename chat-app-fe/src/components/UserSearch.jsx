import { useState } from 'react';
import axios from 'axios';
import { getToken, decodeToken } from '../utils/auth';  // Import helper functions
import PropTypes from 'prop-types';

const UserSearch = ({ startChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();  // Get the token from localStorage
      const response = await axios.get(`http://localhost:3000/api/auth/search?query=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },  // Add token to the headers
      });
      setUsers(response.data);  // Set the search results
    } catch (error) {
      console.error('Error searching users', error);
    }
  };

  const handleStartChat = async (user) => {
    try {
      const token = getToken();  // Get the token from localStorage
      const decodedToken = decodeToken(token);  // Decode the JWT token to get the logged-in user ID
      const senderId = decodedToken.id;  // This is the logged-in user ID

      // Call the API to find or create a chat between the logged-in user and the selected user
      const response = await axios.post(
        'http://localhost:3000/api/chat/findOrCreateChat',
        { senderId, receiverId: user._id },  // Pass both the logged-in user and the selected user's IDs
        { headers: { Authorization: `Bearer ${token}` } }
      );
      startChat(response.data);  // Pass the chat object to the parent component
    } catch (error) {
      console.error('Error starting chat', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Search</button>
      </form>
      <div>
        {users.map((user) => (
          <div key={user._id} className="border p-2 mb-2">
            {user.username}
            <button
              className="ml-4 bg-green-500 text-white p-1 rounded"
              onClick={() => handleStartChat(user)}  // Start the chat when the button is clicked
            >
              Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

UserSearch.propTypes = {
  startChat: PropTypes.func.isRequired,
};

export default UserSearch;
