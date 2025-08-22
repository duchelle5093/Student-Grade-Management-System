import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { getEditableColumnsByPeriod, formatPeriodLabel } from '../utils';

interface UseCurrentPeriodReturn {
    currentPeriodLabel: string;
    formattedPeriod: string;
    editableColumns: string[];
    activeSemester: any;
}

/**
 * Hook personnalisé pour gérer la période actuelle
 * @param subjectId - ID de la matière (optionnel, pour des périodes spécifiques par matière)
 * @returns Informations sur la période actuelle
 */
export const useCurrentPeriod = (subjectId?: string): UseCurrentPeriodReturn => {
    const { activeSemester } = useAppSelector(state => state.semesters);

    // Pour le moment, utilisation d'une période statique
    // À terme, cette période pourra venir de :
    // 1. L'état global du semestre actif
    // 2. Une configuration par matière
    // 3. Une API dédiée à la gestion des périodes
    const currentPeriodLabel = useMemo(() => {
        // Logique future pour déterminer la période basée sur :
        // - Les dates du semestre actif
        // - La configuration de la matière
        // - Les paramètres administratifs

        if (activeSemester) {
            // Exemple de logique basée sur les dates
            const now = new Date();
            const semesterStart = new Date(activeSemester.startDate);
            const semesterEnd = new Date(activeSemester.endDate);
            const semesterDuration = semesterEnd.getTime() - semesterStart.getTime();
            const elapsed = now.getTime() - semesterStart.getTime();
            const progress = elapsed / semesterDuration;

            // Diviser le semestre en périodes
            if (progress < 0.25) {
                return "CC1";
            } else if (progress < 0.5) {
                return "SN1";
            } else if (progress < 0.75) {
                return "CC2";
            } else {
                return "SN2";
            }
        }

        // Fallback par défaut
        return "CC1";
    }, [activeSemester, subjectId]);

    const formattedPeriod = useMemo(() =>
            formatPeriodLabel(currentPeriodLabel),
        [currentPeriodLabel]
    );

    const editableColumns = useMemo(() =>
            getEditableColumnsByPeriod(currentPeriodLabel),
        [currentPeriodLabel]
    );

    return {
        currentPeriodLabel,
        formattedPeriod,
        editableColumns,
        activeSemester,
    };
};
