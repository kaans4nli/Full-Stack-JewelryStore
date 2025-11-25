import api from "./axiosClient";

export const getMaterials = async () => (await api.get("/admin/materials")).data;
export const getMaterialById = async (id) => (await api.get(`/admin/materials/${id}`)).data;
export const createMaterial = async (data) => (await api.post("/admin/materials", data)).data;
export const updateMaterial = async (id, data) => (await api.put(`/admin/materials/${id}`, data)).data;
export const deleteMaterial = async (id) => (await api.delete(`/admin/materials/${id}`)).data;
