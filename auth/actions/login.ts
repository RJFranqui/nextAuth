"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
export const login = async (values: z.infer<typeof LoginSchema>) => { // server action instead of api route
    const validatedFields = LoginSchema.safeParse(values); // validate client input 

    if(!validatedFields.success){
        return {error: "invalid field"}
    }
    return { success: "email sent"}
};