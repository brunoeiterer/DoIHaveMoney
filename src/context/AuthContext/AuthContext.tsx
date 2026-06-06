import { createContext, useContext, useState } from "react";

interface AuthContextType {
    email: string;
    name: string;
    pictureLink: string;
    isSignedIn: boolean;
    signIn: (email: string, name: string, pictureLink: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a LanguageProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ email, setEmail ] = useState('');
    const [ name, setName] = useState('');
    const [ pictureLink, setPictureLink ] = useState('');
    const [ isSignedIn, setIsSignedIn ] = useState(false);

    const signIn = (email: string, name: string, pictureLink: string) => {
        setEmail(email);
        setName(name);
        setPictureLink(pictureLink);

        setIsSignedIn(true);
    }

    const signOut = () => {

    }

    return (
        <AuthContext.Provider value={{ email, name, pictureLink, isSignedIn, signIn }}>
            {children}
        </AuthContext.Provider>
    );
};