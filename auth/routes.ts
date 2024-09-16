//routes available to not logged in users 
//type of string[]
export const publicRoutes = [
    "/"
];

//routes used for authentication
//reroutes users to /settings
//type of string[]
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error"

];


//prefix for api auth. routes
//routes that start with this prefix are used for api authentificaion purposes 
//type of string
export const apiAuthPrefix = "/api/auth";


//Default login redirect
//type of string
export const DEFAULT_LOGIN_REDIRECT = "/settings";

