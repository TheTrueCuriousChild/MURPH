export default function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${isUser ? 'bg-primary-100 text-primary-700' : 'bg-secondary-700 text-white'
                        }`}>
                        {isUser ? 'You' : '🤖'}
                    </div>

                    {/* Message Content */}
                    <div>
                        <div className={`rounded-lg p-4 ${isUser
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-secondary-200 text-secondary-900'
                            }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {/* Timestamp */}
                        <p className={`text-xs text-secondary-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
