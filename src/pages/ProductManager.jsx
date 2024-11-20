import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductManager.css";

const ProductManager = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [totalProducts, setTotalProducts] = useState(0); // Tổng số sản phẩm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [modalVisible, setModalVisible] = useState(false); // Hiện modal
  const [modalType, setModalType] = useState(""); // Loại modal (add, edit, delete)
  const [currentProduct, setCurrentProduct] = useState(null); // Sản phẩm hiện tại trong modal
  const pageSize = 10; // Số sản phẩm mỗi trang

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }
      const response = await axios.get(
        "https://localhost:5001/api/Products/danh-sach",
        {
          params: { pageNumber: page, pageSize: pageSize },
        }
      );

      const productsList = response.data?.DanhSachSanPham?.$values || [];
      setProducts(productsList);
      setTotalProducts(response.data?.TongSoSanPham || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở modal
  const openModal = (type, product = null) => {
    setModalType(type);
    setCurrentProduct(product);
    setModalVisible(true);
  };

  const handleAddProduct = async (productData) => {
    try {
        const formattedData = {
            Name: productData.Name.trim(),
            Price: parseFloat(productData.Price),
            OriginalPrice: parseFloat(productData.OriginalPrice),
            Description: productData.Description.trim(),
            ImageUrl: productData.ImageUrl.trim(),
        };

        const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      const response = await axios.post(
        "https://localhost:5001/api/Products/them-moi",
        JSON.stringify(productData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );
        console.log("Thêm sản phẩm:", response.data);
        fetchProducts(currentPage);
        alert("Thêm sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Không thể thêm sản phẩm.");
    } finally {
        setModalVisible(false);
    }
};

  const handleEditProduct = async (productData) => {
    try {
        const formattedData = {
            Name: productData.Name.trim(),
            Price: parseFloat(productData.Price),
            OriginalPrice: parseFloat(productData.OriginalPrice),
            Description: productData.Description.trim(),
            ImageUrl: productData.ImageUrl.trim(),
        };

        const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      const response = await axios.put(
        `https://localhost:5001/api/Products/cap-nhat/${currentProduct.Id}`,
        JSON.stringify(productData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );
        console.log("Cập nhật sản phẩm:", response.data);
        fetchProducts(currentPage);
        alert("Cập nhật sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Không thể cập nhật sản phẩm.");
    } finally {
        setModalVisible(false);
    }
};


const handleDeleteProduct = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }

    const response = await axios.delete(
      `https://localhost:5001/api/Products/xoa/${currentProduct.Id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      console.log("Xóa sản phẩm:", response.data);
      fetchProducts(currentPage);
      alert("Xóa sản phẩm thành công!");
  } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Không thể xóa sản phẩm.");
  } finally {
      setModalVisible(false);
  }
};


  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="container">
      <h1 className="product-management-title">Quản lý sản phẩm</h1>
      <button className="add-btn" onClick={() => openModal("add")}>
        Thêm sản phẩm
      </button>
      {error && <div className="error-message" style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Giá bán</th>
            <th>Giá gốc</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7">Đang tải...</td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="7">Không có sản phẩm nào!</td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.Id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{product.Name}</td>
                <td>{product.Price.toLocaleString()} VND</td>
                <td>{product.OriginalPrice.toLocaleString()} VND</td>
                <td>{product.Description || "Không có mô tả"}</td>
                <td>
                  <img
                    src={product.ImageUrl || "https://via.placeholder.com/100"}
                    alt={product.Name || "Hình ảnh"}
                    style={{ width: "100px", height: "100px" }}
                  />
                </td>
                <td>
                  <button className="edit-btn" onClick={() => openModal("edit", product)}>
                    Sửa
                  </button>
                  <button className="delete-btn" onClick={() => openModal("delete", product)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => fetchProducts(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {modalVisible && (
        <Modal
          type={modalType}
          product={currentProduct}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
};

const Modal = ({ type, product, onClose, onAdd, onEdit, onDelete }) => {
  const [formData, setFormData] = useState({
    Name: product?.Name || "",
    Price: product?.Price || "",
    OriginalPrice: product?.OriginalPrice || "",
    Description: product?.Description || "",
    ImageUrl: product?.ImageUrl || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (type === "add") {
      onAdd(formData);
    } else if (type === "edit") {
      onEdit(formData);
    } else if (type === "delete") {
      onDelete();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{type === "add" ? "Thêm sản phẩm" : type === "edit" ? "Sửa sản phẩm" : "Xóa sản phẩm"}</h2>
        {type === "delete" ? (
          <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
        ) : (
          <>
            <label>
              Tên sản phẩm:
              <input type="text" name="Name" value={formData.Name} onChange={handleChange} />
            </label>
            <label>
              Giá bán:
              <input type="number" name="Price" value={formData.Price} onChange={handleChange} />
            </label>
            <label>
              Giá gốc:
              <input type="number" name="OriginalPrice" value={formData.OriginalPrice} onChange={handleChange} />
            </label>
            <label>
              Mô tả:
              <textarea name="Description" value={formData.Description} onChange={handleChange}></textarea>
            </label>
            <label>
              URL hình ảnh:
              <input type="text" name="ImageUrl" value={formData.ImageUrl} onChange={handleChange} />
            </label>
          </>
        )}
        <div className="modal-actions">
          <button onClick={handleSubmit}>{type === "delete" ? "Xóa" : "Lưu"}</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
