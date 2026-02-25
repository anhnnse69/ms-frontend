"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { DoctorCard, DoctorInfo } from "@/components/common/DoctorCard";

const VINMEC_BASE_URL = "https://www.vinmec.com";

// Mock data - In production, this would come from an API
const MOCK_DOCTORS: DoctorInfo[] = [
    {
        id: "1",
        name: "Hoàng Đăng Mịch",
        degree: "Giáo sư, Tiến sĩ, Bác sĩ",
        specialty: "Nội tiết",
        hospital: "Khoa Khám bệnh & Nội khoa, Bệnh viện Đa khoa Vinmec Hải Phòng",
        hospitalUrl: `${VINMEC_BASE_URL}/vie/co-so-y-te/khoa-kham-benh-and-noi-khoa-benh-vien-da-khoa-vinmec-hai-phong`,
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_hoang_dang_mich_vinmec_03f2edc4fd.jpg`,
        rating: 4.8,
    },
    {
        id: "2",
        name: "Đỗ Tất Cường",
        degree: "Giáo sư, Tiến sĩ, Bác sĩ",
        specialty: "Tim mạch",
        hospital: "Trung tâm hồi sức và cấp cứu - Bệnh viện Đa khoa Vinmec Smart City",
        hospitalUrl: `${VINMEC_BASE_URL}/vie/co-so-y-te/khoa-hoi-suc-cap-cuu-benh-vien-da-khoa-vinmec-smart-city`,
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_28_02_2019_09_02_38_828416_jpeg_5ee29e2e57.jpg`,
    },
    {
        id: "3",
        name: "Nguyễn Thanh Liêm",
        degree: "Giáo sư, Tiến sĩ, Bác sĩ",
        specialty: "Nhi",
        hospital: "Trung tâm Y học tái tạo & Trị liệu tế bào",
        hospitalUrl: `${VINMEC_BASE_URL}/vie/co-so-y-te/khoa-y-hoc-tai-tao--tri-lieu-te-bao-benh-vien-da-khoa-quoc-te-vinmec-times-city`,
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_20_06_2023_05_41_48_828145_jpeg_8ee5a8d83b.jpg`,
    },
    {
        id: "4",
        name: "Trần Trung Dũng",
        degree: "Giáo sư, Tiến sĩ, Bác sĩ",
        specialty: "Ngoại chấn thương chỉnh hình",
        hospital: "Trung tâm Cơ xương khớp và Chấn thương chỉnh hình - Bệnh viện Đa khoa Quốc tế Vinmec Times City",
        hospitalUrl: `${VINMEC_BASE_URL}/vie/co-so-y-te/trung-tam-chan-thuong-chinh-hinh--y-hoc-the-thao-benh-vien-da-khoa-quoc-te-vinmec-times-city`,
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_20_06_2023_06_00_22_191160_jpeg_5c37ea6abc.jpg`,
        rating: 4.5,
    },
    {
        id: "5",
        name: "Philippe Macaire",
        degree: "Giáo sư, Tiến sĩ, Bác sĩ",
        specialty: "Gây mê - điều trị đau",
        hospital: "Khoa Gây mê giảm đau - Bệnh viện Đa khoa Quốc tế Vinmec Times City",
        hospitalUrl: `${VINMEC_BASE_URL}/vie/co-so-y-te/khoa-gay-me-giam-dau-benh-vien-da-khoa-quoc-te-vinmec-times-city`,
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_bac_si_philippe_macaire_319e03c215.jpg`,
    },
    {
        id: "6",
        name: "Phạm Nhật An",
        degree: "Giáo sư, Tiến sĩ, Bác sĩ",
        specialty: "Nhi",
        hospital: "Trung tâm Nhi - Bệnh viện Đa khoa Quốc tế Vinmec Times City",
        hospitalUrl: `${VINMEC_BASE_URL}/vie/co-so-y-te/trung-tam-nhi-benh-vien-da-khoa-quoc-te-vinmec-times-city`,
        imageUrl: `${VINMEC_BASE_URL}/static/uploads/small_20_06_2023_05_53_31_732124_jpeg_390b008206.jpg`,
        rating: 4.9,
    },
];

const HOSPITALS = [
    { id: "times-city", name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City" },
    { id: "central-park", name: "Bệnh viện Đa khoa Quốc tế Vinmec Central Park" },
    { id: "smart-city", name: "Bệnh viện Đa khoa Vinmec Smart City" },
    { id: "hai-phong", name: "Bệnh viện Đa khoa Vinmec Hải Phòng" },
    { id: "ha-long", name: "Bệnh viện Đa khoa Vinmec Hạ Long" },
    { id: "da-nang", name: "Bệnh viện Đa khoa Vinmec Đà Nẵng" },
    { id: "nha-trang", name: "Bệnh viện Đa khoa Vinmec Nha Trang" },
    { id: "phu-quoc", name: "Bệnh viện Đa khoa Vinmec Phú Quốc" },
];

const SPECIALTIES = [
    { id: "nhi", name: "Nhi", nameEn: "Pediatrics" },
    { id: "tim-mach", name: "Tim mạch", nameEn: "Cardiology" },
    { id: "noi-tiet", name: "Nội tiết", nameEn: "Endocrinology" },
    { id: "than-kinh", name: "Thần kinh", nameEn: "Neurology" },
    { id: "chinh-hinh", name: "Ngoại chấn thương chỉnh hình", nameEn: "Orthopedics" },
    { id: "gay-me", name: "Gây mê - điều trị đau", nameEn: "Anesthesiology" },
    { id: "san-phu-khoa", name: "Sản phụ khoa", nameEn: "Obstetrics & Gynecology" },
    { id: "tieu-hoa", name: "Tiêu hoá", nameEn: "Gastroenterology" },
];

const DEGREES = [
    { id: "gs", name: "Giáo sư", nameEn: "Professor" },
    { id: "pgs", name: "Phó giáo sư", nameEn: "Associate Professor" },
    { id: "ts", name: "Tiến sĩ", nameEn: "PhD" },
    { id: "ths", name: "Thạc sĩ", nameEn: "Master" },
    { id: "bsckii", name: "Bác sĩ CK II", nameEn: "Specialist Doctor II" },
    { id: "bscki", name: "Bác sĩ CK I", nameEn: "Specialist Doctor I" },
];

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

// Filter sidebar component
interface FilterSidebarProps {
    icon: string;
    label: string;
    items: { id: string; name: string; nameEn?: string }[];
    selectedItems: string[];
    onToggle: (id: string) => void;
    locale: string;
}

function FilterSidebar({ icon, label, items, selectedItems, onToggle, locale }: FilterSidebarProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
            <div
                className="flex items-center gap-2 cursor-pointer py-2 hover:text-[#0076c0] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon} alt="" className="w-5 h-5" />
                <span className="text-sm font-semibold text-gray-800">{label}</span>
                <svg
                    className={`w-4 h-4 ml-auto transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <ul className="mt-2 space-y-1">
                    {items.map((item) => (
                        <li key={item.id}>
                            <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-[#0076c0] transition-colors group">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => onToggle(item.id)}
                                    className="w-4 h-4 text-[#0076c0] border-gray-300 rounded focus:ring-[#0076c0] cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-[#0076c0]">
                                    {locale === "vi" ? item.name : (item.nameEn || item.name)}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Star rating filter for sidebar
function RatingFilterSidebar({
    selectedRatings,
    onToggle,
    locale
}: {
    selectedRatings: number[];
    onToggle: (rating: number) => void;
    locale: string;
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
            <div
                className="flex items-center gap-2 cursor-pointer py-2 hover:text-[#0076c0] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex gap-0.5">
                    <span className="text-yellow-400 text-lg">★</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                    {locale === "vi" ? "Đánh giá" : "Rating"}
                </span>
                <svg
                    className={`w-4 h-4 ml-auto transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <ul className="mt-2 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <li key={rating}>
                            <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-[#0076c0] transition-colors group">
                                <input
                                    type="checkbox"
                                    checked={selectedRatings.includes(rating)}
                                    onChange={() => onToggle(rating)}
                                    className="w-4 h-4 text-[#0076c0] border-gray-300 rounded focus:ring-[#0076c0] cursor-pointer"
                                />
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">({locale === "vi" ? "trở lên" : "& up"})</span>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Pagination component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    locale: string;
}

function Pagination({ currentPage, totalPages, onPageChange, locale }: PaginationProps) {
    const pages = useMemo(() => {
        const items: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) items.push(i);
        } else {
            items.push(1);
            if (currentPage > 3) items.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) items.push(i);

            if (currentPage < totalPages - 2) items.push("...");
            items.push(totalPages);
        }

        return items;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {locale === "vi" ? "Trước" : "Prev"}
            </button>

            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    disabled={page === "..."}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                            ? "bg-[#0076c0] text-white"
                            : page === "..."
                                ? "cursor-default text-gray-400"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {locale === "vi" ? "Sau" : "Next"}
            </button>
        </div>
    );
}

export function DoctorListSection() {
    const t = useTranslations("doctors");
    const { locale } = useParams<{ locale: string }>();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Mock pagination data - In production, these would come from API
    const totalItems = MOCK_DOCTORS.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const breadcrumbItems = [
        { label: t("breadcrumbHome"), href: `/${locale}` },
        { label: t("title") },
    ];

    const toggleFilter = (list: string[], setList: (v: string[]) => void, id: string) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const toggleRating = (rating: number) => {
        if (selectedRatings.includes(rating)) {
            setSelectedRatings(selectedRatings.filter(r => r !== rating));
        } else {
            setSelectedRatings([...selectedRatings, rating]);
        }
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSelectedHospitals([]);
        setSelectedSpecialties([]);
        setSelectedDegrees([]);
        setSelectedRatings([]);
        setSearchQuery("");
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedHospitals.length > 0 || selectedSpecialties.length > 0 ||
        selectedDegrees.length > 0 || selectedRatings.length > 0 || searchQuery !== "";

    // Filter doctors based on all criteria (client-side for mock data)
    const filteredDoctors = useMemo(() => {
        return MOCK_DOCTORS.filter((doctor) => {
            const matchesSearch = searchQuery === "" ||
                doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
            // Note: In production, these filters would work with actual filter IDs from API
            return matchesSearch;
        });
    }, [searchQuery]);

    // Paginated doctors (client-side for mock data)
    const paginatedDoctors = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredDoctors.slice(startIndex, startIndex + pageSize);
    }, [filteredDoctors, currentPage, pageSize]);

    const handleSearch = () => {
        setIsLoading(true);
        setCurrentPage(1);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 300);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of list
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Filter sidebar content
    const FilterContent = () => (
        <>
            <FilterSidebar
                icon={`${VINMEC_BASE_URL}/assets/images/doctor/icon-address.svg`}
                label={locale === "vi" ? "Cơ sở y tế" : "Hospital"}
                items={HOSPITALS}
                selectedItems={selectedHospitals}
                onToggle={(id) => toggleFilter(selectedHospitals, setSelectedHospitals, id)}
                locale={locale}
            />
            <FilterSidebar
                icon={`${VINMEC_BASE_URL}/assets/images/doctor/icon_chuyenmon.svg`}
                label={locale === "vi" ? "Chuyên khoa" : "Specialty"}
                items={SPECIALTIES}
                selectedItems={selectedSpecialties}
                onToggle={(id) => toggleFilter(selectedSpecialties, setSelectedSpecialties, id)}
                locale={locale}
            />
            <FilterSidebar
                icon={`${VINMEC_BASE_URL}/assets/images/doctor/icon_hocvi.svg`}
                label={locale === "vi" ? "Học vị" : "Degree"}
                items={DEGREES}
                selectedItems={selectedDegrees}
                onToggle={(id) => toggleFilter(selectedDegrees, setSelectedDegrees, id)}
                locale={locale}
            />
            <RatingFilterSidebar
                selectedRatings={selectedRatings}
                onToggle={toggleRating}
                locale={locale}
            />
        </>
    );

    return (
        <div className="max-w-350 mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Page Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#0076c0] mt-6 mb-6">
                {t("title")}
            </h1>

            {/* Main Layout - Sidebar + Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar - Filters (Desktop) */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                            <h3 className="text-base font-bold text-gray-800">
                                {locale === "vi" ? "Bộ lọc tìm kiếm" : "Search Filters"}
                            </h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-[#0076c0] hover:underline"
                                >
                                    {locale === "vi" ? "Xóa tất cả" : "Clear all"}
                                </button>
                            )}
                        </div>
                        <FilterContent />
                    </div>
                </aside>

                {/* Mobile Filter Button */}
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:border-[#0076c0] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {locale === "vi" ? "Bộ lọc" : "Filters"}
                    {hasActiveFilters && (
                        <span className="bg-[#0076c0] text-white text-xs px-2 py-0.5 rounded-full">
                            {selectedHospitals.length + selectedSpecialties.length + selectedDegrees.length + selectedRatings.length}
                        </span>
                    )}
                </button>

                {/* Mobile Filter Drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                        <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {locale === "vi" ? "Bộ lọc tìm kiếm" : "Search Filters"}
                                </h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <FilterContent />
                            </div>
                            <div className="p-4 border-t border-gray-200 flex gap-3">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    {locale === "vi" ? "Xóa bộ lọc" : "Clear"}
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 py-2.5 bg-[#0076c0] text-white rounded-lg font-medium hover:bg-[#005a94] transition-colors"
                                >
                                    {locale === "vi" ? "Áp dụng" : "Apply"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Content - Search + Doctor List */}
                <div className="flex-1 min-w-0">
                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder={locale === "vi" ? "Nhập tên bác sĩ, chuyên khoa..." : "Search by doctor name, specialty..."}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] text-gray-900"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-6 py-3 bg-[#0076c0] text-white font-medium rounded-lg hover:bg-[#005a94] transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {locale === "vi" ? "Tìm kiếm" : "Search"}
                            </button>
                        </div>
                    </div>

                    {/* Results Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <p className="text-sm text-gray-600">
                            {locale === "vi"
                                ? `Tìm thấy ${filteredDoctors.length} bác sĩ`
                                : `Found ${filteredDoctors.length} doctors`
                            }
                        </p>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">
                                {locale === "vi" ? "Hiển thị:" : "Show:"}
                            </label>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0]"
                            >
                                {PAGE_SIZE_OPTIONS.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Doctor List */}
                    {isLoading ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-[#0076c0] border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-gray-500">
                                {locale === "vi" ? "Đang tải..." : "Loading..."}
                            </p>
                        </div>
                    ) : paginatedDoctors.length > 0 ? (
                        <>
                            <ul className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                                {paginatedDoctors.map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} variant="list" />
                                ))}
                            </ul>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(filteredDoctors.length / pageSize)}
                                onPageChange={handlePageChange}
                                locale={locale}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {t("noResults")}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {t("tryAdjustFilter")}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 text-[#0076c0] border border-[#0076c0] rounded-lg hover:bg-[#0076c0] hover:text-white transition-colors"
                                >
                                    {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
