import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/db/index'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const student = await db.student.findUnique({
          where: { email: credentials.email, password: credentials.password }
        });

        if (student) {
          return {
            id: student.id.toString(),
            email: student.email,
            role: student.role || "student",
          };
        }

        const admin = await db.admin.findUnique({
          where: { email: credentials.email, password: credentials.password }
        })

        if (admin) {
          return {
            id: admin.id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role || "admin",
          };
        }

        const teacher = await db.teacher.findUnique({
          where: { email: credentials.email, password: credentials.password }
        })

        if (teacher) {
          return {
            id: teacher.id.toString(),
            name: teacher.name,
            email: teacher.email,
            initial: teacher.initial,
            role: teacher.role || 'teacher',
          }
        }

        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        console.log(user)
        token.name = user.name;
        token.role = user.role;
        token.initial = user.initial
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session?.user) {
        session.user.name = token.name;
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.initial = token.initial;
      }
      return session;
    },
  },
};
