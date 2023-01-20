import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    profilePicture: {
        width: 24,
        height: 24,
    },
    userRow: {
        flexDirection: 'row',
    }
});

/**
 * @typedef {{title:string, publication:timestamp, expiration:timestamp, starting_price:Float, current_price:Float, ceiling_price:float }} Ann
 * @param {Ann} item
 */
export default function AllAnnItem({item}) {
    return (
        <View style={styles.userRow}>
            <Text>Titre : {item.title} {"\n"}
            Date de publication: {item.publication}, Date d'expiration: {item.expiration} {"\n"}
            Prix initiale : {item.starting_price}, Prix en cours: {item.current_price}, Prix maximum: {item.ceiling_price}</Text>
        </View>);
}