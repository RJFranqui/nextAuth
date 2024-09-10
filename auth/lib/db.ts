import { PrismaClient } from "@prisma/client";

declare global { //for next JS hot reload ( wont spawn lots of prisma clients while in development)
    var prisma: PrismaClient | undefined;


}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;