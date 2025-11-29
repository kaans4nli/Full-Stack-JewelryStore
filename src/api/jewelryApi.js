import api from "./axiosClient";

// Admin endpoints için header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  }
});

// 🔹 Admin: sayfalı jewelry listesi
export const getJewelryItems = async ({ keyword, categoryId, materialId, page = 0, size = 10 }) => {
  const params = {};
  if (keyword) params.keyword = keyword;
  if (categoryId) params.categoryId = categoryId;
  if (materialId) params.materialId = materialId;
  params.page = page;
  params.size = size;

  const res = await api.get("/admin/jewelry-items/search", { params, ...authHeader() });
  return res.data;
};

// 🔹 Admin: tek ürün
export const getJewelryItemById = async (id) => {
  const res = await api.get(`/admin/jewelry-items/${id}`, authHeader());
  return res.data;
};

// 🔹 Admin: oluştur
export const createJewelryItem = async (formData) => {
  const res = await api.post("/admin/jewelry-items", formData, authHeader());
  return res.data;
};

// 🔹 Admin: güncelle
export const updateJewelryItem = async (id, formData) => {
  const res = await api.put(`/admin/jewelry-items/${id}`, formData, authHeader());
  return res.data;
};

// 🔹 Admin: sil
export const deleteJewelryItem = async (id) => {
  const res = await api.delete(`/admin/jewelry-items/${id}`, authHeader());
  return res.data;
};

// 🔹 Public: tüm ürünler
export const getAllJewelryItemsPublic = async () => {
  const res = await api.get("/jewelry");
  return res.data;
};

// 🔹 Public: tek ürün
export const getJewelryItemByIdPublic = async (id) => {
  const res = await api.get(`/jewelry/${id}`);
  return res.data;
};
