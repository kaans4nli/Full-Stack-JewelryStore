import api from "./axiosClient";

export const getCategories = async () => (await api.get("/admin/categories")).data;
export const getCategoryById = async (id) => (await api.get(`/admin/categories/${id}`)).data;
export const createCategory = async (data) => (await api.post("/admin/categories", data)).data;
export const updateCategory = async (id, data) => (await api.put(`/admin/categories/${id}`, data)).data;
export const deleteCategory = async (id) => (await api.delete(`/admin/categories/${id}`)).data;
