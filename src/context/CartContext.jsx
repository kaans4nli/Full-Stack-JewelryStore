import React, { createContext, useState, useEffect, useContext } from "react";
import cartApi from "../api/cartApi";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, accessToken } = useContext(AuthContext);

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && accessToken) {
            loadCart();
        } else {
            setCart(null);
        }
    }, [user, accessToken]);

    const loadCart = async () => {
        try {
            if (!user) return;
            setLoading(true);
            const data = await cartApi.getCart(user.id);
            setCart(data);
        } catch (err) {
            console.error("Cart yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (jewelryId, quantity = 1) => {
        try {
            if (!cart || !cart.id) return;
            await cartApi.addToCart(cart.id, jewelryId, quantity);
            await loadCart();
        } catch (err) {
            console.error("Sepete eklenemedi:", err);
        }
    };

    const clearCart = async () => {
        try {
            if (!cart?.id) return;
            await cartApi.clearCart(cart.id);
            setCart(null);
        } catch (err) {
            console.error("Cart temizlenemedi:", err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await cartApi.removeItem(itemId);
            await loadCart();
        } catch (err) {
            console.error("Cart item silinemedi:", err);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await cartApi.updateQuantity(itemId, quantity);
            await loadCart();
        } catch (err) {
            console.error("Miktar güncellenemedi:", err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeItem,
                updateQuantity,
                loadCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
