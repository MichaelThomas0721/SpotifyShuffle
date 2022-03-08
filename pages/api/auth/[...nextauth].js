import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

//Script used for spotify login and storing login data to session
export default NextAuth({
  //This is where the scope and client id and client secret are kept (you can't see the client id and secret because they are in a .env.local file so the are protected)
  providers: [
    SpotifyProvider({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    async session(session, user) {
      session.user = user;
      return session;
    },
  },
});
