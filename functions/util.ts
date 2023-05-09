import z from "zod";

const uuidLength = 36;
export const ZuUID = z.string().length(uuidLength);
