import api from "./axiosClient";

const authApi = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }).then(res => res.data),

  register: (username, email, password) =>
    api.post("/auth/register", { username, password, email }).then(res => res.data),

  getProfile: () =>
    api.get("/user/profile").then(res => res.data),

  logout: () =>
    api.post("/auth/logout", {}, { withCredentials: true }),
};

export default authApi;
