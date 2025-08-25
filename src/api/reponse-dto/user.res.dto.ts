import {StudentTopicResDto} from "./student.res.dto.ts";
import {Role} from "../enums";

interface Department {
    id: number;
    name: string;
    subjects: any;
}

interface LevelInfo {
    level: string; // "L1", "L2", "L3", "L4", "L5"
    departments: Department[];
}

export interface userProfileResDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    levels: LevelInfo[];
    subjects: any;
}

interface Topic {
    code: string,
    title: string,
    cc: number,
    sn: number,
    semester: string,
    credits:number
}

export interface studentResDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    level: string;
    topics: Topic[];
    [index: string]: any
}

