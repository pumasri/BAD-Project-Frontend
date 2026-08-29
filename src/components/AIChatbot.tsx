import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { api } from '../utils';

interface Message {
  text: string;
  isUser: boolean;
  id: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm the campus assistant. I can help you find lost items or report something you've lost. How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newUserMsg: Message = { text: userText, isUser: true, id: Date.now().toString() };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: userText });
      
      setMessages((prev) => [
        ...prev,
        { text: response.text, isUser: false, id: (Date.now() + 1).toString() },
      ]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I am having trouble connecting right now. Please try again later or check if the API key is set on the server.',
          isUser: false,
          id: (Date.now() + 1).toString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h3>Campus AI Assistant</h3>
              <p>Powered by Gemini</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="chatbot-close">
              <X size={20} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-message-wrapper ${
                  msg.isUser ? 'chatbot-message-user' : 'chatbot-message-ai'
                }`}
              >
                <div className="chatbot-message-bubble">{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message-wrapper chatbot-message-ai">
                <div className="chatbot-message-bubble chatbot-loading">
                  <Loader2 className="chatbot-spinner" size={16} /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button type="button" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
