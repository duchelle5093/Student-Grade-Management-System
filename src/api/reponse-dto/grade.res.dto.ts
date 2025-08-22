export interface GradeResDto {
    id: number;
    studentId: number;
    subjectId: number;
    semesterId: number;
    value: number;
    type: 'ASSIGNMENT' | 'EXAM' | 'QUIZ' | 'PROJECT';
    enteredByTeacherId: number;
    periodLabel: string;
    comments?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateGradeReqDto {
    studentId: number;
    subjectId: number;
    semesterId: number;
    value: number;
    type: 'ASSIGNMENT' | 'EXAM' | 'QUIZ' | 'PROJECT';
    enteredBy: number;
    periodLabel: string;
    comments?: string;
}

export interface CreateGradeByCodeReqDto {
    studentMatricule: string;
    subjectCode: string;
    semesterId: number;
    value: number;
    type: 'ASSIGNMENT' | 'EXAM' | 'QUIZ' | 'PROJECT';
    comments?: string;
    periodLabel: string;
}

export interface UpdateGradeReqDto {
    value: number;
    type: 'ASSIGNMENT' | 'EXAM' | 'QUIZ' | 'PROJECT';
    comments?: string;
}

export interface TeacherGradeResDto {
    id: number;
    createdDate: string;
    lastModifiedDate: string | null;
    enteredBy: number;
    enteredByName: string;
    passed: boolean;
    creditsEarned: number;
    studentId: number;
    studentName: string;
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    value: number;
    type: string;
    periodLabel: 'CC' | 'SN';
    comments?: string;
    semesterId: number;
    semesterName: string;
}
