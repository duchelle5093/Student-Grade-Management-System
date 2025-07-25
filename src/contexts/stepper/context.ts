import { createContext } from 'react';
type StepperContextType = {
    currentStepIndex: number;
    handleNext?: () => void;
    handlePrev?: () => void;
    handleReset?: () => void;
};
export const StepperContext = createContext<StepperContextType>({
    currentStepIndex: 0,
});
