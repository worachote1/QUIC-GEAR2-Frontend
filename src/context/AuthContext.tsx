// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/router';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: any;
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

  // 🔁 Refresh access token + fetch user profile
  const refreshAndLoadUser = async () => {
    try {
      const res = await api.post('/auth/refresh-token'); // *** change this to give me (get new accessToken by existing refresh  token on cookie)
      const newAccessToken = res.data.data.accessToken;
      setAccessToken(newAccessToken);

      const profileRes = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
      setUser(profileRes.data.data);
    } catch (err) {
        setAccessToken(null);
        setUser(null);

        console.log("check localtion path: ", window.location.pathname)
        console.log("check location search: ", window.location.search)

        // Save last path before redirect (in sign-inpage after login sucess it will redirect to that path)
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search;
            localStorage.setItem('redirectAfterLogin', currentPath); // save to localStorage
            window.location.href = '/auth/sign-in';
        }
    }
  };

  // 🔐 On load or refresh: try auto login
  useEffect(() => {
    refreshAndLoadUser();
  }, []);

  // ⚙️ Attach Interceptors using latest token
  useEffect(() => {
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
            const res = await api.post('/auth/refresh-token');
            const newToken = res.data.data.accessToken;
            setAccessToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (err) {
            setAccessToken(null);
            setUser(null);
            const path = window.location.pathname + window.location.search;
            localStorage.setItem('redirectAfterLogin', path);
            router.push('/auth/sign-in');
          }
        }

        return Promise.reject(error);
      }
    );

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
