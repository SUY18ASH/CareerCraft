import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // auth = { user: {id,name,email}, token: "JWT…" }
    const [auth, setAuth] = useState(() => {
        const saved = localStorage.getItem('auth');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData, token) => {
        ['extractedText','extractedSkills','recommendedJobs','bookmarks'].forEach(k => localStorage.removeItem(k));
        const a = { user: userData, token };
        setAuth(a);
        localStorage.setItem('auth', JSON.stringify(a));
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
