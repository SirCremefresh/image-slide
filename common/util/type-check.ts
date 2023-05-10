// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
export function assertType<T extends never>(): void {
}

export type TypeEqualityGuard<A, B> = Exclude<A, B> | Exclude<B, A>;
