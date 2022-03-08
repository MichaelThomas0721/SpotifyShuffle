import React, { useEffect, useState } from "react";
import styles from "../styles/playlistlist.module.css";
import Playlist from "../Components/Playlist";

export default function PlaylistList() {
  //State for list of playlists
  const [list, setList] = useState([]);

  //call function on page load
  useEffect(() => {
    //function to get list of playlists and map them
    async function fetchData() {
      //post request information
      try {
        const res = await fetch("/api/playlists");
        const { items } = await res.json();
        //map information
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
    //call the function on load
    fetchData();
  }, []);

//this is what the page displays
  return (
    <div className="p-6">
      <h1 className="text-white font-bold pb-5 text-center text-5xl">Playlists</h1>
      <div className="flex-wrap items-start flex justify-center">{list}</div>
    </div>
  );
}
