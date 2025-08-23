// DTOs pour les requêtes d'administration

export interface CreateTeacherReqDto {
    firstName: string;
    lastName: string;
    password: string;
    department: string;
    subjectIds: number[];
    email: string;
}

export interface UpdateTeacherReqDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    department?: string;
    subjectIds?: number[];
    email?: string;
}

export interface CreateDepartmentReqDto {
    name: string;
}

export interface UpdateDepartmentReqDto {
    name: string;
}

export interface BulkSemesterUpdateReqDto {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    orderIndex: number;
}

export interface CreateSemesterReqDto {
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    endDateAfterStartDate: boolean;
}

export interface ImportStudentsReqDto {
    file: File;
}

export interface GenerateReportReqDto {
    studentIds?: number[];
    level?: string;
    semester?: string;
    format: 'pdf' | 'excel';
    type: 'individual' | 'bulk';
}

export interface ExportGradesReqDto {
    level?: string;
    semester?: string;
    subjectId?: number;
    format: 'excel' | 'csv';
}