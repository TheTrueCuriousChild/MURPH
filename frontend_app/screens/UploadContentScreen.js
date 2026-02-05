import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../constants/config';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const UploadContentScreen = ({ navigation, route }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);

    const { token } = useAuth();

    // Check for pre-selected course from navigation params
    useEffect(() => {
        if (route.params?.courseId) {
            setSelectedCourse(route.params.courseId);
        }
    }, [route.params]);

    // Fetch courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${API_URL}/teacher/courses`, {
                    headers: headers
                });
                const data = await response.json();
                if (data.success) {
                    setCourses(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        };
        fetchCourses();
    }, [token]);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setVideoFile(result.assets[0]);
            } else if (result.type === 'success') {
                // Fallback for older expo-document-picker versions
                setVideoFile(result);
            }
        } catch (err) {
            console.error('Unknown error: ', err);
            Alert.alert('Error', 'Failed to pick video');
        }
    };

    const handlePublish = async () => {
        if (!title || !description || !price || !selectedCourse || !videoFile) {
            Alert.alert('Error', 'Please fill in all required fields including Video and Course');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('pricePerMinute', price);
            formData.append('courseId', selectedCourse);
            formData.append('category', category);

            // Append file
            // React Native FormData expects: { uri, name, type }
            formData.append('lecture', {
                uri: videoFile.uri,
                name: videoFile.name || `video_${Date.now()}.mp4`,
                type: videoFile.mimeType || 'video/mp4',
            });

            // Note: Do NOT set Content-Type header manually for FormData in React Native
            const headers = {
                'Accept': 'application/json',
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/teacher/lectures`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert(
                    'Success',
                    'Your video has been uploaded successfully!',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Error', data.message || 'Failed to publish video');
            }
        } catch (error) {
            console.error("Upload error", error);
            Alert.alert('Error', 'Failed to publish video. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Upload Area */}
            <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
                <Ionicons
                    name={videoFile ? "checkmark-circle" : "cloud-upload"}
                    size={48}
                    color={videoFile ? colors.success : colors.primary}
                />
                <Text style={styles.uploadText}>
                    {videoFile ? 'Video Selected' : 'Tap to Upload Video'}
                </Text>
                <Text style={styles.uploadSubtext}>
                    {videoFile ? videoFile.name : 'or select a video file'}
                </Text>
            </TouchableOpacity>

            {/* Form Fields */}
            <View style={styles.form}>
                <Text style={styles.label}>Select Course <Text style={styles.required}>*</Text></Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCourse}
                        onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a course..." value="" />
                        {courses.map((course) => (
                            <Picker.Item key={course.id} label={course.title} value={course.id} />
                        ))}
                    </Picker>
                </View>

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

                {/* Thumbnail Upload - Future Enhancement */}
                <Text style={styles.label}>Thumbnail</Text>
                <TouchableOpacity style={styles.thumbnailCard}>
                    <Ionicons name="image-outline" size={32} color={colors.textLight} />
                    <Text style={styles.thumbnailText}>Upload Thumbnail (Optional)</Text>
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
                    style={[styles.publishButton, loading && { opacity: 0.7 }]}
                    onPress={handlePublish}
                    disabled={loading}
                >
                    <Text style={styles.publishButtonText}>
                        {loading ? 'Uploading...' : 'Publish Video'}
                    </Text>
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
        paddingHorizontal: spacing.sm,
        textAlign: 'center'
    },
    form: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.body2,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginTop: spacing.md,
        color: colors.text
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
    pickerContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
    },
    picker: {
        height: 50,
        width: '100%',
        color: colors.text,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
        marginTop: spacing.md,
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
