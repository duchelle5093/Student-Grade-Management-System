import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { getEditableColumnsByPeriod, formatPeriodLabel, getCurrentPeriod } from '../utils';

interface AcademicPeriod {
    id: string;
    name: string;
    shortName: string;
    type: 'CC' | 'SN';
    semester: 1 | 2;
    startDate: string;
    endDate: string;
    color: string;
    isActive: boolean;
    order: number;
}

interface UseCurrentPeriodReturn {
    currentPeriodLabel: string;   // ex: "CC #1"
    formattedPeriod: string;      // ex: "Contrôle Continu 1"
    editableColumns: string[];    // ex: ["cc1"]
    activeSemester: any;
    currentPeriod: AcademicPeriod | null;
}

/**
 * Hook personnalisé pour gérer la période actuelle
 */
export const useCurrentPeriod = (periods?: AcademicPeriod[], subjectId?: string): UseCurrentPeriodReturn => {
    const { activeSemester } = useAppSelector(state => state.semesters);

    const currentPeriod = useMemo(() => {
        if (periods) {
            return getCurrentPeriod(periods);
        }
        return null;
    }, [periods]);

    const currentPeriodLabel = useMemo(() => {
        if (currentPeriod) {
            return currentPeriod.shortName;
        }
        
        // Fallback à l'ancienne logique si pas de periods fourni
        if (activeSemester) {
            const now = new Date();
            const semesterStart = new Date(activeSemester.startDate);
            const semesterEnd = new Date(activeSemester.endDate);
            const semesterDuration = semesterEnd.getTime() - semesterStart.getTime();
            const elapsed = now.getTime() - semesterStart.getTime();
            const progress = elapsed / semesterDuration;

            if (progress < 0.25) {
                return "CC #1";
            } else if (progress < 0.5) {
                return "SN #1";
            } else if (progress < 0.75) {
                return "CC #2";
            } else {
                return "SN #2";
            }
        }

        return "CC #1";
    }, [currentPeriod, activeSemester, subjectId]);

    const formattedPeriod = useMemo(
        () => formatPeriodLabel(currentPeriodLabel),
        [currentPeriodLabel]
    );

    const editableColumns = useMemo(
        () => getEditableColumnsByPeriod(currentPeriodLabel),
        [currentPeriodLabel]
    );

    return {
        currentPeriodLabel,
        formattedPeriod,
        editableColumns,
        activeSemester,
        currentPeriod,
    };
};
