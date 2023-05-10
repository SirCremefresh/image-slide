import z from "zod";

export abstract class ResponseError extends Error {
    abstract toResponse(): Response;
}

class TypeCheckException extends ResponseError {
    constructor(
        public readonly object: any,
        public readonly schema: z.ZodType<any, any, any>,
        public readonly error: z.ZodError,
        public readonly source: "user" | "server",
    ) {
        super(`Could not parse ${JSON.stringify(object)} with error ${JSON.stringify(error)}`);
        this.name = "TypeCheckException";
    }

    toResponse(): Response {
        const status = this.source === "user" ? 400 : 500;
        return new Response(
            JSON.stringify({
                message: this.message,
                status,
            }),
            {
                status
            }
        );
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseOrThrow<Z extends z.ZodType<any, any, any>>(e: Z, object: any, source: 'user' | 'server' = 'user'): z.infer<Z> {
    const result = e.safeParse(object);
    if (!result.success) {
        throw new TypeCheckException(object, e, result.error, source);
    }
    return result.data;
}
