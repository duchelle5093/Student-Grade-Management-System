import {redirect, type RouteObject} from "react-router-dom";
import {LoginPage, RegisterPage} from "../features";
import {AuthLayout, DashboardLayout} from "../layouts";

export const routes:RouteObject[] = [
    {
        path: '/' ,
        loader() {
            return redirect('/auth');
        }
    },
    {
        path: '/auth',
        element:<AuthLayout/>,
        children: [
            {
                path: '',
                loader() {
                    return redirect('login');
                },
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path:'register',
                element:<RegisterPage/>
            }
        ]
    },
    {
        path: '/dashboard',
        element:<DashboardLayout/>
    }
]



