import z from "zod";

export const ZuUID = z.string().length(36);
export type UUID = string;
