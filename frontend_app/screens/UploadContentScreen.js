import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const UploadContentScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const handlePublish = () => {
        if (!title || !description || !price) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Mock publish
        Alert.alert(
            'Success',
            'Your video has been published successfully!',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Upload Area */}
            <TouchableOpacity style={styles.uploadArea}>
                <Ionicons name="cloud-upload" size={48} color={colors.primary} />
                <Text style={styles.uploadText}>Tap to Upload Video</Text>
                <Text style={styles.uploadSubtext}>or drag and drop video files</Text>
            </TouchableOpacity>

            {/* Form Fields */}
            <View style={styles.form}>
                <Text style={styles.label}>Video Title <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter video title"
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor={colors.textLight}
                />

                <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What is this video about?"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor={colors.textLight}
                />

                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Development, Design, Business"
                    value={category}
                    onChangeText={setCategory}
                    placeholderTextColor={colors.textLight}
                />

                {/* Thumbnail Upload */}
                <Text style={styles.label}>Thumbnail</Text>
                <TouchableOpacity style={styles.thumbnailCard}>
                    <Ionicons name="image-outline" size={32} color={colors.textLight} />
                    <Text style={styles.thumbnailText}>Upload Thumbnail</Text>
                </TouchableOpacity>

                {/* Pricing */}
                <Text style={styles.label}>Price per Minute ($) <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textLight}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.publishButton}
                    onPress={handlePublish}
                >
                    <Text style={styles.publishButtonText}>Publish Video</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    uploadArea: {
        height: 200,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    uploadText: {
        ...typography.h3,
        color: colors.primary,
        marginTop: spacing.sm,
    },
    uploadSubtext: {
        ...typography.body2,
        color: colors.textLight,
        marginTop: spacing.xs,
    },
    form: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.body2,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    required: {
        color: colors.error,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
        ...typography.body1,
    },
    textArea: {
        height: 100,
    },
    thumbnailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    thumbnailText: {
        ...typography.body2,
        color: colors.textLight,
        marginLeft: spacing.sm,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.round,
        padding: spacing.md,
        alignItems: 'center',
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        ...typography.button,
        color: colors.text,
    },
    publishButton: {
        flex: 2,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.round,
        padding: spacing.md,
        alignItems: 'center',
        marginLeft: spacing.sm,
        ...shadows.md,
    },
    publishButtonText: {
        ...typography.button,
        color: colors.textWhite,
    },
});

export default UploadContentScreen;
