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
    <div className="bg-black rounded-2xl flex p-4 m-3">
      <h1 className="text-green-500">{title}</h1>
      <h1 className="text-green-500">{artist}</h1>
      <input
        onChange={(evt) => changePercentages(evt.target.value)}
        type="number"
        placeholder={defaultValue}
      ></input>
    </div>
  );
}