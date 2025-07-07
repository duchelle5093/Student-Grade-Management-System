import {StepItem} from "../../../../components";
import {PersonalInfoForm} from "./PersonalInfoForm.tsx";
import {RoleSelectionView} from "./RoleSelection.tsx";
import {IdentificationForm} from "./IdentificationForm.tsx";


type RegisterStepperProps = {
    isHorizontal?: boolean;
};
export const RegisterStepper = ({ isHorizontal }: RegisterStepperProps) => {

    const stepItemsBase: StepItem[] = [
        {
            label: 'Role',
            content: <RoleSelectionView />,
        },
        {
            label: 'Informations personnelles',
            content: <PersonalInfoForm />,
        },
        {
            label: 'Identification',
            content: <IdentificationForm />,
        }
    ];


    return (
        <section className="mt-4">
            <StepperProvider>
                <Stepper
                    horizontal={isHorizontal}
                    stepItems={stepItemsBase}
                >
                    {(currentStepIndex) => (
                        <div className={`${!isSelfRegistration && 'lg:ml-24'}`}>
                            {steps[currentStepIndex].content}
                        </div>
                    )}
                </Stepper>
            </StepperProvider>
        </section>
    );
};
