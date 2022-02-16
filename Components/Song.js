import { useEffect, useState } from "react";
import styles from "../styles/song.module.css";
export default function playlist(props, defaultPercent) {
  const title = props.title;
  const artist = props.artist;
  const defaultValue = props.defaultPercent;

  function changePercentages(values){
    console.log(props.defaultPercent);
    props.setPercentages(props.id, values)
  }

  useEffect(() => {
    changePercentages(0);
  })


  return (
    <div id={styles.container}>
      <h1 id={styles.title}>{title}</h1>
      <h1 id={styles.artist}>{artist}</h1>
      <input onChange={evt => changePercentages(evt.target.value)} type='number' placeholder={defaultValue}></input>
    </div>
  );
}
