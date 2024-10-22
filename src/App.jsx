import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Sử dụng React Router
import Layout from './Layout';  // Layout chung chứa header và footer
import Home from './pages/Home';  // Trang Home
import Chamsocda from './pages/Chamsocda';  // Trang Chăm sóc da
import Trangdiem from './pages/Trangdiem'; 
import Login from './pages/Login'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Trang Home */}
          <Route index element={<Home />} />  
          
          {/* Trang Chăm sóc da */}
          <Route path="chamsocda" element={<Chamsocda />} />  
          <Route path="Trangdiem" element={<Trangdiem />} /> 
          </Route>
          {/* Route riêng cho trang đăng nhập, không có Layout */}
        <Route path="/login" element={<Login />} />  {/* Trang Đăng nhập */}
      </Routes>
    </Router>
  );
}

export default App;
