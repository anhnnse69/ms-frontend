'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminCheck } from '@/hooks/useAuth';

interface SidebarItem {
    label: string;
    href: string;
    icon: string;
    children?: SidebarItem[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: '📊',
    },
    {
        label: 'Quản lý Người dùng',
        href: '/admin/users',
        icon: '👥',
    },
    {
        label: 'Quản lý Bác sĩ',
        href: '/admin/doctors',
        icon: '👨‍⚕️',
    },
    {
        label: 'Quản lý Cơ sở Y tế',
        href: '/admin/facilities',
        icon: '🏥',
    },
    {
        label: 'Quản lý Chuyên khoa',
        href: '/admin/specialties',
        icon: '📋',
    },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const { user, isAdmin, isLoading, hasAdminAccess } = useAdminCheck();

    // Check if user is admin, redirect if not
    React.useEffect(() => {
        if (!isLoading && !hasAdminAccess) {
            window.location.href = '/';
        }
    }, [isLoading, hasAdminAccess]);

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-linear-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-blue-700">
                    <div className={`text-2xl font-bold transition-all ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        MedixSystem
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-blue-700 rounded transition-colors"
                    >
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.href)
                                    ? 'bg-blue-600 shadow-md'
                                    : 'hover:bg-blue-700'
                                }`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="border-t border-blue-700 p-4">
                    <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {'A'}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">Admin</p>
                                <p className="text-xs text-blue-300 truncate">Quản trị viên</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Hệ thống Quản lý Y tế</h1>
                            <p className="text-sm text-gray-500">Chào mừng Quản trị viên</p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
