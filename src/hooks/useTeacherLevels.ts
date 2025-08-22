import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { AcademicLevel, LEVEL_DISPLAY_NAMES, LEVEL_ROUTES, LICENCE_LEVELS, MASTER_LEVELS } from '../api/enums';

// interface TeacherLevel {
//     level: AcademicLevel;
//     displayName: string;
//     route: string;
//     subjects: any[]; // Matières enseignées à ce niveau
// }

export const useTeacherLevels = () => {
    const { assignedSubjects } = useAppSelector(state => state.subjects);

    // Extraire les niveaux uniques des matières assignées
    const uniqueLevels = useMemo(() => {
        if (!assignedSubjects?.length) return [];

        const levels = new Set(assignedSubjects.map(subject => subject.level));
        return Array.from(levels) as AcademicLevel[];
    }, [assignedSubjects]);

    // Générer les données pour les niveaux de Licence
    const licenceLevels = useMemo(() => {
        return uniqueLevels
            .filter(level => LICENCE_LEVELS.includes(level))
            .map(level => ({
                level,
                displayName: LEVEL_DISPLAY_NAMES[level],
                route: LEVEL_ROUTES[level],
                subjects: assignedSubjects?.filter(subject => subject.level === level) || []
            }))
            .sort((a, b) => a.level.localeCompare(b.level));
    }, [uniqueLevels, assignedSubjects]);

    // Générer les données pour les niveaux de Master
    const masterLevels = useMemo(() => {
        return uniqueLevels
            .filter(level => MASTER_LEVELS.includes(level))
            .map(level => ({
                level,
                displayName: LEVEL_DISPLAY_NAMES[level],
                route: LEVEL_ROUTES[level],
                subjects: assignedSubjects?.filter(subject => subject.level === level) || []
            }))
            .sort((a, b) => a.level.localeCompare(b.level));
    }, [uniqueLevels, assignedSubjects]);

    // Tous les niveaux enseignés
    const allTeacherLevels = useMemo(() => {
        return [...licenceLevels, ...masterLevels];
    }, [licenceLevels, masterLevels]);

    return {
        // Niveaux disponibles
        uniqueLevels,
        allTeacherLevels,
        licenceLevels,
        masterLevels,

        // Flags de disponibilité
        hasLicenceLevels: licenceLevels.length > 0,
        hasMasterLevels: masterLevels.length > 0,
        hasAnyLevels: allTeacherLevels.length > 0,

        // Comptes
        licenceLevelsCount: licenceLevels.length,
        masterLevelsCount: masterLevels.length,
        totalLevelsCount: allTeacherLevels.length,

        // Méthodes utilitaires
        getLevelSubjects: (level: AcademicLevel) => {
            return assignedSubjects?.filter(subject => subject.level === level) || [];
        },

        isLevelTaught: (level: AcademicLevel) => {
            return uniqueLevels.includes(level);
        },

        getLevelDisplayName: (level: AcademicLevel) => {
            return LEVEL_DISPLAY_NAMES[level];
        },

        getLevelRoute: (level: AcademicLevel) => {
            return LEVEL_ROUTES[level];
        }
    };
};
