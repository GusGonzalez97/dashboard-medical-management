// utils/withSession.ts
import api from '../services/api';
import { parseCookies } from './cookies';
import { AuthService } from '@/services/auth/auth-services';
import { config } from '@/config';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const { TOKEN_KEY, REFRESH_TOKEN_KEY } = config;

const withSession = async <T>(
  cookies: ReadonlyRequestCookies,
  callback: () => Promise<T>
): Promise<T | Record<string, never>> => {
  const parsedCookies = parseCookies(cookies);
  const token = parsedCookies[TOKEN_KEY];
  const refreshToken = parsedCookies[REFRESH_TOKEN_KEY];

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return callback();
  }

  if (refreshToken) {
    const res = await AuthService.refreshToken(refreshToken);
    const { jwt } = res.data;

    if (jwt) {
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      return callback();
    }
  }
  return {};
};

export default withSession;
