import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [greeting, setGreeting] = useState('');

  const toggleAccount = () => setIsAccountOpen(!isAccountOpen);
  const toggleManagement = () => setIsManagementOpen(!isManagementOpen);
  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good morning 🌅');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon ☀️');
    } else {
      setGreeting('Good evening 🌙');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setShowDropdown(false);
  };

  return (
    <div className="admin-layout-container">
      <aside className="admin-sidebar">
      <div className="logoheader2">
            <img src="src/assets/Logo.png" alt="Glamour Cosmic Logo" />
          </div>
        <nav>
          <ul>
            <li onClick={toggleAccount} style={{ cursor: 'pointer' }}>
              Tài khoản
            </li>
            {isAccountOpen && (
              <ul className="sub-menu">
                <li><Link to="/admin/users"><span>👤</span> Người dùng</Link></li>
                <li><Link to="/admin/admins"><span>🛠️</span> Quản trị viên</Link></li>
                <li><Link to="/admin/create-user"><span>👥</span>Phân quyền</Link></li>
              </ul>
            )}
            <li onClick={toggleManagement} style={{ cursor: 'pointer' }}>
              Quản trị
            </li>
            {isManagementOpen && (
              <ul className="sub-menu">
               <li><Link to="/admin/customers"><span>👔</span> Tài khoản khách hàng</Link></li>
                <li><Link to="/admin/categories"><span>📂</span> Danh mục</Link></li>
                <li><Link to="/admin/products"><span>📦</span> Sản phẩm</Link></li>
                <li><Link to="/admin/brands"><span>🏷️</span> Thương hiệu</Link></li>            
                <li><Link to="/admin/inventory"><span>📦</span> Kho hàng</Link></li>
                <li><Link to="/admin/orders"><span>🛒</span> Đơn hàng</Link></li>
                <li><Link to="/admin/coupons"><span>🏷️</span> Mã giảm giá</Link></li>
                <li><Link to="/admin/payment-methods"><span>💳</span> Phương thức thanh toán</Link></li>
                <li><Link to="/admin/blogs"><span>✏️</span> Bài viết blog</Link></li>
                <li><Link to="/admin/promotions"><span>🎉</span> Khuyến mãi</Link></li>
                <li><Link to="/admin/membership"><span>🏅</span> Thứ hạng thành viên</Link></li>
                <li><Link to="/admin/revenue-report"><span>📑</span> Thống kê - Báo cáo</Link></li>
                <li><Link to="/admin/shipping"><span>🚚</span> Đơn vị vận chuyển</Link></li>
              </ul>
            )}
          </ul>
        </nav>
      </aside>

      <header className="admin-header">
      <div className="search-bar2">
            <input type="text" placeholder="Tìm kiếm..." />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30">
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
              </svg>
            </button>
          </div>
        <span className="icon2">
          {userName && (
            <div onClick={handleDropdownToggle} className="user-menu-trigger1">
              <img src="src/assets/Icons/dangnhap.png" alt="User Icon" />
              <span>Xin chào {userName} !</span>
            </div>
          )}
          {userName && showDropdown && (
            <div className="user-dropdown-menu1">
              <p>{greeting} {userName}!</p>
              <ul>
                <li>
                  <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
                </li>
              </ul>
            </div>
          )}
        </span>
      </header>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
