import React, { ReactNode, useContext, useState } from 'react';
import { NavLink, Path } from 'react-router-dom';
import { Popover } from 'antd';
// import { ChevronRightIcon } from '@heroicons/react/24/outline';
import {DrawerSidebarContext} from "../contexts";
import { ChevronRightIcon } from '@heroicons/react/24/solid';

export interface SidebarNavItemProps extends React.HTMLAttributes<HTMLElement> {
    icon?: ReactNode;
    label: string;
    onClick?: () => void;
    to?: string | Partial<Path>;
    children?: ReactNode;
}

export const SidebarNavItem = ({
                                   label,
                                   icon,
                                   children,
                                   to,
                                   onClick,
                                   ...props
                               }: SidebarNavItemProps) => {
    const { isSidebarOpen, toggleSidebar } = useContext(DrawerSidebarContext);
    const hasChildren = !!children;
    const [showChildren, setShowChildren] = useState(false);

    const handleLinkClicked = () => {
        setShowChildren(!showChildren)
        if(window.innerWidth < 1024){
            isSidebarOpen &&  toggleSidebar?.()
        }
        onClick?.()
    }
    const overlayInnerStyle = {
        ...{ padding: '0px' },
        ...Object.assign(
            {},
            hasChildren ? { overflow: hasChildren ? 'hidden' : 'inherit' } : {}
        ),
    };
    return (
        <Popover
            style={overlayInnerStyle}
            placement="rightTop"
            title={
                !isSidebarOpen && (
                    <div className={'flex flex-col'}>
                        <span className="hint-label mx-4 my-2 text-sm">{label}</span>
                    </div>
                )
            }
            content={!isSidebarOpen && children}
        >
            <div className="flex flex-col">
                <NavLink
                    {...props}
                    onClick={handleLinkClicked}
                    to={to ? to : '/#/'}
                    className={({ isActive }) =>
                        isActive ? "bg-primary text-white font-bold sidebar-nav-item " : "sidebar-nav-item"
                    }

                >
                    <div className="flex justify-center items-center ">{icon}</div>
                    <span
                        className={'label transition-all text-sm font-medium line-clamp-1'}
                    >
            {label}
          </span>

                {hasChildren && isSidebarOpen && (
                    <div className="flex justify-center items-center mr-4">
                        <ChevronRightIcon
                            className={`${
                                showChildren ? 'rotate-90 ' : 'rotate-0'
                            } transition-all`}
                            width={16}
                            strokeWidth={3}
                        />
                    </div>
                )}
                </NavLink>
                <div className="flex flex-col pl-[37px]">
                    {hasChildren && isSidebarOpen && showChildren && children}
                </div>

            </div>
        </Popover>
    );
};
