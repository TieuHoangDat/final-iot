import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import PasswordManager from './PasswordManager';
// import CameraFeed from './CameraFeed';
import TmpPasswordManager from './TmpPasswordManager';
import VoiceControl from './VoiceControl';

export default function App() {
  const [language, setLanguage] = useState('vi-VN');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image source={require('./assets/111.png')} style={styles.icon} />
          <Text style={styles.headerText}>IOT NHÓM Đạt và Dương</Text>
        </View>
      </View>
      {/* <CameraFeed /> */}
      <TmpPasswordManager />
      <PasswordManager />
      <VoiceControl language={language} setLanguage={setLanguage} />
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#d62d20', // Màu đỏ cho header
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 50, 
    height: 50,
    borderRadius: 25, // Giữ bo tròn nếu muốn
  },
  headerText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
