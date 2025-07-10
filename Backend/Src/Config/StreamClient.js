const StreamChat = require('stream-chat').StreamChat;

// Replace with your actual keys
const apiKey = 'anpxt5hctmpb';
const apiSecret = 'qb3rsjyqb9ece3kcpeef9trsc4h3tupeqa4vj36b47t5rv3nrkqk4p9cbkymkvya';
const chatClient = StreamChat.getInstance(apiKey, apiSecret);

module.exports = chatClient;
