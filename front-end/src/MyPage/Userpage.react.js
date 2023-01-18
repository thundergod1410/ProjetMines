import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';

import KivCard from '../common/KivCard.react';
import { sendRequest } from '../common/sendRequest';
import AllUsersItem from '../main/AllUsersItem.react';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 56,
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
  text: {
    fontSize: 24,
    alignItems: 'center'
  }
});

/**
 * Displays all the users in Kivapp
 */
export default function MyPage({ authToken, username }) {
  const [user, setUser] = useState(null);
  const [hasPermissionError, setPermissionError] = useState(false);

  const getMyPageRequest = () => {
    console.log('Axios', username)
    axios.get(`http://localhost:5000/users/${username}`,
      { headers: {Authorization: `Bearer ${authToken}` }})
      .then(res => setUser(res.data))
  }

  useEffect(() => {
    getMyPageRequest();
  }, []);

  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          My page
        </Text>
      </View>
      {hasPermissionError && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {/* {user != null ? <AllUsersItem item={user}/> : null} */}
      {user != null ? 
        <View>
        <Text style={styles.text}> Login : {user[0]}</Text> 
        <Text style={styles.text}> Adresse-mail : {user[1]}</Text> 
        <Text style={styles.text}> Admin : {user[3].toString()}</Text>
        </View>
      : null}
    </KivCard>
  );
}