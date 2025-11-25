import api from "./axiosClient";

export const getJewelryItems = async ({ keyword, categoryId, materialId, page = 0, size = 10 }) => {
  const params = {};
  if (keyword) params.keyword = keyword;
  if (categoryId) params.categoryId = categoryId;
  if (materialId) params.materialId = materialId;
  params.page = page;
  params.size = size;

  const res = await api.get("/admin/jewelry-items/search", { params });
  return res.data;
};

export const getJewelryItemById = async (id) => {
  const res = await api.get(`/admin/jewelry-items/${id}`);
  return res.data;
};

export const createJewelryItem = async (formData) => {
  const res = await api.post("/admin/jewelry-items", formData);
  return res.data;
};

export const updateJewelryItem = async (id, formData) => {
  const res = await api.put(`/admin/jewelry-items/${id}`, formData);
  return res.data;
};

export const deleteJewelryItem = async (id) => {
  const res = await api.delete(`/admin/jewelry-items/${id}`);
  return res.data;
};
