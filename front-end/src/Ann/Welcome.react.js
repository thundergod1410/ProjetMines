import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import KivCard from '../common/KivCard.react';
import AllAnnItem from './AnnItems.react';
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
 * Displays all the ads in Kivapp
 */
export default function AllAnn({ authToken, navigation }) {
  const [ann, setAnn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);

  const getAllAnnRequest = () => {
    setIsLoading(true);
    sendRequest('/ann', 'GET', { token: authToken }, (status, data) => {
      setIsLoading(false);
      if (status == 200) {
        const parsedData = data.map(ann => ({
          title: ann[0], description: ann[1], publication: ann[2], expiration: ann[3], starting_price: ann[4], current_price: ann[5], ceiling_price: ann[6]
        }))
        console.log(parsedData);
        setAnn(parsedData);
        setPermissionError(false);
      } else if(status == 403) {
        setPermissionError(true);
      }
    }, () => {setIsLoading(false);});
  }

  useEffect(() => {
    getAllAnnRequest();
  }, [authToken]);

  const renderItem = ({item}) => <AllAnnItem item={item} key={item.title} />;


  return (
    <View>
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          All Ads
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
      {ann != null ? <FlatList
        data={ann}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      /> : null}
      <Button title="Reload" disabled={isLoading} onPress={() => { getAllAnnRequest(); }} />
    </KivCard>
    </View>
  );
}