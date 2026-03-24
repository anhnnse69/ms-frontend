'use client';

import { usePathname } from 'next/navigation';
import { WeatherChatWidget } from './WeatherChatWidget';

export function WeatherChatWrapper() {
  const pathname = usePathname();
  
  // Các route không hiển thị weather widget
  const adminRoutes = ['/admin', '/doctor', '/manager'];
  
  // Kiểm tra nếu pathname bắt đầu với các route admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  // Chỉ hiển thị weather widget ở các trang public
  if (isAdminRoute) {
    return null;
  }
  
  return <WeatherChatWidget />;
}
