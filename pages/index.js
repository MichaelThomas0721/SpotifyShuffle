import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  //Function to get the elements if or if not signed in
  function getSigned() {
    //if signed in it will return the following
    if (session) {
      return (
        <div className="h-fit absolute top-1/3 -translate-y-1/2 w-fit left-1/2 -translate-x-1/2 text-center p-3">
          <p className="text-green-500 text-xl">
            Signed in as {session?.token?.email} <br />
          </p>
          <button
            className="rounded bg-green-500 text-white font-bold w-fit h-fit mb-10 mt-2 p-3 m-auto align-middle hover:bg-green-600"
            onClick={() => signOut()}
          >
            Sign out
          </button>{" "}
          <br />
          <a
            className="rounded bg-green-500 text-white font-bold w-fit h-fit mt-3 p-3 pl-6 pr-6 m-auto align-middle hover:bg-green-600"
            href="/PlaylistList"
          >
            See Playlists
          </a>
        </div>
      );
    }
    //if not signed in it will return the following
    return (
      <div className="h-fit absolute top-1/3 -translate-y-1/2 w-fit left-1/2 -translate-x-1/2 text-center p-3">
        <p className="text-green-500 text-xl">
          Not signed in <br />
        </p>
        <button
          className="rounded bg-green-500 text-white font-bold w-fit h-fit mt-3 p-3 pl-6 pr-6 m-auto align-middle hover:bg-green-600"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  //This is what the page displays, the function above is included and what is returned is displayed here
  return (
    <div>
      <h1 className="text-white text-center text-5xl">Bashify</h1>
      {getSigned()}
    </div>
  );
}
