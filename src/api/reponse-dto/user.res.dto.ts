import {StudentTopicResDto} from "./student.res.dto.ts";
import {Role} from "../enums";

export interface userProfileResDto extends StudentTopicResDto{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    levels: string[];
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

