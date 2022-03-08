import { useRouter } from "next/router";
export default function playlist(props) {
  //get information passed by playlistlist page
  const title = props.title;
  const image = props.image;
  //used for redirecting
  const router = useRouter();

  //function called on click to redirect
  function redirect() {
    //set playlist id in session storage
    sessionStorage.setItem("playlistId", props.spotId);
    //push the redirect
    router.push({ pathname: "/PlaylistCustomizer" });
  }

  //this is what the page displays
  return (
    <a
      onClick={redirect}
      className="bg-darkGrey rounded-xl flex flex-col w-52 p-4 m-4 h-fit cursor-pointer hover:bg-slate-900 aspect-square"
    >
      <img
        src={image}
        width="100"
        className="aspect-square rounded-md w-full"
      />
      <h1 className="w-fit text-white select-none">{title}</h1>
    </a>
  );
}
