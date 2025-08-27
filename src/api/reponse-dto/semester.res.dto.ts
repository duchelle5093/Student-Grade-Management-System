export interface SemesterResDto {
    id: number;
    createdDate: string;
    lastModifiedDate: string;
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    orderIndex: number;
}

export interface CreateGradeByCodeReqDto {
    studentMatricule: string;
    subjectCode: string;
    semesterId: string;
    value: number;
    type: 'CC_1' | 'SN_1' | 'CC_2' | 'SN_2';
    comments: string;
    periodLabel: string;
}
