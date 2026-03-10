import api from "./axiosClient";

const authApi = {
  login: (username, password) =>
    api
      .post("/auth/login", { username, password }, { withCredentials: true })
      .then((res) => {
        try {
          console.debug("authApi.login response:", res.status, res.headers, res.data);
        } catch (e) {}
        return res.data;
      })
      .catch((err) => {
        try {
          console.debug("authApi.login error:", err.response?.status, err.response?.headers, err.response?.data);
        } catch (e) {}
        throw err;
      }),

  register: (username, email, password) =>
    api.post("/auth/register", { username, password, email }).then(res => res.data),

  getProfile: () =>
    api
      .get("/user/profile", { withCredentials: true })
      .then((res) => {
        try {
          console.debug("authApi.getProfile response:", res.status, res.headers, res.data);
        } catch (e) {}
        return res.data;
      })
      .catch((err) => {
        try {
          console.debug("authApi.getProfile error:", err.response?.status, err.response?.headers, err.response?.data);
        } catch (e) {}
        throw err;
      }),

  logout: () =>
    api.post("/auth/logout", {}, { withCredentials: true }),
};

export default authApi;
