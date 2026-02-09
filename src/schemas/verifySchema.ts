import { z } from "zod";

export const varifySchema = z.object({
    code: z.string().length(6, "verification code must be atleast 6 digits"),
})