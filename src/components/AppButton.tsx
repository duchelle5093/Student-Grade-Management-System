import React, { ReactNode } from 'react';
import {Button, ButtonProps} from "antd";

export interface Props {
    label?: string;
    children?: ReactNode;
    btnType?: 'submit' | 'button';
    className?: string;
}

export const AppButton: React.FC<Props & ButtonProps> = ({
                                                             label,
                                                             btnType = 'submit',
                                                             className,
                                                             children,
                                                            ...props
                                                         }) => {
    return (
        <Button
            {...props}
            className={`${className} rounded-lg font-semibold transition hover:disabled:cursor-not-allowed ${
                btnType === 'submit'
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'transparent text-secondary border-secondary border-1.5'
            }`}
        >
            {label ? label : children}
        </Button>
    );
};
