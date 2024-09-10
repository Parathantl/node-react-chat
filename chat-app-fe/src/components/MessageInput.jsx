import PropTypes from 'prop-types';
const MessageInput = ({ newMessage, setNewMessage, sendMessage }) => {
  return (
    <div className="message-input-container mt-4">
      <input
        type="text"
        className="p-2 w-3/4 border border-gray-400 rounded-lg"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-lg ml-2">
        Send
      </button>
    </div>
  );
};

// Prop validation for MessageInput
MessageInput.propTypes = {
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
};

export default MessageInput;
