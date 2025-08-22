import { ReactNode, useContext } from "react";
import { Drawer } from "antd";
import { DrawerSidebarContext } from "../contexts";
import {hasPermission} from "../utils";
import {Role} from "../api/enums";

interface DashboardLayoutProps {
  collapsedWidth: number;
  sidebarView: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({
  children,
  sidebarView,
  collapsedWidth,
}: DashboardLayoutProps) => {
  const { isSidebarOpen, toggleSidebar } = useContext(DrawerSidebarContext);

  const sidebarWidth = isSidebarOpen ? 300 : collapsedWidth;
  return (
    <>
      {hasPermission([Role.TEACHER, Role.ADMIN]) ? (
        <>
          <Drawer
            aria-label="drawer-sidebar"
            width={300}
            placement={"left"}
            closable={false}
            rootClassName={"lg:hidden "}
            classNames={{
              body: "!p-0 mobile-drawer",
            }}
            onClose={() => toggleSidebar?.()}
            open={isSidebarOpen ?? false}
            key={"left"}
          >
            {sidebarView}
          </Drawer>
          <div className="dashboard-layout">
            <aside
              className={`hidden lg:grid grid-rows-[auto_1fr_auto] overflow-hidden duration-300 ease-in-out transition-all`}
              style={{ width: sidebarWidth }}
            >
              {sidebarView}
            </aside>
            <main className={"__main"}>{children}</main>
          </div>
        </>
      ) : (
        <div className="w-full">
          <main className="w-full">{children}</main>
        </div>
      )}
    </>
  );
};
