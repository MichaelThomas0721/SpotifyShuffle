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
    <a onClick={redirect} className="bg-black text-green-400 self-auto rounded flex flex-wrap flex-row w-1/3 mr-auto ml-auto p-4 m-4 h-fit">
      <img src={image} width="100" className="aspect-square"/>
      <h1 className="w-fit text-green-500 text-3xl">{title}</h1>
    </a>
  );
}
