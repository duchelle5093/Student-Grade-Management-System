export interface GradeClaimResDto {
    id: number;
    gradeId: number;
    studentId: number;
    subjectCode: string;
    period: 'CC_1' | 'CC_2' | 'SN_1' | 'SN_2';
    currentScore: number;
    requestedScore: number;
    cause: string;
    description: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    teacherComment?: string;
    resolvedAt?: string;
}