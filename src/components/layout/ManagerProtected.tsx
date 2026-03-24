'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ManagerProtectedProps {
    children: React.ReactNode;
}

export function ManagerProtected({ children }: ManagerProtectedProps) {
    const router = useRouter();

    return <>{children}</>;
}
