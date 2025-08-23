
export interface TeacherResDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    subjects: {
        id: number;
        name: string;
        code: string;
    }[];
    isActive: boolean;
    createdAt: string;
}

export interface DepartmentResDto {
    id: number;
    name: string;
    subjects: {
        id: number;
        name: string;
        code: string;
        credits: number;
        description: string;
        active: boolean;
        level: string;
        cycle: string;
        semesterId: number;
        semesterName: string;
        departmentId: number;
        departmentName: string;
    }[];
}

export interface AdminStatsResDto {
    totalStudents: number;
    totalTeachers: number;
    totalSubjects: number;
    totalDepartments: number;
    activeStudents: number;
    activeTeachers: number;
    studentsPerLevel: {
        level: string;
        count: number;
    }[];
    subjectsPerDepartment: {
        department: string;
        count: number;
    }[];
}

export interface ImportResultResDto {
    success: number;
    errors: string[];
    warnings?: string[];
}

export interface ExportResultResDto {
    downloadUrl: string;
    filename: string;
    size: number;
}

export interface ReportGenerationResDto {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    downloadUrl?: string;
    filename?: string;
    progress?: number;
    error?: string;
}