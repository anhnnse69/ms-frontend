"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { searchDoctors, getDoctorDetail } from "@/services/api/patient.api";
import { Doctor } from "@/types/patient";

const VINMEC_BASE_URL = "https://www.vinmec.com";

// Generate today + next 2 days
const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
            date: date,
            day: date.getDate().toString().padStart(2, "0"),
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            weekday: date.toLocaleDateString("vi-VN", { weekday: "short" }),
        });
    }
    return dates;
};

type BookingDraftStorage = {
    hospitalId: string;
    hospitalName: string;
    date: string; // YYYY-MM-DD (local)
    datetimeLocal: string; // YYYY-MM-DDTHH:mm (local, default time)
    specialtyId: string;
    specialtyName: string;
    doctorId?: string;
    doctorName?: string;
    isForeigner: boolean;
    fullName: string;
    birthDate: string;
    gender: string;
    phone: string;
    email?: string;
    reason: string;
};

function CalendarIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

export function BookingForm() {
    const t = useTranslations("booking");
    const tc = useTranslations("common");
    const { locale } = useParams<{ locale: string }>();
    const router = useRouter();

    // Form state
    const [hospital, setHospital] = useState("");
    const [selectedDate, setSelectedDate] = useState(0);
    const [useOtherDate, setUseOtherDate] = useState(false);
    const [otherDate, setOtherDate] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [doctor, setDoctor] = useState("");
    const [isForeigner, setIsForeigner] = useState(false);

    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [reason, setReason] = useState("");
    const [agreePolicy, setAgreePolicy] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [formError, setFormError] = useState<string | null>(null);

    const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

    const dateOptions = generateDateOptions();

    // Dynamic hospital & specialty options built from doctor data (same source as doctor list page)
    const hospitalOptions = useMemo(
        () => {
            const map = new Map<string, { id: string; name: string }>();
            allDoctors.forEach((d) => {
                // Prefer real facilityId from backend; fallback to facility name if needed
                if (d.facilityId && d.facility) {
                    if (!map.has(d.facilityId)) {
                        map.set(d.facilityId, { id: d.facilityId, name: d.facility });
                    }
                } else if (d.facility) {
                    const key = d.facility.trim();
                    if (key && !map.has(key)) {
                        map.set(key, { id: key, name: d.facility });
                    }
                }
            });
            return Array.from(map.values());
        },
        [allDoctors]
    );

    const specialtyOptions = useMemo(
        () => {
            const map = new Map<string, { id: string; name: string }>();
            allDoctors.forEach((d) => {
                // Prefer real specialtyId from backend; fallback to specialty name if needed
                if (d.specialtyId && d.specialty) {
                    if (!map.has(d.specialtyId)) {
                        map.set(d.specialtyId, { id: d.specialtyId, name: d.specialty });
                    }
                } else if (d.specialty) {
                    const key = d.specialty.trim();
                    if (key && !map.has(key)) {
                        map.set(key, { id: key, name: d.specialty });
                    }
                }
            });
            return Array.from(map.values());
        },
        [allDoctors]
    );

    // Specialties available within selected hospital (clinic)
    const filteredSpecialtyOptions = useMemo(
        () => {
            const map = new Map<string, { id: string; name: string }>();
            allDoctors.forEach((d) => {
                // If a hospital is selected, only consider doctors belonging to that facility
                if (hospital) {
                    const matchesFacilityId = d.facilityId && d.facilityId === hospital;
                    const selectedHospital = hospitalOptions.find((h) => h.id === hospital);
                    const matchesFacilityName = !d.facilityId && d.facility && selectedHospital && d.facility === selectedHospital.name;
                    if (!matchesFacilityId && !matchesFacilityName) {
                        return;
                    }
                }

                if (d.specialtyId && d.specialty) {
                    if (!map.has(d.specialtyId)) {
                        map.set(d.specialtyId, { id: d.specialtyId, name: d.specialty });
                    }
                } else if (d.specialty) {
                    const key = d.specialty.trim();
                    if (key && !map.has(key)) {
                        map.set(key, { id: key, name: d.specialty });
                    }
                }
            });
            // If no hospital is selected, fall back to all specialties
            const result = Array.from(map.values());
            return hospital ? result : specialtyOptions;
        },
        [allDoctors, hospital, hospitalOptions, specialtyOptions]
    );

    // Doctors filtered by selected hospital and specialty
    const filteredDoctors = useMemo(
        () => {
            return allDoctors.filter((d) => {
                // filter by hospital / facility first
                if (hospital) {
                    const matchesFacilityId = d.facilityId && d.facilityId === hospital;
                    const selectedHospital = hospitalOptions.find((h) => h.id === hospital);
                    const matchesFacilityName = !d.facilityId && d.facility && selectedHospital && d.facility === selectedHospital.name;
                    if (!matchesFacilityId && !matchesFacilityName) {
                        return false;
                    }
                }

                // then filter by specialty (if selected)
                if (specialty) {
                    if (d.specialtyId) {
                        return d.specialtyId === specialty;
                    }
                    const selectedSpec = specialtyOptions.find((s) => s.id === specialty) ?? filteredSpecialtyOptions.find((s) => s.id === specialty);
                    if (!selectedSpec) return true;
                    return d.specialty?.toLowerCase().includes(selectedSpec.name.toLowerCase());
                }

                return true;
            });
        },
        [allDoctors, hospital, specialty, hospitalOptions, specialtyOptions, filteredSpecialtyOptions]
    );

    const todayStr = (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    })();

    const breadcrumbItems = [
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("title") },
    ];

    // Load available doctors once so the doctor dropdown can be populated
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setIsLoadingDoctors(true);
                const res = await searchDoctors({ page: 1, size: 100 });
                setAllDoctors(res.doctors || []);
            } catch (error) {
                console.warn("Failed to load doctors for booking form", error);
                setAllDoctors([]);
            } finally {
                setIsLoadingDoctors(false);
            }
        };

        loadDoctors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!agreePolicy) {
            setFormError(t("pleaseAgreePolicy"));
            return;
        }

        // Resolve selected appointment date
        const dates = dateOptions;
        let selectedDateObj: Date | null = null;

        if (useOtherDate) {
            if (!otherDate) {
                setFormError("Please select an appointment date.");
                return;
            }
            selectedDateObj = new Date(otherDate);
        } else {
            selectedDateObj = dates[selectedDate]?.date ?? null;
        }

        if (!selectedDateObj || Number.isNaN(selectedDateObj.getTime())) {
            setFormError("Please select an appointment date.");
            return;
        }

        const year = selectedDateObj.getFullYear();
        const month = (selectedDateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = selectedDateObj.getDate().toString().padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        // Default time in local time (09:00) - user can adjust on the next step
        const defaultTime = "09:00";
        const datetimeLocal = `${dateStr}T${defaultTime}`;

        // If user is not logged in, redirect to login page
        if (typeof window !== "undefined") {
            const hospitalInfo = hospitalOptions.find((h) => h.id === hospital);
            const specialtyInfo = specialtyOptions.find((s) => s.id === specialty);
            const doctorInfo = allDoctors.find((d) => d.id === doctor);

            const draft: BookingDraftStorage = {
                hospitalId: hospital,
                hospitalName: hospitalInfo?.name || "",
                date: dateStr,
                datetimeLocal,
                specialtyId: specialty,
                specialtyName: specialtyInfo?.name || "",
                doctorId: doctor || undefined,
                doctorName: doctorInfo?.name,
                isForeigner,
                fullName,
                birthDate,
                gender,
                phone,
                email: email || undefined,
                reason,
            };

            try {
                window.localStorage.setItem("bookingDraft", JSON.stringify(draft));
            } catch (error) {
                console.warn("Failed to persist booking draft", error);
            }

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                router.push(`/${locale}/login`);
                return;
            }
        }
        // For now, delegate real booking flow to the authenticated
        // patient booking page which is already integrated with the
        // /patient/appointments API.
        setIsLoading(true);
        router.push(`/${locale}/patient/book-appointment?fromMarketingBooking=1`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-4">
                {formError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {formError}
                    </div>
                )}
                {/* Appointment Details Section */}
                <h2 className="text-xl font-bold text-[#0076C0] mb-6 pb-2 border-b-2 border-[#0076C0]">
                    {t("appointmentDetails")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Hospital Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("hospital")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={hospital}
                            onChange={(e) => {
								const value = e.target.value;
								setHospital(value);
								// reset dependent fields when hospital changes
								setSpecialty("");
								setDoctor("");
							}}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] text-gray-900 bg-white"
                        >
                            <option value="">{t("selectHospital")}</option>
                            {hospitalOptions.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("appointmentDate")} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {dateOptions.slice(0, 3).map((d, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setUseOtherDate(false);
                                        setSelectedDate(idx);
                                    }}
                                        className={`shrink-0 px-4 py-2 rounded-lg border text-center transition-colors ${
                                        selectedDate === idx
                                            ? "bg-[#0076C0] text-white border-[#0076C0]"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-[#0076C0]"
                                    }`}
                                >
                                    <div className="text-lg font-bold">{d.day}/{d.month}</div>
                                    <div className="text-xs">{d.weekday}</div>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setUseOtherDate(true);
                                    setSelectedDate(-1);
                                }}
                                className={`shrink-0 px-4 py-2 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                                    useOtherDate
                                        ? "bg-[#0076C0] text-white border-[#0076C0]"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-[#0076C0]"
                                }`}
                            >
                                <CalendarIcon />
                                <span className="text-xs mt-1">{t("otherDate")}</span>
                            </button>
                        </div>
                        {useOtherDate && (
                            <div className="mt-3">
                                <input
                                    type="date"
                                    value={otherDate}
                                    onChange={(e) => setOtherDate(e.target.value)}
                                    min={todayStr}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900"
                                />
                                <p className="mt-1 text-xs text-gray-500">{t("appointmentDate")}</p>
                            </div>
                        )}
                    </div>

                    {/* Specialty Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#0076C0] mb-2">
                            {t("specialty")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={specialty}
                            onChange={(e) => {
								const value = e.target.value;
								setSpecialty(value);
								// when specialty changes, clear doctor selection
								setDoctor("");
							}}
                            required
                            disabled={!hospital || filteredSpecialtyOptions.length === 0}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900 bg-white"
                        >
                            <option value="">{t("selectSpecialty")}</option>
                            {filteredSpecialtyOptions.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Doctor Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#0076C0] mb-2">
                            {t("doctor")}
                        </label>
                        <select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            disabled={isLoadingDoctors || allDoctors.length === 0 || !specialty}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        >
                            <option value="">
                                {isLoadingDoctors
                                    ? t("selectDoctor")
                                    : allDoctors.length === 0
                                    ? t("selectDoctor")
                                    : t("selectDoctor")}
                            </option>
                            {filteredDoctors.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name} {d.specialty ? `- ${d.specialty}` : ""}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Foreigner checkbox */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isForeigner}
                            onChange={(e) => setIsForeigner(e.target.checked)}
                            className="w-4 h-4 text-[#0076c0] border-gray-300 rounded focus:ring-[#0076c0]"
                        />
                        <span className="text-sm text-gray-700">{t("foreignPatient")}</span>
                    </label>
                </div>

                {/* Note */}
                <p className="text-sm text-gray-500 mb-8 italic">
                    *{t("note")}
                </p>

                {/* Customer Information Section */}
                <h2 className="text-xl font-bold text-[#0076C0] mb-6 pb-2 border-b-2 border-[#0076C0]">
                    {t("customerInfo")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#0076C0] mb-2">
                            {tc("fullName")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder={t("fullNamePlaceholder")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:border-[#0076c0] text-gray-900"
                        />
                    </div>

                    {/* Birth Date */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-4 pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-4 h-4 text-[#0076C0] border-gray-300 focus:ring-[#0076C0]"
                                />
                                <span className="text-sm text-gray-700">{t("male")}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-4 h-4 text-[#0076C0] border-gray-300 focus:ring-[#0076C0]"
                                />
                                <span className="text-sm text-gray-700">{t("female")}</span>
                            </label>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-[#0076C0] mb-2">
                                {t("birthDate")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                                max={todayStr}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-[#0076C0] mb-2">
                            {t("phone")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder={t("phonePlaceholder")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[#0076C0] mb-2">
                            {tc("email")}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900"
                        />
                    </div>
                </div>

                {/* SMS Note */}
                <p className="text-sm text-gray-500 mb-6">
                    *{t("smsNote")}
                </p>

                {/* Reason */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#0076C0] mb-2">
                        {t("reason")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={4}
                        placeholder={t("reasonPlaceholder")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076C0] focus:border-[#0076C0] text-gray-900 resize-none"
                    />
                </div>

                {/* Privacy Policy */}
                <div className="mb-8">
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreePolicy}
                            onChange={(e) => setAgreePolicy(e.target.checked)}
                            className="w-4 h-4 mt-1 text-[#0076C0] border-gray-300 rounded focus:ring-[#0076C0]"
                        />
                        <span className="text-sm text-gray-700">
                            {t("agreePolicyText")}{" "}
                            <a
                                href={`${VINMEC_BASE_URL}/vie/chinh-sach-bao-ve-du-lieu-ca-nhan-cua-vinmec/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0076C0] hover:underline"
                            >
                                {t("privacyPolicy")}
                            </a>
                            {" "}{t("agreePolicyText2")} <span className="text-red-500">*</span>
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-12 py-4 bg-[#0076C0] hover:bg-[#0076C0] text-white font-medium text-lg rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t("submitting") : t("submit")}
                    </button>
                </div>
            </form>
        </div>
    );
}
