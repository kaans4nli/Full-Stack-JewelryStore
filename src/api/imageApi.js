import api from "./axiosClient";

// 🔹 Ürün görsellerini getir
export const getProductImages = async (itemId) => {
  const res = await api.get(`/admin/images/${itemId}`);
  
  // Artık frontend URL’ye dokunmuyoruz
  return res.data;
};

// 🔹 Ürün görseli ekle (URL ile)
export const addProductImage = async (itemId, imageUrl) => {
  const res = await api.post(`/admin/images/${itemId}`, imageUrl, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 🔹 Ürün görseli yükle (file ile)
export const uploadProductImage = async (itemId, file) => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await api.post(`/admin/images/${itemId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 🔹 Ürün görseli sil
export const deleteProductImage = async (imageId) => {
  await api.delete(`/admin/images/${imageId}`);
};
