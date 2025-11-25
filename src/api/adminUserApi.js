import api from "./axiosClient";

export const getAllUsers = async ({ keyword, page = 0, size = 10 }) => {
  const params = { keyword, page, size };
  const res = await api.get("/admin/users", { params });
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await api.post("/admin/users/new", userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await api.put(`/admin/users/update/${id}`, userData);
  return res.data;
};

export const deleteUserById = async (id) => {
  await api.delete(`/admin/users/delete/${id}`);
};
