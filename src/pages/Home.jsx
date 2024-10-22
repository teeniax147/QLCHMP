import React, { useState, useEffect } from 'react';
import './Home.css'; // Đảm bảo đường dẫn chính xác

const Home = () => {
  const banners = [
    'src/assets/Icons/banner.png',
    'src/assets/Icons/banner 2.png',
    'src/assets/Icons/banner.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm để chuyển sang slide tiếp theo
  const nextSlide = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  // Hàm để chọn slide theo chỉ mục
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Tự động chuyển slide sau mỗi 3 giây (3000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3 giây
    return () => clearInterval(interval); // Xóa interval khi component bị unmount
  }, [currentIndex]);

  // Tính chỉ số của slide tiếp theo
  const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;

  // Thông tin về các thương hiệu
  const brands = [
    {
      name: 'Yehwadam',
      image: 'src/assets/brand/brand1.png', // Đường dẫn hình ảnh
      url: '/yehwadam' // Liên kết đến trang thương hiệu Yehwadam
    },
    {
      name: 'Freshian',
      image: 'src/assets/brand/brand2.png', // Đường dẫn hình ảnh
      url: '/freshian' // Liên kết đến trang thương hiệu Freshian
    },
    {
      name: 'FMGT',
      image: 'src/assets/brand/brand3.png', // Đường dẫn hình ảnh
      url: '/fmgt' // Liên kết đến trang thương hiệu FMGT
    },
    {
      name: 'Belif',
      image: 'src/assets/brand/brand4.png', // Đường dẫn hình ảnh
      url: '/belif' // Liên kết đến trang thương hiệu Belif
    }
  ];

  return (
    <div>
      {/* Carousel Section */}
      <div className="carousel-container">
        <div className="carousel-slide">
          <img src={banners[currentIndex]} alt="Banner hiện tại" className="carousel-image" />
          {/* Hiển thị slide tiếp theo với hiệu ứng mờ */}
          <img src={banners[nextIndex]} alt="Slide tiếp theo" className="carousel-next" />
        </div>

        <button className="carousel-arrow left-arrow" onClick={() => goToSlide(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)}>
          &#10094;
        </button>
        <button className="carousel-arrow right-arrow" onClick={nextSlide}>
          &#10095;
        </button>

        <div className="carousel-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={currentIndex === index ? 'dot active' : 'dot'}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Brand Section - Thêm các thương hiệu dưới phần carousel */}
      <div className="brand-section">
        {brands.map((brand) => (
          <a href={brand.url} key={brand.name} className="brand-link">
            <img src={brand.image} alt={brand.name} className="brand-image" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Home;
