import { ReactNode } from 'react';

type StepStatusStyleProps = {
    className: string;
    label?: string | ReactNode;
    textStyle?: string;
};

export const StepStatusStyle = ({
                                    className,
                                    label,
                                    textStyle,
                                }: StepStatusStyleProps) => {
    return (
        <>
            <div
                className={`w-full h-[2px] ${className} rounded-lg mr-2 mb-1 transition-all duration-300 `}
            ></div>
            <div className={`${textStyle}`}>{label}</div>
        </>
    );
};
