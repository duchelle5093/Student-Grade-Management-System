import {routes} from "./router";
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import {ServerNotificationHandler} from "./components";

export const App = () => {

    const router = createBrowserRouter(routes)

    return (
        <>
            <ServerNotificationHandler/>
            <RouterProvider router={router}/>
        </>
    )
}