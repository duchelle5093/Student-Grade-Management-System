import {PeriodLabel} from "../enums";

export interface StudentGradeResDto {
    id: number;
    createdDate: string;
    lastModifiedDate: string | null;
    studentId: number;
    studentName: string;
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    semesterId: number;
    semesterName: string;
    value: number;
    type: "ASSIGNMENT" | "EXAM" | "QUIZ" | "PROJECT" | "CC" | "SN";
    periodLabel: PeriodLabel
    comments: string;
    enteredBy: number;
    enteredByName: string;
    passed: boolean;
    creditsEarned: number;
}

export interface StudentTopicResDto {
    code: string;
    title: string;
    cc: number | null;
    sn: number | null;
    semester: "S1" | "S2";
    credit: number;
}

export interface StudentDataResDto {
    studentId: number;
    studentName: string;
    semesterId: number;
    semesterName: string;
    grades: StudentGradeResDto[];
    gpa: number;
    status: string | null;
    firstName: string;
    lastName: string;
    email: string;
    username: string | null;
    role: string;
    level: string;
    topics: StudentTopicResDto[];
}






// export interface StudentGradeResDto {
//     id: number;
//     createdDate: string;
//     lastModifiedDate: string | null;
//     studentId: number;
//     studentName: string;
//     subjectId: number;
//     subjectName: string;
//     subjectCode: string;
//     semesterId: number;
//     semesterName: string;
//     value: number;
//     type: "ASSIGNMENT" | "EXAM" | "QUIZ" | "PROJECT" | "CC" | "SN";
//     periodLabel: string | null;
//     comments: string;
//     enteredBy: number;
//     enteredByName: string;
//     passed: boolean;
//     creditsEarned: number;
// }
//
// export interface StudentTopicResDto {
//     code: string;
//     title: string;
//     cc: number | null;
//     sn: number | null;
//     semester: "s1" | "s2";
//     credit: number;
// }
//
// // DTO principal pour les étudiants avec leurs notes
// export interface StudentDataResDto {
//     id: number; // studentId renommé en id pour cohérence
//     studentName: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string | null;
//     role: string;
//     level: string; // LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5
//
//     // Notes par type (utilisées dans les tableaux éditables)
//     cc1?: number | string | null; // CC du semestre 1
//     sn1?: number | string | null; // SN du semestre 1
//     cc2?: number | string | null; // CC du semestre 2
//     sn2?: number | string | null; // SN du semestre 2
//     tp?: number | string | null;  // TP si applicable
//     tp2?: number | string | null; // TP semestre 2 si applicable
//
//     // Informations complémentaires
//     semesterId?: number;
//     semesterName?: string;
//     grades?: StudentGradeResDto[];
//     gpa?: number;
//     status?: string | null;
//     topics?: StudentTopicResDto[]; // Matières suivies par l'étudiant
// }

// DTO simplifié pour les listes d'étudiants du backend
export interface StudentListResDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    level?: string;
}

// Interface pour la création/mise à jour d'étudiant
export interface StudentReqDto {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    level: string;
}


