import React, { useState, useEffect, useRef } from "react";
import { Chat, Channel, MessageList } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { getCurrentUserProfile } from "../../services/UserService";

// Header component for chat
const ChatHeader = ({ user, onBack }) => (
  <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
    <div className="d-flex align-items-center">
      <i className="icofont-arrow-left fs-4" onClick={onBack}></i>
      <img className="avatar rounded" src={user.profilePicture} alt="avatar" />
      <div className="ms-3">
        <h6 className="mb-0">{`${user.firstName} ${user.lastName}`}</h6>
      </div>
    </div>
  </div>
);

const CustomMessageList = ({ messages, currentUserId }) => {
  const messageEndRef = useRef(null); // Ref to scroll to the end of the messages

  useEffect(() => {
    // Scroll to the bottom whenever new messages are added
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Trigger scroll when messages change

  return (
    <ul
      className="chat-history list-unstyled"
      style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
    >
      {messages.map((message, index) => (
        <li
          key={`${message.id}-${index}`} // Use the message index to ensure uniqueness
          className={`mb-3 d-flex ${
            message.user.id === currentUserId ? "flex-row-reverse" : "flex-row"
          } align-items-end`}
        >
          <div className="max-width-70">
            {/* Display user info and timestamp */}
            <div className="user-info mb-1 d-flex align-items-center">
              {message.user.id !== currentUserId && (
                <img
                  className="avatar sm rounded-circle me-1"
                  src={message.user.image}
                  alt="avatar"
                />
              )}
              <span className="text-muted small">
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}, Today
              </span>
            </div>

            <div
              className="card border-0 p-3"
              style={{
                backgroundColor:
                  message.user.id === currentUserId ? "#4c3575" : "#f8f9fa", // Purple for user messages, light for others
                color: message.user.id === currentUserId ? "white" : "#6c757d", // White text for user messages, muted grey for others
              }}
            >
              <div className="message">{message.text}</div>
            </div>
          </div>
        </li>
      ))}
      <div ref={messageEndRef} /> {/* Empty div at the bottom to scroll to */}
    </ul>
  );
};

const MessageInputCustom = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message); // Debugging message send
      sendMessage(message); // Send the message to the channel
      setMessage(""); // Clear input after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Send message when Enter is pressed (without Shift key)
      e.preventDefault(); // Prevents new line insertion
      handleSend(); // Call the send function
    }
  };

  return (
    <div className="chat-message">
      <textarea
        className="form-control"
        placeholder="Enter text here..."
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress} // Listen for the Enter key
      ></textarea>
    </div>
  );
};

const chatClient = StreamChat.getInstance("anpxt5hctmpb");

const ChatContainer = ({ user, onBack }) => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const API_BASE_URL = "http://localhost:5000/api/chat";

    const initializeChat = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!userProfile || !userProfile._id || !user?._id) {
          throw new Error("Users are missing for the chat channel.");
        }

        const currentUserId = userProfile._id;
        const targetUserId = user._id;

        // Upsert users
        const users = [
          {
            id: currentUserId,
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            image: userProfile.profilePicture,
          },
          {
            id: targetUserId,
            name: `${user.firstName} ${user.lastName}`,
            image: user.profilePicture,
          },
        ];
        await fetch(`${API_BASE_URL}/upsert-users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ users }),
        });

        // Connect user if not already connected
        if (!chatClient.userID) {
          const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId }),
          });
          const { token } = await tokenResponse.json();

          await chatClient.connectUser(
            {
              id: currentUserId,
              name: `${userProfile.firstName} ${userProfile.lastName}`,
              image: userProfile.profilePicture,
            },
            token
          );

        
        }

        // Create or get channel (ensure that the channel ID is unique for the two users)
        const channelId = [currentUserId, targetUserId].sort().join("-");
        const existingChannel = chatClient.channel("messaging", channelId);

        // Check if channel exists
        const channelState = await existingChannel.query();

        if (channelState.messages.length > 0) {
          // Use existing channel and set messages
          setChannel(existingChannel);
          setMessages(channelState.messages); // Initialize with existing messages
        } else {
          // Create new channel if no messages exist
          const newChannel = chatClient.channel("messaging", channelId, {
            members: Array.from(new Set([currentUserId, targetUserId])),
          });

          await newChannel.watch();
          setChannel(newChannel);
          setMessages([]); // Initialize with empty array if no messages
        }

        // Listen for new messages
        existingChannel.on("message.new", (event) => {
          console.log("New message received:", event.message);
          setMessages((prevMessages) => {
            if (!prevMessages.some((msg) => msg.id === event.message.id)) {
              return [...prevMessages, event.message];
            }
            return prevMessages; // Avoid duplicate messages
          });
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load chat.");
        setLoading(false);
      }
    };

    initializeChat();

    return () => chatClient.disconnectUser();
  }, [user]);

  const sendMessage = (text) => {
    if (channel && text) {
      channel.sendMessage({ text });
    }
  };

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="chat-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingBottom: "80px", // Add padding to make space for the input box
      }}
    >
      <Chat client={chatClient} theme="messaging light">
        <ChatHeader user={user} onBack={onBack} />
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Channel channel={channel}>
            <CustomMessageList
              messages={messages}
              currentUserId={chatClient.userID}
            />
          </Channel>
          <div style={{ paddingTop: "10px" }}>
            <MessageInputCustom sendMessage={sendMessage} />
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default ChatContainer;
