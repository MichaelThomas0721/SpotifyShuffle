import { useRouter } from 'next/router';
export default function playlist(props) {
  const title = props.title;
  const image = props.image;
  const router = useRouter();

  function redirect(){
      sessionStorage.setItem('playlistId', props.spotId);
      router.push({pathname: '/PlaylistCustomizer', query: {spotId: props.spotId}});
  }

  return (
    <a onClick={redirect} className="bg-darkGrey rounded-xl flex flex-col w-52 p-4 m-4 h-fit cursor-pointer hover:bg-slate-900 aspect-square">
      <img src={image} width="100" className="aspect-square rounded-md w-full"/>
      <h1 className="w-fit text-white select-none">{title}</h1>
    </a>
  );
}
