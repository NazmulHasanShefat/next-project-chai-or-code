import { z } from "zod";

export const UserNameValidation = z
        .string()
        .min(2, "userName must be atleast 2 characters")
        .min(20, "userName must be no more then 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "userName must not contain spacal charecters");


export const signUpSchema = z.object({
    userName: UserNameValidation,
    email: z.string().email({message:"invalid email!"}),
    password: z.string().min(8, {message: "password must be atleast 8 charecters required!"})
})