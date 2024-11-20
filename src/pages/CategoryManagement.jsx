import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryManagement.css";
import { useNavigate } from "react-router-dom";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục đang chọn
  const [showEditModal, setShowEditModal] = useState(false); // Hiển thị modal chỉnh sửa
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Hiển thị modal xóa

  const navigate = useNavigate();

  const flattenCategories = (categories) => {
    let flatList = [];
    categories.forEach((category) => {
      flatList.push({
        Id: category?.Id || "Không có ID",
        Name: category?.Name || "Không có tên",
        Description: category?.Description || "Không có mô tả",
        ParentName: category?.Parent?.Name || "Không có",
        SubCategories:
          category?.InverseParent?.$values
            ?.map((sub) => sub.Name)
            .join(", ") || "Không có",
      });

      if (category?.InverseParent?.$values?.length > 0) {
        flatList = flatList.concat(flattenCategories(category.InverseParent.$values));
      }
    });
    return flatList;
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      const response = await axios.get("https://localhost:5001/api/Categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 200 && response.data) {
        console.log("Dữ liệu trả về từ API:", response.data);
        const flatCategories = flattenCategories(response.data.$values || []);
        setCategories(flatCategories);
      } else {
        throw new Error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi API:", err);
      setError(
        err.response?.data?.message ||
          "Không thể lấy danh mục. Vui lòng kiểm tra lại API hoặc kết nối mạng."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại.");

      await axios.put(
        `https://localhost:5001/api/Categories/${selectedCategory.Id}`,
        selectedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Cập nhật danh mục thành công!");
      setShowEditModal(false);
      fetchCategories(); // Tải lại danh sách
    } catch (err) {
      alert("Lỗi khi cập nhật danh mục.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại.");

      await axios.delete(
        `https://localhost:5001/api/Categories/${selectedCategory.Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Xóa danh mục thành công!");
      setShowDeleteModal(false);
      fetchCategories(); // Tải lại danh sách
    } catch (err) {
      alert("Lỗi khi xóa danh mục.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategories = () => {
    if (!categories || categories.length === 0) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>
            Không có danh mục nào để hiển thị
          </td>
        </tr>
      );
    }

    // Lọc các danh mục hợp lệ (có ID và tên)
    const validCategories = categories.filter(
      (category) => category.Id !== "Không có ID" && category.Name !== "Không có tên"
    );

    if (validCategories.length === 0) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>
            Không có danh mục nào để hiển thị
          </td>
        </tr>
      );
    }

    return validCategories.map((category, index) => (
      <tr key={index}>
        <td>{category.Id}</td>
        <td>{category.Name}</td>
        <td>{category.Description}</td>
        <td>{category.ParentName}</td>
        <td>{category.SubCategories}</td>
        <td>
          <button onClick={() => handleEdit(category)}>Sửa</button>
          <button
            onClick={() => {
              setSelectedCategory(category);
              setShowDeleteModal(true);
            }}
          >
            Xóa
          </button>
        </td>
      </tr>
    ));
  };

  if (loading) return <p>Đang tải danh mục...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Quản Lý Danh Mục Sản Phẩm</h1>
      <button
        className="btn-add"
        onClick={() => navigate("/admin/add-category")}
      ></button>
      <table
        border="1"
        style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Danh mục cha</th>
            <th>Danh mục con</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>{renderCategories()}</tbody>
      </table>

      {showEditModal && (
  <>
    <div className="custom-modal-overlay" onClick={() => setShowEditModal(false)}></div>
    <div className="custom-modal">
      <h2 className="custom-modal-title">Chỉnh sửa danh mục</h2>
      <label>Tên danh mục:</label>
      <input
        className="custom-modal-input"
        type="text"
        value={selectedCategory.Name}
        onChange={(e) =>
          setSelectedCategory({ ...selectedCategory, Name: e.target.value })
        }
      />
      <label>Mô tả:</label>
      <textarea
        className="custom-modal-textarea"
        value={selectedCategory.Description}
        onChange={(e) =>
          setSelectedCategory({
            ...selectedCategory,
            Description: e.target.value,
          })
        }
      />
      <button className="custom-modal-button custom-modal-button-save" onClick={handleSave}>
        Lưu
      </button>
      <button className="custom-modal-button custom-modal-button-cancel" onClick={() => setShowEditModal(false)}>
        Hủy
      </button>
    </div>
  </>
)}

{showDeleteModal && (
  <>
    <div className="custom-modal-overlay" onClick={() => setShowDeleteModal(false)}></div>
    <div className="custom-modal">
      <h2 className="custom-modal-title">Xác nhận xóa danh mục</h2>
      <p>
        Bạn có chắc muốn xóa danh mục: <b>{selectedCategory.Name}</b>?
      </p>
      <button className="custom-modal-button custom-modal-button-save" onClick={handleDelete}>
        Xóa
      </button>
      <button className="custom-modal-button custom-modal-button-cancel" onClick={() => setShowDeleteModal(false)}>
        Hủy
      </button>
    </div>
  </>
)}



 

    </div>
  );
};

export default CategoryManagement;
