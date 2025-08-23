import {Role} from "../enums";

export interface LoginreqDto {
    username: string;
    password: string;
}


export interface RegisterReqDto {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    level: string;
    matricule: string;
    speciality: string;
    cycle: string;
    dateOfBirth: string;
    placeOfBirth: string;
}

