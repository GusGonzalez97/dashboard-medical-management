import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { config } from '../config';
import Cookies from 'js-cookie';

const { TOKEN_KEY, REFRESH_TOKEN_KEY } = config;

export const createCustomCookie = (name: string, value: string, expires: Date):void => {
  Cookies.set(name, value, { expires });
};

export const createCookies = (jwt: string, jwtExpiration: number, refresh: string, refreshExpiration: number): void => {
  const currentTime = new Date().getTime();
  const timeDiff = jwtExpiration * 1000 - currentTime;
  const expire = timeDiff / (1000 * 60 * 60 * 24);
  Cookies.set(TOKEN_KEY, jwt, { expires: expire });

  const refreshTimeDiff = refreshExpiration * 1000 - currentTime;
  const refreshDays = refreshTimeDiff / (1000 * 60 * 60 * 24);

 Cookies.set(REFRESH_TOKEN_KEY, refresh, { expires: refreshDays });
};

export const deleteCookies = (): void => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  localStorage.clear();
};

export const parseCookies = (cookies: ReadonlyRequestCookies) => {
  const jwt = cookies.get(config.TOKEN_KEY)?.value
  const refresh = cookies.get(config.REFRESH_TOKEN_KEY)?.value
  const objectWithCookies = { [config.TOKEN_KEY]:jwt, [config.REFRESH_TOKEN_KEY]:refresh}
  return objectWithCookies
};
