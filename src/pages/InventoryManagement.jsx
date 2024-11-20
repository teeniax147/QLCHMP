import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" | "edit" | "delete"
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [formData, setFormData] = useState({
    ProductId: "",
    WarehouseLocation: "",
    QuantityInStock: "",
  });

  // Lấy danh sách kho hàng từ API
  const fetchInventories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:5001/api/Inventories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Thêm Authorization header
      });
      setInventories(response.data.$values || []);
    } catch (error) {
      setError("Không thể lấy danh sách kho hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const openModal = (type, inventory = null) => {
    setModalType(type);
    setSelectedInventory(inventory); // Lưu dữ liệu kho hàng đã chọn
    setFormData(
      inventory
        ? {
            ProductId: inventory.ProductId,
            WarehouseLocation: inventory.WarehouseLocation,
            QuantityInStock: inventory.QuantityInStock,
          }
        : {
            ProductId: "",
            WarehouseLocation: "",
            QuantityInStock: "",
          }
    );
    setIsModalOpen(true);
  };
  
  
  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInventory(null);
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Thêm kho hàng
  const handleAddInventory = async () => {
    try {
      const response = await axios.post(
        "https://localhost:5001/api/Inventories",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Thêm Authorization header
        }
      );
  
      const newInventory = response.data; // Lấy kho hàng vừa thêm
      setInventories((prevInventories) => [...prevInventories, newInventory]); // Cập nhật danh sách kho hàng
      alert("Thêm kho hàng thành công!");
      closeModal();
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra khi thêm kho hàng.");
    }
  };
  
  // Sửa kho hàng
  const handleEditInventory = async () => {
    try {
      const updatedInventory = {
        ...formData,
        InventoryId: selectedInventory.InventoryId, // Đảm bảo gửi InventoryId
      };
  
      await axios.put(
        `https://localhost:5001/api/Inventories/${selectedInventory.InventoryId}`,
        updatedInventory,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Thêm Authorization header
        }
      );
      alert("Cập nhật kho hàng thành công!");
      fetchInventories(); // Làm mới danh sách kho hàng
      closeModal(); // Đóng modal
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra khi cập nhật kho hàng.");
    }
  };
  
  // Xóa kho hàng
  const handleDeleteInventory = async () => {
    if (!selectedInventory?.InventoryId) {
      alert("Không tìm thấy ID kho hàng để xóa.");
      return;
    }
    try {
      await axios.delete(
        `https://localhost:5001/api/Inventories/${selectedInventory.InventoryId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Xóa kho hàng thành công!");
      fetchInventories();
      closeModal();
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra khi xóa kho hàng.");
    }
  };
  
  if (loading) return <CircularProgress style={{ display: "block", margin: "20px auto" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Quản Lý Kho Hàng
      </Typography>
      <Button variant="contained" onClick={() => openModal("add")} sx={{ marginBottom: "20px" }}>
        Thêm Kho Hàng
      </Button>
      <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto" }}>
  <Table stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>ID Sản Phẩm</TableCell>
        <TableCell>Vị Trí Kho</TableCell>
        <TableCell>Số Lượng</TableCell>
        <TableCell>Hành Động</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {inventories.map((inventory) => (
        <TableRow key={inventory.InventoryId}>
          <TableCell>{inventory.InventoryId}</TableCell>
          <TableCell>{inventory.ProductId}</TableCell>
          <TableCell>{inventory.WarehouseLocation}</TableCell>
          <TableCell>{inventory.QuantityInStock}</TableCell>
          <TableCell>
            <Button
              onClick={() => openModal("edit", inventory)}
              color="primary"
              variant="text"
            >
              Sửa
            </Button>
            <Button
              onClick={() => openModal("delete", inventory)}
              color="error"
              variant="text"
            >
              Xóa
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            p: 4,
          }}
        >
          {modalType === "delete" ? (
            <>
              <Typography variant="h6" align="center">
                Xác Nhận Xóa
              </Typography>
              <Typography>
                Bạn có chắc chắn muốn xóa kho hàng này không?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleDeleteInventory} color="error" variant="contained">
                  Xóa
                </Button>
                <Button onClick={closeModal} variant="outlined" sx={{ marginLeft: 2 }}>
                  Hủy
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" align="center">
                {modalType === "add" ? "Thêm Kho Hàng" : "Sửa Kho Hàng"}
              </Typography>
              <TextField
                label="ID Sản Phẩm"
                name="ProductId"
                value={formData.ProductId}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Vị Trí Kho"
                name="WarehouseLocation"
                value={formData.WarehouseLocation}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Số Lượng Tồn Kho"
                name="QuantityInStock"
                value={formData.QuantityInStock}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button
                  onClick={modalType === "add" ? handleAddInventory : handleEditInventory}
                  variant="contained"
                  sx={{ marginRight: 2 }}
                >
                  {modalType === "add" ? "Thêm" : "Lưu"}
                </Button>
                <Button onClick={closeModal} variant="outlined">
                  Hủy
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default InventoryManagement;
