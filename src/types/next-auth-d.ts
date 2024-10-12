import  "next-auth";
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";


declare  module 'next-auth'{
    interface Session{
        user: DefaultSession['user']
        expires:DefaultSession['expires']
        accessToken?:string
    }
     
    
}

declare module 'next-auth/jwt'{

interface JWT extends DefaultJWT{
    accessToken?:string
}
}