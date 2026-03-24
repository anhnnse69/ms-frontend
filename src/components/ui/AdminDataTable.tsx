'use client';

import React from 'react';

interface DataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export interface TableColumn<T> {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}

export function DataTable<T extends { id?: string }>({
    columns,
    data,
    onEdit,
    onDelete,
    onRowClick,
    isLoading,
    emptyMessage = 'Không có dữ liệu',
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full bg-white">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={`px-6 py-3 text-left text-sm font-semibold ${column.className || ''}`}
                            >
                                {column.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && <th className="px-6 py-3 text-left text-sm font-semibold">Hành động</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td className="px-6 py-12 text-center text-gray-500 text-sm" colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, rowIndex) => (
                            <tr
                                key={item.id || rowIndex}
                                className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={onRowClick ? () => onRowClick(item) : undefined}
                            >
                                {columns.map((column) => (
                                    <td key={String(column.key)} className={`px-6 py-4 text-sm text-gray-700 ${column.className || ''}`}>
                                        {column.render ? column.render(item[column.key], item) : String(item[column.key] || '-')}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-sm flex gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-medium"
                                            >
                                                Sửa
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

interface BadgeProps {
    variant?: 'success' | 'danger' | 'warning' | 'info';
    children: React.ReactNode;
}

export function Badge({ variant = 'info', children }: BadgeProps) {
    const variants = {
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>{children}</span>;
}
