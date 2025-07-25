import { Badge, Breadcrumb, Button, Dropdown, MenuProps } from "antd";

import { useContext } from "react";
import { DrawerSidebarContext, PageTitleContext } from "../contexts";
import next from "../images/next.png";
import back from "../images/back.png";
import UserIcon from "@heroicons/react/24/solid/esm/UserIcon";
import { store } from "../store";
import { Link, useLocation } from "react-router";

interface Props {
  useAppSelector: (state: any) => any;
  onDisconnect: () => void;
  role: string;
}

export const DashboardHeader = ({ onDisconnect: disconnect }: Props) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const BItems = [
    ...pathnames.map((segment, idx) => {
      const url = "/" + pathnames.slice(0, idx + 1).join("/");
      const labelMap: Record<string, string> = {
        licence1: "Licence 1",
      };
      return {
        title: <Link to={url}>{labelMap[segment] || segment}</Link>,
      };
    }),
  ];

  const { toggleSidebar, isSidebarOpen } = useContext(DrawerSidebarContext);
  const { pageTitle } = useContext(PageTitleContext);

  const userInfo = store.getState().user.profile;

  const onDisconnect = () => {
    disconnect();
  };

  const items: MenuProps["items"] = [
    {
      label: "",
      key: "0",
    },
    {
      label: <button onClick={onDisconnect}>{"Deconnexion"}</button>,
      key: "1",
    },
  ];

  return (
    <header
      className={
        "h-[50px] bg-inherit border-b border-gray-200 flex justify-between items-center px-4 bg-primary"
      }
    >
      <div className="flex items-center gap-2">
        <Button
          onClick={() => toggleSidebar?.()}
          type="text"
          shape="circle"
          className={
            "bg-slate-100 dark:bg-primary dark:text-slate-100 text-slate-500 hover:text-slate-600"
          }
          icon={
            isSidebarOpen ? (
              <img src={back} alt={"back"} width={15} />
            ) : (
              <img src={next} alt={"next"} width={15} />
            )
          }
        />
        <Breadcrumb items={BItems} separator=">" />
      </div>
      <div>
        <h2
          className={
            "font-semibold sub-title tracking-wider uppercase text-white md:text-xl line-clamp-1"
          }
        >
          {pageTitle && pageTitle}
        </h2>
      </div>

      <div className={"flex gap-5 relative items-center"}>
        <Dropdown
          placement={"bottomRight"}
          className={"relative"}
          menu={{ items }}
          trigger={["hover"]}
        >
          <Button type="default" shape="circle">
            <Badge count={2} size="small">
              <UserIcon width={24} className="text-gray-500" />
            </Badge>
          </Button>
        </Dropdown>
        <div className="hidden lg:block text-white lg:mr-24">
          <div className="flex flex-col text-xs">
            <div className="font-bold flex gap-1 text-md">
              <span>{userInfo.firstName}</span>
              <span>{userInfo.lastName}</span>
            </div>
            {userInfo.role}
          </div>
        </div>
      </div>
    </header>
  );
};
