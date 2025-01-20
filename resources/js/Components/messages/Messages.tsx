import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input } from '@chakra-ui/react';

interface Message {
	name: string;
	text: string;
}

function Messages() {
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [message, setMessage] = useState('');

	const addMessage = () => {
		if (message) {
			axios.post('/messages', { message: message })
			setMessage('');
		}
	};

	window.Echo.private('messages')
		.listen('MessageSent', (e: any) => {
			console.log(e);
      setMessages([...messages, { name: e.name, text: e.text }]);
    },
  );

	return (
		<div>
			<h1>Messages</h1>
				{messages.map((message, index) => (
					<div className={'border'} key={index}>
						<p>Username: {message.name}</p>
						<p>Text: {message.text}</p>
					</div>
				))}
			<Input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<Button onClick={addMessage}>Add Message</Button>
		</div>

	);
}

export default Messages;
