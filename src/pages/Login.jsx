import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Đảm bảo Link được import
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await axios.post('https://localhost:5001/api/Users/login', {
            EmailOrUsername: emailOrUsername,
            Password: password,
        });
        const {userName, roles } = response.data;
        // Truy xuất token từ phản hồi
        const token = response.data.token?.Result; // Lấy chuỗi token từ thuộc tính Result
        // In ra để kiểm tra giá trị của roles
        console.log("Token:", token);
        console.log("UserName:", userName);
        console.log("Roles:", roles);

        // Kiểm tra nếu roles có thuộc tính $values và sử dụng nó nếu có
        const roleArray = Array.isArray(roles) ? roles : roles?.$values || [];

        // Kiểm tra roleArray sau khi truy xuất
        console.log("RoleArray (sau khi xử lý):", roleArray);

        // Nếu roleArray không phải là mảng hợp lệ hoặc không có vai trò, báo lỗi
        if (!Array.isArray(roleArray) || roleArray.length === 0) {
            throw new Error('Vai trò không xác định (roles không hợp lệ hoặc không có dữ liệu).');
        }

        if (!token || typeof token !== 'string') {
            throw new Error('Không nhận được token hợp lệ từ server.');
        }

        // Lưu token và tên người dùng nếu đăng nhập thành công
        localStorage.setItem('token', token);
        localStorage.setItem('userName', response.data.userName); // Lưu tên người dùng
        localStorage.setItem('roles', JSON.stringify(roleArray)); // Lưu roles dưới dạng chuỗi JSON hoặc mảng rỗng
        
        // Điều hướng dựa trên vai trò
        if (roleArray.includes('Admin')) {
          navigate('/admin');
      } else if (roleArray.includes('Staff')) {
          navigate('/staff');
      } else if (roleArray.includes('Customer')) {
          navigate('/');
      } else {
          throw new Error('Vai trò không xác định.');
      }

    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="login-wrapper">
      <div className="login-page">
        <div className="login-container">
          <div className="login-form">
            <div className="logo">
              <img src="src/assets/Icons/logo1.png" alt="Glamour Cosmic Logo" />
            </div>
            <h2>ĐĂNG NHẬP</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email hoặc Tên đăng nhập</label>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  placeholder="Nhập email hoặc tên đăng nhập của bạn"
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
              <div className="forgot-password">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
