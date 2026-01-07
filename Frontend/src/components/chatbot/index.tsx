import React, { useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatbotWindow from './ChatbotWindow';
import './Chatbot.css';

export interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const toggleChatbot = () => {
        setIsOpen(prev => !prev);
    };

    const closeChatbot = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <ChatbotWindow
                    onClose={closeChatbot}
                    messages={messages}
                    setMessages={setMessages}
                />
            )}
            <ChatbotIcon isOpen={isOpen} onClick={toggleChatbot} />
        </>
    );
};

export default Chatbot;
