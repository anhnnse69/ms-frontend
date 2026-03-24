"use client";

import { useEffect, useState } from "react";
import { getDoctorDetail } from "@/services/api/patient.api";
import { DoctorDetail } from "@/types/patient";

interface UseDoctorDetailResult {
    doctor: DoctorDetail | null;
    isLoading: boolean;
    error: string | null;
}

export function useDoctorDetail(doctorId: string): UseDoctorDetailResult {
    const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId) {
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        getDoctorDetail(doctorId)
            .then((data) => {
                if (!isMounted) return;
                setDoctor(data);
            })
            .catch((err: any) => {
                if (!isMounted) return;
                setError(err?.message || "Failed to load doctor detail");
                setDoctor(null);
            })
            .finally(() => {
                if (!isMounted) return;
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [doctorId]);

    return { doctor, isLoading, error };
}
