import { TypeEqualityGuard, assertType } from "@common/util/type-check.ts";
import { z } from "zod";

export const ZPercentageSize = z.object({
  percentageWidth: z.number(),
  percentageHeight: z.number(),
});
export type PercentageSize = {
  percentageWidth: number;
  percentageHeight: number;
};
assertType<
  TypeEqualityGuard<PercentageSize, z.infer<typeof ZPercentageSize>>
>();

export const ZSize = z.object({
  width: z.number(),
  height: z.number(),
});
export type Size = {
  width: number;
  height: number;
};
assertType<TypeEqualityGuard<Size, z.infer<typeof ZSize>>>();
