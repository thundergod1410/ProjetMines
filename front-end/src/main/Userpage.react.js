import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import KivCard from '../common/KivCard.react';

import DefaultProfilePicture from './DefaultProfilePicture.react';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 42,
  },
  profilePicture: {
    width: 100,
    height: 100,
  },
  userRow: {
    flexDirection: 'row',
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
});

/**
 * Displays all the users in Kivapp
 */
export default function Userpage({username}) {

  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          Mes informations
        </Text>
      </View>
      <View>
        <DefaultProfilePicture style={styles.profilePicture} />
        <Text>{username}</Text>
      </View>
    </KivCard>
  );
}