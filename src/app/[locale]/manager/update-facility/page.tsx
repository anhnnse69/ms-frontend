'use client';

import React, { useEffect, useState } from 'react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { useManagerCheck } from '@/hooks/useAuth';
import { managerFacilityApi } from '@/services/api/manager.api';

export default function FacilityPage() {
    const { user } = useManagerCheck();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        id: '',
        nameVi: '',
        nameEn: '',
        descriptionVi: '',
        descriptionEn: '',
        logoUrl: '',
        address: '',
        phone: '',
        email: '',
        city: '',
        type: 0,
    });

    useEffect(() => {
        if (user?.facilityId) {
            setForm((prev) => ({
                ...prev,
                id: user.facilityId ?? '',
            }));
        }
    }, [user]);

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const validate = () => {
        if (!form.id) return 'Thiếu facilityId';
        if (!form.nameVi) return 'Thiếu tên tiếng Việt';
        if (!form.nameEn) return 'Thiếu tên tiếng Anh';
        if (!form.address) return 'Thiếu địa chỉ';
        if (!form.phone) return 'Thiếu số điện thoại';
        if (!form.email) return 'Thiếu email';
        if (!form.city) return 'Thiếu thành phố';
        return null;
    };

    const handleSubmit = async () => {
        const error = validate();
        if (error) {
            alert(error);
            return;
        }

        try {
            setLoading(true);
            const res = await managerFacilityApi.update(form);

            if (res.codeMessage === 'APP_MESSAGE_2000') {
                alert('✅ Cập nhật thành công');
            } else {
                alert('❌ Cập nhật thất bại');
            }
        } catch (err) {
            console.error(err);
            alert('❌ Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ManagerLayout>
            <div className="space-y-8">
                {/* ===== Header ===== */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        🏢 Cập nhật cơ sở
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Cập nhật thông tin chi tiết của cơ sở
                    </p>
                </div>

                {/* ===== Form Card ===== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

                    {/* ===== Basic Info ===== */}
                    <Section title="Thông tin cơ bản">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Tên (VI)" value={form.nameVi} onChange={(v) => handleChange('nameVi', v)} />
                            <Input label="Tên (EN)" value={form.nameEn} onChange={(v) => handleChange('nameEn', v)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Mô tả (VI)" value={form.descriptionVi} onChange={(v) => handleChange('descriptionVi', v)} />
                            <Input label="Mô tả (EN)" value={form.descriptionEn} onChange={(v) => handleChange('descriptionEn', v)} />
                        </div>
                    </Section>

                    {/* ===== Contact ===== */}
                    <Section title="Thông tin liên hệ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Địa chỉ" value={form.address} onChange={(v) => handleChange('address', v)} />
                            <Input label="Thành phố" value={form.city} onChange={(v) => handleChange('city', v)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="SĐT" value={form.phone} onChange={(v) => handleChange('phone', v)} />
                            <Input label="Email" value={form.email} onChange={(v) => handleChange('email', v)} />
                        </div>
                    </Section>

                    {/* ===== Logo ===== */}
                    <Section title="Logo">
                        <Input
                            label="Logo URL"
                            value={form.logoUrl}
                            onChange={(v) => handleChange('logoUrl', v)}
                        />

                        {form.logoUrl && (
                            <div className="mt-3">
                                <img
                                    src={form.logoUrl}
                                    alt="logo preview"
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </Section>

                    {/* ===== Type ===== */}
                    <Section title="Loại cơ sở">
                        <select
                            value={form.type}
                            onChange={(e) => handleChange('type', Number(e.target.value))}
                            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value={0}>Hospital</option>
                            <option value={1}>Clinic</option>
                        </select>
                    </Section>

                    {/* ===== Submit ===== */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                            {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}

// ===== Section Wrapper =====
const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {children}
    </div>
);

// ===== Input =====
const Input = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">{label}</label>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />
    </div>
);