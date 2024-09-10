const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

// Get all chats for the logged-in user
exports.getAllUserChats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all chats where the logged-in user is a member
        const chats = await Chat.find({ members: { $in: [userId] } })
            .populate('members', 'username email')  // Populate user details
            .sort({ updatedAt: -1 });  // Sort by the most recent chat

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
    }
};

exports.findOrCreateChat = async (req, res) => {
    const { senderId, receiverId } = req.body;  // Extract both IDs from the request body

    try {
        // Check if a chat already exists between the two users (for one-to-one chat)
        let chat = await Chat.findOne({
            isGroupChat: false,
            members: { $all: [senderId, receiverId] },  // Check if a chat already exists between both users
        });

        // If no chat exists, create a new one
        if (!chat) {
            chat = new Chat({
                members: [senderId, receiverId],  // Add both the logged-in user and the selected user to members
                isGroupChat: false,
            });
            await chat.save();
        }

        res.status(200).json(chat);  // Return the chat (either found or newly created)
    } catch (error) {
        res.status(500).json({ message: 'Error finding or creating chat', error });
    }
};

// Send a message
exports.createMessage = async (req, res) => {
    const { chatId, message } = req.body;
  
    try {
      // Create a new message
      const newMessage = new Message({
        chatId,  // Reference to the chat this message belongs to
        sender: req.user._id,  // Get the logged-in user's ID (via middleware like `protect`)
        message,  // The actual message content
      });
  
      // Save the message in the database
      await newMessage.save();
  
      // Optionally, populate the sender's details before returning the message
      await newMessage.populate('sender', 'username');
  
      // Update the chat's `updatedAt` timestamp to reflect recent activity
      await Chat.findByIdAndUpdate(chatId, { updatedAt: Date.now() });
  
      // Return the newly created message to the client
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error });
    }
  };

// Get all messages in a chat
exports.getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chatId }).populate('sender', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages' });
    }
};
