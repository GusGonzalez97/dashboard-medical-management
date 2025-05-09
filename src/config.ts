import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';
import packageJson from '../package.json';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
  logLevel: keyof typeof LogLevel;
}

const CLIENT_NAME: string = process.env.NEXT_PUBLIC_CLIENT_NAME ?? '';
const API_URL_BASE: string = process.env.NEXT_PUBLIC_GATEWAY_URL ?? '';
const FRONT_URL: string = process.env.NEXT_PUBLIC_HOST ?? '';
const DOCTOR_ID: string = process.env.NEXT_PUBLIC_DOCTOR_ID??''

export const config = {
  APP_VERSION: packageJson.version,
  HEADER_TITLE: 'CDV',
  HEADER_DESCRIPTION: 'Centro de la visión',
  TOKEN_KEY: `${CLIENT_NAME}_JWT`,
  REFRESH_TOKEN_KEY: `${CLIENT_NAME}_JWT_REFRESH`,
  SUPPORT_EMAIL: 'gusegonzalez97@gmail.com',
  API_URL_BASE,
  FRONT_URL,
  site: { name: 'Centro de Visión', description: '', themeColor: '#090a0b', url: getSiteURL() },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
  doctorId: DOCTOR_ID
};
