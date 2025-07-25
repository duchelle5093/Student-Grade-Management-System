import { redirect, type RouteObject } from "react-router-dom";
import {
  Licence1,
  Licence2,
  Licence3,
  LoginPage,
  Master1,
  Master2,
  Overview,
  RegisterPage,
} from "../features";
import { AuthLayout } from "../layouts";
import { Dashboard } from "../layouts/Dashboard.tsx";
import { PrivateRoutes } from "../components/PrivateRoute.tsx";
import { PageTitleProvider } from "../contexts";
import NotFoundView from "../components/NotFoundView.tsx";
import Semester1 from "../features/student/sem1/index.tsx";
import Semester2 from "../features/student/sem2/index.tsx";

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
      {
        path: "register",
        element: <RegisterPage />,
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
        path: "semester1",
        element: <Semester1 />,
      },
      {
        path: "semester2",
        element: <Semester2 />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
];
