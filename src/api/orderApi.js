import api from "./axiosClient";

// Auth header helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  }
});

// 🔹 Create a new order after successful Stripe payment
export const createOrder = async ({ userId, addressId, items }) => {
  const res = await api.post(
    "/orders/create",
    {
      userId,
      addressId,
      items
    },
    authHeader()
  );
  return res.data;
};

// 🔹 Get all orders for the current user
export const getOrders = async () => {
  const res = await api.get("/orders/user/me", authHeader());
  return res.data;
};

// 🔹 Get orders by specific user ID
export const getOrdersByUser = async (userId) => {
  const res = await api.get(`/orders/user/${userId}`, authHeader());
  return res.data;
};

// 🔹 Get order details by order ID
export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`, authHeader());
  return res.data;
};

// 🔹 Cancel an order
export const cancelOrder = async (orderId) => {
  const res = await api.post(`/orders/${orderId}/cancel`, {}, authHeader());
  return res.data;
};

// 🔹 Get order tracking info
export const getOrderTracking = async (orderId) => {
  const res = await api.get(`/orders/${orderId}/tracking`, authHeader());
  return res.data;
};
