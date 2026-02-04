import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../constants/theme';

const SearchBar = ({ placeholder = 'Search courses...', onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={colors.textLight} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                placeholderTextColor={colors.textLight}
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                    <Ionicons name="close-circle" size={20} color={colors.textLight} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        height: 44,
        borderWidth: 1,
        borderColor: colors.border,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
});

export default SearchBar;
