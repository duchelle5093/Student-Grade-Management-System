// src/pages/licence1/mockData.ts
import { PeriodLabel } from "../../api/enums";
import { StudentRow } from "../../components/EditableGradesTable";
import { TeacherGradeResDto } from "../../api/reponse-dto/grade.res.dto";

export const mockStudents: StudentRow[] = [
    {
        id: 1,
        studentId: 1,
        studentName: "Dupont Jean",
        cc1: 15,
        sn1: null,
        cc2: null,
        sn2: 18,
    },
    {
        id: 2,
        studentId: 2,
        studentName: "Martin Sophie",
        cc1: 12,
        sn1: null,
        cc2: 16,
        sn2: null,
    },
    {
        id: 3,
        studentId: 3,
        studentName: "Bernard Pierre",
        cc1: null,
        sn1: 14,
        cc2: null,
        sn2: null,
    },
    {
        id: 4,
        studentId: 4,
        studentName: "Petit Marie",
        cc1: null,
        sn1: null,
        cc2: 10,
        sn2: 11,
    },
];

// Si tu veux tester comme si ça venait du backend (TeacherGradeResDto)
export const mockGrades: TeacherGradeResDto[] = [
    {
        id: 101,
        createdDate: "2025-08-20T12:35:47.775Z",
        lastModifiedDate: null,
        enteredBy: 1,
        enteredByName: "Default Teacher",
        passed: true,
        creditsEarned: 6,
        studentId: 1,
        studentName: "Dupont Jean",
        subjectId: 1,
        subjectName: "Mathématiques",
        subjectCode: "MATH101",
        value: 15,
        type: "CC_1",
        periodLabel: PeriodLabel.CC1,
        comments: "",
        semesterId: 1,
        semesterName: "Semestre 1",
    },
    {
        id: 102,
        createdDate: "2025-08-20T12:35:47.775Z",
        lastModifiedDate: null,
        enteredBy: 1,
        enteredByName: "Default Teacher",
        passed: true,
        creditsEarned: 6,
        studentId: 1,
        studentName: "Dupont Jean",
        subjectId: 1,
        subjectName: "Mathématiques",
        subjectCode: "MATH101",
        value: 18,
        type: "SN_2",
        periodLabel: PeriodLabel.SN2,
        comments: "",
        semesterId: 2,
        semesterName: "Semestre 2",
    },
];
