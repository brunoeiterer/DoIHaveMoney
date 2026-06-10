import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../../lib/types/User";
import {
  setAuthSession,
  setReactStateUpdater,
  type AuthSession,
} from "./AuthGlobal";

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a LanguageProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const signIn = (user: User) => {
    setUser(user);
    setIsSignedIn(true);
  };

  const signOut = async () => {
    setUser(null);
    setAuthSession(null, null);

    await fetch("/api/signout", { method: "POST" });
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch("/api/auth-refresh", { method: "POST" });

        if (response.ok) {
          const { accessToken, user: recoveredUser } =
            (await response.json()) as AuthSession;

          setAuthSession(accessToken, recoveredUser);

          if (recoveredUser) {
            setUser(recoveredUser);
          }
        } else {
          setUser(null);
        }
      } catch {
      } finally {
        setIsAuthenticating(false);
      }
    };

    setReactStateUpdater((session: AuthSession) => {
      setUser(session.user);
    });

    checkAuthorization();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn,
        signIn,
        signOut,
        isAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
