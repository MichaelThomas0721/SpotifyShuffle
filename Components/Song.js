import { useEffect, useState, useRef, forwardRef } from "react";
import styles from "../styles/song.module.css";
export default function Song(props) {
  const id = props.id;
  const title = props.title;
  const artist = props.artist;
  const defaultValue = props.defaultPercent;
  const getSongTimes = props.getSongTimes;
  const duration = props.duration;

  function changePercentages(value) {
    props.setPercentages(id, value);
  };

  useEffect(() => {
    changePercentages(0);
    getSongTimes(id, duration);
  });

  return (
    <div id={styles.container}>
      <h1 id={styles.title}>{title}</h1>
      <h1 id={styles.artist}>{artist}</h1>
      <input
        onChange={(evt) => changePercentages(evt.target.value)}
        type="number"
        placeholder={defaultValue}
      ></input>
    </div>
  );
}