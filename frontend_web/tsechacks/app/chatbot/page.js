'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ChatMessage from '@/components/Chatbot/ChatMessage';
import SessionRecommendation from '@/components/Chatbot/SessionRecommendation';
import Button from '@/components/UI/Button';
import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';

export default function ChatbotPage() {
    const { data: initialHistory } = useFetch(() => api.getChatHistory());
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (initialHistory) {
            setMessages(initialHistory);
        }
    }, [initialHistory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await api.sendMessage(inputMessage);
            const assistantMessage = {
                id: `msg-${Date.now()}-ai`,
                role: 'assistant',
                content: response.content,
                timestamp: new Date().toISOString(),
                recommendations: response.recommendations || [],
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout activeTab="chatbot">
            <div className="h-[calc(100vh-180px)] flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">AI Learning Assistant</h1>
                    <p className="text-secondary-600">Get personalized session recommendations</p>
                </div>

                {/* Chat Container */}
                <div className="flex-1 bg-white rounded-lg shadow-soft flex flex-col overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🤖</div>
                                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                    Welcome to your AI Assistant
                                </h3>
                                <p className="text-secondary-600">
                                    Ask me about courses, sessions, or what you should learn next!
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <div key={message.id}>
                                        <ChatMessage message={message} />

                                        {/* Recommendations */}
                                        {message.recommendations && message.recommendations.length > 0 && (
                                            <div className="ml-11 mt-2 space-y-2">
                                                {message.recommendations.map((rec, idx) => (
                                                    <SessionRecommendation key={idx} recommendation={rec} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-center gap-2 text-secondary-500">
                                        <div className="w-8 h-8 rounded-full bg-secondary-700 flex items-center justify-center text-white">
                                            🤖
                                        </div>
                                        <div className="bg-white border border-secondary-200 rounded-lg p-4">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-secondary-200 p-4">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask about courses, sessions, or what to learn..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!inputMessage.trim() || isLoading}
                            >
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
