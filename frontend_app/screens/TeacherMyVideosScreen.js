import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { teacherVideos } from '../constants/mockData';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import TeacherVideoCard from '../components/TeacherVideoCard';

const TeacherMyVideosScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Videos</Text>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => navigation.navigate('UploadContent')}
                >
                    <Ionicons name="add-circle-outline" size={20} color={colors.textWhite} />
                    <Text style={styles.uploadButtonText}>Upload Video</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {teacherVideos.map((video) => (
                    <TeacherVideoCard
                        key={video.id}
                        video={video}
                        onPress={() => navigation.navigate('VideoPlayer', {
                            videoParams: {
                                title: video.title,
                                source: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
                            }
                        })}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
        paddingTop: spacing.xxl, // Consistent with other screens
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h2,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
    },
    uploadButtonText: {
        ...typography.button,
        color: colors.textWhite,
        marginLeft: spacing.xs,
        fontSize: 14,
    },
    content: {
        paddingBottom: spacing.xl,
    },
});

export default TeacherMyVideosScreen;
