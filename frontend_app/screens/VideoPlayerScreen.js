import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { qaData, reviewsData } from '../constants/mockData';
import QAList from '../components/QAList';
import ReviewsList from '../components/ReviewsList';

const VideoPlayerScreen = ({ route, navigation }) => {
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [activeTab, setActiveTab] = useState('qa'); // 'qa' or 'reviews'
    const [sessionActive, setSessionActive] = useState(false);

    // Mock video URL if not passed
    const { videoParams } = route.params || {};
    const videoSource = videoParams?.source || 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';
    const videoTitle = videoParams?.title || 'Introduction to Course';

    const handleSessionToggle = () => {
        if (sessionActive) {
            Alert.alert('Session Ended', 'Your learning session has been recorded.');
            setSessionActive(false);
        } else {
            Alert.alert('Session Started', 'Tracking your progress now.');
            setSessionActive(true);
        }
    };

    return (
        <View style={styles.container}>
            {/* Video Player Area */}
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: videoSource }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>

            {/* Video Info & Session Controls */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{videoTitle}</Text>

                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        style={[styles.sessionButton, sessionActive ? styles.endSession : styles.startSession]}
                        onPress={handleSessionToggle}
                    >
                        <Ionicons
                            name={sessionActive ? "stop-circle-outline" : "play-circle-outline"}
                            size={20}
                            color={colors.textWhite}
                        />
                        <Text style={styles.sessionText}>
                            {sessionActive ? 'End Session' : 'Start Session'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={() =>
                            status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()
                        }
                    >
                        <Ionicons
                            name={status.isPlaying ? "pause" : "play"}
                            size={24}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'qa' && styles.activeTab]}
                    onPress={() => setActiveTab('qa')}
                >
                    <Text style={[styles.tabText, activeTab === 'qa' && styles.activeTabText]}>Q & A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                    onPress={() => setActiveTab('reviews')}
                >
                    <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.contentContainer}>
                {activeTab === 'qa' ? (
                    <QAList data={qaData} />
                ) : (
                    <ReviewsList data={reviewsData} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'black',
    },
    video: {
        flex: 1,
    },
    infoContainer: {
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
    },
    startSession: {
        backgroundColor: colors.success,
    },
    endSession: {
        backgroundColor: colors.error,
    },
    sessionText: {
        ...typography.button,
        color: colors.textWhite,
        marginLeft: spacing.xs,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary + '20', // Light primary
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.button,
        color: colors.textLight,
    },
    activeTabText: {
        color: colors.primary,
    },
    contentContainer: {
        flex: 1,
    },
});

export default VideoPlayerScreen;
