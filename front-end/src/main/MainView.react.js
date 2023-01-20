import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import AllAnn from '../Ann/Welcome.react'

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow:1,
  },
  cardContainer: {
    flexGrow:1,
    justifyContent:'center',
    marginBottom:8,
  },
  bottomButton: {
    alignItems: 'flex-end'

  },
});

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */
export default function MainView({ authToken, logoutUser, username, navigation}) {

  return (
    <View style={styles.mainContainer}>
      <View
        style={styles.cardContainer}>
        <AllAnn authToken={authToken} username={username} navigation={navigation}/>
      </View>
      <View
        style={styles.bottomButton}>
        <Button title="Log out" onPress={logoutUser} />
        <Button
      title="My Page"
      onPress={() => {navigation.navigate('MyPage', {
        username: username,
        authToken: authToken,
      })}}
      />
      </View>
    </View>
  );
}
