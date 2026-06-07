import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  email: string;
  name: string;
  pictureLink: string;
  isSignedIn: boolean;
  signIn: (email: string, name: string, pictureLink: string) => void;
  isAuthenticating: boolean;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pictureLink, setPictureLink] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const signIn = (email: string, name: string, pictureLink: string) => {
    setEmail(email);
    setName(name);
    setPictureLink(pictureLink);

    setIsSignedIn(true);
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch("/api/auth-refresh", { method: "POST" });

        if (response.ok) {
          const { accessToken, user: recoveredUser } = await response.json();

          setAccessToken(accessToken);

          if (recoveredUser) {
            setEmail(recoveredUser.email);
            setName(recoveredUser.name);
            setPictureLink(recoveredUser.pictureLink);
          }
        } else {
          setEmail("");
          setName("");
          setPictureLink("");
        }
      } catch {
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuthorization();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        email,
        name,
        pictureLink,
        isSignedIn,
        signIn,
        isAuthenticating,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
