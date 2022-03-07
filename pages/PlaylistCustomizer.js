import styles from "../styles/playlistcustomizer.module.css";
import React, { createContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Song from "../Components/Song";

export default function PlaylistList() {
  const [list, setList] = useState([]);
  const hours = useRef(0);
  const minutes = useRef(0);
  const desiredTime = useRef(0);
  const songTime = useRef(0);
  const totalTime = useRef(0);
  const totalSongs = useRef(0);
  const percentages = useRef(new Map());
  const durations = useRef(new Map());
  const [defaultValue, setDefaultValue] = useState(0);
  const router = useRouter();
  //const spotId = sessionStorage.getItem("playlistId");

  function generatePlaylist(){
    let total = desiredTime.current;
    console.log(total / 60000);
    let songList = [];
    let sorted =new Map([...percentages.current.entries()].sort((a, b) => b[1] - a[1]));
    let keyArr = (Array.from(sorted.keys()));
    console.log(keyArr);
    for (let i = 0; total > 0 && i <= keyArr.length; i++){
      if ( sorted.get(keyArr[i]) >= (Math.random() * 100)){
        songList.push(keyArr[i]);
        total -= durations.current.get(keyArr[i]);
      }
    }

    while(total > 0){
      let rand = keyArr[Math.floor(Math.random() * keyArr.length)]
      songList.push(rand)
      total -= durations.current.get(rand);
    }

    console.log("Song List: ");
    console.log(songList);

  }

  function updatePercentages(id, newPercent) {
    percentages.current.set(id, newPercent);
  }

  function getSongTimes(id, moreTime) {
    totalSongs.current = totalSongs.current + 1;
    songTime.current = songTime.current + moreTime;
    durations.current.set(id, moreTime);
  }

  function timeChange(id, value) {
    if (id == 1) {
      hours.current = value;
    } else {
      minutes.current = value;      
    }
    
    desiredTime.current = (hours.current * 60 + parseInt(minutes.current)) * 60000;
    updateDefaultPercent(desiredTime.current);
  }

  function updateDefaultPercent(desiredTime) {
    setDefaultValue(
      ((desiredTime / (songTime.current / totalSongs.current)) * 100) / totalSongs.current
    );
    console.log(defaultValue);
  }

  useEffect(() => {
    console.log(sessionStorage.getItem("playlistId"));
    fetchData();
  }, []);
  async function fetchData() {
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: sessionStorage.getItem("playlistId") }),
      });
      const { items } = await res.json();
      setList(
        items.map((item) => {
          return (
            <Song
              key={item.track.id}
              title={item.track.name}
              artist={item.track.artists[0].name}
              setPercentages={updatePercentages}
              getSongTimes={getSongTimes}
              id={item.track.id}
              defaultPercent={defaultValue}
              duration={item.track.duration_ms}
            />
          );
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div id={styles.container}>
      <h1>Songs</h1>
      <label>Hours</label>
      <input
        type="number"
        min="-1"
        max="1000"
        step="1"
        name="hours"
        id="time_hours"
        onChange={(evt) => timeChange(1, evt.target.value)}
      />
      <label>Minutes</label>
      <input
        type="number"
        min="-1"
        max="60"
        step="1"
        name="minutes"
        id="time_minutes"
        onChange={(evt) => timeChange(2, evt.target.value)}
      />
      <button onClick={() => generatePlaylist()}>Generate Playlist</button>
      {list}
    </div>
  );
}
