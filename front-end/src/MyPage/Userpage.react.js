import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';

import KivCard from '../common/KivCard.react';
import Header from '../header/Header.react';

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
export default function MyPage({navigation, route}) {
  const [user, setUser] = useState(null);
  const {username, authToken} = route.params;

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
    <View>
      <Header username={username}></Header>
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          My page
        </Text>
      {user != null ? 
        <View>
        <Text style={styles.text}> Login : {user[0]}</Text> 
        <Text style={styles.text}> Adresse-mail : {user[1]}</Text> 
        <Text style={styles.text}> Admin : {user[3].toString()}</Text>
        </View>
      : null}
      </View>
      <Button title="Reload" onPress={() => { getMyPageRequest(); }} />
    </KivCard>
    </View>
  );
}