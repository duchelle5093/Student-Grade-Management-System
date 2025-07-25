import {StepItem, Stepper} from "../../../../components";
import {PersonalInfoForm} from "./PersonalInfoForm.tsx";
import {RoleSelectionView} from "./RoleSelection.tsx";
import {IdentificationForm} from "./IdentificationForm.tsx";
import {StepperProvider} from "../../../../contexts";


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
        <section>
            <StepperProvider>
                <Stepper
                    horizontal={isHorizontal}
                    stepItems={stepItemsBase}
                >
                    {(currentStepIndex) => (
                        <div>
                            {stepItemsBase[currentStepIndex].content}
                        </div>
                    )}
                </Stepper>
            </StepperProvider>
        </section>
    );
};
