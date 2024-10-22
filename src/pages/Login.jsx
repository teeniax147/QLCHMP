import React, { useState } from 'react';
import './Login.css'; // Kết nối với CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-page"> {/* Sử dụng lớp .login-page để chỉ áp dụng cho trang này */}
      <div className="login-container">
        <div className="login-form">
          <h2>Đăng Nhập</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Nhập email của bạn" 
              />
            </div>
            <div className="input-group">
              <label>Mật Khẩu</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Nhập mật khẩu của bạn" 
              />
            </div>
            <button type="submit" className="login-button">Đăng Nhập</button>
          </form>
          <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
