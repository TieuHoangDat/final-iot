import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { database, ref, onValue, set } from '../firebase'; // Import Firebase

const LedControl = () => {
  // State cho trạng thái của 6 LED
  const [ledStates, setLedStates] = useState({
    LED1: 0,
    LED2: 0,
    LED3: 0,
    LED4: 0,
    LED5: 0,
    LED6: 0,
  });

  // Cập nhật giá trị lên Firebase cho từng LED
  const updateFirebase = (led, value) => {
    const dbRef = ref(database, `LED${led}`);
    set(dbRef, value); // Ghi giá trị cập nhật vào Firebase cho từng LED
  };

  // Lấy dữ liệu từ Firebase khi component được load
  useEffect(() => {
    // Lắng nghe các thay đổi trạng thái của các LED từ Firebase
    const ledRefs = [1, 2, 3, 4, 5, 6].map((num) => ref(database, `LED${num}`));

    // Lắng nghe và cập nhật trạng thái LED từ Firebase
    const unsubscribes = ledRefs.map((ledRef, index) =>
      onValue(ledRef, (snapshot) => {
        const value = snapshot.val();
        if (value !== null) {
          setLedStates((prevState) => ({
            ...prevState,
            [`LED${index + 1}`]: value, // Cập nhật từng LED trong state
          }));
        }
      })
    );

    // Cleanup listeners khi component unmounts
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  // Hàm xử lý khi người dùng thay đổi trạng thái LED
  const handleToggle = (led) => {
    const newState = ledStates[`LED${led}`] === 1 ? 0 : 1; // Đổi trạng thái giữa 0 và 1
    setLedStates((prevState) => ({ ...prevState, [`LED${led}`]: newState }));
    updateFirebase(led, newState); // Cập nhật trạng thái LED lên Firebase
  };

  return (
    <div className="mt-3">
      <h4>Control LEDs</h4>
      <div className="row mb-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="col-md-4 mb-2">
            <Card>
              <Card.Body className="text-center">
                <Form.Check
                  type="switch"
                  id={`led${num}`}
                  label={`LED${num}`}
                  checked={ledStates[`LED${num}`] === 1} // Kiểm tra trạng thái hiện tại của LED
                  onChange={() => handleToggle(num)} // Xử lý khi người dùng thay đổi trạng thái
                  className="mb-2"
                />
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LedControl;
