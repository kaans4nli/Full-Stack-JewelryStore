import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // cookie gönderimi
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const setupInterceptors = (getToken, setToken, navigate) => {
  // ✅ Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Response interceptor
  api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return api(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const res = await api.post('/auth/refresh');
          const newAccessToken = res.data.accessToken;

          setToken(newAccessToken);
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
          processQueue(null, newAccessToken);

          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          navigate('/login');
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;

// Auth işlemleri
export const login = (username, password) =>
  api.post("/auth/login", { username, password }).then(res => res.data);

export const register = (username, email, password) =>
  api.post("/auth/register", { username, email, password }).then(res => res.data);

export const getProfile = () => api.get("/user/profile").then(res => res.data);

export const logout = () => api.post("/auth/logout", {}, { withCredentials: true });

// 📦 Address işlemleri
export const getAddresses = () => api.get("/user/addresses").then(res => res.data);

export const getAddressById = (id) => api.get(`/addresses/${id}`).then(res => res.data);

export const createAddress = (address) =>
  api.post("/user/addresses", address).then(res => res.data);

export const updateAddress = (id, updatedAddress) =>
  api.put(`/user/addresses/${id}`, updatedAddress).then(res => res.data);

export const deleteAddress = (id) =>
  api.delete(`/user/addresses/${id}`).then(res => res.data);

export const setDefaultAddress = (id) => 
  api.put(`/user/addresses/${id}/default`);
