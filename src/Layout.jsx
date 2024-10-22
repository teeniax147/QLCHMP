// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; // Để hiển thị nội dung của các trang con
import './Layout.css'; // Bạn có thể giữ lại CSS hoặc điều chỉnh
import { Link } from 'react-router-dom';
const Layout = () => {
  return (
    <>
      <header className="home">
        <div className="header-top">
          <span className="freeship-info">FREESHIP 15K ĐƠN TỪ 199K</span>
          <span className="store-info">Mua online nhận nhanh tại cửa hàng</span>
        </div>

        <div className="header-main">
          <div className="logo">
            <img src="src/assets/Logo.png" alt="Glamour Cosmic Logo" />
          </div>

          <div className="search-bar">
  <input type="text" placeholder="FREESHIP MỌI ĐƠN" />
  <button type="submit" className="search-button">
    {/* Thêm SVG vào nút */}
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
      <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
    </svg>
  </button>
</div>
          <div className="header-icons">
            <span className="icon">
              <img src="src/assets/Icons/blog.png" alt="Blog Icon" />
              Blog làm đẹp
            </span>
            <span className="icon">
              <img src="src/assets/Icons/trungtamhotro.png" alt="Support Icon" />
              Trung tâm hỗ trợ
            </span>
            <span className="icon-more">•••</span>
            <span className="icon-divider"></span>
            <span className="icon">
            <Link to="/Login">
              <img src="src/assets/Icons/dangnhap.png" alt="Login Icon" />
              Đăng nhập
              </Link>
            </span>
            <span className="icon">❤️</span>
            <span className="icon">🛒</span>
          </div>
        </div>

        <nav className="nav">
          <ul>
          <li><Link to="/">TRANG CHỦ</Link></li>
          <li><Link to="/Chamsocda">CHĂM SÓC DA</Link></li>
            <li><Link to="/Trangdiem">TRANG ĐIỂM</Link></li>
            <li>THƯƠNG HIỆU</li>
            <li>TẠP CHÍ LÀM ĐẸP</li>
            <li>KHUYẾN MÃI</li>
            <li>MÃ ƯU ĐÃI</li>
          </ul>
        </nav>
      </header>

      {/* Đây là phần Outlet hiển thị nội dung của trang */}
      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h2>NHẬN BẢN TIN LÀM ĐẸP</h2>
            <p>Đừng bỏ lỡ hàng ngàn sản phẩm và khuyến mãi siêu hấp dẫn</p>
          </div>
          <div className="newsletter-subscribe">
            <input type="email" placeholder="Điền email của bạn" />
            <button>ĐĂNG KÝ</button>
          </div>
        </div>

        <div className="footer-middle">
          {/* Phần nội dung footer */}
          <div className="footer-logo-social">
            <div className="footer-logo">
              <img src="src/assets/Icons/logo1.png" alt="Glamour Cosmic Logo" />
            </div>
            <div className="footer-social">
              <h4>THEO DÕI CHÚNG TÔI TRÊN</h4>
              <ul className="social-icons">
                <li><img src="src/assets/Icons/fb(black).png" alt="Facebook" /></li>
                <li><img src="src/assets/Icons/instagram.png" alt="Instagram" /></li>
                <li><img src="src/assets/Icons/tiktok.png" alt="Tiktok" /></li>
              </ul>
              <h4>PHƯƠNG THỨC THANH TOÁN</h4>
              <ul className="payment-icons">
                <li><img src="src/assets/Icons/visa.png" alt="Visa" /></li>
                <li><img src="src/assets/Icons/mastercard.png" alt="Mastercard" /></li>
                <li><img src="src/assets/Icons/momo1.png" alt="COD" /></li>
                <li><img src="src/assets/Icons/tienmat(bank).png" alt="Bank Transfer" /></li>
              </ul>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>VỀ CHÚNG TÔI</h4>
              <ul>
                <li><a href="#">Câu chuyện thương hiệu</a></li>
                <li><a href="#">Liên hệ chúng tôi</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>CHĂM SÓC KHÁCH HÀNG</h4>
              <ul>
                <li><a href="#">Đăng ký tài khoản thành viên</a></li>
                <li><a href="#">Hướng dẫn mua hàng online</a></li>
                <li><a href="#">Quyền lợi thành viên</a></li>
                <li><a href="#">Giao hàng và thanh toán</a></li>
                <li><a href="#">Chính sách đổi hàng</a></li>
                <li><a href="#">Điều khoản mua bán hàng hóa</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>ĐỐI TÁC - LIÊN KẾT</h4>
              <ul>
                <li><a href="#">Beauty Box</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>® GlamourCosmic.com.vn thuộc quyền sở hữu của Công ty Cổ Phần Hoa Sen
Việt GPKD số 0303565753 cấp ngày 24/09/2004 tại Sở Kế hoạch & Đầu tư TP
HCM | VP Miền Nam Lầu 1, G Tower 3 - 196A, Nguyễn Văn Hưởng, Phường
Thảo Điền, Thành Phố Thủ Đức, TP.HCM--- Chi nhánh Công ty CP Hoa Sen
Việt tại Hà Nội GPKD chi nhánh số 0303565753-008 cấp ngày 12/10/2011 |
Tòa nhà Lidaco, 19 Đại Từ, Phường Đại Kim, Quận Hoàng Mai, TP. Hà Nội.</p>
          <div className="certification-icons">
            <img src="src/assets/Icons/verified.png.png" alt="Bảo Hành" />
            <img src="src/assets/Icons/verified-dmca.png.png" alt="DMCA" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
