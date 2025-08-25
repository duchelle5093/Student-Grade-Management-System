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
    const { profile } = useAppSelector(state => state.user);

    // Extraire et mapper les niveaux depuis le profil utilisateur
    const uniqueLevels = useMemo(() => {
        if (!profile?.levels?.length) return [];
        
        // Mapper L1->LEVEL1, L2->LEVEL2, etc.
        const levelMapping: Record<string, AcademicLevel> = {
            'L1': AcademicLevel.LEVEL1,
            'L2': AcademicLevel.LEVEL2, 
            'L3': AcademicLevel.LEVEL3,
            'L4': AcademicLevel.LEVEL4,
            'L5': AcademicLevel.LEVEL5,
        };
        
        return profile.levels
            .map(levelInfo => levelMapping[levelInfo.level])
            .filter(Boolean); // Supprimer les niveaux non reconnus
    }, [profile?.levels]);

    // Générer les données pour les niveaux de Licence
    const licenceLevels = useMemo(() => {
        return uniqueLevels
            .filter(level => LICENCE_LEVELS.includes(level))
            .map(level => ({
                level,
                displayName: LEVEL_DISPLAY_NAMES[level],
                route: LEVEL_ROUTES[level]
            }))
            .sort((a, b) => a.level.localeCompare(b.level));
    }, [uniqueLevels]);

    // Générer les données pour les niveaux de Master
    const masterLevels = useMemo(() => {
        return uniqueLevels
            .filter(level => MASTER_LEVELS.includes(level))
            .map(level => ({
                level,
                displayName: LEVEL_DISPLAY_NAMES[level],
                route: LEVEL_ROUTES[level]
            }))
            .sort((a, b) => a.level.localeCompare(b.level));
    }, [uniqueLevels]);

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
