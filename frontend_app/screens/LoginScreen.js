import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        const success = await login(email, password, role);
        if (success) {
            // Navigation will be handled automatically by the navigation structure
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Logo/Header */}
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="school" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.title}>Online Learning</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                {/* Role Selection */}
                <View style={styles.roleContainer}>
                    <Text style={styles.roleLabel}>Select Role:</Text>
                    <View style={styles.roleButtons}>
                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                role === 'student' && styles.roleButtonActive,
                            ]}
                            onPress={() => setRole('student')}
                        >
                            <Ionicons
                                name="person"
                                size={20}
                                color={role === 'student' ? colors.textWhite : colors.primary}
                            />
                            <Text
                                style={[
                                    styles.roleButtonText,
                                    role === 'student' && styles.roleButtonTextActive,
                                ]}
                            >
                                Student
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                role === 'teacher' && styles.roleButtonActive,
                            ]}
                            onPress={() => setRole('teacher')}
                        >
                            <Ionicons
                                name="briefcase"
                                size={20}
                                color={role === 'teacher' ? colors.textWhite : colors.primary}
                            />
                            <Text
                                style={[
                                    styles.roleButtonText,
                                    role === 'teacher' && styles.roleButtonTextActive,
                                ]}
                            >
                                Teacher
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color={colors.textLight} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={colors.textLight}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.textLight} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor={colors.textLight}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.textLight}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>

                {/* Demo Credentials */}
                {/* <View style={styles.demoContainer}>
                    <Text style={styles.demoText}>Demo: any email/password will work</Text>
                </View> */}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.linkText}>Sign Up</Text>
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
    },
    content: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body1,
        color: colors.textLight,
    },
    roleContainer: {
        marginBottom: spacing.lg,
    },
    roleLabel: {
        ...typography.body1,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.surface,
    },
    roleButtonActive: {
        backgroundColor: colors.primary,
    },
    roleButtonText: {
        ...typography.body1,
        fontWeight: '600',
        color: colors.primary,
        marginLeft: spacing.sm,
    },
    roleButtonTextActive: {
        color: colors.textWhite,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        fontSize: 16,
        color: colors.text,
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.md,
    },
    loginButtonText: {
        ...typography.button,
        color: colors.textWhite,
    },
    demoContainer: {
        marginTop: spacing.md,
        alignItems: 'center',
    },
    demoText: {
        ...typography.caption,
        fontStyle: 'italic',
    },
});

export default LoginScreen;
