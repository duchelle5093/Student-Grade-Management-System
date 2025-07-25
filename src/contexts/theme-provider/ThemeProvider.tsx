import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import {ColorTheme} from "../../api/enums";

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Notification: {
                        colorPrimary: ColorTheme.PRIMARY,
                    },
                    DatePicker:{
                        activeBorderColor: 'transparent',
                        hoverBorderColor: ' border-gray-300',
                    },
                    Button: {
                        defaultHoverBg: ColorTheme.SECONDARY,
                        defaultHoverColor: 'white',
                        defaultHoverBorderColor: 'transparent',
                        defaultBg: ColorTheme.PRIMARY,
                        defaultColor:'white'
                    },
                    Input:{
                        activeBorderColor: 'transparent',
                        hoverBorderColor: ' border-gray-300',
                    },
                    Tabs : {
                        colorPrimary : ColorTheme.SECONDARY
                    },
                    Radio : {
                        colorPrimary :ColorTheme.SECONDARY
                    },
                    Checkbox : {
                        colorPrimary : '#1f7d53'
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};
