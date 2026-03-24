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

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    PendingConfirmation: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    CheckedIn: 'bg-indigo-100 text-indigo-800',
    InProgress: 'bg-purple-100 text-purple-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    NoShow: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${map[status] || ''}`}>
      {status}
    </span>
  );
};