'use client';

import { useState, useEffect } from 'react';
import { CurrentUser } from '@/types/admin';

export const useAuth = () => {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('accessToken');

                if (storedUser && token) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAdmin(parsedUser.role === 'ITAdmin');
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            }
            setIsLoading(false);
        };

        checkAuth();

        if (typeof window !== 'undefined') {
            const handleAuthChanged = () => {
                // Khi login/logout, đọc lại localStorage và cập nhật Header ngay
                checkAuth();
            };

            window.addEventListener('auth-changed', handleAuthChanged);
            return () => {
                window.removeEventListener('auth-changed', handleAuthChanged);
            };
        }
    }, []);

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new CustomEvent('auth-changed'));
        }
        setUser(null);
        setIsAdmin(false);
    };

    return { user, isLoading, isAdmin, logout };
};

export const useAdminCheck = () => {
    const { user, isLoading, isAdmin } = useAuth();

    return {
        user,
        isLoading,
        isAdmin,
        hasAdminAccess: !isLoading && isAdmin && user?.role === 'ITAdmin',
    };
};
