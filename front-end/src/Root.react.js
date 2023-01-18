import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoggedOutView from './loggedOut/LoggedOutView.react';
import MainView from './main/MainView.react';
import Header from './header/Header.react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    width: '100%',
    height: '100%',
    flex: 1
  }
});

export default function Root() {
  const [username, setUsername] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const onLogUser = (username, authToken) => {
    setUsername(username);
    setAuthToken(authToken);
  }

  const logoutUser = () => {
    setUsername(null);
    setAuthToken(null);
  }

  return (
    <View style={{flex: 1}}>
      <Header username={username} />
      <View style={styles.container}>
        {authToken != null ?
          <MainView authToken={authToken} logoutUser={logoutUser} username={username} />
          : <LoggedOutView onLogUser={onLogUser} />}
      </View>
    </View>
  );
}
