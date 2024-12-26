import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch, StyleSheet } from 'react-native';
import { fetchPassword, savePassword } from './config';
import { getDatabase, ref, get, set, onValue } from 'firebase/database'; // Firebase v9 imports

export default function PasswordManager() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [ledState, setLedState] = useState(false);

  useEffect(() => {
    // Lấy password ban đầu
    fetchPassword(setPassword);
    
    // Lắng nghe sự thay đổi của LED từ Firebase
    const db = getDatabase();
    const ledRef = ref(db, 'LED'); // Tham chiếu đến 'LED' trong Realtime Database
    
    const unsubscribe = onValue(ledRef, (snapshot) => {
      if (snapshot.exists()) {
        const ledStatus = snapshot.val();
        setLedState(ledStatus === 'ON'); // Cập nhật state LED khi Firebase thay đổi
      }
    });

    return () => unsubscribe(); // Dọn dẹp listener khi component unmount
  }, []);

  const handleSavePassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Lỗi', 'Mật khẩu không được để trống.');
      return;
    }

    try {
      await savePassword(newPassword);
      setPassword(newPassword); // Cập nhật mật khẩu hiện tại
      Alert.alert('Thành công', 'Đã cập nhật mật khẩu.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu mật khẩu.');
    }
  };

  const toggleLedState = (value) => {
    setLedState(value);
    const ledStatus = value ? 'ON' : 'OFF';
    const db = getDatabase(); // Lấy instance của database
    set(ref(db, 'LED'), ledStatus); // Cập nhật giá trị 'LED' trên Firebase
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>Current Password:</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword || password} // Hiển thị mật khẩu hiện tại nếu không có mật khẩu mới
            onChangeText={setNewPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{isPasswordVisible ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Trạng thái cửa</Text>
        <View style={styles.switchContainer}>
          <Text>{ledState ? 'Đang mở cửa' : 'Đang khoá cửa'}</Text>
          <Switch
            value={ledState}
            onValueChange={toggleLedState}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  eyeButton: {
    padding: 10,
  },
  eyeText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4eab95',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
});
