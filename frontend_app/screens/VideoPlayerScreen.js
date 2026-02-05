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

const VideoPlayerScreen = ({ route, navigation }) => {
    // Expect lectureId and other details from route params
    const { lectureId, title, description, courseId } = route.params || {};

    const videoRef = useRef(null);
    const { token, user } = useAuth();

    const [status, setStatus] = useState({});
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);

    // Initialize Session
    useEffect(() => {
        let mounted = true;

        const initializeSession = async () => {
            if (!lectureId) {
                Alert.alert("Error", "No lecture specified");
                navigation.goBack();
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
                        headers: { 'Authorization': `Bearer ${token}` } // Send auth token for stream
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    shouldPlay={true} // Auto play after load
                />
            </View>

            {/* Info Section */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.statusBadge}>
                    <View style={[styles.dot, { backgroundColor: colors.success }]} />
                    <Text style={styles.statusText}>Session Active</Text>
                </View>

                <Text style={styles.note}>
                    You are currently being billed for this session.
                    Pause the video to pause billing.
                    End the session to finalize payment.
                </Text>

                <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
                    <Text style={styles.endButtonText}>End Session</Text>
                </TouchableOpacity>
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
});

const white = '#FFFFFF';

export default VideoPlayerScreen;
