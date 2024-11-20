import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const token = localStorage.getItem("token");
  const customerId = 5; // Giả sử customerId được cung cấp

  const tabLabels = [
    "Tất cả",
    "Chờ xác nhận",
    "Chờ lấy hàng",
    "Chờ giao hàng",
    "Đã giao",
    "Đã hủy",
  ];

  // **Lọc đơn hàng theo trạng thái**
  const filteredOrders = () => {
    return orders.filter((order) => {
      const status = order.Status;
      switch (activeTab) {
        case 1:
          return status === "Chờ Xác Nhận";
        case 2:
          return status === "Chờ Lấy Hàng";
        case 3:
          return status === "Chờ Giao Hàng";
        case 4:
          return status === "Đã Giao";
        case 5:
          return status === "Đã Hủy";
        default:
          return true;
      }
    });
  };

  // **Gọi API để lấy danh sách đơn hàng**
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://localhost:5001/api/Orders/customer/${customerId}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );  
      setOrders(response.data.$values || []);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
      setError(err.response?.data || "Có lỗi xảy ra khi lấy danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  // **Hủy đơn hàng**
  const cancelOrder = async (orderId, orderStatus) => {
    if (orderStatus !== "Chờ Xác Nhận") {
      alert("Chỉ có thể hủy các đơn hàng đang ở trạng thái Chờ Xác Nhận.");
      return;
    }

    try {
      const response = await axios.put(
        `https://localhost:5001/api/Orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data); // Thông báo từ backend
      fetchOrders(); // Làm mới danh sách đơn hàng
    } catch (err) {
      console.error("Error canceling order:", err.response?.data || err.message);
      alert(err.response?.data || "Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  // **Lấy chi tiết đơn hàng**
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `https://localhost:5001/api/Orders/orders/${orderId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedOrderDetails(response.data.$values || []);
      setModalOpen(true);
    } catch (err) {
      console.error(
        "Error fetching order details:",
        err.response?.data || err.message
      );
      setError(err.response?.data || "Có lỗi xảy ra khi lấy chi tiết đơn hàng.");
    }
  };

  // **Gửi đánh giá sản phẩm**
  const submitFeedback = async () => {
    if (!rating) {
      alert("Vui lòng chọn số sao để đánh giá!");
      return;
    }

    if (!selectedProduct || !selectedProduct.ProductId) {
      alert("Không tìm thấy sản phẩm để đánh giá!");
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:5001/api/ProductFeedbacks/add`,
        {
          ProductId: selectedProduct.ProductId,
          Rating: rating,
          ReviewText: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data);
      setRatingModal(false);
      setSelectedProduct(null);
      setRating(0);
      setReviewText("");

      // Làm mới danh sách đơn hàng
      await fetchOrders();

      // Chuyển sang tab "Đã giao"
      setActiveTab(4);
    } catch (err) {
      console.error("Error submitting feedback:", err.response?.data || err.message);
      alert(err.response?.data || "Có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px", marginTop: "80px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Danh sách đơn hàng
      </Typography>

      {/* Tabs trạng thái */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        indicatorColor="primary"
        textColor="primary"
        style={{ marginBottom: "20px"}}
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {/* Nội dung */}
      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>STT</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell>Phương thức thanh toán</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders().map((order, index) => (
                <TableRow key={order.Id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.OrderDate}</TableCell>
                  <TableCell>{order.Status}</TableCell>
                  <TableCell>{order.CustomerName}</TableCell>
                  <TableCell>{order.ShippingAddress}</TableCell>
                  <TableCell>{order.PaymentMethod}</TableCell>
                  <TableCell>{order.TotalAmount.toLocaleString()} VND</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => fetchOrderDetails(order.Id)}
                    >
                      Xem chi tiết
                    </Button>
                    {order.Status === "Chờ Xác Nhận" && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => cancelOrder(order.Id, order.Status)}
                        style={{ marginLeft: "10px" }}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal chi tiết */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            margin: "50px auto",
            width: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Chi tiết đơn hàng
          </Typography>
          {selectedOrderDetails &&
            selectedOrderDetails.map((detail) => (
              <div key={detail.Id}>
                <Typography>
                  <strong>Sản phẩm:</strong> {detail.ProductName}
                </Typography>
                <Typography>
                  <strong>Số lượng:</strong> {detail.Quantity}
                </Typography>
                <Typography>
                  <strong>Đơn giá:</strong> {detail.UnitPrice.toLocaleString()} VND
                </Typography>
                <Typography>
                  <strong>Thành tiền:</strong> {detail.TotalPrice.toLocaleString()} VND
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    setRatingModal(true);
                    setSelectedProduct({ ProductId: detail.ProductId });
                  }}
                  style={{ marginTop: "10px" }}
                >
                  Đánh giá
                </Button>
                <img
                  src={detail.ProductImage}
                  alt={detail.ProductName}
                  style={{ width: "100%", marginTop: "10px" }}
                />
                <hr />
              </div>
            ))}

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => setModalOpen(false)}
          >
            Đóng
          </Button>
        </Box>
      </Modal>

      {/* Modal đánh giá */}
      <Modal open={ratingModal} onClose={() => setRatingModal(false)}>
        <Box
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            margin: "50px auto",
            width: "400px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Đánh giá sản phẩm
          </Typography>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  color: star <= rating ? "gold" : "gray",
                }}
              >
                {star <= rating ? <Star /> : <StarBorder />}
              </Button>
            ))}
          </div>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Viết đánh giá của bạn..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={submitFeedback}>
            Gửi đánh giá
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderList;
