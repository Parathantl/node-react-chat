const socketIO = require('socket.io');

const initializeSocket = (server) => {
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow requests from your frontend
        methods: ['GET', 'POST'],
    },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a chat room
        socket.on('joinRoom', ({ chatId }) => {
            socket.join(chatId);
            console.log(`User joined room: ${chatId}`);
        });

        // Handle when a user sends a message
        socket.on('sendMessage', (message) => {
            // Emit the new message to everyone in the chat room
            io.to(message.chatId).emit('newMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = initializeSocket;
