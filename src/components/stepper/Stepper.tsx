import { ReactNode, useContext } from 'react';
import { StepperContext } from '../../contexts';
import {StepStatusStyle} from "./StepperStatusStyle.tsx";

export interface StepItem {
    label: string;
    content: ReactNode;
}

interface StepperProps {
    stepItems: StepItem[];
    horizontal?: boolean;
    children: (currentStepIndex: number) => ReactNode;
}

export const Stepper = ({
                            children,
                            stepItems,
                            horizontal = false,
                        }: StepperProps) => {
    const { currentStepIndex } = useContext(StepperContext);

    const stepView = (index: number, stepItem: StepItem) => {
        if (index < currentStepIndex)
            return (
                <StepStatusStyle
                    className={`bg-primary dark:bg-gray-400  ${!horizontal && 'lg:w-8'}`}
                    label={!horizontal && stepItem.label}
                ></StepStatusStyle>
            );
        if (index === currentStepIndex)
            return (
                <StepStatusStyle
                    className={`bg-secondary h-[2.8px] ${!horizontal && 'lg:w-8'}`}
                    label={
                        <div>
              <span className="font-bold lg:hidden">{`${
                  currentStepIndex + 1
              } / ${stepItems.length}`}</span>
                            <p>{` ${stepItem.label}`}</p>
                        </div>
                    }
                />
            );
        return (
            <StepStatusStyle
                className={`bg-gray-300 dark:bg-gray-600 ${!horizontal && 'lg:w-3 '}`}
                label={!horizontal && stepItem.label}
                textStyle="text-gray-300 dark:text-gray-500"
            />
        );
    };
    return (
        <div
            className={`flex flex-col gap-8 text-sm h-full ${
                !horizontal && 'lg:grid lg:grid-cols-[15vw_1fr]'
            }`}
        >
            <div>
                <div className={`flex gap-2 ${!horizontal && 'lg:block lg:fixed'}`}>
                    {stepItems.map((stepItem, index) => (
                        <div
                            className={`w-full pb-2 ${
                                !horizontal && 'lg:flex lg:items-center'
                            } `}
                            key={index}
                        >
                            {stepView(index, stepItem)}
                        </div>
                    ))}
                </div>
            </div>
            {children(currentStepIndex)}
        </div>
    );
};
