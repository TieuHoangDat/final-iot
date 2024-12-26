import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Voice from '@react-native-voice/voice';
import { getDatabase, ref, set } from 'firebase/database';

export default function VoiceControl({ language }) {
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [commandMessage, setCommandMessage] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  const onSpeechResults = async (event) => {
    const text = event.value[0];
    setRecognizedText(text);

    if (text.toLowerCase().includes("open") || text.toLowerCase().includes("mở")) {
      setCommandMessage("Đã nhận được lệnh mở cửa");
      updateLED('ON');
    } else if (text.toLowerCase().includes("close") 
      || text.toLowerCase().includes("đóng") 
      || text.toLowerCase().includes("khoá")
      || text.toLowerCase().includes("kh")
      || text.toLowerCase().includes("lock")) {
      setCommandMessage("Đã nhận được lệnh khoá cửa");
      updateLED('OFF');
    } else {
      setCommandMessage("Không nhận diện được lệnh");
    }
  };

  const onSpeechError = () => {
    // Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình nhận diện giọng nói.');
    setCommandMessage('Lỗi nhận diện giọng nói');
  };

  const startRecording = async () => {
    setRecognizedText('');
    setCommandMessage('');
    try {
      await Voice.start(language);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting Voice:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping Voice:', error);
    }
  };

  const updateLED = async (status) => {
    try {
      await set(ref(getDatabase(), 'LED'), status);
      // Alert.alert('LED Status', `LED đã được ${status === 'on' ? 'bật' : 'tắt'}.`);
    } catch (error) {
      // Alert.alert('Lỗi', 'Không thể cập nhật trạng thái LED.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recording]}
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Đang ghi âm...' : 'Giữ để ghi âm'}</Text>
      </TouchableOpacity>
      <Text style={styles.recognizedText}>{recognizedText || 'Chưa có văn bản nhận diện'}</Text>
      <Text style={styles.commandMessage}>{commandMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  recordButton: { backgroundColor: '#4eab95', padding: 8, borderRadius: 5, marginTop: 15, width: '60%', paddingLeft:50, },
  recording: { backgroundColor: '#ff4d4d' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  recognizedText: { fontSize: 12, color: '#333', marginTop: 20 },
  commandMessage: { marginTop: 10, fontSize: 14, color: '#ff4d4d', fontWeight: 'bold' },
});
