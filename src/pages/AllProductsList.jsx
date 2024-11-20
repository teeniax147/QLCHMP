import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllProductsList.css"; // CSS cho giao diện

const AllProductsList = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brandId: '',
    isOnSale: false,
  });
  const [sortOrder, setSortOrder] = useState(""); // Thứ tự sắp xếp: 'asc' hoặc 'desc'
  const [page, setPage] = useState(1); // Số trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const pageSize = 10; // Số sản phẩm mỗi trang

  const navigate = useNavigate(); // Điều hướng

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://localhost:5001/api/Products/danh-sach`, {
          params: {
            pageNumber: page,
            pageSize: pageSize,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            brandId: filters.brandId || undefined,
            isOnSale: filters.isOnSale, // Gửi chính xác isOnSale
            sortByPrice: sortOrder || undefined, // Sắp xếp
          },
        });

        console.log('Dữ liệu từ API:', response.data);

        const data = response.data;
        const productsList = data.DanhSachSanPham?.$values || []; // Trích xuất từ $values
        setProducts(productsList);
        setTotalPages(Math.ceil(data.TongSoSanPham / pageSize));
      } catch (error) {
        setError("Lỗi từ server: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [page]); // Chỉ fetch dữ liệu khi đổi trang

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const applyFilters = () => {
    setLoading(true);
  
    // Chỉ gửi các tham số hợp lệ, bỏ qua giá trị null hoặc undefined
    const validParams = {
      pageNumber: page,
      pageSize: pageSize,
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.brandId && { brandId: filters.brandId }),
      ...(filters.isOnSale !== null && { isOnSale: filters.isOnSale }),
      ...(sortOrder && { sortByPrice: sortOrder }),
    };
  
    axios
    .get(`https://localhost:5001/api/Products/loc`, { params: validParams })
    .then((response) => {
      const data = response.data.DanhSachSanPham?.$values || [];
      
      // Loại bỏ sản phẩm trùng lặp
      const uniqueProducts = Array.from(new Map(data.map(item => [item.Id, item])).values());

      setProducts(uniqueProducts); // Cập nhật danh sách sản phẩm
      setTotalPages(Math.ceil(response.data.TongSoSanPham / pageSize)); // Cập nhật số trang
    })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setError("Lỗi từ server: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
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
    <div className="product-container-all">
      <div className="product-header-banner-all">
        <img
          src="src/assets/Icons/hinh5.png"
          alt="Banner"
        />
      </div>
      <h1 className="product-title-all">Tất cả sản phẩm</h1>
      <div className="product-page-container">
      <div className="filters-all">
        <div className="filter-section-all">
        
          <h4 className="product-text-all">Khoảng giá:</h4>

  <div className="price-filters2">
    <label>
     
      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleFilterChange}
      />
    </label>
    <h4 className="product-text">-</h4>
    <label>
     
      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleFilterChange}
      />
    </label>
  
  
  </div>

          <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
          <label>
            Đang khuyến mãi:
          </label>
          <input
          style={{width: "auto"}}
              type="checkbox"
              name="isOnSale"
              checked={filters.isOnSale}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="sort-section-all">
          <label htmlFor="sortFilter" className="filter-label-all">
            Sắp xếp theo:
          </label>
          <select
            name="sortByPrice"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="">Tất cả</option>
            <option value="asc">Giá thấp nhất</option>
            <option value="desc">Giá cao nhất</option>
          </select>
          <button onClick={applyFilters}>Áp dụng</button>
        </div>
      </div>

      <div className="product-grid-all">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              className="product-card-all"
              key={`${product.Id}-${index}`}
              onClick={() => navigate(`/product-detail/${product.Id}`)}
            >
              {/* Thêm nút trái tim */}
              <div
                className="product-favorite-icon"
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
                className="product-image-all"
              />
          <div className="product-details-all">

  <p className="product-brand-custom">{product.BrandName || "Không có thương hiệu"}</p>


  <h3 className="product-name-all">{product.Name}</h3>

  
 
    <p className="product-price-custom">
      {product.Price ? `${product.Price.toLocaleString()}đ` : "Liên hệ"}
    </p>
    {product.OriginalPrice && product.OriginalPrice > product.Price && (
      <span className="product-original-price2">{product.OriginalPrice.toLocaleString()}đ</span>
    )}
 

 
  <div className="product-rating-stars">
    {Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`product-star ${
          product.ReviewCount > 0 && index < Math.round(product.AverageRating || 0) ? "filled" : ""
        }`}
      >
        ★
      </span>
    ))}
    <span>({product.ReviewCount || 0})</span>
  </div>

  {/* Số lượng tồn kho */}
  <p className="product-stock-custom">
    {product.CurrentStock ? `${product.CurrentStock} sản phẩm có sẵn` : "Không xác định"}
  </p>
</div>

            </div>
           
          ))
        ) : (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        )}
         </div>
      </div>
     
      <div className="pagination-all">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button-all ${
              page === index + 1 ? "active-all" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
     
    </div>

  );
};
export default AllProductsList;
