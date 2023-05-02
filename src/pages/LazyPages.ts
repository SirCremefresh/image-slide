import {lazy} from "react";

export const LazyEditor = lazy(() => import('./Editor.tsx'));
export const LazyViewer = lazy(() => import('./Viewer.tsx'));
