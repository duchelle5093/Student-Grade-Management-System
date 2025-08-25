export enum Role {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
}

export enum ColorTheme {
    PRIMARY = '#6EADFF',
}

// Niveaux académiques
export enum AcademicLevel {
    LEVEL1 = 'LEVEL1', // Licence 1
    LEVEL2 = 'LEVEL2', // Licence 2
    LEVEL3 = 'LEVEL3', // Licence 3
    LEVEL4 = 'LEVEL4', // Master 1
    LEVEL5 = 'LEVEL5', // Master 2
}

// Types de notes
export enum GradeType {
    CC = 'CC', // Contrôle Continu
    SN = 'SN', // Session Normale
}

// Cycles d'études
export enum StudyCycle {
    BACHELOR = 'BACHELOR',
    MASTER = 'MASTER',
}

// Semestres
export enum Semester {
    S1 = 'S1',
    S2 = 'S2',
}

// Labels de période pour les notes
export enum PeriodLabel {
    CC1 = 'CC_1', // Contrôle Continu 1 (Semestre 1)
    SN1 = 'SN_1', // Session Normale 1 (Semestre 1)
    CC2 = 'CC_2', // Contrôle Continu 2 (Semestre 2)
    SN2 = 'SN_2', // Session Normale 2 (Semestre 2)
}

// Mapping des niveaux vers les noms d'affichage
export const LEVEL_DISPLAY_NAMES = {
    [AcademicLevel.LEVEL1]: 'Licence 1',
    [AcademicLevel.LEVEL2]: 'Licence 2',
    [AcademicLevel.LEVEL3]: 'Licence 3',
    [AcademicLevel.LEVEL4]: 'Master 1',
    [AcademicLevel.LEVEL5]: 'Master 2',
} as const;

// Mapping des niveaux vers les routes
export const LEVEL_ROUTES = {
    [AcademicLevel.LEVEL1]: 'licence1',
    [AcademicLevel.LEVEL2]: 'licence2',
    [AcademicLevel.LEVEL3]: 'licence3',
    [AcademicLevel.LEVEL4]: 'master1',
    [AcademicLevel.LEVEL5]: 'master2',
} as const;

// Groupes de niveaux
export const LICENCE_LEVELS = [AcademicLevel.LEVEL1, AcademicLevel.LEVEL2, AcademicLevel.LEVEL3];
export const MASTER_LEVELS = [AcademicLevel.LEVEL4, AcademicLevel.LEVEL5];
