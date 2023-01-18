import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    backgroundColor: '#1c87c9',
    width: '100%',
    padding: 16,
    borderRadius: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 1,
  },
});

export default function KivCard({ children }) {
  return (<View style={styles.container}>
    {children}
  </View>);
}
