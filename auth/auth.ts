import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

import { getUserById } from "./data/user";
import authConfig from "./auth.config";
import { db } from "./lib/db";


 
export const { 
    auth,
    signIn,
    signOut,
    handlers:{GET,POST,}

 } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({user}){
            await db.user.update({
                where: {id:user.id},
                data: {emailVerified: new Date()} //used to see who has verified when if we want to make changes later
            })
        }
    },
    callbacks: {
        async signIn({ user, account }){
            //allow Oauth without email verification
            if(account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id);

            if(!existingUser?.emailVerified) return false;//prevent sign in w/out email verification 

            //TODO: add 2fa check
            return true;
        },
        async session({ token, session}){//gets id from token and puts it in the session 
            
            if(token.sub && session.user)
                session.user.id = token.sub;

            if(token.role && session.user){
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({token}) {
            if(!token.sub)
                return token;
            const existingUser = await getUserById(token.sub);

            if(!existingUser)
                return token;

            token.role = existingUser.role;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt"}, // use this instead of prisma session because prisma doesnt work on the edge
    ...authConfig,
})