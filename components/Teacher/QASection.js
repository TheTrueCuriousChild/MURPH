'use client';

import { useState } from 'react';
import { HiUserCircle, HiChatBubbleLeftRight } from 'react-icons/hi2';
import Button from '@/components/UI/Button';

export default function QASection({ questions }) {
    const [replyText, setReplyText] = useState('');
    const [activeQuestion, setActiveQuestion] = useState(null);

    const handleReply = (questionId) => {
        // Implementation for API call to add reply
        console.log('Replying to question', questionId, replyText);
        setReplyText('');
        setActiveQuestion(null);
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center py-8 text-secondary-500 bg-secondary-50 rounded-lg">
                <p>No questions asked yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {questions.map((q) => (
                <div key={q.id} className="p-4 bg-white rounded-lg border border-secondary-200">
                    {/* Question */}
                    <div className="flex gap-3 mb-3">
                        <HiUserCircle className="w-8 h-8 text-secondary-400 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-secondary-900">{q.studentName}</span>
                                <span className="text-xs text-secondary-500">{q.date}</span>
                            </div>
                            <p className="text-secondary-700 text-sm">{q.question}</p>
                        </div>
                    </div>

                    {/* Replies */}
                    <div className="ml-11 space-y-3">
                        {q.replies?.map((reply) => (
                            <div key={reply.id} className="flex gap-3 bg-secondary-50 p-3 rounded-lg">
                                <img src="/avatar-placeholder.jpg" className="w-6 h-6 rounded-full bg-primary-100" alt="Teacher" />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-primary-700">{reply.teacherName} (You)</span>
                                        <span className="text-[10px] text-secondary-500">{reply.date}</span>
                                    </div>
                                    <p className="text-xs text-secondary-600">{reply.reply}</p>
                                </div>
                            </div>
                        ))}

                        {/* Reply Input */}
                        {activeQuestion === q.id ? (
                            <div className="mt-2">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full text-sm border border-secondary-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Write your answer..."
                                    rows="2"
                                />
                                <div className="flex gap-2 mt-2 justify-end">
                                    <button
                                        onClick={() => setActiveQuestion(null)}
                                        className="text-xs text-secondary-600 hover:text-secondary-900"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleReply(q.id)}
                                        className="text-xs px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setActiveQuestion(q.id)}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                                <HiChatBubbleLeftRight className="w-3 h-3" />
                                Reply
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
