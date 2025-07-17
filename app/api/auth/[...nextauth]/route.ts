import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/lib/supabase"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Create or update user in Supabase
        if (account?.accessToken) {
          // Check if user exists by email
          const { data: { user: existingUser } } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // Create new user
            const { error } = await supabase
              .from('users')
              .insert({
                id: user.id.toString(),
                email: user.email,
                full_name: user.name,
                avatar_url: user.image,
              })

            if (error) {
              console.error('Error creating user:', error)
              return false
            }
          }

          return true
        }
        return false
      } catch (error) {
        console.error('Signin error:', error)
        return false
      }
    },
    async session({ session, token }) {
      // Add user data to session
      if (session.user) {
        session.user.id = token.sub.toString()
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }