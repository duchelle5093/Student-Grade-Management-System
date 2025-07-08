import {ReactNode, useCallback, useMemo, useState} from "react";
import {Role} from "../../../../api/enums";
import {IdentificationInfoDataType, PersonalInfoDataType, RegisterContext} from "./context.ts";
import {useRegisterMutation} from "../api/register.api.slice.ts";


type AgentRegisterCtxProviderType = {
    children: ReactNode;
};


export const RegisterCtxProvider = ({
                                             children,
                                         }: AgentRegisterCtxProviderType) => {
    const [role, setRole] = useState<Role | null>();
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoDataType>();
    const [identificationInfo, setIdentificationInfo] =
        useState<IdentificationInfoDataType>();
    const [triggerAgentRegister, { isSuccess, isLoading }] = useRegisterMutation();


    const register = useCallback(
        () => {
            const personalInfoPayload: PersonalInfoDataType = {
                ...(personalInfo as PersonalInfoDataType),
            };

            const identificationInfoPayload: IdentificationInfoDataType = {
                ...(identificationInfo as IdentificationInfoDataType),
            };

            const payload = {
                ...personalInfoPayload,
                ...identificationInfoPayload,
                role,
            };
        triggerAgentRegister(payload);
    },
        [
            role,
            personalInfo,
            identificationInfo,
            triggerAgentRegister,
        ]
    );

    const resetForm = () => {
        setRole(null);
        setIdentificationInfo({});
        setPersonalInfo({});
    };

    const contextValue = useMemo(
        () => ({
            role,
            setRole,
            personalInfo,
            setPersonalInfo,
            identificationInfo,
            setIdentificationInfo,
            register,
            isRegisterLoading: isLoading,
            isRegisterSuccess: isSuccess,
            resetForm,
        }),
        [
            personalInfo,
            identificationInfo,
            isLoading,
            isSuccess,
            register,
            role
        ]
    );

    return (
        <RegisterContext.Provider value={contextValue}>
            {children}
        </RegisterContext.Provider>
    );
};
