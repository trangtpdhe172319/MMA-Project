import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';

const NoServices = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={60} color="#CCCCCC" />
      <Text style={styles.title}>Chưa có dịch vụ nào</Text>
      <Text style={styles.subtitle}>Nhấn nút "+" để thêm dịch vụ mới</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default NoServices;