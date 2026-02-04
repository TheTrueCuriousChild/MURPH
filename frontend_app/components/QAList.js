import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const QAList = ({ data }) => {
    const [question, setQuestion] = useState('');

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.questionHeader}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.questionText}>{item.question}</Text>

            {item.answers && item.answers.length > 0 && (
                <View style={styles.answersContainer}>
                    {item.answers.map(answer => (
                        <View key={answer.id} style={styles.answerItem}>
                            <View style={styles.answerHeader}>
                                <Text style={styles.answerUser}>{answer.user}</Text>
                                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                            </View>
                            <Text style={styles.answerText}>{answer.text}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask a question..."
                    value={question}
                    onChangeText={setQuestion}
                    placeholderTextColor={colors.textLight}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={20} color={colors.textWhite} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 80, // Space for input
    },
    itemContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    user: {
        ...typography.body2,
        fontWeight: 'bold',
        color: colors.primary,
    },
    timestamp: {
        ...typography.caption,
        color: colors.textLight,
    },
    questionText: {
        ...typography.body1,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    answersContainer: {
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    answerItem: {
        marginBottom: spacing.xs,
        backgroundColor: colors.background,
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    answerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    answerUser: {
        ...typography.caption,
        fontWeight: 'bold',
        marginRight: spacing.xs,
        color: colors.secondary,
    },
    answerText: {
        ...typography.body2,
        color: colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.sm,
        color: colors.text,
    },
    sendButton: {
        backgroundColor: colors.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default QAList;
