import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Editor from './Editor.tsx'
import './index.css'

const router = createBrowserRouter([

    {
        path: "/",
        element: <div>Home</div>,
    },
    {
        path: "edit",
        element: (
            <Editor></Editor>
        ),
    },
    {
        path: "view",
        element: <div>About</div>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
