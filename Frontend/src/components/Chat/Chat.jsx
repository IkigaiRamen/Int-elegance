import React, { useEffect, useState } from 'react';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { getUserIdFromToken } from '../../services/AuthService';

const ChatB = ({ channelId, userIds }) => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const chatClient = StreamChat.getInstance('anpxt5hctmpb');

    const connectUser = async () => {
      try {
        await chatClient.disconnectUser();

        // Fetch the user token
        const response = await fetch('http://localhost:5000/api/chat/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error('Failed to fetch token');

        const data = await response.json();
        const userToken = data.token;

        // Upsert users using the server endpoint
        const users = userIds.map(user => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
        }));

        await fetch('http://localhost:5000/api/chat/upsert-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users }),
        });

        // Connect the user to the chat client
        await chatClient.connectUser({ id: userId }, userToken);
        setClient(chatClient);

        // Format members to include only user IDs and add 'ikigaiRamen' as admin
        const formattedMembers = [
          ...userIds.map(user => ({ user_id: user._id })),
        ];

        const newChannel = chatClient.channel('messaging', channelId, {
          members: formattedMembers,
        });

        await newChannel.watch();
        setChannel(newChannel);
        setLoading(false);
      } catch (error) {
        console.error('Error connecting user:', error);
        setError('Failed to connect to chat. Please try again.');
        setLoading(false);
      }
    };

    connectUser();

    return () => {
      if (client) {
        client.disconnectUser(); // Clean up on unmount
      }
    };
  }, [userId, channelId, userIds]);

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div>{error}</div>;
  if (!client || !channel) return <div>Error loading chat. Please try again.</div>;

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default ChatB;
