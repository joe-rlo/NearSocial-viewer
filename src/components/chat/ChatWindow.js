import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './ChatWindow.css';

const ChatWindow = ({ accountId }) => {
  const [message, setMessage] = useState('');
  const [sendDisabled, setSendDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesCollection = collection(db, 'messages');
  const messagesQuery = query(messagesCollection, orderBy('createdAt', 'desc'), limit(500));
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
  const messagesEndRef = useRef(null);

  const sendMessage = async (e) => {
	e.preventDefault();

	setSendDisabled(true);
	setTimeout(() => setSendDisabled(false), 1000); // Disable send button for 1 second

	await addDoc(messagesCollection, {
	  text: message,
	  createdAt: serverTimestamp(),
	  username: accountId,
	});

	setMessage('');
  };
  const [isFullScreen, setIsFullScreen] = useState(false);

	const getColor = (username) => {
	  let hash = 0;
	  for (let i = 0; i < username.length; i++) {
		hash = username.charCodeAt(i) + ((hash << 5) - hash);
	  }
	  let color = '#';
	  for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += ('00' + value.toString(16)).substr(-2);
	  }
	  return color;
	};

	useEffect(() => {
	  if (isOpen) {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	  }
	}, [messages, isOpen]);

	const toggleFullScreen = () => {
	  setIsFullScreen(!isFullScreen);
	};

	return (
	  <div>
	<button className="toggle-chat-button" onClick={() => setIsOpen(!isOpen)}>
	  {isOpen ? 'Hide Live Pack Chat' : 'Show Live Pack Chat'}
	</button>
	{!isOpen && messages && messages.length > 0 && (
	  <div className="last-message">
		<strong>{messages[messages.length - 1].username}</strong>: {messages[messages.length - 1].text}  {messages[messages.length - 1].createdAt && new Date(messages[messages.length - 1].createdAt.seconds * 1000).toLocaleTimeString()}
	  </div>
	)}

		{isOpen && (
		  <div className={`chat-window ${isFullScreen ? 'full-screen' : ''}`}>
		  <button className="full-screen-button" onClick={toggleFullScreen}>
			{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
		  </button>
		  <small className="chat-note"><i><b>Note:</b> This is all off-chain and public to all users on sharddog.social only. Have fun and be nice</i></small>
			<div className="messages">
			  {messages &&
				messages.map((msg) => (
				  <div key={msg.id} className="message">
					<strong style={{ color: getColor(msg.username) }}>{msg.username}</strong>:{' '}
					{msg.text}
					<span className="timestamp">
					  {msg.createdAt && new Date(msg.createdAt.seconds * 1000).toLocaleTimeString()}
					</span>
				  </div>
				))}
				<div ref={messagesEndRef} />
			</div>
	  <form onSubmit={sendMessage} className="chat-form">
		<input
		  value={message}
		  onChange={(e) => setMessage(e.target.value)}
		  placeholder="Type a message"
		  className="chat-input"
		/>
		<button type="submit" disabled={sendDisabled} className="send-button">Send</button>
	  </form>
	</div>
	)}
	</div>
  );
};

export default ChatWindow;
