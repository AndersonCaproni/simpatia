import { createBrowserRouter } from "react-router-dom";
import Chat from "../views/chat";
import { ManProvider } from "../hooks/man-provider";
import NotFound from "../views/not-found";

const route = createBrowserRouter([
    {
        path: "/",
        element:
            <ManProvider>
                <Chat />
            </ManProvider>
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default route;
