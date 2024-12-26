import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { database, ref, set } from '../firebase'; // Import Firebase setup

const VoiceRecorder = ({ onChangeRemState }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [transcript, setTranscript] = useState('');
  let recognition;

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech API.');
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN'; // Ngôn ngữ tiếng Việt
      recognition.interimResults = false; // Chỉ nhận kết quả cuối cùng
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setStatus('Đang ghi âm...');
      };

      recognition.onresult = (event) => {
        const transcriptResult = event.results[0][0].transcript.toLowerCase();
        setTranscript(`Văn bản: ${transcriptResult}`);
        setStatus('Hoàn tất.');
        setIsRecording(false);

        // Kiểm tra lệnh và gọi hàm thay đổi trạng thái rèm
        if (transcriptResult.includes('khoá cửa')) {
          onChangeRemState('OFF');
        } else if (transcriptResult.includes('mở cửa')) {
          onChangeRemState('ON');
        }
      };

      recognition.onerror = (event) => {
        console.error('Lỗi trong quá trình nhận diện:', event.error);
        setStatus(`Lỗi: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          setIsRecording(false);
        }
      };
    }
  }, [isRecording, onChangeRemState]);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      setTranscript('');
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setStatus('Đã dừng ghi âm.');
      setIsRecording(false);
    }
  };

  return (
    <Card className="p-3 bg-white shadow-sm mt-4">
      <Card.Body>
        <h4 className="mb-3">Điều khiển cửa bằng giọng nói</h4>
        <div className="d-flex justify-content-between">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="btn btn-primary me-2"
          >
            Bắt Đầu Ghi Âm
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="btn btn-danger"
          >
            Dừng Ghi Âm
          </button>
        </div>
        <small className="text-muted mt-2 d-block">{status}</small>
        <Card className="mt-3 p-3 bg-light">
          <Card.Body>
            <h6>Kết Quả:</h6>
            <p id="transcript" className="mb-0">{transcript || 'Chưa có dữ liệu.'}</p>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

// Component chính để điều khiển rèm
const ButtonsSection = () => {
  const updateFirebase = (path, value) => {
    const dbRef = ref(database, path);
    set(dbRef, value);
  };

  const handleChangeRemState = (newState) => {
    updateFirebase('LED', newState);
  };

  return (
    <div className="mt-3">
      <VoiceRecorder onChangeRemState={handleChangeRemState} />
    </div>
  );
};

export default ButtonsSection;
