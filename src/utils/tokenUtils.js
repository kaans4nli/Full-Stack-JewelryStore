import { jwtDecode } from "jwt-decode";

export const getTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // ms
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  return Date.now() >= exp;
};
