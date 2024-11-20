import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./BrandProducts.css";

const BrandProducts = () => {
  const { brandId } = useParams(); // Lấy brandId từ URL
  const [brandInfo, setBrandInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Điều hướng

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:5001/api/thuong-hieu/${brandId}`);
        const data = response.data;
        setBrandInfo({
          Name: data.Name,
          LogoUrl: data.LogoUrl ? `https://localhost:5001${data.LogoUrl}` : null, // Thêm domain nếu cần
          Description: data.Description,
        });
        setProducts(data.Products.$values || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm theo thương hiệu:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brandId]);

  const handleAddToFavorites = async (productId) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    console.log("Token từ localStorage:", token);

    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:5001/api/Favorites/add",
        { ProductId: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data); // Hiển thị thông báo thành công từ server
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm yêu thích:", error.response?.data || error.message);
      alert(error.response?.data || "Không thể thêm sản phẩm vào yêu thích.");
    }
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="brand-product-container">
      <div className="brand-product-header-banner">
        <img src="http://localhost:5173/src/assets/Icons/hinh5.png" alt="Banner" />
      </div>
      <div className="brand-product-header">
        {brandInfo.LogoUrl ? (
          <img
            src={brandInfo.LogoUrl}
            alt={`${brandInfo.Name} Logo`}
            className="brand-logo"
          />
        ) : null}
        <div className="brand-title-description">
          <h1>{brandInfo.Name}</h1>
        </div>
        <p className="brand-description">{brandInfo.Description}</p> {/* Hiển thị mô tả */}
      </div>

      <div className="brand-product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="brand-product-card"
              key={product.Id}
              onClick={() => navigate(`/product-detail/${product.Id}`)} // Điều hướng đến chi tiết sản phẩm
            >
              {/* Thêm nút trái tim */}
              <div
                className="brand-favorite-icon"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click vào thẻ cha
                  handleAddToFavorites(product.Id); // Gọi API thêm vào danh sách yêu thích
                }}
              >
                ♡
              </div>
              <img
                src={product.ImageUrl || "https://via.placeholder.com/150"}
                alt={product.Name}
                className="brand-product-image"
              />
              <div className="brand-product-brand">{product.Brand?.Name || brandInfo.Name}</div>
              <div className="brand-product-details">
                <h3 className="brand-product-name">{product.Name}</h3>
                <p className="brand-product-price">
                  {product.Price ? product.Price.toLocaleString() : "Liên hệ"} VND
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        )}
      </div>
    </div>
  );
};

export default BrandProducts;
