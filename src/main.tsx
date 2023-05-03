import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import './index.css'
import Editor from "./pages/Editor.tsx";
import Viewer from "./pages/Viewer.tsx";
import {Home} from "./pages/Home.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "edit/:collectionId/:secret",
        element: (
            <Editor/>
        ),
    },
    {
        path: "view/:collectionId",
        element: <Viewer/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
