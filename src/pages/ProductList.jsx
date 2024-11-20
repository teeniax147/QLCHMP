import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./ProductList.css";

const ProductList = () => {
  const { categoryId } = useParams(); // Lấy ID danh mục từ URL
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const navigate = useNavigate(); // Điều hướng

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://localhost:5001/api/Products/theo-danh-muc/${categoryId}?pageNumber=1&pageSize=10`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const productsList = data.DanhSachSanPham?.$values || []; // Lấy danh sách sản phẩm
        setProducts(productsList);

        console.log("Sản phẩm nhận được:", productsList); // Kiểm tra dữ liệu trong console
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);
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
  if (loading) {
    return <p>Đang tải danh sách sản phẩm...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-container-custom">
      <div className="product-header-banner-custom">
        <img
          src="http://localhost:5173/src/assets/Icons/hinh5.png"
          alt="Banner"
        />
      </div>
      <h1 className="product-title-custom">Danh sách sản phẩm</h1>
      <div className="product-grid-custom">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="product-card-custom"
              key={product.Id}
              onClick={() => navigate(`/product-detail/${product.Id}`)} // Điều hướng đến chi tiết sản phẩm
            >
              {/* Thêm nút trái tim */}
              <div
                className="favorite-icon"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click vào thẻ cha
                  handleAddToFavorites(product.Id); // Gọi API thêm vào danh sách yêu thích
                }}
              >
                ♡
                </div>
              {/* Hiển thị ảnh sản phẩm */}
            <img
              src={product.ImageUrl || "https://via.placeholder.com/150"}
              alt={product.Name}
              className="product-image-custom"
            />

            <div className="product-details-custom">
              {/* Hiển thị tên thương hiệu */}
              <p className="product-brand-custom">
           {product.BrandName || "Không có thương hiệu"}
              </p>
              <h3 className="product-name-custom">{product.Name}</h3>

              {/* Hiển thị giá */}
              <p className="product-price-custom">
                {product.Price ? `${product.Price.toLocaleString()} VND` : "Liên hệ"}
                {product.OriginalPrice && product.OriginalPrice > product.Price && (
                  <span className="product-original-price">
                    {` (Giá gốc: ${product.OriginalPrice.toLocaleString()} VND)`}
                  </span>
                )}
              </p>

              {/* Hiển thị đánh giá trung bình và số lượt đánh giá */}
              <p className="product-rating-custom">
           {product.AverageRating ? product.AverageRating.toFixed(1) : "Chưa có"} / 5
                <span> ({product.ReviewCount || 0} đánh giá)</span>
              </p>
                {/* Hiển thị số lượng tồn kho */}
                <p className="product-stock-custom">
                ({product.CurrentStock || "Không xác định"})
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

export default ProductList;
