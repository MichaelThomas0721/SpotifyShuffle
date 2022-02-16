import styles from "../styles/playlistcustomizer.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Song from "../Components/Song";
import { addBasePath } from "next/dist/shared/lib/router/router";

export default function PlaylistList() {
  const [list, setList] = useState([]);
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [percentages, setPercentages] = useState(new Map());
  const [defaultPercent, setDefaultPercent] = useState();
  const router = useRouter();
  const spotId = router.query.spotId;

  function updatePercentages(id, newPercent) {
    percentages.set(id, newPercent);
    setDefaultPercent(newPercent);
  }

  useEffect(() => {
console.log(defaultPercent);
  }, [defaultPercent])

  useEffect(() => {
      setDefaultPercent(1);
      fetchData();
  },[])
    async function fetchData() {
      try {
        console.log(spotId);
        const res = await fetch("/api/songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistId: spotId }),
        });
        const { items } = await res.json();
        console.log(items);
        setList(
          items.map((item) => {
            return (
              <Song
                title={item.track.name}
                artist={item.track.artists[0].name}
                setPercentages={updatePercentages}
                id={item.track.id}
                defaultPercent={defaultPercent}
                key={item.key}
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
        <input type="number" min="-1" max="1000" step="1" name="hours" id="time_hours"/>
        <label>Minutes</label>
        <input type="number" min="-1" max="60" step="1" name="minutes" id="time_minutes"/>
      {list}
    </div>
  );
}
