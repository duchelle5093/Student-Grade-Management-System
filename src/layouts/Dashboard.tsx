import { Outlet } from "react-router-dom";

import { processSignOut } from "../features/auth/actions";
import { useAppDispatch, useAppSelector } from "../store";
import { DrawerSidebarProvider } from "../contexts";
import { DashboardLayout } from "./DashboardLayout.tsx";
//import { SideBarHeader } from "../components/SidebarHeader.tsx";
import { SidebarNavItem } from "../components/SidebarNavItem.tsx";
import { DashboardHeader } from "../components/DashboardHeader.tsx";
import signOutIconSvg from "../images/logoutt.png";
import { AcademicCapIcon, HomeIcon } from "@heroicons/react/24/solid";
import { SidebarNavSubItem } from "../components/SidebarNavSubItem.tsx";
import { hasPermission } from "../utils/index.ts";
import { Role } from "../api/enums/index.ts";
import { Spinner } from "../components/Spinner.tsx";

export const Dashboard = () => {
  const dispatch = useAppDispatch();

  const userProfile = useAppSelector((state) => state.user.profile);

  if (!userProfile) {
    return <Spinner />;
  }

  const onDisconnect = () => {
    dispatch(processSignOut());
  };

  return (
    <DrawerSidebarProvider>
      <DashboardLayout
        collapsedWidth={65}
        sidebarView={
          <>
            <div className="h-30 flex items-center justify-center">NIVEAUX</div>
            <main
              className={"overflow-y-auto overflow-x-hidden h-full text-black "}
            >
              <SidebarNavItem
                to={"overview"}
                icon={<HomeIcon width={24} className="text-gray-500" />}
                label={"Home"}
              />
              {hasPermission([Role.TEACHER]) && (
                <>
                  <SidebarNavItem
                    to={"licence1"}
                    icon={<AcademicCapIcon width={26} />}
                    label={"Licence"}
                  >
                    <SidebarNavSubItem label={"Licence 1"} to={"licence1"} />
                    <SidebarNavSubItem label={"Licence 2"} to={"licence2"} />
                    <SidebarNavSubItem label={"Licence 3"} to={"licence3"} />
                  </SidebarNavItem>
                  <SidebarNavItem
                    to={"master1"}
                    icon={<AcademicCapIcon width={26} />}
                    label={"Master"}
                  >
                    <SidebarNavSubItem label={"Master 1"} to={"master1"} />
                    <SidebarNavSubItem label={"Master 2"} to={"master2"} />
                  </SidebarNavItem>
                  <SidebarNavItem
                    to={"overview"}
                    icon={<AcademicCapIcon width={26} />}
                    label={"Doctorat"}
                  />
                </>
              )}

              {hasPermission([Role.STUDENT]) && (
                <>
                  <SidebarNavItem
                    to={"semester1"}
                    icon={<AcademicCapIcon width={26} />}
                    label={"Semestre 1"}
                  />
                  <SidebarNavItem
                    to={"semester2"}
                    icon={<AcademicCapIcon width={26} />}
                    label={"Semestre 2"}
                  />
                </>
              )}
              {hasPermission([Role.ADMIN]) && (
                <SidebarNavItem
                  to={"admin"}
                  icon={<AcademicCapIcon width={26} />}
                  label={"Adminnnn"}
                />
              )}
            </main>

            <footer className="flex flex-col border-t border-gray-300">
              <SidebarNavItem
                aria-label="dashboard sign out"
                to={"/"}
                onClick={onDisconnect}
                icon={<img src={signOutIconSvg} width={34} alt="" />}
                label={"Sign out"}
              />
            </footer>
          </>
        }
      >
        <div className="h-full grid grid-rows-[auto_1fr]">
          <DashboardHeader
            onDisconnect={onDisconnect}
            useAppSelector={useAppSelector}
            role="TEACHER"
          />
          <div className={"outlet overflow-hidden overflow-y-auto pt-4 "}>
            <div className="container mx-auto ">
              <Outlet />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DrawerSidebarProvider>
  );
};
