import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatHistory as initialChatHistory, courses } from '../constants/mockData';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import ChatBubble from '../components/ChatBubble';

const AIAssistantScreen = () => {
    const [messages, setMessages] = useState(initialChatHistory);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef();

    const generateAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Simple keyword-based responses
        if (lowerMessage.includes('web') || lowerMessage.includes('development')) {
            return `Based on your interest in web development, I recommend the "Complete Web Development Bootcamp" by Dr. Angela Yu. It has a 4.8 rating and costs ₹2.50 per minute. This course covers HTML, CSS, JavaScript, React, and Node.js!`;
        } else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml') || lowerMessage.includes('ai')) {
            return `For machine learning, check out "Machine Learning A-Z" by Kirill Eremenko! It's highly rated (4.9 stars) and costs ₹3.00 per minute. Perfect for beginners and intermediate learners.`;
        } else if (lowerMessage.includes('python')) {
            return `I found "Python for Data Science" by Jose Portilla for you! It's great for learning Python with a focus on data analysis. Rated 4.6 stars and costs ₹2.60 per minute.`;
        } else if (lowerMessage.includes('design') || lowerMessage.includes('ui') || lowerMessage.includes('ux')) {
            return `If you're interested in design, "UI/UX Design Masterclass" by Daniel Schifano is excellent! It has a 4.9 rating and costs ₹2.00 per minute. Learn Figma, user research, and design principles.`;
        } else if (lowerMessage.includes('mobile') || lowerMessage.includes('react native')) {
            return `For mobile development, I recommend "React Native - The Practical Guide" by Maximilian Schwarzmüller. It's rated 4.7 stars and costs ₹2.80 per minute. Build real mobile apps!`;
        } else {
            return `I'd be happy to help you find the perfect course! What are you interested in learning? We have courses in:\n\n• Web Development\n• Machine Learning & AI\n• Python & Data Science\n• Mobile Development\n• UI/UX Design\n\nJust let me know your interests!`;
        }
    };

    const handleSend = () => {
        if (inputText.trim() === '') return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            message: inputText,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = inputText;
        setInputText('');

        // Simulate AI response after a short delay
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                message: generateAIResponse(userInput),
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 500);
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        message={msg.message}
                        isUser={msg.sender === 'user'}
                    />
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask for course recommendations..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        placeholderTextColor={colors.textLight}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() ? colors.textWhite : colors.textLight}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.xxl,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    inputContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        padding: spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colors.background,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        fontSize: 16,
        color: colors.text,
        paddingVertical: spacing.xs,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    sendButtonDisabled: {
        backgroundColor: colors.divider,
    },
});

export default AIAssistantScreen;
