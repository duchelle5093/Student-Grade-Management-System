import {PeriodLabel} from "../enums";

export interface GradeResDto {
    id: number;
    studentId: number;
    subjectId: number;
    semesterId: number;
    value: number;
    type: 'CC_1' | 'SN_1' |'CC_2' | 'SN_2';
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
    maxValue?: number;
    type: 'CC_1' | 'SN_1' |'CC_2' | 'SN_2';
    enteredBy: number;
    periodType: 'CC_1' | 'CC_2' | 'SN_1' | 'SN_2';
    comments?: string;
}

export interface CreateGradeByCodeReqDto {
    studentMatricule: string;
    subjectCode: string;
    semesterId: number;
    value: number;
    maxValue?: number;
    type: 'CC_1' | 'SN_1' |'CC_2' | 'SN_2';
    comments?: string;
    periodType: 'CC_1' | 'CC_2' | 'SN_1' | 'SN_2';
}

export interface UpdateGradeReqDto {
    value: number;
    maxValue?: number;
    type: 'CC_1' | 'SN_1' |'CC_2' | 'SN_2';
    comments?: string;
}

export interface TeacherGradeResDto {
    id: number;
    createdDate: string;
    lastModifiedDate: string;
    studentId: number;
    studentName: string;
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    semesterId: number;
    semesterName: string;
    value: number;
    type: 'CC_1' | 'SN_1' | 'CC_2' | 'SN_2';
    periodLabel: string; // "CC_1", "CC_2", "SN_1", "SN_2"
    comments: string;
    enteredBy: number;
    enteredByName: string;
    passed: boolean;
    creditsEarned: number;
}
