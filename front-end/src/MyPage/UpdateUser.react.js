import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import KivTextInput from '../common/KivTextInput.react';
import KivCard from '../common/KivCard.react';

import { sendRequest } from '../common/sendRequest';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 24,
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row'
  },
  button: {
    flexGrow: 1,
    padding: 2
  },
});

export default function CreateAccount({ username }) {
  const [login, setLogin] = useState({username});
  const [email, setEmail] = useState('xyz@minedor.fr');

  const postMyPageRequest = () => {
    console.log('Axios', username)
    axios.post(`http://localhost:5000/users/${username}`,
      { headers: {Authorization: `Bearer ${authToken}` }},body: {login: {login}, email: {email}})
      .then(res => setUser(res.data))
  }

  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          Create Account
        </Text>
        </View>
      <KivTextInput label="New login" value={login} onChangeText={value => setLogin(value)} />
      <KivTextInput label="New email" value={email} onChangeText={value => setEmail(value)} />
        <View style={styles.button}>
          <Button title="Validate"  onPress={() => { postMyPageRequest(); }} />
        </View>
      
    </KivCard>
  );
}