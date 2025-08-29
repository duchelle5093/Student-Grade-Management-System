export interface SubjectResDto {
    id: number;
    name: string;
    code: string;
    credits: number;
    description: string;
    active: boolean;
    level: string; // "LEVEL1", "LEVEL2", "LEVEL3", "LEVEL4", "LEVEL5"
    cycle: string; // "BACHELOR", "MASTER", etc.
    semesterId: number; // Changé en number pour cohérence
    semesterName: string;
    departmentId: number; // Changé en number pour cohérence
    departmentName: string;
    teacherId?: number; // ID de l'enseignant assigné
    teacherName?: string; // Nom de l'enseignant
}

export interface AssignedSubjectResDto {
    id: number;
    name: string;
    code: string;
    credits: number;
    description: string;
    active: boolean;
    level: string; // "LEVEL1", "LEVEL2", "LEVEL3", "LEVEL4", "LEVEL5"
    cycle: string;
    semesterId: number;
    semesterName: string;
    departmentId: number;
    departmentName: string;
}

export interface CreateSubjectReqDto {
    name: string;
    code: string;
    description?: string;
    credits: number;
    teacherId?: number;
    departmentId: number; // ID du département (requis)
    level: string; // LEVEL1, LEVEL2, etc.
    cycle: string; // BACHELOR, MASTER
    semesterId: number; // ID du semestre (requis)
    active?: boolean;
}

export interface UpdateSubjectReqDto {
    name: string;
    code: string;
    description: string;
    credits: number;
    teacherId: number; // Changé en number
    level: string;
    cycle: string;
    semesterId: number; // Changé en number
    active: boolean;
}

// Enum pour les niveaux
export enum SubjectLevel {
    LEVEL1 = "LEVEL1", // Licence 1
    LEVEL2 = "LEVEL2", // Licence 2
    LEVEL3 = "LEVEL3", // Licence 3
    LEVEL4 = "LEVEL4", // Master 1
    LEVEL5 = "LEVEL5"  // Master 2
}

// Enum pour les cycles
export enum SubjectCycle {
    BACHELOR = "BACHELOR",
    MASTER = "MASTER"
}
