import styles from "../styles/playlist.module.css";
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
    <a onClick={redirect} id={styles.casing}>
      <img src={image} width="100" id={styles.image} />
      <h1 id={styles.title}>{title}</h1>
    </a>
  );
}
