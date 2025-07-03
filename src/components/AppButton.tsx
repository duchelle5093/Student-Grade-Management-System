import React, { ReactNode } from 'react';

export interface Props {
    label?: string;
    children?: ReactNode;
    btnType?: 'submit' | 'button';
    className?: string;
}

export const AppButton: React.FC<Props> = ({
                                                             label,
                                                             btnType = 'submit',
                                                             className,
                                                             children,
                                                         }) => {
    return (
        <button
            type={btnType}
            className={`${className} py-2 rounded-lg font-semibold transition cursor-pointer hover:disabled:cursor-not-allowed ${
                btnType === 'submit'
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'transparent text-secondary border-secondary border-1.5'
            }`}
        >
            {label ? label : children}
        </button>
    );
};
