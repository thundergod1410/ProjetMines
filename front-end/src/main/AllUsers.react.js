import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import KivCard from '../common/KivCard.react';
import AllUsersItem from './AllUsersItem.react';
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
  profilePicture: {
    width: 24,
    height: 24,
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
export default function AllUsers({ authToken }) {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);

  const getAllUsersRequest = () => {
    setIsLoading(true);
    sendRequest('/users', 'GET', { token: authToken }, (status, data) => {
      setIsLoading(false);
      if (status == 200) {
        const parsedData = data.map(user => ({
          name: user[0], _password: user[1], isAdmin: user[2], canWrite: user[3], canRead: user[4]
        }))
        console.log(parsedData);
        setUsers(parsedData);
        setPermissionError(false);
      } else if(status == 403) {
        setPermissionError(true);
      }
    }, () => {setIsLoading(false);});
  }

  useEffect(() => {
    getAllUsersRequest();
  }, [authToken]);

  const renderItem = ({item}) => <AllUsersItem item={item} key={item.name} />;

  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          All Users
        </Text>
      </View>
      {hasPermissionError && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading &&
        <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      {users != null ? <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      /> : null}
      <Button title="Reload" disabled={isLoading} onPress={() => { getAllUsersRequest(); }} />
    </KivCard>
  );
}
