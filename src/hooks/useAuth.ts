'use client';

import { useState, useEffect } from 'react';
import { CurrentUser } from '@/types/admin';
import { getUserProfile } from '@/services/api/userProfile.api'; 

export const useAuth = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        if (storedUser && token) {
          let parsedUser = JSON.parse(storedUser);

          // Nếu là Patient, fetch full profile để có patientId, displayName, avatarUrl
          if (parsedUser.role === 'Patient') {
            try {
              const fullProfile = await getUserProfile(); // ✅ đúng API
              parsedUser = { ...parsedUser, ...fullProfile }; // merge profile
              localStorage.setItem('user', JSON.stringify(parsedUser));
            } catch (err) {
              console.error('Failed to fetch patient profile', err);
            }
          }

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
      const handleAuthChanged = () => checkAuth();
      const handleProfileUpdated = (e: Event) => {
        const customEvent = e as CustomEvent<Partial<CurrentUser>>;
        if (customEvent?.detail) {
          const existingUser = localStorage.getItem('user');
          if (existingUser) {
            try {
              const parsed = JSON.parse(existingUser);
              const merged = { ...parsed, ...customEvent.detail };
              localStorage.setItem('user', JSON.stringify(merged));
              setUser(merged);
              setIsAdmin(merged.role === 'ITAdmin');
              return;
            } catch {}
          }
        }
        checkAuth();
      };

      window.addEventListener('auth-changed', handleAuthChanged);
      window.addEventListener('profile:updated', handleProfileUpdated);

      return () => {
        window.removeEventListener('auth-changed', handleAuthChanged);
        window.removeEventListener('profile:updated', handleProfileUpdated);
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

export const useManagerCheck = () => {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            if (typeof window === 'undefined') return;

            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (!storedUser || !token) {
                setUser(null);
                setIsManager(false);
                setIsLoading(false);
                return;
            }

            const parsedUser: CurrentUser = JSON.parse(storedUser);

            const normalizeRole = (role?: string) =>
                role?.toString().trim().toLowerCase() || '';

            setUser(parsedUser);
            setIsManager(normalizeRole(parsedUser.role) === 'Manager');
            setIsLoading(false);
        };

        checkAuth();

        const handleAuthChanged = () => {
            checkAuth();
        };

        window.addEventListener('auth-changed', handleAuthChanged);
        return () => {
            window.removeEventListener('auth-changed', handleAuthChanged);
        };
    }, []);

    return {
        user,
        isLoading,
        isManager,
        hasManagerAccess:
            !isLoading &&
            isManager &&
            user?.role?.toLowerCase() === 'Manager',
    };
};
export const useDoctorCheck = () => {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDoctor, setIsDoctor] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            if (typeof window === 'undefined') return;

            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (!storedUser || !token) {
                setUser(null);
                setIsDoctor(false);
                setIsLoading(false);
                return;
            }

            const parsedUser: CurrentUser = JSON.parse(storedUser);

            const normalizeRole = (role?: string) =>
                role?.toString().trim().toLowerCase() || '';

            setUser(parsedUser);
            setIsDoctor(normalizeRole(parsedUser.role) === 'Doctor');
            setIsLoading(false);
        };

        checkAuth();

        const handleAuthChanged = () => {
            checkAuth();
        };

        window.addEventListener('auth-changed', handleAuthChanged);
        return () => {
            window.removeEventListener('auth-changed', handleAuthChanged);
        };
    }, []);

    return {
        user,
        isLoading,
        isDoctor,
        hasDoctorAccess:
            !isLoading &&
            isDoctor &&
            user?.role?.toLowerCase() === 'Doctor',
    };
};