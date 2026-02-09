import { z } from "zod";

export const messageSchema = z.object({
    content: z
      .string()
      .min(10, {message: "content must be atleast of 10 charecters"})
      .max(300, {message: "content must be no longer then 300 charecters"})
})