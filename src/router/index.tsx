import {redirect, type RouteObject} from "react-router-dom";
import {LoginPage} from "../features";

export const routes:RouteObject[] = [
    {
        path: '/' ,
        loader() {
            return redirect('/auth');
        }
    },
    {
        path: '/auth',
        element:<LoginPage/>
    }
]



