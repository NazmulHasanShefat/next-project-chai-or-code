import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
// import { User } from "next-auth";



export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
           const user = await UserModel.findOne({
                $or: [
                    {email: credentials.identifier},
                    {userName: credentials.identifier},
                ]
            })

            if(!user){
                throw new Error("no user found with this email")
            }
            if(!user.isVerifide){
                throw new Error("please verify your acout first before login");
            }
            const isPasswordCurrect = await bcrypt.compare(credentials.password, user.passowrd);
            if(isPasswordCurrect){
                return user
            }else{
                throw new Error("user passord dose not metch");
            }

        } catch (error: any) {
            throw new Error(error)
        }
     }
    }),
  ],
  callbacks: {
      async session({ session, token }) {
        if(token){
            session.user._id = token._id;
            session.user.isVerifide = token.isVerifide;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
            session.user.userName = token.userName;
        }
      return session
    },
    async jwt({ token, user}) {
        if(user){
            token._id = user._id?.toString();
            token.isVerifide = user.isVerifide;
            token.isAcceptingMessage = user.isAcceptingMessage;
            token.userName = user.userName;
        }
        return token
    }
  },
  pages: {
     signIn: '/sign-in',
  },
  session: {
    strategy:"jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,

};
