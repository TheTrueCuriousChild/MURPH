import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => logout(),
                },
            ]
        );
    };

    const MenuItem = ({ icon, title, subtitle, onPress, danger = false }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIcon, danger && { backgroundColor: colors.error + '20' }]}>
                <Ionicons
                    name={icon}
                    size={24}
                    color={danger ? colors.error : colors.primary}
                />
            </View>
            <View style={styles.menuText}>
                <Text style={[styles.menuTitle, danger && { color: colors.error }]}>
                    {title}
                </Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={48} color={colors.textWhite} />
                </View>
                <Text style={styles.name}>{user?.name || 'Student Name'}</Text>
                <Text style={styles.email}>{user?.email || 'student@example.com'}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.menuContainer}>
                    <MenuItem
                        icon="person-outline"
                        title="Edit Profile"
                        subtitle="Update your personal information"
                        onPress={() => Alert.alert('Info', 'Edit Profile feature coming soon')}
                    />
                    <MenuItem
                        icon="settings-outline"
                        title="Settings"
                        subtitle="App preferences and configurations"
                        onPress={() => Alert.alert('Info', 'Settings feature coming soon')}
                    />
                    <MenuItem
                        icon="notifications-outline"
                        title="Notifications"
                        subtitle="Manage notification preferences"
                        onPress={() => Alert.alert('Info', 'Notifications feature coming soon')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.menuContainer}>
                    <MenuItem
                        icon="help-circle-outline"
                        title="Help Center"
                        subtitle="Get help and support"
                        onPress={() => Alert.alert('Info', 'Help Center feature coming soon')}
                    />
                    <MenuItem
                        icon="mail-outline"
                        title="Contact Us"
                        subtitle="Send us your feedback"
                        onPress={() => Alert.alert('Info', 'Contact Us feature coming soon')}
                    />
                    <MenuItem
                        icon="document-text-outline"
                        title="Terms & Privacy"
                        subtitle="Legal information"
                        onPress={() => Alert.alert('Info', 'Terms & Privacy feature coming soon')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.menuContainer}>
                    <MenuItem
                        icon="log-out-outline"
                        title="Logout"
                        onPress={handleLogout}
                        danger={true}
                    />
                </View>
            </View>

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    name: {
        ...typography.h2,
    },
    email: {
        ...typography.body2,
        color: colors.textLight,
        marginTop: spacing.xs,
    },
    roleBadge: {
        backgroundColor: colors.primary + '20',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
    },
    roleBadgeText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: 'bold',
    },
    section: {
        marginTop: spacing.lg,
    },
    sectionTitle: {
        ...typography.h4,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    menuContainer: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    menuIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    menuText: {
        flex: 1,
    },
    menuTitle: {
        ...typography.body1,
        fontWeight: '600',
    },
    menuSubtitle: {
        ...typography.caption,
        marginTop: spacing.xs / 2,
    },
    version: {
        ...typography.caption,
        textAlign: 'center',
        padding: spacing.xl,
        color: colors.textLight,
    },
});

export default ProfileScreen;
