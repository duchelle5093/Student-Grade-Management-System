interface Subject {
    id: number;
    name: string;
    code: string;
    credits: number;
    description: string;
    active: boolean;
    level: string; // "LEVEL1", "LEVEL2", etc.
    cycle: string; // "BACHELOR", "MASTER"
    semesterId: number;
    semesterName: string;
    departmentId: number;
    departmentName: string;
    teacherId: number;
    teacherName: string;
    createdDate: string | null;
    lastModifiedDate: string | null;
}

export interface userProfileResDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    subjects: Subject[];
}
//
// interface Topic {
//     code: string,
//     title: string,
//     cc: number,
//     sn: number,
//     semester: string,
//     credits:number
// }

// export interface studentResDto {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string;
//     role: string;
//     level: string;
//     topics: Topic[];
//     [index: string]: any
// }

