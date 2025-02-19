import z from "zod"

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})
export const registerSchema = z.object({
    username:z.string().min(3 , {
        message: "Username should be at least 3 characters long"
    }),
    email: z.string().email(),
    password: z.string().min(6 , {
        message: "Password should be at least 6 characters long"
    }),
})