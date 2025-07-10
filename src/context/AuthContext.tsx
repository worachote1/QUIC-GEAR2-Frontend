'use client';

import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import api from '@/lib/axios';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/user';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: IUser | null;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const refreshAndLoadUser = async () => {
    try {
      
      // Use plain axios to avoid interceptors
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auth/refresh-access-token-only`,
        {},
        { withCredentials: true }
        );

      const newAccessToken = res.data.data.accessToken;

      setAccessToken(newAccessToken);
    
      const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user/profile`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });

      setUser(profileRes.data.data);

    } catch (err) {
        console.warn('[AuthProvider] ❌ Refresh failed, user not logged in or refresh token is expired');
        setAccessToken(null);
        setUser(null);
    }
  };

  // 1. On first load, try to refresh token and get user
  useEffect(() => {
    refreshAndLoadUser();
  }, []);

 // 2. Setup interceptors — run before UI paint to prevent race conditions
 // set interceptors before any child calls API (Use `useLayoutEffect` to guarantee it runs before paint (safer for SSR or fast renders)
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auth/refresh-token`,
              {},
              { withCredentials: true } // don't forget this if you store refresh token in cookies
            );
            const newToken = res.data.data.accessToken;
            
            setAccessToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            console.log('[Interceptor] 🔄 Refreshed token and retrying');

            return api(originalRequest);
          } catch (err) {
            console.warn('[Interceptor] ❌ Refresh failed → redirecting');

            setAccessToken(null);
            setUser(null);

            const path = window.location.pathname + window.location.search;
            localStorage.setItem('redirectAfterLogin', path);
            router.push("/auth/sign-in");
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
