import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import axios, { type AxiosInstance } from 'axios';

// Define the shape of the auth state
interface AuthState {
  accessToken: string | null;
  // refreshToken: string | null;
  // api?: AxiosInstance;
}

// Define the shape of the context value
interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

// Create the context with a default value that matches the expected shape
export const AuthContext = createContext<AuthContextType>({
  authState: {
    accessToken: null,
    // refreshToken: null,
  },
  setAuthState: () => {},
});

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    // refreshToken: null,
  });

  // useEffect(() => {
  // Initialize axios interceptors here
  // const api = axios.create({
  //   baseURL: 'http://localhost:4000',
  // });
  //
  // api.interceptors.request.use(
  //   config => {
  //     if (authState.accessToken) {
  //       config.headers['Authorization'] = `Bearer ${authState.accessToken}`;
  //     }
  //     return config;
  //   },
  //   error => {
  //     return Promise.reject(error);
  //   }
  // );
  //
  // api.interceptors.response.use(
  //   response => {
  //     return response;
  //   },
  //   async error => {
  //     const originalRequest = error.config;
  //     if (error.response.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;
  //       const response = await axios.post('http://localhost:4000/token', {
  //         token: authState.refreshToken,
  //       });
  //       setAuthState({
  //         ...authState,
  //         accessToken: response.data.accessToken,
  //       });
  //       originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
  //       return api(originalRequest);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  // Save the axios instance to the context state
  // setAuthState(prevState => ({
  //   ...prevState,
  //   api,
  // }));
  // }, [authState.accessToken ,authState.refreshToken
  // ]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
