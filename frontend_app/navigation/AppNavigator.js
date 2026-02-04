import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/theme';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MyCoursesScreen from '../screens/MyCoursesScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import WalletScreen from '../screens/WalletScreen';
import ViewingHistoryScreen from '../screens/ViewingHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Teacher Screens
import TeacherDashboardScreen from '../screens/TeacherDashboardScreen';
import TeacherMyVideosScreen from '../screens/TeacherMyVideosScreen';
import TeacherWalletScreen from '../screens/TeacherWalletScreen';
import TeacherProfileScreen from '../screens/TeacherProfileScreen';
import UploadContentScreen from '../screens/UploadContentScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'My Courses':
                            iconName = focused ? 'book' : 'book-outline';
                            break;
                        case 'AI Assistant':
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case 'Wallet':
                            iconName = focused ? 'wallet' : 'wallet-outline';
                            break;
                        case 'History':
                            iconName = focused ? 'time' : 'time-outline';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingBottom: 30,
                    paddingTop: 5,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="My Courses" component={MyCoursesScreen} />
            <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
            <Tab.Screen name="Wallet" component={WalletScreen} />
            <Tab.Screen name="History" component={ViewingHistoryScreen} />
        </Tab.Navigator>
    );
};

const TeacherTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'TeacherHome':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'MyVideos':
                            iconName = focused ? 'videocam' : 'videocam-outline';
                            break;
                        case 'TeacherWallet':
                            iconName = focused ? 'wallet' : 'wallet-outline';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingBottom: 30, // Consistent with user changes
                    paddingTop: 5,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 20,
                },
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 15 }}>
                        <TouchableOpacity style={{ marginRight: 15 }}>
                            <Ionicons name="notifications-outline" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
                            <Ionicons name="person-circle-outline" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                ),
            })}
        >
            <Tab.Screen
                name="TeacherHome"
                component={TeacherDashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <Tab.Screen
                name="MyVideos"
                component={TeacherMyVideosScreen}
                options={{ title: 'My Videos' }}
            />
            <Tab.Screen
                name="TeacherWallet"
                component={TeacherWalletScreen}
                options={{ title: 'Wallet' }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.surface,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={SignupScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        {user?.role === 'teacher' ? (
                            <Stack.Screen
                                name="TeacherDashboard"
                                component={TeacherTabNavigator}
                                options={{ headerShown: false }}
                            />
                        ) : (
                            <Stack.Screen
                                name="StudentDashboard"
                                component={StudentTabNavigator}
                                options={{ headerShown: false }}
                            />
                        )}

                        <Stack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{
                                title: 'Profile',
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="TeacherProfile"
                            component={TeacherProfileScreen}
                            options={{
                                title: 'Teacher Profile',
                            }}
                        />
                        <Stack.Screen
                            name="UploadContent"
                            component={UploadContentScreen}
                            options={{
                                title: 'Upload Content',
                            }}
                        />
                        <Stack.Screen
                            name="VideoPlayer"
                            component={VideoPlayerScreen}
                            options={{
                                title: 'Now Playing',
                                headerShown: true, // Show header for back button
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
