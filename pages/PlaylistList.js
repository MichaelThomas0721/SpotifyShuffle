import React, { useEffect, useState } from "react";
import styles from "../styles/playlistlist.module.css";
import Playlist from "../Components/Playlist";

export default function PlaylistList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/playlists");
        const { items } = await res.json();
        setList(
          items.map((item) => {
            return (
              <Playlist
                title={item.name}
                image={item.images[0]?.url}
                spotId={item.id}
                key={item.id}
              />
            );
          })
        );
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, []);

  return (
    <div w-fit m-auto>
      <h1 className="text-green-500 text-center text-5xl">Playlists</h1>
      {list}
    </div>
  );
}
