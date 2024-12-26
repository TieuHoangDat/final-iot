import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, get, set } from 'firebase/database'; // Firebase v9 imports
import moment from 'moment'; // Cần cài thư viện moment để xử lý thời gian

export default function TmpPasswordManager() {
  const [tmpPassword, setTmpPassword] = useState('');
  const [time, setTime] = useState('');
  const [inputTime, setInputTime] = useState(''); // State mới để quản lý giá trị nhập vào

  useEffect(() => {
    fetchTmpPassword();
  }, []);

  const fetchTmpPassword = async () => {
    const db = getDatabase();
    const tmpPasswordRef = ref(db, 'TMP_PASSWORD');
    const timeRef = ref(db, 'TIME');
    
    try {
      const tmpPasswordSnapshot = await get(tmpPasswordRef);
      const timeSnapshot = await get(timeRef);
      
      if (tmpPasswordSnapshot.exists() && timeSnapshot.exists()) {
        setTmpPassword(tmpPasswordSnapshot.val());
        setTime(timeSnapshot.val());
        setInputTime(timeSnapshot.val()); // Set giá trị TIME vào input
      } else {
        console.log('TMP_PASSWORD or TIME not found');
      }
    } catch (error) {
      console.error('Error fetching TMP_PASSWORD or TIME:', error);
    }
  };

  const handleChangeTmpPassword = async () => {
    // const newTmpPassword = Math.floor(1000 + Math.random() * 9000); // 4 số nguyên ngẫu nhiên từ 1000 đến 9999
    let newTmpPassword = '';
    const allowedDigits = ['0', '1', '2', '4', '5', '7', '8']; // Loại bỏ 3, 6, 9

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * allowedDigits.length);
        newTmpPassword += allowedDigits[randomIndex];
    }
    const newTime = moment().add(24, 'hours').format('DD/MM/YYYY[T]HH:mm'); // Thời gian mới là 24h sau

    try {
      await set(ref(getDatabase(), 'TMP_PASSWORD'), newTmpPassword);
      await set(ref(getDatabase(), 'TIME'), newTime);
      setTmpPassword(newTmpPassword);
      setTime(newTime);
      setInputTime(newTime); // Cập nhật lại giá trị input
      Alert.alert('Thành công', `Mật khẩu tạm thời đã được cập nhật thành: ${newTmpPassword}`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật TMP_PASSWORD và TIME');
    }
  };

  const handleSaveTime = async () => {
    if (!inputTime) {
      Alert.alert('Lỗi', 'Vui lòng nhập thời gian hợp lệ.');
      return;
    }

    try {
      await set(ref(getDatabase(), 'TIME'), inputTime); // Lưu giá trị TIME nhập vào
      setTime(inputTime); // Cập nhật lại state TIME
      Alert.alert('Thành công', 'Thời gian đã được cập nhật.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật TIME');
    }
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>Temporary Password:</Text>
        <Text style={styles.value}>{tmpPassword}</Text>
        <Text style={styles.title}>Expiration Time:</Text>
        {/* <Text style={styles.value}>{time}</Text> */}

        <TextInput
          style={styles.input}
          value={inputTime}
          onChangeText={setInputTime} // Cập nhật giá trị input khi người dùng nhập
          placeholder="Enter new expiration time"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTime}>
          <Text style={styles.buttonText}>Save TIME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleChangeTmpPassword}>
          <Text style={styles.buttonText}>Change TMP_PASSWORD</Text>
        </TouchableOpacity>
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
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4eab95',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
