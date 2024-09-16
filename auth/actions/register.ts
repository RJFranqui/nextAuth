"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
export const register = async (values: z.infer<typeof RegisterSchema>) => { // server action instead of api route
    const validatedFields = RegisterSchema.safeParse(values); // validate client input 

    if(!validatedFields.success){
        return {error: "invalid field"}
    }

    const {email, password, name} = validatedFields.data;

    const hashPassword = await bcrypt.hash(password,10); // hashes the password and ads 10 dig of salt

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return {
            error: "Email already in use",
        }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashPassword
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    );

    return { success: "Confirmation Email Sent"}
};