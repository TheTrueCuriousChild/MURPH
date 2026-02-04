import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const ChatBubble = ({ message, isUser = false }) => {
    return (
        <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
                    {message}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.xs,
        paddingHorizontal: spacing.md,
    },
    userContainer: {
        alignItems: 'flex-end',
    },
    aiContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: spacing.xs,
    },
    aiBubble: {
        backgroundColor: colors.surface,
        borderBottomLeftRadius: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    text: {
        ...typography.body2,
    },
    userText: {
        color: colors.textWhite,
    },
    aiText: {
        color: colors.text,
    },
});

export default ChatBubble;
