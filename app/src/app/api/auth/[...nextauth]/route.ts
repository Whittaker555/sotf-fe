import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from 'next-auth/providers/spotify';
import { getSecretValue } from "@/app/secrets/secrets";

const options: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            authorization:
                'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public',
            clientId: await getSecretValue('SPOTIFY_CLIENT_ID'),
            clientSecret: await getSecretValue('SPOTIFY_CLIENT_SECRET'),
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if(account){
                token.access_token = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                token
            };
        },
    },
    secret: await getSecretValue('NEXTAUTH_SECRET'),
}


const handler = NextAuth(options);


export { handler as GET, handler as POST };