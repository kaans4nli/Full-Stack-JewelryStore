import api from "./axiosClient";

const checkoutApi = {
    // 1️⃣ Order oluştur (AUTH GEREKİR)
    createOrder: async (data) => {
        const res = await api.post("/orders/create", data);
        return res.data;
    },

    // 2️⃣ PaymentIntent (PUBLIC)
    createPaymentIntent: async ({ orderId }) => {
        const res = await api.post(
            "/payments/create-payment-intent",
            { orderId }
        );
        return res.data;
    },
};

export default checkoutApi;
