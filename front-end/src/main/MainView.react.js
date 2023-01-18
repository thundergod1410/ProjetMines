import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import AllUsers from './AllUsers.react';
import Welcome from './Welcome.react';
import Userpage from './Userpage.react';

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
export default function MainView({ authToken, logoutUser}) {

  return (
    <View style={styles.mainContainer}>
      <View
        style={styles.cardContainer}>
        <AllUsers authToken={authToken}/>
      </View>
      <View
        style={styles.bottomButton}>
        <Button title="Log out" onPress={logoutUser} />
      </View>
    </View>
  );
}
