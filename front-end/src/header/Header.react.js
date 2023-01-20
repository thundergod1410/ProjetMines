import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#DAA520',
        padding: 6,
    },
    titleContainer: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderColor: 'black',
        borderWidth: 2
    },
    title: {
        fontSize: 45, 
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: 'black'
},
});

export default function Header({ username }) {
    const text = username == null ? <Text >Logged out</Text>
        : <Text>Logged in as {username}</Text>;
    return (
    <View>
        <Text>{text}</Text>
        <View style={styles.titleContainer}><Text style={styles.title}>Mine D'Or</Text></View>
    </View>
    );
}
