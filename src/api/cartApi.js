import api from "./axiosClient";

const cartApi = {
    getCart: async (userId) => {
        const res = await api.get(`/cart/${userId}`);
        return res.data;
    },

    addToCart: async (cartId, jewelryId, quantity = 1) => {
        const res = await api.post(`/cart/add`, null, {
            params: { cartId, jewelryId, quantity }
        });
        return res.data;
    },

    removeItem: async (itemId) => {
        const res = await api.delete(`/cart/item/${itemId}`);
        return res.data;
    },

    updateQuantity: async (itemId, quantity) => {
        const res = await api.put(`/cart/item/${itemId}`, null, {
            params: { quantity }
        });
        return res.data;
    },
};

export default cartApi;
