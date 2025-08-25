import {Outlet, useNavigate} from "react-router-dom";

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
import { Role } from "../api/enums";
import { Spinner } from "../components/Spinner.tsx";
import {hasPermission} from "../utils";
import { useTeacherLevels } from "../hooks";

export const Dashboard = () => {
    const dispatch = useAppDispatch();

    const userProfile = useAppSelector((state) => state.user.profile);
    const navigate = useNavigate();
    
    // Hook pour obtenir les niveaux enseignés
    const {
        hasLicenceLevels,
        hasMasterLevels,
        licenceLevels,
        masterLevels
    } = useTeacherLevels();
    

    
    if (!userProfile) {
        return <Spinner />;
    }

    const onDisconnect = () => {
        dispatch(processSignOut());
        navigate("/");
    };

    return (
        <DrawerSidebarProvider>
            <DashboardLayout
                collapsedWidth={65}
                sidebarView={
                    <>
                        <div className="h-30 flex items-center justify-center">NIVEAUX</div>
                        <main className={"overflow-y-auto overflow-x-hidden h-full text-black"}>
                            {hasPermission([Role.TEACHER]) && (
                                <>
                                    <SidebarNavItem
                                        to={"teacher-overview"}
                                        icon={<HomeIcon width={24} className="text-gray-500" />}
                                        label={"Home"}
                                    />
                                    {/* Affichage conditionnel des niveaux Licence */}
                                    {hasLicenceLevels && (
                                        <SidebarNavItem
                                            to={licenceLevels[0]?.route || "licence1"}
                                            icon={<AcademicCapIcon width={26} />}
                                            label={"Licence"}
                                        >
                                            {licenceLevels.map(level => (
                                                <SidebarNavSubItem 
                                                    key={level.level}
                                                    label={level.displayName} 
                                                    to={level.route} 
                                                />
                                            ))}
                                        </SidebarNavItem>
                                    )}
                                    {/* Affichage conditionnel des niveaux Master */}
                                    {hasMasterLevels && (
                                        <SidebarNavItem
                                            to={masterLevels[0]?.route || "master1"}
                                            icon={<AcademicCapIcon width={26} />}
                                            label={"Master"}
                                        >
                                            {masterLevels.map(level => (
                                                <SidebarNavSubItem 
                                                    key={level.level}
                                                    label={level.displayName} 
                                                    to={level.route} 
                                                />
                                            ))}
                                        </SidebarNavItem>
                                    )}
                                </>
                            )}
                            {hasPermission([Role.ADMIN]) && (
                                <>
                                    <SidebarNavItem
                                        to={"overview"}
                                        icon={<HomeIcon width={24} className="text-gray-500" />}
                                        label={"Home"}
                                    />
                                    <SidebarNavItem
                                        to={"periods"}
                                        icon={<AcademicCapIcon width={26} />}
                                        label={"Periodes"}
                                    />
                                    <SidebarNavItem
                                        to={"users"}
                                        icon={<AcademicCapIcon width={26} />}
                                        label={"Utilisateurs"}
                                    />
                                    <SidebarNavItem
                                        to={"subjects"}
                                        icon={<AcademicCapIcon width={26} />}
                                        label={"Matieres"}
                                    />
                                </>
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
                        role={userProfile.role}
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