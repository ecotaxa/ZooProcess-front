import React, {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
  useContext,
  useMemo,
  type Dispatch,
} from 'react';

// Define the shape of the auth state
interface AuthState {
  accessToken: string | null;
}

// Define auth actions
type AuthAction = { type: 'LOGIN'; payload: string } | { type: 'LOGOUT' };

// Define the shape of the context value
export interface AuthContextType {
  authState: AuthState;
  dispatch: Dispatch<AuthAction>;
  login: (token: string) => void;
  logout: () => void;
}

// Auth reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        accessToken: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        accessToken: null,
      };
    default:
      return state;
  }
};

// Create the context with a default value
const defaultContextValue: AuthContextType = {
  authState: {
    accessToken: null,
  },
  dispatch: () => {},
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Safely get token from localStorage
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize state from localStorage if available
  const [authState, dispatch] = useReducer(authReducer, {
    accessToken: getStoredToken(),
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (authState.accessToken) {
        localStorage.setItem('accessToken', authState.accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }, [authState.accessToken]);

  // Action creators
  const login = (token: string) => {
    dispatch({ type: 'LOGIN', payload: token });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Create a memoized context value with all dependencies
  const contextValue = useMemo(
    () => ({
      authState,
      dispatch,
      login,
      logout,
    }),
    [authState]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
