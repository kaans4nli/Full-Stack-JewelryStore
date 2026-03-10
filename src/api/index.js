/**
 * API Index
 * Tüm API modules'ları merkezden export eder
 * 
 * Kullanım:
 * import { authApi, jewelryApi } from '../api';
 * import { getJewelryItems } from '../api';
 */

// Default Exports
import authApi from './authApi';
import cartApi from './cartApi';
import checkoutApi from './checkoutApi';

// Named Exports
export * as addressApi from './addressApi';
export * as adminUserApi from './adminUserApi';
export * as categoryApi from './categoryApi';
export * as jewelryApi from './jewelryApi';
export * as imageApi from './imageApi';
export * as materialApi from './materialApi';
export { setupInterceptors, clearAuthHeader } from './axiosClient';

// Default Exports
export { default as authApi } from './authApi';
export { default as cartApi } from './cartApi';
export { default as checkoutApi } from './checkoutApi';
export { default as api } from './axiosClient';
