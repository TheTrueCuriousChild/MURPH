import React, { createContext, useState, useContext } from 'react';
import { API_URL } from '../constants/config';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    const login = async (email, password, role) => {
        try {
            const endpoint = role === 'teacher' ? '/teacher/login' : '/user/login';
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Backend is returning cookie-based auth (no token in body)
                // We extract what we can or rely on the fact success=true

                // Construct minimal user object from inputs since backend doesn't return it
                const userData = { email, role };

                // Try to get token from headers if possible, otherwise leave null
                // Note: React Native fetch might not expose Set-Cookie easily without specific networking libraries
                // For now, we trust the success flag.
                const setCookieHeader = response.headers.get('set-cookie');
                if (setCookieHeader) {
                    const match = setCookieHeader.match(/accessToken=([^;]+)/);
                    if (match && match[1]) setToken(match[1]);
                }

                setUser(userData);
                setIsAuthenticated(true);
                return true;
            } else {
                Alert.alert('Login Failed', data.message || 'Invalid credentials');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Login Error', 'Something went wrong. Check connection.');
            return false;
        }
    };

    const signup = async (username, email, password, role) => {
        try {
            const endpoint = role === 'teacher' ? '/teacher/signup' : '/user/signup';
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                return true;
            } else {
                Alert.alert('Signup Failed', data.message || 'Failed to register');
                return false;
            }
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert('Signup Error', 'Something went wrong. Check connection.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, token, login, signup, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
