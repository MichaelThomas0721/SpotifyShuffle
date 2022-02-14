import React, { useEffect } from "react";
import {useSession, signIn, signOut} from 'next-auth/react';

export default function Index() {
  const {data: session} = useSession();
  console.log(process.env.SPOTIFY_CLIENT_ID);
  if (session) {
    return (
      <>
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}