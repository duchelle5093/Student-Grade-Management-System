export interface GradeClaimReqDto {
    gradeId: number,
    reclamationType: string,
    requestedScore: number,
    cause: string,
    description: string,
}