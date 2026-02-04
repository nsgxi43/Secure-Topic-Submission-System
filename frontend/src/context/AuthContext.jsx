import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // In a real app we would check session validity on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('cys_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (role, userData) => {
        // This simple login just sets the state. 
        // The actual API call happens in the Login component.
        const userObj = { role, ...userData };
        setUser(userObj);
        localStorage.setItem('cys_user', JSON.stringify(userObj));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cys_user');
        // Ideally call logout API if it existed
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading: loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
