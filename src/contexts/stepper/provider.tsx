import { ReactNode, useState } from 'react';
import {StepperContext} from "./context.ts";

export type StepperProviderProps = {
    children: ReactNode;
};
export const StepperProvider = ({ children }: StepperProviderProps) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handleNext = () => {
        setCurrentStepIndex(currentStepIndex + 1);
    };
    const handlePrev = () => {
        setCurrentStepIndex(currentStepIndex - 1);
    };
    const handleReset = () => {
        setCurrentStepIndex(0);
    };

    return (
        <StepperContext.Provider
            value={{
                currentStepIndex: currentStepIndex,
                handleNext: handleNext,
                handlePrev: handlePrev,
                handleReset: handleReset,
            }}
        >
            {children}
        </StepperContext.Provider>
    );
};
