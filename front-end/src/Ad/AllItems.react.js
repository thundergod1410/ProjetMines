import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


import DefaultProfilePicture from '../main/DefaultProfilePicture.react';

const styles = StyleSheet.create({
    profilePicture: {
        width: 100,
        height: 100,
    },
    userRow: {
        flexDirection: 'row',
    },
    name: {
        fontSize: 24
    }
});

/**
 * @typedef {{name:string, isAdmin:boolean, canWrite:boolean, canRead:boolean}} User
 * @param {User} item
 */
export default function AllUsersItem({item}) {
    return (
        <View style={styles.userRow}>
            {item.picture != null
                // We don't store the user's picture yet on the DB
                ? <Image
                    style={styles.profilePicture}
                    source={{ uri: item.picture }}
                />
                : <DefaultProfilePicture style={styles.profilePicture} />
            }
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.isAdmin ? ' - Admin' : null}</Text>
            
        </View>);
}