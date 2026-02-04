'use client';

import TeacherLayout from '@/components/Layout/TeacherLayout';
import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiSparkles, HiUser } from 'react-icons/hi2';
import { IoSparkles } from 'react-icons/io5';

// Reuse ChatMessage component styling but adapted for teacher context
function ChatMessage({ message }) {
    const isUser = message.role === 'user';
    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-100 text-primary-600' : 'bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white'
                }`}>
                {isUser ? <HiUser className="w-5 h-5" /> : <IoSparkles className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-white border border-secondary-200 shadow-sm rounded-tl-sm text-secondary-800'
                }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
        </div>
    );
}

export default function TeacherAssistantPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hello! I\'m your teaching assistant. I can help you with content ideas, lesson planning, or recommend courses for your own learning. How can I help today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "That's a great topic! Teaching React Hooks effectively requires practical examples. I'd enable creating a project-based lesson plan. Also, check out the 'Advanced React Patterns' course in the Browse section for inspiration on how structure complex topics."
            };
            setMessages(prev => [...prev, aiResponse]);
            setLoading(false);
        }, 1500);
    };

    return (
        <TeacherLayout activeTab="assistant">
            <div className="max-w-4xl mx-auto h-[cale(100vh-140px)] flex flex-col h-full">
                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-200">
                        <IoSparkles className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-secondary-900">AI Teaching Assistant</h1>
                    <p className="text-secondary-600">Get help with content creation and personalized recommendations</p>
                </div>

                {/* Chat Container */}
                <div className="flex-1 bg-secondary-50 border border-secondary-200 rounded-2xl overflow-hidden flex flex-col shadow-inner">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                                    <IoSparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border border-secondary-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-secondary-200">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for content ideas or recommendations..."
                                className="w-full pl-6 pr-14 py-4 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <HiPaperAirplane className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
