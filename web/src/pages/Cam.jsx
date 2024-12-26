import React, { useState, useEffect } from 'react';

const Introduce = () => {
  const [imageUrl, setImageUrl] = useState(
    "https://76f1-2402-800-9aa8-25ed-40fc-2d72-b31c-3a53.ngrok-free.app/cam-lo.jpg"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setImageUrl((prevImage) => {
        // Mỗi lần thay đổi, sẽ load lại URL ảnh mới
        return `https://76f1-2402-800-9aa8-25ed-40fc-2d72-b31c-3a53.ngrok-free.app/cam-lo.jpg?${new Date().getTime()}`;
      });
    }, 1000); // 1 giây để tải lại hình ảnh mới

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, []);

  return (
    <div className="row">
      {/* Introduce */}
      <h2>Camera</h2>

      {/* Hiển thị khung hình */}
      <div>
        <img src={imageUrl} alt="Khung hình" />
      </div>
    </div>
  );
};

export default Introduce;
