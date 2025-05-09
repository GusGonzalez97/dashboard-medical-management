'use client';
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { config } from '../config';
import { AuthService } from '../services/auth/auth-services';
import { UserServices } from '@/services/user/user-services';
import api from '../services/api';
import { createCookies, deleteCookies } from '@/utils/cookies';
import type { AuthCredentials } from '@/types/auth';
import type { PlatformUserI } from '@/types/user';
import { paths } from '@/paths';
import { RolesEnum } from '@/types/enum/roles.enum';

const AuthContext = createContext<UserContextValue | undefined>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export interface UserContextValue {
  user: PlatformUserI | null;
  isAuthenticated: boolean;
  token?: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  saveToken: (props: AuthCredentials) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isAdmin?: boolean;
  isDoctor?: boolean;
}

export function AuthProvider(props: AuthProviderProps): React.ReactNode {
  const router = useRouter();
  const { TOKEN_KEY, REFRESH_TOKEN_KEY } = config;

  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<PlatformUserI | null>(null);
  const pathname = usePathname()

  const isDoctor = useMemo(function isDoctorMemo() {
    return user?.roles.includes(RolesEnum.DOCTOR);
  }, [user]);

  const isAdmin = useMemo(function isAdminMemo() {
    return user?.roles.includes(RolesEnum.ADMIN);
  }, [user]);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToken = useCallback((_props: AuthCredentials): void => {
    const { jwt, expiration, refresh, refreshExpiration } = _props;
    api.defaults.headers.common.Authorization = `JWT ${jwt}`;
    createCookies(jwt, expiration, refresh, refreshExpiration);
    setToken(jwt);
  }, []);
  

  const requestNewCredentials = useCallback(async (_refreshToken: string): Promise<void> => {
    const refreshTokenFlow = async (): Promise<void> => {
      const res = await AuthService.refreshToken(_refreshToken);
      if (res.data?.jwt) {
        saveToken(res.data);
      }
    };
  
    await withLoading(refreshTokenFlow);
  }, [saveToken, withLoading]);
  
  const logout = useCallback(function logout(): void {
    router.push(paths.auth.signIn);
    deleteCookies();
    if (api.defaults.headers.common.Authorization) {
      delete api.defaults.headers.common.Authorization;
    }
    setToken(undefined);
    setUser(null);
    setLoading(false);
  }, [router]);

  const loadUserFromCookies = useCallback(async function loadUserFromCookies(): Promise<void> {
    const tokenCookie = Cookies.get(TOKEN_KEY);
    const refreshTokenCookie = Cookies.get(REFRESH_TOKEN_KEY);

    async function fetchUserFromCookies(): Promise<void> {
      if (tokenCookie && refreshTokenCookie) {
        api.defaults.headers.common.Authorization = `Bearer ${tokenCookie}`;
        setToken(tokenCookie);
        setLoading(false);

        if (!user) {
          try {
            setLoading(true);
            const res = await UserServices.getProfile();
            setUser(res.data);
          } catch (e) {
            throw new Error(`Failed to load user from cookies: ${e instanceof Error ? e.message : String(e)}`);
          }
          finally {
            setLoading(false);
          }
        }

         if (pathname === paths.auth.signIn) {
           router.push(paths.dashboard.overview);
         }
      } else if (!tokenCookie && refreshTokenCookie) {
        await requestNewCredentials(refreshTokenCookie);
      } else {
        setToken(undefined);
        logout()
      }
    }

    await withLoading(fetchUserFromCookies);
  }, [TOKEN_KEY, REFRESH_TOKEN_KEY, user,requestNewCredentials,logout,withLoading,pathname,router]);

  useEffect(function initLoad() {
    loadUserFromCookies().catch((_error: unknown) => {
      // Handle the error appropriately, e.g., log to an external service
      // Log the error using a logging service or handle it appropriately
      // Example: LoggingService.logError('Error loading user from cookies:', error);
    });
  }, [loadUserFromCookies]);

  const login = useCallback(async function login(username: string, password: string): Promise<boolean> {
    async function performLogin(): Promise<boolean> {
      const { status, data } = await AuthService.login(username, password);
      if (status === 201 && data?.jwt) {
        saveToken(data);
        return true;
      }
      return false;
    }

    return await withLoading(performLogin);
  }, [saveToken,withLoading]);

  const isAuthenticated = token !== undefined;

  const authContextValue = useMemo(function computeContextValue() {
    return {
      isAuthenticated,
      token,
      login,
      logout,
      user,
      loading,
      saveToken,
      setLoading,
      isDoctor,
      isAdmin
    };
  }, [isAuthenticated, token, loading, user, login, logout, isDoctor, isAdmin,saveToken]);

  return <AuthContext.Provider value={authContextValue}>{props.children}</AuthContext.Provider>;
}

// Hook para consumir el contexto
export function useAuth(): UserContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
