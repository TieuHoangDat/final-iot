import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Import biểu đồ cột từ react-chartjs-2
import { database, ref, onValue } from '../firebase'; // Import Firebase setup
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import các phần cần thiết cho Chart.js

// Đăng ký các scale và element cần thiết
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Diagram = () => {
  const [data, setData] = useState({
    labels: [], // Nhãn cho các cột
    datasets: [
      {
        label: 'Tần suất mở cửa', // Tên của dataset
        data: [], // Dữ liệu cho biểu đồ
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu nền cho cột
      },
      {
        label: 'Tần suất khoá cửa',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Màu nền cho cột
      }
    ]
  });

  useEffect(() => {
    const fetchHistoryData = () => {
      const historyRef = ref(database, 'rem_actions'); // Reference đến nút 'rem_actions' trong Firebase

      onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const actions = {};
          const today = new Date();
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);

          // Lặp qua dữ liệu để đếm số lần mở và đóng cửa trong 7 ngày gần nhất
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const action = data[key].action;
              const timestamp = new Date(data[key].timestamp);
              const day = timestamp.toLocaleDateString('en-GB'); // Chỉ lấy ngày và định dạng theo dd/mm/yyyy

              // Chỉ lấy dữ liệu trong 7 ngày gần nhất
              if (timestamp >= sevenDaysAgo && timestamp <= today) {
                if (!actions[day]) {
                  actions[day] = { open: 0, close: 0 }; // Khởi tạo đếm cho ngày
                }
                // Tăng số lần mở hoặc đóng
                if (action.includes('Mở')) {
                  actions[day].open++;
                } else if (action.includes('Đóng')) {
                  actions[day].close++;
                }
              }
            }
          }

          // Tạo danh sách các ngày trong 7 ngày gần nhất
          const labels = [];
          const openData = [];
          const closeData = [];

          for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const formattedDate = date.toLocaleDateString('en-GB'); // Định dạng dd/mm/yyyy
            labels.unshift(formattedDate); // Thêm ngày vào đầu danh sách
            openData.unshift(actions[formattedDate]?.open || 0); // Thêm số lần mở hoặc 0 nếu không có
            closeData.unshift(actions[formattedDate]?.close || 0); // Thêm số lần đóng hoặc 0 nếu không có
          }

          setData({
            labels,
            datasets: [
              {
                label: 'Tần suất mở cửa',
                data: openData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
              {
                label: 'Tần suất đóng cửa',
                data: closeData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
              }
            ]
          });
        }
      });
    };

    fetchHistoryData(); // Gọi hàm để fetch dữ liệu
  }, []); // Chỉ chạy 1 lần khi component mount

  return (
    <div className="row">
      <div className="col-md-12">
        <h4>Biểu đồ tần suất đóng mở cửa (7 ngày gần nhất)</h4>
        <Bar
          data={data} // Dữ liệu cho biểu đồ
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true, // Bắt đầu trục y từ 0
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Diagram;
