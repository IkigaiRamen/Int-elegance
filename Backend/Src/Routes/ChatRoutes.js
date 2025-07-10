const express = require("express");
const chatClient = require("../Config/StreamClient");
const StreamChat = require("stream-chat").StreamChat;
const router = express.Router();
const Message = require("../Models/Message");

// Create a channel
router.post("/channels", async (req, res) => {
  const { channelId } = req.body;
  try {
    const channel = chatClient.channel("messaging", channelId);
    await channel.create(); // Create a new channel
    res.status(201).json({ message: "Channel created", channelId });
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ message: "Error creating channel" });
  }
});

// Send a message and save it to the database
router.post("/channels/:channelId/message", async (req, res) => {
  const { channelId } = req.params;
  const { text, userId } = req.body;
  try {
    const channel = chatClient.channel("messaging", channelId);
    // Send the message via Stream API
    const message = await channel.sendMessage({
      text,
      user: { id: userId },
    });

    // Save the message in the database
    const savedMessage = new Message({
      text: message.text,
      userId: message.user.id,
      channelId: channelId,
      createdAt: message.created_at,
    });

    await savedMessage.save(); // Save to MongoDB

    res.status(200).json({ message: "Message sent and saved", savedMessage });
  } catch (error) {
    console.error("Error sending and saving message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Create token
router.post("/token", (req, res) => {
  const { userId } = req.body; // Get the user ID from the request
  const token = chatClient.createToken(userId); // Create a token for the user
  res.json({ token });
});

// Upsert users
router.post("/upsert-users", async (req, res) => {
  const { users } = req.body;
  try {
    await chatClient.upsertUsers(users);
    res.status(200).json({ message: "Users upserted successfully" });
  } catch (error) {
    console.error("Error upserting users:", error);
    res.status(500).json({ error: "Failed to upsert users" });
  }
});

// Example route to fetch messages for a channel
router.get("/channels/:channelId/messages", async (req, res) => {
  const { channelId } = req.params;
  try {
    const messages = await Message.find({ channelId }); // Assuming 'Message' is your message model
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
