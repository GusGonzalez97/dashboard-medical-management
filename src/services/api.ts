import { config } from '@/config';
import type { AuthCredentials } from '@/types/auth';
import { createCookies, deleteCookies } from '@/utils/cookies';
import axios from 'axios';
import Axios, { type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const plainAxios = axios.create({
  baseURL: BASE_URL, 
});

const { TOKEN_KEY, REFRESH_TOKEN_KEY } = config;

api.interceptors.request.use(
  async (_config: InternalAxiosRequestConfig) => {
    const tokenCookie = Cookies.get(TOKEN_KEY);
    if (tokenCookie !== undefined) {
      if (_config && _config.headers) {
        _config.headers.Authorization = `Bearer ${tokenCookie}`;
      }
      return _config;
    }
    const refreshTokenCookie = Cookies.get(REFRESH_TOKEN_KEY);

    if (refreshTokenCookie !== undefined) {
      const res : {data: AuthCredentials}= await plainAxios.patch('/v1/auth/refresh',{refresh:refreshTokenCookie})
      const { data } = res;
      if (data.jwt !== undefined) {
        if (_config && _config.headers) {
          _config.headers.Authorization = `Bearer ${data.jwt}`;
        }
        createCookies(data.jwt, data.expiration, data.refresh, data.refreshExpiration);
        api.defaults.headers.common.Authorization = `Bearer ${data.jwt}`;
      } else {
        deleteCookies();
      }
    }
    return _config;
  },
  async (error) => {
    return await Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;