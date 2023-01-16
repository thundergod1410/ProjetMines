import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1E88E5',
        padding: 8
    }
});

export default function Header({ username }) {
    const text = username == null ? <Text>Logged out</Text>
        : <Text>Logged in as {username}</Text>;
    return (<View style={styles.header}>{text}</View>);
}
