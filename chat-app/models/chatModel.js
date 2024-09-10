const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isGroupChat: { type: Boolean, default: false },
    chatName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
