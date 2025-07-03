import {routes} from "./router";
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";

export const App = () => {

    const router = createBrowserRouter(routes)

    return <RouterProvider router={router}/>
}