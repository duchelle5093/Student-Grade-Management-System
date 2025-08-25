export interface GradeClaimReqDto {
    gradeId: number;
    requestedScore: number;
    cause: string;
    period: string; // "CC" ou "SN"
    description: string;
}