'use client';

import React, { useEffect } from 'react';
import { useAdminCheck } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AdminProtectedProps {
    children: React.ReactNode;
}

export function AdminProtected({ children }: AdminProtectedProps) {
    const router = useRouter();
    const { isLoading, isAdmin } = useAdminCheck();

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            // Redirect to home if not admin
            router.push('/');
        }
    }, [isLoading, isAdmin, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
}
