import { useContext, useState } from 'react';
import {StepperContext} from "../../../../contexts";
import {RegisterContext} from "../context";
import {Role} from "../../../../api/enums";
import {SelectCard} from "../../../../components/SelectCard.tsx";
import {AppButton} from "../../../../components";

export const RoleSelectionView = () => {
    const {
        role = null,
        setRole,
    } = useContext(RegisterContext);

    const { handleNext } = useContext(StepperContext);
    const [activeCard, setActiveCard] = useState<Role | null>(role);

    const handleSelection = (card: Role) => {
        setActiveCard(activeCard === card ? null : card);
        setRole?.(card);
    };

    const setActiveStatus = (card: string) => {
        if (activeCard === card) return true;
        return false;
    };

    const accountTypeSelector: {
        label: string;
        value: Role;
    }[] = [
        {
            label: 'ADMINISTRATEUR',
            value: Role.ADMIN,
        },
        {
            label: 'ENSEIGNANT',
            value: Role.TEACHER,
        },
        {
            label: 'ETUDIANT',
            value: Role.STUDENT,
        },
    ];

    return (
            <div className="flex flex-col gap-4" aria-label={'account type selection'}>
                {accountTypeSelector.map((type) => (
                    <SelectCard
                        key={type.value}
                        isActive={setActiveStatus(type.value)}
                        className="bg-slate-100 hover:bg-secondary rounded-md"
                        activeClassName="!bg-secondary opacity-70"
                        onClick={() => handleSelection(type.value)}
                    >
                        <div className="p-2 text-center">
                            <div className="text-xs">
                                {type.label}
                            </div>
                        </div>
                    </SelectCard>
                ))}
                <div className="">
                    <AppButton
                        aria-label={'next step'}
                        label={'Suivant'}
                        htmlType="button"
                        className="w-full"
                        onClick={handleNext}
                        disabled={!activeCard}
                    />
                </div>
            </div>
    );
};
