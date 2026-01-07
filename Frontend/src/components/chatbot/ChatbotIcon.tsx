import React from 'react';

interface ChatbotIconProps {
    isOpen: boolean;
    onClick: () => void;
}

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ isOpen, onClick }) => {
    return (
        <button
            className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
            onClick={onClick}
            aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
        >
            {isOpen ? (
                // Close Icon
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            ) : (
                // Chat Icon
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    <circle cx="8" cy="10" r="1.5" />
                    <circle cx="12" cy="10" r="1.5" />
                    <circle cx="16" cy="10" r="1.5" />
                </svg>
            )}
        </button>
    );
};

export default ChatbotIcon;
