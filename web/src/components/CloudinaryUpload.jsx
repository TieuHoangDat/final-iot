import React, { useState } from "react";
import axios from "axios"; // Thư viện để gửi HTTP request

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null); // Lưu ảnh đã chọn
  const [progress, setProgress] = useState(0); // Lưu tiến trình tải lên
  const [uploading, setUploading] = useState(false); // Trạng thái tải lên

  // Cập nhật state khi người dùng chọn ảnh
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Hàm upload ảnh lên Cloudinary
  const handleUpload = async (imageFile) => {
    if (!imageFile) return;

    setUploading(true); // Bắt đầu quá trình tải lên
    const formData = new FormData(); // Tạo đối tượng FormData để gửi file
    formData.append("file", imageFile); // Thêm file vào FormData
    formData.append("upload_preset", "vlpi9lro"); // Thay 'your_upload_preset' bằng preset của bạn

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dyh4crtho/image/upload", // Thay 'your_cloud_name' bằng tên Cloudinary của bạn
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent); // Cập nhật tiến trình tải lên
          },
        }
      );

      // Sau khi upload xong, bạn có thể lấy URL của ảnh
      const imageUrl = res.data.secure_url;
      console.log("Image uploaded: ", imageUrl); // In ra URL ảnh đã tải lên

      // Reset trạng thái
      setUploading(false);
      setImage(null); // Xóa ảnh đã chọn
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false);
    }
  };

  // Tải ảnh từ URL và upload lên Cloudinary
  const uploadImageFromUrl = async () => {
    const imageUrl = "https://76f1-2402-800-9aa8-25ed-40fc-2d72-b31c-3a53.ngrok-free.app/cam-lo.jpg";
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
      const imageBlob = response.data;
      const imageFile = new File([imageBlob], "cam-lo.jpg", { type: imageBlob.type });
      handleUpload(imageFile); // Gửi ảnh đã tải về lên Cloudinary
    } catch (error) {
      console.error("Error fetching image from URL: ", error);
    }
  };

  return (
    <div>
      <h3>Upload Image to Cloudinary</h3>
      
      {/* Nút tải ảnh từ URL */}
      <button onClick={uploadImageFromUrl} disabled={uploading}>
        Upload Image from URL
      </button>
      
      {/* Nút tải ảnh từ máy tính */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {image && !uploading && (
        <button onClick={() => handleUpload(image)}>Upload</button>
      )}
      
      {uploading && <p>Uploading... {progress}%</p>}
    </div>
  );
};

export default CloudinaryUpload;
