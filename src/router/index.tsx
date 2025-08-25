import { redirect, type RouteObject } from "react-router-dom";
import {
  ChangePwdPage,
  Licence1,
  Licence2,
  Licence3,
  LoginPage,
  Master1,
  Master2,
  Overview,
  RegisterPage,
} from "../features";
import { TeacherOverview } from "../features/teacher";
import { AuthLayout } from "../layouts";
import { Dashboard } from "../layouts/Dashboard.tsx";
import { PrivateRoutes } from "../components/PrivateRoute.tsx";
import { PageTitleProvider } from "../contexts";
import NotFoundView from "../components/NotFoundView.tsx";
import StudentPage from "../features/student/StudentPage.tsx";
import AcademicPeriodsManager from "../features/admin";
import { UsersManagement } from "../features/admin";
import {SubjectsManagement} from "../features/admin/components/SubjectsManagement.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    loader() {
      return redirect("/auth");
    },
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        loader() {
          return redirect("login");
        },
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      // {
      //   path: "register",
      //   element: <RegisterPage />,
      // },
      {
        path: "change-password",
        element: <ChangePwdPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <PageTitleProvider>
          <Dashboard />,
        </PageTitleProvider>
      </PrivateRoutes>
    ),
    children: [
      {
        path: "",
        loader() {
          return redirect("overview");
        },
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "teacher-overview",
        element: <TeacherOverview />,
      },
      {
        path: "licence1",
        element: <Licence1 />,
      },
      {
        path: "licence2",
        element: <Licence2 />,
      },
      {
        path: "licence3",
        element: <Licence3 />,
      },
      {
        path: "master1",
        element: <Master1 />,
      },
      {
        path: "master2",
        element: <Master2 />,
      },
      {
        path: "student",
        element: <StudentPage/>,
      },
        {
            path: 'periods',
            element: <AcademicPeriodsManager/>
        },
        {
            path: 'users',
            element: <UsersManagement/>
        },
        {
            path: 'subjects',
            element: <SubjectsManagement/>
        },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
];
