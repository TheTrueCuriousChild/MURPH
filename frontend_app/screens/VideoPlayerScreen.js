import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
    BackHandler,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../constants/config';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');

// Mock Data for Preview Mode
const MOCK_QA = [
    { id: 1, user: 'John Doe', question: 'Can you explain the last part again?', answer: 'Sure! The key concept is...', date: '2h ago' },
    { id: 2, user: 'Alice Smith', question: 'Is this applicable to React Native?', answer: 'Yes, the same principles apply.', date: '5h ago' },
];

const MOCK_REVIEWS = [
    { id: 1, user: 'Mike Ross', rating: 5, comment: 'Excellent explanation!', date: '1d ago' },
    { id: 2, user: 'Rachel Green', rating: 4, comment: 'Good, but a bit fast.', date: '2d ago' },
];

const VideoPlayerScreen = ({ route, navigation }) => {
    // Expect lectureId and other details from route params
    const { lectureId, title, description, courseId } = route.params || {};

    console.log("VideoPlayerScreen Params:", JSON.stringify(route.params, null, 2));

    const videoRef = useRef(null);
    const { token, user } = useAuth();

    const [status, setStatus] = useState({});
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'qa', 'reviews'

    // Initialize Session
    useEffect(() => {
        let mounted = true;

        const initializeSession = async () => {
            if (!lectureId && !route.params?.videoUrl) {
                Alert.alert("Error", "No video specified");
                navigation.goBack();
                return;
            }

            // Direct Playback Mode (Preview)
            if (route.params?.videoUrl) {
                setVideoUrl(route.params.videoUrl);
                setLoading(false);
                return;
            }

            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                // 1. Start Session
                const startResponse = await fetch(`${API_URL}/session/start`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ lectureId })
                });

                const startData = await startResponse.json();

                if (!startData.success) {
                    Alert.alert("Error", startData.message || "Failed to start session");
                    navigation.goBack();
                    return;
                }

                if (mounted) {
                    const sid = startData.data.sessionId;
                    setSessionId(sid);

                    // 2. Set Video URL (The endpoint that streams the video)
                    // The backend checks for the active session cookie/token and session ID
                    setVideoUrl(`${API_URL}/session/${sid}/video`);
                    setIsSessionActive(true);
                    setLoading(false);
                }

            } catch (error) {
                console.error("Session initialization error:", error);
                Alert.alert("Error", "Could not connect to server");
                navigation.goBack();
            }
        };

        initializeSession();

        return () => {
            mounted = false;
        };
    }, [lectureId, token, navigation]);

    // Handle Back Press / Unmount -> End Session
    useEffect(() => {
        const backAction = () => {
            handleEndSession();
            return true; // prevent default behavior (we handle navigation after end)
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => {
            backHandler.remove();
            // Also try to end session on unmount safely
            if (isSessionActive) {
                // We can't await here easily, but we can fire and forget or use beacon if available
                endSessionApi();
            }
        };
    }, [sessionId, isSessionActive]);

    const endSessionApi = async () => {
        if (!sessionId) return;
        try {
            await fetch(`${API_URL}/session/${sessionId}/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
        } catch (e) {
            console.error("Error ending session:", e);
        }
    };

    const handleEndSession = async () => {
        if (loading) {
            navigation.goBack();
            return;
        }

        // Pause video first
        if (videoRef.current) {
            await videoRef.current.pauseAsync();
        }

        Alert.alert(
            "End Session?",
            "Are you sure you want to stop watching? This will end your session and calculate the final cost.",
            [
                {
                    text: "Cancel", style: "cancel", onPress: () => {
                        if (videoRef.current) videoRef.current.playAsync();
                    }
                },
                {
                    text: "End Session", style: "destructive", onPress: async () => {
                        setLoading(true);
                        await endSessionApi();
                        setLoading(false);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    // Playback Status Update (Pause/Resume Logic)
    // Note: To be precise with billing, we should hit the backend on pause/resume.
    // However, frequent calls might be bad. The backend tracks "Active" time based on session start/end and pauses.
    const handlePlaybackStatusUpdate = useCallback(async (newStatus) => {
        if (!newStatus.isLoaded) return;

        // Detect Pause State Change
        if (status.isPlaying && !newStatus.isPlaying && sessionId) {
            // User Paused
            try {
                await fetch(`${API_URL}/session/${sessionId}/pause`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) { console.error("Pause API error", e); }
        } else if (!status.isPlaying && newStatus.isPlaying && sessionId) {
            // User Resumed
            try {
                await fetch(`${API_URL}/session/${sessionId}/resume`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) { console.error("Resume API error", e); }
        }

        setStatus(newStatus);

        if (newStatus.didJustFinish) {
            handleEndSession();
        }
    }, [status, sessionId, token]);

    if (!lectureId) return null;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Starting Session...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleEndSession} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title || 'Lecture'}</Text>
            </View>

            {/* Video Player */}
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{
                        uri: videoUrl,
                        headers: videoUrl && videoUrl.includes(API_URL)
                            ? { 'Authorization': `Bearer ${token}` }
                            : undefined // Do not send headers for Signed S3 URLs
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    shouldPlay={true} // Auto play after load
                />
            </View>

            {/* Tabs Header */}
            <View style={styles.tabHeader}>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'overview' && styles.activeTabItem]}
                    onPress={() => setActiveTab('overview')}
                >
                    <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'qa' && styles.activeTabItem]}
                    onPress={() => setActiveTab('qa')}
                >
                    <Text style={[styles.tabText, activeTab === 'qa' && styles.activeTabText]}>Q&A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'reviews' && styles.activeTabItem]}
                    onPress={() => setActiveTab('reviews')}
                >
                    <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.infoContainer}>
                {activeTab === 'overview' && (
                    <>
                        {/* DEBUG INFO: Remove before production */}
                        <View style={{ padding: 10, backgroundColor: '#333' }}>
                            <Text style={{ color: '#EEE', fontSize: 10, fontFamily: 'monospace' }}>
                                URL: {videoUrl ? (videoUrl.length > 50 ? videoUrl.substring(0, 50) + '...' : videoUrl) : 'None'}
                            </Text>
                        </View>

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>

                        <View style={styles.statusBadge}>
                            <View style={[styles.dot, { backgroundColor: isSessionActive ? colors.success : colors.warning }]} />
                            <Text style={styles.statusText}>{isSessionActive ? 'Session Active' : 'Session Paused'}</Text>
                        </View>

                        {sessionId && (
                            <>
                                <Text style={styles.note}>
                                    You are currently being billed for this session.
                                    Pause the video to pause billing.
                                    End the session to finalize payment.
                                </Text>

                                <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
                                    <Text style={styles.endButtonText}>End Session</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'qa' && (
                    <View>
                        {MOCK_QA.map(item => (
                            <View key={item.id} style={styles.qaItem}>
                                <View style={styles.qaHeader}>
                                    <Text style={styles.qaUser}>{item.user}</Text>
                                    <Text style={styles.qaDate}>{item.date}</Text>
                                </View>
                                <Text style={styles.qaQuestion}>Q: {item.question}</Text>
                                <Text style={styles.qaAnswer}>A: {item.answer}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === 'reviews' && (
                    <View>
                        {MOCK_REVIEWS.map(item => (
                            <View key={item.id} style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewUser}>{item.user}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Ionicons name="star" size={14} color="#FFD700" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.reviewComment}>{item.comment}</Text>
                                <Text style={styles.reviewDate}>{item.date}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        color: colors.text,
        marginTop: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        padding: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: borderRadius.round,
        marginRight: spacing.md,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.textWhite,
        flex: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    videoContainer: {
        width: width,
        height: width * (9 / 16),
        backgroundColor: 'black',
        marginTop: 60, // Space for header
    },
    video: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        padding: spacing.lg,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.sm,
        color: colors.text,
    },
    description: {
        ...typography.body1,
        color: colors.textLight,
        marginBottom: spacing.lg,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginBottom: spacing.md,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    statusText: {
        color: colors.success,
        fontWeight: '600',
        fontSize: 12,
    },
    note: {
        ...typography.caption,
        color: colors.warning,
        marginBottom: spacing.xl,
        fontStyle: 'italic',
    },
    endButton: {
        backgroundColor: colors.error,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    endButtonText: {
        ...typography.button,
        color: white,
    },
    // Tabs Styles
    tabHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    tabItem: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.button,
        color: colors.textLight,
    },
    activeTabText: {
        color: colors.primary,
    },
    // QA Styles
    qaItem: {
        marginBottom: spacing.md,
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    qaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    qaUser: {
        fontWeight: 'bold',
        color: colors.text,
    },
    qaDate: {
        fontSize: 12,
        color: colors.textLight,
    },
    qaQuestion: {
        ...typography.body2,
        color: colors.text,
        fontWeight: '600',
        marginBottom: 2,
    },
    qaAnswer: {
        ...typography.body2,
        color: colors.textLight,
    },
    // Review Styles
    reviewItem: {
        marginBottom: spacing.md,
        padding: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    reviewUser: {
        fontWeight: 'bold',
        color: colors.text,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontWeight: 'bold',
        color: colors.text,
    },
    reviewComment: {
        ...typography.body2,
        color: colors.text,
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 10,
        color: colors.textLight,
    },
});

const white = '#FFFFFF';

export default VideoPlayerScreen;
