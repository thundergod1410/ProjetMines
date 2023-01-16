import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    paddingBottom: 16,
  },
  input: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
  },
  inputLabel: {
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default function KivTextInput({ label, value, onChangeText, ...props }) {
  return (<View style={styles.inputContainer}>
    <Text
      style={styles.inputLabel}>
      {label}
    </Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={value}
      {...props} />
  </View>);
}
