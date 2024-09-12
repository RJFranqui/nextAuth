import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "./data/user";
 
export default { 
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);
                
                if(validatedFields.success){
                    const { email, password} = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if(!user || !user.password) return null; //if they login with google/ github because no required password

                    const passwordMatch = await bcrypt.compare(//compares hash
                        password,
                        user.password
                    );

                    if(passwordMatch) return user;
                }
                return null;
            }
        })
    ] 
} satisfies NextAuthConfig