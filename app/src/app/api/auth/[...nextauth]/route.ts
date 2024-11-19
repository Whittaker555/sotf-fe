import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from 'next-auth/providers/spotify';
import { getSecretValue } from "@/app/secrets/secrets";

const secrets = await getSecretValue('sotf-fe');

console.log(secrets.NEXTAUTH_SECRET);
const options: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            authorization:
                'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public',
            clientId: secrets.SPOTIFY_CLIENT_ID,
            clientSecret: secrets.SPOTIFY_CLIENT_SECRET,
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
    secret: await secrets.NEXTAUTH_SECRET,
}


const handler = NextAuth(options);


export { handler as GET, handler as POST };