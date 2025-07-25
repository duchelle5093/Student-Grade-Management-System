import { createContext } from 'react';
import {Role} from "../../../../api/enums";


export type PersonalInfoDataType = {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    placeOfBirth: string;
};

export type IdentificationInfoDataType = {
    username: string;
    email: string;
    registrationKey: string;
    password: string;
    level : string;
    speciality: string;
    cycle: string;
};

export type RegisterProps = {
    identificationInfo?: IdentificationInfoDataType;
    personalInfo : PersonalInfoDataType;
    role: Role;
};




type RegisterContextType = {
    role: Role | null ;
    setRole: (role: Role ) => void;
    personalInfo: PersonalInfoDataType;
    setPersonalInfo: (personalInfoData: PersonalInfoDataType) => void;
    identificationInfo: IdentificationInfoDataType;
    setIdentificationInfo: (
        identificationInfo: IdentificationInfoDataType
    ) => void;
    register: (data?: { role: Role | null | undefined }) => void;
    isRegisterLoading: boolean;
    isRegisterSuccess: boolean;
    resetForm: () => void;
};

export const RegisterContext = createContext<
    Partial<RegisterContextType>
>({
    role : null,
});
