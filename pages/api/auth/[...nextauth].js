import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { validateUser } from '../../../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const user = await validateUser({
            email: credentials.email,
            password: credentials.password,
          });

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              hasTwilioAccount: user.hasTwilioAccount,
              isFirstLogin: user.isFirstLogin
            };
          }

          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.hasTwilioAccount = user.hasTwilioAccount;
        token.isFirstLogin = user.isFirstLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.hasTwilioAccount = token.hasTwilioAccount;
        session.user.isFirstLogin = token.isFirstLogin;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours - match session maxAge
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
