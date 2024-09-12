import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";


 
export const { 
    auth,
    signIn,
    signOut,
    handlers:{GET,POST,}

 } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt"}, // use this instead of prisma session because prisma doesnt work on the edge
    ...authConfig,
})