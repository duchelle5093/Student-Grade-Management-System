import { createContext } from 'react';
import {Role} from "../../../../api/enums";


export type PersonalInfoDataType = {
    firstName: string;
    lastName: string;
    phone: string;
};

export type IdentificationInfoDataType = {
    username: number;
    email: string;
    password: string;
};

export type RegisterProps = {
    identificationInfo?: IdentificationInfoDataType;
    personalInfo : PersonalInfoDataType;
    role: Role;
};




type RegisterContextType = {
    role: Role | null;
    personalInfo: PersonalInfoDataType;
    setPersonalInfo: (personalInfoData: PersonalInfoDataType) => void;
    identificationInfo: IdentificationInfoDataType;
    setIdentificationInfo: (
        identificationInfo: IdentificationInfoDataType
    ) => void;
    register: (data?: RegisterProps) => void;
    isRegisterLoading: boolean;
    isRegisterSuccess: boolean;
    resetForm: () => void;
};

export const RegisterContext = createContext<
    Partial<RegisterContextType>
>({
    role: null,
});
