import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'dat' && password === '123') {
      setMessage('Đăng nhập thành công!');
      localStorage.setItem('username', username); // Lưu tên người dùng vào localStorage
      // setTimeout(() => {
      navigate('/home'); // Chuyển hướng đến trang Home sau 1 giây
      // }, 1000);
    } else {
      setMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="container" style={{ marginTop: '200px' }}>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center">Đăng nhập</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block mb-3">
                  Đăng nhập
                </button>
              </form>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
