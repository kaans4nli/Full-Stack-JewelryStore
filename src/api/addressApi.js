import api from "./axiosClient";

export const getAddresses = () =>
  api.get("/user/addresses").then(res => res.data);

export const getAddressById = (id) =>
  api.get(`/user/addresses/${id}`).then(res => res.data);

export const createAddress = (address) =>
  api.post("/user/addresses", address).then(res => res.data);

export const updateAddress = (id, updatedAddress) =>
  api.put(`/user/addresses/${id}`, updatedAddress).then(res => res.data);

export const deleteAddress = (id) =>
  api.delete(`/user/addresses/${id}`);

export const setDefaultAddress = (id) =>
  api.put(`/user/addresses/${id}/default`);
