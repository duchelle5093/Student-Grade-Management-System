import React, { ReactNode } from 'react';
import { NavLink, Path } from 'react-router-dom';

export interface SidebarNavSubItemProps
  extends React.HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  label: string;
  to: string | Partial<Path>;
}

export const SidebarNavSubItem = ({
  to,
  label,
  icon,
  ...props
}: SidebarNavSubItemProps) => {
  const gridDisplay = icon ? "grid-cols-[65px_1fr]" : "grid-cols-1"
  return (
    <NavLink
    className={({ isActive }) =>
                        isActive ? "bg-gray-200  font-bold sidebar-nav-sub-item py-2 pr-4 grid ${gridDisplay} items-center" : `sidebar-nav-sub-item hover:bg-slate-100 py-2 pr-4 grid ${gridDisplay} items-center`
                    }
      //className={`sidebar-nav-sub-item text-sm tracking-tight hover:bg-slate-100  py-2 pr-4 grid ${gridDisplay} items-center `}
      {...props}
      to={to}
    >
      { icon && <div className="flex items-center justify-center">{icon}</div>}
      <span className={`line-clamp-2 ${!icon ? "ml-[28px]" : ""}`}>{label}</span>
    </NavLink>
  );
};
