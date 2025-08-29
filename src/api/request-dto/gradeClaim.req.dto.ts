export interface GradeClaimReqDto {
    gradeId: number;
    requestedScore: number;
    cause: string;
    period: 'CC_1' | 'CC_2' | 'SN_1' | 'SN_2';
    description: string;
}