import dbConnect from "@/config/database";
import User, { ISubscription } from "@/models/User";
import createHttpError from "http-errors";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import { PROVIDERS } from "./../../../lib/constants";
import { oAuthReg } from "./../../../models/User";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      email?: string;
      name?: string;
      avatar?: string;
      subscription: ISubscription;
      isTopG: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        await dbConnect();
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await User.findOne({ email });
        if (!user) {
          throw new createHttpError.NotFound("Invalid Credentials");
          // return null;
        }
        if (!user.canLogin()) {
          throw new createHttpError.Forbidden("User not verified");
          // throw new Error("User not verified");
          // return null;
        }
        if (user.authenticate(password)) {
          return user;
        } else {
          throw new createHttpError.NotFound("Invalid Credentials");
          // throw null;
        }
        // const res = await fetch(process.env.NEXTAUTH_URL!, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ email, password }),
        // });
        // const user = await res.json();
        // if (res.ok && user) {
        //   return user;
        //   // return Promise.resolve(user);
        // } else {
        //   return null;
        // }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   console.log("---------------------------------");
    //   console.log(url);
    //   console.log(baseUrl);
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   else if (new URL(url).origin === baseUrl) return url;
    //   else return baseUrl;
    // },
    async signIn({ user, account }) {
      if (account?.provider !== PROVIDERS.CREDENTIALS) {
        await dbConnect();
        // Look for better way
        // await User.oAuthReg({ user, account });
        await oAuthReg({ user, account });
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.avatar = token.avatar as string;
        session.user.subscription = token.subscription as ISubscription;
        session.user.isTopG = token.isTopG as boolean;
      }
      return session;
    },
    // async jwt({ token, user, account, profile }) {
    async jwt({ token }) {
      // Overwriding the Google's id with our ID
      await dbConnect();
      const user = await User.findOne({ email: token.email });
      if (user.provider !== PROVIDERS.CREDENTIALS) {
        token.sub = user.id;
        token.avatar = user.avatar;
      }

      token.subscription = user.subscription as ISubscription;
      token.isTopG = user.isTopG;
      return token;
    },
  },
};

export default NextAuth(authOptions);
