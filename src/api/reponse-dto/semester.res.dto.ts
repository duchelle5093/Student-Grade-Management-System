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
    type: "ASSIGNMENT" | "EXAM" | "CC" | "SN";
    comments: string;
    periodLabel: string;
}
