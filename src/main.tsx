import React, {lazy} from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, Link, RouterProvider,} from "react-router-dom";
import './index.css'

const Editor = lazy(() => import('./pages/Editor.tsx'));
const Viewer = lazy(() => import('./pages/Viewer.tsx'));

const router = createBrowserRouter([

    {
        path: "/",
        element: <div className="bg-gray-100 min-h-screen">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
                    <div>
                        <label htmlFor="collectionId" className="block mb-2">Collection ID:</label>
                        <input
                            type="text"
                            id="collectionId"
                            placeholder="Enter collection ID"
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4">
                            View Collection
                        </button>
                    </div>
                    <div>
                        <p className="text-center mb-4">Or</p>
                        <Link
                            to={'/view'}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block text-center w-full">
                            Create Collection
                        </Link>
                    </div>
                </div>
            </div>
        </div>,
    },
    {
        path: "edit",
        element: (
            <Editor></Editor>
        ),
    },
    {
        path: "view",
        element: <Viewer></Viewer>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
