import { lazy } from "react";

export const LazyEditor = lazy(() =>
  import("./Editor.tsx").then((module) => ({ default: module.Editor })),
);
