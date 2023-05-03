import z from "zod";

const uuidLength = 36;
export const ZuUID = z.string().length(uuidLength);
export const ZDoubleUUID = z.string().length(uuidLength * 2);
