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

  async function generatePlaylist() {
    let total = desiredTime.current;
    let songList = [];
    let sorted = new Map(
      [...percentages.current.entries()].sort((a, b) => b[1] - a[1])
    );
    let keyArr = Array.from(sorted.keys());
    for (let i = 0; total > 0 && i <= keyArr.length; i++) {
      if (sorted.get(keyArr[i]) >= Math.random() * 100) {
        songList.push(keyArr[i]);
        total -= durations.current.get(keyArr[i]);
      }
    }

    while (total > 0 && songList.length > 0) {
      let rand = keyArr[Math.floor(Math.random() * keyArr.length)];
      songList.push(rand);
      total -= durations.current.get(rand);
    }

    songList = songList
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    let userId = await fetchUserId();
    let playlistDetails = await createEmptyPlaylist(userId.id);
    addSongs(playlistDetails.id, songList);
  }

  async function fetchUserId() {
    try {
      const res = await fetch("/api/user");
      const item = await res.json();
      console.log(item);
      return item;
    } catch (e) {
      console.log(e);
    }
  }

  async function createEmptyPlaylist(userId) {
    try {
      const res = await fetch("/api/createPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });
      const item = await res.json();
      return item;
    } catch (e) {
      console.log(e);
    }
  }

  async function addSongs(playlistId, songlist) {
    let uriInfo = [];
    for (let song in songlist) {
      uriInfo.push("spotify:track:" + songlist[song]);
    }
    try {
      const res = await fetch("/api/fillPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: playlistId, data: uriInfo }),
      });
      const item = await res.json();
      return item;
    } catch (e) {
      console.log(e);
    }
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

    desiredTime.current =
      (hours.current * 60 + parseInt(minutes.current)) * 60000;
    updateDefaultPercent(desiredTime.current);
  }

  function updateDefaultPercent(desiredTime) {
    setDefaultValue(
      ((desiredTime / (songTime.current / totalSongs.current)) * 100) /
        totalSongs.current
    );
  }

  useEffect(() => {
    fetchSongs();
  }, []);
  async function fetchSongs() {
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlistId: sessionStorage.getItem("playlistId"),
        }),
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
      <div className="flex flex-wrap flex-row">
              {list}
      </div>

    </div>
  );
}
