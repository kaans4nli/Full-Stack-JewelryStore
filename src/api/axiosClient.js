import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ================= REFRESH QUEUE ================= */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

/* ================= INTERCEPTORS ================= */

export const setupInterceptors = (getToken, setToken, clearToken, navigate) => {

  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/jewelry",
    "/payments/create-payment-intent",
  ];

  const isPublicRequest = (url = "") =>
    publicPaths.some(path => url.startsWith(path));

  /* ---------- REQUEST ---------- */
  api.interceptors.request.use(
    (config) => {
      if (!isPublicRequest(config.url)) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    Promise.reject
  );

  /* ---------- RESPONSE ---------- */
  api.interceptors.response.use(
    response => response,
    async (error) => {

      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url.startsWith("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        const newAccessToken = data.accessToken;

        setToken(newAccessToken);
        api.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);

        clearToken();
        delete api.defaults.headers.common.Authorization;

        navigate("/login");
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }
  );
};

export default api;
